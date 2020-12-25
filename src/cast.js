let appId = 'E3F46EBD'
let audioTrack = null
let captionTrack = null
let lastCaptionTrack = null

// Cast API window callback
window['__onGCastApiAvailable'] = isAvailable => {
  console.log('Google Cast is available')
  if (isAvailable)
    initializeCastApi()
}

// add script element for Cast API
const injectedCast = document.createElement('script')
injectedCast.type = 'text/javascript'
injectedCast.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1'
document.body.appendChild(injectedCast)

const initializeCastApi = () => {
  cast.framework.CastContext.getInstance().setOptions({
    receiverApplicationId: appId,
    autoJoinPolicy: chrome.cast.AutoJoinPolicy.PAGE_SCOPED,
    androidReceiverCompatible: true
  })

  launcher = document.createElement('google-cast-launcher')
  const playerRight = document.getElementsByClassName('downstairs')[0]
  playerRight.appendChild(launcher)

  remotePlayer = new cast.framework.RemotePlayer()
  remotePlayerController = new cast.framework.RemotePlayerController(remotePlayer)
  remotePlayerController.addEventListener(cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED, event => {
    if (remotePlayer.isConnected) {
      let shouldUpdate = true

      chrome.runtime.sendMessage(extensionId, { message: 'cast-query', streamUrl: streamUrl }, response => {
        shouldUpdate = response.canCast && response.isNewStreamUrl

        if (shouldUpdate) {
          // pause local player
          playOrPause()
  
          // update cast
          safeChangeCast()
        }
      })
    }
    else {
      isCasting = false
      localPlayer.currentTime = remotePlayerTime
      playOrPause()

      // hackiness to get around connection change toggle after computer resumes from sleep
      // toggle takes roughly 500ms, using 1000ms to be safe
      setTimeout(() => {
        if (!remotePlayer.isConnected) {
          console.log('unsetting cast tab')
          chrome.runtime.sendMessage(extensionId, { message: 'cast-update', streamUrl: null }, response => console.log('casting update', response.casting))
        }
        else {
          playOrPause()
          // localPlayer.currentTime = remotePlayerTime
          isCasting = true
        }
      }, 1000)
    }
  })
  
  console.log('cast api initialized')
  console.log('is live:', isLive)
  console.log('stream url', streamUrl)
}

const connectCastPlayer = async () => {
  console.log('loading media')
  castSession = cast.framework.CastContext.getInstance().getCurrentSession()

  // pull stream url from DOM if it's there
  let streamUrlElement = document.querySelector('[data-channel-stream-url]')
  if (streamUrlElement)
    streamUrl = streamUrlElement.getAttribute('data-channel-stream-url')

  console.log('stream url', streamUrl)
  let mediaInfo = new chrome.cast.media.MediaInfo(streamUrl, 'application/x-mpegURL')
  mediaInfo.streamType = isLive ? chrome.cast.media.StreamType.LIVE : chrome.cast.media.StreamType.BUFFERED
  mediaInfo.duration = isLive ? null : localPlayer.duration
  mediaInfo.metadata = {
    metaDataType: 0,
    title: title,
    subtitle: subtitle,
    releaseDate: mediaDate
  }

  mediaInfo.customData = document.cookie
  let request = new chrome.cast.media.LoadRequest(mediaInfo)
  if (castSession) {
    request.currentTime = castSession.getMediaSession() ? remotePlayerTime : localPlayer.currentTime
  
    castSession.loadMedia(request)
      .then(() => {
        console.log('Media loaded')

        castSession.getMediaSession().addUpdateListener(isAlive => {
          if (isAlive)
            remotePlayerTime = castSession.getMediaSession().getEstimatedTime()
        })

        isCasting = true
        chrome.runtime.sendMessage(extensionId, { message: 'cast-update', streamUrl: streamUrl }, response => console.log('casting', response.casting))
      }, 
      errorCode => {
        console.log(`Cast error loading media: ${errorCode}`)
      })
  }
}

document.addEventListener('stream-load', ({ detail: url }) => {
  console.log('loaded stream tokenized url', url)
  streamUrl = url

  safeChangeCast()
})

function safeChangeCast() {
  let mediaUrl = streamUrl.split('?')[0]
  chrome.runtime.sendMessage(extensionId, { message: 'cast-query', streamUrl: mediaUrl }, response => {
    console.log('cast query result', response)
    if (response.canCast && response.isNewStreamUrl) {
      connectCastPlayer()
      console.log('updating cast')
    }
    else {
      console.log('not updating cast')
    }
  })
}

function stopCasting(stopReceiver) {
  console.log('stop casting called')
  var castSession = cast.framework.CastContext.getInstance().getCurrentSession()
  castSession.endSession(stopReceiver)
}

function updateAudioTrack(trackName) {
  updateTrack(trackName, 'AUDIO')
}

function updateCaptionTrack(trackName) {
  updateTrack(trackName, 'TEXT')
}

function updateTrack(trackName, type) {
  let session = castSession.getMediaSession()
  let { media } = session

  let newTrack = media.tracks
    .filter(t => t.type === type)
    .find(t => t.name === trackName)

  console.log('new track', newTrack)
  
  if (type === 'AUDIO')
    audioTrack = newTrack.trackId
  else if (type === 'TEXT') {
    captionTrack = newTrack.trackId
    lastCaptionTrack = captionTrack
  }

  updateTracks(session)
}

function updateTracks(session) {
  let { media } = session
  let trackSet = []

  // use old audio track if audio track is null
  if (!audioTrack) {
    let oldAudioTracks = session.activeTrackIds
      .map(id => media.tracks.find(t => t.trackId == id))
      .filter(t => t.type === 'AUDIO')
    
    if (oldAudioTracks && oldAudioTracks.length > 0)
      audioTrack = oldAudioTracks[0].trackId
  }

  // use old caption track if caption track is null
  if (!captionTrack) {
    let oldCaptionTracks = session.activeTrackIds
      .map(id => media.tracks.find(t => t.trackId == id))
      .filter(t => t.type === 'TEXT')
    
    if (oldCaptionTracks && oldCaptionTracks.length > 0)
      captionTrack = oldCaptionTracks[0].trackId
  }

  if (audioTrack)
    trackSet.push(audioTrack)
  if (captionTrack && closedCaptionsEnabled)
    trackSet.push(captionTrack)

  console.log('track set', trackSet)

  let tracksInfoRequest = new chrome.cast.media.EditTracksInfoRequest(trackSet)
  session
    .editTracksInfo(
      tracksInfoRequest,
      () => console.log('updated tracks'),
      (error) => console.log('error updating tracks', error)
    )
}

const stopListener = () => {
  localPlayer.currentTime = remotePlayerTime
  castSession.removeUpdateListener(this)
}