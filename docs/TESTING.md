# Testing Documentation

## Overview
The project uses a comprehensive testing strategy:
- Unit tests with Vitest
- Integration tests with Testing Library
- E2E tests with Playwright
- Mock service worker for API mocking

## Running Tests

```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## Test Structure

### Unit Tests
Located next to the components they test:
```
src/
  components/
    Button/
      Button.tsx
      Button.test.tsx
```

### Integration Tests
Located in `src/integration/`:
- Test complex interactions
- Test component combinations
- Test data flow

### E2E Tests
Located in `e2e/`:
- Test critical user paths
- Cross-browser testing
- Full user journeys

## Testing Utilities

### Test Providers
```tsx
import { render } from '../utils/test-utils';

// Renders component with all providers
render(<YourComponent />);
```

### Mock Utilities
```tsx
// Mock fetch
import { setupFetchMock } from '../test/utils/mockFetch';
setupFetchMock({ data: 'response' });

// Mock storage
import { setupStorageMock } from '../test/utils/mockStorage';
setupStorageMock();
```

### Custom Queries
```tsx
import { getByTestIdPartial } from '../test/utils/customQueries';

// Find elements by partial test ID
const element = getByTestIdPartial(container, 'partial-id');
```

## Best Practices

### Writing Tests
1. Follow AAA pattern (Arrange, Act, Assert)
2. Test component behavior, not implementation
3. Use meaningful test descriptions
4. Keep tests focused and isolated

### Mocking
1. Mock external dependencies
2. Use MSW for API mocking
3. Provide realistic test data
4. Clean up mocks after tests

### Coverage
- Maintain high test coverage
- Focus on critical paths
- Test edge cases
- Test error states