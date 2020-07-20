const extensionId = chrome.runtime.id

// inject extension id and tab id
let idScript = document.createElement('script')
idScript.setAttribute('type', 'text/javascript')
idScript.innerText = `
	const extensionId = '${extensionId}'`
document.head.appendChild(idScript)

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

// chrome.runtime.onMessageExternal.addListener(
//   (request, sender, sendResponse) => {
//     console.log(sender.tab ?
//       "from a content script:" + sender.tab.url :
//       "from the extension")

//     if (request.message === 'cast-update') {
//       castingActive = request.casting
//       sendResponse({ result: 'updated cast state', casting: castingActive })
//     }
//     else if (request.message === 'cast-query')
//       sendResponse({ result: 'checked cast state', casting: castingActive })
//   }
// )