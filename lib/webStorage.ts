import { getType, convenrsionType, normalizeName, compileStr, uncompileStr, isComplile } from "./common";

export interface Option {
    encrypt?: Array<string>,//需要的加密字段
    pre?: string,
    exp?: number | null
}
export interface WebStorageOption extends Option {
    storage: Storage,
}

export default class WebStorage {
    private options: {
        encrypt: Array<string>,//需要的加密字段
        pre: string,
        exp: number | null
    };
    private storage: Storage;
    constructor({ storage, ..._options }: WebStorageOption) {
        this.options = {
            encrypt: ['value'],
            pre: '_web_',
            exp: null,
            ..._options,
        }
        this.storage = storage;
    }
    /**
    * 判断是否支持storage
    */
    static isSuppered(): boolean {
        return 'Storage' in window;
    }
    /**
    * 修改配置
    */
    setOptions(values: Option) {
        this.options = {
            ...this.options,
            ...values,
        };
    }
    /**
     * 获取配置
     */
    getOptions() {
        return this.options;
    }
    /**
     * 编码key
     * @param key 
     * @param options 
     */
    private compileKey(key: string, options: Option) {
        if (options.encrypt && options.encrypt.indexOf('key') !== -1) {
            key = compileStr(normalizeName(options.pre + key));
        }
        return key;
    }
    /**
     * 解码key
     */
    private uncompileKey(key: string, options: Option) {
        if (options.encrypt && options.encrypt.indexOf('key') !== -1) {
            key = uncompileStr(key);
        }
        return key;
    }
    /**
     * 编码值
     * @param value 
     * @param options 
     */
    private compileValue(value: any, options: Option) {
        if (options.encrypt && options.encrypt.indexOf('value') !== -1) {
            value = compileStr(JSON.stringify(value));
        }
        return value;
    }
    /**
     * 解码值
     * @param value 
     * @param options 
     */
    private uncompileValue(value: any, options: Option) {
        if (options.encrypt && options.encrypt.indexOf('value') !== -1) {
            value = uncompileStr(value);
        }
        return JSON.parse(value);
    }

    /**
     * 设置指定的缓存
     * @param key 
     * @param value 
     * @param options 
     */
    set(key: string, value: any, options?: Option) {
        options = {
            ...this.options,
            ...options
        }
        //生成key
        key = this.compileKey(key, options);
        let currentDate = new Date();
        let data = {
            c: currentDate.getTime(),
            e: options.exp ? (new Date(currentDate.getTime() + options.exp * 1000)).getTime() : null,
            v: this.compileValue(value, options),
        }
        this.storage.setItem(key, JSON.stringify(data));
        return {
            [key]: data
        }
    }
    exp(key: string, expTime: number, options: Option = {}) {
        //生成key
        key = this.compileKey(key, {
            ...this.options,
            ...options
        });
        let payload: any = this.storage.getItem(key);
        if (payload === null) {
            return false;
        }
        try {
            let data = JSON.parse(payload);
            let currentDate = new Date();
            data['e'] = new Date(currentDate.getTime() + expTime).getTime();
            this.storage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            return false
        }
    }
    /**
     * 获取指定的缓存
     */
    get(key: string, options: Option = {}) {
        options = {
            ...this.options,
            ...options
        }
        //生成key
        key = this.compileKey(key, options);
        let payload = this.storage.getItem(key);
        if (!payload) {
            console.log(key, payload);
            this.remove(key, options);
            return null;
        }

        try {
            let { c, e, v } = JSON.parse(payload);
            if (e && (new Date()).getTime() > e) {
                this.remove(key, options);
                return null;
            }
            v = this.uncompileValue(v, options);

            return v;
        } catch (e) {
            console.log(payload);
            return payload;
        }
    }
    /**
     * 判断是否存在指定缓存
     * @param key 
     * @param options 
     */
    has(key: string, options: Option = {}) {
        //生成key
        key = this.compileKey(key, {
            ...this.options,
            ...options
        });
        if (!(key in this.storage)) {
            return false;
        }
        let payload: any = this.storage.getItem(key);
        let { c, e, v } = JSON.parse(payload);
        if (e && (new Date()).getTime() > e) {
            return false;
        }
        return true;
    }
    /**
     * 获取缓存的所有数据
     * 
     * @param pre
     * * 获取所有
     * null 获取工具产生的数据
     */
    getAll(pre?: string) {
        let names = Object.getOwnPropertyNames(this.storage);
        let list: { [index: string]: any } = {};
        names.forEach(name => {

            if (pre == '*') {
                list[name] = this.storage.getItem(name);
                return;
            } else {
                let _name = isComplile(name) ? this.uncompileKey(name, this.options) : name;
                if (_name.indexOf(this.options.pre) == 0) {
                    let key = _name.replace(this.options.pre, '');
                    list[key] = this.get(key, this.options);
                    return;
                }
            }
        })
        return list;
    }
    /**
     * 移除指定的缓存
     * @param key 
     */
    remove(key: string, options: Option = {}) {

        //生成key
        key = this.compileKey(key, {
            ...this.options,
            ...options
        });
        this.storage.removeItem(key);
    }
    /**
     * 清除缓存
     * @param force bool 是否清除所有的缓存,默认只清除 WebStorage创建的缓存
     */
    clear(all: boolean = false) {
        let names = Object.getOwnPropertyNames(this.storage);
        names.forEach(name => {
            if (all) {
                this.storage.removeItem(name);
            } else {
                let _name = isComplile(name) ? this.uncompileKey(name, this.options) : name;
                this.remove(_name, {
                    ...this.options,
                    pre: '',
                });
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
                        this.storage.removeItem(key);
                    }
                }
            } catch (e) {
            }
        })
    }
}
