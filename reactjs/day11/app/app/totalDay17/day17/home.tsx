import { lazy, Suspense, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
// import Product from "./products/index";
import { Outlet, useNavigate } from "react-router";
import type { IProduct } from "./interface";
import useProduct from "../hooks/useProduct";
const Product = lazy(() => import("./products/index"));
import Modal from "react-modal";

import { ActionTypes } from "../contexts/productContext";
import FormProduct from "./components/form";
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
export enum actions {
  ADD = "ADD",
  UPDATE = "UPDATE",
}
const Home = () => {
  const { dispatch, state } = useProduct();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalIsOpenDelete, setIsOpenDelete] = useState(false);

  // const [selectedIndex,setSelectedProduct]=use
  function openModal() {
    setIsOpen(true);
  }
  function OpenModalDelete() {
    setIsOpenDelete(true);
  }
  function closeModal() {
    setIsOpen(false);
  }
  const [hasMore, setHasMore] = useState(true);
  const [typeAction, setTypeAction] = useState(actions.ADD);
  const setUpdate = () => {
    setTypeAction(actions.UPDATE);
  };
  const setAdd = () => {
    setTypeAction(actions.ADD);
  };
  const [visibleItems, setVisibleItems] = useState<IProduct[]>([]);
  // const [product, setProduct] = useState<IProduct[]>([]);
  const { product } = state;
  useEffect(() => {
    setVisibleItems(product.slice(0, 10));
  }, [product]);
  const nav = useNavigate();
  const getListProduct = async () => {
    try {
      // const url=https://fakestoreapi.com/products
      const url = "http://localhost:8000/api/v1/products";
      const body = {
        method: "GET", // hoặc 'POST', 'PUT', tùy API
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await fetch(url, body);
      if (!res.ok) throw new Error("error api");
      const data = await res.json();
      if (data) {
        const { DT } = data;
        // setProduct(DT);
        dispatch({ type: ActionTypes.ADD_MUNTIPLE_ITEM, payload: DT });
        setVisibleItems(DT.slice(0, 10)); // Hiển thị 10 sản phẩm đầu tiên
        setHasMore(DT.length > 10);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.log(error);
      setHasMore(false);
    }
  };

  const fetchMoreData = () => {
    if (visibleItems.length >= product.length) {
      setHasMore(false); // Không còn dữ liệu để tải
      return;
    }
    const currentLength = visibleItems.length;
    const nextItems = product.slice(currentLength, currentLength + 5); // mỗi lần load thêm 5 item
    setVisibleItems((prev) => [...prev, ...nextItems]);
  };
  const [selectedProduct, setSelectedProduct] = useState<IProduct>();
  useEffect(() => {
    getListProduct();
  }, []);

  const redirectToDetailProduct = (id: number) => nav(`/day17/${id}`);
  const handlerDeleteProduct = async () => {
    if (!selectedProduct || !selectedProduct.id) return;
    const url = `http://localhost:8000/api/v1/admin/products/${selectedProduct?.id}`;
    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWRtaW4xIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpZCI6MiwiaWF0IjoxNzQ2NDI0OTMxLCJleHAiOjE3NDY0NjA5MzF9.VJX8iYDcZnnRkWew3ViOGsmW8dqgtppr8_kIRGo5jiw`;
    const body = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(url, body);
    if (!response.ok) throw new Error("error api");
    const newProduct = await response.json();
    const { EC } = newProduct;
    if (EC == 0) {
      dispatch({ type: ActionTypes.REMOVE_ITEM, payload: selectedProduct.id });
      setIsOpenDelete(false);
    }
  };

  return (
    <div>
      <div className=" flex gap-3 items-center justify-center">
        <div
          onClick={() => nav("cart")}
          className=" text-2xl underline text-blue-400 mt-3 p-3 cursor-pointer bg-white"
        >
          Go to Cart
        </div>
        <button
          onClick={() => {
            setSelectedProduct({
              name: "",
              price: 0,
              description: "",
              category: "",
              image: undefined,
              stock: 0,
            });
            openModal();
            setAdd();
          }}
          type="button"
          className=" cursor-pointer  focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
        >
          Add Product
        </button>
      </div>
      <InfiniteScroll
        dataLength={visibleItems.length} // số lượng hiện tại
        next={fetchMoreData} // hàm load thêm
        hasMore={hasMore} // còn dữ liệu nữa không
        loader={<h4>Loading...</h4>} // đang loading
        endMessage={<p style={{ textAlign: "center" }}>Đã hết dữ liệu 😅</p>} // hết dữ liệu
        scrollableTarget="scrollableDiv" // Chỉ định container cuộn
      >
        <div
          className=" grid grid-cols-5 gap-8 mt-5 p-4"
          id="scrollableDiv"
          style={{ height: "80vh", overflow: "auto" }}
        >
          {visibleItems.length >= 0 &&
            visibleItems.map((p, index) => {
              return (
                <div
                  className="min-h-[500px]"
                  key={index}
                  // onClick={() => redirectToDetailProduct(p.id)}
                >
                  <Suspense fallback={<div>Loading...</div>}>
                    <Product
                      setUpdate={setUpdate}
                      isOpen={openModal}
                      OpenModalDelete={OpenModalDelete}
                      product={p}
                      setSelectedProduct={setSelectedProduct}
                    />
                  </Suspense>
                </div>
              );
            })}
        </div>
      </InfiniteScroll>
      <Modal
        ariaHideApp={false}
        isOpen={modalIsOpen}
        // onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <FormProduct
          typeAction={typeAction}
          product={selectedProduct}
          // setProduct={state.}
          closeModal={closeModal}
        />
      </Modal>

      <Modal
        ariaHideApp={false}
        isOpen={modalIsOpenDelete}
        // onAfterOpen={afterOpenModal}
        onRequestClose={() => setIsOpenDelete(false)}
        style={customStyles}
        contentLabel=" Modal delete sp"
      >
        <div>You want to delete product having id= {selectedProduct?.id}</div>
        <button
          type="button"
          onClick={handlerDeleteProduct}
          className="text-white mt-3 cursor-pointer bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          delete
        </button>
      </Modal>
    </div>
  );
};

export default Home;
