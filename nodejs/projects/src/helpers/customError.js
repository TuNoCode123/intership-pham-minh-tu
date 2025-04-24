const customErrorZod = (err) => {
  return err.map((err) => ({
    field: err.path.join("."),
    message: err.message,
    suggestion: `Kiểm tra giá trị tại ${err.path.join(" → ")}`,
  }));
};
export { customErrorZod };
