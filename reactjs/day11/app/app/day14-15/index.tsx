import { useEffect, useState } from "react";
import type { ICart, IProduct } from "./interface";
import Product from "./product";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import useCart from "./hooks/useCart";
import Modal from "react-modal";
import FormProduct from "./form_product";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
const MiniProjectDay14To15 = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }
  const navigate = useNavigate();
  // const [cart, setCart] = useState<ICart[]>([]);
  const { addToCart } = useCart();
  const onclickAddToCart = (product: IProduct, quantity: number) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: quantity,
    });
  };
  const nav = () => {
    navigate("cart");
  };
  const [product, setProduct] = useState<IProduct[]>([]);
  const getListProduct = async () => {
    try {
      const url = "https://fakestoreapi.com/products";
      const body = {
        method: "GET", // hoặc 'POST', 'PUT', tùy API
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await fetch(url, body);
      if (!res.ok) throw new Error("error api");
      const data = await res.json();

      if (data) setProduct(data);
    } catch (error) {}
  };
  useEffect(() => {
    getListProduct();
  }, []);
  return (
    <div className="p-5">
      <button
        onClick={openModal}
        type="button"
        className=" cursor-pointer focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
      >
        Open Modal Add New Product
      </button>
      <div className="flex justify-end text-4xl cursor-pointer">
        <span className=" underline">Go to your cart here</span>
        <FontAwesomeIcon
          onClick={nav}
          icon={faCartShopping}
          height={50}
          width={100}
        />
      </div>
      <div className=" grid grid-cols-5 gap-8 mt-5">
        {product.length >= 0 &&
          product.map((p, index) => {
            return (
              <div key={index}>
                <Product product={p} onclickAddToCart={onclickAddToCart} />
              </div>
            );
          })}
      </div>
      <div className="shadow-2xl">
        <Modal
          isOpen={modalIsOpen}
          // onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <FormProduct
            product={product}
            setProduct={setProduct}
            closeModal={closeModal}
          />
          <button
            onClick={closeModal}
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            close
          </button>
        </Modal>
      </div>
    </div>
  );
};

export default MiniProjectDay14To15;
