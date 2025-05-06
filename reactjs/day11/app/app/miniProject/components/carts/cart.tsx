import React, { useEffect, useState } from "react";
import { Table } from "antd";
import type {
  TableColumnsType,
  TableProps,
  PopconfirmProps,
  InputNumberProps,
} from "antd";
import { Button, message, Popconfirm, InputNumber, Modal } from "antd";

import useCart from "~/miniProject/hooks/useCart";

interface DataType {
  key: React.Key;
  name: string;
  price: number;
  quantity: number;
  total: number;
}
import { ExclamationCircleFilled } from "@ant-design/icons";

const Cart: React.FC = () => {
  const { cart, totalPrice, removeMuntipleItems, updateItem } = useCart();
  const { confirm: confirmModal } = Modal;
  const showConfirm = (key: React.Key) => {
    confirmModal({
      title: "Do you want to delete these items?",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      onOk() {
        removeMuntipleItems([Number(key)]);
        message.success("Delete success");
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const [listKey, setListKey] = useState<React.Key[]>([]);
  // rowSelection object indicates the need for row selection
  const rowSelection: TableProps<DataType>["rowSelection"] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      if (selectedRows.length > 0) {
        const currentListKeys = selectedRows.map((item) => item.key);
        setListKey((pre) => [...currentListKeys]);
      } else {
        setListKey([]);
      }
    },
    getCheckboxProps: (record: DataType) => ({
      disabled: record.name === "Disabled User", // Column configuration not to be checked
      name: record.name,
    }),
  };
  const [data, setData] = useState<DataType[]>([]);

  useEffect(() => {
    if (cart) {
      setData(
        cart.map((item) => ({
          key: item.id ?? 100,
          name: item.name ?? "",
          price: item.price,
          quantity: item.quantity,
          total: item.totalPrice,
        }))
      );
    }
  }, [cart]);
  const confirm: PopconfirmProps["onConfirm"] = (e) => {
    const newNumberArr = listKey.map((item) => Number(item));
    removeMuntipleItems(newNumberArr);
    message.success("Delete success");
    setListKey([]);
  };

  const cancel: PopconfirmProps["onCancel"] = (e) => {
    console.log(e);
    message.error("Click on No");
  };

  const handleQuantityChange = (key: React.Key, value: number | null) => {
    if (value == 0) {
      showConfirm(key);
      console.log("delete");
      return;
    }
    const cloneArr = JSON.parse(JSON.stringify(data)) as DataType[];
    const index = cloneArr.findIndex((item) => item.key === key);
    cloneArr[index].quantity = value ?? 1;
    cloneArr[index].total = cloneArr[index].quantity * cloneArr[index].price;
    setData([...cloneArr]);
    const newCart = cloneArr.map((item) => {
      return {
        id: Number(item.key),
        quantity: item.quantity,
        name: item.name,
        price: item.price,
        totalPrice: item.total,
      };
    });
    updateItem(newCart);
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text: string) => <a>{text}</a>,
      onCell: () => ({
        style: { fontSize: "20px" },
      }),
    },
    {
      title: "Price",
      dataIndex: "price",
      onCell: () => ({
        style: { fontSize: "20px" },
      }),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      render: (text: number, record) => (
        <InputNumber
          value={record.quantity}
          onChange={(value) => handleQuantityChange(record.key, value)}
        />
      ),
      onCell: () => ({
        style: { fontSize: "20px" },
      }),
    },
    {
      title: "Total",
      dataIndex: "total",
      onCell: () => ({
        style: { fontSize: "20px" },
      }),
    },
  ];

  return (
    <div>
      <Table<DataType>
        rowSelection={{ type: "checkbox", ...rowSelection }}
        columns={columns}
        dataSource={data}
      />
      <div className=" flex justify-around gap-5 mt-5">
        <div>
          {listKey.length > 0 && (
            <Popconfirm
              title="Delete the task"
              description="Are you sure to delete this task?"
              onConfirm={confirm}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <Button
                style={{
                  transform: "scale(2)",
                  transformOrigin: "center",
                }}
                danger
              >
                Delete Items
              </Button>
            </Popconfirm>
          )}
        </div>
        <div className=" text-3xl flex gap-10">
          Total Price:
          <span className=" text-blue-600 font-bold underline text-3xl">
            {totalPrice}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Cart;
