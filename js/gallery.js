"use strict";

/*global Parse */
/*global Mustache */
/*global location */

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

    $(".filter").click(function (e) {
      var newMode = $(e.delegateTarget).attr('data-mode');

      if (newMode !== helloGallery.sortMode) {

        helloGallery.sortMode = parseInt(newMode, 10);

        $(".filter").removeClass("active");
        $(e.delegateTarget).addClass("active");

        helloGallery.pageNumber = 0;
        $('#galleryView').isotope('destroy');
        $('.galleryImage').not("#loadMore").remove();
        $("#loadMore").show();

        helloGallery.loadInitial();
      }

      return false;

    });

    $("#loadMore").click(function () {

      helloGallery.loadMore();

    });

    // Get the ID from the URL and display it

    Parse.initialize("x8FmMInL8BbVeBqonPzgvS8WNKbPro65Li5DzTI0", "Y7PPNnhLPhCdFMAKgw7amBxGerz67gAnG3UKb53s");

    helloGallery.loadInitial();
  },

  loadInitial: function () {

    $('#galleryView').isotope({
      itemSelector: '.galleryImage',
      sortBy: 'index',
      getSortData: {
        index: '[data-index]'
      },
      masonry: {
        gutter: 12,
        isFitWidth: true
      }
    });

    helloGallery.loadMore();
  },

  loadMore: function () {

    helloGallery.loadElements(function (elements) {
      var i;

      for (i = 0; i < elements.length; i++) {
        $('#galleryView').isotope('insert', $(elements[i]));
      }
    });

  },

  loadElements: function (callback) {

    $("#loadMore").button('loading');

    var GalleryObject = Parse.Object.extend("Gallery");
    var query = new Parse.Query(GalleryObject);

    query.notEqualTo("hidden", true);
    query.limit(helloGallery.itemsPerPage);
    query.skip(helloGallery.pageNumber * helloGallery.itemsPerPage);

    switch (helloGallery.sortMode) {
    case 0:
      //console.log("Featured");
      query.descending("featureScore");
      query.addDescending("createdAt");
      break;
    case 1:
      //console.log("Popular");
      query.descending("viewCount");
      query.addDescending("createdAt");
      break;
    case 2:
      //console.log("Recent");
      query.descending("createdAt");
      break;
    }

    query.count({
      success: function (number) {
        helloGallery.totalItems = number;
      },
      error: function (error) {
        console.log(error.message);
      }
    });

    query.find({
      success: function (results) {
        //alert("Successfully retrieved " + results.length + " scores.");

        var i, imageTiles = [];

        var object, data, template, rendered;

        for (i = 0; i < results.length; i++) {
          object = results[i];
          //alert(object.id + ' - ' + object.get('playerName'));

          data = {
            link: "http://" + $(location).attr('hostname') + (($(location).attr('port') !== "") ? ":" + $(location).attr('port') : "") + "/display/#@" + object.id,
            image: object.get("image").url()
          };

          template = $('#template').html();
          Mustache.parse(template);
          rendered = Mustache.render(template, data);
          imageTiles.push(rendered);
        }

        callback(imageTiles);

        helloGallery.pageNumber++;

        $("#loadMore").button('reset');

        if (helloGallery.totalItems !== null && helloGallery.pageNumber * helloGallery.itemsPerPage >= helloGallery.totalItems) {
          $("#loadMore").hide();
        }

      },
      error: function (error) {
        console.log("Error: " + error.code + " " + error.message);
      }
    });
  }
};