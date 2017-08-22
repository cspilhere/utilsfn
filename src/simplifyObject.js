export function simplifyObject(originalObject, newMap) {
  let tempObject = {};
  Object.keys(newMap).forEach((key) => {
    tempObject[key] = deepKey(originalObject, newMap[key]);
  });
  return tempObject;
};
