const extensionId = 'bndmmpkkilmcaoddlicjenjffkihmmle'
let castingTab = null
let streamUrl = null

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