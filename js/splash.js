"use strict";
/*global $*/

/**
 * Singleton for splash page
 */

var helloSplash = {
    /**
     * Initialize splash page
     */
    init: function () {

        // Center Splash
        $("#splashHeader").css({
            "margin-top": $("#splashTitle").height() / -2,
        });

        $("#splashNav").css({
            "margin-top":  118,
            "margin-left":  $("#splashNav").width() / -2
        });

        // Animate In

        $("#splashTitle").hide().delay(1400).fadeIn(1200);
        $("#splashButton").hide().delay(2600).fadeIn("slow");

        // Show Footer

        $("#splashFooter").delay(3000).fadeIn("slow");
    }
};