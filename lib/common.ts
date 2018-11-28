

export function getType(obj: any) {
    let typeStr = Object.prototype.toString.call(obj);
    let [, type = 'object'] = typeStr.match(/^\[object\s+(\S+)\]$/);
    return type.toLocaleLowerCase();
}

export function convenrsionType(value: any, type: string) {
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
export function normalizeName(name: string) {
    if (typeof name !== 'string') {
        name = String(name)
    }
    return name.toLowerCase()
}
export function compileStr(code: string) { //对字符串进行加密       
    var c = String.fromCharCode(code.charCodeAt(0) + code.length);
    for (var i = 1; i < code.length; i++) {
        c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
    }
    return escape(c) + '_c';
}
export function isComplile(code: string) {
    return (code || '').indexOf('_c');
}
export function uncompileStr(code: string) {
    code = unescape(code.substring(0, code.length - 2));
    var c = String.fromCharCode(code.charCodeAt(0) - code.length);
    for (var i = 1; i < code.length; i++) {
        c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
    }
    return c;
}
