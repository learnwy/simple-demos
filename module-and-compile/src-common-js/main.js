var math = require("./math");
var num1 = 8;
var num2 = 4;

import("./async-module/async")
  .then(
    (async) => {
        console.log("async module load success", async);
    }, (error) => {

        console.log("async module load error", error);
    },
  );
import("./async-module/async2")
  .then(
    (async2) => {
        console.log("async2 module load success", async2);
    }, (error) => {

        console.log("async2 module load error", error);
    },
  );

console.log('before call changeAdd')
math.changeAdd()
console.log('after call changeAdd')

console.log({
    add: math.add(num1, num2),
    sub: math.sub(num1, num2),
    mul: math.mul(num1, num2),
    div: math.div(num1, num2),
});

console.log('before call changeAdd')
math.changeAdd()
console.log('after call changeAdd')
