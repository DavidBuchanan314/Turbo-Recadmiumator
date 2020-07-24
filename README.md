# Turbo-Recadmiumator [WIP]
A remake of truedread/netflix-1080p which auto-patches cadmium-playercore at runtime to enable enhanced playback features.

Works in both Firefox and Chrom{e,ium}.

Rather than bundling a hand-patched cadmium-playercore.js, this extension
performs the patches at runtime using regex. Therefore, it should be publishable
to the chrome/ff webstores without any copyright issues etc.

It remains to be seen how robust my regexes will be to playercore updates.

## Current features:

- Enable <kbd>Ctrl</kbd>+<kbd>Shift+</kbd><kbd>Alt</kbd>+<kbd>S</kbd> bitrate selection window.

- 1080p video.

- Disable VP9 profiles.

- Enable 5.1 audio profile.

- Auto-select stream with max available bitrate.

## TODO:

- Add settings UI (right now, you have to edit the source...)

- Add comments detailing where I stole the code from...

## Credits:

This codebase is cobbled together with bits and pieces from [truedread/netflix-1080p](https://github.com/truedread/netflix-1080p) and its various forks. Notably:

- https://github.com/vladikoff/netflix-1080p-firefox

- https://github.com/TheGoddessInari/netflix-1080p-firefox

- https://github.com/OothecaPickle/netflix-1080p
