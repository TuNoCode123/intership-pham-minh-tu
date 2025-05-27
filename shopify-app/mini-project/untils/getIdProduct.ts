export const getIdProduct = (id: string) => {
  const realId = id.split("/");
  return realId.pop();
};
