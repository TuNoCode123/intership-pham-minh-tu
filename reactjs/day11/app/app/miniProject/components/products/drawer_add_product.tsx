import React, { useState } from "react";
import type { DrawerProps, RadioChangeEvent } from "antd";
import { Button, Drawer, Radio, Space } from "antd";
import FormProduct from "./form_add_product";
import useProduct from "~/miniProject/hooks/useProduct";
interface IDrawerproduct {
  open: boolean;
  setOpen: (v: boolean) => void;
}
const DrawerProduct: React.FC<IDrawerproduct> = ({ open, setOpen }) => {
  const [placement, setPlacement] =
    useState<DrawerProps["placement"]>("bottom");
  const { context } = useProduct();
  const { type } = context;
  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Drawer
        title={type === "add" ? "Add Product" : "Update Product"}
        placement={placement}
        closable={false}
        onClose={onClose}
        open={open}
        key={placement}
        height={800}
      >
        <FormProduct onCloseDrawer={onClose} />
      </Drawer>
    </>
  );
};

export default DrawerProduct;
