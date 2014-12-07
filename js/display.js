"use strict";

/*global document */
/*global window */
/*global $ */
/*global Processing */
/*global Parse */
/*global Blob */
/*global saveAs */
/*global ace */

/**
 * Singleton for display page
 */
var helloDisplay = {
  processingSource: "",
  editor: null,
  parseObject: null,
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

        helloDisplay.parseObject.destroy({
          success: function () {
            console.log("Object deleted.");
            window.location.assign("/gallery");
          },
          error: function (myObject, error) {
            console.log("Delete failed: " + error.message);
          }
        });


      } else {

        var featureScore = parseInt($("#featureScore").val(), 10);
        var hidden = $('#hidden').prop('checked');

        helloDisplay.parseObject.set("featureScore", featureScore);
        helloDisplay.parseObject.set("hidden", hidden);
        helloDisplay.parseObject.save();
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
   * Fetch sketch code Parse
   */
  displayGallery: function (parseID) {

    Parse.initialize("x8FmMInL8BbVeBqonPzgvS8WNKbPro65Li5DzTI0", "Y7PPNnhLPhCdFMAKgw7amBxGerz67gAnG3UKb53s");

    if (Parse.User.current() !== null) {
      $("#displayAdmin").show();
    }

    var GalleryObject = Parse.Object.extend("Gallery");
    var query = new Parse.Query(GalleryObject);
    console.log("Query start!");
    query.get(parseID, {
      success: function (gallery) {
        console.log("Query complete!");

        helloDisplay.parseObject = gallery;
        helloDisplay.showSketch(gallery.get("source"));

        $("#featureScore").val(gallery.get("featureScore"));

        $('#hidden').prop('checked', gallery.get("hidden"));

        Parse.Cloud.run('incrementViewCount', {
          id: gallery.id
        }, {
          error: function (error) {
            console.log("View increment failed: " + error.message);
          }
        });

      },
      error: function (myObject, error) {
        console.log("Object retrieval failed: " + error.message);
      }
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