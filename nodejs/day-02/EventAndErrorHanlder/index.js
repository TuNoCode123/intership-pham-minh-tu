const DivideByZero = (a, b) => {
  try {
    if (b == 0) {
      throw new Error("Cannot divide by zero!");
    }
    return a / b;
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
};
const numberFinal = DivideByZero(5, 0);
console.log(numberFinal);

// nếu không sử dụng try/cath thì sử dụng EventEmitter
const DivideByZeroWithEvent = (a, b) => {
  if (b == 0) throw new Error("Cannot divide by zero!");
  return a / b;
};
process.on("uncaughtException", (err) => {
  console.error("Đã bắt lỗi:", err);
  // Thường thì nên log lỗi và thoát app an toàn
  process.exit(1);
});
console.log(DivideByZeroWithEvent(5, 0));
