/**
 * Script for Video One
 */

function loadScriptOne () {

	helloEditor.popcorn = Popcorn.vimeo(
		'#video',
		"https://vimeo.com/77249859"
	);	

	// Set initial State

	helloEditor.videoMode = true;
	helloEditor.resizeUI(); 

	$("#hints").hide();
	$("#editorContainer").hide();
	$("#canvasContainer").hide();

	// Popcorn Events

	helloEditor.popcorn
		.code({
			start: "01:15",
			onStart: function( options ) {
				helloEditor.videoMode = false;
				helloEditor.resizeUI();
			},
			onEnd: function (options) {
				helloEditor.videoMode = true;
				helloEditor.resizeUI();
			}
		})
		.code({
			start: "01:22",
			onStart: function( options ) {
				$("#editorContainer").show();
				helloEditor.editor.setValue();
			},
			onEnd: function( options ) {
				$("#editorContainer").hide();
			}
		})
		.code({
			start: "01:27",
			onStart: function( options ) {
				helloEditor.editor.setValue("size(500, 400)\n\nellipse(250, 200, 400, 400);");
			},
			onEnd: function( options ) {
				helloEditor.editor.setValue("");
			}
		})
		.code({
			start: "02:14",
			onStart: function( options ) {
				$("#commands").show();
			},
			onEnd: function( options ) {
				$("#commands").hide();
			}			
		})
		.code({
			start: "02:41",
			onStart: function( options ) {
				$("#canvasContainer").show();
			},
			onEnd: function( options ) {
				$("#canvasContainer").hide();
			}			
		})
		.code({
			start: "02:45",
			onStart: function( options ) {
				helloEditor.runCode();
			},
			onEnd: function( options ) {
				helloEditor.resetInstance();
			}			
		})
		.code({
			start: "03:15",
			onStart: function( options ) {
				helloEditor.videoMode = true;
				helloEditor.resizeUI();
			},
			onEnd: function( options ) {
				helloEditor.videoMode = false;
				helloEditor.resizeUI();
			}			
		});		

		// End Event
		
		helloEditor.popcorn.on("ended", function() {  
		    
		    

		});
}

/**
 * Script for Video Two
 */

function loadScriptTwo () {

	helloEditor.popcorn = Popcorn.vimeo(
		'#video',
		"https://vimeo.com/77716815"
	);

	// Set initial State

	helloEditor.videoMode = true;
	helloEditor.resizeUI(); 

	$("#hints").hide();
	$("#editorContainer").hide();
	$("#canvasContainer").hide();
	$("#toggleRulers").hide();
	$("#commands").hide();

	// Popcorn Events

	helloEditor.popcorn
		.code({
			start: "06:18",
			onStart: function( options ) {
				console.log("SUP");
				helloEditor.videoMode = false;
				helloEditor.resizeUI();
			},
			onEnd: function (options) {
				helloEditor.videoMode = true;
				helloEditor.resizeUI();
			}
		})
		.code({
			start: "06:20",
			onStart: function( options ) {
				$("#editorContainer").show();
				helloEditor.editor.setValue();
			},
			onEnd: function( options ) {
				$("#editorContainer").hide();
			}
		})
		.code({
			start: "06:33",
			onStart: function( options ) {
				$("#canvasContainer").show();
			},
			onEnd: function( options ) {
				$("#canvasContainer").hide();
			}			
		}).code({
			start: "06:48",
			onStart: function( options ) {
				helloEditor.editor.setValue("size(500, 400)\n\nellipse(250, 200, 150, 150);");
			},
			onEnd: function( options ) {
				helloEditor.editor.setValue("");
			}
		})
		.code({
			start: "06:58",
			onStart: function( options ) {
				helloEditor.runCode();
			},
			onEnd: function( options ) {
				helloEditor.resetInstance();
			}			
		})
		.code({
			start: "07:06",
			onStart: function( options ) {
				$("#commands").show();
			},
			onEnd: function( options ) {
				$("#commands").hide();
			}			
		})
		.code({
			start: "07:50",
			onStart: function( options ) {
				helloEditor.videoMode = true;
				helloEditor.resizeUI();
			},
			onEnd: function( options ) {
				helloEditor.videoMode = false;
				helloEditor.resizeUI();

				$("#editorContainer").show();
				$("#canvasContainer").show();					
			}			
		})
		.code({
			start: "09:36",
			onStart: function( options ) {
				helloEditor.videoMode = false;
				helloEditor.resizeUI();

				$("#editorContainer").show();
				$("#canvasContainer").show();				

				helloEditor.editor.setValue("size(500, 400)\n\nrect(250, 200, 150, 150);");
				helloEditor.resetInstance();
			},
			onEnd: function( options ) {
				helloEditor.videoMode = true;
				helloEditor.resizeUI();

			}			
		}).code({
			start: "09:51",
			onStart: function( options ) {
				helloEditor.runCode();
			},
			onEnd: function( options ) {
				helloEditor.resetInstance();
			}			
		}).code({
			start: "11:13",
			onStart: function( options ) {
				$("#horizontalRuler").show();
				$("#verticalRuler").show();
			},
			onEnd: function( options ) {
				$("#horizontalRuler").hide();
				$("#verticalRuler").hide();
			}			
		}).code({
			start: "11:17",
			onStart: function( options ) {
				$("#horizontalRuler").hide();
				$("#verticalRuler").hide();
				$("#toggleRulers").show();
			},
			onEnd: function( options ) {
				$("#horizontalRuler").show();
				$("#verticalRuler").show();
				$("#toggleRulers").hide();
			}			
		}).code({
			start: "11:22",
			onStart: function( options ) {
				$("#horizontalRuler").show();
				$("#verticalRuler").show();
			},
			onEnd: function( options ) {
				$("#horizontalRuler").hide();
				$("#verticalRuler").hide();
			}			
		});		

		// End Event
		
		helloEditor.popcorn.on("ended", function() {  
		    
		    $("#hints").show();

		});
}

/**
 * Script for Video Three
 */

function loadScriptThree () {

	helloEditor.popcorn = Popcorn.vimeo(
		'#video',
		"https://vimeo.com/77716817"
	);	

	// Set initial State

	helloEditor.videoMode = true;
	helloEditor.resizeUI(); 

	$("#hints").hide();
	$("#editorContainer").hide();
	$("#canvasContainer").hide();

}

/**
 * Script for Video Four
 */

function loadScriptFour () {

	helloEditor.popcorn = Popcorn.vimeo(
		'#video',
		"https://vimeo.com/77716816"
	);	

	// Set initial State

	helloEditor.videoMode = true;
	helloEditor.resizeUI(); 

	$("#hints").hide();
	$("#editorContainer").hide();
	$("#canvasContainer").hide();

}

/**
 * Script for Video Five
 */

function loadScriptFive () {

	helloEditor.popcorn = Popcorn.vimeo(
		'#video',
		"https://vimeo.com/77716818"
	);

	// Set initial State

	helloEditor.videoMode = true;
	helloEditor.resizeUI(); 

	$("#hints").hide();
	$("#editorContainer").hide();
	$("#canvasContainer").hide();

}

/**
 * Script for Video Six
 */

function loadScriptSix () {

	helloEditor.popcorn = Popcorn.vimeo(
		'#video',
		"https://vimeo.com/77249859"
	);

	// Set initial State

	helloEditor.videoMode = true;
	helloEditor.resizeUI(); 

	$("#hints").hide();
	$("#editorContainer").hide();
	$("#canvasContainer").hide();

}