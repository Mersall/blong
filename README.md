# BLONG - Matrimonial App

A modern, minimal matrimonial app with Arabic/English localization and RTL/LTR support.

## 🏗️ Project Structure

```
BLONG/
├── frontend/          # React Native with Expo
├── backend/           # NestJS API
└── docs/             # Comprehensive project documentation
    ├── business/      # Business strategy and analysis
    ├── audits/        # System audit reports
    ├── implementation/# Implementation guides
    ├── architecture/  # Technical architecture
    └── user-guides/   # User and developer guides
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Install dependencies for both frontend and backend:**
   ```bash
   npm run install:all
   ```

2. **Start the backend server:**
   ```bash
   npm run backend
   ```

3. **Start the frontend app:**
   ```bash
   npm run frontend
   ```

4. **Run both simultaneously:**
   ```bash
   npm run dev
   ```

## 📱 Frontend (React Native + Expo)

### Features
- ✅ Modern, minimal UI design
- ✅ Arabic/English localization
- ✅ RTL/LTR layout support
- ✅ Language switching
- ✅ Clean, matrimonial-focused design

### Available Scripts
- `npm start` - Start Metro bundler
- `npm run web` - Open web version
- `npm run android` - Open Android app
- `npm run ios` - Open iOS app

### Design System
- **Primary Color:** `#e91e63` (Pink)
- **Background:** `#ffffff` (White)
- **Text Primary:** `#212529` (Dark Gray)
- **Text Secondary:** `#6c757d` (Medium Gray)
- **Accent:** `#f8f9fa` (Light Gray)

## 🔧 Backend (NestJS + PostgreSQL)

### Features
- ✅ RESTful API with NestJS
- ✅ PostgreSQL database with Prisma ORM
- ✅ JWT authentication
- ✅ User management
- ✅ Profile system
- ✅ Date delivery system foundation

### API Endpoints
- `GET /` - API status endpoint
- `GET /health` - Health check
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /users/me` - Get current user
- `PUT /users/me` - Update user
- `GET /users/profile` - Get user profile
- `POST /users/profile` - Create/update profile

### Database
The app uses PostgreSQL with Prisma ORM. The schema includes:
- User management (User, UserProfile, UserPreferences, Photo)
- Date delivery system (ScheduledDate, DateFeedback, Venues)
- Relationship phases (Relationship, Notification)

## 🌍 Localization

The app supports Arabic and English with proper RTL/LTL layouts:

- **English (en):** Left-to-right layout
- **Arabic (ar):** Right-to-left layout with Arabic typography

Language detection works automatically based on:
1. Previously saved user preference
2. Browser/device language (fallback to English)

## 🎨 Design Philosophy

BLONG follows a **modern, minimal design** approach:

- **Clean Typography:** Clear, readable fonts
- **Warm Colors:** Pink accent color for matrimonial warmth
- **Minimal UI:** Focus on content, not decoration
- **Intuitive UX:** Simple navigation and clear actions
- **Cultural Sensitivity:** Proper Arabic support and RTL layouts

## 🔄 Development Workflow

1. **Backend Development:**
   ```bash
   cd backend
   npm run start:dev
   ```

2. **Frontend Development:**
   ```bash
   cd frontend
   npm start
   ```

3. **Database Management:**
   ```bash
   cd backend
   npx prisma dev          # Start Prisma dev server
   npx prisma migrate dev  # Run migrations
   npx prisma studio       # Open database GUI
   ```

## 📦 Tech Stack

### Frontend
- React Native
- Expo
- i18next (internationalization)
- AsyncStorage (local storage)

### Backend
- NestJS
- PostgreSQL
- Prisma ORM
- JWT Authentication
- bcryptjs (password hashing)

## 🚀 Deployment

The app is designed for easy deployment:

- **Frontend:** Can be deployed to Expo, web, or built as native apps
- **Backend:** Can be deployed to any Node.js hosting service
- **Database:** PostgreSQL compatible with most cloud providers

## 📚 Documentation

For comprehensive documentation, please visit our [Documentation Index](docs/README.md).

### Quick Links:
- **[Executive Summary](docs/business/EXECUTIVE_SUMMARY.md)** - High-level business overview
- **[Technical Architecture](docs/business/TECHNICAL_ARCHITECTURE.md)** - System architecture details
- **[Developer Setup](docs/user-guides/DEVELOPER_SETUP.md)** - Development environment setup
- **[Feature Catalog](docs/business/FEATURE_CATALOG.md)** - Complete feature overview
- **[Application Overview](docs/APPLICATION_OVERVIEW.md)** - Detailed application description

### For Different Audiences:
- **Business Stakeholders:** See [docs/business/](docs/business/) for strategy and business analysis
- **Developers:** See [docs/architecture/](docs/architecture/) for technical specifications
- **Product Managers:** See [docs/implementation/](docs/implementation/) for implementation guides
- **QA Teams:** See [docs/audits/](docs/audits/) for comprehensive audit reports

## 📄 License

MIT License - see LICENSE file for details.

---

**BLONG** - Building meaningful connections with modern technology and cultural sensitivity.
