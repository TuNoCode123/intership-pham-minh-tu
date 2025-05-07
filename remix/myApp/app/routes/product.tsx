import { Link, useFetcher, useSearchParams } from "@remix-run/react";
import {
  Page,
  LegacyCard,
  DataTable,
  Button,
  Frame,
  Modal,
  TextContainer,
} from "@shopify/polaris";
import React, { useEffect, useMemo, useState } from "react";
import useProduct from "~/hooks/useProduct";
import { IProduct } from "~/interfaces/product";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic-light-dark.css";
import ModalProduct from "~/components/products/modals/modal_product";
import FormProduct from "~/components/products/form/form_add_product";
import { set } from "lodash";
import { ActionTypes } from "~/constants/enum";
import { toast } from "react-toastify";
function Product() {
  const fetcher = useFetcher();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [choseId, setChoseId] = useState(0);
  const [first, setFirst] = useState(false);
  const triggerLoader = () => {
    fetcher.load(`/home?page=${page}&limit=${limit}`);
  };

  useEffect(() => {
    const pageUrl = searchParams.get("page");
    if (pageUrl) {
      setPage(Number(pageUrl));
    } else {
      setSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
    }
    setFirst(true);
  }, []);
  useEffect(() => {
    if (first) {
      setSearchParams({
        page: page.toString() || "1",
        limit: limit.toString(),
      });
      triggerLoader();
    }
  }, [page, setPage, first]);

  // Debug trạng thái và dữ liệu
  useEffect(() => {
    if (fetcher.data) {
      const { products, TotalProduct } = fetcher.data as any;
      loadingDataToContext(products);
      setTotal(TotalProduct);
    }
  }, [fetcher.state, fetcher.data]);

  const [productRows, setProductRows] = useState<
    (string | number | React.ReactNode)[][]
  >([]);

  const {
    products,
    loadingDataToContext,
    setSelectedProduct,
    setType,
    type,
    removeproduct,
  } = useProduct();
  const hanlderDelete = (id: any) => {
    setChoseId(id);
    setOpenModalDelete(true);
  };
  const hanlderUpdateProduct = (product: IProduct) => {
    setSelectedProduct(product);
    setOpenModalAdd(true);
    setType(ActionTypes.UPDATE_ITEM);
  };
  const totalPages = useMemo(
    () => (total % +limit == 0 ? total / +limit : Math.ceil(total / +limit)),
    [total, limit]
  );

  useEffect(() => {
    let arr: (string | number | React.ReactNode)[][] = [];
    products?.map((p) => {
      let row = [
        p.name,
        p.price,
        p.category,
        p.stock,
        <div className=" flex gap-3 justify-end">
          <div
            className=" underline text-red-600 cursor-pointer"
            onClick={() => hanlderDelete(p.id)}
          >
            Delete
          </div>
          <div
            className=" underline text-blue-600 cursor-pointer"
            onClick={() => hanlderUpdateProduct(p)}
          >
            Update
          </div>
        </div>,
      ];
      arr.push(row);
    });
    setProductRows(arr);
  }, [products]);
  const onlickAddProduct = () => {
    setType(ActionTypes.ADD_ITEM);
    setSelectedProduct(null);
    setOpenModalAdd(true);
  };
  const hanlderDeleteProduct = async () => {
    const res = await removeproduct(choseId);
    const { EC, EM } = res;
    if (EC == 0) {
      setOpenModalDelete(false);
      toast.success(EM);
    } else {
      setOpenModalDelete(false);
      toast.error(EM);
    }
  };
  return (
    <div>
      <div className=" text-6xl text-center font-bold m-5">Manager Product</div>
      <div>
        <div className=" flex justify-center gap-5">
          <Link to="/cart">
            <button className=" bg-blue-500 text-white px-4 py-2 rounded-md">
              Cart
            </button>
          </Link>
          <Link to="/home">
            <button className=" bg-green-500 text-white px-4 py-2 rounded-md">
              Home
            </button>
          </Link>
          <button
            onClick={onlickAddProduct}
            className=" bg-yellow-500 text-white px-4 py-2 rounded-md"
          >
            Add Product
          </button>
        </div>
      </div>
      <div>
        <Page title="Sales by product">
          <LegacyCard>
            <DataTable
              columnContentTypes={[
                "text",
                "numeric",
                "numeric",
                "numeric",
                "numeric",
              ]}
              headings={["Product", "Price", "Category", "Stock", "Actions"]}
              rows={productRows}
              //   totals={["", "", "", 255, "$155,830.00"]}
            />
          </LegacyCard>
          <div className=" mt-5">
            <ResponsivePagination
              current={page}
              total={totalPages}
              onPageChange={setPage}
            />
          </div>
        </Page>
      </div>
      <ModalProduct
        title={type == ActionTypes.ADD_ITEM ? "Add Product" : "Update Product"}
        active={openModalAdd}
        setActive={setOpenModalAdd}
      >
        <FormProduct setActive={setOpenModalAdd} />
      </ModalProduct>

      <ModalProduct
        title={"Delete Product"}
        active={openModalDelete}
        setActive={setOpenModalDelete}
      >
        <div className=" text-4xl font-bold ">
          You want to delete this Product
        </div>
        <div className=" flex justify-end gap-5 mt-5">
          <button
            className=" bg-red-500 text-white px-4 py-2 rounded-md"
            onClick={() => setOpenModalDelete(false)}
          >
            Close
          </button>
          <button
            onClick={hanlderDeleteProduct}
            className=" bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Delete
          </button>
        </div>
      </ModalProduct>
    </div>
  );
}
export default Product;
