/* This script runs as a drop-in replacement of the original cadmium-playercore */
console.log("Hello, I am running instead of playercore");

var my_config = {
	"use_VP9": false,
	"use_heaac-5.1": false,
	"use_ddplus-5.1": true,
	"use_ddplus-2.0": false,
	"use_ddplus-atmos": false,
	"set_max_bitrate": true,
	"use_avc.high": false,
	"use_avc.prk": true,
	"use_4k": false,
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
		"heaac-2-dash",
		"heaac-2hq-dash",

		"simplesdh",
		"nflx-cmisc",
		"BIF240",
		"BIF320"
	];

	if (my_config["use_avc.high"]) {
		custom_profiles = custom_profiles.concat([
			"playready-h264mpl30-dash",
			"playready-h264mpl31-dash",
			"playready-h264mpl40-dash",
			"playready-h264hpl30-dash",
			"playready-h264hpl31-dash",
			"playready-h264hpl40-dash",
		]);
	}

	if (my_config["use_avc.prk"]) {
		custom_profiles = custom_profiles.concat([
			"h264mpl30-dash-playready-prk-qc",
			"h264mpl31-dash-playready-prk-qc",
			"h264mpl40-dash-playready-prk-qc",
		]);
	}

	if (my_config["use_4k"]) {
		custom_profiles = custom_profiles.concat([
			"hevc-main10-L30-dash-cenc",
			"hevc-main10-L31-dash-cenc",
			"hevc-main10-L40-dash-cenc",
			"hevc-main10-L41-dash-cenc",
			"hevc-main10-L50-dash-cenc",
			"hevc-main10-L51-dash-cenc",
			"hevc-main10-L30-dash-cenc-live",
			"hevc-main10-L31-dash-cenc-live",
			"hevc-main10-L40-dash-cenc-live",
			"hevc-main10-L41-dash-cenc-live",
			"hevc-main10-L50-dash-cenc-live",
			"hevc-main10-L51-dash-cenc-live",
			"hevc-main10-L30-dash-cenc-prk",
			"hevc-main10-L31-dash-cenc-prk",
			"hevc-main10-L40-dash-cenc-prk",
			"hevc-main10-L41-dash-cenc-prk",
			"hevc-main10-L30-dash-cenc-prk-do",
			"hevc-main10-L31-dash-cenc-prk-do",
			"hevc-main10-L40-dash-cenc-prk-do",
			"hevc-main10-L41-dash-cenc-prk-do",
			"hevc-main10-L50-dash-cenc-prk-do",
			"hevc-main10-L51-dash-cenc-prk-do",
		]);
	}

	if (my_config["use_VP9"]) {
		custom_profiles = custom_profiles.concat([
			"vp9-profile0-L30-dash-cenc",
			"vp9-profile0-L31-dash-cenc",
			"vp9-profile0-L40-dash-cenc",
		]);
	}

	if (my_config["use_ddplus-5.1"]) {
		custom_profiles = custom_profiles.concat([
			"ddplus-5.1-dash",
		]);
	}

	if (my_config["use_ddplus-2.0"]) {
		custom_profiles = custom_profiles.concat([
			"ddplus-2.0-dash",
		]);
	}

	if (my_config["use_ddplus-atmos"]) {
		custom_profiles = custom_profiles.concat([
			"ddplus-atmos-dash",
		]);
	}

	if (my_config["use_heaac-5.1"]) {
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

	if (!(VIDEO_SELECT && AUDIO_SELECT && BUTTON)){
		window.dispatchEvent(new KeyboardEvent('keydown', {
			keyCode: 66,
			ctrlKey: true,
			altKey: true,
			shiftKey: true,
		}));

		return false;
	}

	let SELECT_LISTS = [VIDEO_SELECT, AUDIO_SELECT];
	let result = false;

	for (var index = 0; index < SELECT_LISTS.length; index++) {
		let list = SELECT_LISTS[index];
		let parent = list.parentElement;
		let select = parent.querySelector('select');

		if (select.disabled){
			return false;
		}

		let options = parent.querySelectorAll('select > option');

		if (options.length == 0){
			return false;
		}

		if (options.length > 1 && options[0].selected == false){
			return false;
		}

		for (var i = 0; i < options.length - 1; i++) {
			options[i].selected = false;
		}

		options[options.length - 1].selected = true;
		result = options[options.length - 1].selected;
	}

	if (result){
		console.log("max bitrate selected, closing window");
		BUTTON.click();
	}

	return result;
}

function set_max_bitrate_run(attempts) {
	if (!attempts) {
		console.log("failed to select max bitrate");
		return;
	}

	set_max_bitrate() || setTimeout(() => set_max_bitrate_run(attempts - 1), 200);
}

const WATCH_REGEXP = /netflix.com\/watch\/.*/;

let oldLocation;

if(my_config["set_max_bitrate"]) {
	console.log("netflix_max_bitrate.js enabled");
	setInterval(function () {
		let newLocation = window.location.toString();

		if (newLocation !== oldLocation) {
			oldLocation = newLocation;
			WATCH_REGEXP.test(newLocation) && set_max_bitrate_run(10);
		}
	}, 500);
}
