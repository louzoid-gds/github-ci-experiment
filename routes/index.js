var express = require('express');
var router = express.Router();
var github = require('./github/githubapi');

router.post('/event_handler', function (req, res) {

  res.set('Access-Control-Allow-Origin', "*");
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  
  var payload = JSON.parse(req.body.payload);  

  var h = req.get('X-GitHub-Event');
  if (!h) res.status(403).send("Doesn't look like the request is from Github :/");

  var gh = new github();
  gh.handleEvent(h, payload).then(output => {
    res.status(200).send(output);
  }).catch(err => {
    res.status(200).send(err); //change so can reject with suitable params
  });

});

module.exports = router;