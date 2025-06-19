import type { HeadersFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";

import { authenticate } from "../shopify.server";
import { PointProvider } from "app/contexts/pointContext";
import { ReviewProvider } from "app/contexts/reviewContext";
import { CommonProvider } from "app/contexts/commonContext";
import { getShop } from "app/helpers/getShop";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const {
    session: { shop },
  } = await authenticate.admin(request);
  const shopId = await getShop(shop);
  return { apiKey: process.env.SHOPIFY_API_KEY || "", shopId };
};

export default function App() {
  const { shopId, apiKey } = useLoaderData<typeof loader>();

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <NavMenu>
        {/* <Link to="/app" rel="home">
          Home
        </Link> */}

        <Link to="/app/point-page" rel="home">
          Point Management
        </Link>
        <Link to="/app/customer">Customer Management</Link>
        <Link to="/app/point-transaction-history">
          Point Transaction History
        </Link>
        <Link to="/app/redeem">Redeem Management</Link>
        <Link to="/app/reviews">Review Management</Link>
      </NavMenu>
      <CommonProvider shopId={shopId}>
        <ReviewProvider>
          <PointProvider>
            <Outlet />
          </PointProvider>
        </ReviewProvider>
      </CommonProvider>
    </AppProvider>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
