# Turbo-Recadmiumator [WIP]
A remake of truedread/netflix-1080p which auto-patches cadmium-playercore at runtime to enable enhanced playback features.

Works in both Firefox and Chrom{e,ium}.

Rather than bundling a hand-patched cadmium-playercore.js, this extension
performs the patches at runtime using regex. Therefore, it should be publishable
to the chrome/ff webstores without any copyright issues etc.

It remains to be seen how robust my regexes will be to playercore updates.

## Current features:

- Enable <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Alt</kbd>+<kbd>S</kbd> bitrate selection window.

- 1080p video.

- Disable VP9 profiles.

- Enable 5.1 audio profile.

- Auto-select stream with max available bitrate.

- Under [my_config](https://github.com/DavidBuchanan314/Turbo-Recadmiumator/blob/50dff66f61a08b95c3206e2766ad4ed8e9bfe706/src/cadmium-playercore-shim.js#L4) users can choose custom profiles. Like vp9, 5.1, max_bitrate, avc.high, avc.prk and 4k hevc.

## Undocumented Keyboard Shortcuts:

Netflix has a bunch of undocumented keyboard shortcuts, that do useful things. This list may be incomplete.

- <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Alt</kbd>+<kbd>B</kbd> - Bitrate selection menu (re-enabled by this project) (NOTE: This used to be S, not B!)

- <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Alt</kbd>+<kbd>D</kbd> - Debug overlay - displays lots of useful info and stats, including current resolution and bitrate.

- <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Alt</kbd>+<kbd>T</kbd> - Upload custom subtitle file, in DFXP/TTML format.

- <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Alt</kbd>+<kbd>L</kbd> - Log viewer.

## TODO:

- Add settings UI (right now, you have to edit the source...)

- Add comments detailing where I stole the code from...

## Credits:

This codebase is cobbled together with bits and pieces from [truedread/netflix-1080p](https://github.com/truedread/netflix-1080p) and its various forks. Notably:

- https://github.com/vladikoff/netflix-1080p-firefox

- https://github.com/TheGoddessInari/netflix-1080p-firefox

- https://github.com/OothecaPickle/netflix-1080p

- https://github.com/jangxx/netflix-1080p
