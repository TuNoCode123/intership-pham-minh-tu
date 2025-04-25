import { useMemo, useState } from "react";
import Product from "./product";
import type { IProduct } from "./interface";
import Cart from "./cart";

const products = [
  {
    id: 1,
    name: "Áo thun trắng",
    price: 150000,
  },
  {
    id: 2,
    name: "Quần jeans xanh",
    price: 350000,
  },
  {
    id: 3,
    name: "Giày sneaker",
    price: 550000,
  },
  {
    id: 4,
    name: "Giày sneaker",
    price: 550000,
  },
  {
    id: 5,
    name: "Giày sneaker",
    price: 550000,
  },
  {
    id: 6,
    name: "Giày sneaker",
    price: 550000,
  },
];

const ProjectDay11 = () => {
  const [cart, setCart] = useState<(IProduct & { quantity: number })[]>([]);
  const addTocart = (id: number) => {
    try {
      const item = products.find((item) => item.id == id);
      if (!item) return;
      const check = cart.findIndex((item) => item.id == id);
      if (check >= 0) {
        cart[check].quantity++;
        setCart([...cart]);
      } else {
        setCart([...cart, { ...item, quantity: 1 }]);
      }
    } catch (error) {}
  };
  const totalPrices = useMemo(() => {
    // Hàm tính toán giá trị
    return cart.reduce((s, i) => s + i.price * i.quantity, 0);
  }, [cart]);
  const deleteItemCart = (id: number) => {
    const newArr = cart.filter((item) => item.id !== id);
    setCart(newArr);
  };
  const handleChangeQuantity = (id: number) => {
    const check = cart.findIndex((item) => item.id == id);
    if (check >= 0) {
      cart[check].quantity += 1;
      setCart([...cart]);
    }
  };

  return (
    <>
      <div style={{ width: "90%", margin: "auto", padding: "20px" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-7">
          {products &&
            products.length > 0 &&
            products.map((item) => {
              return (
                <div key={item.id}>
                  <Product item={item} addTocart={addTocart} />
                </div>
              );
            })}
        </div>
        <div>
          <div className=" text-3xl text-emerald-400 m-5">Your Cart</div>
          <div>
            <div>
              <span>Total Price: </span>
              <span>{totalPrices}</span>
            </div>
            <div>
              <span>Total Items: </span>
              <span>{cart.length}</span>
            </div>
          </div>
          <div>
            <Cart
              item={cart}
              deleteItemCart={deleteItemCart}
              handleChangeQuantity={handleChangeQuantity}
            />
          </div>
        </div>
        {/* <button
          type="button"
          className="text-white mt-5 float-right cursor-pointer bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Go to cart
        </button> */}
      </div>
    </>
  );
};

export default ProjectDay11;
