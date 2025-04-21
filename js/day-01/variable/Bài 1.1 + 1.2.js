// Bài 1.1: Viết 1 đoạn code minh hoạ sự khác biệt giữa var, let, const khi khai báo trong block scope.
// var
var a = 3;
var a = 5;
a = "fdajfdklasjfldsaf"; // reassign
var a = "fdkslhafdkjsahfkdjash";
const arrowFunctions = () => {
  // other scope
  var a = 5;
  var a = "kfhsdakfjhdsakfhda";
};
// --------> var variable can be redeclared in the same scope and can be reassigned
// let
let b = 5;
b = "fdlaskjfldksajfldksa"; // reassign
// let b="fdslakjfdlsakjfdsa"                error here
if (b == 5) {
  // other scope
  let b = 8;
  // let b="fdas,fhdksahfdsa"              e rror here
}
// --------> let variable can not be redeclared in the same scope and can be reassigned
//const
const c = 5;
// c = 6; error here
console.log(c);
// const c=6            error here
const arrowFunctionsConst = () => {
  // other scope
  const a = "fdlkashjfksdahfkdjsa";
  //   const a="fdslafdlskj"         error here
};
// ----->> const variable can not be redeclared in the same scope and can not be reassigned
