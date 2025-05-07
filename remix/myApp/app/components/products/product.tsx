import {
  BlockStack,
  Button,
  ButtonGroup,
  Card,
  InlineStack,
  Text,
  TextField,
} from "@shopify/polaris";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import useCart from "~/hooks/useCart";
interface IProductProps {
  price: number;
  stock: number;
  description: string;
  name: string;
  id: number;
}
const Product = (data: IProductProps) => {
  const [value, setValue] = useState("1");
  const { addToCart } = useCart();
  const handleChange = useCallback(
    (newValue: string) => setValue(newValue),
    []
  );
  const onlickAddToCart = () => {
    addToCart({
      name: data.name,
      price: data.price,
      quantity: +value,
      totalPrice: data.price * +value,
      id: data.id,
    });
    setValue(`1`);
    toast.success("add success");
  };
  return (
    <Card roundedAbove="sm">
      <BlockStack gap="500">
        <BlockStack gap="200">
          <Text as="h1" variant="headingSm">
            {data.name}
          </Text>
          <Text as="p" variant="bodyMd">
            {data.description}
          </Text>
          <Text tone="success" as="p" variant="bodyMd" fontWeight="bold">
            ${data.price}
          </Text>
          <Text as="p" variant="bodyMd">
            {data.stock}
          </Text>
        </BlockStack>
        <InlineStack align="end">
          <div className=" flex items-end gap-5">
            <TextField
              min={1}
              label="Số lượng"
              type="number"
              value={value}
              autoComplete="off"
              onChange={handleChange}
            />
            <Button onClick={onlickAddToCart}>Add</Button>
          </div>
        </InlineStack>
      </BlockStack>
    </Card>
  );
};

export default Product;
