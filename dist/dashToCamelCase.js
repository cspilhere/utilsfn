export default function dashToCamelCase(string) {
  if (!string) return string;
  var newString = '';
  string = string.split('-');
  string.forEach(function (item) {
    newString += item.charAt(0).toUpperCase() + item.slice(1);
  });
  return newString.charAt(0).toLowerCase() + newString.slice(1);
};