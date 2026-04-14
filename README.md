# 🌍 Joynate – Donate Food & Clothes with Ease

Joynate is a full-stack donation platform that connects donors with NGOs and delivery agents to ensure that food and clothes reach people in need quickly and efficiently.

---

## 🚀 Features

### 👤 User Side
- 🔐 Authentication (Email/Password + Google Sign-In)
- 🏠 Modern Landing Page
- 🎁 Step-based Donation Form
- 📜 Donation History (Live Updates)
- 🔔 Status Tracker (Assigned → Picked → Donated)

---

### 🛠 Admin Dashboard
- 📊 View all donations
- 🚚 Assign delivery agents
- 👥 Manage donation flow

---

### 🚴 Delivery Dashboard
- 📍 View assigned deliveries
- ✅ Accept requests
- 🗺 Pickup location tracking
- 📸 Upload proof (optional)
- 🔄 Update delivery status

---

## 🧑‍💻 Tech Stack

**Frontend**
- React.js
- Tailwind CSS
- React Router
- Context API

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB (Prisma ORM)

**Authentication**
- Firebase (Google Sign-In)
- JWT (Custom Auth)

---

## 📁 Project Structure

```bash
joynate/
│
├── client/
│   ├── components/
│   ├── pages/
│   ├── context/
│   └── assets/
│
├── server/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── config/
│
├── prisma/
│
└── README.md
```

---

## ⚙️ Installation

### 1. Clone Repo
```bash
git clone https://github.com/your-username/joynate.git
cd joynate
```

### 2. Install Dependencies

Frontend:
```bash
cd client
npm install
```

Backend:
```bash
cd server
npm install
```

---

## 🔑 Environment Variables

Create `.env` in **server/**

```env
DATABASE_URL=your_mongodb_url
JWT_SECRET=your_secret_key
```

Frontend `.env` (if needed):

```env
VITE_FIREBASE_API_KEY=your_key
```

---

## ▶️ Run Project

Backend:
```bash
cd server
npm run dev
```

Frontend:
```bash
cd client
npm run dev
```

---

## 📸 Modules

- Authentication System
- Donation System
- Admin Dashboard
- Delivery Tracking
- Notification System

---

## 🎯 Future Scope

- 📱 React Native App
- 🤖 AI Chatbot Integration
- 📍 Smart NGO Matching
- 💬 Real-time Chat

---

## 🤝 Contributing

Feel free to fork this repo and create pull requests 🚀

---
