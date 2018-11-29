web-storage使用文档
=======
web-storage是一款web端的缓存工具,基于html5的storage进行扩展.
1. 添加了过期时间,传统的storage不支持设置过期时间,需要用户自行清除
2. 数据加密,可以对key,value进行加密,加密是可逆的,加密只是最基本的显示安全
3. 设置key前缀,可以为key字段设置一个前缀
4. 支持存放string以外的数据类型.传统的storage只能存放string

### 使用前应检查是否浏览器支持storage
```
WebStorage.isSuppered();
```

用法
=======
用法请参照例子文件夹下  
## `web-storage`两种使用方法
1. 页面引入js文件
2. npm配置使用

## `web-storage`配置使用
用于创建一个web-storage请求实例
```
new WebStorage([options])
```
<h2 align="center">WebStorage 实例</h2>  

|proptype|Description|
|:-:|:--------:|
|**`set(key:string,value:any,options:Options)`**| 保存数据|
|**`get(key:string,options:Options)`**| 获取数据|
|**`has(key:string,options:Options)`**| 判断key是否存在|
|**`getAll(pre:string)`**| 获取所有的由工具产生的缓存数据|
|**`remove(key:string,options:Options)`**| 删除数据|
|**`clear(force:boolean)`**| 清除所有由工具产生的缓存,`force=true`会清除所有的缓存|
|**`clearAllExpires()`**| 清除过期的数据|

<h2 align="center">Options</h2>  

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:--------:|
|**`encrypt`**|`array`| `['key','value']`| 加密字段|
|**`pre`**|`string`| `_webstorage_`| key前缀|
|**`exp`**|`number`| `24*60*60`| 过期时间|
|**`storage`**|`Srotage`| 必传| localStorage,sessionStorage其一|


#### 1.页面引入web-storage.js文件
```html
<script src="dist/web-storage.js"></script>
<script>
// 创建WebStorage实例
var webStorage = new WebStorage({
  encrypt:['key','value'],
  pre:'_wc_',
  exp:24*60*60,
  storage: localStorage,
});
//保存数据到localstorage
webStorage.set('login', {
  user:'admin',
  password:'123456'
}, {exp : 100});
</script> 
```
#### 2.npm配置使用

安装与配置
==========
```sh
$ npm install -g @exvu/web-storage #全局安装
$ npm install --save-dev @exvu/web-storage #局部安装
```
使用
```javascript
import WebStorage from '@exvu/web-storage';

let webStorage = new WebStorage({
  encrypt:['key','value'],
  pre:'_wc_',
  exp:24*60*60,
  storage: localStorage,
});
//保存数据到localstorage
webStorage.local.set('login', {
  user:'admin',
  password:'123456'
}, {exp : 100});

```

## 例子
```javascript
let webStorage = new WebStorage({
  encrypt:['key','value'],
  pre:'_wc_',
  exp:24*60*60,
  storage: localStorage,
});
/**
 * localstorage 如下 
 */
//缓存字符串username到localstorage
webStorage.set('username', 'admin');

//获取缓存字符串username
webStorage.get('username');


//判断缓存字符串username是否存在
webStorage.has('username');

//删除缓存字符串username
webStorage.remove("username");

//为缓存字符串username设置过期时间为100秒
webStorage.exp('username',100);

//获取工具产生所有的缓存字符串 ,以对象的形式返回
webStorage.getAll();

//获取所有的缓存字符串 ,以对象的形式返回
webStorage.getAll('*');

//清除所有的缓存字段(由工具产生的)
webStorage.clear();

//清除所有的缓存字段(storage所有的缓存)
webStorage.clear(true);

//清除所有的过期缓存字段(由工具产生的)
webStorage.clearAllExpires();


```