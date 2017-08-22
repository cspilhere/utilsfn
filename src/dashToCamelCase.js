export function dashToCamelCase(string) {
  if (!string) return string;
  let newString = '';
  string = string.split('-');
  string.forEach((item) => {
    newString += item.charAt(0).toUpperCase() + item.slice(1);
  });
  return newString.charAt(0).toLowerCase() + newString.slice(1);
};
