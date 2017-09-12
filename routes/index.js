var express = require('express');
var router = express.Router();

router.post('/event_handler', function (req, res) {
  var payload = req.body.payload;
  console.log(payload);

  var h = req.get('X-GitHub-Event');
  if (!h) res.status(403).send("Doesn't look like the request is from Github :/");
  if (h === "pull_request") {
    if (req.body.action === "opened") {
      var pr = req.body.pull_request;
      res.status(200).send("Yah that worked! PR title: " + pr.title);
    }
  }

  res.status(200).send("Not a PR so i didn't do anything. Header: " + h);

});

module.exports = router;