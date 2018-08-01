import { getType, convenrsionType, normalizeName, compileStr, uncompileStr } from "./common";


interface WebStorageOption {
    encrypt?: Array<'key' | 'value'>,//需要的加密字段
    pre?: string,
    exp?: number
}
export default class WebStorage {

    public local: WStorage;
    public session: WStorage;
    constructor(private options: WebStorageOption = {
        encrypt: ['value'],
        pre: '_webstorage_',
        exp: 24 * 60 * 60
    }) {
        this.local = new WStorage(localStorage, options);
        this.session = new WStorage(sessionStorage, options);
    }
    static isSuppered(): boolean {
        return 'Storage' in window;
    }
}
class WStorage {
    constructor(private storage: Storage, private options: WebStorageOption) {
    }

    /**
     * 编码key
     * @param key 
     * @param options 
     */
    private compileKey(key: string, options: WebStorageOption) {
        key = normalizeName(options.pre + key);
        if (options.encrypt && options.encrypt.indexOf('key') !== -1) {
            key = compileStr(key);
        }
        return key;
    }
    /**
     * 编码值
     * @param value 
     * @param options 
     */
    private compileValue(value: any, options: WebStorageOption) {
        value = JSON.stringify(value);
        if (options.encrypt && options.encrypt.indexOf('value') !== -1) {
            value = compileStr(value);
        }
        return value;
    }
    /**
     * 解码值
     * @param value 
     * @param options 
     */
    private uncompileValue(value: any, options: WebStorageOption) {
        if (options.encrypt && options.encrypt.indexOf('value') !== -1) {
            value = uncompileStr(value);
        }
        try {
            value = JSON.parse(value);
        } catch (e) {
            return null;
        }
        return value;
    }

    /**
     * 设置指定的缓存
     * @param key 
     * @param value 
     * @param options 
     */
    set(key: string, value: any, options: WebStorageOption) {

        options = {
            ...this.options,
            ...options
        }

        //生成key
        key = this.compileKey(key, options);
        let currentDate = new Date();
        let data = {
            c: currentDate.getTime(),
            e: options.exp ? (new Date(currentDate.getTime() + options.exp * 1000)).getTime() : Infinity,
            v: this.compileValue(value, options),
        }
        this.storage.setItem(key, JSON.stringify(data));
        return {
            [key]: data
        }
    }
    exp(key: string, expTime: number, options: WebStorageOption = {}) {
        options = {
            ...this.options,
            ...options
        }
        //生成key
        key = this.compileKey(key, options);
        let payload: any = this.storage.getItem(key);
        if (payload === null) {
            return false;
        }
        try {
            let { c, e, v } = JSON.parse(payload);
            let currentDate = new Date();
            e = new Date(currentDate.getTime() + expTime).getTime();
            this.storage.setItem(key, JSON.stringify({
                c,
                e,
                v
            }));

            return true;
        } catch (e) {
            return false
        }

    }
    /**
     * 获取指定的缓存
     * @param key 
     */
    get(key: string, options: WebStorageOption = {}) {
        options = {
            ...this.options,
            ...options
        }
        //生成key
        key = this.compileKey(key, options);
        let payload = this.storage.getItem(key);
        if (payload === null) {
            this.remove(key);
            return null;
        }
        try {
            let { c, e, v } = JSON.parse(payload);
            if (e && (new Date()).getTime() > e) {
                this.remove(key);
                return null;
            }
            v = this.uncompileValue(v, options);
            return v;
        } catch (e) {
            return null;
        }
    }
    /**
     * 判断是否存在指定缓存
     * @param key 
     * @param options 
     */
    has(key: string, options: WebStorageOption = {}) {
        options = {
            ...this.options,
            ...options
        }
        //生成key
        key = this.compileKey(key, options);
        return key in this.storage;
    }
    /**
     * 获取缓存的所有数据
     */
    getAll(pre: string = '') {
        let names = Object.getOwnPropertyNames(this.storage);
        let list: { [index: string]: any } = {};
        names.forEach(name => {
            name = name.replace(this.options.pre || '', '');
            list[name] = this.get(name);
        })
        return list;
    }
    /**
     * 移除指定的缓存
     * @param key 
     */
    remove(key: string, options: WebStorageOption = {}) {
        options = {
            ...this.options,
            ...options
        }
        //生成key
        key = this.compileKey(key, options);
        this.storage.removeItem(key);
    }
    /**
     * 清除缓存
     * @param force bool 是否清除所有的缓存,默认只清除 WebStorage创建的缓存
     */
    clear(force: boolean = false) {
        let names = Object.getOwnPropertyNames(this.storage);
        names.forEach(name => {
            if (force) {
                this.storage.removeItem(name);
            } else {
                this.remove(name, { pre: '' });
            }
        })
    }
    /**
     * 清除所有过期的缓存
     */
    clearAllExpires() {
        let names = Object.getOwnPropertyNames(this.storage);
        names.forEach(key => {
            let payload = this.storage.getItem(key);
            try {
                if (payload !== null) {
                    let { c, e, v } = JSON.parse(payload);
                    if (e && (new Date()).getTime() > e) {
                        this.remove(key, { pre: '' });
                    }
                }
            } catch (e) {
            }
        })
    }
}
