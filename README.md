# Turbo-Recadmiumator
A remake of truedread/netflix-1080p which auto-patches cadmium-playercore at runtime to enable enhanced playback features.

Currently Firefox only, although it should only be a minor change to make it
work with chrom{e,ium}.

Rather than bundling a hand-patched cadmium-playercore.js, this extension
performs the patches at runtime using regex. Therefore, it should be publishable
to the chrome/ff webstores without any copyright issues etc.

It remains to be seen how robust my regexes will be to playercore updates.

## Current features:

	- 1080p Video.

	- Disable VP9 profiles.

	- Enable 5.1 audio profile.
