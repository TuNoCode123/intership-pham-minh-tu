import type { LoaderFunctionArgs } from "@remix-run/node";

import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";

import { authenticate } from "../shopify.server";
import DataTableWithPaginationExample from "app/components/pages/admin/products/admin-product";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return null;
};

export default function AdminProduct() {
  return (
    <>
      <DataTableWithPaginationExample />
    </>
  );
}
