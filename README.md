# Travel & Tour Booking Backend

# Overview: 
A complete backend API for a Travel & Tour Booking Platform built using Node.js, Express, Prisma ORM, PostgreSQL, JWT Authentication, RBAC, SSLCommerz Payment Gateway, and Cloudinary for media uploads.

# Features
🔐 Authentication & Authorization

Tourist, Guide, Admin roles

Register, Login

Access + Refresh tokens (HTTP-only cookies)

Secure token rotation


# Users

View profile

Update profile

Admin: block/unblock users

Guide: manage tours

# Tours

Create, update, delete (Guide/Admin)
Upload multiple images
List all tours with filters (price, date, category, language)
Tour details by ID

# Wishlist (Favorite Tours)

Add to wishlist

Remove from wishlist

Get user wishlist

# 📝 Booking System

Create booking

Validate guide availability

Booking statuses:

PENDING

CONFIRMED

CANCELLED

ONGOING

COMPLETED

# 💳 Payment (SSLCommerz)

Initiate payment

User redirected to SSLCommerz "Pay Now" page

Payment success webhook

Payment failed/cancel callbacks

Booking auto-update after payment

# ☁️ Cloudinary

Upload & delete tour images

# 👮 Admin Functionalities

Manage users

Manage guides

View site statistics

Manage bookings

# Tech Stack


Technology Node.js Express.js Prisma ORM PostgreSQL / MySQL TypeScript Cloudinary JWT Secure

# 🧩 Installation & Setup

1 Clone the repository
git clone https://github.com/arahman-webdev/local-guide-backend.git

2 Install dependencies
npm install

3 Generate Prisma client
npx prisma generate

4 Run database migrations
npx prisma migrate dev --name init

5 Start the development server
npm run dev

Server runs on 👉 http://localhost:5000