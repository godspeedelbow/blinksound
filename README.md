blinksound
==========

Easy API for focus the user on an inactive browser window/tab, through sound and title blinking.

Dependencies
--------------

- jQuery and the [title alert plugin](https://github.com/heyman/jquery-titlealert) to be present

- HTML5 Audio (depends on the browser, no install required)

- a logging module

- require.js

How to use
---------------

Initialize the plugin with an `audioUrls` object that contains urls to audio files. You can provide different audio files for wider support. The plugin will try to see if the browser supports HTML5 Audio.

```
var blinksound = require('blinksound')({
    ogg: '/path/to/ogg-audio-file',
    mp3: '/path/to/mp3-audio-file',
    wav: '/path/to/mav-audio-file',
});
```

The intialized module returns a function that can be called with one argument, title text.

```
blinksound('New title');
```

The browser window/tab will play the provided sound once. It will blink until the title user focuses it.
