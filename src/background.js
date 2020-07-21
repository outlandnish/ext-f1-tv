const extensionId = 'bndmmpkkilmcaoddlicjenjffkihmmle'
let ports = {}
let streamUrl = null
let castingTab = null

// reset casting tab on first startup in case of browser crash

chrome.runtime.onMessageExternal.addListener(
  (request, sender, sendResponse) => {
    let tab = sender.tab

    if (request.message === 'cast-update') {
      console.log('setting cast tab', tab)
      streamUrl = request.streamUrl
      castingTab = { id: tab.id, windowId: tab.windowId }
      sendResponse({ casting: request.streamUrl !== null, url: request.streamUrl })
    }
    else if (request.message === 'cast-query') {
      let response = {
        casting: castingTab !== null,
        canCast: !castingTab || (castingTab.id === tab.id && castingTab.windowId === tab.windowId)
      }

      if (request.streamUrl)
        response.isNewStreamUrl = streamUrl !== request.streamUrl
      
      sendResponse(response)
    }
  }
)

chrome.runtime.onConnectExternal.addListener(port => {
  console.log('port created', port)
  if (!ports[port.name]) ports[port.name] = []
  ports[port.name].push(port)

  // sending sync messages
  port.onMessage.addListener(message => {
    if (message.sync)
      ports[port.name].filter(p => p !== port).forEach(p => p.postMessage(message))
  })

  port.onDisconnect.addListener(event => {
    console.log('disconnect', event)
    let tab = event.sender.tab
    let index = ports[port.name].indexOf(port)
    ports[port.name].splice(index, 1)

    // unset casting tab if it is closed
    chrome.storage.local.get(['castingTab'], result => {
      if (result.castingTab)
        if (tab.id === result.castingTab.id && tab.windowId === result.castingTab.windowId) {
          console.log('unsetting stream url and casting tab')
          streamUrl = null
          castingTab = null
        }
    })
  })
})