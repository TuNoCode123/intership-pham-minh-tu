import { add, multiply } from "./math.js";
// must create packege.json with "type": "module" to use import/export syntax in Node.js and end with .js
const sum = add(1, 2);
console.log(sum); // 3
const munus = multiply(2, 1);
console.log(munus); // 2
