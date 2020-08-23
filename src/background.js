let ports = {}
let streamUrl = null
let castingTab = null

browser.runtime.onMessageExternal.addListener(
  (request, sender, sendResponse) => {
    let tab = sender.tab

    if (request.message === 'cast-update') {
      console.log('setting cast tab', tab)
      streamUrl = request.streamUrl
      castingTab = { id: tab.id, windowId: tab.windowId }

      return new Promise(resolve => resolve({ casting: request.streamUrl !== null, url: request.streamUrl }))
    }
    else if (request.message === 'cast-query') {
      let response = {
        casting: castingTab !== null,
        canCast: !castingTab || (castingTab.id === tab.id && castingTab.windowId === tab.windowId)
      }

      if (request.streamUrl)
        response.isNewStreamUrl = streamUrl !== request.streamUrl
      
      return new Promise(resolve => resolve(response))
    }
  }
)

browser.runtime.onConnect.addListener(port => {
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

    if (castingTab && tab.id === castingTab.id) {
      console.log('unsetting stream url and casting tab')
      streamUrl = null
      castingTab = null
    }
  })
})