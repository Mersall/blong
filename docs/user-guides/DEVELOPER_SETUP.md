# 🚀 BLONG Matrimonial App - Mandatory Development Rules

## 📋 **CRITICAL: These rules are MANDATORY for every feature implementation**

This document establishes non-negotiable development standards for the BLONG matrimonial app. Every feature, component, and code change must strictly adhere to these rules without exception.

---

## 🔧 **Full-Stack Implementation Requirements**

### **End-to-End Feature Completion**
- ✅ **MANDATORY**: Every feature must be implemented on both frontend (React Native/Expo) and backend (NestJS/Prisma)
- ✅ **MANDATORY**: If a feature exists on one side, implement the missing side to achieve full-stack parity
- ✅ **MANDATORY**: Ensure complete API integration using established IP configuration (`192.168.1.38:3000` for development)
- ✅ **MANDATORY**: All features must work end-to-end with real data flow from mobile app to database

### **API Standards**
- ✅ **MANDATORY**: Follow RESTful conventions with proper HTTP methods (GET, POST, PUT, DELETE)
- ✅ **MANDATORY**: Use correct HTTP status codes (200, 201, 400, 401, 403, 404, 422, 500)
- ✅ **MANDATORY**: Implement comprehensive error handling with user-friendly messages
- ✅ **MANDATORY**: Use Prisma Accelerate database connection for all backend operations
- ✅ **MANDATORY**: Validate requests/responses using DTOs and class-validator
- ✅ **MANDATORY**: Maintain consistent JSON response structure with proper typing

### **Database & Backend**
- ✅ **MANDATORY**: Use the established Prisma Accelerate connection string
- ✅ **MANDATORY**: Follow the existing database schema patterns
- ✅ **MANDATORY**: Implement proper data validation and sanitization
- ✅ **MANDATORY**: Handle database errors gracefully with proper logging

---

## 📁 **Code Organization & Architecture**

### **File Structure Requirements**
- ✅ **MANDATORY**: Every feature must have separate styles file (styles.js or styles folder)
- ✅ **MANDATORY**: Never include styles inline within component files
- ✅ **MANDATORY**: Create index.js file for each feature as main entry point
- ✅ **MANDATORY**: Use codebase-retrieval tool to check for existing reusable components before creating new ones

### **Separation of Concerns**
- ✅ **MANDATORY**: Components (UI logic only)
- ✅ **MANDATORY**: Services (API calls and external integrations)
- ✅ **MANDATORY**: Utils (helper functions and utilities)
- ✅ **MANDATORY**: Hooks (custom React hooks for state logic)
- ✅ **MANDATORY**: Contexts (global state management)

### **Naming Conventions**
- ✅ **MANDATORY**: PascalCase for components (`UserProfile.js`)
- ✅ **MANDATORY**: camelCase for utilities (`formatDate.js`)
- ✅ **MANDATORY**: kebab-case for folders (`user-profile/`)
- ✅ **MANDATORY**: Feature-based folder organization

### **TypeScript Requirements**
- ✅ **MANDATORY**: Use TypeScript interfaces for all data structures
- ✅ **MANDATORY**: Define API contracts with proper typing
- ✅ **MANDATORY**: Avoid 'any' types unless absolutely necessary
- ✅ **MANDATORY**: Implement proper type safety throughout

---

## 🌍 **Internationalization & Accessibility**

### **Localization Requirements**
- ✅ **MANDATORY**: Support all languages: English, Spanish, French, Arabic
- ✅ **MANDATORY**: Add translation keys to i18n system for every user-facing text
- ✅ **MANDATORY**: Implement RTL (Arabic) and LTR support using I18nManager
- ✅ **MANDATORY**: Test UI layouts in both text directions

### **Translation Coverage**
- ✅ **MANDATORY**: Error messages
- ✅ **MANDATORY**: UI labels and buttons
- ✅ **MANDATORY**: Form placeholders and validation messages
- ✅ **MANDATORY**: Success notifications
- ✅ **MANDATORY**: Navigation elements

### **Accessibility Standards**
- ✅ **MANDATORY**: Screen reader support with semantic labels
- ✅ **MANDATORY**: Keyboard navigation support
- ✅ **MANDATORY**: WCAG AAA contrast ratios (7:1 minimum)
- ✅ **MANDATORY**: Proper font rendering for all languages
- ✅ **MANDATORY**: Text scaling support

---

## 🎨 **Design System Compliance**

### **Visual Standards**
- ✅ **MANDATORY**: Follow BLONG's premium, elite, minimal design system
- ✅ **MANDATORY**: Use 8px grid system for spacing
- ✅ **MANDATORY**: Maintain matrimonial app-appropriate aesthetic
- ✅ **MANDATORY**: Implement responsive layouts for all screen sizes
- ✅ **MANDATORY**: Support both portrait and landscape orientations

### **Design Elements**
- ✅ **MANDATORY**: Use established color palette (warm stone system)
- ✅ **MANDATORY**: Follow typography scales and font hierarchy
- ✅ **MANDATORY**: Implement proper elevation and shadows
- ✅ **MANDATORY**: Maintain visual consistency with existing screens
- ✅ **MANDATORY**: Reference `docs/blong_ui_design_system.md` for all design decisions

### **Component Consistency**
- ✅ **MANDATORY**: Use existing design patterns and components
- ✅ **MANDATORY**: Maintain sophisticated, relationship-focused messaging
- ✅ **MANDATORY**: Ensure premium feel with appropriate imagery
- ✅ **MANDATORY**: Create visual hierarchy with proper depth

---

## 👤 **User Experience Standards**

### **Loading & Feedback**
- ✅ **MANDATORY**: Implement loading states for all async operations
- ✅ **MANDATORY**: Show loading indicators for: API calls, data fetching, image loading, navigation
- ✅ **MANDATORY**: Provide contextual error messages with clear actions
- ✅ **MANDATORY**: Display success notifications (3-5 seconds duration)
- ✅ **MANDATORY**: Implement proper notification queuing to avoid fatigue

### **Form Experience**
- ✅ **MANDATORY**: Real-time form validation with helpful error messages
- ✅ **MANDATORY**: Clear success indicators for completed actions
- ✅ **MANDATORY**: Proper keyboard handling and focus management
- ✅ **MANDATORY**: Accessible tab order for all interactive elements

### **Animations & Transitions**
- ✅ **MANDATORY**: Smooth transitions (200-300ms duration)
- ✅ **MANDATORY**: Premium micro-interactions that enhance UX
- ✅ **MANDATORY**: Avoid distracting or excessive animations
- ✅ **MANDATORY**: Ensure animations work on lower-end devices

### **Matrimonial UX Patterns**
- ✅ **MANDATORY**: Clear profile information display
- ✅ **MANDATORY**: Intuitive matching and discovery flows
- ✅ **MANDATORY**: Relationship-appropriate interactions and messaging
- ✅ **MANDATORY**: Privacy-conscious design patterns

---

## ✅ **Code Quality & Completion**

### **Feature Completion**
- ✅ **MANDATORY**: Complete every feature end-to-end with no incomplete functionality
- ✅ **MANDATORY**: Remove all placeholder content, console.log statements, and TODO comments
- ✅ **MANDATORY**: Implement proper error boundaries with fallback UI
- ✅ **MANDATORY**: Ensure graceful degradation for network failures

### **Best Practices**
- ✅ **MANDATORY**: Follow React Native and NestJS best practices
- ✅ **MANDATORY**: Implement proper component lifecycle management
- ✅ **MANDATORY**: Optimize for performance and prevent memory leaks
- ✅ **MANDATORY**: Use established state management patterns (Context API, custom hooks)
- ✅ **MANDATORY**: Avoid prop drilling beyond 2-3 levels

### **Code Documentation**
- ✅ **MANDATORY**: Write maintainable, well-documented code
- ✅ **MANDATORY**: Use consistent naming conventions
- ✅ **MANDATORY**: Add clear comments for complex business logic
- ✅ **MANDATORY**: Maintain proper data flow patterns

---

## 🧪 **Testing & Validation Requirements**

### **Device Testing**
- ✅ **MANDATORY**: Test on physical mobile devices with backend API at `192.168.1.38:3000`
- ✅ **MANDATORY**: Validate API endpoints with Prisma Accelerate database
- ✅ **MANDATORY**: Test in both development and production-like conditions
- ✅ **MANDATORY**: Verify functionality across iOS and Android devices

### **User Flow Testing**
- ✅ **MANDATORY**: Test happy path scenarios
- ✅ **MANDATORY**: Test edge cases and error scenarios
- ✅ **MANDATORY**: Test network failure conditions and offline behavior
- ✅ **MANDATORY**: Validate authentication states and session management

### **Internationalization Testing**
- ✅ **MANDATORY**: Test all supported languages (English, Spanish, French, Arabic)
- ✅ **MANDATORY**: Verify proper text rendering and layout in RTL/LTR
- ✅ **MANDATORY**: Test on different screen sizes and orientations
- ✅ **MANDATORY**: Validate accessibility features with screen readers

---

## 🔒 **Performance & Security**

### **Performance Optimization**
- ✅ **MANDATORY**: Implement data caching strategies (React Query or similar)
- ✅ **MANDATORY**: Minimize unnecessary API calls
- ✅ **MANDATORY**: Optimize images, animations, and data loading
- ✅ **MANDATORY**: Ensure smooth performance on mobile devices

### **Security Standards**
- ✅ **MANDATORY**: Secure handling of user data and authentication tokens (JWT)
- ✅ **MANDATORY**: Implement proper input sanitization and validation
- ✅ **MANDATORY**: Use HTTPS for all API communications
- ✅ **MANDATORY**: Follow OWASP security guidelines
- ✅ **MANDATORY**: Implement rate limiting and request throttling

---

## 📚 **Documentation & Maintenance**

### **Documentation Updates**
- ✅ **MANDATORY**: Update relevant documentation when adding features
- ✅ **MANDATORY**: Maintain clear commit messages (conventional commit format)
- ✅ **MANDATORY**: Document environment variables and configuration changes
- ✅ **MANDATORY**: Keep API documentation updated with new endpoints

### **Design Documentation**
- ✅ **MANDATORY**: Update `docs/blong_ui_design_system.md` for new UI patterns
- ✅ **MANDATORY**: Document any design system extensions or modifications
- ✅ **MANDATORY**: Maintain consistency with established design rules
- ✅ **MANDATORY**: Document breaking changes and migration requirements

---

## ⚠️ **ENFORCEMENT NOTICE**

**These rules are MANDATORY and NON-NEGOTIABLE. Every feature implementation must:**

1. ✅ Be reviewed against this checklist before completion
2. ✅ Meet ALL requirements without exception
3. ✅ Be tested thoroughly on physical devices
4. ✅ Include proper documentation updates
5. ✅ Follow the established design system

**Failure to follow these rules will result in feature rejection and rework requirements.**

---

*Last Updated: 2025-07-30*
*Version: 1.0*
*Project: BLONG Matrimonial App*
