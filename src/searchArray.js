export default function searchArray(array, filterBy, exact) {
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
    if (!test) return;
    newData = newData.concat(
      array.filter((item) => Object.keys(item).some((key) => {
        if (typeof item[key] === 'string' && key !== '$$hashKey') {
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
