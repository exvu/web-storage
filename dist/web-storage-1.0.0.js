window.WebStorage=function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:n})},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(e,t,r){"use strict";var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};t.__esModule=!0;var o=n(r(1));t.default=o.default},function(e,t,r){"use strict";t.__esModule=!0;var n=r(2),o=function(){function e(e){this.options=e,this.local=new u(localStorage),this.session=new u(sessionStorage)}return e.isSuppered=function(){return"Storage"in window},e}();t.default=o;var u=function(){function e(e){this.storage=e}return e.prototype.set=function(e,t){var r={c:(new Date).getTime(),e:new Date(100).getTime(),t:n.getType(t),v:t};this.storage.setItem(e,JSON.stringify(r))},e.prototype.get=function(e){var t=this.storage.getItem(e);if(null===t)return this.remove(e),null;var r=JSON.parse(t),o=(r.c,r.e,r.t),u=r.v;return n.convenrsionType(u,o)},e.prototype.remove=function(e){this.storage.removeItem(e)},e.prototype.clear=function(){},e.prototype.clearAllExpires=function(){},e}()},function(e,t,r){"use strict";t.__esModule=!0,t.getType=function(e){var t=Object.prototype.toString.call(e).match(/^\[object\s+(\S+)\]$/)[1];return(void 0===t?"object":t).toLocaleLowerCase()},t.convenrsionType=function(e,t){switch(t){case"string":return String(e);case"number":return parseInt(e);case"null":return null;case"undefined":return;case"array":case"object":return JSON.parse(e)}}}]).default;