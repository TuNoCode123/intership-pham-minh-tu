import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { AppProvider } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import "./tailwind.css";
import { ProductProvider } from "./contexts/product_context";
import { CartProvider } from "./contexts/cart_context";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

// export const loader = async ({ request }: LoaderFunctionArgs) => {
//   const url = new URL(request.url);
//   const page = url.searchParams.get("page") || 1;
//   const limit = url.searchParams.get("limit") || 6;
//   const data = await fetch(`${api.getAllProduct}?page=${page}&limit=${limit}`);
//   const res = await data.json();
//   const { EC, DT } = res;
//   const { total: TotalProduct, data: products } = DT;
//   if (EC == 0) return json({ products, TotalProduct, page, limit });
//   else return json({ products: [], TotalProduct: 0, page, limit });
// };
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
const i18n = {
  Polaris: {
    TextField: {
      clearButton: "Clear", // Thêm các giá trị nếu bạn muốn tùy chỉnh
    },
  },
};
export default function App() {
  return (
    <>
      <AppProvider i18n={i18n}>
        <ProductProvider>
          <CartProvider>
            <Outlet />
          </CartProvider>
        </ProductProvider>
      </AppProvider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </>
  );
}
