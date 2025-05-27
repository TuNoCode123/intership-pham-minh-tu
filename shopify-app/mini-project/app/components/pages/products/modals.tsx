import { Modal, TitleBar } from "@shopify/app-bridge-react";
import { useProduct } from "app/hooks/useProduct";
import {
  BlockStack,
  Box,
  Button,
  InlineStack,
  Page,
  Select,
  TextField,
} from "@shopify/polaris";
import { VARIANTS } from "app/constraints/variants";
import { useCallback, useEffect, useState } from "react";
interface IupdateProductProps {
  updatedVariant: {
    quantity: string;
    price: string;
  };
  handleChange: (v: string, v2: any) => void;
  err: {
    errQuantity: boolean;
    msgErrorQuantity: string;
    errPrice: boolean;
    msgErrorPrice: string;
  };
  loading: boolean;
  handleSubmitUpdate: () => void;
}

export default function ModalUpdateProduct({
  updatedVariant,
  handleChange,
  err,
  loading,
  handleSubmitUpdate,
}: IupdateProductProps) {
  const { modalOpen, closeModalUpdateProduct } = useProduct();

  return (
    <>
      <Modal id="my-modal" onHide={closeModalUpdateProduct} open={modalOpen}>
        <Page>
          <BlockStack gap={"400"}>
            <TextField
              label="Quantity"
              type="number"
              value={updatedVariant.quantity}
              onChange={(v) => handleChange(v, VARIANTS.QUANTITY)}
              error={err.errQuantity ? err.msgErrorQuantity : false}
              autoComplete="off"
            />

            <TextField
              label="Price"
              type="number"
              value={updatedVariant.price}
              onChange={(v) => handleChange(v, VARIANTS.PRICE)}
              error={err.errPrice ? err.msgErrorPrice : false}
              autoComplete="off"
            />
          </BlockStack>
          <div style={{ marginTop: "10px" }}>
            <Button
              variant="primary"
              onClick={handleSubmitUpdate}
              loading={loading}
            >
              Update
            </Button>
          </div>
        </Page>
        <TitleBar title="Update Product">
          <button onClick={closeModalUpdateProduct}>Close</button>
        </TitleBar>
      </Modal>
    </>
  );
}
