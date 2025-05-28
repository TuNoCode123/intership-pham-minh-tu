import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useFetcher,
  useLoaderData,
  useNavigation,
  useRouteError,
} from "@remix-run/react";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import {
  Page,
  Layout,
  LegacyCard,
  InlineError,
  InlineStack,
  Box,
  Button,
  Text,
  Card,
} from "@shopify/polaris";

import { VARIANTS } from "app/constraints/variants";
import { findBestMatchedVariant } from "app/helpers/findProductMatchest";
import { useProduct } from "app/hooks/useProduct";
import { authenticate } from "app/shopify.server";

import {
  IchangeQuantity,
  InodeMediaVariant,
  IproductDetail,
  IuserErrors,
} from "interfaces/product";
import { useCallback, useEffect, useState } from "react";
import invariant from "tiny-invariant";
import ModalUpdateProduct from "app/components/pages/products/modals";
import _ from "lodash";
import InforProduct from "app/components/pages/products/inforProduct";
import ImagesProduct from "app/components/pages/products/imageProduct";
import SkeletonPageComponent from "app/components/pages/products/skeletons/skeletonPage";
import {
  isInventoryItemGID,
  isLocationGID,
  isNumber,
  isProductVariantGID,
} from "app/helpers/validate";
import NotFoundModal from "app/components/pages/products/modalNotFound";

interface IoutputLoader {
  product: IproductDetail;
  shop: {
    currencyCode: string;
  };
  productId: string;
}
interface IouputActionUpdateProduct {
  id: string;
  price: string;
  inventoryQuantity: string;
}
// import { NavigationMenu } from "@shopify/app-bridge-react";
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const {
    admin: { graphql },
    session,
  } = await authenticate.admin(request);
  invariant(session.shop, "Shop not found");
  const id = params.id; // nếu route là /product/:id
  invariant(id, "Missing ProductId");
  const decodeId = atob(id);

  const variables = {
    ownerId: decodeId,
  };
  const response = await graphql(
    `
      #graphql
      query ProductMetafield($ownerId: ID!) {
        shop {
          currencyCode
        }
        product(id: $ownerId) {
          title
          category {
            id
            fullName
          }
          descriptionHtml
          hasOnlyDefaultVariant
          totalInventory
          vendor
          media(first: 10) {
            edges {
              node {
                id
                mediaContentType
                alt
                ... on MediaImage {
                  image {
                    url
                  }
                }
              }
            }
          }
          variants(first: 50) {
            edges {
              node {
                selectedOptions {
                  name
                  value
                }
                inventoryItem {
                  id
                  inventoryLevels(first: 10) {
                    edges {
                      node {
                        quantities(names: ["available"]) {
                          name
                          quantity
                        }
                        location {
                          id
                          name
                        }
                      }
                    }
                  }
                }
                id
                inventoryQuantity
                price
                compareAtPrice
                media(first: 10) {
                  edges {
                    node {
                      id
                      alt
                      mediaContentType
                      __typename
                      ... on MediaImage {
                        id
                        image {
                          url(
                            transform: {
                              maxWidth: 300
                              maxHeight: 300
                              preferredContentType: WEBP
                            }
                          )
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
    {
      variables,
    },
  );
  invariant(response.ok, "query error");
  const responseJson = await response.json();
  const {
    data: { product, shop },
  } = responseJson;
  return json<IoutputLoader>({ product, shop, productId: decodeId });
};

const updatePriceVariant = async (variables: any, graphql: any) => {
  try {
    const response = await graphql(
      `
        #graphql
        mutation productVariantsBulkUpdate(
          $productId: ID!
          $variants: [ProductVariantsBulkInput!]!
        ) {
          productVariantsBulkUpdate(
            productId: $productId
            variants: $variants
          ) {
            product {
              id
            }
            productVariants {
              id
              price
              inventoryQuantity
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      { variables },
    );
    const responseJson = await response.json();

    const {
      data: {
        productVariantsBulkUpdate: { productVariants, userErrors },
      },
    } = responseJson;
    if (userErrors.length > 0) {
      throw json(
        {
          EM: userErrors,
          LC: VARIANTS.ERROR_LOCALE_UPDATE_PRICE,
          ST: 400,
        },
        { status: 400 },
      );
    }
    return {
      EC: 0,
      DT: productVariants as IouputActionUpdateProduct[],
    };
  } catch (error: any) {
    if (error instanceof Response) {
      const responseJson = await error.json();
      const { ST } = responseJson;
      throw json(
        {
          ...responseJson,
        },
        { status: ST },
      );
    }
    console.log("Error at updatePriceVariant", error);
    throw json(
      {
        EM: [
          {
            field: ["server"],
            message:
              error.message ??
              "Lỗi kết nối đến server GraphQL" +
                `At ${VARIANTS.ERROR_LOCALE_UPDATE_PRICE}`,
          },
        ],
        LC: VARIANTS.ERROR_LOCALE_UPDATE_PRICE,
      },
      { status: 500 },
    );
  }
};
const updateQuantityVariant = async (variables: any, graphql: any) => {
  try {
    const response = await graphql(
      `
        mutation InventorySet($input: InventorySetQuantitiesInput!) {
          inventorySetQuantities(input: $input) {
            inventoryAdjustmentGroup {
              createdAt
              reason
              changes {
                name
                delta
              }
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      { variables },
    );

    const responseJson = await response.json();

    const {
      data: {
        inventorySetQuantities: { inventoryAdjustmentGroup, userErrors },
      },
    } = responseJson;

    if (userErrors.length > 0) {
      console.error("userErrors3333333333", userErrors);
      throw json(
        {
          EM: userErrors,
          LC: VARIANTS.ERROR_LOCALE_UPDATE_QUANTITY,
          ST: 400,
        },
        { status: 400 },
      );
    }
    const { changes } = inventoryAdjustmentGroup;

    return {
      EC: 0,
      DT: changes as IchangeQuantity[],
    };
  } catch (error: any) {
    if (error instanceof Response) {
      console.error("Error at updateQuantityVariant1", error);
      const responseJson = await error.json();
      const { ST } = responseJson;
      throw json(
        {
          ...responseJson,
        },
        { status: ST },
      );
    }

    throw json(
      {
        EM: [
          {
            field: ["server"],
            message:
              error.message ??
              "Lỗi kết nối đến server GraphQL" +
                `At ${VARIANTS.ERROR_LOCALE_UPDATE_QUANTITY}`,
          },
        ],
        LC: VARIANTS.ERROR_LOCALE_UPDATE_QUANTITY,
        ST: 500,
      },
      { status: 500 },
    );
  }
};
export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const {
      admin: { graphql },
      session,
    } = await authenticate.admin(request);
    invariant(session.shop, "Shop not found");
    const formData = await request.formData();
    const productId = formData.get(VARIANTS.PRODUCT_ID);
    // const productId = "fkljdahsfkjhdsaj";
    const productVariantId = formData.get(VARIANTS.PRODUCT_VARIANT_ID);
    const quantity = formData.get(VARIANTS.QUANTITY);
    const quantityUpdate = formData.get(VARIANTS.UPDATE_QUANTITY);
    const price = formData.get(VARIANTS.PRICE);
    const locationId = formData.get(VARIANTS.LOCATION_ID);
    // const locationId = "gid://shopify/Locati/8233667";
    const inventoryItemId = formData.get(VARIANTS.INVENTORY_ITEM_ID);
    // const inventoryItemId = `gid://shopify/InventoryItem/48655853`;
    const isUpdatePrice = formData.get(VARIANTS.IS_UPDATE_PRICE);
    const isUpdateQuantity = formData.get(VARIANTS.IS_UPDATE_QUANTITY);
    const errors: { field: string[]; message: string }[] = [];

    // if (!productVariantId || !isProductVariantGID(productVariantId)) {
    //   errors.push({
    //     field: [VARIANTS.PRODUCT_VARIANT_ID],
    //     message: "ProductVariant ID không đúng định dạng.",
    //   });
    // }

    if (isUpdateQuantity) {
      if (!inventoryItemId || !isInventoryItemGID(inventoryItemId)) {
        errors.push({
          field: [VARIANTS.INVENTORY_ITEM_ID],
          message: "InventoryItem ID không đúng định dạng.",
        });
      }
      if (!locationId || !isLocationGID(locationId)) {
        errors.push({
          field: [VARIANTS.LOCATION_ID],
          message: "Location ID không đúng định dạng.",
        });
      }

      if (!quantity || !isNumber(quantity)) {
        errors.push({
          field: [VARIANTS.QUANTITY],
          message: "Số lượng không hợp lệ.",
        });
      }

      if (quantityUpdate && !isNumber(quantityUpdate)) {
        errors.push({
          field: [VARIANTS.UPDATE_QUANTITY],
          message: "Số lượng cập nhật không hợp lệ.",
        });
      }
    }
    if (isUpdatePrice)
      if (price && !isNumber(price)) {
        errors.push({
          field: [VARIANTS.PRICE],
          message: "Giá không hợp lệ.",
        });
      }

    if (errors.length > 0) {
      throw json(
        {
          EM: errors,
          LC: VARIANTS.ERROR_LOCALE_VALIDATE,
          ST: 400,
        },
        { status: 400 },
      );
    }
    const variables = {
      productId: productId,
      variants: [
        {
          id: productVariantId,
          price: price,
        },
      ],
    };
    const variableUpdateQuantity = {
      input: {
        name: "available",
        reason: "correction",
        quantities: [
          {
            inventoryItemId,
            locationId,
            quantity: quantityUpdate ? +quantityUpdate : 0,
            compareQuantity: quantity ? +quantity : 0,
          },
        ],
      },
    };
    const listActionUpdate = [] as any;
    if (isUpdatePrice) {
      listActionUpdate.push(updatePriceVariant(variables, graphql));
    }
    if (isUpdateQuantity) {
      listActionUpdate.push(
        updateQuantityVariant(variableUpdateQuantity, graphql),
      );
    }
    const results = await Promise.allSettled(listActionUpdate);

    if (isUpdatePrice && isUpdateQuantity) {
      const isFulfilled = results.every(
        (result) => result.status === "fulfilled",
      );
      if (!isFulfilled) {
        const errorList = results.filter((item) => item.status === "rejected");
        let LC = "";
        let EM: IuserErrors[] = [];

        const userErrors = errorList.map(async (err) => {
          const error = err.reason;
          if (error instanceof Response) {
            const errorBody = await error.json();
            const { LC: locale, EM: message } = errorBody;
            LC += locale;
            EM = [...EM, ...message];
          }
        });
        await Promise.all(userErrors);
        console.log("lc", LC);
        console.log("em", EM);

        return json({
          type: [VARIANTS.ERROR],
          userErrors: {
            LC,
            EM,
          },
        });
      }

      const [priceRes, quantityRes] = results;
      if (priceRes.value.EC == 0 && quantityRes.value.EC == 0)
        return json<{
          productVariants: IouputActionUpdateProduct[];
          quantityChanges: IchangeQuantity[];
          type: string[];
        }>({
          productVariants: priceRes.value.DT!,
          quantityChanges: quantityRes.value.DT!,
          type: [isUpdatePrice.toString(), isUpdateQuantity.toString()],
        });
    }
    const [response] = results;
    if (response.status === "rejected") {
      const error = response.reason;
      if (error instanceof Response) {
        const errorBody = await error.json();
        const { LC, EM } = errorBody;

        return json({
          type: [VARIANTS.ERROR],
          userErrors: {
            LC,
            EM,
          },
        });
      }
    }
    if (response.status === "fulfilled") {
      let temp = {};
      let typeUpdate = "";
      if (isUpdateQuantity) {
        const { DT } = response.value;
        temp = {
          quantityChanges: DT as IchangeQuantity[],
        };
        typeUpdate = VARIANTS.IS_UPDATE_QUANTITY;
      }
      if (isUpdatePrice) {
        const { DT } = response.value;
        temp = {
          productVariants: DT as IouputActionUpdateProduct[],
        };
        typeUpdate = VARIANTS.IS_UPDATE_PRICE;
      }

      return json({
        type: [typeUpdate],
        ...temp,
      });
    }

    //  else if (isUpdatePrice) {
    //   const [priceRes] = results;
    //   if (priceRes.EC == 0)
    //     return json<{
    //       productVariants: IouputActionUpdateProduct[];
    //       type: string[];
    //     }>({ productVariants: priceRes.DT!, type: [isUpdatePrice.toString()] });
    // } else if (isUpdateQuantity) {
    //   const [quantityRes] = results;
    //   if (quantityRes.EC == 0)
    //     return json<{
    //       quantityChanges: IchangeQuantity[];
    //       type: string[];
    //     }>({
    //       type: [isUpdateQuantity.toString()],
    //       quantityChanges: quantityRes.DT!,
    //     });
    // }

    return null;
  } catch (error: any) {
    console.error("Error at Action", error);
    if (error instanceof Response) {
      const responseJson = await error.json();
      return json({
        type: [VARIANTS.ERROR],
        userErrors: responseJson,
      });
    }

    throw json(
      {
        EM: [
          {
            field: ["server"],
            message:
              error.message ?? "Lỗi kết nối đến server GraphQL" + `At Action`,
          },
        ],
        LC: "Action",
        ST: 500,
      },
      { status: 500 },
    );
  }
};

export default function CardDefault() {
  const { product, shop, productId } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const shopify = useAppBridge();
  const [updatedVariant, setUpdateVariant] = useState({
    quantity: "0",
    price: "0",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState({
    errQuantity: false,
    msgErrorQuantity: "",
    errPrice: false,
    msgErrorPrice: "",
  });

  const {
    variants: { edges },
  } = product;
  const selectVariantOption: Record<string, string[]> = {};
  edges.map((e) => {
    const {
      node: { selectedOptions: options },
    } = e;

    options.map((s) => {
      if (!selectVariantOption[s.name]) {
        selectVariantOption[s.name] = [s.value];
      } else {
        const isValid = selectVariantOption[s.name].some((v) => v == s.value);
        if (isValid) return;
        selectVariantOption[s.name] = [...selectVariantOption[s.name], s.value];
      }
    });
  });
  const {
    setPickedVarant,
    pickedVariant,
    openModalUpdateProduct,
    closeModalUpdateProduct,
    modalOpen,
    handleSetOption,
    selected,
    isClickChangeVariant,
    setListVariants,
    listVariants,
    setNotFoundVariant,
    notFoundVariant,
    preListVariants,
    handleClickConvertPrevious,
  } = useProduct();

  useEffect(() => {
    const tmp: Record<string, any> = {};
    if (edges.length > 0 && _.isEmpty(listVariants)) {
      const selectedInit = edges[0]?.node?.selectedOptions;
      if (selectedInit) {
        selectedInit.map((s) => {
          tmp[s.name] = s.value;
        });
        setListVariants(tmp);
      }
    }
    const listVariant = _.isEmpty(listVariants) ? tmp : listVariants;
    const chooseVariant = findBestMatchedVariant(listVariant, edges);
    if (!chooseVariant) {
      setNotFoundVariant(true);
      return;
    }

    const combineWithCurrentcy: InodeMediaVariant = {
      currencyCode: shop.currencyCode,
      ...chooseVariant,
    };
    const listLocations =
      chooseVariant.node.inventoryItem?.inventoryLevels?.edges;
    const locationOptions = listLocations.map((l) => {
      return {
        label: l.node.location.name,
        value: l.node.location.id,
      };
    });
    setNotFoundVariant(false);
    handleSetOption(locationOptions);
    setPickedVarant(combineWithCurrentcy);
  }, [isClickChangeVariant]);
  const handleChange = useCallback(
    (newValue: string, type: VARIANTS.PRICE | VARIANTS.QUANTITY) => {
      if (!pickedVariant) throw new Error("No variant selected");
      if (type === VARIANTS.PRICE) {
        if (+newValue < 0) {
          setErr({
            ...err,
            errPrice: true,
            msgErrorPrice: "Price is not valid , Price must greater than 0",
          });
          return;
        }
        // if (+newValue > +pickedVariant.node.compareAtPrice) {
        //   setErr({
        //     ...err,
        //     errPrice: true,
        //     msgErrorPrice: "Giá đã cao hơn giá gốc",
        //   });
        //   return;
        // }
        setUpdateVariant({
          ...updatedVariant,
          price: newValue,
        });
        setErr({
          ...err,
          errPrice: false,
          msgErrorPrice: "",
        });
        return;
      }
      if (type === VARIANTS.QUANTITY) {
        if (+newValue < 0) {
          setErr({
            ...err,
            errQuantity: true,
            msgErrorQuantity:
              "Quantity is not Valid , Quantity must greater than 0",
          });
          return;
        }
        setUpdateVariant({
          ...updatedVariant,
          quantity: newValue,
        });
        setErr({
          ...err,
          errQuantity: false,
          msgErrorQuantity: "",
        });
        return;
      }
    },
    [updatedVariant, err, pickedVariant],
  );

  useEffect(() => {
    if (pickedVariant) {
      setUpdateVariant({
        quantity: pickedVariant?.node?.currentInventoryQuantity?.toString(),
        price: pickedVariant.node.price,
      });
    }
  }, [pickedVariant]);
  const handleSubmitUpdate = useCallback(() => {
    const isChangePrice = updatedVariant.price == pickedVariant?.node.price;
    const isChangeQuantity =
      updatedVariant.quantity == pickedVariant?.node.inventoryQuantity;
    if (isChangePrice && isChangeQuantity) {
      shopify.toast.show("You have to enter other quantity or price", {
        duration: 3000,
        isError: true,
      });
      return;
    }
    const formData = new FormData();
    if (!isChangePrice) {
      formData.set(VARIANTS.IS_UPDATE_PRICE, VARIANTS.IS_UPDATE_PRICE);
      formData.set(VARIANTS.PRODUCT_ID, productId);
      if (pickedVariant)
        formData.set(VARIANTS.PRODUCT_VARIANT_ID, pickedVariant?.node.id);
      formData.set(VARIANTS.QUANTITY, updatedVariant.quantity);
      formData.set(VARIANTS.PRICE, updatedVariant.price);
    }
    if (!isChangeQuantity) {
      const inventoryItemId = pickedVariant?.node?.inventoryItem?.id;
      const locationId = selected;
      formData.set(VARIANTS.IS_UPDATE_QUANTITY, VARIANTS.IS_UPDATE_QUANTITY);
      formData.set(VARIANTS.INVENTORY_ITEM_ID, inventoryItemId ?? "");
      formData.set(VARIANTS.LOCATION_ID, locationId ?? "");
      formData.set(
        VARIANTS.QUANTITY,
        pickedVariant?.node?.currentInventoryQuantity?.toString() ?? "",
      );
      formData.set(VARIANTS.UPDATE_QUANTITY, updatedVariant?.quantity);
    }

    fetcher.submit(formData, {
      method: "post",
    });
  }, [pickedVariant, updatedVariant]);
  useEffect(() => {
    if (notFoundVariant) {
      shopify.toast.show("Product Variant is Not Found or Deleted", {
        duration: 3000,
        isError: true,
      });
      if (preListVariants) {
        const timer = setTimeout(() => {
          handleClickConvertPrevious(preListVariants);
          setNotFoundVariant(false);
        }, 300);

        // Cleanup
        return () => clearTimeout(timer);
      }
    }
  }, [notFoundVariant]);
  useEffect(() => {
    if (!pickedVariant) return;
    if (fetcher.state == "submitting") {
      setLoading(true);
    }
    if (fetcher.state == "idle" && fetcher.data) {
      const { type } = fetcher.data as {
        // productVariants: IouputActionUpdateProduct[];
        type: string[];
      };
      if (type.length == 1) {
        if (type[0] == VARIANTS.IS_UPDATE_PRICE) {
          console.log("price updated");
          const { productVariants } = fetcher.data as {
            productVariants: IouputActionUpdateProduct[];
          };
          if (productVariants && productVariants.length >= 0) {
            const afterUpdateVariantData = productVariants[0];
            const cloneArr = _.cloneDeep(pickedVariant);
            cloneArr.node.inventoryQuantity =
              afterUpdateVariantData.inventoryQuantity;
            cloneArr.node.price = afterUpdateVariantData.price;
            setPickedVarant(cloneArr);
            closeModalUpdateProduct();
            setLoading(false);
            shopify.toast.show("Update Price Successfully", {
              duration: 3000,
            });
          }
          return;
        }
        if (type[0] == VARIANTS.IS_UPDATE_QUANTITY) {
          const { quantityChanges } = fetcher.data as {
            quantityChanges: IchangeQuantity[];
          };
          if (quantityChanges.length >= 0) {
            const cloneArr = _.cloneDeep(pickedVariant);
            cloneArr.node.currentInventoryQuantity += quantityChanges[0].delta;
            const edgesLocations =
              cloneArr.node.inventoryItem.inventoryLevels.edges;

            const getLocationIndex = edgesLocations.findIndex(
              (item) => item.node.location.id === selected,
            );
            cloneArr.node.inventoryItem.inventoryLevels.edges[
              getLocationIndex
            ].node.quantities[0].quantity += quantityChanges[0].delta;
            setPickedVarant(cloneArr);
            closeModalUpdateProduct();
            setLoading(false);
            shopify.toast.show("Update Quantity Successfully", {
              duration: 3000,
            });
          }
        }
        if (type[0] == VARIANTS.ERROR) {
          const { userErrors } = fetcher.data as {
            userErrors: {
              EM: IuserErrors[];
              LC: string;
            };
          };
          const { LC, EM } = userErrors;
          if (LC == VARIANTS.ERROR_LOCALE_UPDATE_PRICE) {
            const errorMessage =
              "Can not update Price Because ---->" + JSON.stringify(EM);
            shopify.toast.show(errorMessage, {
              duration: 5000,
              isError: true,
            });
            setUpdateVariant({
              ...updatedVariant,
              price: pickedVariant?.node.price ?? "",
            });

            setLoading(false);
          }
          if (LC == VARIANTS.ERROR_LOCALE_UPDATE_QUANTITY) {
            const errorMessage =
              "Can not update Quantity Because---->" + JSON.stringify(EM);
            shopify.toast.show(errorMessage, {
              duration: 5000,
              isError: true,
            });
            setUpdateVariant({
              ...updatedVariant,
              quantity:
                pickedVariant?.node.currentInventoryQuantity?.toString() ?? "",
            });

            setLoading(false);
          } else {
            let message = "";
            EM.forEach((item) => {
              message += ` ${item.message} \n`;
            });
            const errorMessage =
              "Can not update Quantity and Price Because---->" + message;
            shopify.toast.show(errorMessage, {
              duration: 5000,
              isError: true,
            });
            setUpdateVariant({
              ...updatedVariant,
              quantity:
                pickedVariant?.node.currentInventoryQuantity?.toString() ?? "",
              price: pickedVariant?.node.price ?? "",
            });

            setLoading(false);
          }
        }
        return;
      }
      if (type.length == 2) {
        const { productVariants, quantityChanges } = fetcher.data as {
          productVariants: IouputActionUpdateProduct[];
          quantityChanges: IchangeQuantity[];
        };
        const afterUpdateVariantData = productVariants[0];
        const cloneArr = _.cloneDeep(pickedVariant);
        cloneArr.node.price = afterUpdateVariantData.price;
        cloneArr.node.currentInventoryQuantity += quantityChanges[0].delta;
        const edgesLocations =
          cloneArr.node.inventoryItem.inventoryLevels.edges;

        const getLocationIndex = edgesLocations.findIndex(
          (item) => item.node.location.id === selected,
        );
        cloneArr.node.inventoryItem.inventoryLevels.edges[
          getLocationIndex
        ].node.quantities[0].quantity += quantityChanges[0].delta;
        setPickedVarant(cloneArr);
        closeModalUpdateProduct();
        setLoading(false);
        shopify.toast.show("Update Price and Quantity Successfully", {
          duration: 3000,
        });
      }
    }
  }, [fetcher]);
  useEffect(() => {
    if (!modalOpen) {
      setUpdateVariant({
        quantity:
          pickedVariant?.node.currentInventoryQuantity?.toString() ?? "1",
        price: pickedVariant?.node.price ?? "1",
      });
    }
  }, [modalOpen]);
  const navigation = useNavigation();

  const loadingPage =
    navigation.state === "loading" &&
    navigation.formData === undefined &&
    navigation.location.pathname !== location.pathname;

  return (
    <>
      <Page
        fullWidth
        backAction={{ content: "Settings", url: "/app/products" }}
        title="Back to List Products"
        primaryAction={
          <Button variant="primary" onClick={() => openModalUpdateProduct()}>
            Update Products
          </Button>
        }
      >
        <TitleBar title="Product Detail" />
        {loadingPage ? (
          <>
            <SkeletonPageComponent />
          </>
        ) : (
          <Layout>
            <Layout.Section variant="fullWidth">
              <LegacyCard>
                <InlineStack wrap={true} gap="500" align="start">
                  <LegacyCard.Section>
                    <ImagesProduct
                      product={product}
                      pickedVariant={pickedVariant}
                    />
                  </LegacyCard.Section>
                  <LegacyCard.Section>
                    <Box width="100%">
                      <InforProduct
                        product={product}
                        pickedVariant={pickedVariant}
                        selectOptions={selectVariantOption}
                      />
                    </Box>
                  </LegacyCard.Section>
                </InlineStack>
              </LegacyCard>
            </Layout.Section>
            <Layout.Section variant="oneThird">
              <Card>
                <Box>
                  <Text variant="bodySm" as="p">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: product.descriptionHtml,
                      }}
                    />
                  </Text>
                </Box>
              </Card>
            </Layout.Section>
          </Layout>
        )}
      </Page>
      <ModalUpdateProduct
        updatedVariant={updatedVariant}
        handleChange={handleChange}
        err={err}
        loading={loading}
        handleSubmitUpdate={handleSubmitUpdate}
      />
      <NotFoundModal />
    </>
  );
}
export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div role="alert" className="error-summary">
        <h3>Status: {error.status} - Có lỗi xảy ra:</h3>
        <ul>
          {error?.data?.userErrors?.map((error: IuserErrors, index: number) => (
            <li key={index}>
              {JSON.stringify(error.field)}: {error.message}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (error instanceof Error) {
    return (
      <div className="error-container" style={{ padding: "10px" }}>
        <h1>Đã xảy ra lỗi</h1>
        <p>{error.message}</p>
        <pre style={{ whiteSpace: "pre-wrap" }}>{error.stack}</pre>
      </div>
    );
  }

  return (
    <div className="error-container">
      <h1>Lỗi không xác định</h1>
      <p>Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.</p>
    </div>
  );
}
