// : Dùng destructuring để tách các phần tử từ object sau:

// const user = { name: 'An', age: 20, city: 'HCM' };
const user = { name: "An", age: 20, city: "HCM" };

const { name, age, city } = user;
console.log(name); // An
console.log(age); // 20
console.log(city); // HCM
