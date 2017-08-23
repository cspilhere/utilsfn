import _Object$keys from 'babel-runtime/core-js/object/keys';
export function searchArray(array, filterBy, exact) {
  if (typeof filterBy !== 'string') return [];
  var text = (filterBy || '').split(',');
  var newData = [];
  function matchExact(text, string) {
    text = text.trim();
    string = string.trim();
    var match = string.match(text);
    return match != null && string == match[0];
  }
  text.forEach(function (test) {
    test = test.trim();
    if (!test) return;
    newData = newData.concat(array.filter(function (item) {
      return _Object$keys(item).some(function (key) {
        if (typeof item[key] === 'string' && key !== '$$hashKey') {
          if (exact) {
            return matchExact(test.toLowerCase(), item[key].toLowerCase());
          }
          return item[key].toLowerCase().indexOf(test.toLowerCase()) > -1;
        }
      });
    }));
  });
  return newData;
};