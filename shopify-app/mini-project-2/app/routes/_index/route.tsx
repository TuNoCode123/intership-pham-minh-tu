import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import { authenticate, login } from "../../shopify.server";
import sessionStorage from "../../shopify.server";
import styles from "./styles.module.css";
import db from "../../db.server";
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  console.log("url", url);
  // const { session } = await authenticate.admin(request);
  const {
    admin: { graphql },
    session,
  } = await authenticate.admin(request);

  const { accessToken } = session;
  if (!accessToken) {
    console.error("Không thể lấy Access Token từ sessionStorage.");
    throw new Response("Authentication Error: Access Token not found.", {
      status: 500,
    });
  }
  try {
    const response = await graphql(`
      query {
        shop {
          id
          name
          email
          myshopifyDomain
        }
      }
    `);
    const rs = await response.json();
    const {
      data: { shop },
    } = rs;
    const shopifyShopId = shop.id.replace("gid://shopify/Shop/", "");
    await db.shop.upsert({
      where: { id: shopifyShopId },
      update: {
        accessToken: accessToken,
        domain: shop.myshopifyDomain,
        name: shop.name,
        email: shop.email,
      },
      create: {
        id: shopifyShopId,
        accessToken: accessToken,
        domain: shop.myshopifyDomain,
        name: shop.name,
        email: shop.email,
        status: "installed",
      },
    });
  } catch (error) {
    console.error("Lỗi khi lưu/cập nhật shop vào DB:", error);
    // Xử lý lỗi, có thể redirect hoặc hiển thị thông báo
  }

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return { showForm: Boolean(login) };
};

export default function App() {
  const { showForm } = useLoaderData<typeof loader>();

  return (
    <div className={styles.index}>
      <div className={styles.content}>
        <h1 className={styles.heading}>A short heading about [your app]</h1>
        <p className={styles.text}>
          A tagline about [your app] that describes your value proposition.
        </p>
        {showForm && (
          <Form className={styles.form} method="post" action="/auth/login">
            <label className={styles.label}>
              <span>Shop domain</span>
              <input className={styles.input} type="text" name="shop" />
              <span>e.g: my-shop-domain.myshopify.com</span>
            </label>
            <button className={styles.button} type="submit">
              Log in
            </button>
          </Form>
        )}
        <ul className={styles.list}>
          <li>
            <strong>Product feature</strong>. Some detail about your feature and
            its benefit to your customer.
          </li>
          <li>
            <strong>Product feature</strong>. Some detail about your feature and
            its benefit to your customer.
          </li>
          <li>
            <strong>Product feature</strong>. Some detail about your feature and
            its benefit to your customer.
          </li>
        </ul>
      </div>
    </div>
  );
}
