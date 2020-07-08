let localPlayer = null

// cast variables
let isLive = false
let isCasting = false
let closedCaptionsEnabled = false
let streamUrl = null
let launcher = null
let castSession = null
let remotePlayer = null
let remotePlayerController = null
let remotePlayerTime = 0

let title = null
let subtitle = null
let mediaDate = null

// modifies the XMLHttpRequest so that we can view response bodies
const modifyXHR = () => {
	var XHR = XMLHttpRequest.prototype;
	// Remember references to original methods
	var open = XHR.open;
	var send = XHR.send;

	// Overwrite native methods
	// Collect data: 
	XHR.open = function(method, url) {
			this._method = method;
			this._url = url;
			return open.apply(this, arguments);
	};

	// Implement "ajaxSuccess" functionality
	XHR.send = function(postData) {
			let self = this
			this.addEventListener('load', () => {
				// borrowed + modified from https://github.com/ebrehault/repeat-after-me
				if(this._url) {
					var responseHeaders = {};
					this.getAllResponseHeaders().split('\n').forEach(header => {
						var v = header.split(':')
						if (v.length === 2)
							responseHeaders[v[0]] = v[1].trim()
					})

					var request = {
						url: this._url,
						method: this._method,
						status: this.status,
						statusText: this.statusText,
						headers: this._requestHeaders,
						responseHeaders: responseHeaders,
					}

					if (postData)
						request.requestBody = postData;

					if (this.responseType === '' || this.responseType === 'text')
						request.responseBody = this.responseText
					
					// parse JSON
					if (responseHeaders['content-type'] === 'application/json') {
						request.responseBody = JSON.parse(request.responseBody)

						// only dispatch events for JSON responses
						var event = new CustomEvent('url-intercept', { detail: request })
						document.dispatchEvent(event)
					}
			}
		})

		return send.apply(this, arguments);	
	};
}

document.addEventListener('url-intercept', ({ detail }) => {
	let { url, responseBody: response } = detail

	if (url.indexOf('global/session-occurrence') >= 0) {
		if (response.session_type_url) {
			isLive = response.status !== 'replay'
			title = response.session_name

			if (response.eventoccurrence_url)
				subtitle = response.eventoccurrence_url.official_name
			
			mediaDate = response.editorial_start_time
		}
	}
	else if (url.indexOf('/global/viewings') >= 0) {
		// maybe use the username JWT to get tokenised stream urls manually?
		const { tokenised_url, username } = response

		if (tokenised_url) {
			document.dispatchEvent(new CustomEvent('stream-load', { detail: tokenised_url }))
			streamUrl = tokenised_url
		}
	}
})

modifyXHR()