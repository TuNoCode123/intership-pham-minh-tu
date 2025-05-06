import React, { useEffect, useState } from "react";
import { Col, Row, Pagination, Spin } from "antd";
import Product from "./components/products/product";
import useProduct from "./hooks/useProduct";
import { ActionTypes } from "./contexts/productContext";
import type { PaginationProps } from "antd";
const AppMain = () => {
  const { context } = useProduct();
  const { state, setCurrent, total, loading, current, limit } = context;
  // const [current, setCurrent] = useState(1);
  // const [limit, setLimit] = useState(4);
  // const [total, setTotal] = useState(0);
  // const [loading, setIsLoading] = useState(false);
  const { product } = state;
  const onChange: PaginationProps["onChange"] = (page) => {
    console.log(page);
    setCurrent(page);
  };
  // const getListProduct = async (limit: number, page: number) => {
  //   try {
  //     setIsLoading(true);
  //     // const url=https://fakestoreapi.com/products
  //     const url = `http://localhost:8000/api/v1/products?limit=${limit}&page=${page}`;
  //     const body = {
  //       method: "GET", // hoặc 'POST', 'PUT', tùy API
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     };
  //     const res = await fetch(url, body);
  //     if (!res.ok) throw new Error("error api");
  //     const data = await res.json();
  //     if (data) {
  //       const { DT } = data;
  //       const { total, data: listProduct } = DT;
  //       setTotal(total);
  //       dispatch({ type: ActionTypes.LOADING_ITEM, payload: listProduct });
  //       setIsLoading(false);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // useEffect(() => {
  //   getListProduct(limit, current);
  // }, [limit, current]);

  return (
    <>
      {loading ? (
        <>
          <div className=" flex justify-center items-center h-screen">
            <Spin
              size="large"
              style={{ transform: "scale(3)", transformOrigin: "center" }}
            />
          </div>
        </>
      ) : (
        <div className="p-8">
          <div className=" mx-auto">
            <Row>
              {product?.map((item, index) => {
                return (
                  <>
                    <Col span={6} key={index}>
                      <Product
                        title={item.name}
                        price={item.price}
                        id={item.id ?? 100}
                      />
                    </Col>
                  </>
                );
              })}
            </Row>
          </div>
          <div
            className=" mt-40 flex justify-center"
            style={{ transform: "scale(2)" }}
          >
            <Pagination
              current={current}
              onChange={onChange}
              total={total}
              pageSize={limit}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AppMain;
