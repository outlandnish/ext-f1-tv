// check if the script was loaded with a specific parameter (e.g. loadCastFramework = 1)
function scriptLoadContains(queryString) {
  return !!document.currentScript && (-1 != document.currentScript.src.indexOf("?" + queryString) || -1 != document.currentScript.src.indexOf("&" + queryString))
}

var scriptToLoad = scriptLoadContains('loadGamesSDK') ? '/cast_game_sender.js' : '/cast_sender.js'
var shouldLoadCastFramework = scriptLoadContains('loadCastFramework') || scriptLoadContains('loadCastApplicationFramework')
var extensionIds = ["pkedcjkdefgpdelpbcmbmeomcjbeemfm", "enhhojjnijigcajfphajepfemndkmdlo"]

// process scripts from an array?
function tryLoadScripts(scripts) {
  if (scripts.length > 0)
    loadScript(scripts.shift(), () => { tryLoadScripts(scripts) })
  else
    onCastExtensionNotFound()
}

// returns the user supplied window attached __onGCastApiAvailable function if it exists
function getOnGCastAPIAvailableCallback() {
  return "function" == typeof window.__onGCastApiAvailable ? window.__onGCastApiAvailable : null
}

function getExtension(id) {
  return `chrome-extension://${id}${scriptToLoad}`
}

function loadScript(source, onError, onLoaded) {
  let script = document.createElement('script')
  script.onerror = onError
  
  if (onLoaded)
    script.onload = onLoaded

  d.src = source
  (document.head || document.documentElement).appendChild(script)
}

function onCastExtensionNotFound() {
  let callback = getOnGCastAPIAvailableCallback()
  if (callback)
    callback(false, 'No cast extension found')
}

function loadCastFramework() {
  if (shouldLoadCastFramework) {
    let a = extensionIds.length
    let callback = getOnGCastAPIAvailableCallback()
    const onCastExtensionFound = () => {
      a--
      0 == a && callback && callback(true)
    }

    window.__onGCastApiAvailable = callback
    loadScript("//www.gstatic.com/cast/sdk/libs/sender/1.0/cast_framework.js", onCastExtensionNotFound, onCastExtensionFound)
  }
}

// if the useragent matches Chrome or Android
if (window.navigator.userAgent.indexOf("Android") >= 0 && window.navigator.userAgent.indexOf("Chrome/") >= 0 && window.navigator.presentation) {
  loadCastFramework();
  var version = window.navigator.userAgent.match(/Chrome\/([0-9]+)/)

  // loads cast sender framework by Chrome version or default if Chrome version isn't known
  tryLoadScripts([
    `//www.gstatic.com/eureka/clank/${version ? parseInt(version[1], 10) : 0}${scriptToLoad}`,
    `//www.gstatic.com/eureka/clank${scriptToLoad}`
  ])
} 
// if not a Chromium browser
else {
  if (!window.chrome || !window.navigator.presentation || 0 <= window.navigator.userAgent.indexOf("Edge"))
    onCastExtensionNotFound()
  else {
    loadCastFramework()
    tryLoadScripts(extensionsIds.map(id => getExtension(id)))
  }
}