# Backend Architecture Prompt for East Down Yacht Club

## Task: Design and Implement Express.js Backend Server

You are architecting a comprehensive Node.js/Express.js backend API for East Down Yacht Club based on detailed frontend analysis. This backend will serve a React frontend and manage yacht club operations including events, racing, content, and user management.

## Project Context

**Technology Stack:**
- Node.js with Express.js
- PostgreSQL database with existing schema
- Prisma ORM (already configured)
- TypeScript for type safety
- Multer for file uploads
- CORS for frontend integration

**Database Schema (Already Exists):**
- `events` - Racing/social events with types (social, regatta, series)
- `races` - Individual races within events
- `race_results` - Race results and timing
- `series_results` - Series championship standings  
- `stories` - News/content management system
- `yacht_classes` - Boat classes and handicaps
- `event_documents` - PDF attachments for events

**Frontend Requirements Analysis:**
Based on the React frontend analysis, the backend must support:

### Authentication System
- User roles: Administrator, this role does not require authentication it is simply to allow certain users to enter an admin panel
- Protected routes for admin functions

### Event Management System (Complex)
- Event CRUD operations with types: Racing, Training, Social, Cruising, Committee
- Event properties: title, description, date, time, location, category, image URLs
- Boat entry system: boat name, skipper, sail number, class
- Event document uploads: sailing instructions, entry forms, results PDFs
- Results tracking and management
- Recurring event support

### Content Management System  
- Story/News CRUD with types: Club News, Racing, Training, Social, Announcements
- Publishing workflow (draft/published states)
- Author attribution and categorization
- Featured image support
- Content scheduling and management

## Architecture Requirements

### 1. Project Structure
Design a clean, scalable project structure:
```
server/
├── src/
│   ├── controllers/ (Route handlers)
│   ├── middleware/ (Auth, validation, error handling)
│   ├── routes/ (API route definitions)
│   ├── services/ (Business logic)
│   ├── types/ (TypeScript definitions)
│   ├── utils/ (Helper functions)
│   └── app.ts (Express app setup)
├── prisma/ (Already exists with schema)
└── package.json
```

### 2. Core API Endpoints

**Authentication:**
- POST /api/auth/login - User login with credentials
- POST /api/auth/logout - Session termination  
- GET /api/auth/me - Current user profile
- POST /api/auth/refresh - Token refresh

**Events Management:**
- GET /api/events - List events with filtering (type, date, published)
- GET /api/events/:id - Event details with races and entries
- POST /api/events - Create new event (Admin only)
- PUT /api/events/:id - Update event (Admin only)
- DELETE /api/events/:id - Delete event (Admin only)
- POST /api/events/:id/entries - Add boat entry
- DELETE /api/events/:id/entries/:entryId - Remove boat entry

**Content Management:**
- GET /api/stories - List published stories with filtering
- GET /api/stories/:id - Story details
- POST /api/stories - Create story (Admin only)
- PUT /api/stories/:id - Update story (Admin only)  
- DELETE /api/stories/:id - Delete story (Admin only)

**File Upload:**
- POST /api/upload - General file upload
- POST /api/events/:id/documents - Upload event documents
- GET /api/files/:filename - Serve uploaded files

**Race Management:**
- GET /api/events/:id/races - List races for event
- POST /api/events/:id/races - Create race
- GET /api/races/:id/results - Race results
- POST /api/races/:id/results - Submit race results

### 3. Security Implementation
- JWT authentication with proper secret management
- Role-based access control (Admin, Commodore, Member)
- Input validation and sanitization
- File upload security (type/size limits)
- CORS configuration for frontend
- Rate limiting on sensitive endpoints

### 4. Data Validation & Error Handling
- Request validation using Joi or Zod
- Comprehensive error handling middleware
- Consistent error response format
- Logging for debugging and monitoring
- Database transaction management

### 5. Performance & Optimization
- Database query optimization with Prisma
- Pagination for large datasets
- Caching for frequently accessed data
- File storage optimization
- API response compression

## Implementation Guidelines

### 1. Authentication Middleware
Implement JWT-based authentication that:
- Validates tokens on protected routes
- Extracts user information for request context
- Handles token expiration gracefully
- Supports role-based permissions

### 2. Event Management Logic
The event system is complex and requires:
- Event type validation (social, regatta, series)
- Date/time handling for recurring events
- Boat entry management with validation
- Document upload and association
- Results tracking integration

### 3. Content Management
Story/news management needs:
- Draft/published workflow
- SEO-friendly slug generation
- Image handling and optimization
- Tag-based categorization
- Publishing scheduling

### 4. File Upload Strategy
Implement secure file handling:
- Document storage (local or cloud)
- File type validation (PDF, images)
- Size limits and security scanning
- Organized file structure
- Cleanup of orphaned files

### 5. Database Integration
Leverage the existing Prisma schema:
- Efficient queries with proper relations
- Transaction handling for complex operations
- Data validation at database level
- Indexing for performance
- Migration management

## Expected Deliverables

1. **Complete Express.js Server**: Fully functional API server
2. **API Documentation**: Endpoint specifications and examples
3. **Authentication System**: JWT implementation with role management
4. **Database Integration**: Prisma ORM with optimized queries
5. **File Upload System**: Secure document and image handling
6. **Error Handling**: Comprehensive error management
7. **Testing Setup**: Unit and integration test framework
8. **Environment Configuration**: Development and production configs

## Success Criteria

The backend should:
1. ✅ Serve all frontend data requirements
2. ✅ Handle authentication and authorization properly
3. ✅ Manage complex event and race data
4. ✅ Support file uploads securely  
5. ✅ Provide consistent API responses
6. ✅ Handle errors gracefully
7. ✅ Perform efficiently with good query optimization
8. ✅ Be maintainable and well-documented

## Development Commands Context

From the CLAUDE.md file, remember to implement:
- `npm run build` - Production build
- `npm run dev` - Development server  
- `npm test` - Test suite
- `npm run lint` - Code linting
- `npm run typecheck` - TypeScript validation

## Database Context

The PostgreSQL database is already set up with:
- Docker Compose configuration
- Flyway migrations in `/database/migrations/base/`
- Sample data including yacht classes and events
- Optimized indexes for performance

Connect using the existing Prisma schema and ensure your implementation aligns with the database structure.

## Implementation Priority

1. **Phase 1**: Basic Express setup, authentication, and core CRUD operations
2. **Phase 2**: Complex event management and file uploads
3. **Phase 3**: Race results and series calculations
4. **Phase 4**: Advanced features and optimizations

Please implement a production-ready backend that can seamlessly integrate with the existing React frontend and PostgreSQL database.
