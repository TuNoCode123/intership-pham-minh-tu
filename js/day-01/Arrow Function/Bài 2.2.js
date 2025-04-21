// Viết arrow function để nhận 1 mảng số, trả về mảng chứa bình phương của mỗi số.
const squareArray = (arr) => arr.map((num) => num * num);
// test
console.log(squareArray([1, 2, 3, 4])); // [1, 4, 9, 16]
