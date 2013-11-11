"use strict";
/**
 * Singleton for display page
 */
var helloDisplay = {
	processingSource: "",
	editor: null,
	/**
	 * Initialize display page
	 */
	init: function() {

		// Get the gistID from the URL and display it

		if (document.URL.indexOf('#') >=0 ) {
			var gistID = document.URL.split('#')[1];
			this.displayGist(gistID);
		}

		$("#displayCode").click( function() {
			$('#codeModal').modal('show');
		});

		$("#modalDownloadButton").click( function() {
			
			var blob = new Blob([helloDisplay.processingSource], {type: "text/processing;charset=utf-8"});
			saveAs(blob, "sketch.pde");			

		});

		// Initialize Editor
		
  		this.editor = ace.edit("displayEditor");
  		this.editor.getSession().setMode("ace/mode/processing");
  		this.editor.setTheme("ace/theme/processing");
  		//this.editor.renderer.setShowGutter(false); 
  		this.editor.setShowFoldWidgets(false);
  		this.editor.setHighlightActiveLine(false);
  		this.editor.renderer.setShowPrintMargin(false);		
  		this.editor.setReadOnly(true);
  		

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

				helloDisplay.processingSource = gistSource;
				helloDisplay.editor.setValue(gistSource, -1);

	    		try {			
					var processingCanvas = document.getElementById("displayCanvas");    			
					var processingInstance = new Processing(processingCanvas, gistSource);

					$("#displayCanvasBox").css( {
						width: processingInstance.width,
						height: processingInstance.height,
						marginTop: processingInstance.height / -2,
						marginLeft: processingInstance.width / -2,
					});
			    } catch (e) {
			      	console.log("ERROR! " + e.toString());
			    }			
			}
		});
	}
};
