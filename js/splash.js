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
            "top": "50%",
            "margin-top": $("#splashTitle").height() / -2,
        });

        // Animate In

        $("#splashTitle").delay(1400).fadeIn(1200);
        $("#splashButton").delay(2600).fadeIn("slow");

        // Show Footer

        $("#splashFooter").delay(3000).fadeIn("slow");
    }
};