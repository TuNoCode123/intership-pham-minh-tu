import { MetaFunction } from "@remix-run/node";
import { json, Link } from "@remix-run/react";
import {
  IndexTable,
  TextField,
  LegacyCard,
  useIndexResourceState,
  Text,
  useBreakpoints,
  Button,
  Frame,
  Modal,
  TextContainer,
} from "@shopify/polaris";
import React, { useCallback, useState } from "react";
import { toast } from "react-toastify";
import QuantityCell from "~/components/products/QuantityCell";
import { ActionTypes } from "~/constants/enum";
import useCart from "~/hooks/useCart";

export const meta: MetaFunction = () => {
  return [
    { title: "Cart" },
    { name: "description", content: "Welcome to Cart!" },
  ];
};
export const loader = async () => {
  const data = {
    message: "Dữ liệu từ loader của index",
    timestamp: new Date().toISOString(),
  };
  return json(data);
};
function Cart() {
  const { cart, totalPrice, removeItem, removeMuntipleItems } = useCart();
  const [active, setActive] = useState(false);
  const [deleteId, setDeleteId] = useState(1000000);
  const [typeRemove, setTypeRemove] = useState<
    ActionTypes.DELETE_MUNTIPLE_ITEM | ActionTypes.REMOVE_ITEM
  >(ActionTypes.REMOVE_ITEM);
  const openModal = (id: number) => {
    setDeleteId(id);
    setActive(true);
  };
  const handleChange = useCallback(() => {
    if (typeRemove == ActionTypes.DELETE_MUNTIPLE_ITEM) {
      removeMuntipleItems(selectedResources.map((item) => Number(item)));
      setActive(!active);
      setTypeRemove(ActionTypes.REMOVE_ITEM);
      return;
    }
    if (deleteId) {
      removeItem(deleteId);
      setActive(!active);
    }
    toast.success("Delete Product Successfully from Your Cart");
  }, [active]);

  const resourceName = {
    singular: "customer",
    plural: "customers",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(
      cart.map((item) => {
        return {
          ...item,
          id: item.id.toString(),
        };
      })
    );

  const rowMarkup = cart.map(
    ({ id, name, price, totalPrice, quantity }, index) => {
      return (
        <>
          <IndexTable.Row
            id={String(id)}
            key={id}
            selected={selectedResources.includes(id.toString())}
            position={index}
          >
            <IndexTable.Cell>{name}</IndexTable.Cell>
            <IndexTable.Cell>$ {price}</IndexTable.Cell>
            <IndexTable.Cell>
              <div style={{ width: "80px" }}>
                <QuantityCell
                  openModal={openModal}
                  initialQuantity={quantity}
                  id={id}
                  name={name}
                  price={price}
                />
              </div>
            </IndexTable.Cell>
            <IndexTable.Cell>$ {totalPrice}</IndexTable.Cell>
          </IndexTable.Row>
        </>
      );
    }
  );
  const deleteMuntipleItems = () => {
    setTypeRemove(ActionTypes.DELETE_MUNTIPLE_ITEM);
    setActive(true);
  };
  return (
    <div className=" p-9">
      <div>
        <div>
          <Link to={"/home"}>
            <Button variant="primary" tone="critical">
              Home
            </Button>
          </Link>
        </div>
      </div>

      <div className=" mt-5">
        <LegacyCard>
          <IndexTable
            condensed={useBreakpoints().smDown}
            resourceName={resourceName}
            itemCount={cart.length}
            selectedItemsCount={
              allResourcesSelected ? "All" : selectedResources.length
            }
            onSelectionChange={handleSelectionChange}
            headings={[
              { title: "Name" },
              { title: "Price" },
              { title: "Quantity" },
              { title: "Total Price" },
            ]}
          >
            {rowMarkup}
          </IndexTable>
        </LegacyCard>
      </div>

      <div className=" mt-10 flex justify-around items-center">
        {selectedResources.length > 0 && (
          <div onClick={deleteMuntipleItems}>
            <Button size="large" variant="primary">
              Delete
            </Button>
          </div>
        )}

        <div className="text-6xl font-bold flex gap-5 items-center">
          TotalPrice:
          <span className=" text-3xl font-bold underline text-blue-700">
            $ {totalPrice}
          </span>
        </div>
      </div>
      <div style={{ height: "500px" }}>
        <Frame>
          <Modal
            open={active}
            onClose={handleChange}
            title="Delete Product From Cart"
            primaryAction={{
              content: "Submit",
              onAction: handleChange,
            }}
            secondaryActions={[
              {
                content: "Close",
                onAction: () => setActive(false),
              },
            ]}
          >
            <Modal.Section>
              <TextContainer>
                <p>Do you want delete this Product from your Cart</p>
              </TextContainer>
            </Modal.Section>
          </Modal>
        </Frame>
      </div>
    </div>
  );
}
export default Cart;
