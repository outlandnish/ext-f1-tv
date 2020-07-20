const extensionId = 'bndmmpkkilmcaoddlicjenjffkihmmle'
let castingTab = null
let streamUrl = null
let ports = {}

chrome.runtime.onMessageExternal.addListener(
  (request, sender, sendResponse) => {
    let tab = sender.tab

    if (request.message === 'cast-update') {
      castingTab = request.streamUrl ? tab : null
      streamUrl = request.streamUrl ? request.streamUrl : null
      sendResponse({ casting: streamUrl !== null, url: streamUrl })
    }
    else if (request.message === 'cast-query') {
      console.log('cast query', castingTab, sender)
      let response = {
        casting: castingTab !== null,
        canCast: !castingTab || (castingTab.id === tab.id && castingTab.window === tab.window)
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

  port.onDisconnect.addListener(() => {
    let index = ports[port.name].indexOf(port)
    ports[port.name].splice(index, 1)
  })
})