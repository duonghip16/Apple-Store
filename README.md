<div align="center">

# 🍎 Hip Store – Modern E-Commerce Platform

### Full-Stack E-Commerce Solution with AI-Powered Admin Dashboard

[![Next.js](https://img.shields.io/badge/Next.js-15.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.16-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

[Live Demo](#) • [Documentation](#) • [Report Bug](#) • [Request Feature](#)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Hip Store** is a production-ready, full-stack e-commerce platform built with cutting-edge technologies. It features a powerful admin dashboard with real-time analytics, comprehensive product management, and seamless customer experience.

### Why This Project?

- ✅ **Production Ready** – Built with best practices and scalability in mind
- ✅ **Type Safe** – Full TypeScript implementation across frontend and backend
- ✅ **Modern UI/UX** – Beautiful, responsive design with shadcn/ui components
- ✅ **Real-time Sync** – Live data synchronization between admin and customer views
- ✅ **Secure** – JWT authentication, bcrypt password hashing, protected routes
- ✅ **SEO Optimized** – Next.js 15 App Router with metadata API

---

## ✨ Features

### 🛍️ Customer Experience

| Feature | Description |
|---------|-------------|
| **Product Catalog** | Browse 6 categories: iPhone, iPad, Mac, Apple Watch, AirPods, Accessories |
| **Smart Search** | Advanced filtering with real-time suggestions |
| **Shopping Cart** | Real-time cart updates with localStorage persistence |
| **Secure Checkout** | Multiple payment methods (COD, Credit Card, Bank Transfer) |
| **Reviews & Ratings** | Customer feedback system with admin moderation |
| **User Accounts** | Profile management, order history, and wishlist |

### 📊 Admin Dashboard

| Feature | Description |
|---------|-------------|
| **Analytics Dashboard** | Real-time sales, revenue, and customer metrics with charts |
| **Product Management** | Full CRUD operations with image upload support |
| **Order Tracking** | Complete order lifecycle management (pending → completed) |
| **Customer Management** | User approval system, status control, and insights |
| **Review Moderation** | Approve/reject customer reviews before publishing |
| **Visual Reports** | Interactive charts with Recharts (sales, categories, top products) |
| **Database Tools** | Initialize, backup, and manage database directly from UI |

---

## 📸 Screenshots

<div align="center">

### Customer Interface
![Homepage](docs/screenshots/homepage.png)
*Modern homepage with neural network animation and hero product*

![Product Catalog](docs/screenshots/products.png)
*Product catalog with advanced filtering and search*

### Admin Dashboard
![Admin Dashboard](docs/screenshots/admin-dashboard.png)
*Real-time analytics with interactive charts*

![Product Management](docs/screenshots/admin-products.png)
*Comprehensive product management interface*

</div>

---

## 🚀 Tech Stack

### Core Technologies

```
┌─────────────────────────────────────────────────────────┐
│  Frontend: Next.js 15 (App Router) + TypeScript 5      │
│  Styling: Tailwind CSS v3.4 + shadcn/ui                │
│  Backend: Next.js API Routes                           │
│  Database: MongoDB Atlas + Mongoose ODM                │
│  Auth: JWT + bcryptjs                                  │
│  Charts: Recharts                                      │
└─────────────────────────────────────────────────────────┘
```

### Key Dependencies

**Frontend**
- `next` ^15.2.4 – React framework with App Router
- `react` ^19.1.0 – UI library
- `typescript` ^5 – Type safety
- `tailwindcss` ^3.4.17 – Utility-first CSS
- `@radix-ui/*` – Accessible UI primitives
- `lucide-react` ^0.454.0 – Beautiful icon library
- `recharts` – Data visualization

**Backend**
- `mongodb` – Official MongoDB driver
- `mongoose` ^8.16.2 – Elegant MongoDB ODM
- `bcryptjs` ^3.0.2 – Password hashing
- `jsonwebtoken` ^9.0.2 – JWT authentication
- `zod` ^3.24.1 – Schema validation

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **MongoDB** 5.x or higher (local or Atlas)
- **npm/yarn/pnpm** package manager

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/yourusername/hip-store.git
cd hip-store
```

**2. Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

**3. Environment Setup**

Create `.env.local` in the root directory:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hip_store

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# App URL (optional)
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**4. Initialize Database**

```bash
npm run dev
```

Navigate to `http://localhost:3000/admin` and click "Initialize Database" button.

**5. Access the Application**

- **Customer Site:** `http://localhost:3000`
- **Admin Dashboard:** `http://localhost:3000/admin`
- **User Account:** `http://localhost:3000/user`

### 🔑 Default Credentials

**Admin Account**
```
Email: admin@applestore.ai
Password: admin123
```

**Test Customer Account**
```
Email: hip@gmail.com
Password: 123
```

> ⚠️ **Security Warning:** Change these credentials immediately in production!

---

## 📁 Project Structure

```
hip-store/
├── app/
│   ├── admin/                    # Admin dashboard
│   │   ├── tabs/                 # Dashboard tabs (Orders, Customers, Reviews)
│   │   ├── page.tsx              # Main admin interface
│   │   ├── sync-admin.ts         # Real-time sync logic
│   │   └── sync-reviews.ts       # Review synchronization
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   │   ├── login/            # User/Admin authentication
│   │   │   ├── register/         # User registration
│   │   │   └── check-status/     # Auth status check
│   │   ├── products/             # Product CRUD
│   │   ├── orders/               # Order management
│   │   ├── users/                # User management
│   │   ├── reviews/              # Review system
│   │   ├── analytics/            # Dashboard analytics
│   │   ├── checkout/             # Checkout processing
│   │   ├── init-database/        # DB initialization
│   │   ├── create-admin/         # Admin creation
│   │   ├── change-password/      # Password change
│   │   └── forgot-password/      # Password reset
│   ├── user/                     # Customer account page
│   ├── forgot-password/          # Password recovery
│   ├── supports/                 # Support pages
│   │   ├── about/
│   │   ├── faq/
│   │   ├── guide/
│   │   └── policy/
│   ├── page.tsx                  # Homepage
│   └── layout.tsx                # Root layout
├── components/
│   └── ui/                       # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── table.tsx
│       └── ... (50+ components)
├── lib/
│   ├── mongodb.ts                # MongoDB connection
│   └── utils.ts                  # Utility functions
├── public/                       # Static assets
│   ├── 16pm.png                  # Product images
│   └── favicon.png
├── .env.local                    # Environment variables (gitignored)
├── .gitignore                    # Git ignore rules
├── next.config.js                # Next.js configuration
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies
```

---

## 🎯 API Endpoints

### Authentication

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@applestore.ai",
  "password": "admin123"
}
```

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "0901234567"
}
```

### Products

```http
GET    /api/products              # Get all products
GET    /api/products?id={id}      # Get single product
POST   /api/products              # Create product (admin only)
PUT    /api/products              # Update product (admin only)
DELETE /api/products?id={id}      # Delete product (admin only)
```

### Orders

```http
GET    /api/orders                # Get all orders (admin) or user orders
GET    /api/orders?userId={id}    # Get orders by user
POST   /api/orders                # Create new order
PUT    /api/orders                # Update order status (admin only)
DELETE /api/orders?id={id}        # Delete order (admin only)
```

### Users

```http
GET    /api/users                 # Get all users (admin only)
PUT    /api/users                 # Update user info or status
DELETE /api/users?id={id}         # Delete user (admin only)
```

### Reviews

```http
GET    /api/reviews               # Get all reviews
POST   /api/reviews               # Submit review (authenticated users)
PUT    /api/reviews               # Approve review (admin only)
DELETE /api/reviews?id={id}       # Delete review (admin only)
```

### Analytics

```http
GET    /api/analytics             # Get dashboard analytics (admin only)
```

---

## 📊 Database Schema

### Products Collection

```typescript
{
  _id: ObjectId
  name: string
  slug: string
  category: 'iPhone' | 'iPad' | 'Mac' | 'Apple Watch' | 'AirPods' | 'Phụ kiện'
  price: number
  originalPrice: number
  discount: number
  stock: number
  isActive: boolean
  description: string
  images: string[]
  specifications: object
  rating: number
  reviewCount: number
  soldCount: number
  createdAt: Date
  updatedAt: Date
}
```

### Orders Collection

```typescript
{
  _id: ObjectId
  orderNumber: string
  userId: ObjectId
  customerInfo: {
    name: string
    email: string
    phone: string
  }
  items: [{
    productId: ObjectId
    name: string
    price: number
    quantity: number
    image: string
  }]
  totalAmount: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  paymentMethod: 'cod' | 'bank' | 'momo'
  paymentStatus: 'pending' | 'paid'
  shippingAddress: {
    address: string
    city: string
    district: string
  }
  createdAt: Date
  updatedAt: Date
}
```

### Users Collection

```typescript
{
  _id: ObjectId
  name: string
  email: string
  password: string (hashed with bcrypt)
  role: 'customer' | 'admin'
  isActive: boolean
  isApproved: boolean
  phone: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  totalOrders: number
  totalSpent: number
  createdAt: Date
  updatedAt: Date
}
```

### Reviews Collection

```typescript
{
  _id: ObjectId
  productId: ObjectId
  productName: string
  userId: ObjectId
  userName: string
  rating: number (1-5)
  comment: string
  isApproved: boolean
  createdAt: Date
  updatedAt: Date
}
```

---

## 🚀 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/hip-store)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
4. Deploy

```bash
# Using Vercel CLI
npm i -g vercel
vercel --prod
```

### Docker

```bash
# Build image
docker build -t hip-store .

# Run container
docker run -p 3000:3000 \
  -e MONGODB_URI="your_mongodb_uri" \
  -e JWT_SECRET="your_jwt_secret" \
  hip-store
```

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation when needed
- Ensure code passes linting (`npm run lint`)

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com
- Portfolio: [yourportfolio.com](https://yourportfolio.com)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) – The React Framework for Production
- [shadcn/ui](https://ui.shadcn.com/) – Beautifully designed components
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework
- [MongoDB](https://www.mongodb.com/) – Modern database platform
- [Vercel](https://vercel.com/) – Deployment and hosting platform
- [Radix UI](https://www.radix-ui.com/) – Accessible component primitives
- [Lucide Icons](https://lucide.dev/) – Beautiful & consistent icons

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

**Made with ❤️ using Next.js 15 & TypeScript**

[⬆ Back to Top](#-hip-store--modern-e-commerce-platform)

</div>
