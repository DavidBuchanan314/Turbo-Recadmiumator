// https://stackoverflow.com/a/45985333
function getBrowser() {
	if (typeof chrome !== "undefined") {
		if (typeof browser !== "undefined") {
			return "Firefox";
		} else {
			return "Chrome";
		}
	} else {
		return "Edge";
	}
}

chrome.webRequest.onBeforeRequest.addListener(
	function (details) {
		/* Allow our shim to load an untouched copy */
		if (details.url.endsWith("?no_filter")) {
			return {};
		}
		
		if (getBrowser() == "Chrome") {
			return {
				redirectUrl: chrome.extension.getURL("cadmium-playercore-shim.js")
			};
		}
		
		/* Work around funky CORS behaviour on Firefox */
		else if (getBrowser() == "Firefox") {
			let filter = browser.webRequest.filterResponseData(details.requestId);
			let encoder = new TextEncoder();
			filter.onstop = event => {
				fetch(browser.extension.getURL("cadmium-playercore-shim.js")).
					then(response => response.text()).
					then(text => {
						filter.write(encoder.encode(text));
						filter.close();
					});
			};
			return {};
		}
		
		else {
			console.error("Unsupported web browser :(");
		}
	}, {
		urls: [
			"*://assets.nflxext.com/player/html/ffe/*",
			"*://*.a.nflxso.net/sec/player/html/ffe/*"
		]
	}, ["blocking"]
);
