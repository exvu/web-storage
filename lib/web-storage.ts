import { getType, convenrsionType } from "./common";


interface WebStorageOption {
    encrypt: Array<'key' | 'value'>,//需要的加密字段
}
export default class WebStorage {

    public local: WStorage;
    public session: WStorage;
    constructor(private options?: WebStorageOption) {
        this.local = new WStorage(localStorage);
        this.session = new WStorage(sessionStorage);
    }
    static isSuppered(): boolean {
        return 'Storage' in window;
    }
}


class WStorage {
    constructor(private storage: Storage) {

    }
    set(key: string, value: any) {
        let data = {
            c: (new Date()).getTime(),
            e: (new Date(100)).getTime(),
            t: getType(value),
            v: value,
        }
        this.storage.setItem(key, JSON.stringify(data));
    }
    get(key: string) {

        let payload = this.storage.getItem(key);
        if (payload === null) {
            this.remove(key);
            return null;
        }
        let { c, e, t, v } = JSON.parse(payload);
        // if ((new Date()).getTime() > e) {
        //     this.remove(key);
        //     return null;
        // }
        return convenrsionType(v, t);
    }
    remove(key: string) {
        this.storage.removeItem(key);
    }
    clear() {

    }
    clearAllExpires() {

    }
}
