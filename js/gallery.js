"use strict";

/*global console */
/*global Promise */
/*global $ */
/*global firebase */
/*global Mustache */
/*global location */

/**
 * Singleton for gallery page
 */
var helloGallery = {
  sortMode: 0,
  nextEnd: null,
  itemsPerPage: 12,
  /**
   * Initialize gallery page
   */
  init: function () {

    $(".filter").click(function (e) {
      e.preventDefault();
      var newMode = $(e.delegateTarget).attr('data-mode');

      if (newMode !== helloGallery.sortMode) {

        helloGallery.sortMode = parseInt(newMode, 10);

        $(".filter").removeClass("active");
        $(e.delegateTarget).addClass("active");

        helloGallery.nextEnd = null;
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

    var query = firebase.database().ref('gallery/');
    var sortKey = null;
    switch (helloGallery.sortMode) {
    case 0:
      sortKey = 'featureScore';
      break;
    case 1:
      sortKey = 'viewCount';
      break;
    case 2:
      break;
    }
    if(sortKey !== null) {
      query = query.orderByChild(sortKey);
    }


    // query.notEqualTo("hidden", true);
    query = query.limitToLast(helloGallery.itemsPerPage + 1);
    if(helloGallery.nextEnd) {
      var value = null;
      if(sortKey !== null) {
        value = helloGallery.nextEnd[sortKey];
      }
      query = query.endAt(value, helloGallery.nextEnd.key);
    }

    query.once('value').then(function (results) {
      //alert("Successfully retrieved " + results.length + " scores.");
      var imageTiles = [];
      // Prepare the template
      var template = $('#template').html();
      Mustache.parse(template);

      helloGallery.nextEnd = null;
      var length = results.numChildren();

      var more_pages = false;
      if (length > helloGallery.itemsPerPage) {
        more_pages = true;
        length = helloGallery.itemsPerPage;
      }

      results.forEach(function (sketch) {
        var key = sketch.key;
        if(more_pages && helloGallery.nextEnd === null) {
          helloGallery.nextEnd = sketch.val();
          helloGallery.nextEnd.key = sketch.key;
          return;
        }
        imageTiles.push(new Promise(function(resolve, reject) {
          var data = {
            link: "http://" + $(location).attr('hostname') + (($(location).attr('port') !== "") ? ":" + $(location).attr('port') : "") + "/display/#@" + key,
            image: null
          };

          firebase.storage().ref('gallery/' + key + '.jpg').getDownloadURL().then(function(url) {
            data.image = url;
            resolve(data);
          }).catch(function(err) {
            console.log("Error: Failed to load an image: ", err.message);
            resolve(data);
          });
        }).then(function(data) {
          return Mustache.render(template, data);
        }));
      });

      Promise.all(imageTiles).then(function(tiles) {
        tiles.reverse();
        callback(tiles);

        $("#loadMore").button('reset');

        if (!more_pages) {
          $("#loadMore").hide();
        }
      });
    }).catch(function (error) {
      console.log("Error: " + error.code + " " + error.message);
    });
  }
};
