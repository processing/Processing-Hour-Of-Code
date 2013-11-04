"use strict";

$(document).ready(function() {
	if (page != null && eval(page) !== null) eval(page).init();
});

/**
 * Singleton for splash page
 */
var helloSplash = {
	/**
	 * Initialize splash page
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

	    // Show Footer

	    $("#splashFooter").css({'opacity': 0}).delay(600).animate(
	      { opacity: 1},
	      { duration: 'slow'}
	    );    
	}
}

/**
 * Singleton for display page
 */
var helloDisplay = {
	/**
	 * Initialize display page
	 */
	init: function() {

		// Get the gistID from the URL and display it

		if (document.URL.indexOf('#') >=0 ) {
			var gistID = document.URL.split('#')[1];
			this.displayGist(gistID);
		}

	},
	/**
	 * Fetch Gist code from GitHub and feed it to Processing.js
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
 */
var helloEditor = {
	editor: null,
	popcorn: null,
	processingInstance: null,
	videoMode: true,
	runCache: "",
	lessonIndex: 1,
	lessons: [
		'/assets/pde/hourofcode_1_ellipses/hourofcode_1_ellipses.pde',
		'/assets/pde/hourofcode_2_color/hourofcode_2_color.pde',
		'/assets/pde/houseofcode_3_mouse_a/houseofcode_3_mouse_a.pde',
		'/assets/pde/houseofcode_4_mousepressed_a/houseofcode_4_mousepressed_a.pde',
	],
	/**
	 * Initialize Ace editor and UI elements
	 */
	init: function () {

		// Configure Editor
		
  		this.editor = ace.edit("editor");
  		this.editor.getSession().setMode("ace/mode/processing");
  		this.editor.setTheme("ace/theme/clouds");
  		this.editor.setShowFoldWidgets(false);

  		// Configure UI

  		this.setupUI();
  		this.loadLesson(1);

  		// Resize callback

    	$( window ).resize(function() {
    		helloEditor.resizeUI();
		});	    

	},
	/**
	 * Initialize UI elements
	 */
	setupUI: function() {

		$("#modalResetCode").click(function(e) {
			helloEditor.editor.setValue(helloEditor.runCache, -1);
			$('#errorModal').modal('hide');
		});

		$("#restartButton").click(function(e) {
      		helloEditor.popcorn.play(0);
    	});

		$("#resetButton").click(function(e) {
      		helloEditor.editor.setValue(helloEditor.runCache, -1);
    	});    	

		$("#pauseButton").click(function(e) {
			if (helloEditor.popcorn.paused()) {
      			helloEditor.popcorn.play();
      			$("#pauseButton").html("Pause");
      		} else {
      			helloEditor.popcorn.pause();
      			$("#pauseButton").html("Play");
      		}
    	});

  		$("#nextButton").click(function() {
      		helloEditor.lessonIndex++;
      		helloEditor.loadLesson(helloEditor.lessonIndex);
    	}); 

		$("#runButton").click(function(e) {
      		helloEditor.runCode();
      		helloEditor.editor.focus();
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
    			
    			var lessonIndex = parseInt($(this).attr("data-index"));
    			helloEditor.loadLesson(lessonIndex);
    			helloEditor.lessonIndex = lessonIndex;

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
	 */
	loadCode: function(index) {
		this.resetInstance();

		$.get(this.lessons[index], function(data) {
			helloEditor.editor.setValue(data, -1);
		})
	},
	/**
	 * Load the indicated lesson
	 */
	loadLesson: function(index) {

    	$(".lessonButton").removeClass("active");
    	$("a[data-index='"+index+"']").addClass("active");

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
	 */
	runCode: function() {
		this.resetInstance();

		try {
			var processingSource = this.editor.getValue();
			var processingCanvas = document.getElementById("editorCanvas");         
			this.processingInstance = new Processing(processingCanvas, processingSource);

			if (typeof this.processingInstance.draw === 'function')
				this.processingInstance.draw();

			helloEditor.runCache = processingSource;
		}
		catch(e) {
			helloEditor.displayError(e);		
		}

	},
	/**
	 * Show the error modal and try to parse the error into something helpful.
	 */
	displayError: function (e) {

		var outputMessage = e.message;

		var search = /Can't find variable: (\w+)/.exec(e.message);
		if (search) {
			outputMessage = "I'm not sure what '" + search[1] + "' means. Maybe it's a typo?"
		}

		$('#errorModalText').html(outputMessage);
		$('#errorModal').modal('show');	

	},
	/**
	 * Creates a new Gist with editor contents and shows share modal
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
