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
	runCache: [],
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
  		this.editor.setTheme("ace/theme/processing");
  		//this.editor.renderer.setShowGutter(false); 
  		this.editor.setShowFoldWidgets(false);
  		this.editor.setHighlightActiveLine(false);
  		this.editor.renderer.setShowPrintMargin(false);

  		// Configure UI

  		this.setupUI();

  		// Load proper lesson
  		
  		var lessonIndex = 1;
  		var lessonTime = 0;
  		var hash = top.location.hash.replace('#', '');;

  		if (hash.length > 0) {
  			var lessonName = hash.split("-")[0];
  			
  			switch(lessonName) {
  				case "hello":
  					lessonIndex = 1;
  				break;
  				case "shapes":
  					lessonIndex = 2;
  				break;
  				case "color":
  					lessonIndex = 3;
  				break;
  				case "interact":
  					lessonIndex = 4;
  				break;
  				case "decisions":
  					lessonIndex = 5;
  				break;
  				case "goodbye":
  					lessonIndex = 6;
  				break;
  			}	

  			if (hash.split("-")[1] != undefined) lessonTime = hash.split("-")[1];
  			
  		}

  		this.loadLesson(lessonIndex, lessonTime);

  		// Resize callback

    	$( window ).resize(function() {
    		helloEditor.resizeUI();
		});	    

		// Color Picker

		$('#colorPicker').spectrum({
			flat: true,
    		showInput: false,
    		showInitial: true
		}); 

		$("#colorPicker").spectrum("container").hide();

		$(".sp-cancel").click(function(){		
			$("#colorPicker").spectrum("container").hide();
		});

		$(".sp-choose").click(function(){
			var color = $("#colorPicker").spectrum("get").toRgb();

			var range = $("#colorPicker").spectrum.range;
			var token = $("#colorPicker").spectrum.token;

			helloEditor.editor.session.replace(range,token.value + "("+color.r+","+color.g+","+color.b+");");

			$("#colorPicker").spectrum("container").hide();
			helloEditor.editor.focus();
		});

	},
	/**
	 * Initialize UI elements
	 */
	setupUI: function() {

		$("#videoContainer").hover(function(e) {
			$("#videoCommandsContainer").fadeIn();
		},function(e) {
			$("#videoCommandsContainer").fadeOut();
		} );

		$("#modalResetCode").click(function(e) {
			helloEditor.editor.setValue(helloEditor.runCache[helloEditor.lessonIndex], -1);
			$('#errorModal').modal('hide');
		});

		$("#restartButton").click(function(e) {
			$("#hint").hide();
      		helloEditor.popcorn.play(0);
    	});

		$("#resetButton").click(function(e) {
      		helloEditor.editor.setValue(helloEditor.runCache[helloEditor.lessonIndex], -1);
    	}).tooltip({container: 'body'});  	

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
      		helloEditor.loadLesson(helloEditor.lessonIndex, 0);
    	}); 

		$("#runButton").click(function(e) {
      		helloEditor.runCode();
      		helloEditor.editor.focus();
    	}).tooltip({container: 'body'});;

  		$("#shareButton").click(function() {
      		helloEditor.createGist();
    	}).tooltip({container: 'body'});;  

  		$("#modalTweet").click(function() {
  			var intentURL = "https://twitter.com/intent/tweet"
      		var shareURL = $(this).attr('data-url');
      		var shareText = "Check out my first program!";
      		var shareVia = "ProcessingOrg";
      		var shareHashtags = "hourofcode";

      		var tweetURL = intentURL
      			+ "?url=" + encodeURIComponent(shareURL)
      			+ "&text=" + encodeURIComponent(shareText)
      			+ "&via=" + shareVia
      			+ "&hashtags=" + shareHashtags;

      		window.open(tweetURL);

    	});  

    	$("#toggleRulers").click(function() {
    		$("#horizontalRuler").toggle({
    			effect: 'slide',
            	direction: 'down',
        	});
    		$("#verticalRuler").toggle({
    			effect: 'slide',
            	direction: 'right',
        	});
    	}).tooltip({placement:'bottom'});

    	$(".lessonButton").each( function (index, value) {

    		$(value).click( function() {
    			
    			var lessonIndex = parseInt($(this).attr("data-index"));
    			helloEditor.loadLesson(lessonIndex, 0);
    			helloEditor.lessonIndex = lessonIndex;

    		});

    	});

    	// Color Picker

    	$(helloEditor.editor).on("click", function(e) {

    		$("#colorPicker").spectrum("container").hide();

    		var editor = helloEditor.editor;
    		var position = editor.getCursorPosition();
    		var token = editor.session.getTokenAt(position.row, position.column);

			 if (/\bcolor\b/.test(token.type)) {

    			var line = editor.session.getLine(position.row);			
				var range = new Range(position.row,0,position.row,line.length);			

				var pixelPosition = editor.renderer.$cursorLayer.getPixelPosition(position, true);

				$("#colorPicker").spectrum.token = token;
				$("#colorPicker").spectrum.range = range;

				$("#colorPicker").spectrum("container").show();;
				$("#colorPicker").spectrum("container").css( {
					position: "absolute",
					top: pixelPosition.top,
					left: pixelPosition.left
				});

			 }

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

			$("#editorContainer").hide();
			$("#canvasContainer").hide();
			$("#videoContainer").show();

		} else {

			//console.log("Editor Mode");

			var videoWidth = viewportWidth - viewportHeight;
			var videoHeight = videoWidth / 16 * 9;

			$("#videoContainer")
				.css({
					width: videoWidth,
					height: videoHeight,
					left: 8,
					top: 8,
					marginTop: 0,
					marginLeft: 0
				});

			$("#editorContainer")
				.css({
					width:videoWidth,
					height: viewportHeight - videoHeight - 32,
					top: videoHeight + 20,
					left: 8
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
	loadLesson: function(index, time) {

    	$(".lessonButton").removeClass("active");
    	$("a[data-index='"+index+"']").addClass("active");

		$("#video").html("");
		switch(index) {    				
			case 1: // Hello
				loadScriptOne(time);
			break;
			case 2: 			
				loadScriptTwo(time);
			break; 
			case 3:
				loadScriptThree(time);		
			break;
			case 4:
  				loadScriptFour(time);			
			break;
			case 5:
  				loadScriptFive(time);
			break;
			case 6: //Goodbye
  				loadScriptSix(time);
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

			helloEditor.runCache[helloEditor.lessonIndex] = processingSource;
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

				$('#modalTweet').attr('data-url', displayURL);

				$('#shareModalText').html($("<a/>").attr('href',displayURL).html(displayURL));
				$('#shareModal').modal('show');
			});

	},
	showRulers: function() {
		$("#horizontalRuler").show({
			effect: 'slide',
			direction: 'down',
			duration: "fast"
		});
		$("#verticalRuler").show({
			effect: 'slide',
			direction: 'right',
			duration: "fast"
		});
	},
	hideRulers: function() {

		$("#horizontalRuler").hide({
			effect: 'slide',
			direction: 'down',
			duration: "fast"
		});
		$("#verticalRuler").hide({
			effect: 'slide',
			direction: 'right',
			duration: "fast"
		});

	}
}
