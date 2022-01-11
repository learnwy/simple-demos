import { add, changeAdd, div, mul, sub } from "./math";

const num1 = 8;
const num2 = 4;

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

console.log("before call changeAdd");
add(num1, num2)
changeAdd();
console.log("after call changeAdd");
add(num1, num2)

console.log({
  add: add(num1, num2),
  sub: sub(num1, num2),
  mul: mul(num1, num2),
  div: div(num1, num2),
});

