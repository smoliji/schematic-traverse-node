"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fromPairs = require("lodash.frompairs");
var toPairs = require("lodash.topairs");
var isPlainObject = require("lodash.isplainobject");
var identity = require("lodash.identity");
var values = require("lodash.values");
var isPromise = function (x) { return (x && (typeof x.then === 'function')); };
var whenDone = function (iteratee, value) {
    if (iteratee === void 0) { iteratee = identity; }
    if (Array.isArray(value)) {
        if (value.some(isPromise)) {
            return Promise.all(value)
                .then(function (valueResult) { return iteratee(valueResult); });
        }
        return iteratee(value);
    }
    if (isPlainObject(value)) {
        if (!values(value).some(isPromise)) {
            return iteratee(value);
        }
        return whenDone(iteratee, whenDone(function (pairs) { return whenDone(function (x) { return fromPairs(x); }, pairs.map(function (_a) {
            var key = _a[0], keyValue = _a[1];
            return whenDone(function (valueResult) { return [key, valueResult]; }, keyValue);
        })); }, toPairs(value)));
    }
    if (isPromise(value)) {
        return value.then(iteratee);
    }
    return iteratee(value);
};
exports.default = whenDone;
