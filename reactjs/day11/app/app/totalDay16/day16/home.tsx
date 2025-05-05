import { lazy, Suspense, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
// import Product from "./products/index";
import { Outlet, useNavigate } from "react-router";
import type { IProduct } from "./interface";
const Product = lazy(() => import("./products/index"));
const Home = () => {
  const [hasMore, setHasMore] = useState(true);
  const [visibleItems, setVisibleItems] = useState<IProduct[]>([]);
  const [product, setProduct] = useState<IProduct[]>([]);
  const nav = useNavigate();
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
      if (data && Array.isArray(data)) {
        setProduct(data);
        setVisibleItems(data.slice(0, 10)); // Hiển thị 10 sản phẩm đầu tiên
        setHasMore(data.length > 10); // Còn dữ liệu nếu tổng số sản phẩm > 10
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.log(error);
      setHasMore(false);
    }
  };

  const fetchMoreData = () => {
    console.log("load more");
    if (visibleItems.length >= product.length) {
      setHasMore(false); // Không còn dữ liệu để tải
      return;
    }
    const currentLength = visibleItems.length;
    const nextItems = product.slice(currentLength, currentLength + 5); // mỗi lần load thêm 5 item
    setVisibleItems((prev) => [...prev, ...nextItems]);
  };

  useEffect(() => {
    getListProduct();
  }, []);

  const redirectToDetailProduct = (id: number) => nav(`/day16/${id}`);
  return (
    <div>
      <div
        onClick={() => nav("cart")}
        className=" text-2xl underline text-blue-400 mt-3 p-3 cursor-pointer bg-white"
      >
        Go to Cart
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
                  onClick={() => redirectToDetailProduct(p.id)}
                >
                  <Suspense fallback={<div>Loading...</div>}>
                    <Product product={p} />
                  </Suspense>
                </div>
              );
            })}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Home;
