export default function camelCaseToDash(string) {
  if (!string) return string;
  return string.replace(/([A-Z])/g, '-$1').toLowerCase();
};
