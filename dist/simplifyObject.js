import _Object$keys from "babel-runtime/core-js/object/keys";
export default function simplifyObject(originalObject, newMap) {
  var tempObject = {};
  _Object$keys(newMap).forEach(function (key) {
    tempObject[key] = deepKey(originalObject, newMap[key]);
  });
  return tempObject;
};