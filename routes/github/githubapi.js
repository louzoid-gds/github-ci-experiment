'use strict';
var github = require('octonode');

//what arent my editor config settings working..!?
function GithubAPI() {
    var self = this;

    //private
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

    function handlePullRequest(payload) {
        return new Promise((resolve, reject) => {
            if(payload.action != "opened") {
                reject("PR actions other than opened arent supported at the moment");
            }
            var pr = payload.pull_request;
            updateStatus(pr, "pending", function (err, cbresp) {
                if (err) {
                    reject("Something went wrong with the udpate request to the Github API");
                }
                console.log(cbresp); //what does come back?
                resolve("PR with title " + pr.title + " set to pending");
            });
            
        });
    }

    //public
    self.handleEvent = function (header, payload) {

        if (header == "pull_request") {
            return handlePullRequest(payload);
        }

        return new Promise().reject("Only PR headers supported at the moment");

    }

}

module.exports = GithubAPI;