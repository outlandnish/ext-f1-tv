// constants
const seekSmall = 5							// 5 second jump on left / right arrows
const seekLarge = 10						// 10 second jump on 'j'/ 'l' keys
const volumeChange = 0.05				// 5% volume bump up / down

// add playing check to video element
Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
	get: function(){
			return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
	}
})

// video element in the DOM
localPlayer = document.querySelector('video')

// more reliable to click this button instead of play / pause on the localPlayer
const playPauseButton = document.getElementsByClassName('button play-pause-button')[0]

window.addEventListener('keydown', event => {
  if (event.key === ' ')
    playOrPause()
  else if (event.key === 'm')
    muteOrUnmute()
  else if (event.key === 'j')
    seekDelta(-seekLarge)
  else if (event.key === 'l')
    seekDelta(seekLarge)
  else if (event.key === 'ArrowRight')
    seekDelta(seekSmall)
  else if (event.key === 'ArrowLeft')
    seekDelta(-seekSmall)
  else if (event.key === '+' || event.key === '=')
    incrementVolume(volumeChange)
  else if (event.key === '-' || event.key === '_')
    incrementVolume(-volumeChange)
  else if (event.key === 'f') {
    if (localPlayer.requestFullscreen) {
      localPlayer.requestFullscreen();
    } else if (localPlayer.mozRequestFullScreen) {
      localPlayer.mozRequestFullScreen();
    } else if (localPlayer.webkitRequestFullscreen) {
      localPlayer.webkitRequestFullscreen();
    } else if (localPlayer.msRequestFullscreen) { 
      localPlayer.msRequestFullscreen();
    }
  }
  else if (event.key >= '1' && event.key <= '9') {
    let percentage = parseInt(event.key) / 10
    seekTo(percentage * localPlayer.duration)
  }
  else if (event.key === 'Home')
    seekTo(0)
  else if (event.key === 'End')
    seekTo(localPlayer.duration)
})

function playOrPause() {
  if (isCasting)
    remotePlayerController.playOrPause()
  else
    playPauseButton.click()
}

function seekDelta(delta) {
  if (isCasting) {
    remotePlayer.currentTime += delta
    remotePlayerController.seek()
  }
  else
    localPlayer.currentTime += delta
}

function seekTo(where) {
  if (isCasting) {
    remotePlayer.currentTime = where
    remotePlayerController.seek()
  }
  else
    localPlayer.currentTime = where
}

function incrementVolume(delta) {
  setVolume(remotePlayer.volumeLevel + delta)
}

function setVolume(level) {
  if (isCasting) {
    remotePlayer.volumeLevel = level
    remotePlayerController.setVolumeLevel()
  }
  else
    localPlayer.volume = Math.min(1.0, Math.max(level, 1.0))
}

function muteOrUnmute() {
  if (isCasting)
    remotePlayerController.muteOrUnmute()
  else
    localPlayer.muted = !localPlayer.muted
}

localPlayer.addEventListener('timeupdate', event => {
  if (isCasting) {
    if (localPlayer.playing)
      playPauseButton.click()
    
    seekTo(localPlayer.currentTime)
  }
})

const audioTrackSelectListener = (event) => {
  let element = event.target

  if (isCasting) {    
    let trackName = element.innerText
    updateAudioTrack(trackName)
  }
}

const videoObserver = (mutations, observer) => {
	for (let mutation of mutations) {
    // watch for clicks on the differnt audio tracks
		if (mutation.addedNodes && mutation.addedNodes.length > 0 && mutation.addedNodes[0].className === 'audio-track') {
      let node = mutation.addedNodes[0]
      node.addEventListener('click', audioTrackSelectListener)
    }

    // watch for closed captioning toggles
    else if (mutation.target.className.indexOf('controlbar-container 0') >= 0) {
      let radio = document.querySelector('[name=ccOn]')
      let trackName = document.querySelector('select').value

      // only if toggle has changed / track has changed
      if (radio && (closedCaptionsEnabled !== !radio.checked || (lastCaptionTrack !== captionTrack) && closedCaptionsEnabled)) {
        closedCaptionsEnabled = !radio.checked
        console.log('update close captions', closedCaptionsEnabled)

        if (isCasting) {
          updateCaptionTrack(trackName)
        }
      }
    }
  }
}

const observer = new MutationObserver(videoObserver)
observer.observe(document.getElementById('html5-player'), { attributes: false, childList: true, subtree: true })

console.log('Loaded F1 Playback Controls')