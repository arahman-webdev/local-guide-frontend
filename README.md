# TourMate – Full Stack Tour Management Platform

TourMate is a modern **Next.js 16** full‑stack application that allows Tourists, Guides, and Admins to interact inside a highly optimized travel/tour marketplace. The platform includes role‑based authentication, admin dashboards, tour creation, search/explore, bookings, wishlists, profile management, and a full backend API with Prisma + PostgreSQL.

---

## 🚀 Features

### ✅ **Authentication & Authorization**

* JWT Access + Refresh Token flow
* Secure cookies (httpOnly, sameSite, secure)
* Role‑based access (ADMIN, GUIDE, TOURIST)
* Middleware route protection in Next.js

### 🧭 **Tours Management**

* Create Tours (Guide)
* Upload images (multiple)
* Edit/Delete Tours
* Search by destination, category, price, date, language
* Explore page with filters

### ❤️ **Wishlist / Favorites**

* Tourists can add/remove tours to their favorites
* View all saved tours

### 📅 **Booking System**

* Create booking
* Manage booking status (Admin/Guide)
* Dynamic pricing & group size rules

### 👤 **Profile System**

* User profile page
* Update name, email, picture
* Admin overview for all users

### 🛠️ **Admin Dashboard**

* Manage Users
* Block / Unblock
* Manage all tours & bookings

---

## 🏗️ Tech Stack

### **Frontend**

* **Next.js 16**
* **React Hook Form + Zod**
* **TailwindCSS + shadcn/ui**
* **React Query (TanStack)**
* **Next Auth Middleware (custom)**
* **Image Upload UI Component**


## 🔧 Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/arahman-webdev/local-guide-frontend.git
cd tourmate
```

### 2️⃣ Install dependencies

#### Frontend

```bash
cd frontend
npm install
```



### 3️⃣ Configure Environment Variables

Create a **.env** file in frontend

Backend `.env` example:


Frontend `.env.local` example:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```



### 5️⃣ Run Frontend

```bash
cd frontend
npm run dev or bun dev
```








## 👨‍💻 Developer

**Abdur Rahman**
Frontend Developer (MERN / Next.js)
📧 Email: [mdarahman5645@gmail.com](mailto:mdarahman5645@gmail.com)
GitHub: [https://github.com/arahman-webdev](https://github.com/arahman-webdev)


