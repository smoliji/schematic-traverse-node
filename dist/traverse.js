"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var identity = require("lodash.identity");
var mapValues = require("lodash.mapvalues");
var whenDone_1 = require("./whenDone");
var schema_1 = require("./schema");
var traversePrimitive = function (schema, iteratee) {
    if (iteratee === void 0) { iteratee = identity; }
    return function (subject) { return whenDone_1.default(iteratee, subject); };
};
var traverseObject = function (schema, iteratee) {
    if (iteratee === void 0) { iteratee = identity; }
    return function (subject) {
        if (subject === void 0) { subject = {}; }
        return whenDone_1.default(iteratee, mapValues(schema.data, function (childTraverse, key) { return childTraverse(subject[key]); }));
    };
};
var traverseArray = function (schema, iteratee) {
    if (iteratee === void 0) { iteratee = identity; }
    return function (subject) {
        if (subject === void 0) { subject = []; }
        return whenDone_1.default(iteratee, subject.map(function (item) { return schema.data(item); }));
    };
};
var traverse = function (schema, iteratee) {
    switch (schema.type) {
        case schema_1.OBJECT:
            return traverseObject(schema, iteratee);
        case schema_1.ARRAY:
            return traverseArray(schema, iteratee);
        case schema_1.PRIMITIVE:
        default:
            return traversePrimitive(schema, iteratee);
    }
};
exports.shape = function (structure, iteratee) {
    return traverse(schema_1.default(schema_1.OBJECT, structure), iteratee);
};
exports.array = function (structure, iteratee) {
    return traverse(schema_1.default(schema_1.ARRAY, itemStructure), iteratee);
};
exports.default = traverse;
