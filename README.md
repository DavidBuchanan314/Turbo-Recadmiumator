# Turbo-Recadmiumator [WIP]
A remake of truedread/netflix-1080p which auto-patches cadmium-playercore at runtime to enable enhanced playback features.

Currently Firefox only, although it should only be a minor change to make it
work with chrom{e,ium}.

Rather than bundling a hand-patched cadmium-playercore.js, this extension
performs the patches at runtime using regex. Therefore, it should be publishable
to the chrome/ff webstores without any copyright issues etc.

It remains to be seen how robust my regexes will be to playercore updates.

## Current features:

- Enable <kbd>Ctrl</kbd>+<kbd>Shift+</kbd><kbd>Alt</kbd>+<kbd>S</kbd> bitrate selection window.

- 1080p video.

- Disable VP9 profiles.

- Enable 5.1 audio profile.

## TODO:

- Auto-select max available bitrate.

- Add settings UI (right now, you have to edit the source...)
