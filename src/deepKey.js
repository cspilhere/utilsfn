/**
 * Create or change a value of a key, even if has several levels
 * @author @cspilhere
 * @param  {Object} object
 * @param  {String} path
 * @param  {Any} value
 * @return {Object}/{Any}
 */
export default function deepKey(object, path, value) {
  let paths = path.split('.');
  let newPath = paths.slice(1);
  object[paths[0]] = object[paths[0]] || {};
  if (paths.length === 1) {
    if (value !== undefined) {
      return object[paths[0]] = value;
    }
    return object[paths[0]];
  }
  return deepKey(object[paths[0]], newPath.join('.'), value);
}
