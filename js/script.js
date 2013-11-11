"use strict";

/*global helloEditor */
/*global Popcorn */
/*global $ */

/**
 * Script for Video One
 */

var scriptOne = {
    vimeoURL: "https://vimeo.com/77249859",
    exampleURL: null,
    init: function (time) {

        helloEditor.popcorn = Popcorn.vimeo('#video', this.vimeoURL);
        helloEditor.popcorn.play(time);

        // Set initial State

        $("#hint").hide();
        $("#editorContainer").hide();
        $("#canvasContainer").hide();

        // Popcorn Events

        helloEditor.popcorn
            .code({
                start: "01:15",
                onStart: function () {
                    helloEditor.videoMode = false;
                    helloEditor.resizeUI();
                },
                onEnd: function () {
                    helloEditor.videoMode = true;
                    helloEditor.resizeUI();
                }
            })
            .code({
                start: "01:22",
                onStart: function () {
                    $("#editorContainer").show();
                    helloEditor.editor.setValue();
                },
                onEnd: function () {
                    $("#editorContainer").hide();
                }
            })
            .code({
                start: "01:27",
                onStart: function () {
                    helloEditor.editor.setValue("ellipse(250, 200, 400, 400);", -1);
                },
                onEnd: function () {
                    helloEditor.editor.setValue("");
                }
            })
            .code({
                start: "02:14",
                onStart: function () {
                    $("#editorCommands").show();
                },
                onEnd: function () {
                    $("#editorCommands").hide();
                }
            })
            .code({
                start: "02:41",
                onStart: function () {
                    $("#canvasContainer").show();
                },
                onEnd: function () {
                    $("#canvasContainer").hide();
                }
            })
            .code({
                start: "02:45",
                onStart: function () {
                    helloEditor.runCode();
                },
                onEnd: function () {
                    helloEditor.resetInstance();
                }
            })
            .code({
                start: "03:15",
                onStart: function () {
                    helloEditor.videoMode = true;
                    helloEditor.resizeUI();
                },
                onEnd: function () {
                    helloEditor.videoMode = false;
                    helloEditor.resizeUI();
                }
            });

        // End Event

        helloEditor.popcorn.on("ended", function () {

            var hintHTML = $("#hints div[data-index='2']").html();

            $("#hint").html(hintHTML);
            $("#hint").show();

        });
    }
};

/**
 * Script for Video Two
 */

var scriptTwo = {
    vimeoURL: "https://vimeo.com/77716815",
    exampleURL: "/assets/pde/hourofcode_1_ellipses/hourofcode_1_ellipses.pde",
    init: function (time) {

        helloEditor.popcorn = Popcorn.vimeo('#video', this.vimeoURL);
        helloEditor.popcorn.play(time);

        // Set initial State

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
                onStart: function () {
                    helloEditor.videoMode = false;
                    helloEditor.resizeUI();
                },
                onEnd: function () {
                    helloEditor.videoMode = true;
                    helloEditor.resizeUI();
                }
            })
            // Show the editor, set the value to nothing
            .code({
                start: "06:20",
                onStart: function () {
                    $("#editorContainer").fadeIn("fast");
                    helloEditor.editor.setValue();
                },
                onEnd: function () {
                    $("#editorContainer").hide();
                }
            })
            // Show the canvas container
            .code({
                start: "06:33",
                onStart: function () {
                    $("#canvasContainer").fadeIn("fast");
                },
                onEnd: function () {
                    $("#canvasContainer").hide();
                }
            })
            // Manually set editor contents. This could come from a Gist or something.
            .code({
                start: "06:48",
                onStart: function () {
                    helloEditor.editor.setValue("ellipse(250, 200, 150, 150);", -1);
                },
                onEnd: function () {
                    helloEditor.editor.setValue("");
                }
            })
            // Run whatever is in the editor
            .code({
                start: "06:58",
                onStart: function () {
                    helloEditor.runCode();
                },
                onEnd: function () {
                    helloEditor.resetInstance();
                }
            })
            // Show the run button (and currently others)
            .code({
                start: "07:06",
                onStart: function () {
                    $("#editorCommands").fadeIn("fast");
                },
                onEnd: function () {
                    $("#editorCommands").hide();
                }
            })
            // Jump back to video mode for more explainations
            .code({
                start: "07:50",
                onStart: function () {
                    helloEditor.videoMode = true;
                    helloEditor.resizeUI();
                },
                onEnd: function () {
                    helloEditor.videoMode = false;
                    helloEditor.resizeUI();

                    $("#editorContainer").show();
                    $("#canvasContainer").show();
                }
            })
            // Show the editor and canvas again and insert code
            .code({
                start: "09:36",
                onStart: function () {
                    helloEditor.videoMode = false;
                    helloEditor.resizeUI();

                    $("#editorContainer").fadeIn("fast");
                    $("#canvasContainer").fadeIn("fast");

                    helloEditor.editor.setValue("rect(250, 200, 150, 150);", -1);
                    helloEditor.resetInstance();
                },
                onEnd: function () {
                    helloEditor.videoMode = true;
                    helloEditor.resizeUI();

                }
            })
            // Run the code in the editor
            .code({
                start: "09:51",
                onStart: function () {
                    helloEditor.runCode();
                },
                onEnd: function () {
                    helloEditor.resetInstance();
                }
            })
            // Show the rulers
            .code({
                start: "11:13",
                onStart: function () {
                    helloEditor.showRulers();
                },
                onEnd: function () {
                    helloEditor.hideRulers();
                }
            })
            // Hide the rulers, show the toggle button
            .code({
                start: "11:17",
                onStart: function () {
                    helloEditor.hideRulers();
                    $("#toggleRulers").fadeIn("fast");
                },
                onEnd: function () {
                    helloEditor.showRulers();
                    $("#toggleRulers").hide();
                }
            })
            // Show the rulers again
            .code({
                start: "11:22",
                onStart: function () {
                    helloEditor.showRulers();
                },
                onEnd: function () {
                    helloEditor.hideRulers();
                }
            });

        // End Event

        helloEditor.popcorn.on("ended", function () {

            // Show the proper hint over the video

            var hintHTML = $("#hints div[data-index='2']").html();

            $("#hint").html(hintHTML);
            $("#hint").show();

        });
    }
};

/**
 * Script for Video Three
 */

var scriptThree = {
    vimeoURL: "https://vimeo.com/77716817",
    exampleURL: "/assets/pde/hourofcode_2_color/hourofcode_2_color.pde",
    init: function (time) {

        helloEditor.popcorn = Popcorn.vimeo('#video', this.vimeoURL);
        helloEditor.popcorn.play(time);

        // Set initial State

        $("#hint").hide();
        $("#editorContainer").hide();
        $("#canvasContainer").hide();

    }
};

/**
 * Script for Video Four
 */

var scriptFour = {
    vimeoURL: "https://vimeo.com/77716816",
    exampleURL: "/assets/pde/houseofcode_3_mouse_a/houseofcode_3_mouse_a.pde",
    init: function (time) {

        helloEditor.popcorn = Popcorn.vimeo('#video', this.vimeoURL);
        helloEditor.popcorn.play(time);

        // Set initial State

        $("#hint").hide();
        $("#editorContainer").hide();
        $("#canvasContainer").hide();
    }
};

/**
 * Script for Video Five
 */

var scriptFive = {
    vimeoURL: "https://vimeo.com/77716818",
    exampleURL: "/assets/pde/houseofcode_4_mousepressed_a/houseofcode_4_mousepressed_a.pde",
    init: function (time) {

        helloEditor.popcorn = Popcorn.vimeo('#video', this.vimeoURL);
        helloEditor.popcorn.play(time);

        // Set initial State

        $("#hint").hide();
        $("#editorContainer").hide();
        $("#canvasContainer").hide();
    }
};

/**
 * Script for Video Six
 */

var scriptSix = {
    vimeoURL: "https://vimeo.com/77249859",
    exampleURL: null,
    init: function (time) {

        helloEditor.popcorn = Popcorn.vimeo('#video', this.vimeoURL);
        helloEditor.popcorn.play(time);

        // Set initial State

        $("#hint").hide();
        $("#editorContainer").hide();
        $("#canvasContainer").hide();
    }
};

/**
 * Script catalog
 */

var scripts = [
    scriptOne, scriptTwo, scriptThree, scriptFour, scriptFive, scriptSix
];