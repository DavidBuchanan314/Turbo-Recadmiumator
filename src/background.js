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
	function(details) {
		/* Allow our shim to load an untouched copy */
		if (details.url.endsWith("?no_filter")) {
			return {};
		}
		
		if (getBrowser() == "Firefox") {
			let filter = browser.webRequest.filterResponseData(details.requestId);
			let encoder = new TextEncoder();

			filter.onstop = event => {
				fetch(browser.extension.getURL("cadmium-playercore-shim.js")).
					then(response => response.text()).
					then(text => {
						filter.write(encoder.encode(text));
						filter.close();
					}).catch(err => {
						console.error(`Error: ${err}`);
				});
			};
			return {};

		} else if (getBrowser() == "Chrome") {
			return {
				redirectUrl: chrome.extension.getURL("cadmium-playercore-shim.js")
			};

		} else {
			console.error("Unsupported web browser :(");
		}
	}, {
		urls: [
			"*://assets.nflxext.com/*/ffe/player/html/*",
			"*://www.assets.nflxext.com/*/ffe/player/html/*"
		]
	}, ["blocking"]
);
