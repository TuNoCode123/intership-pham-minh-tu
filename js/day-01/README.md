# My Internship Project

1, var,let,const

- var:
  Phạm vi: function( biến chỉ sống trong hàm).
  Có thể re-declare và thay đổi giá trị.
  Hoisted (khai báo lên đầu).
- let:
  Phạm vi: block (biến chỉ sống trong khối mã (như if, for)).
  Có thể thay đổi giá trị, không thể re-declare trong phạm vi.
  Hoisted nhưng không thể truy cập trước khi khai báo.
- const:
  Phạm vi: block.
  Không thể thay đổi giá trị (với giá trị nguyên thủy).
  Hoisted nhưng không thể truy cập trước khi khai báo.

2, Arrow Function
Arrow function: không có this riêng, không có arguments, không thể dùng với new.

- Arrow Function và this:
  const obj = {
  name: 'John',
  greet: () => {
  console.log(this.name); // this không tham chiếu đến obj, mà là global object (window hoặc undefined trong strict mode)
  }
  };
- Arrow Function và arguments:
  Arrow function không có đối tượng arguments. Nếu bạn cần truy cập tất cả tham số trong một arrow function, bạn phải sử dụng rest parameters (...args).

  const sum = (...args) => {
  console.log(args); // args là mảng
  };
  sum(1, 2, 3); // [1, 2, 3]

- Arrow Function không thể dùng với new:
  const Person = (name) => {
  this.name = name; // Không thể sử dụng `this` như trong hàm thông thường
  };
  const p = new Person('John'); // TypeError: Person is not a constructor

Tác dụng:

- Cú pháp ngắn gọn
- Thường được dùng cho các hàm callback ngắn map, filter, reduce,...

3, Spread & Rest
note: rest alway stand at end of parameter

- Spread:
  const arr = [1, 2, 3, 4, 5];
  const newArr = [0, ...arr, 6];
  console.log(newArr);// Kết quả: [0, 1, 2, 3, 4, 5, 6]
- Rest:
  const arr = [1, 2, 3, 4, 5];
  const [first, second, ...restNumber] = arr;
  console.log(first); // 1
  console.log(second); // 2
  console.log(restNumber); // [3, 4, 5]
  4, Destructuring
  -array
  const [a,b]=[1,2,3,4,5]
  console.log(a,b) //1,2
  -object
  const user {
  name:"fdasfdas",
  age:12,
  gender:female
  }
  const {name,age}=user;
  console.log(name,age) //fdasfdas,12
  5, Export / Import ->>>for module es6+
  6, Array Functions (map, filter, reduce, ...)
  7, Primitive(number,string,boolean,undefined,null,symbol) vs Reference(object,array,function)
