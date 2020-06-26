let launcher = null
let castSession = null
let remotePlayer = null
let remotePlayerController = null

const initializeCastApi = () => {
	cast.framework.CastContext.getInstance().setOptions({
		receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
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
		if (event.value) {
			connectCastPlayer
		}
	})
	
	console.log('cast api initialized')
	// loadMedia()
}

// Cast API
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

const connectCastPlayer = async () => {
	console.log('loading media')
	castSession = cast.framework.CastContext.getInstance().getCurrentSession()
	console.log(castSession)
	if (!castSession)
		return

	let mediaInfo = new chrome.cast.media.MediaInfo(player.src)
	let request = new chrome.cast.media.LoadRequest(mediaInfo)
	
	try {
		await castSession.loadMedia(request)
		console.log('Cast loaded media')
	}
	catch (errorCode) {
		console.error(`Cast error loading media: ${errorCode}`)
	}
}