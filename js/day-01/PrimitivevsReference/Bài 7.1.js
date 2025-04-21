// Viết ví dụ để chứng minh number là kiểu primitive, còn object là kiểu tham chiếu.
let a = 5;
a = 8;
console.log(a); // 8
// ----> Number is primitive type, so when we assign a new value to a, it doesn't affect the original value.
let person = {
  name: "An",
  age: 20,
};
let person2 = person;
person2.name = "B";
console.log(person.name); // B
// ---> Object is reference type, so when we assign person to person2, they point to the same object in memory. Therefore, changing person2 also changes person.
