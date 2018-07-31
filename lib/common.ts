

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