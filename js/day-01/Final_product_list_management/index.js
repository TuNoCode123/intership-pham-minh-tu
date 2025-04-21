import {
  addProduct,
  findProduct,
  getExpensiveProducts,
  getProductNames,
  getTotalPrice,
  removeProductById,
} from "./productModule.js";

const products = [
  { id: 1, name: "iPhone", price: 1000 },
  { id: 2, name: "iPad", price: 800 },
  { id: 3, name: "Macbook", price: 2000 },
];
// add
addProduct(products, { id: 4, name: "AirPods", price: 200 });
console.log(products);
// [{ id: 1, name: "iPhone", price: 1000 },
//  { id: 2, name: "iPad", price: 800 },
//  { id: 3, name: "Macbook", price: 2000 },
// { id: 4, name: "AirPods", price: 200 }]

// xóa sản phẩm theo id
removeProductById(products, 2);
console.log(products);
// [{ id: 1, name: "iPhone", price: 1000 },
// { id: 3, name: "Macbook", price: 2000 },
//  { id: 4, name: "AirPods", price: 200 }]
const sum = getTotalPrice(products);
console.log(sum); // 3200
const listName = getProductNames(products);
console.log(listName); // ["iPhone", "Macbook", "AirPods"]
const search = findProduct(products, "i");
console.log(search);
// [{ id: 1, name: "iPhone", price: 1000 },
//  { id: 3, name: "Macbook", price: 2000 }]
const list = getExpensiveProducts(products, 99);
console.log(list);
// [{ id: 1, name: "iPhone", price: 1000 },
//  { id: 3, name: "Macbook", price: 2000 }]
