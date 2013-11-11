"use strict";

/*global document */
/*global window */
/*global $ */

/*global helloSplash */
/*global helloDisplay */
/*global helloEditor */


$(document).ready(function () {
    if (window.hasOwnProperty("helloSplash")) { helloSplash.init(); }
    if (window.hasOwnProperty("helloDisplay")) { helloDisplay.init(); }
    if (window.hasOwnProperty("helloEditor")) { helloEditor.init(); }
});