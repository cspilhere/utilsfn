export default function uuid() {
  var time = function time() {
    return new Date();
  };
  var uuid = function uuid() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1) + time().getTime();
  };
  return uuid();
};