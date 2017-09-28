"use strict";

/*global document */
/*global console */
/*global window */
/*global $ */
/*global Processing */
/*global firebase */
/*global Blob */
/*global saveAs */
/*global ace */

/**
 * Singleton for display page
 */
var helloDisplay = {
  processingSource: "",
  editor: null,
  firebaseReference: null,
  /**
   * Initialize display page
   */
  init: function () {

    // Get the gistID from the URL and display it

    if (document.URL.indexOf('#') >= 0) {
      var sketchID = document.URL.split('#')[1];

      if (sketchID[0] === "@") {
        this.displayGallery(sketchID.substr(1));
      } else {
        this.displayGist(sketchID);
      }
    }

    $("#displayCode").click(function () {
      $('#codeModal').modal('show');

      return false;
    });

    $("#displayAdmin").click(function () {
      $('#adminModal').modal('show');

      return false;
    });

    $("#downloadCode").click(function () {

      var blob = new Blob([helloDisplay.processingSource], {
        type: "text/processing;charset=utf-8"
      });
      saveAs(blob, "sketch.pde");

      return false;

    });

    $("#adminForm").submit(function () {

      if ($("#delete").prop('checked')) {

        helloDisplay.firebaseReference.remove().then(function () {
          console.log("Object deleted.");
          window.location.assign("/gallery");
        }).catch(function (error) {
          console.log("Delete failed: " + error.message);
        });

      } else {
        var featureScore = parseInt($("#featureScore").val(), 10);
        if(isNaN(featureScore)) {
          featureScore = 0;
        }
        var hidden = $('#hidden').prop('checked');

        helloDisplay.firebaseReference.update({
          featureScore: featureScore,
          hidden: hidden
        });
      }



      $('#adminModal').modal('hide');

      return false;
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
  displayGist: function (gistID) {

    var apiURL = "https://api.github.com/gists/",
      gistURL = apiURL + gistID;

    $.ajax({
      'url': gistURL,
      'complete': function (data) {

        var gistFiles = data.responseJSON.files,
          gistFile = gistFiles[Object.keys(gistFiles)[0]],
          gistSource = gistFile.content;

        helloDisplay.showSketch(gistSource);
      }
    });
  },
  /**
   * Fetch sketch code Firebase
   */
  displayGallery: function (key) {
    firebase.auth().onAuthStateChanged(function(user) {
      if(user) {
        $("#displayAdmin").show();
      } else {
        $("#displayAdmin").hide();
      }
    });

    helloDisplay.firebaseReference = firebase.database().ref('gallery/' + key);


    helloDisplay.firebaseReference.once('value').then(function (query_result) {
      var sketch = query_result.val();
      console.log("Query complete!");

      helloDisplay.showSketch(sketch.source);

      $("#featureScore").val(sketch.featureScore);

      $('#hidden').prop('checked', sketch.hidden);

      var views = helloDisplay.firebaseReference.child('viewCount');
      views.transaction(function(views) {
        if (!views) {
          return 1;
        } else {
          return views + 1;
        }
      });
    }).catch(function (error) {
      console.log("Object retrieval failed: " + error.message);
    });

  },
  /**
   * Feed sourceto Processing.js
   */
  showSketch: function (source) {

    var processingCanvas,
      processingInstance,
      displayHeight,
      displayWidth;

    helloDisplay.processingSource = source;
    helloDisplay.editor.setValue(source, -1);

    try {
      processingCanvas = document.getElementById("displayCanvas");
      processingInstance = new Processing(processingCanvas, source);

      displayHeight = 400;
      displayWidth = (processingInstance.width / processingInstance.height) * displayHeight;

      $("#displayCanvas").css({
        width: displayWidth,
        height: displayHeight
      });

      $("#displayCanvasBox").css({
        width: displayWidth + ($("#displayInfo").outerWidth() + 10),
        height: displayHeight,
        marginTop: displayHeight / -2,
        marginLeft: (displayWidth + $("#displayInfo").outerWidth() + 10) / -2
      });
    } catch (e) {
      console.log("ERROR! " + e.toString());
    }

  }
};
