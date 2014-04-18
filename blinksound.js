/* this module requires jQuery and jQuery.titlealert to be loaded:
    https://github.com/heyman/jquery-titlealert
*/

//amd loadable (or just plain-old straightforward). 
//see: http://stackoverflow.com/a/11890239/443359
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module depending on jQuery.
        define(['jquery'], factory);
    } else {
        // No AMD. Register plugin with global jQuery object.
        factory($);
    }
}(function ($) {
    var debug = false;

    function log() {
        if (debug && window.console && window.console.log) {
            window.console.log.apply(window.console, arguments);
        }
    }

    function noop() {}

    /*
     * Binds to window/document for keyboard and mouse activity
     * Returns function that returns whether user is currently (in)active
     */
     //TODO: jQuery binding that's less ugly
    function getUserActivity () {
        var userIsActive = true;
        
        function setActive (isActive) {
            if (userIsActive !== isActive) {
                userIsActive = isActive;
                log('userIsActive: ' + userIsActive);
            }
        }

        $(window).focus(function() {
            log('blinksound: focus desktop');
            setActive(true);
        });

        $(window).blur(function() {
            log('blinksound: blur desktop');
            setActive(false);
        });

        //for IE
        $(document).bind('focusin', function() {
            log('blinksound: focusin desktop');
            setActive(true);
        });

        //for IE
        $(document).bind('focusout', function() {
            log('blinksound: focusout desktop');
            setActive(false);
        });
    
        //capture mouse movement too, because it indicates an active user
        $('body').bind('mousemove desktop', function() {
            setActive(true);
        });
    
        return function() {
            return userIsActive;
        };
    }

    /*
     * Tries if browser can handle Audio API
     * returns function that plays audio when called
     * returns noop when there is no HTML5 Audio support no suitable audio url can be found
     */
    function getSoundPlayer(audioUrls) {
        audioUrls = audioUrls || {};

        try {
            var audio = new Audio(),
                //canPlayType() returns 'probably', 'maybe' or ''
                supported = audioUrls.ogg && !!audio.canPlayType('audio/ogg; codecs="vorbis"') ? 'ogg' :
                            audioUrls.mp3 && !!audio.canPlayType('audio/mpeg') ? 'mp3' :
                            audioUrls.wav && !!audio.canPlayType('audio/wav; codecs="1"') ? 'wav' : false,
                audioUrl;

            if (!supported) {
                log('no blinking sound found');
                return noop;
            }

            audioUrl = audioUrls[supported];
            log('blinksound: audio url: ' + audioUrl);
            var snd = new Audio(audioUrl);

            return function () {
                snd.play();
            };
        } catch (error) {
            //return empty function
            return noop;
        }
    }
    
    //TODO: make sure keeps working after client dynamically changes title and then call this function
    /*
     * Checks if $.titleAlert is present, stores original title
     * Returns function that will blink the title of the browser/window with provided message.
     * Returns noop if $.titleAlert is not loaded
     */
    function getTitleBlinker () {
        var originalTitle;

        if (!$.titleAlert) {
            return noop;
        }

        originalTitle = document.title;
        return function(blinkTitle) {
            //in case this function get called while stile blinking
            //first set back to original title, so it does not get stuck in the new title value
            document.title = originalTitle;
            
            $.titleAlert(blinkTitle, {
                stopOnMouseMove:true,
                stopOnFocus: true,
                interval:1500
            });
        };
    }

    return function(options) {
        options = options || {};
        debug = !!options.debug;

        var checkUserActivity = getUserActivity(),
            playSound = getSoundPlayer(options),
            blinkTitle = getTitleBlinker();

        return function (title) {
            if (checkUserActivity()) {
                log('blinksound: user is active; playing sound nor blinking');
                return;
            }

            log('blinksound: user is not active; playing sound and blinking');
            playSound();
            blinkTitle(title);
        };
    };
}));
