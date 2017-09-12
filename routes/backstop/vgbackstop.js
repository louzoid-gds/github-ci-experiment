'use strict';

function VgBackstop() {
    var self = this;

    self.runTest = function() {
        //big problem here is that this is probably going to timeout.
        //we'll need a queue or to poll something....
        return Promise.resolve("nothing happening for now");

    }

}

module.exports = VgBackstop;