# BLONG Application Overview

## 🎯 Executive Summary

BLONG is a revolutionary matrimonial/romantic lifestyle application that takes a psychology-first approach to relationships. Unlike traditional dating apps, BLONG focuses on deep personality assessment through fun quizzes and premium date delivery services. The app guides users through three distinct relationship phases (Singles, Preparing for Engagement, and Before Engagement) with sophisticated AI-powered date curation based on psychological preferences and venue compatibility.

## 🏗️ Architecture Overview

### Technology Stack

**Frontend (Mobile App)**
- **Framework**: React Native with Expo
- **State Management**: React Context API
- **Data Fetching**: React Query (TanStack Query)
- **Navigation**: React Navigation
- **Styling**: Custom StyleSheet with consistent design system
- **Internationalization**: i18next (Arabic/English with RTL support)
- **Authentication**: JWT tokens with AsyncStorage
- **UI Components**: Custom component library with premium design

**Backend (API Server)**
- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT with Passport.js
- **API**: RESTful endpoints
- **Security**: bcrypt for password hashing

### Project Structure

```
BLONG/
├── frontend/               # React Native mobile application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── screens/       # App screens organized by feature
│   │   ├── services/      # API and business logic services
│   │   ├── contexts/      # React Context providers
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   └── localization/ # i18n translations
│   └── App.js            # Main app entry point
├── backend/              # NestJS API server
│   ├── src/
│   │   ├── auth/         # Authentication module
│   │   ├── profile/      # User profile module
│   │   ├── quiz/         # Personality quiz module
│   │   └── prisma/       # Database service
│   └── prisma/
│       └── schema.prisma # Database schema
└── docs/                 # Project documentation
```

## 🌟 Key Features

### 1. **Elite Onboarding Experience**
- Language selection (Arabic/English) with automatic RTL/LTR layout
- Relationship phase selection (Singles/Preparing/Engaged)
- Smooth animations and transitions
- Preference persistence using AsyncStorage

### 2. **Authentication System**
- Email/password authentication
- JWT token-based sessions
- Secure password hashing (bcrypt)
- Auto-login with token refresh
- Profile completion checks

### 3. **Profile Management**
- Multi-step profile creation flow
- Comprehensive user information:
  - Basic details (name, age, gender)
  - Physical attributes (height, appearance)
  - Education and career
  - Location with dynamic city selection
  - Lifestyle choices (smoking, drinking, exercise)
  - Religious and family values
  - Personal interests and hobbies
- Photo upload capability
- Profile completion tracking

### 4. **Personality Assessment System**
- Big Five personality traits assessment
- Love languages quiz
- Attachment style evaluation
- Scenario-based questions
- Interactive quiz UI with progress tracking
- Personality insights and compatibility calculations
- Visual personality charts and explanations

### 5. **AI-Powered Date Delivery System**
- AI-powered psychological compatibility scoring
- Automatic date arrangement based on compatibility
- No swiping required - premium date delivery service
- Advanced personality analysis from quiz responses
- Smart date scheduling and venue suggestions
- Date opportunity notifications and confirmations

### 6. **Date Management System**
- Automatic date scheduling based on compatibility
- Venue recommendations and booking integration
- Date preparation guidance and tips
- Post-date feedback collection
- Relationship phase progression tracking

### 7. **Location Services**
- Dynamic country/city selection
- Integration with REST Countries API
- GeoDB Cities API for detailed location data
- Location caching for performance
- Postal code validation by country

### 8. **User Interface**
- **Design Philosophy**: Modern, minimal, and romantic
- **Color System**: 
  - Primary: Pink (#E91E63)
  - Phase-specific color palettes
  - Dark mode support
- **Typography**: Clean, readable fonts with proper hierarchy
- **Animations**: Smooth, emotion-inspired transitions
- **Components**: Premium loading states, cards, buttons, and forms

### 9. **Internationalization**
- Full Arabic/English support
- RTL/LTR layout switching
- Localized content and UI elements
- Language preference persistence
- Cultural sensitivity in design

## 📊 Database Schema

The application uses a PostgreSQL database with the following main entities:

### Core Models
1. **User**: Basic user information and authentication
2. **UserProfile**: Detailed profile information
3. **UserPreferences**: Date preferences and venue criteria
4. **UserPersonalityProfile**: Personality assessment results

### Quiz System
1. **QuizCategory**: Different quiz types (Big Five, Love Languages, etc.)
2. **QuizQuestion**: Individual questions
3. **QuizOption**: Answer choices
4. **UserQuizResponse**: User's quiz answers

### Date Management & Social
1. **ScheduledDate**: Curated date experiences and venue bookings
2. **ScheduledDate**: Automatically arranged dates with venues
3. **DateFeedback**: Post-date feedback for relationship progression
4. **Photo**: User photos gallery
5. **Notification**: Date notifications and phase progression alerts

## 🔐 Security & Privacy

- JWT-based authentication with refresh tokens
- Bcrypt password hashing (12 rounds)
- Secure API endpoints with guards
- User data encryption at rest
- Privacy-focused design
- Profile verification system

## 🚀 Development Workflow

### Setup Commands
```bash
# Install all dependencies
npm run install:all

# Start development servers
npm run dev  # Starts both frontend and backend

# Individual servers
npm run frontend
npm run backend
```

### Backend Commands
```bash
cd backend
npm run start:dev     # Development with hot reload
npm run build         # Production build
npx prisma migrate dev # Run database migrations
npx prisma studio     # Database GUI
```

### Frontend Commands
```bash
cd frontend
npm start            # Start Metro bundler
npm run ios         # Run on iOS
npm run android     # Run on Android
npm run web         # Run in browser
```

## 🎨 Design System

### Three Relationship Phases

1. **Singles Journey** 🌸
   - Theme: Reflective, clean, airy
   - Colors: Lavender, cool beige, soft rose
   - Features: Self-reflection, partner values, personality tests

2. **Preparing for Engagement** 💕
   - Theme: Hopeful, structured, playful
   - Colors: Blush pink, warm coral, navy blue
   - Features: Vision boards, relationship timeline, couple's journal

3. **Before Engagement** 💍
   - Theme: Romantic, elegant, focused
   - Colors: Rose gold, deep blue, muted plum
   - Features: Wedding planning, vendor database, financial planning

### Component Library
- **PremiumLoader**: Sophisticated loading animations
- **EliteNotification**: Elegant notification system
- **QuizComponents**: Interactive assessment UI
- **ProfileSteps**: Multi-step form components
- **PersonalityCards**: Compatibility insight components

## 📱 App Flow

1. **Initial Launch** → Language Selection → Phase Selection
2. **Authentication** → Login/Register → Email Verification
3. **Profile Creation** → Multi-step form → Completion check
4. **Main App** → Bottom navigation with 5 tabs:
   - Home (Dashboard with date notifications)
   - Dates (Scheduled dates and feedback)
   - Quiz (Fun personality assessments)
   - Insights (Personality results and compatibility)
   - Profile (Personal information and preferences)

## 🔄 State Management

- **AppContext**: Global app state (user, preferences, phase)
- **LoadingContext**: Centralized loading state management
- **React Query**: Server state and caching
- **AsyncStorage**: Local data persistence

## 🌐 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user

### Profile
- `GET /profile` - Get user profile
- `POST /profile` - Create/update profile
- `GET /profile/completion-status` - Check profile completion
- `POST /profile/photos` - Upload photos

### Quiz & Psychology
- `GET /quiz/categories` - Get available quiz categories
- `GET /quiz/questions/:categoryId` - Get fun quiz questions
- `POST /quiz/responses` - Submit quiz answers
- `GET /quiz/results` - Get personality insights
- `GET /quiz/compatibility/:userId` - Get compatibility analysis

### Date Management
- `GET /dates/scheduled` - Get upcoming scheduled dates
- `POST /dates/:id/feedback` - Submit post-date feedback
- `GET /dates/history` - Get past date history
- `POST /dates/reschedule` - Request date rescheduling

## 🚦 Current Status

The application is in active development with the following completed:
- ✅ Core architecture setup
- ✅ Authentication system
- ✅ Profile management
- ✅ Quiz system backend
- ✅ Basic UI components
- ✅ Onboarding flow
- ✅ Localization support

## 🔮 Future Enhancements

- Advanced AI date curation algorithms
- Premium subscription tiers
- Push notifications
- Analytics and insights
- Admin dashboard

## 📄 License

MIT License - Building meaningful connections with modern technology and cultural sensitivity.

---

**BLONG** - Where emotional design meets technical excellence in the journey of love. 💕