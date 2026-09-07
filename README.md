<div align="center">

# 🎓 Acadify - Multi-Role LMS & Academy Platform

**A production-ready Online Learning Management System built with Next.js 16, React 19, and Tailwind CSS v4. Supports Arabic (RTL) and English with full Admin, Instructor, and Student portals.**

[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Live Demo](https://img.shields.io/badge/Live_Demo-acadify--platform.vercel.app-00C7B7?style=for-the-badge&logo=vercel&logoColor=white)](https://acadify-platform.vercel.app)

</div>

---

## 🌟 Overview

**Acadify** is a fully-featured, multi-role Learning Management System (LMS) designed for modern online education. It provides a seamless bilingual experience (Arabic RTL + English LTR) with role-based access control across three user types: Students, Instructors, and Administrators.

---

## 🚀 Key Features

### 👥 Three Fully Isolated Portals
- **Student Portal**: Browse courses, manage subscriptions, view assignments, track orders, upload trials, chat with instructors, and manage wallet balance.
- **Instructor Portal**: Manage offers/courses, review student requests, handle notifications, track earnings.
- **Admin Portal**: Full platform management - students, instructors, orders, pricing plans, subscriptions, wallet transactions, and notifications.

### 🌐 Bilingual & RTL Support
- Full **Arabic** (RTL) and **English** (LTR) support via `next-intl`.
- All UI components, layouts, and typography flip seamlessly per locale.
- Locale-aware routing with automatic direction adjustment.

### ⚡ Modern Architecture
- Built with **Next.js 16 App Router** and **Turbopack** for blazing-fast builds.
- **React 19** with Server Components and Server Actions for optimal performance.
- Clean API layer in `lib/api/` with typed responses and error handling.
- Role-based authentication with session management and Demo Mode fallback.

---

## 🛠️ Quick Start

### Prerequisites
- Node.js 18.17+ or 20+
- npm, yarn, or pnpm

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env.local

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📦 Production Build

```bash
npm run build
npm run start
```

---

## 📄 License
Commercial License - All rights reserved.