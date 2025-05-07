import { IndexTable, TextField } from "@shopify/polaris";
import { useState, useCallback } from "react";
import useCart from "~/hooks/useCart";

function QuantityCell({
  initialQuantity,
  id,
  name,
  price,
  openModal,
}: {
  initialQuantity: number;
  id: number;
  name: string;
  price: number;
  openModal: (id: number) => void;
}) {
  const { updateCart } = useCart();
  const [quantity, setQuantity] = useState(String(initialQuantity));

  const handleChange = useCallback((value: string) => {
    if (+value == 0) {
      openModal(id);
      return;
    }
    updateCart({
      id,
      name,
      price,
      quantity: Number(value),
      totalPrice: Number(value) * price,
    });
    setQuantity(value);
  }, []);

  return (
    <TextField
      type="number"
      value={quantity}
      label=""
      onChange={handleChange}
      autoComplete="off"
      labelHidden
      min={0}
    />
  );
}
export default QuantityCell;
