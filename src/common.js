"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getType(obj) {
    var typeStr = Object.prototype.toString.call(obj);
    var _a = typeStr.match(/^\[object\s+(\S+)\]$/), _b = _a[1], type = _b === void 0 ? 'object' : _b;
    return type.toLocaleLowerCase();
}
exports.getType = getType;
function convenrsionType(value, type) {
    switch (type) {
        case 'string':
            return String(value);
        case 'number':
            return parseInt(value);
        case 'null':
            return null;
        case 'undefined':
            return undefined;
        case 'array':
        case 'object':
            return JSON.parse(value);
    }
}
exports.convenrsionType = convenrsionType;
function normalizeName(name) {
    if (typeof name !== 'string') {
        name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
        throw new TypeError('Invalid character in header field name');
    }
    return name.toLowerCase();
}
exports.normalizeName = normalizeName;
function compileStr(code) {
    var c = String.fromCharCode(code.charCodeAt(0) + code.length);
    for (var i = 1; i < code.length; i++) {
        c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
    }
    return escape(c);
}
exports.compileStr = compileStr;
function uncompileStr(code) {
    code = unescape(code);
    var c = String.fromCharCode(code.charCodeAt(0) - code.length);
    for (var i = 1; i < code.length; i++) {
        c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
    }
    return c;
}
exports.uncompileStr = uncompileStr;
