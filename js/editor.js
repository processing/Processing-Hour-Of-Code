"use strict";

/*jslint unparam: true*/

/*global ace */
/*global top */
/*global window */
/*global $ */
/*global Range */
/*global scripts */
/*global document */
/*global Processing */
/*global location */

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
                "goodbye": 5
            };

            if (lessonTable[lessonName]) { this.lessonIndex = lessonTable[lessonName]; }

            if (hash.split("-")[1] !== undefined) { lessonTime = hash.split("-")[1]; }

        }

        this.loadLesson(this.lessonIndex, lessonTime);

        // Resize callback

        $(window).resize(function () {
            helloEditor.refreshUI();
        });

        // Color Picker

        $('#colorPicker').spectrum({
            showInput: false,
            showInitial: true,
            className: "colorPicker",
            chooseText: "Select",
            cancelText: "Cancel",
            show: function () {
                //console.log("SHOWING");
            },
            hide: function () {
                helloEditor.editor.focus();
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

        $("#videoContainer").hover(function () {
            $("#videoCommandsContainer").fadeIn();
        }, function () {
            $("#videoCommandsContainer").fadeOut();
        });

        $("#jumpBack").click(function () {
            var newTime = (helloEditor.popcorn.currentTime() < 10 ) ? 0 : helloEditor.popcorn.currentTime() - 10;
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

        $("#jumpLesson").click(function () {
            helloEditor.lessonIndex += 1;
            helloEditor.loadLesson(helloEditor.lessonIndex, null);
        });            

        $("#restartButton").click(function () {
            scripts[helloEditor.lessonIndex].reset();
            helloEditor.popcorn.play(0);
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

        /* Editor UI */

        $("#runButton").click(function () {
            helloEditor.runCode();
            helloEditor.editor.focus();
        }).tooltip({container: 'body'});

        $("#nextButton").click(function () {
            helloEditor.lessonIndex += 1;
            helloEditor.loadLesson(helloEditor.lessonIndex, null);
        }).tooltip({container: 'body'});

        $("#shareButton").click(function () {
            helloEditor.createGist();
        }).tooltip({container: 'body'});

        $("#resetExample").click(function () {
            helloEditor.loadExample(helloEditor.lessonIndex+1);
            return false;
        }).tooltip({container: 'body', placement: 'right'});

        $("#resetLastLesson").click(function () {
            helloEditor.setCode(scripts[helloEditor.lessonIndex - 1].runCache);
            return false;
        }).tooltip({container: 'body', placement: 'right'});

        $("#resetLastGood").click(function () {
            helloEditor.setCode(scripts[helloEditor.lessonIndex].runCache);
            return false;
        }).tooltip({container: 'body', placement: 'right'});

        /* Error UI */

        $("#modalResetCode").click(function () {
            helloEditor.setCode(scripts[helloEditor.lessonIndex].runCache);
            $('#errorModal').modal('hide');
        });

        /* Share UI */

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
            var intentURL = "http://code.org/api/hour/finish",
                displayURL = $("#shareModal").attr('data-url');
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
        }).tooltip({placement: 'bottom'});

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
            .click(function() {
                helloEditor.popcorn.pause();
            });

        /* Color Picker */

        $(helloEditor.editor).on("click", function () {

            $("#colorPicker").spectrum("hide");

            var editor = helloEditor.editor,
                position = editor.getCursorPosition(),
                token = editor.session.getTokenAt(position.row, position.column),
                line,
                range,
                pixelPosition;

            if (token && /\bcolor\b/.test(token.type)) {

                line = editor.session.getLine(position.row);
                range = new Range(position.row, token.start, position.row, line.length);
                pixelPosition = editor.renderer.$cursorLayer.getPixelPosition(position, true);

                var currentValue = /\w*\s?\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/.exec(line);

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
    setMode: function(newMode) {
        this.displayMode = newMode;
        if (!helloEditor.popcorn.paused()) helloEditor.refreshUI();
    },
    /**
     * Try to keep a sane layout at any browser size.
     * @return {[type]}
     */
    refreshUI: function () {

        var viewportWidth = $("#interface").width(),
            viewportHeight = $("#interface").height(),
            minVideoWidth = 320,
            maxVideoWidth = viewportWidth / 2,
            videoWidth,
            videoHeight;   

        if (this.displayMode == VIDEO_MODE) {

            $("#interface").addClass("videoMode");
            //console.log("Video Mode");

            videoWidth = viewportWidth * 0.80;
            videoHeight = videoWidth / 16 * 9;

            $("#header").css("width", videoWidth + 16);

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

            $("#interface").removeClass("videoMode");
            //console.log("Editor Mode");

            if (viewportWidth - viewportHeight < minVideoWidth) {
                videoWidth = minVideoWidth;
            } else if (viewportWidth - viewportHeight > maxVideoWidth) {
                videoWidth = maxVideoWidth;
            } else {
                videoWidth = viewportWidth - viewportHeight;
            }

            videoHeight = videoWidth / 16 * 9;

            $("#header").width("95%");

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
                    width: videoWidth,
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

        var data = $("#"+id).text();
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

            $("#horizontalRuler").css({width: this.processingInstance.width});
            $("#verticalRuler").css({height: this.processingInstance.height});

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
     * Creates a new Gist with editor contents and shows share modal
     */
    createGist: function () {

        var processingSource = this.editor.getValue();

        if (!(/size\(\s*\d+\s*,\s*\d+\s*\)/.test(processingSource))) {
            processingSource = "size(500,400);\n\n" + processingSource;
        }

        var postURL = "https://api.github.com/gists",
            postData = {
                "description": "Save for Processing Hour of Code",
                "public": true,
                "files": {
                    "demo.pde": {
                        "content": processingSource
                    }
                }
            };

        $.post(postURL, JSON.stringify(postData))
            .done(function (data) {
                var gistID = data.id,
                    displayURL = "http://" + $(location).attr('hostname') + (($(location).attr('port') !== "") ?  ":" + $(location).attr('port') : "") + "/display/#" + gistID;

                $('#shareModal').attr('data-url', displayURL);

                $('#shareModalLink').html($("<a/>").attr({'href': displayURL, target: "_blank"}).html(displayURL));
                $('#shareModal').modal('show');
            });

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

    }
};
