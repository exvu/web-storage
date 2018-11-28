import WebStorage from '../index';
import chalk from 'chalk';
import format from 'stringify-object';
import Storage, { localStorage } from './storage';
const storage = new WebStorage({
    encrypt: ['key', 'value'],
    storage: localStorage,
})
let i = 1;
function log(text: string) {
    console.log(chalk.green(`${i++}.${text}`))
}
function sleep(time: number) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true);
        }, time * 1000);
    });
}
async function test() {
    //exapmle1
    log('普通存值，取值')
    console.log('a 赋值', format(storage.set('a', { a: 1 })));
    console.log('a 等于', format(storage.get('a')));

    //exapmle2
    log('删除值')
    console.log('b 赋值', format(storage.set('b', 'test')));
    console.log('b 等于', format(storage.get('b')));
    storage.remove('b');
    console.log('b 等于', format(storage.get('b')));

    //exapmle3
    log('设置过期时间,判断值是否存在')
    console.log(`a ${storage.has('a') ? '' : '不'}存在`);
    console.log(`b ${storage.has('b') ? '' : '不'}存在`);
    console.log('c 赋值', format(storage.set('c', 'test', { exp: 2 })));
    console.log(`c ${storage.has('c') ? '' : '不'}存在`);

    await sleep(1);
    console.log(`c ${storage.has('c') ? '' : '不'}存在`);
    await sleep(1);
    console.log(`c ${storage.has('c') ? '' : '不'}存在`);
    await sleep(1);

    //exapmle4 
    log('获取所有数据')
    console.log('storage', format(localStorage));
    localStorage.setItem('999', 'a');
    console.log('工具产生的数据 等于', format(storage.getAll()))
    console.log('所有数据 等于', format(storage.getAll('*')))

    //example 6 
    log('清空过期数据')
    console.log('d 赋值', format(storage.set('d', '111', { exp: 1 })));
    console.log('工具产生的数据 等于', format(localStorage));
    await sleep(2);
    storage.clearAllExpires();
    console.log('工具产生的数据 等于', format(localStorage));
    //exapmle7 
    log('清空')
    storage.clear();
    console.log('工具产生的数据 等于', format(localStorage))
    storage.clear(true);
    console.log('所有数据 等于', format(localStorage))

}

test();
