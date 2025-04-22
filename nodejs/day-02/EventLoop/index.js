console.log("Start");

process.nextTick(() => {
  console.log("nextTick 1");
});

setTimeout(() => {
  console.log("setTimeout 1");
}, 0);

setImmediate(() => {
  console.log("setImmediate 1");
});

process.nextTick(() => {
  console.log("nextTick 2");
});

console.log("End");
