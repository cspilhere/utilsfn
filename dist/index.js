'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prettyNumber = exports.objectIsEmpty = exports.rawNumber = exports.fixNumber = exports.objectHasKeys = exports.checkObjectKeys = exports.timeDelay = exports.timeNow = exports.getTypeOf = exports.isFloat = exports.isInt = exports.isMobile = exports.removeAccents = undefined;
exports.uuid = uuid;
exports.arrayMove = arrayMove;
exports.camelCaseToDash = camelCaseToDash;
exports.convertHex = convertHex;
exports.promiseWrapper = promiseWrapper;
exports.deepKey = deepKey;
exports.isInvalidNumber = isInvalidNumber;
exports.buildQuery = buildQuery;

var _removeAccents2 = require('./removeAccents');

var _removeAccents3 = _interopRequireDefault(_removeAccents2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var removeAccents = exports.removeAccents = _removeAccents3.default;

/**
 * Check if userAgent match a mobile device
 * @return {String}
 */
var isMobile = exports.isMobile = {
  Android: function Android() {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function BlackBerry() {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function iOS() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function Opera() {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function Windows() {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function any() {
    return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
  }
};

/**
 * Return a unique id
 * @return {String}
 */
function uuid() {
  var time = function time() {
    return new Date();
  };
  var uuid = function uuid() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1) + time().getTime();
  };
  return uuid();
};

/**
 * Return if a number is integer
 * @param  {Number} number
 * @return {Boolean}
 */
var isInt = exports.isInt = function isInt(number) {
  return Number(number) === number && number % 1 === 0;
};

/**
 * Return if a number is float
 * @param  {Number} number
 * @return {Boolean}
 */
var isFloat = exports.isFloat = function isFloat(number) {
  return Number(number) === number && number % 1 !== 0;
};

/**
 * Move an array item to another position
 * @param  {Array} array
 * @param  {Number} currentIndex
 * @param  {Number} offset
 * @return {Array}
 */
function arrayMove(array, currentIndex, offset) {
  var removedItem = null;
  var index = currentIndex;
  var newIndex = index + offset;
  if (newIndex > -1 && newIndex < array.length) removedItem = array.splice(index, 1)[0];
  array.splice(newIndex, 0, removedItem);
  return array;
};

/**
 * Convert a camelCase string to dash-string
 * @param  {String}
 * @return {String}
 */
function camelCaseToDash(string) {
  if (!string) return string;
  return string.replace(/([A-Z])/g, '-$1').toLowerCase();
};

/**
 * Return a timestamp from now
 * @param  {Any} any
 * @return {String}
 */
var getTypeOf = exports.getTypeOf = function getTypeOf(any) {
  return toString.call(any).slice(8, -1);
};

/**
 * @return {Date} Datetime
 */
var timeNow = exports.timeNow = Date.now || function () {
  return new Date().getTime();
};

/**
 * Return the rgba value for the hex color
 * This function was founded on stackoverflow
 * @param  {String} hex
 * @param  {Number} opacity 0 - 100
 * @return {String}
 */
function convertHex(hex, opacity) {
  hex = hex.replace('#', '');
  var r = parseInt(hex.substring(0, 2), 16);
  var g = parseInt(hex.substring(2, 4), 16);
  var b = parseInt(hex.substring(4, 6), 16);
  var result = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + opacity / 100 + ')';
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
var timeDelay = exports.timeDelay = function timeDelay(minTime) {
  var stamp = timeNow();
  var timer = setTimeout;
  return function (callback) {
    if (timeNow() - stamp < minTime) {
      timer(function () {
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
function promiseWrapper(callback) {
  var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 130;

  var delay = timeDelay(time);
  return new Promise(function (resolve, reject) {
    return callback(resolve, reject, delay);
  });
};

/**
 * Create or change a value of a key, even if has several levels
 * @author @cspilhere
 * @param  {Object} object
 * @param  {String} path
 * @param  {Any} value
 * @return {Object}/{Any}
 */
function deepKey(object, path, value) {
  var paths = path.split('.');
  var newPath = paths.slice(1);
  if (value) object[paths[0]] = object[paths[0]] || {};
  if (paths.length === 1) {
    if (value !== undefined) {
      if (value) return object[paths[0]] = value;
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
var checkObjectKeys = exports.checkObjectKeys = function checkObjectKeys(object, keys) {
  var filteredKeys = keys.filter(function (key) {
    return deepKey(object, key) === null;
  });
  return filteredKeys.length < 1;
};

/**
 * New name for the checkObjectKeys function
 */
var objectHasKeys = exports.objectHasKeys = checkObjectKeys;

/**
 * Return number as string for presentation only
 * @author @cspilhere
 * @param  {Number} number
 * @param  {Number} float
 * @param  {String} locale
 * @return {String} Formated number
 */
var fixNumber = exports.fixNumber = function fixNumber(number, float) {
  var locale = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'en-US';

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
var rawNumber = exports.rawNumber = function rawNumber(number) {
  var regex = /^\s*(?:(\-|)[1-9]\d{0,2}(?:(\.|)\d{3})*|0)(?:,\d{1,2})?$/;
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
var objectIsEmpty = exports.objectIsEmpty = function objectIsEmpty(object) {
  return Object.keys(object).length === 0 && object.constructor === Object;
};

/**
 * Return true if some value was expected as a number but is not
 * @author @cspilhere
 * @param  {Number} number
 * @return {Boolean}
 */
function isInvalidNumber(number) {
  return isNaN(number) || !isFinite(number) || number === Infinity || number === 'Infinity' || number === -Infinity || number === '-Infinity' || number === NaN || number === 'NaN' || number === '∞' || number === '-∞' || number === undefined || number === 'undefined' || number === null || number === 'null';
};

/**
 * Return an object with the original number, a formated version, the value and token
 * @author @cspilhere
 * @param  {Number} number
 * @param  {Number} float
 * @param  {String} locale
 * @return {Object} Object with all parts
 */
var prettyNumber = exports.prettyNumber = function prettyNumber(number, float, locale) {
  var thousand = 1000;
  var million = 1000000;
  var billion = 1000000000;
  var trillion = 1000000000000;
  var parsedNumber = {};
  var original = number;
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
    number = number / thousand;
    if (float) number = fixNumber(number, float, locale);
    parsedNumber.formatted = number + 'k';
    parsedNumber.value = number;
    parsedNumber.token = 'k';
    return parsedNumber;
  }
  if (number >= million && number <= billion) {
    number = number / million;
    if (float) number = fixNumber(number, float, locale);
    parsedNumber.formatted = number + 'MM';
    parsedNumber.value = number;
    parsedNumber.token = 'MM';
    return parsedNumber;
  }
  if (number >= billion && number <= trillion) {
    number = number / billion;
    if (float) number = fixNumber(number, float, locale);
    parsedNumber.formatted = number + 'B';
    parsedNumber.value = number;
    parsedNumber.token = 'B';
    return parsedNumber;
  } else {
    number = number / trillion;
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
function buildQuery(params, customParser) {
  var pathArray = [];
  Object.keys(params).forEach(function (item) {
    if (params[item] !== 'undefined' && params[item] !== 'null' && params[item] !== undefined && params[item] !== null) {
      var query = item + '=' + params[item].toUpperCase();
      if (customParser && typeof customParser === 'function') {
        // If customParser return null, will use the current query value
        query = customParser(params[item], item) || query;
      }
      pathArray.push(query);
    }
  });
  return '?' + pathArray.join('&');
};