// ^ my_config declaration will be inserted above

/* This script runs as a drop-in replacement of the original cadmium-playercore */

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

console.log("Hello, I am running instead of playercore");
console.log("my_config:")
console.log(my_config)

/* We need to do a synchronous request because we need to eval
the response before the body of the script finishes executing */
var request = new XMLHttpRequest();
request.open("GET", my_config["cadmium_url"] + "?no_filter", false); // synchronous
request.send(null);

var cadmium_src = request.responseText;

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

do_patch(
	"Custom profiles",
	/(viewableId:.,profiles:).,/,
	"$1 custom_profiles,"
);

do_patch(
	"Re-enable Ctrl+Shift+Alt+S menu",
	/this\...\....\&\&this\.toggle\(\);/,
	"this.toggle();");

eval(cadmium_src);
