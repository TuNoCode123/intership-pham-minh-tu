// Dùng destructuring để tách phần tử đầu và phần còn lại từ mảng:

const colors = ["red", "green", "blue"];
const [color, ...restColors] = colors;
console.log(color); // red
console.log(restColors); // ["green", "blue"]
