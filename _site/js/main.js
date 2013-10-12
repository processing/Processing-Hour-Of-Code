"use strict";

$("document").ready(function() {

	if (document.URL.indexOf('#') >=0 ) {
		var gistID = document.URL.split('#')[1];
		displayGist(gistID);
	}
});


/**
 * Grabs Gist data and feeds it to a new Processing instance.
 */

function displayGist(gistID) {
	
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
