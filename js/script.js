function loadScript (popcorn) {

	popcorn
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
				helloEditor.editor.setValue("size(600, 600)\n\nellipse(300, 300, 400, 400);");
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
}