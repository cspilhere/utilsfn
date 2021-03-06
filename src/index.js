import _removeAccents from './removeAccents';

export const removeAccents = _removeAccents;

/**
 * Check if userAgent match a mobile device
 * @return {String}
 */
export const isMobile = {
  Android: function() {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function() {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function() {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function() {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function() {
    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
  }
};

/**
 * Return a unique id
 * @return {String}
 */
export function uuid() {
  let time = () => new Date();
  let uuid = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1) + time().getTime();
  return uuid();
};

/**
 * Return if a number is integer
 * @param  {Number} number
 * @return {Boolean}
 */
export const isInt = (number) => Number(number) === number && number % 1 === 0;

/**
 * Return if a number is float
 * @param  {Number} number
 * @return {Boolean}
 */
export const isFloat = (number) => Number(number) === number && number % 1 !== 0;

/**
 * Move an array item to another position
 * @param  {Array} array
 * @param  {Number} currentIndex
 * @param  {Number} offset
 * @return {Array}
 */
export function arrayMove(array, currentIndex, offset) {
  let removedItem = null;
  const index = currentIndex;
  const newIndex = index + offset;
  if (newIndex > -1 && newIndex < array.length) removedItem = array.splice(index, 1)[0];
  array.splice(newIndex, 0, removedItem);
  return array;
};

/**
 * Convert a camelCase string to dash-string
 * @param  {String}
 * @return {String}
 */
export function camelCaseToDash(string) {
  if (!string) return string;
  return string.replace(/([A-Z]|[0-9]{1,3})/g, '-$1').toLowerCase();
};

/**
 * Return a timestamp from now
 * @param  {Any} any
 * @return {String}
 */
export const getTypeOf = (any) => toString.call(any).slice(8, -1);

/**
 * @return {Date} Datetime
 */
export const timeNow = Date.now || function() {
  return new Date().getTime();
};

/**
 * Return the rgba value for the hex color
 * This function was founded on stackoverflow
 * @param  {String} hex
 * @param  {Number} opacity 0 - 100
 * @return {String}
 */
export function convertHex(hex, opacity) {
  hex = hex.replace('#','');
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  let result = `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  return result;
}

/**
 * Set a timer and create a function to wrapp a callback for delayed execution
 * @author @cspilhere
 * @param  {Number} minTime
 * @return {Function} Return a function to wrapp the callback
 * @example
 * const delay = timeDelay(130);
 * delay(() => {});
 */
export const timeDelay = (minTime) => {
  const stamp = timeNow();
  let timer = setTimeout;
  return (callback) => {
    if ((timeNow() - stamp) < minTime) {
      timer(() => {
        callback();
        timer = null;
      }, minTime - (timeNow() - stamp));
    } else {
      callback();
      timer = null;
    }
  };
};

/**
 * Wrapp a Promise with timeDelay
 * @author @cspilhere
 * @param  {Function} callback
 * @param  {Number} time
 * @return {Promise}
 */
export function promiseWrapper(callback, time = 130) {
  const delay = timeDelay(time);
  return new Promise((resolve, reject) => callback(resolve, reject, delay));
};

/**
 * Create or change a value of a key, even if has several levels
 * @author @cspilhere
 * @param  {Object} object
 * @param  {String} path
 * @param  {Any} value
 * @return {Object}/{Any}
 */
export function deepKey(object = {}, path, value) {
  let paths = path.split('.');
  let newPath = paths.slice(1);
  if (value !== undefined && value !== null) object[paths[0]] = object[paths[0]] || {};
  if (paths.length === 1) {
    if (value !== undefined && value !== null) {
      if (value !== undefined && value !== null) return object[paths[0]] = value;
      return object[paths[0]];
    }
    if (!object) return null;
    if (object.hasOwnProperty(paths[0])) return object[paths[0]];
    return null;
  }
  return deepKey(object[paths[0]], newPath.join('.'), value);
}

/**
 * Check if the object has all keys present in the array
 * @author @cspilhere
 * @param  {Object} object
 * @param  {Array} keys
 * @return {Boolean}
 */
export const checkObjectKeys = (object, keys) => {
  const filteredKeys = keys.filter((key) => deepKey(object, key) === null);
  return filteredKeys.length < 1;
};
export const objectHasKeys = checkObjectKeys; // New name for the checkObjectKeys function

/**
 * @author @cspilhere
 */
export const goodObject = (object, mappedKeys) => {
  let filteredKeys = {};
  Object.keys(mappedKeys).forEach((key) => {
    if (deepKey(object, mappedKeys[key]) !== null) {
      filteredKeys[key] = deepKey(object, mappedKeys[key]);
    }
  });
  return filteredKeys;
};

/**
 * Return number as string for presentation only
 * @author @cspilhere
 * @param  {Number} number
 * @param  {Number} float
 * @param  {String} locale
 * @return {String} Formated number
 */
export const fixNumber = (number, float, locale = 'en-US') => {
  if (isInvalidNumber(number)) return number;
  if (float >= 0) {
    return number.toLocaleString(locale, {
      maximumFractionDigits: float,
      minimumFractionDigits: 0
    });
  }
  return number;
};

/**
 * Return any formated number as raw
 * @author @cspilhere
 * @param  {String} number
 * @return {Number} Raw number
 * @todo: Parse english numbers like 1,000.00
 */
export const rawNumber = (number) => {
  const regex = /^\s*(?:(\-|)[1-9]\d{0,2}(?:(\.|)\d{3})*|0)(?:,\d{1,2})?$/;
  if (isInvalidNumber(number) && regex.test(number)) {
    number = number.replace(/\./g, '');
    number = number.replace(/,/, '.');
  }
  if (isInvalidNumber(number)) return number;
  number = number * 1;
  return number;
};

/**
 * Return true if the object is empty
 * @param  {Any} object
 * @return {Boolean}
 */
export const objectIsEmpty = (object) => Object.keys(object).length === 0 && object.constructor === Object;

/**
 * Return true if some value was expected as a number but is not
 * @author @cspilhere
 * @param  {Number} number
 * @return {Boolean}
 */
export function isInvalidNumber(number) {
  return (
    isNaN(number) ||
    !isFinite(number) ||
    number === Infinity ||
    number === 'Infinity' ||
    number === -Infinity ||
    number === '-Infinity' ||
    number === NaN ||
    number === 'NaN' ||
    number === '∞' ||
    number === '-∞' ||
    number === undefined ||
    number === 'undefined' ||
    number === null ||
    number === 'null'
  );
};

/**
 * Return an object with the original number, a formated version, the value and token
 * @author @cspilhere
 * @param  {Number} number
 * @param  {Number} float
 * @param  {String} locale
 * @return {Object} Object with all parts
 */
export const prettyNumber = (number, float, locale) => {
  const thousand = 1000;
  const million = 1000000;
  const billion = 1000000000;
  const trillion = 1000000000000;
  let parsedNumber = {};
  const original = number;
  parsedNumber.original = original;
  if (number < thousand) {
    number = String(number);
    if (float) number = fixNumber(number, float, locale);
    parsedNumber.formatted = number;
    parsedNumber.value = number;
    parsedNumber.token = null;
    return parsedNumber;
  }
  if (number >= thousand && number <= 1000000) {
    number = (number / thousand);
    if (float) number = fixNumber(number, float, locale);
    parsedNumber.formatted = number + 'k';
    parsedNumber.value = number;
    parsedNumber.token = 'k';
    return parsedNumber;
  }
  if (number >= million && number <= billion) {
    number = (number / million);
    if (float) number = fixNumber(number, float, locale);
    parsedNumber.formatted = number + 'MM';
    parsedNumber.value = number;
    parsedNumber.token = 'MM';
    return parsedNumber;
  }
  if (number >= billion && number <= trillion) {
    number = (number / billion);
    if (float) number = fixNumber(number, float, locale);
    parsedNumber.formatted = number + 'B';
    parsedNumber.value = number;
    parsedNumber.token = 'B';
    return parsedNumber;
  } else {
    number = (number / trillion);
    if (float) number = fixNumber(number, float, locale);
    parsedNumber.formatted = number + 'T';
    parsedNumber.value = number;
    parsedNumber.token = 'T';
    return parsedNumber;
  }
};

/**
 * Parse an object and transform into a string with url query
 * @author @cspilhere
 * @param  {Object} params
 * @param  {Function} customParser
 * @return {String} Url query style
 */
export function buildQuery(params, customParser) {
  if (getTypeOf(params) !== 'Object') return '';
  let pathArray = [];
  Object.keys(params).forEach((item) => {
    if (
      params[item] !== 'undefined' &&
      params[item] !== 'null' &&
      params[item] !== undefined &&
      params[item] !== null
    ) {
      let query = `${item}=${params[item]}`;
      if (customParser && typeof customParser === 'function') {
        // If customParser return null, will use the current query value
        query = customParser(params[item], item) || query;
      }
      pathArray.push(query);
    }
  });
  return `?${pathArray.join('&')}`;
};

/**
 * Parse an object and transform into a string with url query
 * @author @cspilhere
 * @param  {Object} params
 * @param  {Function} customParser
 * @return {String} Url query style
 */
export const gravatar = (email, size) => {
  if (!email) return;
  // MD5 (Message-Digest Algorithm) by WebToolkit
  let MD5=function(s){function L(k,d){return(k<<d)|(k>>>(32-d));}function K(G,k){let I,d,F,H,x;F=(G&2147483648);H=(k&2147483648);I=(G&1073741824);d=(k&1073741824);x=(G&1073741823)+(k&1073741823);if(I&d){return(x^2147483648^F^H);}if(I|d){if(x&1073741824){return(x^3221225472^F^H);}else{return(x^1073741824^F^H);}}else{return(x^F^H);}}function r(d,F,k){return(d&F)|((~d)&k);}function q(d,F,k){return(d&k)|(F&(~k));}function p(d,F,k){return(d^F^k);}function n(d,F,k){return(F^(d|(~k)));}function u(G,F,aa,Z,k,H,I){G=K(G,K(K(r(F,aa,Z),k),I));return K(L(G,H),F);}function f(G,F,aa,Z,k,H,I){G=K(G,K(K(q(F,aa,Z),k),I));return K(L(G,H),F);}function D(G,F,aa,Z,k,H,I){G=K(G,K(K(p(F,aa,Z),k),I));return K(L(G,H),F);}function t(G,F,aa,Z,k,H,I){G=K(G,K(K(n(F,aa,Z),k),I));return K(L(G,H),F);}function e(G){let Z;let F=G.length;let x=F+8;let k=(x-(x%64))/64;let I=(k+1)*16;let aa=Array(I-1);let d=0;let H=0;while(H<F){Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=(aa[Z]|(G.charCodeAt(H)<<d));H++;}Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=aa[Z]|(128<<d);aa[I-2]=F<<3;aa[I-1]=F>>>29;return aa;}function B(x){let k="",F="",G,d;for(d=0;d<=3;d++){G=(x>>>(d*8))&255;F="0"+G.toString(16);k=k+F.substr(F.length-2,2);}return k;}function J(k){k=k.replace(/rn/g,"n");let d="";for(let F=0;F<k.length;F++){let x=k.charCodeAt(F);if(x<128){d+=String.fromCharCode(x);}else{if((x>127)&&(x<2048)){d+=String.fromCharCode((x>>6)|192);d+=String.fromCharCode((x&63)|128);}else{d+=String.fromCharCode((x>>12)|224);d+=String.fromCharCode(((x>>6)&63)|128);d+=String.fromCharCode((x&63)|128);}}}return d;}let C=Array();let P,h,E,v,g,Y,X,W,V;let S=7,Q=12,N=17,M=22;let A=5,z=9,y=14,w=20;let o=4,m=11,l=16,j=23;let U=6,T=10,R=15,O=21;s=J(s);C=e(s);Y=1732584193;X=4023233417;W=2562383102;V=271733878;for(P=0;P<C.length;P+=16){h=Y;E=X;v=W;g=V;Y=u(Y,X,W,V,C[P+0],S,3614090360);V=u(V,Y,X,W,C[P+1],Q,3905402710);W=u(W,V,Y,X,C[P+2],N,606105819);X=u(X,W,V,Y,C[P+3],M,3250441966);Y=u(Y,X,W,V,C[P+4],S,4118548399);V=u(V,Y,X,W,C[P+5],Q,1200080426);W=u(W,V,Y,X,C[P+6],N,2821735955);X=u(X,W,V,Y,C[P+7],M,4249261313);Y=u(Y,X,W,V,C[P+8],S,1770035416);V=u(V,Y,X,W,C[P+9],Q,2336552879);W=u(W,V,Y,X,C[P+10],N,4294925233);X=u(X,W,V,Y,C[P+11],M,2304563134);Y=u(Y,X,W,V,C[P+12],S,1804603682);V=u(V,Y,X,W,C[P+13],Q,4254626195);W=u(W,V,Y,X,C[P+14],N,2792965006);X=u(X,W,V,Y,C[P+15],M,1236535329);Y=f(Y,X,W,V,C[P+1],A,4129170786);V=f(V,Y,X,W,C[P+6],z,3225465664);W=f(W,V,Y,X,C[P+11],y,643717713);X=f(X,W,V,Y,C[P+0],w,3921069994);Y=f(Y,X,W,V,C[P+5],A,3593408605);V=f(V,Y,X,W,C[P+10],z,38016083);W=f(W,V,Y,X,C[P+15],y,3634488961);X=f(X,W,V,Y,C[P+4],w,3889429448);Y=f(Y,X,W,V,C[P+9],A,568446438);V=f(V,Y,X,W,C[P+14],z,3275163606);W=f(W,V,Y,X,C[P+3],y,4107603335);X=f(X,W,V,Y,C[P+8],w,1163531501);Y=f(Y,X,W,V,C[P+13],A,2850285829);V=f(V,Y,X,W,C[P+2],z,4243563512);W=f(W,V,Y,X,C[P+7],y,1735328473);X=f(X,W,V,Y,C[P+12],w,2368359562);Y=D(Y,X,W,V,C[P+5],o,4294588738);V=D(V,Y,X,W,C[P+8],m,2272392833);W=D(W,V,Y,X,C[P+11],l,1839030562);X=D(X,W,V,Y,C[P+14],j,4259657740);Y=D(Y,X,W,V,C[P+1],o,2763975236);V=D(V,Y,X,W,C[P+4],m,1272893353);W=D(W,V,Y,X,C[P+7],l,4139469664);X=D(X,W,V,Y,C[P+10],j,3200236656);Y=D(Y,X,W,V,C[P+13],o,681279174);V=D(V,Y,X,W,C[P+0],m,3936430074);W=D(W,V,Y,X,C[P+3],l,3572445317);X=D(X,W,V,Y,C[P+6],j,76029189);Y=D(Y,X,W,V,C[P+9],o,3654602809);V=D(V,Y,X,W,C[P+12],m,3873151461);W=D(W,V,Y,X,C[P+15],l,530742520);X=D(X,W,V,Y,C[P+2],j,3299628645);Y=t(Y,X,W,V,C[P+0],U,4096336452);V=t(V,Y,X,W,C[P+7],T,1126891415);W=t(W,V,Y,X,C[P+14],R,2878612391);X=t(X,W,V,Y,C[P+5],O,4237533241);Y=t(Y,X,W,V,C[P+12],U,1700485571);V=t(V,Y,X,W,C[P+3],T,2399980690);W=t(W,V,Y,X,C[P+10],R,4293915773);X=t(X,W,V,Y,C[P+1],O,2240044497);Y=t(Y,X,W,V,C[P+8],U,1873313359);V=t(V,Y,X,W,C[P+15],T,4264355552);W=t(W,V,Y,X,C[P+6],R,2734768916);X=t(X,W,V,Y,C[P+13],O,1309151649);Y=t(Y,X,W,V,C[P+4],U,4149444226);V=t(V,Y,X,W,C[P+11],T,3174756917);W=t(W,V,Y,X,C[P+2],R,718787259);X=t(X,W,V,Y,C[P+9],O,3951481745);Y=K(Y,h);X=K(X,E);W=K(W,v);V=K(V,g);}let i=B(Y)+B(X)+B(W)+B(V);return i.toLowerCase();};
  size = size || 80;
  return 'http://www.gravatar.com/avatar/' + MD5(email) + '.jpg?s=' + size + '&d=retro';
};

/**
 */
export const debounce = (callback, wait, immediate) => {
  let timeout, timestamp, result;
  let later = () => {
    let last = timeNow() - timestamp;
    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = callback();
      }
    }
  };
  return () => {
    timestamp = timeNow();
    let callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = callback();
    }
    return result;
  };
};


/**
 */
export function filterArrayBy(array, filterBy, exact) {
  if (typeof filterBy !== 'string') return [];
  let text = (filterBy || '').split(',');
  let newData = [];
  function matchExact(text, string) {
    text = text.trim();
    string = string.trim();
    let match = string.match(text);
    return match != null && string == match[0];
  }
  text.forEach((test) => {
    test = test.trim();
    // if (!test) return;
    newData = newData.concat(
      array.filter((item) => Object.keys(item).some((key) => {
        if (typeof item[key] === 'string') {
          if (exact) {
            return matchExact(test.toLowerCase(), item[key].toLowerCase());
          }
          return item[key].toLowerCase().indexOf(test.toLowerCase()) > -1;
        }
      }))
    );
  });
  return newData;
};

/**
 */
export function setFormInitialFocus(formElement) {
  const form = formElement;
  if (form) {
    const formElements = form.elements;
    for (let i = 0; i < formElements.length; i++) {
      if (formElements[i].nodeName !== 'BUTTON') {
        formElements[i].focus();
        break;
      }
    }
  }
}
