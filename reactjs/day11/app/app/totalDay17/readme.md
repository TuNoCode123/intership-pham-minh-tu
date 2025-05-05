# React Shopping Cart Application

## Overview

A modern React shopping cart application built with TypeScript, demonstrating state management using Context API and Reducer pattern.

## Features

- Product listing
- Shopping cart management
- Real-time price calculation
- Responsive design
- Type-safe implementation

## Tech Stack

- React 18
- TypeScript
- Context API
- React Router
- FontAwesome Icons
- TailwindCSS

## Project Structure

```
📦 totalDay17
├── 📂 assets/
│   ├── cart.png
│   ├── product-details.png
│   └── product-listing.png
├── 📂 contexts/
│   ├── cartContext.tsx      # Cart state management
│   └── productContext.tsx   # Product state management
├── 📂 day17/
│   ├── cart.tsx            # Cart page component
│   ├── home.tsx            # Home page component
│   ├── interface.tsx       # TypeScript interfaces
│   └── 📂 components/
│       └── form.tsx        # Reusable form components
├── 📂 hooks/
│   ├── useCart.tsx         # Cart context hook
│   └── useProduct.tsx      # Product context hook
└── 📂 products/
    └── [id].tsx            # Product detail page
```

## Key Features

1. **Cart Management**

   - Add items to cart
   - Remove items from cart
   - Real-time total price calculation
   - Quantity management

2. **Product Features**

   - Product listing
   - Product details
   - Dynamic pricing
   - Image display

3. **UI Components**
   - Responsive table layout
   - Action buttons
   - Price formatting
   - Loading states

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Usage

### Adding Products to Cart

```typescript
dispatch({
  type: ActionTypes.ADD_ITEMS,
  payload: productData,
});
```

### Removing Items from Cart

```typescript
dispatch({
  type: ActionTypes.REMOVE_ITEM,
  payload: productId,
});
```

## State Management

The application uses Context API with Reducer pattern for state management:

- `CartContext`: Manages shopping cart state
- `ProductContext`: Handles product data
- Custom hooks (`useCart`, `useProduct`) for accessing context

## Screenshots

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request
