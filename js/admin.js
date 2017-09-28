"use strict";

/*global firebase */
/*global $ */

/**
 * Singleton for admin page
 */
var helloAdmin = {
  /**
   * Initialize admin page
   */
  init: function () {

        if (Parse.User.current() === null) {
      $("#loginPanel").show();
      $("#logoutPanel").hide();
    } else {
      $("#loginPanel").hide();
      $("#logoutPanel").show();

      $("#userInfo").html(Parse.User.current().get("username"));
    }

    $("#logoutButton").click(function () {
      Parse.User.logOut();
      $("#loginPanel").show();
      $("#logoutPanel").hide();
    });

    $("#loginForm").submit(function () {

      var userEmail = $("#userEmail").val();
      var userPassword = $("#userPassword").val();

      Parse.User.logIn(userEmail, userPassword, {
        success: function (user) {

          $("#userInfo").html(user.get("username"));

          $("#loginPanel").hide();
          $("#logoutPanel").show();

        },
        error: function (user, error) {
          console.log(user);

          $("#loginFailed").show();
          $("#loginError").html(error.message);
        }
      });

      return false;
    });
  }
};
