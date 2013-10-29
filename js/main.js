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
	popcorn: null,
	processingInstance: null,
	videoMode: true,
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

  		this.setupUI();
  		this.loadLesson(1);

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
      		helloEditor.runCode();
    	});

  		$("#shareButton").click(function() {
      		helloEditor.createGist();
    	});   

    	$("#toggleRulers").click(function() {

    		$("#horizontalRuler").toggle();
    		$("#verticalRuler").toggle();
    	});

    	$(".lessonButton").each( function (index, value) {

    		$(value).click( function() {
    			$(".lessonButton").removeClass("active");
    			$(this).addClass("active");
    			
    			var lessonIndex = parseInt($(this).attr("data-index"));
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

		var viewportWidth = ($(window).width() > 800) ? $(window).width() : 800;
		var viewportHeight = $(window).height() - 48;

		$("#interface")
			.height(viewportHeight)
			.width(viewportWidth)
			.css({top: 48, left: 0, marginLeft: 0, marginTop: 0});

		if (this.videoMode) {

			//console.log("Video Mode");

			var videoWidth = viewportWidth * .80;
			var videoHeight = videoWidth / 16 * 9;

			$("#videoContainer")
				.css({
					width: videoWidth,
					height: videoHeight,
					left: "50%",
					top: "50%",
					marginTop: videoHeight/-2,
					marginLeft: videoWidth/-2
				});

			$("#editorContainer").css({display:"none"});
			$("#canvasContainer").hide();
			//$("#commands").hide();

		} else {

			//console.log("Editor Mode");

			var videoWidth = viewportWidth - viewportHeight;
			var videoHeight = videoWidth / 16 * 9;

			$("#videoContainer")
				.css({
					width: videoWidth,
					height: videoHeight,
					left: 0,
					top: 0,
					marginTop: 0,
					marginLeft: 0
				});

			$("#editorContainer")
				.css({
					width:videoWidth,
					height: viewportHeight - videoHeight,
					top: videoHeight,
					left: 0
				});

			$("#canvasContainer")
				.height(viewportHeight)
				.width(viewportHeight)
				.css({
					top: 0,
					left: videoWidth
				});		
				
		}	
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
	loadCode: function(index) {
		this.resetInstance();

		$.get(this.lessons[index], function(data) {
			helloEditor.editor.setValue(data, -1);
		})
	},
	loadLesson: function(index) {

		$("#video").html("");
		switch(index) {    				
			case 1: // Hello
				loadScriptOne();
			break;
			case 2: 			
				loadScriptTwo();
			break; 
			case 3:
				loadScriptThree();		
			break;
			case 4:
  				loadScriptFour();			
			break;
			case 5:
  				loadScriptFive();
			break;
			case 6: //Goodbye
  				loadScriptSix();
			break;
		}

	},
	/**
	 * Run current code in Ace
	 * @return {[type]}
	 */
	runCode: function() {
		this.resetInstance();

		try {
			var processingSource = this.editor.getValue();
			var processingCanvas = document.getElementById("editorCanvas");         
			this.processingInstance = new Processing(processingCanvas, processingSource);
		}
		catch(e) {
			console.log ("Error: " + e.message);

				$('#errorModalText').html(e.message);
				$('#errorModal').modal('show');			
		}

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
