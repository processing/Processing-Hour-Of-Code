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
    firebase.auth().onAuthStateChanged(function(user) {
      if (user === null) {
        $("#loginPanel").show();
        $("#logoutPanel").hide();
      } else {
        firebase.database().ref('admins/' + user.uid).once('value').then(function(result) {
          if(result.val()) {
            $("#loginPanel").hide();
            $("#logoutPanel").show();

            $("#userInfo").html(firebase.auth().currentUser.email);
          } else {
            firebase.auth().signOut();
            $("#loginFailed").show();
            $("#loginError").html("You are not an admin!");
          }
        }).catch(function(err) {
          firebase.auth().signOut();
          $("#loginFailed").show();
          $("#loginError").html("Failed to check admin status!");
        });
      }
    });

    $("#logoutButton").click(function () {
      firebase.auth().signOut();
      $("#loginPanel").show();
      $("#logoutPanel").hide();
    });

    $("#loginForm").submit(function (e) {
      e.preventDefault();
      var userEmail = $("#userEmail").val();
      var userPassword = $("#userPassword").val();

      firebase.auth().signInWithEmailAndPassword(userEmail, userPassword).catch(function (error) {
        $("#loginFailed").show();
        $("#loginError").html(error.message);
      });

      return false;
    });
  }
};
