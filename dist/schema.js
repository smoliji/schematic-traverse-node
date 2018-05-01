"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMPTY = Symbol('empty');
exports.PRIMITIVE = Symbol('primitive');
exports.OBJECT = Symbol('object');
exports.ARRAY = Symbol('array');
var schema = function (type, data) {
    if (type === void 0) { type = exports.PRIMITIVE; }
    if (data === void 0) { data = exports.EMPTY; }
    return {
        type: type,
        data: data,
    };
};
exports.default = schema;
