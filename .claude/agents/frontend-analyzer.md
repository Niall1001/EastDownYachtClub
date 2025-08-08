# Frontend Analysis Prompt for East Down Yacht Club

## Task: Analyze the East Down Yacht Club React Frontend

You are analyzing a React TypeScript frontend application for East Down Yacht Club. Your goal is to comprehensively understand the current architecture, identify patterns, and document all data requirements for backend API development.

## Project Context

**Technology Stack:**
- React 18.3.1 with TypeScript
- React Router DOM 6.26.2 for routing
- Tailwind CSS 3.4.17 for styling
- Vite 5.2.0 as build tool
- Prisma 6.13.0 for database integration
- Lucide React for icons

**Current Structure:**
```
ui/
├── App.tsx (Main routing component)
├── components/
│   ├── ProtectedRoute.tsx (Auth protection)
│   └── home/ (Homepage components)
├── contexts/
│   └── AuthContext.tsx (Authentication state)
├── layouts/
│   ├── Header.tsx (Navigation)
│   └── Footer.tsx (Footer)
├── pages/
│   ├── HomePage.tsx
│   ├── EventsPage.tsx
│   ├── EventDetailPage.tsx
│   ├── RaceResultsPage.tsx
│   ├── ClubPage.tsx
│   ├── NewsPage.tsx
│   ├── NewsletterPage.tsx
│   ├── JoinPage.tsx
│   ├── LoginPage.tsx
│   └── AdminPage.tsx (Complex admin interface)
└── types/ (TypeScript definitions)
```

## Analysis Requirements

### 1. Authentication & Authorization Analysis
- **Current Auth System**: Examine `AuthContext.tsx` mock authentication
- **User Roles**: Document user roles (Administrator, Commodore, etc.)
- **Protected Routes**: Identify which routes require authentication
- **Session Management**: Analyze localStorage usage and security implications

### 2. Data Models & Types Analysis
- **Event System**: Analyze the comprehensive event management in `AdminPage.tsx`
  - Event types: Racing, Training, Social, Cruising, Committee
  - Event properties: title, description, date, time, location, category, images
  - Boat entries system with skipper/sail number tracking
  - Results tracking and PDF document attachments
- **Story/News System**: Content management features
  - Story types: Club News, Racing, Training, Social, Announcements
  - Publishing workflow and content structure
- **Navigation Structure**: All routes and their purposes

### 3. State Management Patterns
- **Local State**: useState patterns across components
- **Global State**: Context API usage (AuthContext)
- **Data Persistence**: localStorage usage and data storage patterns
- **Form Management**: Complex form handling in AdminPage

### 4. API Requirements Identification
Based on the frontend code, identify:
- **Authentication Endpoints**: Login, logout, session validation
- **Event Management APIs**: CRUD operations for events
- **Story/News APIs**: Content management operations
- **User Management**: Profile and role management
- **File Upload**: Document and image handling
- **Search & Filtering**: Event and content discovery

### 5. UI/UX Patterns Analysis
- **Component Architecture**: Reusable patterns and component hierarchy
- **Styling Approach**: Tailwind CSS usage and design system
- **Responsive Design**: Mobile-first considerations
- **User Experience Flow**: Navigation patterns and user journeys

### 6. Integration Points
- **Database Schema Alignment**: Compare with existing Prisma schema
- **External Services**: Weather widget, sailing instructions, results systems
- **File Storage**: PDF and image handling requirements

## Expected Output

Please provide a detailed analysis report covering:

1. **Executive Summary**: High-level overview of the frontend architecture
2. **Data Model Requirements**: Complete list of entities and their relationships needed for backend API
3. **Authentication Requirements**: Security model and user management needs
4. **API Endpoint Specifications**: Detailed list of required endpoints with request/response formats
5. **Integration Challenges**: Potential issues in connecting frontend to backend
6. **Recommendations**: Suggested improvements or optimizations

## Specific Focus Areas

1. **AdminPage.tsx**: This is the most complex component - analyze its data structures and operations in detail
2. **Event Management**: Understanding the boat entries system and race results tracking
3. **Content Management**: Story/news publishing workflow
4. **File Handling**: Document upload and management requirements

## Database Context

The backend will use the existing PostgreSQL schema with these main tables:
- `events` (social, regatta, series types)
- `races` and `race_results` 
- `stories` (news/content)
- `yacht_classes`
- `series_results`
- `event_documents`

Ensure your analysis aligns with this schema structure.

## Success Criteria

Your analysis should enable a backend architect to:
1. Design comprehensive REST API endpoints
2. Understand all data relationships and business logic
3. Implement proper authentication and authorization
4. Plan file upload and storage strategies
5. Design database operations efficiently

Please be thorough and specific in your analysis, providing code examples and detailed explanations where relevant.