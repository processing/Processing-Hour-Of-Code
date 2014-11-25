"use strict";

/**
 * Singleton for gallery page
 */
var helloGallery = {
    pageNumber: 0,
    sortMode: 0,
    itemsPerPage: 12,
    totalItems: null,
    /**
     * Initialize gallery page
     */
    init: function () {

        $(".filter").click(function(e) {
          var newMode = $(e.target).attr('data-mode');

          if (newMode != helloGallery.sortMode) {

            helloGallery.sortMode = parseInt(newMode);

            $(".filter").removeClass("active");
            $(e.target).addClass("active");
            
            helloGallery.pageNumber = 0;
            $('#galleryView').isotope('destroy');            
            $('#galleryView').html("");
            $("#loadMore").show();

            helloGallery.loadInitial();
          }

        });

        $("#loadMore").click(function() {

          helloGallery.loadMore();

        });

        // Get the ID from the URL and display it

        Parse.initialize("x8FmMInL8BbVeBqonPzgvS8WNKbPro65Li5DzTI0", "Y7PPNnhLPhCdFMAKgw7amBxGerz67gAnG3UKb53s");

        helloGallery.loadInitial();
    },

    loadInitial: function() {

        helloGallery.loadElements( function(elements){

          var container = $('#galleryView'); 
          container.append( elements );

          container.isotope({
            itemSelector: '.galleryImage',
              masonry: {
                gutter: 12,
                isFitWidth: true
              }
          });  
       });
    },

    loadMore: function() {

      helloGallery.loadElements(function(elements){

        for (var element in elements) {
          var item = $(elements[element]);
          
          $('#galleryView').append(item);
          $('#galleryView').isotope('appended', item);
        }
      });

    },

    loadElements: function (callback) {

        $("#loadMore").button('loading');

        var GalleryObject = Parse.Object.extend("Gallery");
        var query = new Parse.Query(GalleryObject);
        query.limit(helloGallery.itemsPerPage);
        query.skip(helloGallery.pageNumber * helloGallery.itemsPerPage);
        
        switch (helloGallery.sortMode) {
          case 0:
            console.log("Featured");
            query.descending("featureScore");
            query.addDescending("createdAt");
            break;
          case 1:
            console.log("Popular");
            query.descending("viewCount");
            query.addDescending("createdAt");
            break;
          case 2:
            console.log("Recent");
            query.descending("createdAt");
            break;
        }

        query.count({
          success: function(number) {
            helloGallery.totalItems = number;
          },
          error: function(error) {
            // error is an instance of Parse.Error.
          }
        });        

        query.find({
          success: function(results) {
            //alert("Successfully retrieved " + results.length + " scores.");

            var imageTiles = [];

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
              imageTiles.push(rendered);
            }

            callback(imageTiles);          

            helloGallery.pageNumber++; 

            $("#loadMore").button('reset');

            if (helloGallery.totalItems != null && helloGallery.pageNumber * helloGallery.itemsPerPage >= helloGallery.totalItems) {
              $("#loadMore").hide();
            }                       

          },
          error: function(error) {
            alert("Error: " + error.code + " " + error.message);
          }
        });  
    }
};
