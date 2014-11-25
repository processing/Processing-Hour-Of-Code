
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

Parse.Cloud.define("incrementViewCount", function(request, response) {
  Parse.Cloud.useMasterKey();

  var Gallery = Parse.Object.extend("Gallery");
  var gallery = new Gallery();

  gallery.id = request.params.id;

  gallery.increment("viewCount", 1);
  gallery.save(null, {
      success: function(item) {
        response.success(true);
      },
      error: function(item, error) {
        response.error("Could not increment view count.");
      }
  });
});