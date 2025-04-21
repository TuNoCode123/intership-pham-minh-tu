const addProduct = (products, product) => {
  if (products.length == 0) return [];
  if (!product || typeof product !== "object")
    throw new Error("Product is required");
  const { price, name, id } = product;
  if (!price || !name || !id) throw new Error("field in Product is required");
  products.push(product);
  return {
    message: "Product added successfully",
  };
};

const removeProductById = (products, id) => {
  const findItemInex = products.findIndex((item) => item.id === id);
  if (findItemInex == -1) throw new Error("Product not found");
  if (products.length == 0) return [];
  if (!id || typeof id !== "number") throw new Error("Id is required");
  products.splice(findItemInex, 1);
  return {
    message: "Product removed successfully",
  };
  //   return products.filter((product) => product.id !== id);
};

const getTotalPrice = (products) => {
  if (!Array.isArray(products)) throw new Error("Products is required Array");
  if (products.length == 0) return 0;
  const newArr = products.map((item) => {
    const { price } = item;
    if (price === undefined) throw new Error("Price is required");
    return price;
  });
  return newArr.reduce((acc, num) => acc + num, 0);
};

const getProductNames = (products) => {
  if (products.length == 0 || !Array.isArray(products)) return [];
  return products.map((product) => {
    const { name } = product;
    if (name === undefined) throw new Error("Name is required");
    return name;
  });
};

const findProduct = (products, keyword) => {
  if (products.length == 0) return [];
  if (!keyword || typeof keyword1 == "string")
    throw new Error("Keyword is required");
  return {
    message: "Product found successfully",
    Data: products.filter((product) => {
      const { name } = product;
      if (name === undefined) throw new Error("Name is required");
      return name.toLowerCase().includes(keyword.toLowerCase());
    }),
  };
};

const getExpensiveProducts = (products, minPrice) => {
  if (products.length == 0) return [];
  if (!minPrice || typeof minPrice !== "number")
    throw new Error("Min price is required");
  return products.filter((product) => {
    const { price } = product;
    if (price === undefined) throw new Error("Price is required");
    return price > minPrice;
  });
};

export {
  addProduct,
  removeProductById,
  getTotalPrice,
  getProductNames,
  findProduct,
  getExpensiveProducts,
};
