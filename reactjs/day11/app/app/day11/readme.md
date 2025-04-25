# Shopping Cart Implementation

This directory contains a simple shopping cart implementation using React and TypeScript.

## Components Structure

### 1. `index.tsx`

- Main component that handles the shopping cart logic
- Contains product list and cart state management
- Features:
  - Product listing
  - Add to cart functionality
  - Cart total calculation
  - Cart item management

### 2. `cart.tsx`

- Cart component that displays added items
- Features:
  - Display cart items in a table format
  - Delete items from cart
  - Quantity adjustment
  - Responsive design with Tailwind CSS

### 3. `product.tsx`

- Product card component
- Features:
  - Display product information
  - Add to cart button
  - Styled with Tailwind CSS

### 4. `interface.ts`

- TypeScript interfaces for the application
- Defines:

```typescript
interface IProduct {
  id: number;
  name: string;
  price: number;
}
```

## Features

1. Product Management

   - Display products in a responsive grid
   - Each product shows name and price
   - "Add to cart" functionality

2. Cart Management

   - Add/remove items
   - Adjust quantities
   - Calculate total price
   - Display total items
   - Real-time updates

3. State Management
   - Uses React useState for cart state
   - Uses useMemo for performance optimization
   - Implements TypeScript for type safety

## Usage

```tsx
// Add item to cart
const addToCart = (id: number) => {
  // Find product and add to cart
};

// Remove item from cart
const deleteItemCart = (id: number) => {
  // Filter out item from cart
};

// Update item quantity
const handleChangeQuantity = (id: number) => {
  // Update item quantity in cart
};
```

![alt text](screenshot\image.png)
