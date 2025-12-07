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
| **Deployment**      | Vercel                |
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

The API will be available at `http://localhost:3000`

## 📖 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Vehicle Endpoints

- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/:id` - Get vehicle details
- `POST /api/vehicles` - Create new vehicle (Admin)
- `PUT /api/vehicles/:id` - Update vehicle (Admin)
- `DELETE /api/vehicles/:id` - Delete vehicle (Admin)

### Booking Endpoints

- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### User Endpoints

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users (Admin)

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

# Database
pnpm run db:migrate   # Run database migrations
pnpm run db:seed      # Seed database with sample data
pnpm run db:studio    # Open Prisma Studio

# Quality
pnpm run lint         # Run linter
pnpm run format       # Format code
```

## 🌐 Live Deployment

The API is deployed and accessible at:

- **Live URL**: [Vehicle Rental API](https://your-deployment-url.vercel.app)
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
Live Deployment: https://your-deployment-url.vercel.app
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Md. Rejoyan Islam**

- GitHub: [@md-rejoyan-islam](https://github.com/md-rejoyan-islam)
- Email: [your-email@example.com]

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Support

For issues and questions:

- Open an issue on GitHub
- Check existing documentation
- Review API error messages

---

**Last Updated**: December 7, 2025
