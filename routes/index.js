"use strict";
var express = require("express");
var router = express.Router();
//var tweetBank = require("../tweetBank");
var client = require("../db/index");

module.exports = router;

// una función reusable
function respondWithAllTweets(req, res, next) {
  client.query(
    "SELECT * FROM tweets INNER JOIN users on tweets.user_id = users.id",
    function(err, result) {
      if (err) return next(err); // pasa el error a Express
      var tweets = result.rows;

      res.render("index", { title: "Tweety.js", tweets, showForm: true });
    }
  );
}

// aca basícamente tratamos a la root view y la tweets view como identica
router.get("/", respondWithAllTweets);
router.get("/tweets", respondWithAllTweets);

// página del usuario individual
router.get("/users/:username", function(req, res, next) {
  client.query(
    "SELECT * FROM tweets INNER JOIN users on tweets.user_id = users.id WHERE users.name = $1",
    [req.params.username],
    function(err, data) {
      if (err) return next(err);
      var user = data.rows;
      res.render("index", {
        title: "Tweety.js",
        tweets: user,
        showForm: true,
        username: req.params.username
      });
    }
  );
});

// página del tweet individual
router.get("/tweets/:id", function(req, res, next) {
  client.query(
    "SELECT content FROM tweets WHERE id = $1 ",
    [req.params.id],
    function(err, data) {
      if (err) return next(err);
      var tweet = data.rows;
      console.log(tweet);
      res.render("index", {
        title: "Tweety.js",
        tweets: tweet,
        showForm: true
      });
    }
  );
});

// crear un nuevo tweet
router.post("/tweets", function(req, res, next) {
  client.query(
    "INSERT INTO tweets (userId, content) VALUES ($1, $2)",
    [req.body.user_id, req.body.content],
    function(err, data) {
      if (err) return next(err);
      var tweet = data.rows;
      res.redirect("index", {
        title: "Tweety.js",
        tweets: tweet,
        showForm: true
      });
    }
  );
});

// // reemplazá esta ruta hard-codeada con static routing general en app.js
// router.get('/stylesheets/style.css', function(req, res, next){
//   res.sendFile('/stylesheets/style.css', { root: __dirname + '/../public/' });
// });
