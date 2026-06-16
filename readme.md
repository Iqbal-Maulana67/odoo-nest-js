# 🏢 Odoo ERP System

A modern ERP (Enterprise Resource Planning) web application built with **NestJS** (backend) and **Next.js** (frontend), integrated with **Odoo** as the ERP engine via XML-RPC.

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), Tailwind CSS, React Query, Zustand |
| Backend | NestJS, Passport JWT |
| ERP Engine | Odoo 17 |
| Database | PostgreSQL (managed by Odoo) |
| Protocol | XML-RPC (NestJS ↔ Odoo) |
| Container | Docker |

---

## ✨ Features

### 🔐 Authentication
- Login using Odoo credentials
- JWT-based session management
- Protected routes (frontend & backend)
- Auto logout on token expiry

### 📦 Product Management
- View product list with search & pagination
- Add new products with stock quantity
- Edit product details and pricing
- Archive / unarchive products
- Real-time stock tracking via Odoo Inventory

### 🛒 Sales Management
- Create and manage sales quotations
- Confirm quotations into sales orders
- Cancel sales orders
- View sales order details with order lines
- Sales summary overview

### 👥 Customer Management
- View and search customer list
- Add individual or company customers
- Edit customer information (contact, address, tax ID)
- Archive customers
- View customer order history

### 🧾 Invoice Management
- Create invoices from scratch with line items
- Confirm (post) invoices
- Cancel invoices
- Track payment status (unpaid / partial / paid)
- Filter invoices by status

### 📊 Reports & Dashboard
- Sales summary (total orders & revenue)
- Revenue trend chart (monthly)
- Top selling products
- Top customers by transaction value
- Invoice payment status distribution
- Stock inventory summary

---

## 🗂️ Project Structure

```
erp-project/
├── erp-backend/          # NestJS API
│   ├── src/
│   │   ├── auth/         # JWT authentication
│   │   ├── odoo/         # Odoo XML-RPC connector
│   │   ├── products/     # Product module
│   │   ├── sales/        # Sales module
│   │   ├── customers/    # Customer module
│   │   ├── invoices/     # Invoice module
│   │   └── reports/      # Reports module
│   └── .env
│
└── erp-frontend/         # Next.js App
    ├── src/
    │   ├── app/          # Pages (App Router)
    │   ├── components/   # Reusable UI components
    │   ├── hooks/        # Custom React Query hooks
    │   ├── store/        # Zustand state management
    │   └── lib/          # API client (Axios)
    └── .env.local
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/login` | Login with Odoo credentials |
| GET | `/auth/me` | Get current user info |

### Products
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | List all products |
| GET | `/api/products/:id` | Get product detail |
| POST | `/api/products` | Create new product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Archive product |

### Sales
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/sales` | List all sales orders |
| GET | `/api/sales/:id` | Get order detail |
| POST | `/api/sales` | Create new quotation |
| PUT | `/api/sales/:id` | Update quotation |
| PUT | `/api/sales/:id/confirm` | Confirm order |
| PUT | `/api/sales/:id/cancel` | Cancel order |
| DELETE | `/api/sales/:id` | Delete draft order |

### Customers
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/customers` | List all customers |
| GET | `/api/customers/:id` | Get customer detail |
| GET | `/api/customers/:id/orders` | Get customer orders |
| POST | `/api/customers` | Create new customer |
| PUT | `/api/customers/:id` | Update customer |
| DELETE | `/api/customers/:id` | Archive customer |

### Invoices
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/invoices` | List all invoices |
| GET | `/api/invoices/:id` | Get invoice detail |
| POST | `/api/invoices` | Create new invoice |
| PUT | `/api/invoices/:id` | Update draft invoice |
| POST | `/api/invoices/:id/confirm` | Confirm invoice |
| POST | `/api/invoices/:id/cancel` | Cancel invoice |

### Reports
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/reports/sales-summary` | Sales summary |
| GET | `/api/reports/revenue-trend` | Monthly revenue trend |
| GET | `/api/reports/top-products` | Top selling products |
| GET | `/api/reports/top-customers` | Top customers |
| GET | `/api/reports/invoice-status` | Invoice payment distribution |
| GET | `/api/reports/stock-summary` | Stock inventory summary |

---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org) v18+
- [Docker](https://www.docker.com) & Docker Compose
- [npm](https://www.npmjs.com) v9+

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/username/odoo-erp-system.git
cd odoo-erp-system
```

### 2. Start Odoo with Docker

```bash
docker-compose up -d
```

Open `http://localhost:8069` and create a new database.

### 3. Setup Backend

```bash
cd erp-backend
npm install
cp .env.example .env   # fill in your Odoo credentials
npm run start:dev
```

Backend runs at `http://localhost:3000`

### 4. Setup Frontend

```bash
cd erp-frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Frontend runs at `http://localhost:3001`

---

## 🌍 Environment Variables

### Backend (`.env`)

```env
ODOO_HOST=localhost
ODOO_PORT=8069
ODOO_DB=mycompany
ODOO_USER=admin
ODOO_PASSWORD=admin
JWT_SECRET=your_jwt_secret
PORT=3000
```

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).