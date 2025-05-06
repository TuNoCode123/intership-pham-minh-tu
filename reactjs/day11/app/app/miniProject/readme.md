# React Mini Project - Shopping Cart Application

## 📝 Overview

A modern shopping cart application built with React, TypeScript and Ant Design, featuring product management, cart functionality, and admin capabilities.

## 🛠️ Tech Stack

- **Frontend Framework:** React 18, TypeScript
- **UI Library:** Ant Design (antd)
- **State Management:** Context API + useReducer
- **Routing:** React Router DOM v7
- **Form Validation:** Zod
- **HTTP Client:** Native Fetch API
- **Styling:** TailwindCSS

## 📂 Project Structure

```
📦 miniProject/
├── 📂 components/
│   ├── 📂 carts/
│   │   └── cart.tsx               # Shopping cart component
│   ├── 📂 modals/
│   │   └── modal_delete_Cart.tsx  # Delete confirmation modal
│   └── 📂 products/
│       ├── drawer_add_product.tsx # Product addition drawer
│       ├── form_add_product.tsx   # Product form
│       ├── manager_product.tsx    # Admin product management
│       └── product.tsx            # Product card component
├── 📂 contexts/
│   ├── cartContext.tsx           # Cart state management
│   └── productContext.tsx        # Product state management
├── 📂 hooks/
│   ├── useCart.ts               # Cart custom hook
│   ├── useNotification.ts       # Notification custom hook
│   └── useProduct.ts            # Product custom hook
├── 📄 app.tsx                   # Main application component
├── 📄 index.tsx                 # Entry point
└── 📄 interface.tsx             # TypeScript interfaces
```

## ✨ Features

### Product Management

- Product listing with pagination
- Add new products (Admin)
- Update existing products
- Delete products
- Product search and filtering

### Shopping Cart

- Add items to cart
- Update item quantities
- Remove items from cart
- Real-time price calculation
- Cart persistence using localStorage
- Bulk delete items

### UI/UX

- Responsive design
- Loading states
- Success/Error notifications
- Confirmation modals
- Tab-based navigation

## 🚀 Getting Started

### Prerequisites

```bash
node -v  # >= 16.0.0
npm -v   # >= 8.0.0
```

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## 💻 Usage

### Product Context Usage

```typescript
const { context } = useProduct();
const { state, dispatch } = context;

// Add product
dispatch({
  type: ActionTypes.ADD_ITEMS,
  payload: productData,
});

// Remove product
dispatch({
  type: ActionTypes.REMOVE_ITEM,
  payload: productId,
});
```

### Cart Context Usage

```typescript
const { addToCart, removeMultipleItems, updateItem } = useCart();

// Add to cart
addToCart(
  {
    id: product.id,
    name: product.name,
    price: product.price,
  },
  quantity
);

// Update cart
updateItem(updatedCartItems);
```

## 🔑 API Integration

### Endpoints

- `GET /api/v1/products` - Get all products
- `POST /api/v1/admin/products` - Add new product
- `PUT /api/v1/admin/products/:id` - Update product
- `DELETE /api/v1/admin/products/:id` - Delete product

### Authentication

```typescript
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};
```

## 📚 State Management

### Product State

```typescript
interface State {
  product: IProduct[];
}

type Action =
  | { type: "ADD_ITEMS"; payload: IProduct }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "UPDATE_ITEM"; payload: IProduct }
  | { type: "LOADING_ITEM"; payload: IProduct[] };
```

### Cart State

```typescript
interface State {
  cart: ICart[];
}

interface ICart {
  id?: number;
  name?: string;
  price: number;
  quantity: number;
  totalPrice: number;
}
```

## 🎨 Components

### Product Card

- Displays product information
- Add to cart functionality
- Quantity selector
- Price display

### Shopping Cart

- Table display of cart items
- Quantity adjustment
- Total price calculation
- Bulk delete functionality

### Admin Panel

- Product management interface
- CRUD operations
- Form validation
- Success/Error handling

## 🔧 Configuration

Environment variables required:

```env
VITE_API_URL=http://localhost:8000
VITE_API_VERSION=v1
```

## 📖 Additional Information

- Uses Zod for runtime type checking
- Implements proper TypeScript interfaces
- Follows React best practices
- Uses custom hooks for logic separation
- Implements proper error handling
- Features responsive design
