# East Down Yacht Club API Documentation

## Overview

This document provides comprehensive information about the East Down Yacht Club API, a RESTful service that manages yacht club operations including events, races, stories, and file uploads. All endpoints are publicly accessible without authentication.

## Features

- **Complete API Documentation**: Comprehensive Swagger/OpenAPI 3.0 documentation for all endpoints
- **Event Management**: Create, read, update, and delete events with boat entries
- **Race Management**: Manage races and race results with detailed scoring
- **Story Management**: News and story publishing system
- **File Upload**: Secure file upload for images and documents
- **Database Integration**: PostgreSQL with Prisma ORM
- **Input Validation**: Comprehensive request validation using Joi
- **Security**: Rate limiting, CORS, helmet security headers
- **Logging**: Structured logging with Winston

## API Documentation Access

### Swagger UI (Interactive Documentation)

When running in development mode, you can access the interactive API documentation at:

```
http://localhost:3001/api-docs
```

This provides:
- **Interactive Testing**: Test API endpoints directly from the documentation
- **Request/Response Examples**: See example requests and responses for each endpoint
- **Schema Validation**: Understand data structures and validation requirements

### OpenAPI JSON Specification

The raw OpenAPI specification is available at:

```
http://localhost:3001/api-docs.json
```

## Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database and JWT configurations

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

The API server will start on `http://localhost:3001` and Swagger UI will be available at `http://localhost:3001/api-docs`.

## API Endpoints Overview


### Events (`/api/events`)
- `GET /api/events` - List events with filtering and pagination
- `GET /api/events/{id}` - Get event details
- `POST /api/events` - Create new event
- `PUT /api/events/{id}` - Update event
- `DELETE /api/events/{id}` - Delete event
- `POST /api/events/{id}/entries` - Add boat entry to event
- `DELETE /api/events/{id}/entries/{entryId}` - Remove boat entry

### Stories (`/api/stories`)
- `GET /api/stories` - List published stories with filtering
- `GET /api/stories/{id}` - Get story details
- `POST /api/stories` - Create new story
- `PUT /api/stories/{id}` - Update story
- `DELETE /api/stories/{id}` - Delete story

### Races (`/api/races`)
- `GET /api/races/events/{eventId}` - List races for event
- `POST /api/races/events/{eventId}` - Create race
- `GET /api/races/{id}/results` - Get race results
- `POST /api/races/{id}/results` - Submit race results

### File Upload (`/api/upload`)
- `POST /api/upload` - Upload general file
- `POST /api/upload/events/{id}/documents` - Upload event document
- `GET /api/upload/files/{filename}` - Serve uploaded files

### System (`/health`)
- `GET /health` - Health check endpoint

## Public Access

All API endpoints are publicly accessible and do not require authentication. This allows for open access to yacht club information including events, stories, race results, and file uploads.

## Request/Response Format

### Standard Response Structure

All API responses follow a consistent format:

```json
{
  "success": boolean,
  "data": any,           // Present on successful requests
  "message": string,     // Optional success message
  "error": string        // Present on failed requests
}
```

### Paginated Responses

List endpoints support pagination:

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### Query Parameters

Common query parameters supported across list endpoints:

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `search` - Search term
- `startDate` - Filter by start date (ISO 8601)
- `endDate` - Filter by end date (ISO 8601)
- `type` - Filter by type/category
- `published` - Filter by published status (boolean)

## Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `413` - Request Entity Too Large (file too large)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

### Error Response Example

```json
{
  "success": false,
  "error": "Validation error: title is required"
}
```

## Data Models

### Event Types
- `social` - Social events
- `regatta` - Racing regattas
- `series` - Race series
- `racing` - General racing events
- `training` - Training sessions
- `cruising` - Cruising events
- `committee` - Committee meetings

### Story Types
- `news` - General news
- `racing` - Racing reports
- `training` - Training updates
- `social` - Social event coverage
- `announcements` - Official announcements

### Race Result Flags
- `disqualified` - Boat was disqualified
- `dns` - Did Not Start
- `dnf` - Did Not Finish
- `retired` - Retired from race

## File Upload

### Supported File Types

**Images**: JPG, PNG, GIF, WebP (max 10MB)
**Documents**: PDF, DOC, DOCX (max 10MB)

### Upload Process

1. Use `multipart/form-data` content type
2. Include file in the `file` field (or `document` for event documents)
3. Server returns file URL for future reference

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for frontend origin
- **Helmet**: Security headers applied
- **Input Validation**: All inputs validated using Joi schemas
- **File Validation**: File type and size validation
- **SQL Injection Protection**: Prisma ORM prevents SQL injection
- **XSS Protection**: Headers and validation prevent XSS attacks

## Development

### Database Schema

The API uses PostgreSQL with the following main tables:
- `events` - Event information
- `stories` - News and story content
- `races` - Race information
- `race_results` - Individual race results
- `series_results` - Series standings
- `yacht_classes` - Yacht class definitions
- `event_documents` - Event-related documents

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/yacht_club

# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

### Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Run linting
npm run lint

# Check types
npm run typecheck

# Database operations
npx prisma generate      # Generate Prisma client
npx prisma migrate dev   # Run migrations
npx prisma studio        # Open database GUI
```

## Production Deployment

### Build and Deploy

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Considerations

- Set `NODE_ENV=production` to disable Swagger UI in production
- Use environment variables for all sensitive configuration
- Set up proper database connection pooling
- Configure reverse proxy (nginx) for static file serving
- Set up SSL/HTTPS termination
- Configure monitoring and logging

### Health Check

Use the `/health` endpoint for load balancer health checks:

```bash
curl http://localhost:3001/health
```

## API Versioning

The current API version is v1. Future versions will be available at `/api/v2`, etc.

## Support and Contact

For API support or questions, please contact the development team or refer to the interactive documentation at `/api-docs` for detailed examples and testing capabilities.

## Contributing

When adding new endpoints:

1. Add comprehensive Swagger documentation comments
2. Include request/response examples
3. Define proper error responses
4. Add input validation schemas
5. Update this documentation

## License

This API is part of the East Down Yacht Club management system and is licensed under MIT License.