# BLONG MVP: Detailed Architecture & Technology Plan

## 1. Guiding Principles
- **Open-Source First:** Prioritize free, open-source technologies to minimize licensing costs and avoid vendor lock-in.
- **Self-Hosted:** Maintain control and reduce costs by self-hosting core services on virtual private servers.
- **Microservice Architecture:** Ensure scalability and maintainability by building the backend as a collection of independent services.

## 2. Technology Stack
| Category | Recommended Open-Source Technology |
| :--- | :--- |
| **Mobile App (Frontend)** | React Native with Expo |
| **Backend Services** | Node.js with NestJS |
| **Primary Database** | PostgreSQL |
| **Caching & In-Memory Store**| Redis |
| **File/Object Storage** | MinIO (S3-Compatible) |
| **Containerization & Orchestration** | Docker & Kubernetes (using k3s) |
| **API Gateway** | NGINX or Kong (Community Edition) |
| **Identity & Access Management**| Keycloak |
| **Monitoring & Alerting** | Prometheus & Grafana |
| **CI/CD Pipeline** | GitLab CE (Community Edition) |

## 3. Microservice Responsibilities
- **Auth Service:** Manages user registration, login, and session tokens via Keycloak integration.
- **User Service:** The source of truth for all user data (profiles, settings, ID verification status).
- **Relationship Service:** Manages the lifecycle state of a user (Single, Engaged, etc.) and the link between two users in a couple.
- **Singles Service:** Handles all logic for Phase 1: date applications, executing AI matching, managing concierge tasks.
- **Engagement Service:** Handles all logic for Phase 2: checklists, budgets, dream boards, and the region-specific planning tools.
- **Wedding Prep Service:** Handles all logic for Phase 3: guest lists, RSVPs, invitation design, and timeline management.
- **Notification Service:** A centralized service for sending all emails, push notifications, and other alerts.

## 4. Recommended Libraries
- **Backend (NestJS):**
    - **Prisma** or **TypeORM**: For type-safe database interaction.
    - **Jest**: For automated testing.
- **Frontend (React Native):**
    - **React Navigation**: For screen navigation.
    - **Zustand** or **Redux Toolkit**: For global state management.
    - **React Query (TanStack Query)**: For server state management (data fetching, caching).
    - **React Hook Form**: For managing complex forms.
    - **Lottie**: For high-quality animations.
    - **NativeWind**: For utility-first styling with Tailwind CSS.