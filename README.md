
# 🛒 Exclusive E-Commerce

**Live Demo:** [exclusive-ecommerce-lac.vercel.app](https://exclusive-ecommerce-lac.vercel.app)  
**Tech Stack:** MERN (MongoDB, Express.js, React.js, Node.js) + Firebase + Stripe + Brevo

## 🚀 Overview

**Exclusive E-Commerce** is a modern full-stack e-commerce web application built using the MERN stack. It features a seamless user experience with both **guest and authenticated user workflows**, **email verification**, **secure payments**, and **dynamic flash sales**.

This platform replicates core e-commerce functionalities including:
- Guest user cart/wishlist support using `guestId` cookies
- Google and email-based authentication
- Email verification via Brevo with secure expiring tokens
- Refresh token & access token-based session handling
- Merge/discard logic for guest data upon login
- Flash sales with dynamic pricing
- Secure Stripe payments and billing workflows
- Full user profile management (orders, addresses, cards, returns, etc.)

---

## 💡 Features

### 🧑‍💻 User Accounts & Authentication

- Sign up with **email, password, name, phone number, and gender**
- **Email verification** using Brevo before allowing login
  - JWT-based verification token (expires in a few minutes)
  - Token expiration prompts user to resend a new one
- **Login options:**
  - Traditional email/password login
  - Google OAuth login
- On successful login:
  - **Access Token** (JWT): 15 minutes
  - **Refresh Token** (Cookie): 7 days (used for silent login/session renewal)

---

### 🎁 Guest Cart & Wishlist

- Users can add products to **cart** and **wishlist without signing in**
- Unique `guestId` is generated using UUIDv4 and stored in cookies
- On login:
  - A **merge modal** prompts user to:
    - Merge guest cart/wishlist into their account OR
    - Discard guest cart/wishlist data

---

### 🔥 Flash Sales & Pricing

- Flash sales are managed and reflected dynamically in product pricing
- Clicking **Buy Now**:
  - Prompts login if the user is unauthenticated
  - Redirects back to the billing flow after login

---

### 💳 Checkout & Payments

- **Billing Page** offers:
  - **Cash on Delivery (COD)**
  - **Stripe Card Payment**
- Stripe integration includes:
  - Add/change default cards via modal
  - Prompt to add **shipping address** if not already saved
- After order placement:
  - Billing document is deleted
  - A **success modal** confirms order placement

---

### 👤 User Profile & Dashboard

Users can manage:
- Profile info (name, email, phone, gender)
- Orders (view, cancel, return)
- Saved payment methods (default card, add/remove)
- Addresses (default shipping, add/remove/edit)
- Newsletter subscription

---

## ⚙️ Technologies Used

### Frontend
- **React.js** with functional components
- **Tailwind CSS** for styling
- **ShadCN UI** for modern UI components
- **Zustand** for lightweight global state management

### Backend
- **Node.js & Express.js** RESTful API
- **MongoDB** with Mongoose for database operations
- **JWT** for authentication (access + verification tokens)
- **UUID** for guest ID generation
- **Stripe API** for payments
- **Brevo SMTP** for email verification workflows
- **Firebase Hosting (alternative backend hosting)**

---

## 📦 Deployment

- **Frontend:** Vercel  
- **Backend:** Vercel Serverless Functions

---



## 📩 Contact

**Khawaja Shaheer Asim**  
Email: [shaheerasim320@gmail.com](mailto:shaheerasim320@gmail.com)  
GitHub: [shaheerasim320](https://github.com/shaheerasim320)  
LinkedIn: [Shaheer Asim](https://www.linkedin.com/in/shaheer-asim-4b08a2367/)

---

## ⭐️ Note

This project is part of my learning journey in full-stack web development. Contributions, feedback, and suggestions are welcome!
