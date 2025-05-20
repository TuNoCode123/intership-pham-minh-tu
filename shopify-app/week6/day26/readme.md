# 🧭 Giới thiệu Remix Framework

Remix là một full-stack web framework dựa trên React, hỗ trợ server-side rendering (SSR), routing mạnh mẽ và tách biệt logic data fetching.

## Tính năng nổi bật

- **Hiệu suất cao:** Progressive enhancement giúp tối ưu tốc độ tải trang.
- **Kiến trúc rõ ràng:** Phân tách logic data fetching (loader, action) và UI.
- **Nested routes & error boundaries:** Xây dựng giao diện phức tạp, dễ kiểm soát lỗi.
- **Tối ưu SEO:** SSR giúp cải thiện khả năng tìm kiếm.
- **Tích hợp với Shopify:** Dễ dàng phát triển app cho Shopify.

## Tóm tắt

- Hiệu suất cao với progressive enhancement.
- Hỗ trợ tốt nested routes và error boundaries.
- Tối ưu cho UX và tốc độ tải trang.

---

# 💡 Vì sao Shopify chọn Remix làm default App framework?

Remix hỗ trợ:

- **SSR tốt:** Tải trang nhanh, SEO thân thiện.
- **Data loading và mutation tách biệt:** (loader và action) phù hợp mô hình xử lý dữ liệu của Shopify.
- **Nested routing:** Dễ xây dựng giao diện admin nhiều cấp của Shopify App.
- **Tích hợp sâu vào Shopify CLI:** Giúp dev tạo app nhanh chóng.

---

# ⚙️ Setup dự án Remix với Shopify CLI

```bash
npm install -g @shopify/cli @shopify/app
shopify app create remix
```

- Tạo app mới với Remix được scaffold sẵn.
- Có thể chọn ngôn ngữ: JavaScript / TypeScript.
- Hỗ trợ đầy đủ cấu hình OAuth, GraphQL Admin API, Polaris, v.v.

---

# 🏗️ Cấu trúc chuẩn của một Remix Shopify App

```
/my-app
│
├── app/                ← Thư mục chính cho route, loader, UI
│   ├── routes/         ← Tất cả các route của app
│   ├── entry.server.tsx / client.tsx
│   ├── components/
│   └── lib/            ← Logic dùng chung (API, Shopify helpers,...)
│
├── remix.config.js     ← Config Remix
├── shopify.config.js   ← Config Shopify App
├── server.js           ← Server entry (Express hoặc built-in)
└── package.json
```

---

# 🔄 Data Loader, Action, Route trong Remix

## Loader – dùng để lấy dữ liệu (GET)

```js
export const loader = async ({ request }) => {
  const data = await getData();
  return json(data);
};
```

## Action – dùng để xử lý form hoặc mutation (POST, PUT, DELETE)

```js
export const action = async ({ request }) => {
  const formData = await request.formData();
  // Xử lý logic gửi lên
  return redirect("/success");
};
```

## Route – mỗi file trong `app/routes` là một route

```js
// app/routes/products.tsx
export default function ProductPage() {
  const data = useLoaderData();
  return <ProductList data={data} />;
}
```

Remix sẽ tự động ánh xạ `/products` → file `products.tsx`.
