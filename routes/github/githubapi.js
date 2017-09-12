'use strict';
var github = require('octonode');
var backstopVgTest = require('../backstop/vgbackstop');

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

    function updateStatusPromiseWrapper(pr, status) {
        return new Promise((resolve, reject) => {
            updateStatus(pr, status, function (err, cbresp) {
                if (err) {
                    reject("Something went wrong with the udpate request to the Github API");
                }
                console.log(cbresp); //what does come back?
                resolve("PR with title " + pr.title + " set to pending");
            });
            
        });

    }

    function handlePullRequest(payload) {

        if(payload.action != "opened") {
            return Promise.reject("PR actions other than opened arent supported at the moment");
        }

        //1) set status to pending
        //2) kick off backstop
        //3) on backstop return, update status to good or bad
        var pr = payload.pull_request;
        updateStatusPromiseWrapper(pr, "pending").then(function() {
            var vgt = new backstopVgTest(); //dont know what params to send yet....
            vgt.runTest().then(res => {
                console.log(res);
                var status = "success";
                return updateStatusPromiseWrapper(pr, status);
            }).catch(err => {
                return Promise.reject(err);
            });
        })
        .catch(err => {
            return Promise.reject(err);
        });
    }

    //public
    self.handleEvent = function (header, payload) {

        if (header == "pull_request") {
            return handlePullRequest(payload);
        }

        return Promise.reject("Only PR headers supported at the moment");

    }

}

module.exports = GithubAPI;