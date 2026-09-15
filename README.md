# Product Management System

A full-stack product management application built with Node.js, Express, PostgreSQL, and React + Vite. The app supports a customer-facing product catalog and an admin console for product and category management.

## Project Overview

This project implements a complete product lifecycle:

1. Admin creates and manages product categories.
2. Admin creates, updates, activates/inactivates, and deletes products.
3. Admin can upload product images and associate products with a category.
4. Customers browse products by category and search term.
5. Customers can open a product detail page that displays stock, availability, returnable feature, featured flag, pricing, brand, SKU, and dates.

The app is organized into two main folders:

- `Backend/` — Express API, PostgreSQL integration, validation, image upload, and route handling.
- `Frontend/` — React + Vite UI for the storefront and admin panel.

## Tech Stack

### Backend

- Node.js
- Express.js
- PostgreSQL using `pg`
- Joi for request validation
- Multer for image upload
- dotenv for environment configuration
- CORS support

### Frontend

- React
- Vite
- React Router DOM
- Fetch-based API client
- Lucide React icons

## Product Flow

### Customer Flow

1. Open the customer homepage at `/`.
2. Browse products from the `ProductCatalogPage`.
3. Search for products by name, brand, or SKU.
4. Filter products by category.
5. Select a product card to open the product detail page.
6. Product detail page shows the product image, description, price, category, SKU, stock, availability, returnability, feature flag, brand, product type, date fields, and tags.

### Admin Flow

1. Open the admin area at `/admin`.
2. Navigate to products or categories.
3. Create a category from the category list page using the category modal.
4. Create a product from the admin product list page by clicking Add Product.
5. Save the product using a form that supports price, stock, SKU, category assignment, description, product type, availability, featured flag, returnable flag, available date, expiry date, and image upload.
6. Edit or delete products and categories.
7. Toggle category and product status between `Active` and `Inactive`.

## Main Features

### Products

- Create product
- Update product
- Delete product
- Search products
- Filter products by category
- View product detail page
- Product image upload support
- Product status active/inactive toggle
- Product availability, type, returnable, featured flags

### Categories

- Create category
- Update category
- Delete category
- Count products per category
- Toggle category status
- Prevent category deletion when products are assigned to it

### Validation and Errors

- Joi validation for product inputs
- Unique product SKU validation via PostgreSQL
- Foreign key validation when assigning category IDs
- Central Express error handling

## Database Design

The backend initializes PostgreSQL tables automatically using `initDatabase()`.

### Categories Table

```sql
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Products Table

```sql
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  sku VARCHAR(80) NOT NULL UNIQUE,
  description TEXT,
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  brand VARCHAR(120),
  category_id INTEGER NOT NULL REFERENCES categories(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  product_type VARCHAR(30) NOT NULL DEFAULT 'Physical',
  availability VARCHAR(30) NOT NULL DEFAULT 'Available',
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  returnable BOOLEAN NOT NULL DEFAULT TRUE,
  available_date DATE,
  expiry_date DATE,
  image_url TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## Project Folder Structure

```text
Task_Product_Management/
├── Backend/
│   ├── package.json
│   ├── server.js
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       └── utils/
│
└── Frontend/
    ├── package.json
    ├── index.html
    └── src/
```

## API Endpoints

### Products

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | List all products |
| GET | `/api/products/:id` | Get one product |
| POST | `/api/products` | Create a product |
| PUT | `/api/products/:id` | Update a product |
| PATCH | `/api/products/:id` | Update product status |
| DELETE | `/api/products/:id` | Delete a product |

### Categories

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/categories` | List all categories |
| GET | `/api/categories/:id` | Get one category |
| POST | `/api/categories` | Create a category |
| PUT | `/api/categories/:id` | Update a category |
| PATCH | `/api/categories/:id` | Update category status |
| DELETE | `/api/categories/:id` | Delete a category |

### Health Check

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Returns server health status |

## Environment Setup

### Backend

Create a `.env` file in the `Backend/` folder with PostgreSQL values:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
DB_HOST=localhost
DB_PORT=5432
DB_NAME=product_management
DB_USER=postgres
DB_PASSWORD=your_password
```

### Frontend

Create a `.env` file in the `Frontend/` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

There is also an example file in the frontend:

```env
VITE_API_URL=http://localhost:5000/api
```

## Installation and Run

### Backend

```sh
cd Backend
npm install
npm run dev
```

The backend server runs on port `5000` by default.

### Frontend

```sh
cd Frontend
npm install
npm run dev
```

The Vite dev server runs on port `5173` by default.

## Build

### Frontend Production Build

```sh
cd Frontend
npm run build
```

## Production Notes

- Uploaded images are served by Express from `Backend/uploads/`.
- Product image file paths returned by the backend are in the format `/uploads/<file-name>`.
- The frontend `resolveImageUrl()` helper rewrites the backend image path correctly for the browser.

## Screens and UI Flow

The UI uses the following route structure:

```text
/
/products/:id
/admin
/admin/products
/admin/products/new
/admin/products/:id/edit
/admin/categories
```

The navigation is layered so:

- Customer and admin experience are separated by route structure.
- Admin pages use forms and tables for CRUD operations.
- Customer pages use product cards and product details.

## Error Handling

The backend central error handler returns:

- `400` for validation failure
- `404` when an entity is not found
- `409` for duplicate unique field or foreign-key relationship conflict
- `500` for internal server errors

## Future Improvements

- Add authentication and role-based access for admins.
- Add pagination and sorting.
- Add unit and integration tests.
- Add product image resizing and CDN support.
- Add categories and products caching.
- Add product stock quantity update history.

## License

This project is provided as a learning or product management sample application.
