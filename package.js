"use strict";

var gloob = require('./gloob');
var async = require('async');
var path = require('path');
var glob = require('glob');
var iferr = require('iferr');

module.exports = function (base, country, language, callback) {
    if (!country || !language) {
        return callback(new Error("country and language must be provided"));
    }

    glob(path.resolve(base, path.join(country, language)), iferr(callback, function (files) {
        var out = {};
        async.eachSeries(files, function (ent, next) {
            gloob(ent, function (err, o) {
                out[path.relative(base, ent).replace(/(.*)\/(.*)/, "$2-$1")] = o;
                next();
            });
        }, iferr(callback, function () {
            callback(null, out);
        }));

    }));
};
