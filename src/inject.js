const injectScript = source => {
	const script = document.createElement('script')
	script.setAttribute('type', 'text/javascript')
	script.setAttribute('src', source)
	document.body.appendChild(script)
}

injectScript(chrome.runtime.getURL('src/startup.js'))

const injectScripts = () => {
	// inject playback controls
	injectScript(chrome.runtime.getURL('src/controls.js'))

	// inject Cast API
	injectScript(chrome.runtime.getURL('src/cast.js'))
}

// observer callback that finds the video element
const videoFinder = (mutations, observer) => {
	for (let mutation of mutations)
		if (mutation.target.id === 'playerComponentContainer') {
			player = document.querySelector('video')
			if (player) {
				observer.disconnect()

				// inject scripts once video player has loaded
				injectScripts()
				break
			}
		}
}

const observer = new MutationObserver(videoFinder)
observer.observe(document.getElementById('root'), { attributes: false, childList: true, subtree: true })