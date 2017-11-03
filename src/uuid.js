export default function uuid() {
  let time = () => new Date();
  let uuid = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1) + time().getTime();
  //
  return uuid();
};
