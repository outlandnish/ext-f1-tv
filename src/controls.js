const player = document.querySelector('video')
const seekSmall = 5							// 5 second jump on left / right arrows
const seekLarge = 10						// 10 second jump on 'j'/ 'l' keys
const volumeChange = 0.05				// 5% volume bump up / down

// extension to video / audio tag to check if playing
// https://stackoverflow.com/questions/8599076/detect-if-html5-video-element-is-playing
Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
	get: function(){
			return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
	}
})

window.addEventListener('keydown', event => {
  if (event.key === ' ')
    player.playing ? player.pause() : player.play()
  else if (event.key === 'm')
    player.muted = !player.muted
  else if (event.key === 'j')
    player.currentTime -= seekLarge
  else if (event.key === 'l')
    player.currentTime += seekLarge
  else if (event.key === 'ArrowRight')
    player.currentTime += seekSmall
  else if (event.key === 'ArrowLeft')
    player.currentTime -= seekSmall
  else if (event.key === '+' || event.key === '=')
    player.volume = Math.min(1.0, player.volume + volumeChange)
  else if (event.key === '-' || event.key === '_')
    player.volume = Math.max(0.0, player.volume - volumeChange)
  else if (event.key === 'f') {
    if (player.requestFullscreen) {
      player.requestFullscreen();
    } else if (player.mozRequestFullScreen) {
      player.mozRequestFullScreen();
    } else if (player.webkitRequestFullscreen) {
      player.webkitRequestFullscreen();
    } else if (player.msRequestFullscreen) { 
      player.msRequestFullscreen();
    }
  }
  else if (event.key >= '1' && event.key <= '9') {
    let percentage = parseInt(event.key) / 10
    player.currentTime = percentage * player.duration
  }
  else if (event.key === 'Home')
    player.currentTime = 0
  else if (event.key === 'End')
    player.currentTime = player.duration
})