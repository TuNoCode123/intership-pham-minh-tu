// Viết hàm sumAll(...numbers) dùng rest để tính tổng n số bất kỳ.
const sumAll = (...numbers) => numbers.reduce((acc, num) => acc + num, 0);
console.log(sumAll(1, 2, 3, 4)); // 10
