var my_config = {
	"use_VP9": false,
	"use_5.1": false
}

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
						my_config["cadmium_url"] =	details.url;
						var prefix = "var my_config = " + JSON.stringify(my_config) + ";\n";
						filter.write(encoder.encode(prefix + text));
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
