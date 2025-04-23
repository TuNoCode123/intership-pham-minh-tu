const customErrorZod = (err) => {
  return err.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));
};
export { customErrorZod };
