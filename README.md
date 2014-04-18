blinksound
==========

Easy API to focus the user on a background browser window/tab, through sound and title blinking.

Dependencies
--------------

- jQuery and the [title alert plugin](https://github.com/heyman/jquery-titlealert) to be present

- HTML5 Audio (depends on the browser, no install required)

How to use
---------------

Initialize the plugin with an options object that contains urls to audio files. You can provide different audio files for wider support. The plugin will try to see if the browser supports HTML5 Audio.

```
var blinksound = require('blinksound')({
    ogg: '/path/to/ogg-audio-file',
    mp3: '/path/to/mp3-audio-file',
    wav: '/path/to/mav-audio-file',
});
```

Optionally, a property `debug` can be included in the options. When set to true, the plugin will use `console.log` to log debug statements.

The intialized module returns a function that can be called with one argument, title text.

```
var blinkedAndSounded = blinksound('New title');
```

If the browser window/tab is active/focused, blink sound does not nothing and returns `false`. If it isn't active/focused, blinksound plays sound once, blink the title until the user focuses the window/tab and returns `true`.
