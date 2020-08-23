const extensionId = browser.runtime.id
let player = null

const injectScript = (script, addToHead = false) => {
  const scriptElement = document.createElement('script')
  scriptElement.setAttribute('type', 'text/javascript')
  scriptElement.innerText = script

  if (addToHead)
    document.head.appendChild(scriptElement)
  else
    document.body.appendChild(scriptElement)
}

const injectScriptSource = source => {
  const script = document.createElement('script')
  script.setAttribute('type', 'text/javascript')
  script.setAttribute('src', source)
  document.body.appendChild(script)
}

// inject extension id and tab id
let idScript = `const extensionId = '${extensionId}'`
injectScript(idScript)

injectScriptSource(browser.runtime.getURL('src/startup.js'))

const injectScripts = () => {
  // inject playback controls
  injectScriptSource(browser.runtime.getURL('src/controls.js'))

  // inject Cast API
  injectScriptSource(browser.runtime.getURL('src/cast.js'))
}

// listens for the custom sync attribute to be updated on the video player
// workaround to communicate from the tab sandbox to the extension isolated world
const syncChecker = (mutations, observer) => {
  for (let mutation of mutations)
    if (mutation.type === 'attributes' && mutation.attributeName === 'sync')
      syncUp()
}

// observer callback that finds the video element
const videoFinder = (mutations, observer) => {
  for (let mutation of mutations)
    if (mutation.target.id === 'playerComponentContainer') {
      player = document.querySelector('video')
      if (player) {
        observer.disconnect()

        observer = new MutationObserver(syncChecker)
        observer.observe(player, { attributes: true, childList: false, subtree: false })

        // inject scripts once video player has loaded
        injectScripts()

        connectPort()
        break
      }
    }
}

let observer = new MutationObserver(videoFinder)
observer.observe(document.getElementById('root'), { attributes: false, childList: true, subtree: true })

function getURLPath() {
  return window.location.href.split('?')[0]
}

function connectPort() {
  port = browser.runtime.connect(extensionId, { name: getURLPath() })
  port.onMessage.addListener(message => {
    console.log('message received', message)
    if (message.sync) {
      // workaround to execute in tab context
      let seekScript = `seekTo(${message.sync})`
      injectScript(seekScript)
    }
  })
}

function syncUp() {
  console.log('send sync request')
  if (port) port.postMessage({ sync: player.currentTime })
}