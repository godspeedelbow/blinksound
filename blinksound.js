/* this module requires jQuery titlealert to be loaded:
    https://github.com/heyman/jquery-titlealert
*/

/* global define */
define(function (require) {
    var log = require('log'),
        $ = require('jquery');

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
                log.finest('userIsActive: ' + userIsActive);
            }
        }

        $(window).focus(function() {
            log.finest('blinksound: focus desktop');
            setActive(true);
        });

        $(window).blur(function() {
            log.finest('blinksound: blur desktop');
            setActive(false);
        });

        //for IE
        $(document).bind('focusin', function() {
            log.finest('blinksound: focusin desktop');
            setActive(true);
        });

        //for IE
        $(document).bind('focusout', function() {
            log.finest('blinksound: focusout desktop');
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
                log.finer('no blinking sound found');
                return noop;
            }

            audioUrl = audioUrls[supported];
            log.finer('blinksound: audio url: ' + audioUrl);
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

    return function(audioUrls) {
        var checkUserActivity = getUserActivity(),
            playSound = getSoundPlayer(audioUrls),
            blinkTitle = getTitleBlinker();

        return function (title) {
            if (checkUserActivity()) {
                log.finer('blinksound: user is active; playing sound nor blinking');
                return;
            }

            log.finer('blinksound: user is not active; playing sound and blinking');
            playSound();
            blinkTitle(title);
        };
    };
});
