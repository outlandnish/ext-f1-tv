let launcher = null
let castSession = null
let remotePlayer = null
let remotePlayerController = null
let appId = 'E3F46EBD'

// Cast API window callback
window['__onGCastApiAvailable'] = isAvailable => {
	console.log('Google Cast is available')
	if (isAvailable)
		initializeCastApi();
}

// add script element for Cast API
const injectedCast = document.createElement('script')
injectedCast.type = 'text/javascript'
injectedCast.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1'
document.body.appendChild(injectedCast)

const initializeCastApi = () => {
	cast.framework.CastContext.getInstance().setOptions({
		receiverApplicationId: appId,
		autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
	})

	launcher = document.createElement('google-cast-launcher')
	launcher.style.width = '18px'
	launcher.style.marginTop = '9px'
	const playerRight = document.getElementsByClassName('cb-right-items')[0]
	playerRight.appendChild(launcher)

	remotePlayer = new cast.framework.RemotePlayer()
	remotePlayerController = new cast.framework.RemotePlayerController(remotePlayer)
	remotePlayerController.addEventListener(cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED, event => {
		console.log('connection change', event.value)
		if (event.value)
			connectCastPlayer()
	})
	
	console.log('cast api initialized')
	console.log('is live:', isLive)
	console.log('stream url', streamUrl)
}

const connectCastPlayer = async () => {
	console.log('loading media')
	castSession = cast.framework.CastContext.getInstance().getCurrentSession()

	let streamUrlElement = document.querySelector('[data-channel-stream-url]')
	if (streamUrlElement)
		streamUrl = streamUrlElement.getAttribute('data-channel-stream-url')

	console.log('stream url', streamUrl)
	let mediaInfo = new chrome.cast.media.MediaInfo(streamUrl, 'application/x-mpegURL')
	mediaInfo.streamType = isLive ? chrome.cast.media.StreamType.LIVE : chrome.cast.media.StreamType.BUFFERED
	mediaInfo.customData = document.cookie
	let request = new chrome.cast.media.LoadRequest(mediaInfo)
	
	castSession.loadMedia(request)
		.then(() => {}, 
		errorCode => console.log(`Cast error loading media: ${errorCode}`))

	console.log('Cast loaded media')
}

document.addEventListener('stream-load', ({ detail: url }) => {
	streamUrl = url
	console.log('loaded stream tokenized url', currentSource)
})

function toggleCast() {
	remotePlayerController.playOrPause()
}