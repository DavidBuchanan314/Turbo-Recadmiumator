/* This script runs as a drop-in replacement of the original cadmium-playercore */
console.log("Hello, I am running instead of playercore");

var my_config = {
	"use_VP9": false,
	"use_5.1": false,
	"set_max_bitrate": true,
}

function repr(obj) {
	// can you tell I'm a python programmer?
	return JSON.stringify(obj);
}

function do_patch(desc, needle, replacement) {
	var match = cadmium_src.match(needle);
	if (!match) {
		alert("Failed to find patch: " + repr(desc));
	} else {
		cadmium_src = cadmium_src.replace(needle, replacement);
		console.log("[+] Patched: " + repr(desc));
		console.log(repr(match[0]) + " -> " + repr(replacement));
	}
}

/* We need to do a synchronous request because we need to eval
the response before the body of the script finishes executing */
var request = new XMLHttpRequest();
var cadmium_url = document.getElementById("player-core-js").src;
request.open("GET", cadmium_url + "?no_filter", false); // synchronous
request.send(null);

var cadmium_src = request.responseText;

function get_profile_list() {
	custom_profiles = [
		"playready-h264mpl30-dash",
		"playready-h264mpl31-dash",
		"playready-h264mpl40-dash",
		
		"playready-h264hpl30-dash",
		"playready-h264hpl31-dash",
		"playready-h264hpl40-dash",
		
		"heaac-2-dash",
		"heaac-2hq-dash",

		"simplesdh",
		"nflx-cmisc",
		"BIF240",
		"BIF320"
	];

	if (my_config["use_VP9"]) {
		custom_profiles = custom_profiles.concat([
			"vp9-profile0-L30-dash-cenc",
			"vp9-profile0-L31-dash-cenc",
			"vp9-profile0-L40-dash-cenc",
		]);
	}

	if (my_config["use_5.1"]) {
		custom_profiles.push("heaac-5.1-dash");
	}

	return custom_profiles;
}

do_patch(
	"Custom profiles",
	/(viewableId:.,profiles:).,/,
	"$1 get_profile_list(),"
);

do_patch(
	"Re-enable Ctrl+Shift+Alt+S menu",
	/this\...\....\&\&this\.toggle\(\);/,
	"this.toggle();");

eval(cadmium_src);

/* netflix_max_bitrate.js */

let getElementByXPath = function (xpath) {
	return document.evaluate(
		xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
	).singleNodeValue;
};

let fn = function () {
	window.dispatchEvent(new KeyboardEvent('keydown', {
		keyCode: 83,
		ctrlKey: true,
		altKey: true,
		shiftKey: true,
	}));

	const VIDEO_SELECT = getElementByXPath("//div[text()='Video Bitrate']");
	const AUDIO_SELECT = getElementByXPath("//div[text()='Audio Bitrate']");
	const BUTTON = getElementByXPath("//button[text()='Override']");

	if (!(VIDEO_SELECT && AUDIO_SELECT && BUTTON)){
		return false;
	}

	[VIDEO_SELECT, AUDIO_SELECT].forEach(function (el) {
		let parent = el.parentElement;

		let options = parent.querySelectorAll('select > option');

		for (var i = 0; i < options.length - 1; i++) {
			options[i].removeAttribute('selected');
		}

		options[options.length - 1].setAttribute('selected', 'selected');
	});

	BUTTON.click();

	return true;
};

let run = function () {
	fn() || setTimeout(run, 100);
};

const WATCH_REGEXP = /netflix.com\/watch\/.*/;

let oldLocation;

if(my_config["set_max_bitrate"]) {
	console.log("netflix_max_bitrate.js enabled");
	setInterval(function () {
		let newLocation = window.location.toString();

		if (newLocation !== oldLocation) {
			oldLocation = newLocation;
			WATCH_REGEXP.test(newLocation) && run();
		}
	}, 500);
}
