# Node.js E-Commerce API Project

## Project Structure

```
📦 nodejs-project
├── 📂 src/
│   ├── 📂 configs/
│   │   ├── 📄 configApp.js      # Application configuration
│   │   └── 📄 configMysql.js    # MySQL database connection
│   │
│   ├── 📂 controllers/
│   │   ├── 📄 auth.controller.js       # Authentication handling
│   │   ├── 📄 order.controller.js      # Order management
│   │   ├── 📄 product.controller.js    # Product operations
│   │   └── 📄 userManagement.controller.js # User administration
│   │
│   ├── 📂 helpers/
│   │   ├── 📄 bcryptPass.js     # Password encryption
│   │   ├── 📄 customError.js    # Error handling utilities
│   │   ├── 📄 jwt.js           # JWT token management
│   │   ├── 📄 pagination.js    # Pagination helper
│   │   └── 📄 sqlCrud.js       # Database operations
│   │
│   ├── 📂 interfaces/
│   │   ├── 📄 auth.js          # Authentication constants
│   │   └── 📄 error.js         # Error interfaces
│   │
│   ├── 📂 middlewares/
│   │   ├── 📄 auth.js          # Authentication middleware
│   │   ├── 📄 errorHandler.js  # Global error handler
│   │   ├── 📄 roleManagement.js # Role-based access control
│   │   └── 📄 validateMiddleware.js # Request validation
│   │
│   ├── 📂 models/
│   │   ├── 📄 index.js         # Model initialization
│   │   ├── 📄 user.model.js    # User schema
│   │   ├── 📄 product.model.js # Product schema
│   │   ├── 📄 order.model.js   # Order schema
│   │   └── 📄 order_items.model.js # Order items schema
│   │
│   ├── 📂 routers/            # API route definitions
│   ├── 📂 seeders/           # Database seeders
│   ├── 📂 services/          # Business logic layer
│   └── 📂 validates/         # Input validation rules
│
├── 📄 .env                   # Environment variables
├── 📄 access.log            # API access logs
├── 📄 index.js              # Application entry point
├── 📄 package.json          # Project dependencies
└── 📄 README.md             # Project documentation
```

## Tech Stack

- Node.js & Express.js
- MySQL Database
- JWT Authentication
- BCrypt Password Hashing
- Zod Validation
- Morgan Logger

## Features

- User authentication (register/login)
- Role-based access control (admin/user)
- Product management
- Order processing
- Input validation
- Error handling
- API logging

### DATABASE

```
-- table users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('user', 'admin')) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  accessVersion INTEGER DEFAULT 1,
  revoke BOOLEAN DEFAULT FALSE
);

-- table products
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER NOT NULL,
  description TEXT,
  category VARCHAR(255)
);

-- table orders
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) CHECK (status IN ('pending', 'paid', 'shipped', 'cancelled')) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- table order_items
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables in `.env`

3. Start development server:

````bash
npm run dev
```// ...existing code...

## 📬 Postman Collection - API Testing

Để dễ dàng kiểm thử các API trong dự án này, bạn có thể sử dụng Postman với file collection đã được chuẩn bị sẵn.

### 📁 File Postman

- Tên file: [`miniProject.postman_collection.json`](./miniProject.postman_collection.json)
- Đường dẫn: nằm trong thư mục gốc của dự án

### 🚀 Cách sử dụng

1. **Cài đặt Postman**
   Tải Postman tại [https://www.postman.com/downloads](https://www.postman.com/downloads)

2. **Import collection vào Postman**
   - Mở Postman
   - Chọn `Import` (góc trên bên trái)
   - Chọn tab **File** → Kéo file `postman_collection.json` vào hoặc chọn từ máy
   - Bấm nút `Import`

3. **(Tuỳ chọn) Tạo môi trường biến (Environment)**
   Nếu collection có dùng biến như `{{base_url}}`, bạn cần:

   - Vào `Environments` → `Add`
   - Thêm biến:
     | Key        | Value                    | Description              |
     |------------|--------------------------|--------------------------|
     | base_url   | http://localhost:8000    | URL của server backend   |
     | auth_token | Bearer eyJhb...          | Token để gọi API bảo mật |

4. **Gửi Request**
   - Chọn collection → Chọn request cần test
   - Nhấn `Send` để gửi yêu cầu và xem phản hồi từ server

---

### 🧪 Chạy Test Tự Động (nếu có)

Nếu file collection có script kiểm thử, bạn có thể:

- Mở `Runner` (góc trái dưới trong Postman)
- Chọn collection → Bấm `Run`
- Xem kết quả các test case pass/fail

---

### 🖼 Hình minh họa (tuỳ chọn)

![Import Postman Collection](https://tenten.vn/tin-tuc/wp-content/uploads/2024/03/postman-la-gi.jpg)

---


## API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication
- Most endpoints require JWT Bearer token authentication
- Token is obtained from the login endpoint
- Include token in request header:
```
Authorization: Bearer <your_jwt_token>
```

### Auth Endpoints

#### Register
```http
POST /register
Content-Type: application/json

{
    "name": "string",
    "email": "string",
    "password": "string",
    "confirmPassword": "string"
    "role": "string"
}
```


#### Login
```http
POST /login
Content-Type: application/json

{
    "email": "string",
    "password": "string"
}
```

### Product Endpoints

#### Get All Products
```http
GET /products?search=<term>&category=<category>
```

#### Add Product (Admin only)
```http
POST /products
Content-Type: application/json

{
    "name": "string",
    "price": number,
    "stock": number,
    "description": "string",
    "category": "string"
}
```

#### Update Product (Admin only)
```http
PUT /admin/products/:id
Content-Type: application/json

{
    "name": "string",
    "price": number,
    "stock": number,
    "description": "string",
    "category": "string"
}
```

### Order Endpoints

#### Create Order
```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

[
  {
    "total_price": number,
    "status": "string",
    "orderItems": [
      {
        "product_id": number,
        "quantity": number,
        "price": number
      }
    ]
  }
]
```

#### Get User Orders
```http
GET /orders
Authorization: Bearer <token>
```

#### Get Specific Order
```http
GET /orders?id=<order_id>
Authorization: Bearer <token>
```

### Admin Endpoints

#### Get All Users (Admin only)
```http
GET /admin/user
Authorization: Bearer <token>
```

#### Lock User (Admin only)
```http
PATCH /admin/users/:id/lock
Authorization: Bearer <token>
```

### Response Formats

#### Success Response
```json
{
    "EC": 0,
    "DT": {},
    "EM": "Operation successful"
}
```

#### Error Response
```json
{
    "EC": 1,
    "EM": "Error message",
}
```

### Authentication Errors
- 401: Unauthorized - Invalid or missing token
- 403: Forbidden - Insufficient permissions

### Validation Errors
- 400: Bad Request - Invalid input data
- 422: Unprocessable Entity - Validation failed

### Resource Errors
- 404: Not Found - Resource doesn't exist
- 409: Conflict - Resource already exists
````
