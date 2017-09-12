var express = require('express');
var router = express.Router();

router.post('/event_handler', function (req, res) {

  var payload = JSON.parse(req.body.payload);
  res.set('Access-Control-Allow-Origin', "*");
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  
  var h = req.get('X-GitHub-Event');
  if (!h) res.status(403).send("Doesn't look like the request is from Github :/");
  if (h == "pull_request") {
    if (payload.action == "opened") {
      var pr = payload.pull_request;
      res.status(200).send("Yah that worked! PR title: " + pr.title);
    }
    else {
      console.log("action not opened:" + payload.action);
    }
  }

  res.status(200).send("Not a PR so i didn't do anything. Header: " + h);

});

module.exports = router;