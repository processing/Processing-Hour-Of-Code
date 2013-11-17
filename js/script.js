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
    runCache: null,
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
                    helloEditor.setCode("");
                },
                onEnd: function () {
                    $("#editorContainer").hide();
                }
            })
            .code({
                start: "01:27",
                onStart: function () {
                    helloEditor.setCode("ellipse(250, 200, 400, 400);");
                },
                onEnd: function () {
                    helloEditor.setCode("");
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
            
            helloEditor.showHint(1);

        });
    }
};

/**
 * Script for Video Two
 */

var scriptTwo = {
    vimeoURL: "https://vimeo.com/77716815",
    exampleURL: "/assets/pde/hourofcode_1_ellipses/hourofcode_1_ellipses.pde",
    runCache: null,    
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
                    helloEditor.setCode("");
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
                    helloEditor.setCode("ellipse(250, 200, 150, 150);");
                },
                onEnd: function () {
                    helloEditor.setCode("");
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

                    helloEditor.setCode("rect(250, 200, 150, 150);");
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

            helloEditor.showHint(2);

        });
    }
};

/**
 * Script for Video Three
 */

var scriptThree = {
    vimeoURL: "https://vimeo.com/79534024",
    exampleURL: "/assets/pde/hourofcode_2_color/hourofcode_2_color.pde",
    runCache: null,
    reset: function () {
        // Set initial State

        helloEditor.videoMode = false;
        helloEditor.resizeUI();

        $("#hint").hide();
        $("#editorContainer").show();
        $("#canvasContainer").show();

        $("#resetButton").hide();
        $("#shareButton").hide();
        $("#nextButton").hide();
        $("#runButton").show();
    },
    init: function (time) {

        helloEditor.popcorn = Popcorn.vimeo('#video', this.vimeoURL);
        helloEditor.popcorn.play(time);

        this.reset();

        // Popcorn Events

        helloEditor.popcorn
            // Back to full screen
            .code({
                start: "00:19",
                onStart: function () {   
                    helloEditor.videoMode = true;
                    helloEditor.resizeUI();

                    $("#editorContainer").hide();
                    $("#canvasContainer").hide(); 
                }
            })
            // Show the editor
            .code({
                start: "02:44",
                onStart: function () {
                    helloEditor.videoMode = false;
                    helloEditor.resizeUI();

                    $("#editorContainer").fadeIn("fast");
                    $("#canvasContainer").fadeIn("fast");

                    helloEditor.setCode("rect(250,200,100,75);");
                    helloEditor.runCode();
                }
            })
            // add stroke()
            .code({
                start: "02:48",
                onStart: function () {
                    helloEditor.setCode("stroke(0);\nrect(250,200,100,75);");
                    helloEditor.runCode();
                }
            })
            // add fill()
            .code({
                start: "02:50",
                onStart: function () {
                    helloEditor.setCode("stroke(0);\nfill(128);\nrect(250,200,100,75);");
                    helloEditor.runCode();
                }
            })
            // Back to video explanation
            .code({
                start: "3:00",  
                onStart: function () {
                    helloEditor.videoMode = true;
                    helloEditor.resizeUI();

                    $("#editorContainer").hide();
                    $("#canvasContainer").hide();                  
                }
            })
            // RGB Demo
            .code({
                start: "04:24",
                onStart: function () {
                    helloEditor.videoMode = false;
                    helloEditor.resizeUI();

                    $("#editorContainer").fadeIn("fast");
                    $("#canvasContainer").fadeIn("fast");

                    helloEditor.setCode("stroke(250,0,0);\n\nfill(0,0,255);\n\nrect(250,200,100,75);");
                    helloEditor.runCode();
                }
            })            
            // Show Color Picker
            .code({
                start: "04:56",
                onStart: function () {

                    $("#colorPicker").spectrum("container").show();
                    $("#colorPicker").spectrum("container").css({
                        position: "absolute",
                        top: 32,
                        left: 20
                    });                
                }
            }) 
            // Hide color Picker
            .code({
                start: "05:05",
                onStart: function () {
                    $("#colorPicker").spectrum("container").hide();
                }
            })  
            // Background Code
            .code({
                start: "05:34",
                onStart: function () {

                    helloEditor.setCode("background(216,225,149);\n\nstroke(250,0,0);\n\nfill(0,0,255);\n\nrect(250,200,100,75);");
                }
            })    
            // Background Run
            .code({
                start: "05:40",
                onStart: function () {

                    helloEditor.runCode();
                }
            })   
            // Example
            .code({
                start: "06:15",
                onStart: function () {
                    // Load example asynchronously with callback to run it
                    helloEditor.loadCode(
                        scriptThree.exampleURL,
                        function () {
                            helloEditor.runCode();
                        }
                    );
                    
                }
            });

        // End Event

        helloEditor.popcorn.on("ended", function () {

            // Show the proper hint over the video

            helloEditor.showHint(3);

            $("#nextButton").show();
            $("#resetButton").show();

        });               
    }
};

/**
 * Script for Video Four
 */

var scriptFour = {
    vimeoURL: "https://vimeo.com/77716816",
    exampleURL: "/assets/pde/houseofcode_3_mouse_a/houseofcode_3_mouse_a.pde",
    runCache: null,    
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
    runCache: null,    
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
    runCache: null,
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