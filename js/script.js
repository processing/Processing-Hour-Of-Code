/**
 * Script for Video One
 */

function loadScriptOne (time) {

	helloEditor.popcorn = Popcorn.vimeo(
		'#video',
		"https://vimeo.com/77249859"
	);	

	if (time != 0) helloEditor.popcorn.play(time);

	// Set initial State

	helloEditor.videoMode = true;
	helloEditor.resizeUI(); 

	$("#hint").hide();
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
				helloEditor.editor.setValue("size(500, 400)\n\nellipse(250, 200, 400, 400);",-1);
			},
			onEnd: function( options ) {
				helloEditor.editor.setValue("");
			}
		})
		.code({
			start: "02:14",
			onStart: function( options ) {
				$("#editorCommands").show();
			},
			onEnd: function( options ) {
				$("#editorCommands").hide();
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

function loadScriptTwo (time) {

	// Reinitialize popcorn instance

	helloEditor.popcorn = Popcorn.vimeo(
		'#video',
		"https://vimeo.com/77716815"
	);

	if (time != 0) helloEditor.popcorn.play(time);	

	// Set initial State

	helloEditor.videoMode = true;
	helloEditor.resizeUI(); 

	// Hide these elements so Dan can introduce them

	$("#hint").hide();
	$("#editorContainer").hide();
	$("#canvasContainer").hide();
	$("#toggleRulers").hide();
	$("#editorCommands").hide();

	// Popcorn Events

	helloEditor.popcorn
		// Leave video mode to introduce other UI elements
		.code({
			start: "06:18",
			onStart: function( options ) {
				helloEditor.videoMode = false;
				helloEditor.resizeUI();
			},
			onEnd: function (options) {
				helloEditor.videoMode = true;
				helloEditor.resizeUI();
			}
		})
		// Show the editor, set the value to nothing
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
		// Show the canvas container
		.code({
			start: "06:33",
			onStart: function( options ) {
				$("#canvasContainer").show();
			},
			onEnd: function( options ) {
				$("#canvasContainer").hide();
			}			
		})
		// Manually set editor contents. This could come from a Gist or something.
		.code({
			start: "06:48",
			onStart: function( options ) {
				helloEditor.editor.setValue("size(500, 400)\n\nellipse(250, 200, 150, 150);",-1);
			},
			onEnd: function( options ) {
				helloEditor.editor.setValue("");
			}
		})
		// Run whatever is in the editor
		.code({
			start: "06:58",
			onStart: function( options ) {
				helloEditor.runCode();
			},
			onEnd: function( options ) {
				helloEditor.resetInstance();
			}			
		})
		// Show the run button (and currently others)
		.code({
			start: "07:06",
			onStart: function( options ) {
				$("#editorCommands").show();
			},
			onEnd: function( options ) {
				$("#editorCommands").hide();
			}			
		})
		// Jump back to video mode for more explainations
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
		// Show the editor and canvas again and insert code
		.code({
			start: "09:36",
			onStart: function( options ) {
				helloEditor.videoMode = false;
				helloEditor.resizeUI();

				$("#editorContainer").show();
				$("#canvasContainer").show();				

				helloEditor.editor.setValue("size(500, 400)\n\nrect(250, 200, 150, 150);",-1);
				helloEditor.resetInstance();
			},
			onEnd: function( options ) {
				helloEditor.videoMode = true;
				helloEditor.resizeUI();

			}			
		})
		// Run the code in the editor
		.code({
			start: "09:51",
			onStart: function( options ) {
				helloEditor.runCode();
			},
			onEnd: function( options ) {
				helloEditor.resetInstance();
			}			
		})
		// Show the rulers
		.code({
			start: "11:13",
			onStart: function( options ) {
				$("#horizontalRuler").show();
				$("#verticalRuler").show();
			},
			onEnd: function( options ) {
				$("#horizontalRuler").hide();
				$("#verticalRuler").hide();
			}			
		})
		// Hide the rulers, show the toggle button
		.code({
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
		})
		// Show the rulers again
		.code({
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
		    
		    // Show the proper hint over the video

		    var hintHTML = $("#hints div[data-index='2']").html();

		    $("#hint").html(hintHTML);
		    $("#hint").show();

		});
}

/**
 * Script for Video Three
 */

function loadScriptThree (time) {

	helloEditor.popcorn = Popcorn.vimeo(
		'#video',
		"https://vimeo.com/77716817"
	);	

	if (time != 0) helloEditor.popcorn.play(time);

	// Set initial State

	helloEditor.videoMode = true;
	helloEditor.resizeUI(); 

	$("#hint").hide();
	$("#editorContainer").hide();
	$("#canvasContainer").hide();

}

/**
 * Script for Video Four
 */

function loadScriptFour (time) {

	helloEditor.popcorn = Popcorn.vimeo(
		'#video',
		"https://vimeo.com/77716816"
	);	

	if (time != 0) helloEditor.popcorn.play(time);

	// Set initial State

	helloEditor.videoMode = true;
	helloEditor.resizeUI(); 

	$("#hint").hide();
	$("#editorContainer").hide();
	$("#canvasContainer").hide();

}

/**
 * Script for Video Five
 */

function loadScriptFive (time) {

	helloEditor.popcorn = Popcorn.vimeo(
		'#video',
		"https://vimeo.com/77716818"
	);

	if (time != 0) helloEditor.popcorn.play(time);

	// Set initial State

	helloEditor.videoMode = true;
	helloEditor.resizeUI(); 

	$("#hint").hide();
	$("#editorContainer").hide();
	$("#canvasContainer").hide();

}

/**
 * Script for Video Six
 */

function loadScriptSix (time) {

	helloEditor.popcorn = Popcorn.vimeo(
		'#video',
		"https://vimeo.com/77249859"
	);

	if (time != 0) helloEditor.popcorn.play(time);

	// Set initial State

	helloEditor.videoMode = true;
	helloEditor.resizeUI(); 

	$("#hint").hide();
	$("#editorContainer").hide();
	$("#canvasContainer").hide();

}