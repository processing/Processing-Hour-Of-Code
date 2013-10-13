"use strict";

$(document).ready(function() {
	if (page != null && eval(page) !== null) eval(page).init();
});

/**
 * Singleton for splash page
 * @type {Object}
 */
var helloSplash = {
	/**
	 * Initialize splash page
	 * @return {[type]}
	 */
	init: function() {

	// Center Splash

    $("#splashDiv").css("margin-left",$("#splashDiv").width() /-2);
    $("#splashDiv").css("margin-top",$("#splashDiv").height() /-2);
    
    // Animate In

    $("#splash").css({'opacity': 0, 'marginTop': 24})
    .animate(
      { opacity: 1, marginTop: 0 },
      { queue: false, duration: 'slow' }
    );

	}
}

/**
 * Singleton for display page
 *
 * @type {Object}
 */
var helloDisplay = {
	/**
	 * Initialize display page
	 * @return {[type]}
	 */
	init: function() {

		if (document.URL.indexOf('#') >=0 ) {
			var gistID = document.URL.split('#')[1];
			this.displayGist(gistID);
		}

	},
	/**
	 * Fetch Gist code from GitHub and feed it to Processing.js
	 * @param  {[type]} gistID
	 * @return {[type]}
	 */
	displayGist: function(gistID) {
	
		var apiURL = "https://api.github.com/gists/"
		var gistURL = apiURL + gistID;
		
		$.ajax({
			'url': gistURL,
			'complete': function(data) {

				var gistFiles = data.responseJSON.files;
				var gistFile = gistFiles[Object.keys(gistFiles)[0]];
				var gistSource = gistFile.content;

	    		try {			
					var processingCanvas = document.getElementById("processingCanvas");    			
					var processingInstance = new Processing(processingCanvas, gistSource);

			    } catch (e) {
			      	console.log("ERROR! " + e.toString());
			    }			
			}
		});
	}
}

/**
 * Singleton for the editor page
 * @type {Object}
 */
var helloEditor = {
	editor: null,
	/**
	 * Initialize Ace editor and UI elements
	 * @return {[type]}
	 */
	init: function () {
  		this.editor = ace.edit("editor");
  		this.editor.getSession().setMode("ace/mode/processing");
  		this.editor.setTheme("ace/theme/clouds");

  		$("#runButton").click(function() {
      		helloEditor.displayGist();
    	});

  		$("#shareButton").click(function() {
      		helloEditor.createGist();
    	});    	

	},
	/**
	 * Run current code in Ace
	 * @return {[type]}
	 */
	displayGist: function() {

		var processingSource = this.editor.getValue();
		var processingCanvas = document.getElementById("processingCanvas");         
		var processingInstance = new Processing(processingCanvas, processingSource);

	},
	createGist: function() {

		var processingSource = this.editor.getValue();

		var postData = {
			"description": "Save for Processing Hour of Code",
			"public": true,
			"files": {
				"demo.pde": {
					"content": processingSource
				}
			}
		}

		var postURL = "https://api.github.com/gists";

		$.post(postURL, JSON.stringify(postData))
			.done(function( data ) {
				var gistID = data.id;
				var displayURL = "http://" + $(location).attr('hostname') + ( ($(location).attr('port') != "") ?  ":" + $(location).attr('port') : "" ) + "/display/#" + gistID;

				$('#shareModalText').html($("<a/>").attr('href',displayURL).html(displayURL));
				$('#shareModal').modal('show');
			});

	}
}
