# 📱 Offline-First Expense Tracker — React Native & Node.js

[![React Native](https://img.shields.io/badge/React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000000?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![WatermelonDB](https://img.shields.io/badge/WatermelonDB-FF4081?style=for-the-badge&logo=database&logoColor=white)](https://watermelondb.dev/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

A production-grade, full-stack personal finance mobile application built with a **React Native (Expo)** client and an **Express.js** backend. Engineered using an **Offline-First Architecture** with **WatermelonDB** for zero-latency local operations and **WebSockets** for real-time background sync across devices.

---

## 🏗️ Repository Architecture

```text
├── mobile/                  # React Native (Expo) Client App
│   └── DailyExpense/        # Core Application
│       ├── src/             # Screens, Components, State Management (Zustand, Formik)
│       │   ├── components/
│       │   ├── zustand-store/
│       │   ├── screens/
│       │   ├── theme/
│       │   ├── api/
│       │   ├── services/
│       │   └── types/
│       └── package.json
└── server/                  # Node.js & Express REST API Engine
    └── src/
        ├── controllers/     # Authentication & Financial Analytics Controllers
        ├── services/        # Business Logic & Database Services
        ├── middleware/      # JWT Verification & Request Validation
        └── models/          # Mongoose Data Schemas
```

---

## ✨ Features & Technical Highlights

* **💾 Offline-First Architecture:** Instant UI updates and local persistence powered by SQLite & WatermelonDB, allowing complete app functionality without active internet access.
* **⚡ Real-Time Sync Engine:** WebSocket gateway designed to sync offline local database mutations with the backend database upon reconnecting.
* **🔐 Stateless JWT Authentication:** Secure registration/login pipeline utilizing JSON Web Tokens and bcrypt password hashing.
* **🎨 Modern Motion & UI State:** Dynamic reactive forms powered by **Formik**, smooth UI interactions using **React Native Reanimated**, and state management via **Zustand**.
* **📄 CSV Financial Data Export:** Built-in capability to generate and export transaction reports into standard CSV format for local backup and auditing.

---

## 🛠️ Implementation Progress

> **Status:** 🛠️ **Active Development (~75% Core Architecture Complete)**

### ✅ Completed Core Engineering (75%)
* [x] Monorepo workspace architecture setup
* [x] WatermelonDB local database schema definition & relation mappings
* [x] Node.js Express backend API with JWT authentication middleware
* [x] Basic WebSocket sync interface initialization
* [x] Mobile authentication flows & core navigation structure
* [x] CSV financial report export engine

### ⏳ In Progress / Upcoming Roadmap (25%)
* [ ] Bulk transaction CSV import functionality
* [ ] Custom budget capping & threshold tracking system
* [ ] Expense analytics charting & graphical visualizers UI
* [ ] Advanced multi-device conflict resolution algorithms
* [ ] Push notification alerts for budget limit breaches

---

## 🚀 Local Development Setup

### 1. Prerequisites
Ensure you have Node.js (v18+) and npm/yarn installed on your machine.

### 2. Backend Server Setup
```bash
cd server
npm install
npm run dev
```

### 3. Mobile Expo Application
```bash
cd mobile/DailyExpense
npm install
npx expo start
```
