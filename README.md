# Clothing E-Commerce Platform

A full-stack e-commerce application for clothing with frontend, admin panel, and backend API.

## Project Structure

```
clothing-web/
├── backend/          # Express.js REST API
├── frontend/         # React customer frontend  
└── admin/            # React admin dashboard
```

## Prerequisites

- Node.js (v16+)
- npm
- MongoDB (local or MongoDB Atlas connection string)

## Setup Instructions

### 1. Backend Setup

```bash
cd backend

# Environment is already configured in .env
# Make sure these values are set correctly:
# - MONGO_URI (MongoDB connection string)
# - JWT_SECRET (JWT signing key)
# - FRONTEND_URL (Frontend URL, default: http://localhost:5173)
# - ADMIN_URL (Admin URL, default: http://localhost:5174)

# Install dependencies
npm install

# Run database seed (creates initial products, categories, and admin user)
npm run seed

# Start backend server (development mode with hot reload)
npm run dev
# Backend will run on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend

# Environment already configured in .env
# API_URL is set to http://localhost:5000/api/v1

# Install dependencies
npm install

# Start development server
npm run dev
# Frontend will run on http://localhost:5173
```

### 3. Admin Panel Setup

```bash
cd admin

# Environment already configured in .env
# API_URL is set to http://localhost:5000/api/v1

# Install dependencies
npm install

# Start development server
npm run dev
# Admin will run on http://localhost:5174
```

## Default Admin Credentials

When you run the seed script, an admin account is created:
- **Email**: admin@clothingweb.com
- **Password**: Admin@1234

## Features

### Frontend (Customer)
- ✅ Home page with featured and trending products
- ✅ Product browsing by category (Men, Women, Kids)
- ✅ Product detail pages with reviews
- ✅ Shopping cart functionality
- ✅ User authentication (Login/Register)
- ✅ **Checkout flow** (3-step process: Shipping → Payment → Confirm)
- ✅ **Order tracking and history**
- ✅ Wishlist management
- ✅ User profile management
- ✅ Address management

### Admin Panel
- ✅ Dashboard with key metrics
  - Total Orders
  - Total Revenue
  - Product Count
  - Customer Count
  - Recent Orders
  - Low Stock Alerts
- ✅ **Products Management** - Create, Read, Update, Delete products
- ✅ **Orders Management** - View all orders, update order status
- ✅ **Categories Management** - Manage product categories
- ✅ **Users Management** - View and manage customer accounts

### Backend API
- ✅ Authentication (Login, Register, JWT tokens)
- ✅ Product management with filtering and search
- ✅ Shopping cart management
- ✅ Order management
- ✅ Category management
- ✅ User management
- ✅ Admin dashboard statistics
- ✅ Product reviews and ratings
- ✅ Wishlist management

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user
- `PUT /api/v1/auth/profile` - Update profile
- `POST /api/v1/auth/address` - Add address
- `DELETE /api/v1/auth/address/:id` - Delete address

### Products
- `GET /api/v1/products` - Get all products (with filters)
- `GET /api/v1/products/:id` - Get product by ID
- `GET /api/v1/products/slug/:slug` - Get product by slug
- `POST /api/v1/products` - Create product (admin)
- `PUT /api/v1/products/:id` - Update product (admin)
- `DELETE /api/v1/products/:id` - Delete product (admin)
- `POST /api/v1/products/:id/reviews` - Add review
- `PUT /api/v1/products/:id/wishlist` - Toggle wishlist

### Cart
- `GET /api/v1/cart` - Get cart
- `POST /api/v1/cart` - Add to cart
- `PUT /api/v1/cart/:itemId` - Update cart item
- `DELETE /api/v1/cart/:itemId` - Remove from cart
- `DELETE /api/v1/cart` - Clear cart

### Orders
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders/my` - Get user's orders
- `GET /api/v1/orders/:id` - Get order details
- `GET /api/v1/orders` - Get all orders (admin)
- `PUT /api/v1/orders/:id/status` - Update order status (admin)
- `GET /api/v1/orders/stats` - Get order statistics (admin)

### Categories
- `GET /api/v1/categories` - Get all categories
- `POST /api/v1/categories` - Create category (admin)
- `PUT /api/v1/categories/:id` - Update category (admin)
- `DELETE /api/v1/categories/:id` - Delete category (admin)

### Admin
- `GET /api/v1/admin/dashboard` - Get dashboard statistics
- `GET /api/v1/admin/users` - Get all users (admin)
- `DELETE /api/v1/admin/users/:id` - Delete user (admin)

## Testing the Application

### Step 1: Seed Database
Run the database seed to populate initial data:
```bash
cd backend
npm run seed
```

### Step 2: Test Customer Flow
1. Go to http://localhost:5173 (frontend)
2. Create a new account or use test credentials
3. Browse products, add to cart
4. Proceed to checkout
5. Complete order (cash on delivery)
6. View orders in your account

### Step 3: Test Admin Panel
1. Go to http://localhost:5174 (admin)
2. Login with admin credentials:
   - Email: `admin@clothingweb.com`
   - Password: `Admin@1234`
3. View dashboard metrics
4. Manage products, orders, categories, users

### Step 4: Test Coupon Codes
In checkout, try these coupon codes:
- `SAVE10` - 10% discount
- `SAVE20` - 20% discount

## Database Models

### User
- Name, Email, Password (hashed)
- Role (user/admin)
- Phone, Avatar
- Addresses (multiple)
- Wishlist (product references)

### Product
- Name, Description, Brand
- Gender & Type categorization
- Images, Thumbnail
- Prices (original & discounted)
- Variants (size, color, stock)
- Reviews & Ratings
- Tags, Featured flag, Trending flag

### Category
- Name, Slug
- Gender & Sub-Gender
- Description, Image
- Active status

### Cart
- User reference
- Items (product, variant, quantity, price)
- Virtual total amount calculation

### Order
- User reference
- Order number (unique)
- Items with snapshot data
- Shipping address
- Payment method & status
- Order status with history
- Totals (subtotal, discount, shipping, total)

## Customization

### Add More Product Categories
Edit the seed file or use the admin panel to add new categories.

### Modify Pricing
Update product prices in the admin panel.

### Add Payment Gateway
Currently supports Cash on Delivery. To integrate Razorpay:
1. Add Razorpay keys to .env
2. Implement payment verification in checkout flow
3. Update order creation logic

### Customize Themes
Frontend uses CSS with CSS variables. Edit `src/index.css` to customize colors.

## Troubleshooting

### "Cannot connect to MongoDB"
- Ensure MongoDB is running
- Check MONGO_URI in backend/.env is correct
- Verify network connection to MongoDB Atlas

### "Admin login fails"
- Make sure you ran `npm run seed` in backend
- Check admin credentials in seed.js
- Verify JWT_SECRET is set

### "CORS errors"
- Ensure FRONTEND_URL and ADMIN_URL are correctly set in backend/.env
- Check that URLs match where frontend/admin are running

### "Products not loading"
- Check if backend is running on port 5000
- Verify database has products from seed
- Check browser console for API errors

## Build for Production

### Frontend
```bash
cd frontend
npm run build
# Output in dist/ folder
```

### Admin
```bash
cd admin
npm run build
# Output in dist/ folder
```

### Backend
No build needed. Run with:
```bash
NODE_ENV=production npm start
```

## License

ISC

## Support

For issues or questions, please check the documentation or create an issue in the repository.
