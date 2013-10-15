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

    $("#splash").css({'opacity': 0, 'marginTop': 24}).animate(
      { opacity: 1, marginTop: 0 },
      { duration: 600}
    );

    $("#splashFooter").css({'opacity': 0}).delay(600).animate(
      { opacity: 1},
      { duration: 'slow'}
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
					var processingCanvas = document.getElementById("displayCanvas");    			
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
	processingInstance: null,
	lessons: [
		'/assets/pde/hourofcode_1_ellipses/hourofcode_1_ellipses.pde',
		'/assets/pde/hourofcode_2_color/hourofcode_2_color.pde',
		'/assets/pde/houseofcode_3_mouse_a/houseofcode_3_mouse_a.pde',
		'/assets/pde/houseofcode_4_mousepressed_a/houseofcode_4_mousepressed_a.pde',
	],
	/**
	 * Initialize Ace editor and UI elements
	 * @return {[type]}
	 */
	init: function () {
  		this.editor = ace.edit("editor");
  		this.editor.getSession().setMode("ace/mode/processing");
  		this.editor.setTheme("ace/theme/clouds");
  		this.editor.setShowFoldWidgets(false);

  		var pop = Popcorn.vimeo(
			'#video',
			"https://vimeo.com/71766674"
		);

  		this.setupUI();
    	this.loadLesson(0);

    	$( window ).resize(function() {
    		helloEditor.resizeUI();
		});

	},
	/**
	 * Initialize UI elements
	 * @return {[type]}
	 */
	setupUI: function() {

		$("#runButton").click(function() {
      		helloEditor.displayGist();
    	});

  		$("#shareButton").click(function() {
      		helloEditor.createGist();
    	});   

    	$(".lessonButton").each( function (index, value) {

    		$(value).click( function() {
    			var lessonIndex = $(this).attr("data-index");
    			helloEditor.loadLesson(lessonIndex);
    		});

    	});

    	this.resizeUI();

	},
	/**
	 * Try to keep a sane layout at any browser size.
	 * @return {[type]}
	 */
	resizeUI: function() {

		var viewportWidth = $(window).width();
		var viewportHeight = $(window).height() - 48;

		$("#interface")
			.height(viewportHeight)
			.width(viewportWidth)
			.css({top: 48, left: 0, marginLeft: 0, marginTop: 0});

		var videoWidth = viewportWidth - viewportHeight;
		var videoHeight = (viewportWidth - viewportHeight) / 16 * 9;

		$("#videoContainer")
			.width(videoWidth)
			.height(videoHeight)
			.css({
				left: viewportHeight
			});

		$("#editor")
			.width(videoWidth)
			.height(viewportHeight - videoHeight)
			.css({
				top: videoHeight,
				left: viewportHeight
			});

		$("#editorCanvas")
			.height(viewportHeight)
			.width(viewportHeight)
	},
	/**
	 * Reset the Processing.js instance
	 * @return {[type]}
	 */
	resetInstance: function() {
		if (this.processingInstance) {
			this.processingInstance.exit();
			this.processingInstance.background("#cfcfcf");
			this.processingInstance = null;
		}
	},
	/**
	 * Loads a lesson into the editor by index
	 * @param  {[type]} index
	 * @return {[type]}
	 */
	loadLesson: function(index) {
		this.resetInstance();

		$.get(this.lessons[index], function(data) {
			helloEditor.editor.setValue(data, -1);
		})
	},
	/**
	 * Run current code in Ace
	 * @return {[type]}
	 */
	displayGist: function() {
		this.resetInstance();

		var viewportHeight = $(window).height() - 48;

		var processingSource = this.editor.getValue();
		var processingCanvas = document.getElementById("editorCanvas");         
		this.processingInstance = new Processing(processingCanvas, processingSource);

		$("#editorCanvas")
			.height(viewportHeight)
			.width(viewportHeight)
	},
	/**
	 * Creates a new Gist with editor contents and shows share modal
	 * @return {[type]}
	 */
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
