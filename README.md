# 🚗 Vehicle Rental API

A modern, secure, and scalable REST API for managing vehicle rental operations built with Express.js and TypeScript.

## ✨ Features

- 🔐 **Secure Authentication & Authorization** - JWT-based authentication with role management
- 📋 **Vehicle Management** - Complete CRUD operations for vehicle inventory
- 🎟️ **Booking System** - Advanced booking management with availability tracking
- 👥 **User Management** - Comprehensive user profile and account management
- ⚡ **Rate Limiting** - Request rate limiting to prevent abuse
- 🛡️ **CORS Protection** - Secure cross-origin resource sharing
- 📝 **Comprehensive Logging** - Detailed request and error logging
- ✅ **Input Validation** - Robust data validation for all endpoints
- 🚀 **Production Ready** - Deployed on Vercel with optimized performance

## 🛠️ Technology Stack

| Category            | Technologies          |
| ------------------- | --------------------- |
| **Runtime**         | Node.js               |
| **Language**        | TypeScript            |
| **Framework**       | Express.js            |
| **Database**        | PostgreSQL            |
| **Authentication**  | JWT (JSON Web Tokens) |
| **Deployment**      | VPS Hosting           |
| **Package Manager** | pnpm                  |

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm package manager
- PostgreSQL database

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/md-rejoyan-islam/vehicle-rental-api.git
   cd vehicle-rental-api
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Update the `.env.local` file with your database credentials and JWT secret.

4. **Run database migrations**

   ```bash
   pnpm run db:migrate
   ```

5. **Start the development server**
   ```bash
   pnpm run dev
   ```

The API will be available at `http://localhost:5000`

## 📖 API Documentation

### Authentication Endpoints

| Method | Endpoint              | Description                | Auth Required |
| ------ | --------------------- | -------------------------- | ------------- |
| POST   | `/api/v1/auth/signup` | Register a new user        | ❌ No         |
| POST   | `/api/v1/auth/signin` | User login                 | ❌ No         |
| GET    | `/api/v1/auth/me`     | Get current logged-in user | ✅ Yes        |

### Vehicle Endpoints

| Method | Endpoint                      | Description                            | Auth Required | Role  |
| ------ | ----------------------------- | -------------------------------------- | ------------- | ----- |
| GET    | `/api/v1/vehicles`            | Get all vehicles with filters          | ❌ No         | -     |
| GET    | `/api/v1/vehicles/:vehicleId` | Get vehicle details                    | ❌ No         | -     |
| POST   | `/api/v1/vehicles`            | Create new vehicle                     | ✅ Yes        | Admin |
| PUT    | `/api/v1/vehicles/:vehicleId` | Update vehicle details                 | ✅ Yes        | Admin |
| DELETE | `/api/v1/vehicles/:vehicleId` | Delete vehicle (if no active bookings) | ✅ Yes        | Admin |

### Booking Endpoints

| Method | Endpoint                      | Description                              | Auth Required | Role           |
| ------ | ----------------------------- | ---------------------------------------- | ------------- | -------------- |
| POST   | `/api/v1/bookings`            | Create new booking                       | ✅ Yes        | Customer/Admin |
| GET    | `/api/v1/bookings`            | Get bookings (admin: all, customer: own) | ✅ Yes        | Customer/Admin |
| PUT    | `/api/v1/bookings/:bookingId` | Update booking (Cancel or Return)        | ✅ Yes        | Customer/Admin |

### User Endpoints

| Method | Endpoint                | Description         | Auth Required | Role           |
| ------ | ----------------------- | ------------------- | ------------- | -------------- |
| GET    | `/api/v1/users`         | Get all users       | ✅ Yes        | Admin          |
| GET    | `/api/v1/users/:userId` | Get user by ID      | ✅ Yes        | Admin          |
| PUT    | `/api/v1/users/:userId` | Update user profile | ✅ Yes        | Admin/Own User |
| DELETE | `/api/v1/users/:userId` | Delete user account | ✅ Yes        | Admin          |

### Utility Endpoints

| Method | Endpoint  | Description          |
| ------ | --------- | -------------------- |
| GET    | `/`       | API welcome message  |
| GET    | `/health` | Service health check |

## 🔧 Project Structure

```
src/
├── app/                 # Express app configuration
├── config/             # Database & middleware configuration
├── middlewares/        # Custom middlewares
├── modules/            # Feature modules (auth, booking, user, vehicle)
├── routes/             # Route definitions
├── utils/              # Utility functions
└── server.ts          # Server entry point
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt password encryption
- **CORS** - Configured cross-origin protection
- **Rate Limiting** - Request throttling to prevent abuse
- **Input Validation** - Comprehensive data validation
- **Error Handling** - Secure error messages without exposing sensitive data

## 📊 Available Scripts

```bash
# Development
pnpm run dev          # Start development server with auto-reload

# Build & Production
pnpm run build        # Compile TypeScript
pnpm run start        # Start production server

```

## 🌐 Live Deployment

The API is deployed and accessible at:

- **Live URL**: [Vehicle Rental API](https://car.rejoyan.me)
- **Status**: Production Ready

## 📤 Submission Guide

### 1. Codebase & Documentation

**README.md**: Professional documentation including:

- ✅ Project Name & Live URL
- ✅ Features & Technology Stack
- ✅ Setup & Usage Instructions
- ✅ API Endpoints Documentation
- ✅ Project Structure Overview
- ✅ Security Features

### 2. What You Need to Provide

- **GitHub Repository Link**
- **Live Deployment Link**

#### 📝 Example Submission Format

```
GitHub Repo: https://github.com/md-rejoyan-islam/vehicle-rental-api
Live Deployment: https://car.rejoyan.me
```

## 👨‍💻 Author

**Md. Rejoyan Islam**

- GitHub: [@md-rejoyan-islam](https://github.com/md-rejoyan-islam)
- Email: [rejoyanislam0014@gmail.com]
