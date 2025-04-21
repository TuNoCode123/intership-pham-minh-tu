// Dùng spread để copy mảng, thêm phần tử mới.
const oldArray = [1, 2, 3];
// oldArray = [...oldArray, 4, 5, 6]; errror here NOT REASSIGNED
const newArr = [...oldArray, 4, 5, 6];
console.log(oldArray);
