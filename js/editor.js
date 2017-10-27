"use strict";

/*jslint unparam: true*/

/*global console */
/*global ace */
/*global firebase */
/*global Popcorn */
/*global top */
/*global window */
/*global $ */
/*global Range */
/*global scripts */
/*global document */
/*global Processing */
/*global location */
/*global Modernizr */

/**
 * Some Constants
 */

var VIDEO_MODE = 0;
var EDITOR_MODE = 1;

/**
 * Singleton for the editor page
 */
var helloEditor = {
  editor: null,
  popcorn: null,
  processingInstance: null,
  displayMode: VIDEO_MODE,
  lessonIndex: 0,
  confirmExit: false,
  /**
   * Initialize Ace editor and UI elements
   */
  init: function () {

    // Configure Editor

    this.editor = ace.edit("editor");
    this.editor.getSession().setMode("ace/mode/processing");
    this.editor.setTheme("ace/theme/processing");
    // this.editor.renderer.setShowGutter(false);
    this.editor.setShowFoldWidgets(false);
    this.editor.setHighlightActiveLine(false);
    this.editor.renderer.setShowPrintMargin(false);

    // Configure UI

    this.setupUI();

    // Load proper lesson

    var lessonTime = null,
      lessonName,
      lessonTable,
      hash = top.location.hash.replace('#', '');

    if (hash.length > 0) {
      lessonName = hash.split("-")[0];

      lessonTable = {
        "hello": 0,
        "shapes": 1,
        "color": 2,
        "interact": 3,
        "questions": 4,
        "goodbye": 5,
        "editor": 6
      };

      if (lessonTable[lessonName]) {
        this.lessonIndex = lessonTable[lessonName];
      }

      if (hash.split("-")[1] !== undefined) {
        lessonTime = hash.split("-")[1];
      }

    }

    this.loadLesson(this.lessonIndex, lessonTime);

    // Resize callback

    $(window).resize(function () {
      helloEditor.refreshUI();
    });

    // Unload Callback

    $(window).bind('beforeunload', function () {
      if (helloEditor.confirmExit) {
        return "Unsaved changes in the editor will be lost. Be sure you've copied your code to a safe place or used the share button.";
      }
    });


    // Color Picker

    $('#colorPicker').spectrum({
      showInput: false,
      showInitial: true,
      className: "colorPicker",
      chooseText: "Select",
      cancelText: "Cancel",
      show: function () {
        if (Modernizr.touch) {
          document.activeElement.blur();
          window.focus();
        }
      },
      move: function () {
        if (Modernizr.touch) {
          document.activeElement.blur();
          window.focus();
        }
      },
      hide: function () {
        if (!Modernizr.touch) {
          helloEditor.editor.focus();
        }
      },
      change: function () {
        var color = $("#colorPicker").spectrum("get").toRgb(),
          range = $("#colorPicker").spectrum.range,
          token = $("#colorPicker").spectrum.token;

        helloEditor.editor.session.replace(range, token.value + "(" + color.r + "," + color.g + "," + color.b + ");");

      }
    });

    helloEditor.refreshUI();

  },
  /**
   * Initialize UI elements
   */
  setupUI: function () {

    /* Video UI */

    $("#jumpBack").click(function () {
      var newTime = (helloEditor.popcorn.currentTime() < 10) ? 0 : helloEditor.popcorn.currentTime() - 10;
      helloEditor.popcorn.pause();
      scripts[helloEditor.lessonIndex].reset();
      helloEditor.popcorn.currentTime(0);
      helloEditor.popcorn.play(newTime);
    });

    $("#jumpExercise").click(function () {
      var newTime = scripts[helloEditor.lessonIndex].exerciseTime;
      if (newTime) {
        helloEditor.popcorn.pause();
        scripts[helloEditor.lessonIndex].reset();
        helloEditor.popcorn.currentTime(0);
        helloEditor.popcorn.play(newTime);
      }
    });

    $("#jumpEnd").click(function () {
      var newTime = scripts[helloEditor.lessonIndex].exerciseTime;
      if (newTime) {
        helloEditor.popcorn.pause();
        scripts[helloEditor.lessonIndex].reset();
        helloEditor.popcorn.currentTime(0);
        helloEditor.popcorn.play(newTime);
      }
    });

    $("#jumpLesson").click(function () {
      helloEditor.lessonIndex += 1;
      helloEditor.loadLesson(helloEditor.lessonIndex, null);
    });

    $("#restartButton").click(function () {
      scripts[helloEditor.lessonIndex].reset();
      helloEditor.popcorn.play(0);
    });

    $("#captionsButton").click(function () {
      helloEditor.toggleCaptions();
    });

    $("#pauseButton").click(function () {
      if (helloEditor.popcorn.paused()) {
        helloEditor.popcorn.play();
        $("#pauseButton").html('<span class="glyphicon glyphicon-pause"></span> Pause');
      } else {
        helloEditor.popcorn.pause();
        $("#pauseButton").html('<span class="glyphicon glyphicon-play"></span> Play');
      }
    });

    (function() {
      var seeking = false;

      $("#footer").mousedown(function(ev) {
        seeking = true;
        seek(ev);
      });

      $("#footer").mousemove(function(ev) {
        if (seeking) {
          seek(ev);
        }
      });

      $("#footer").mouseup(function(ev) {
        seeking = false;
      });
      $("#footer").mouseout(function(ev) {
        seeking = false;
      });

      function seek(ev) {
        if (helloEditor.popcorn) {
          var pop = helloEditor.popcorn;
          var pos = ev.pageX - $("#transport").offset().left;
          pos /= $("#transport").width();
          pos = Math.min(0.999, Math.max(0, pos));
          pos *= pop.duration();
          if(pop.ended()) {
            $("#hint").hide();
            //pop.currentTime(0);
            pop.play(pos);
            pop.currentTime(pos);
          } else {
            pop.currentTime(pos);
          }
        }
      };
    })();

    if (!Modernizr.touch) {
      $('[data-toggle="tooltip"]').tooltip({
        container: 'body'
      });
    }

    /* Editor UI */

    $("#runButton").click(function (event) {
      helloEditor.runCode();
      if (!Modernizr.touch) {
        helloEditor.editor.focus();
      }
    });

    $("#nextButton").click(function () {
      helloEditor.lessonIndex += 1;
      helloEditor.loadLesson(helloEditor.lessonIndex, null);
    });

    $("#shareButton").click(function () {
      //helloEditor.addToGallery();

      helloEditor.showShareConfirm();
    });

    $("#resetExample").click(function () {
      helloEditor.loadExample(helloEditor.lessonIndex + 1);
      return false;
    });

    $("#resetLastLesson").click(function () {
      helloEditor.setCode(scripts[helloEditor.lessonIndex - 1].runCache);
      return false;
    });

    $("#resetLastGood").click(function () {
      helloEditor.setCode(scripts[helloEditor.lessonIndex].runCache);
      return false;
    });

    if (!Modernizr.touch) {
      $("#runButton").tooltip({
        container: 'body'
      });
      $("#nextButton").tooltip({
        container: 'body'
      });
      $("#shareButton").tooltip({
        container: 'body'
      });
      $("#resetExample").tooltip({
        container: 'body',
        placement: 'right'
      });
      $("#resetLastLesson").tooltip({
        container: 'body',
        placement: 'right'
      });
      $("#resetLastGood").tooltip({
        container: 'body',
        placement: 'right'
      });
    }

    /* Error UI */

    $("#modalResetCode").click(function () {
      helloEditor.setCode(scripts[helloEditor.lessonIndex].runCache);
      $('#errorModal').modal('hide');
    });

    /* Share UI */

    $("#modalConfirmButton").click(function () {

      var hidden = !$("#modalGalleryCheckbox").prop('checked');

      $('#confirmModal').modal('hide');
      helloEditor.addToGallery(hidden);
    });

    $("#modalGoogleButton").click(function () {

      var shareURL = "https://plus.google.com/share",
        displayURL = $("#shareModal").attr('data-url'),
        googleURL = shareURL +
            "?url=" + encodeURIComponent(displayURL);

      window.open(googleURL);

    });

    $("#modalFacebookButton").click(function () {

      var shareURL = "http://www.facebook.com/sharer/sharer.php",
        displayURL = $("#shareModal").attr('data-url'),
        shareTitle = "Hello, Processing",
        shareSummary = "Check out my first program!",
        facebookURL = shareURL +
          "?s=100" +
          "&p[url]=" + encodeURIComponent(displayURL) +
          "&p[images][0]=" +
          "&p[title]=" + encodeURIComponent(shareTitle) +
          "&p[summary]=" + encodeURIComponent(shareSummary);

      window.open(facebookURL);

    });

    $("#modalTwitterButton").click(function () {
      var intentURL = "https://twitter.com/intent/tweet",
        displayURL = $("#shareModal").attr('data-url'),
        shareText = "Check out my first program!",
        shareVia = "ProcessingOrg",
        shareHashtags = "hourofcode",
        tweetURL = intentURL +
          "?url=" + encodeURIComponent(displayURL) +
          "&text=" + encodeURIComponent(shareText) +
          "&via=" + shareVia +
          "&hashtags=" + shareHashtags;

      window.open(tweetURL);

    });

    $("#modalHourButton").click(function () {
      var intentURL = "http://code.org/api/hour/finish";
      window.open(intentURL);

    });

    /* Canvas UI */

    $("#toggleRulers").click(function () {
      $("#horizontalRuler").toggle({
        effect: 'slide',
        direction: 'down'
      });
      $("#verticalRuler").toggle({
        effect: 'slide',
        direction: 'right'
      });
    });

    if (!Modernizr.touch) {
      $("#toggleRulers").tooltip({
        placement: 'bottom'
      });
    }

    /* Nav Menu */

    $(".lessonButton").each(function (key, value) {

      $(value).click(function () {

        var lessonIndex = $(this).attr("data-index");
        helloEditor.loadLesson(lessonIndex, null);
        helloEditor.lessonIndex = Number(lessonIndex);

        return false;
      });

    });

    $("#pageNav")
      .find('a').attr('target', "_blank")
      .click(function () {
        helloEditor.popcorn.pause();
      });

    /* Color Picker */

    $(helloEditor.editor).on("click", function (event) {

      $("#colorPicker").spectrum("hide");

      var editor = helloEditor.editor,
        position = editor.getCursorPosition(),
        token = editor.session.getTokenAt(position.row, position.column),
        line,
        range,
        pixelPosition,
        currentValue;

      if (token && /\bcolor\b/.test(token.type)) {

        line = editor.session.getLine(position.row);
        range = new Range(position.row, token.start, position.row, line.length);
        pixelPosition = editor.renderer.$cursorLayer.getPixelPosition(position, true);

        currentValue = /\w*\s?\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/.exec(line);

        if (currentValue) {
          $("#colorPicker").spectrum('set', 'rgb(' + currentValue[1] + ', ' + currentValue[2] + ', ' + currentValue[3] + ')');
        } else {
          $("#colorPicker").spectrum('set', 'black');
        }

        $("#colorPicker").spectrum.token = token;
        $("#colorPicker").spectrum.range = range;

        $("#colorPicker").css({
          top: pixelPosition.top,
          left: pixelPosition.left
        });

        $("#colorPicker").spectrum("show");

        return false;
      }

    });

  },
  /**
   * Change display mode
   */
  setMode: function (newMode) {
    this.displayMode = newMode;
    if (helloEditor.popcorn && !helloEditor.popcorn.paused()) {
      helloEditor.refreshUI();
    }
  },
  /**
   * Build a new popcorn instance on video change
   */
  refreshPopcorn: function (time, vimeoURL, subtitleURL) {

    $("#video").html("");
    $("#videoSubtitles").html("");

    helloEditor.popcorn = Popcorn.smart("#video", vimeoURL);

    helloEditor.popcorn.play(time);
    helloEditor.popcorn.unmute();
    helloEditor.popcorn.volume(1.0);
    helloEditor.popcorn.defaults("subtitle", {
      target: "videoSubtitles"
    });
    helloEditor.popcorn.parseSRT(subtitleURL);
    helloEditor.popcorn.disable("subtitle");

    helloEditor.popcorn.on("timeupdate", function (e) {
      var position = helloEditor.popcorn.currentTime() / helloEditor.popcorn.duration();
      var width = position * $("#transport").width();
      $("#progress").css('width', width);
    });

  },
  /**
   * Try to keep a sane layout at any browser size.
   */
  refreshUI: function () {

    var viewportWidth = $("#interface").innerWidth(),
      viewportHeight = $("#interface").innerHeight(),
      videoWidth,
      videoHeight;

    if (this.displayMode === VIDEO_MODE) {

      helloEditor.confirmExit = false;

      $("#interface").addClass("videoMode");
      //console.log("Video Mode");

      videoWidth = viewportWidth * 0.80;
      videoHeight = videoWidth / 16 * 9;
      if(videoHeight > viewportHeight) {
        videoHeight = viewportHeight;
        videoWidth = videoHeight / 9 * 16;
      }

      $("#header").css("width", videoWidth);
      // $("#transport").css("width", videoWidth);
      // Don't change this so that it suits seeking more intuitively.
      $("#transport").css("width", viewportWidth - 16);

      $("#videoContainer")
        .css({
          width: videoWidth,
          height: videoHeight,
          left: "50%",
          top: "50%",
          marginTop: videoHeight / -2,
          marginLeft: videoWidth / -2
        }).show();

    } else {

      helloEditor.confirmExit = true;

      $("#interface").removeClass("videoMode");

      videoWidth = viewportWidth - 500;

      if (videoWidth > viewportWidth / 2) { videoWidth = viewportWidth / 2; }

      videoHeight = videoWidth / 16 * 9;

      $("#header").width(viewportWidth - 16);
      $("#transport").css("width", viewportWidth - 16);

      $("#videoContainer")
        .css({
          width: videoWidth - 8,
          height: videoHeight,
          left: 8,
          top: 8,
          marginTop: 0,
          marginLeft: 0
        })
        .show();

      $("#editorContainer")
        .css({
          top: 8 + 8 + videoHeight,
          left: 8,
          width: videoWidth - 8,
          bottom: 8
        });

      $("#editor").height($("#editorContainer").height() - $("#editorCommands").height() - 8);

      $("#canvasContainer")
        .height(viewportHeight)
        .width(viewportWidth - videoWidth)
        .css({
          top: 0,
          left: videoWidth,
        });

    }
  },
  /**
   * Reset the Processing.js instance
   */
  resetInstance: function () {
    if (this.processingInstance) {
      this.processingInstance.exit();
      this.processingInstance.background("#cfcfcf");
      this.processingInstance = null;
    }
  },
  /**
   * Populates the editor with a string
   */
  setCode: function (code) {
    helloEditor.editor.setValue(code, -1);
  },
  /**
   * Populates the editor from a URL
   */
  loadCode: function (url, callback) {
    this.resetInstance();

    $.get(url, function (data) {
      helloEditor.editor.setValue(data, -1);
      callback();
    });
  },
  /**
   * Load the indicated lesson example
   */
  loadExample: function (index) {

    var data = $("script[data-index='" + index + "']").text();
    data = $.trim(data);
    helloEditor.editor.setValue(data, -1);

  },
  /**
   * Load the indicated lesson snippet
   */
  loadSnippet: function (id) {

    var data = $("#" + id).text();
    data = $.trim(data);
    helloEditor.editor.setValue(data, -1);

  },
  /**
   * Load the indicated lesson
   */
  loadLesson: function (index, time) {

    $(".lessonButton").removeClass("active");
    $("a[data-index='" + index + "']").addClass("active");

    scripts[index].init(time);

    $("#progress").css('width', 0);

  },
  /**
   * Run current code in Ace
   */
  runCode: function () {
    this.resetInstance();

    try {
      var processingSource = this.editor.getValue(),
        processingCanvas = document.getElementById("editorCanvas");

      if (!(/size\(\s*\d+\s*,\s*\d+\s*\)/.test(processingSource))) {
        processingSource = "size(500,400);\n\n" + processingSource;
      }

      this.processingInstance = new Processing(processingCanvas, processingSource);

      if (typeof this.processingInstance.draw === 'function') {
        this.processingInstance.draw();
      }

      // Store successful code in cache

      scripts[this.lessonIndex].runCache = this.editor.getValue();

      // Resize Canvas Container

      $("#editorCanvasBox").css({
        width: this.processingInstance.width,
        height: this.processingInstance.height,
        marginTop: this.processingInstance.height / -2,
        marginLeft: this.processingInstance.width / -2
      });

      $("#horizontalRuler").css({
        width: this.processingInstance.width
      });
      $("#verticalRuler").css({
        height: this.processingInstance.height
      });

    } catch (e) {
      helloEditor.displayError(e);
    }

  },
  /**
   * Show the error modal and try to parse the error into something helpful.
   */
  displayError: function (e) {

    // This table is an array of pairs consisting of a regular
    // expression and a friendly replacement string which can
    // include values matched in the regex. Pair one example:
    //
    // Input Javascript Error:
    // Can't find variable: rectt
    // Output Friendly Error:
    // I'm not sure what 'rect' means. Maybe it's a typo?

    var i,
      regex,
      string,
      outputMessage = e.message,
      errorTable = [
        [
          /Can't find variable: (\w+)/,
          "I'm not sure what '$1' means. Maybe it's a typo?"
        ],
        [
          /(Une|E)xpected token '(\)|\()'/,
          "Looks like your parentheses don't match up. Remember, you need a right parenthesis for every left parenthesis."
        ]
      ];

    for (i = 0; i < errorTable.length; i += 1) {
      regex = errorTable[i][0];
      string = errorTable[i][1];

      if (regex.test(outputMessage)) {
        outputMessage = outputMessage.replace(regex, string);
        break;
      }
    }

    $('#errorModalText').html(outputMessage);
    $('#errorModal').modal('show');
  },

  /**
   * Adds to the gallery hosted on Parse
   */
  addToGallery: function (hidden) {

    // Post to Parse

    var processingSource = this.editor.getValue();
    if (!(/size\(\s*\d+\s*,\s*\d+\s*\)/.test(processingSource))) {
      processingSource = "size(500,400);\n\n" + processingSource;
    }

    var processingCanvas = document.getElementById("editorCanvas");
    var uri = processingCanvas.toDataURL('image/jpeg');

    var galleryData = {
      source: processingSource,
    };

    firebase.database().ref('sketches/').push(galleryData).then(function(query_result) {
      var image = firebase.storage().ref('gallery/' + query_result.key + '.jpg');
      image.putString(uri, 'data_url');
      var displayURL = "http://" + $(location).attr('hostname') + (($(location).attr('port') !== "") ? ":" + $(location).attr('port') : "") + "/display/#@" + query_result.key;
      helloEditor.showShare(displayURL);
      if(!hidden) {
        firebase.database().ref('gallery/').child(query_result.key).set({
          featureScore: 0,
          viewCount: 0
        });
      }
    }).catch(function(err) {
      console.log("Error pushing to gallery: ", err.message);
    });
  },

  showShareConfirm: function () {
    $('#confirmModal').modal('show');
  },
  showShare: function (displayURL) {

    $('#shareModal').attr('data-url', displayURL);

    $('#shareModalLink').html($("<a/>").attr({
      'href': displayURL,
      target: "_blank"
    }).html(displayURL));
    $('#shareModal').modal('show');

  },
  showRulers: function () {
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
  hideRulers: function () {

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

  },
  showHint: function (index) {

    var hintHTML = $("#hints div[data-index='" + index + "']").html();

    $("#hint").html(hintHTML);
    $("#hint").find("a").attr("target", "_blank");
    $("#hint").show();

  },
  toggleCaptions: function () {
    console.log("Toggle Captions");
    helloEditor.popcorn.toggle("subtitle");
  }
};
