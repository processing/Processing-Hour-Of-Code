"use strict";

/**
 * Singleton for gallery page
 */
var helloGallery = {
    pageNumber: 0,
    itemsPerPage: 16,
    /**
     * Initialize gallery page
     */
    init: function () {

        // Get the gistID from the URL and display it

        if (document.URL.indexOf('#') >= 0) {
            helloGallery.pageNumber = document.URL.split('#')[1];          
        }

        Parse.initialize("x8FmMInL8BbVeBqonPzgvS8WNKbPro65Li5DzTI0", "Y7PPNnhLPhCdFMAKgw7amBxGerz67gAnG3UKb53s");

        var GalleryObject = Parse.Object.extend("Gallery");
        var query = new Parse.Query(GalleryObject);
        query.limit(helloGallery.itemsPerPage);
        query.skip(helloGallery.pageNumber * helloGallery.itemsPerPage);
        query.descending("createdAt");

        query.find({
          success: function(results) {
            //alert("Successfully retrieved " + results.length + " scores.");
            // Do something with the returned Parse.Object values
            for (var i = 0; i < results.length; i++) { 
              var object = results[i];
              //alert(object.id + ' - ' + object.get('playerName'));
              
              var data = {
                link: "http://" + $(location).attr('hostname') + (($(location).attr('port') !== "") ?  ":" + $(location).attr('port') : "") + "/display/#@" + object.id,
                image: object.get("image").url()
              } 

              var template = $('#template').html();
              Mustache.parse(template);
              var rendered = Mustache.render(template, data);
              $('#galleryView').append(rendered);


            }
          },
          error: function(error) {
            //alert("Error: " + error.code + " " + error.message);
          }
        });          


    }
};
