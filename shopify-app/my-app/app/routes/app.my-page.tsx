import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useAppBridge } from "@shopify/app-bridge-react";
import {
  Page,
  LegacyCard,
  ResourceList,
  Avatar,
  ResourceItem,
  Text,
  ButtonGroup,
  Button,
  LegacyStack,
} from "@shopify/polaris";
import FormOnSubmitProduct from "app/components/form/products/formProduct";
import ModalComponent from "app/components/modal/productModal";
import { v4 as uuidv4 } from "uuid";
import { authenticate } from "app/shopify.server";
import React, { useState } from "react";
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const response = await admin.graphql(`
  #graphql
  query {
  products(first: 10, after: "eyJsYXN0X2lkIjoyMDk5NTY0MiwibGFzdF92YWx1ZSI6IjIwOTk1NjQyIn0=") {
    edges {
      node {
        id
        title
        handle
      }
      cursor
    }
    pageInfo {
      hasNextPage
    }
  }
}`);
  const responseJson = await response.json();
  const { data } = responseJson;
  const {
    products: { edges },
  } = data;
  console.log("Data", data);
  return json({ edges });
};
export type Node = {
  id: string;
  title: string;
  handle: string;
};
type Edge = {
  node: Node;
  cursor: string;
};
export enum ActionType {
  ADD = "ADD",
  DELETE = "DELETE",
}
function DataTableExample() {
  const loaderData = useLoaderData<typeof loader>() as {
    edges: Edge[];
  };
  const shopify = useAppBridge();
  const [edges, setEdges] = useState<Edge[]>(loaderData.edges);
  const [openDelete, setOpenDelete] = useState(false);
  const [node, setNode] = useState<Node>({
    id: uuidv4(),
    title: "",
    handle: "",
  });
  const [openAddModal, setOpenAddModal] = useState(false);
  const handleOpenAdd = () => {
    shopify.modal.show(ActionType.ADD);
    setOpenAddModal(true);
    //     setIsOpen(true);
  };
  const handleCloseAdd = () => {
    shopify.modal.hide(ActionType.ADD);
    setOpenAddModal(false);
    //     setIsOpen(false);
  };
  const [selectedNode, setSelectedNode] = useState<Node>();
  const handleOpenDelete = () => {
    shopify.modal.show(ActionType.DELETE);
    setOpenDelete(true);
    //     setIsOpen(true);
  };
  const handleCloseDelete = () => {
    shopify.modal.hide(ActionType.DELETE);
    setOpenDelete(false);
    //     setIsOpen(false);
  };
  const handleAddProduct = () => {
    const newProduct: Node = {
      ...node,
      handle: node.title.split(" ").join("-").toLowerCase(),
    };
    setEdges([...edges, { node: newProduct, cursor: uuidv4() }]);
    setNode({
      id: uuidv4(),
      title: "",
      handle: "",
    });
    handleCloseAdd();
  };

  const handleDeleteProduct = () => {
    const cloneArr = JSON.parse(JSON.stringify(edges));
    const arrAfterFilter = cloneArr.filter(
      (n: Edge) => n.node.id !== selectedNode?.id,
    );
    setEdges(arrAfterFilter);
    setSelectedNode(undefined);
    handleCloseDelete();
  };
  const onclickToDeleteProduct = (node: Node) => {
    setSelectedNode(node);
    handleOpenDelete();
  };
  return (
    <Page title="Sales by product">
      <Button variant="primary" onClick={handleOpenAdd}>
        Add
      </Button>
      <LegacyCard>
        <ResourceList
          resourceName={{ singular: "customer", plural: "customers" }}
          items={edges.map((edge) => {
            const { node } = edge;
            return {
              ...node,
            };
          })}
          renderItem={(item) => {
            const { title, handle, id } = item;
            const media = <Avatar customer size="md" name={title} />;

            return (
              <div style={{ padding: "5px", margin: "5px" }}>
                <LegacyStack alignment="center" distribution="equalSpacing">
                  <LegacyStack.Item fill>
                    <ResourceItem
                      id={id}
                      url={""}
                      media={media}
                      accessibilityLabel={`View details for ${title}`}
                    >
                      <Text variant="bodyMd" fontWeight="bold" as="h3">
                        {title}
                      </Text>
                      <div>{handle}</div>
                    </ResourceItem>
                  </LegacyStack.Item>
                  <LegacyStack.Item>
                    <ButtonGroup>
                      <Button onClick={() => onclickToDeleteProduct(item)}>
                        Delete
                      </Button>
                    </ButtonGroup>
                  </LegacyStack.Item>
                </LegacyStack>
              </div>
            );
          }}
        />
      </LegacyCard>
      <div>
        <ModalComponent
          open={openDelete}
          id={ActionType.DELETE}
          // handleOpen={handleOpenDelete}
          handleClose={handleCloseDelete}
          title="Delete Product"
          handleFunction={handleDeleteProduct}
        >
          <div style={{ padding: "5px", margin: "5px" }}>
            Do you want delete this product having id={selectedNode?.id}
          </div>
        </ModalComponent>
      </div>
      <div>
        <ModalComponent
          id={ActionType.ADD}
          open={openAddModal}
          handleClose={handleCloseAdd}
          title="Add Product"
          // handleFunction={handleDeleteProduct}
        >
          <div style={{ padding: "5px", margin: "5px" }}>
            <FormOnSubmitProduct
              node={node}
              setNode={setNode}
              handleSubmit={handleAddProduct}
            />
          </div>
        </ModalComponent>
      </div>
    </Page>
  );
}
export default DataTableExample;
