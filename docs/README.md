# OrgaNoise Website Documentation

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Testing
```bash
# Run unit and integration tests
npm run test

# Run tests with UI
npm run test:ui

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

### Building
```bash
npm run build
```

## Architecture

### Tech Stack
- React 18 with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- React Router for navigation
- Vitest for testing
- Playwright for E2E testing

### Project Structure
```
src/
├── components/     # Reusable UI components
├── contexts/      # React contexts
├── hooks/         # Custom hooks
├── pages/         # Page components
├── test/          # Test utilities and mocks
├── types/         # TypeScript types
└── utils/         # Utility functions
```

### Key Features
- Dark mode support
- Responsive design
- SEO optimization
- Performance optimized
- Comprehensive testing
- Accessibility support

## Component Documentation

### UI Components
- Button
- Card
- Form fields
- Loading states
- Navigation
- Footer

### Page Components
- Home
- About
- Projects
- Blog
- Contact

### Context Providers
- ThemeProvider
- LoadingProvider

## Testing Strategy

### Unit Tests
- Component testing
- Hook testing
- Utility function testing

### Integration Tests
- Form submissions
- Blog functionality
- Navigation flow

### E2E Tests
- User journeys
- Critical paths
- Cross-browser testing

## Performance Optimization

### Implemented Optimizations
- Code splitting
- Lazy loading
- Image optimization
- Bundle size reduction

## Contributing

### Development Workflow
1. Create a feature branch
2. Make changes
3. Write tests
4. Submit PR

### Code Style
- Follow ESLint configuration
- Use TypeScript
- Follow component structure guidelines
- Write tests for new features

## Deployment

### Build Process
1. Run tests
2. Build application
3. Deploy to hosting

### Environment Variables
- Required variables
- Optional configurations
- Development vs Production