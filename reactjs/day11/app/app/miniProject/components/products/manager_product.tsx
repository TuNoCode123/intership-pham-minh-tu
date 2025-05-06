import React, { useEffect, useState } from "react";
import { Space, Table, Button, message, Popconfirm } from "antd";
import type { TableProps, PopconfirmProps } from "antd";
import useProduct from "~/miniProject/hooks/useProduct";
import DrawerProduct from "./drawer_add_product";

interface DataType {
  key: string;
  id: number;
  name: string;
  price: number;
  stock: number;
  description: string;
  category: string;
}

const ManagerProduct: React.FC = () => {
  const { context, removeproduct } = useProduct();
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => onclickUpdateProduct(record)}>Update</a>
          <a>
            <Popconfirm
              title="Delete the Product"
              description="Are you sure to delete this Product?"
              onConfirm={() => handleConfirm(record)}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <Button danger>Delete</Button>
            </Popconfirm>
          </a>
        </Space>
      ),
    },
  ];

  const handleConfirm = async (record: any) => {
    const res = await removeproduct(record.id);

    const { EC, EM } = res;
    if (EC == 0) message.success(EM);
    else message.error(EM);
    // message.success();
  };
  const cancel: PopconfirmProps["onCancel"] = (e) => {
    console.log(e);
    message.error("Click on No");
  };

  const {
    state,
    dispatch,
    setCurrent,
    current,
    total,
    limit,
    setType,
    setSelectedProduct,
  } = context;
  const { product } = state;

  const [openDrawer, setOpenDrawer] = useState(false);
  const [data, setData] = useState<DataType[]>([]);
  //   useEffect(()=>
  // {
  // dispatch({type:})
  // },[])
  useEffect(() => {
    const customData = product.map((item) => {
      return {
        key: String(item.id),
        id: item.id ?? 1000,
        name: item.name ?? "",
        price: item.price,
        stock: item.stock,
        description: item.description,
        category: item.category,
      };
    });
    setData(customData);
  }, [product]);
  const onclickAddProduct = () => {
    setType("add");
    setOpenDrawer(true);
  };
  const onclickUpdateProduct = (record: DataType) => {
    setSelectedProduct(record);
    setType("update");
    setOpenDrawer(true);
  };
  //   const data: DataType[] = [
  //     {
  //       key: "1",
  //       name: "John Brown",
  //       price: 32,
  //       stock: 100,
  //       description: "fdasfdsa",
  //       category: "fdlafdjka",
  //     },
  //   ];
  return (
    <>
      <div>
        <h2 className=" text-6xl font-bold text-center m-3">Manager Product</h2>
        <Button
          onClick={onclickAddProduct}
          type="primary"
          className=" mb-5 scale-125"
        >
          Add Product
        </Button>
      </div>
      <Table<DataType>
        columns={columns}
        dataSource={data}
        pagination={{
          current: current,
          pageSize: limit,
          total: total,
          onChange: (page, size) => {
            setCurrent(page);
          },
        }}
        rowKey="id" // rất quan trọng để tránh warning!
      />
      <DrawerProduct open={openDrawer} setOpen={setOpenDrawer} />
    </>
  );
};

export default ManagerProduct;
