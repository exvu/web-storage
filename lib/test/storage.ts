/**
 * 模拟html5 storage
 */
interface Params {
    [propName: string]: any
}
export default class Storage {
    constructor() {
    }
    get length(): number {
        return Object.getOwnPropertyNames(this).length;
    }
    setItem(key: string, value: string) {
        (<Params>this)[key] = String(value);
    }
    getItem(key: string) {
        return (<Params>this)[key];
    }
    clear() {
        Object.getOwnPropertyNames(this).forEach(key => {
            delete (<Params>this)[key];
        })
    }
    removeItem(key: string) {
        delete (<Params>this)[key];
    }
    key(index: number): string | null {
        return '';
    }
}

export const localStorage = new Storage();
export const sessionStorage = new Storage();