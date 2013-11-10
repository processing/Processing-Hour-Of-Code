"use strict";

/**
 * Singleton for splash page
 */

var helloSplash = {
	/**
	 * Initialize splash page
	 */
	init: function() {

		// Center Splash

	    $("#splash").css(
	    	{
	    		"top": "50%",
	    		"left": "50%",
	    		"margin-top": $("#splash").height() /-2,
	    		"margin-left": $("#splash").width() /-2	    		
			});

	    $("#splashButton").css(
	    	{
	    		"top": "50%",
	    		"left": "50%",
	    		"margin-top": ($("#splashButton").height() /-2) + 128,
	    		"margin-left": $("#splashButton").width() /-2	    		
			});

	    // Animate In

	    $("#splash").delay(1400).fadeIn(1200);
	    $("#splashButton").delay(2600).fadeIn("slow");

	    // Show Footer

	    $("#splashFooter").delay(3000).fadeIn("slow");
	}
};