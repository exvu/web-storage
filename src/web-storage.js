"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("./common");
var WebStorage = /** @class */ (function () {
    function WebStorage(options) {
        if (options === void 0) { options = {
            encrypt: ['value'],
            pre: '_webstorage_',
            exp: 24 * 60 * 60
        }; }
        this.options = options;
        this.local = new WStorage(localStorage, options);
        this.session = new WStorage(sessionStorage, options);
    }
    WebStorage.isSuppered = function () {
        return 'Storage' in window;
    };
    return WebStorage;
}());
exports.default = WebStorage;
var WStorage = /** @class */ (function () {
    function WStorage(storage, options) {
        this.storage = storage;
        this.options = options;
    }
    /**
     * 编码key
     * @param key
     * @param options
     */
    WStorage.prototype.compileKey = function (key, options) {
        key = common_1.normalizeName(options.pre + key);
        if (options.encrypt && options.encrypt.indexOf('key') !== -1) {
            key = common_1.compileStr(key);
        }
        return key;
    };
    /**
     * 编码值
     * @param value
     * @param options
     */
    WStorage.prototype.compileValue = function (value, options) {
        value = JSON.stringify(value);
        if (options.encrypt && options.encrypt.indexOf('value') !== -1) {
            value = common_1.compileStr(value);
        }
        return value;
    };
    /**
     * 解码值
     * @param value
     * @param options
     */
    WStorage.prototype.uncompileValue = function (value, options) {
        if (options.encrypt && options.encrypt.indexOf('value') !== -1) {
            value = common_1.uncompileStr(value);
        }
        try {
            value = JSON.parse(value);
        }
        catch (e) {
            return null;
        }
        return value;
    };
    /**
     * 设置指定的缓存
     * @param key
     * @param value
     * @param options
     */
    WStorage.prototype.set = function (key, value, options) {
        var _a;
        options = __assign({}, this.options, options);
        //生成key
        key = this.compileKey(key, options);
        var currentDate = new Date();
        var data = {
            c: currentDate.getTime(),
            e: options.exp ? (new Date(currentDate.getTime() + options.exp * 1000)).getTime() : Infinity,
            v: this.compileValue(value, options),
        };
        this.storage.setItem(key, JSON.stringify(data));
        return _a = {},
            _a[key] = data,
            _a;
    };
    WStorage.prototype.exp = function (key, expTime, options) {
        if (options === void 0) { options = {}; }
        options = __assign({}, this.options, options);
        //生成key
        key = this.compileKey(key, options);
        var payload = this.storage.getItem(key);
        if (payload === null) {
            return false;
        }
        try {
            var _a = JSON.parse(payload), c = _a.c, e = _a.e, v = _a.v;
            var currentDate = new Date();
            e = new Date(currentDate.getTime() + expTime).getTime();
            this.storage.setItem(key, JSON.stringify({
                c: c,
                e: e,
                v: v
            }));
            return true;
        }
        catch (e) {
            return false;
        }
    };
    /**
     * 获取指定的缓存
     * @param key
     */
    WStorage.prototype.get = function (key, options) {
        if (options === void 0) { options = {}; }
        options = __assign({}, this.options, options);
        //生成key
        key = this.compileKey(key, options);
        var payload = this.storage.getItem(key);
        if (payload === null) {
            this.remove(key);
            return null;
        }
        try {
            var _a = JSON.parse(payload), c = _a.c, e = _a.e, v = _a.v;
            if (e && (new Date()).getTime() > e) {
                this.remove(key);
                return null;
            }
            v = this.uncompileValue(v, options);
            return v;
        }
        catch (e) {
            return null;
        }
    };
    /**
     * 判断是否存在指定缓存
     * @param key
     * @param options
     */
    WStorage.prototype.has = function (key, options) {
        if (options === void 0) { options = {}; }
        options = __assign({}, this.options, options);
        //生成key
        key = this.compileKey(key, options);
        return key in this.storage;
    };
    /**
     * 获取缓存的所有数据
     */
    WStorage.prototype.getAll = function (pre) {
        var _this = this;
        if (pre === void 0) { pre = ''; }
        var names = Object.getOwnPropertyNames(this.storage);
        var list = {};
        names.forEach(function (name) {
            name = name.replace(_this.options.pre || '', '');
            list[name] = _this.get(name);
        });
        return list;
    };
    /**
     * 移除指定的缓存
     * @param key
     */
    WStorage.prototype.remove = function (key, options) {
        if (options === void 0) { options = {}; }
        options = __assign({}, this.options, options);
        //生成key
        key = this.compileKey(key, options);
        this.storage.removeItem(key);
    };
    /**
     * 清除缓存
     * @param force bool 是否清除所有的缓存,默认只清除 WebStorage创建的缓存
     */
    WStorage.prototype.clear = function (force) {
        var _this = this;
        if (force === void 0) { force = false; }
        var names = Object.getOwnPropertyNames(this.storage);
        names.forEach(function (name) {
            if (force) {
                _this.storage.removeItem(name);
            }
            else {
                _this.remove(name, { pre: '' });
            }
        });
    };
    /**
     * 清除所有过期的缓存
     */
    WStorage.prototype.clearAllExpires = function () {
        var _this = this;
        var names = Object.getOwnPropertyNames(this.storage);
        names.forEach(function (key) {
            var payload = _this.storage.getItem(key);
            try {
                if (payload !== null) {
                    var _a = JSON.parse(payload), c = _a.c, e = _a.e, v = _a.v;
                    if (e && (new Date()).getTime() > e) {
                        _this.remove(key, { pre: '' });
                    }
                }
            }
            catch (e) {
            }
        });
    };
    return WStorage;
}());
