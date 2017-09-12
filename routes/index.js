var express = require('express');
var router = express.Router();

router.post('/event_handler', function (req, res) {
  var payload = req.body.payload;

  var h = req.get('X-GitHub-Event');
  if (!h) res.status(403).send("Doesn't look like the request is from Github :/");
  if (h === "pull_request") {
    if (payload.action === "opened") {
      var pr = payload.pull_request;
      res.status(200).send("Yah that worked! PR title: " + pr.title);
    }
  }

  res.status(200).send("Not a PR so i didn't do anything");
  
//   var qs = req.query.urls; //['http://staging.main.su.baigentpreview.com/8.id', 'ppp', 'http://staging.main.su.baigentpreview.com/about/107.id', 'http://staging.main.su.baigentpreview.com/AboutScriptureUnion/Vacancies/106126.id'];
//   var urls = qs.split(',');
//   console.log(urls);
//   f.load(urls).then(output =>  {
//     res.setHeader('Content-Type', 'application/json');
//     res.status(200).send(JSON.stringify(output)).end();
//   });

});

module.exports = router;