# East Down Yacht Club - Developer Instructions

## Project Overview

East Down Yacht Club is a modern React-based website for a prestigious sailing club on Strangford Lough, Northern Ireland. The application serves as the digital hub for club information, events, training programs, and member services.

### Tech Stack
- **Frontend**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.2.0 for fast development and optimized builds
- **Styling**: Tailwind CSS 3.4.17 with custom maritime color palette
- **Routing**: React Router DOM 6.26.2
- **Icons**: Lucide React for consistent iconography
- **Code Quality**: ESLint + TypeScript ESLint

---

## Project Structure

```
EastDownYachtClub/
├── public/                      # Static assets
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── ProtectedRoute.tsx   # Authentication wrapper
│   │   └── home/                # Homepage-specific components
│   │       ├── EventCard.tsx
│   │       ├── HeroSection.tsx
│   │       ├── NewsCard.tsx
│   │       └── WeatherWidget.tsx
│   ├── contexts/                # React context providers
│   │   └── AuthContext.tsx     # Authentication state management
│   ├── layouts/                 # Layout components
│   │   ├── Header.tsx           # Main navigation header
│   │   └── Footer.tsx           # Site footer
│   ├── pages/                   # Page components/routes
│   │   ├── HomePage.tsx         # Landing page
│   │   ├── EventsPage.tsx       # Events & racing calendar
│   │   ├── EventDetailPage.tsx  # Individual event details
│   │   ├── ClubPage.tsx         # Club information & history
│   │   ├── NewsPage.tsx         # News & announcements
│   │   ├── NewsletterPage.tsx   # Newsletter archive
│   │   ├── JoinPage.tsx         # Membership information
│   │   ├── LoginPage.tsx        # Authentication
│   │   └── AdminPage.tsx        # Content management (protected)
│   ├── App.tsx                  # Main application component
│   ├── index.tsx                # Application entry point
│   └── index.css                # Global styles and Tailwind imports
├── package.json                 # Dependencies and scripts
├── vite.config.ts               # Vite configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── postcss.config.js            # PostCSS configuration
```

---

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Git

### Installation & Setup

1. **Clone and install:**
   ```bash
   git clone <repository-url>
   cd EastDownYachtClub
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   Application runs at `http://localhost:5173`

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

5. **Lint code:**
   ```bash
   npm run lint
   ```

---

## Development Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production (outputs to `dist/`) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality checks |

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
```

---

## Architecture & Code Organization

### Component Structure

#### 1. Pages (`src/pages/`)
- Each page represents a route in the application
- Contains page-specific logic and layout
- Should be kept lean, delegating complex logic to custom hooks or contexts

#### 2. Layouts (`src/layouts/`)
- Reusable layout components (Header, Footer)
- Shared across multiple pages
- Handle navigation and common UI elements

#### 3. Components (`src/components/`)
- Reusable UI components
- Organized by feature/domain when applicable
- Should be as generic and reusable as possible

#### 4. Contexts (`src/contexts/`)
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

#### Tailwind CSS Configuration
- Custom maritime color palette defined in `tailwind.config.js`
- Premium components defined in `index.css`
- Responsive design with mobile-first approach

#### Color Palette
```javascript
// Primary colors
maritime: {
  'midnight': '#0B1426',
  'deep-navy': '#1E3A5F', 
  'admiral': '#2C5282',
  'royal': '#3182CE',
  'regatta': '#4299E1',
  'gold': {
    500: '#D69E2E',
    // ... full scale available
  }
}
```

#### Styling Best Practices
- Use Tailwind utility classes first
- Create reusable component classes in `index.css` for complex patterns
- Follow mobile-first responsive design
- Use semantic color names from the maritime palette
- Leverage custom animations and shadows from the config

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
    "test:e2e": "playwright test",
    "storybook": "storybook dev -p 6006"
  }
}
```

---

## Authentication System

### Current Implementation
- Mock authentication using localStorage
- Two test accounts:
  - `admin` / `yacht123` (Administrator)
  - `commodore` / `sailing456` (Commodore)

### Auth Flow
1. Login via `/login` page
2. Credentials validated against mock database
3. User data stored in localStorage
4. Protected routes use `ProtectedRoute` component
5. Logout clears localStorage and redirects

### Extending Authentication
- Replace mock system with real API integration
- Consider JWT tokens for production
- Add role-based permissions
- Implement password reset functionality

---

## Content Management

### Current CMS
- Admin panel at `/admin` (protected route)
- Mock data for stories and events
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
}
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
   - Implement next/image equivalent
   - Add lazy loading for images
   - Use WebP format where supported

2. **Bundle Optimization:**
   - Analyze bundle size with `vite-bundle-analyzer`
   - Implement dynamic imports for large components
   - Consider service worker for caching

3. **Performance Monitoring:**
   - Add Core Web Vitals tracking
   - Implement error boundaries
   - Add performance monitoring (Sentry, LogRocket)

---

## SEO & Accessibility

### Current State
- Basic semantic HTML structure
- Responsive design implementation
- Missing: meta tags, alt text, ARIA labels

### Recommended Improvements
1. **SEO:**
   - Add React Helmet for meta tags
   - Implement structured data (JSON-LD)
   - Add sitemap generation
   - Optimize for Core Web Vitals

2. **Accessibility:**
   - Add ARIA labels and roles
   - Implement keyboard navigation
   - Ensure color contrast compliance
   - Add screen reader support

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

### Code Style Guidelines
1. **TypeScript:**
   - Use explicit types for props and state
   - Prefer interfaces over types for objects
   - Enable strict mode in tsconfig.json

2. **React:**
   - Use functional components with hooks
   - Prefer composition over inheritance
   - Extract custom hooks for reusable logic

3. **File Naming:**
   - PascalCase for components (`EventCard.tsx`)
   - camelCase for utilities and hooks
   - kebab-case for assets and static files

### Git Workflow
1. **Branch Naming:**
   - `feature/component-name`
   - `fix/bug-description`
   - `docs/update-readme`

2. **Commit Messages:**
   - Use conventional commits format
   - Example: `feat: add event filtering functionality`

---

## Environment Setup

### VS Code Extensions (Recommended)
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### VS Code Settings
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  }
}
```

---

## API Integration (Future)

### Recommended Architecture
1. **API Client Setup:**
   ```bash
   npm install axios react-query
   ```

2. **Service Layer:**
   Create `src/services/` directory for API calls
   ```typescript
   // src/services/events.ts
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

4. **Hot Reload Issues:**
   ```bash
   # Restart development server
   npm run dev
   ```

### Debug Tools
- React Developer Tools browser extension
- Vite's built-in debugging features
- TypeScript error reporting in VS Code

---

## Contributing Guidelines

### Before Starting Development
1. Review this documentation
2. Check existing issues and PRs
3. Set up development environment
4. Run tests and linting locally

### Code Review Process
1. Create feature branch from main
2. Implement changes with tests
3. Ensure all lints and tests pass
4. Create detailed pull request
5. Address review feedback
6. Merge after approval

### Quality Standards
- All new components must have TypeScript types
- Responsive design for all viewport sizes
- Accessibility compliance (WCAG 2.1 AA)
- Performance budget: < 3s load time
- Code coverage: > 80% for new features

---

This documentation should be kept up-to-date as the project evolves. For questions or clarifications, refer to the project's issue tracker or contact the development team.
