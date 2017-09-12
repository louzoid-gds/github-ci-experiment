var express = require('express');
var router = express.Router();
var github = require('octonode');

router.post('/event_handler', function (req, res) {

  var payload = JSON.parse(req.body.payload);

  res.set('Access-Control-Allow-Origin', "*");
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  
  var h = req.get('X-GitHub-Event');
  if (!h) res.status(403).send("Doesn't look like the request is from Github :/");
  if (h == "pull_request") {
    if (payload.action == "opened") {
      var pr = payload.pull_request;
      //todo: clean this up!!
      updateStatus(pr, "pending", function(err, cbresp) {
        if (err) {
          res.status(500).send("Something went wrong with the udpate request to the Github API");  
        }
        console.log(cbresp); //what does come back?
        res.status(200).send("PR with title " + pr.title + " set to pending");
      });
    }
    else {
      res.status(200).send("PR actions other than opened arent supported at the moment");
    }
  }
  else {
    res.status(200).send("Not a PR so i didn't do anything. Header: " + h);
  }
  

});

function updateStatus(pr, status, cb) {
  var tk = process.env.GH_ACCESS_TOKEN;
  var client = github.client(tk);

  var ghrepo = client.repo(pr.base.repo.full_name);
  ghrepo.status(pr.head.sha, {
    "state": status,
    "target_url": "",
    "description": "Build pending. yeah."
  }, cb);

}

module.exports = router;