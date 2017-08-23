export default function spaceToCamelCase(string) {
  if (!string) return string;
  var newString = '';
  string = removeAccents(string);
  string = string.replace('-', ' ');
  string = string.split(' ');
  if (string.length < 2) return string[0].charAt(0).toLowerCase() + string[0].slice(1);
  string.forEach(function (item) {
    newString += item.charAt(0).toUpperCase() + item.slice(1);
  });
  return newString.charAt(0).toLowerCase() + newString.slice(1);
};