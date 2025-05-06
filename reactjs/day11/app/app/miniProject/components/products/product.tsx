import { Card } from "antd";
import type { InputNumberProps } from "antd";
import { InputNumber } from "antd";
import { Button, Divider } from "antd";
import { useState } from "react";
import useCart from "~/miniProject/hooks/useCart";
import useNotification from "~/miniProject/hooks/useNotifyCation";
const { Meta } = Card;
const Product = ({
  title,
  price,
  id,
}: {
  title?: string;
  price: number;
  id: number;
}) => {
  const { openNotificationWithIcon, contextHolder } = useNotification();

  const [value, setValue] = useState(1);
  const { addToCart } = useCart();
  const onChange: InputNumberProps["onChange"] = (value) => {
    if (value) setValue(+value);
  };
  //  const {}=useCar
  const clickToAddToCart = () => {
    addToCart({ name: title ?? "", price, id }, value);
    setValue(1);
    openNotificationWithIcon("success", "Add To Cart Successfully");
  };
  return (
    <>
      {contextHolder}
      <Card
        hoverable
        style={{ width: 400 }}
        cover={
          <img
            alt="example"
            src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
          />
        }
      >
        <Meta
          title={title}
          description={
            <span
              style={{ fontWeight: "bold", color: "#1890ff", fontSize: "20px" }}
            >
              Price: ${price}
            </span>
          }
        />
        <Divider />
        <div className=" flex gap-5 mt-3">
          <InputNumber
            min={1}
            // max={10}
            defaultValue={1}
            value={value}
            onChange={onChange}
            changeOnWheel
            size="large"
            style={{ width: "300px" }}
          />
          <Button type="primary" size={"large"} onClick={clickToAddToCart}>
            Add
          </Button>
        </div>
      </Card>
    </>
  );
};

export default Product;
