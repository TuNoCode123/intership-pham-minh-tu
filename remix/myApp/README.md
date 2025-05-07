# Remix Shopping Cart Application

## 🚀 Overview

A modern e-commerce application built with Remix, TypeScript and Shopify Polaris UI, featuring product management, shopping cart functionality, and responsive design.

## ✨ Key Features

- Product listing with pagination
- Shopping cart management
- Search functionality
- Responsive design
- Toast notifications
- Admin product management
- Local storage persistence

## 🛠️ Tech Stack

- **Framework:** Remix.run v2.16
- **UI Library:** Shopify Polaris v13.9
- **Styling:** TailwindCSS
- **Form Management:** React Hook Form + Zod
- **State Management:** Context API
- **Notifications:** React Toastify
- **Others:**
  - Lodash
  - React Responsive Pagination
  - TypeScript

## 📂 Project Structure

```
📦 myApp/
├── 📂 app/
│   ├── 📂 components/
│   │   └── 📂 products/
│   │       ├── product.tsx         # Product card component
│   │       ├── QuantityCell.tsx    # Quantity input component
│   │       └── 📂 form/
│   │           └── form_add_product.tsx
│   ├── 📂 constants/
│   │   ├── api.ts                  # API endpoints
│   │   └── enum.ts                 # Action types
│   ├── 📂 contexts/
│   │   ├── cart_context.tsx        # Cart state management
│   │   └── product_context.tsx     # Product state management
│   ├── 📂 hooks/
│   │   ├── useCart.ts             # Cart operations
│   │   ├── useProduct.ts          # Product operations
│   │   └── useToast.tsx           # Toast notifications
│   └── 📂 routes/
│       ├── cart.tsx               # Cart page
│       ├── home.tsx               # Product listing
│       └── product.tsx            # Admin product management
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20.0.0
- npm or yarn

### Installation

```bash
# Clone repository
git clone <repository-url>

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📝 Environment Variables

Create `.env` file in root directory:

```
VITE_API_URL=http://localhost:8000
VITE_API_VERSION=v1
```

## 🔍 Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm start          # Run production server
npm run typecheck  # Run TypeScript checks
npm run lint       # Run ESLint
```

## 🎯 Features Detail

### Product Management

- List products with pagination
- Add/Edit/Delete products (Admin)
- Search products by name and category

### Shopping Cart

- Add items to cart
- Update quantities
- Remove items
- Bulk delete items
- Calculate total price
- Persist cart in localStorage

### UI/UX Features

- Responsive design with Polaris
- Toast notifications
- Loading states
- Error handling
- Form validation
- Modal confirmations

## 🔒 Authentication & Authorization

- Form validation using Zod

## 📚 State Management

Uses Context API with separate contexts for:

- Shopping Cart state
- Product state
- UI state

## 🎨 Styling

- TailwindCSS for custom styling
- Shopify Polaris components
- Responsive design patterns
- Custom CSS for table components

## 🔧 Project Configuration

- TypeScript configuration
- ESLint setup
- Vite configuration
- PostCSS/TailwindCSS setup

## 📈 Performance Optimization

- Debounced search
- Optimized re-renders
- Local storage persistence
- Lazy loading routes

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 📄 License

MIT License
