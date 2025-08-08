# East Down Yacht Club - Complete Developer Instructions

## Project Overview

East Down Yacht Club is a modern full-stack web application serving a prestigious sailing club on Strangford Lough, Northern Ireland. The project consists of a React frontend with TypeScript, a backend API server, and a PostgreSQL database with Prisma ORM.

### Architecture Overview
- **Frontend**: React 18.3.1 with TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js with Express (planned), Prisma ORM
- **Database**: PostgreSQL with migration-based schema management
- **Deployment**: Docker-compose for local development

---

## Project Structure

```
EastDownYachtClub/
├── .claude/                     # Claude AI instructions & agents
│   ├── agents/                  # Specialized agents for different tasks
│   └── instructions.md          # This file
├── database/                    # Database management
│   ├── base/                    # Base schema migrations
│   ├── local-data-seed/         # Development seed data scripts
│   └── instructions.md          # Database-specific instructions
├── server/                      # Backend API server
│   ├── prisma/                  # Prisma ORM configuration
│   │   └── schema.prisma        # Auto-generated schema (DO NOT EDIT)
│   └── .env.local              # Environment variables
├── ui/                         # Frontend React application
│   ├── components/             # Reusable UI components
│   ├── contexts/               # React context providers
│   ├── layouts/                # Layout components (Header, Footer)
│   ├── pages/                  # Page components/routes
│   ├── App.tsx                 # Main application component
│   └── index.tsx               # Application entry point
├── dist/                       # Production build output
├── package.json                # Dependencies and scripts
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Project documentation
```

---

## Getting Started

### Prerequisites
- **Node.js** 18+ (LTS recommended)
- **npm** or **yarn** package manager
- **Docker** and **Docker Compose** (for database)
- **Git** for version control

### Quick Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd EastDownYachtClub
   npm install
   ```

2. **Start the database:**
   ```bash
   docker compose up -d
   ```

3. **Set up database schema:**
   ```bash
   cd server
   npx prisma db pull
   npx prisma generate
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```
   Application runs at `http://localhost:5173`

---

## Development Commands

### Essential Commands
| Command | Purpose |
|---------|---------|
| `npm run dev` | Start frontend development server with hot reload |
| `npm run build` | Build for production (outputs to `dist/`) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality checks |

### Database Commands (from server/ directory)
| Command | Purpose |
|---------|---------|
| `npx prisma db pull` | Pull latest schema from database |
| `npx prisma generate` | Generate Prisma client |
| `npx prisma studio` | Open Prisma Studio GUI |
| `npx prisma migrate dev` | Apply migrations in development |

### Docker Commands
| Command | Purpose |
|---------|---------|
| `docker compose up -d` | Start database in background |
| `docker compose down` | Stop all services |
| `docker compose down -v` | Stop services and remove volumes |
| `docker volume prune -f` | Clean up Docker volumes |

---

## Database Schema Management

### Migration Naming Convention

**Base Schema Migrations** (`database/base/`):
- Format: `V{major}.{minor}.{patch}__{description}.sql`
- Examples:
  ```
  V1.0.0__initial_schema.sql
  V1.0.1__add_user_table.sql
  V1.0.2__alter_events_table_add_category_column.sql
  V1.1.0__add_race_results_tables.sql
  V1.1.1__alter_boat_entries_add_sail_number.sql
  V1.2.0__add_user_authentication_tables.sql
  V1.2.1__alter_users_table_add_role_column.sql
  V2.0.0__major_schema_restructure.sql
  ```

**Local Development Seed Data** (`database/local-data-seed/`):
- Format: `V{major}.{minor}.{patch}__{description}_seed.sql`
- Examples:
  ```
  V1.0.0__initial_test_data_seed.sql
  V1.0.1__add_sample_events_seed.sql
  V1.1.0__add_sample_race_results_seed.sql
  V1.2.0__add_test_users_seed.sql
  ```

### Database Schema Change Workflow

**Follow these steps for any database schema change (add, modify, or remove columns/tables/relations):**

1. **Plan your change:**
   - Decide what you need to add, remove, or modify in the database (e.g., new table, column, relation, index).
   - Review the current `prisma/schema.prisma` and existing migration scripts for context.

2. **Create a migration script:**
   - In `database/base/`, create a new SQL file using the naming convention above
   - Write the SQL statements to apply your change (e.g., `ALTER TABLE`, `CREATE TABLE`, `DROP COLUMN`)
   - If you need to seed or update data, add those statements as well
   - **Never edit old migration scripts.** Always add a new one.

3. **DO NOT MANUALLY UPDATE `prisma/schema.prisma`** for schema changes. Instead, use the following step to ensure you allow Prisma to update the schema by running their specific commands.

4. **Apply the migration locally:**
   - Run the migration against your local DB:
     ```bash
     docker compose down -v
     docker volume prune -f
     docker compose up --build -d
     ```
   - **Verify the DB structure is correct after migration.**

5. **Regenerate the Prisma client:**
   - After updating the schema, always run:
     ```bash
     cd server
     npx prisma db pull
     npx prisma generate
     ```
   - This ensures your code uses the latest DB types and models.
   - **NEVER MANUALLY UPDATE** the `prisma/schema.prisma` file. Always use the Prisma CLI commands to pull the latest schema from the database

6. **Update code and tests:**
   - Update services, controllers, mappers, and interfaces to use the new/changed DB fields.
   - Add or update tests to cover the new DB logic.
   - Update test data in `database/local-data-seed/` if needed.

7. **Validate everything:**
   - Run all tests: `npm run test` (when implemented)
   - Lint and format: `npm run lint`
   - Start the server and frontend: `npm run dev`
   - Make sure there are no errors and all functionality works.

### Migration Script Examples

**Base Schema Migration Example:**
```sql
-- V1.1.5__add_membership_tables.sql

-- Create membership types table
CREATE TABLE membership_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    annual_fee DECIMAL(10,2) NOT NULL,
    benefits JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create members table
CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    membership_type_id INTEGER REFERENCES membership_types(id),
    member_number VARCHAR(20) UNIQUE,
    join_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    emergency_contact JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_members_user_id ON members(user_id);
CREATE INDEX idx_members_membership_type ON members(membership_type_id);
CREATE INDEX idx_members_status ON members(status);
```

**Seed Data Example:**
```sql
-- V1.1.5__add_sample_membership_data_seed.sql

-- Insert membership types
INSERT INTO membership_types (name, description, annual_fee, benefits) VALUES
('Full Member', 'Complete access to all club facilities and activities', 450.00, '{"marina": true, "racing": true, "training": true, "events": true}'),
('Associate Member', 'Limited access to club facilities', 250.00, '{"marina": false, "racing": true, "training": true, "events": true}'),
('Junior Member', 'Membership for sailors under 18', 150.00, '{"marina": true, "racing": true, "training": true, "events": true}'),
('Honorary Member', 'Special recognition membership', 0.00, '{"marina": true, "racing": true, "training": false, "events": true}');

-- Insert sample members (assuming users already exist)
INSERT INTO members (user_id, membership_type_id, member_number, join_date, status) VALUES
(1, 1, 'EDYC001', '2020-01-15', 'active'),
(2, 1, 'EDYC002', '2019-03-22', 'active'),
(3, 2, 'EDYC003', '2021-06-10', 'active'),
(4, 3, 'EDYC004', '2022-04-05', 'active');
```

---

## Frontend Development

### Component Architecture

#### Pages (`ui/pages/`)
- Each page represents a route in the application
- Contains page-specific logic and layout
- Should be kept lean, delegating complex logic to custom hooks or contexts

#### Components (`ui/components/`)
- Reusable UI components
- Organized by feature/domain when applicable
- Should be as generic and reusable as possible

#### Layouts (`ui/layouts/`)
- Reusable layout components (Header, Footer)
- Shared across multiple pages
- Handle navigation and common UI elements

#### Contexts (`ui/contexts/`)
- React context providers for global state
- Currently includes AuthContext for authentication
- Add new contexts for shared application state

### State Management

#### Current Approach
- **Local State**: React useState for component-specific state
- **Global State**: React Context (AuthContext)
- **Authentication**: Mock authentication system with localStorage persistence

#### Best Practices
- Use local state for component-specific data
- Use Context for truly global state (user auth, theme, etc.)
- Consider React Query for server state management
- Avoid prop drilling - use Context or composition patterns

### Styling Guidelines

#### Tailwind CSS
- Use utility-first approach with Tailwind classes
- Custom maritime color palette defined in `tailwind.config.js`
- Responsive design with mobile-first approach

#### Color Palette
```javascript
maritime: {
  'midnight': '#0B1426',
  'deep-navy': '#1E3A5F',
  'admiral': '#2C5282',
  'royal': '#3182CE',
  'regatta': '#4299E1',
  'gold': { /* gradient from 50-900 */ },
  'slate': { /* gradient from 50-900 */ },
  'mist': '#F8FAFC'
}
```

### Code Style Guidelines

#### TypeScript
- Use explicit types for props and state
- Prefer interfaces over types for objects
- Enable strict mode in tsconfig.json

#### React
- Use functional components with hooks
- Prefer composition over inheritance
- Extract custom hooks for reusable logic

#### File Naming
- PascalCase for components (`EventCard.tsx`)
- camelCase for utilities and hooks
- kebab-case for assets and static files

---

## Testing Strategy

### Current State
- No testing framework currently implemented
- Recommend adding testing before further development

### Recommended Testing Setup

1. **Unit Testing:**
   ```bash
   npm install -D vitest @testing-library/react @testing-library/jest-dom
   ```

2. **E2E Testing:**
   ```bash
   npm install -D playwright
   ```

3. **Component Testing:**
   ```bash
   npm install -D @storybook/react-vite
   ```

### Testing Commands (To Be Added)
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "storybook": "storybook dev -p 6006"
  }
}
```

---

## Content Management

### Current CMS
- Admin panel at `/admin` (protected route)
- Mock data for stories and events stored in localStorage
- CRUD operations for content

### Data Models

#### Story Interface
```typescript
interface Story {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  date: string;
  image: string;
}
```

#### Event Interface
```typescript
interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  dateObj: Date | null;
  time: string;
  location: string;
  category: string;
  image: string;
  hasResults: boolean;
  resultsUrl?: string;
  isRecurring: boolean;
  noticeOfRacePdf?: string;
  sailingInstructionsPdf?: string;
  boatEntries: BoatEntry[];
}
```

### Authentication System

#### Current Implementation
- Mock authentication using localStorage
- Two test accounts:
  - `admin` / `yacht123` (Administrator)
  - `commodore` / `sailing456` (Commodore)

#### Auth Flow
1. Login via `/login` page
2. Credentials validated against mock database
3. User data stored in localStorage
4. Protected routes use `ProtectedRoute` component
5. Logout clears localStorage and redirects

---

## Adding Dependencies

### Installing New Packages

**For runtime dependencies:**
```bash
npm install <package-name>
```

**For development dependencies:**
```bash
npm install -D <package-name>
```

### Common Package Categories

1. **UI/Styling Libraries:**
   - Already using: Tailwind CSS, Lucide React
   - Consider: Framer Motion (animations), Headless UI

2. **Data Management:**
   - Consider: React Query/TanStack Query, Zustand, Redux Toolkit

3. **Form Handling:**
   - Consider: React Hook Form, Formik, Yup (validation)

4. **Utilities:**
   - Consider: date-fns, lodash, clsx

### Updating Dependencies

```bash
# Check outdated packages
npm outdated

# Update all dependencies
npm update

# Update specific package
npm install <package-name>@latest

# Security audit
npm audit
npm audit fix
```

---

## Performance Optimization

### Current Optimizations
- Vite for fast builds and HMR
- Code splitting with React Router
- Optimized images using Unsplash CDN
- Tailwind CSS purging in production

### Recommended Improvements

1. **Image Optimization:**
   - Implement lazy loading for images
   - Use WebP format where supported
   - Add responsive image sizing

2. **Bundle Optimization:**
   - Analyze bundle size with `vite-bundle-analyzer`
   - Implement dynamic imports for large components
   - Consider service worker for caching

3. **Performance Monitoring:**
   - Add Core Web Vitals tracking
   - Implement error boundaries
   - Add performance monitoring (Sentry, LogRocket)

---

## Deployment

### Production Build
```bash
npm run build
```
Outputs optimized files to `dist/` directory.

### Deployment Options

1. **Static Hosting:**
   - Netlify, Vercel, GitHub Pages
   - Configure build command: `npm run build`
   - Configure publish directory: `dist`

2. **CDN Distribution:**
   - AWS CloudFront + S3
   - Configure proper cache headers
   - Set up redirect rules for SPA routing

### Environment Variables
Create `.env.local` for local development:
```env
VITE_API_URL=http://localhost:3000
VITE_APP_ENV=development
```

---

## Code Quality & Standards

### ESLint Configuration
- TypeScript ESLint rules enabled
- React hooks rules configured
- Strict mode enabled in tsconfig.json

### Git Workflow

1. **Branch Naming:**
   - `feature/component-name`
   - `fix/bug-description`
   - `docs/update-readme`

2. **Commit Messages:**
   - Use conventional commits format
   - Examples:
     - `feat: add event filtering functionality`
     - `fix: resolve mobile navigation issue`
     - `docs: update deployment instructions`

---

## API Integration (Future)

### Recommended Architecture

1. **API Client Setup:**
   ```bash
   npm install axios react-query
   ```

2. **Service Layer:**
   Create `ui/services/` directory for API calls
   ```typescript
   // ui/services/events.ts
   export const eventsService = {
     getEvents: () => api.get('/events'),
     getEvent: (id: string) => api.get(`/events/${id}`),
     createEvent: (event: Event) => api.post('/events', event)
   };
   ```

3. **React Query Integration:**
   ```typescript
   // Custom hooks for data fetching
   export const useEvents = () => {
     return useQuery(['events'], eventsService.getEvents);
   };
   ```

---

## Security Considerations

### Current Security
- Basic XSS protection via React
- Input sanitization in forms
- Protected routes for admin functionality

### Production Security Checklist
1. **Content Security Policy (CSP)**
2. **HTTPS enforcement**
3. **Input validation and sanitization**
4. **Rate limiting for API endpoints**
5. **Dependency vulnerability scanning**
6. **Secure authentication implementation**

---

## Monitoring & Analytics

### Recommended Tools

1. **Error Monitoring:**
   - Sentry for error tracking
   - LogRocket for session replay

2. **Analytics:**
   - Google Analytics 4
   - Plausible (privacy-focused alternative)

3. **Performance:**
   - Web Vitals library
   - Lighthouse CI for automated audits

---

## Maintenance & Updates

### Regular Maintenance Tasks

1. **Weekly:**
   - Check for dependency updates
   - Review and merge dependency PRs
   - Monitor application performance

2. **Monthly:**
   - Security audit of dependencies
   - Performance audit with Lighthouse
   - Backup and version control cleanup

3. **Quarterly:**
   - Major dependency updates
   - Architecture review and refactoring
   - User feedback analysis and implementation

### Upgrade Strategy

1. **Dependencies:**
   - Pin major versions in package.json
   - Test updates in staging environment
   - Use `npm audit` for security updates

2. **Framework Updates:**
   - Follow React and Vite release notes
   - Migrate incrementally
   - Maintain backward compatibility

---

## Troubleshooting

### Common Issues

1. **Build Failures:**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **TypeScript Errors:**
   ```bash
   # Clear TypeScript cache
   npx tsc --build --clean
   ```

3. **Tailwind Styles Not Loading:**
   - Verify imports in `index.css`
   - Check Tailwind config file
   - Ensure PostCSS is configured

4. **Database Connection Issues:**
   ```bash
   # Restart Docker containers
   docker compose down -v
   docker compose up -d
   ```

5. **Hot Reload Issues:**
   ```bash
   # Restart development server
   npm run dev
   ```

### Debug Tools
- React Developer Tools browser extension
- Vite's built-in debugging features
- TypeScript error reporting in VS Code
- Prisma Studio for database inspection

---

## Resources & Documentation

### Official Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)

### Internal Documentation
- `/README.md` - Project overview and quick start
- `/database/instructions.md` - Database-specific instructions
- `/ui/CLAUDE.md` - Frontend-specific instructions

---

## Conclusion

This comprehensive guide provides the foundation for maintaining and extending the East Down Yacht Club application. The project emphasizes:

- **Clean Architecture**: Well-organized code structure with clear separation of concerns
- **Type Safety**: Full TypeScript coverage for maintainable, error-free code
- **Database-First Development**: Migration-based schema management with Prisma
- **Modern Development Experience**: Fast builds, hot reload, and excellent developer tools
- **Scalable Foundation**: Ready for growth with proper patterns and practices

For questions or clarifications, refer to the individual documentation files or the development team.
