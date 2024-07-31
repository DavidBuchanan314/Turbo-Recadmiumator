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
		if (match[0].length < 200) { // avoid spamming the console
			console.log(repr(match[0]) + " -> " + repr(replacement));
		}
	}
}

/* We need to do a synchronous request because we need to eval
the response before the body of this script finishes executing */
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
	"Hello world",
	/(.*)/,
	"console.log('Hello, I am code which has been injected into playercore!'); $1"
);

do_patch(
	"Custom profiles",
	/(viewableId:.,profiles:).,/,
	"$1 get_profile_list(),"
);

do_patch(
	"Custom profile group",
	/(name:"default",profiles:)./,
	"$1 get_profile_list()"
);

do_patch(
	"Re-enable Ctrl+Shift+Alt+S menu",
	/this\...\....\s*\&\&\s*this\.toggle\(\);/,
	"this.toggle();");

// run our patched copy of playercore
eval(cadmium_src);



/* netflix_max_bitrate.js */

function getElementByXPath(xpath) {
	return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function set_max_bitrate() {
	const VIDEO_SELECT = getElementByXPath("//div[text()='Video Bitrate / VMAF']");
	const AUDIO_SELECT = getElementByXPath("//div[text()='Audio Bitrate']");
	const BUTTON = getElementByXPath("//button[text()='Override']");

	if (!(VIDEO_SELECT && AUDIO_SELECT && BUTTON)) {
		window.dispatchEvent(new KeyboardEvent('keydown', {
			keyCode: 66,
			ctrlKey: true,
			altKey: true,
			shiftKey: true,
		}));

		return false;
	}

	let SELECT_LISTS = [VIDEO_SELECT, AUDIO_SELECT];
	let was_set = 0;

	for (var index = 0; index < SELECT_LISTS.length; index++) {
		let list = SELECT_LISTS[index];
		let parent = list.parentElement;

		let options = parent.querySelectorAll('select > option');

		for (let i = 0; i < options.length - 1; i++) {
			options[i].removeAttribute('selected');
		}

		if (options.length > 0) {
			options[options.length - 1].setAttribute('selected', 'selected');
			was_set += 1;
		}
	};

	if (was_set != 2) return false;

	BUTTON.click();
	set_max_bitrate_finish();

	return true;
}

function set_max_bitrate_start(attempts) {
	// hide the bitrate selection menu while we try to simulate the interaction
	// so that it doesn't rapidly appear and disappear.
	const styleNode = document.createElement("style");
	styleNode.textContent = `
		.player-streams {
			display: none;
		}
	`;
	styleNode.id = "maxbitrate-hide-menu-style";
	document.head.appendChild(styleNode);

	set_max_bitrate_run(attempts);
}

function set_max_bitrate_finish() {
	// remove the global style node so that the menu becomes visible
	// on normal user input again
	const styleNode = document.querySelector("#maxbitrate-hide-menu-style");
	styleNode.parentNode.removeChild(styleNode);
}

function set_max_bitrate_run(attempts) {
	if (!attempts) {
		console.log("failed to select max bitrate");
		set_max_bitrate_finish();
		return;
	}

	set_max_bitrate() || setTimeout(() => set_max_bitrate_run(attempts - 1), 200);
}

const WATCH_REGEXP = /netflix.com\/watch\/.*/;

let oldLocation;

if (my_config["set_max_bitrate"]) {
	console.log("netflix_max_bitrate.js enabled");
	setInterval(function () {
		let newLocation = window.location.toString();

		if (newLocation !== oldLocation) {
			oldLocation = newLocation;
			WATCH_REGEXP.test(newLocation) && set_max_bitrate_start(10);
		}
	}, 500);
}
