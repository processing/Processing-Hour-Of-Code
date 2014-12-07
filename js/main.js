"use strict";

/*global document */
/*global window */

/*global $ */
/*global Modernizr */

/*global helloSplash */
/*global helloDisplay */
/*global helloEditor */
/*global helloGallery */
/*global helloAdmin */


$(document).ready(function () {

  if (!Modernizr.canvas || !Modernizr.video || !Modernizr.csstransforms3d) {
    window.location("/unsupported/");
  }

  if (window.hasOwnProperty("helloSplash")) {
    helloSplash.init();
  }
  if (window.hasOwnProperty("helloDisplay")) {
    helloDisplay.init();
  }
  if (window.hasOwnProperty("helloEditor")) {
    helloEditor.init();
  }
  if (window.hasOwnProperty("helloGallery")) {
    helloGallery.init();
  }
  if (window.hasOwnProperty("helloAdmin")) {
    helloAdmin.init();
  }
});