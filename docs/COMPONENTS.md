# Component Documentation

## UI Components

### Button
```tsx
import { Button } from '../components/ui/Button';

// Primary button
<Button variant="primary">Click me</Button>

// Secondary button
<Button variant="secondary">Cancel</Button>

// Link button
<Button to="/about">About</Button>

// With icon
<Button icon={ArrowRight}>Next</Button>
```

### Card
```tsx
import { Card } from '../components/ui/Card';

// Basic card
<Card>Content</Card>

// With hover effect
<Card hover>Hoverable content</Card>

// With custom className
<Card className="p-8">Custom padding</Card>
```

### Form Fields
```tsx
import { FormField } from '../components/ui/form/FormField';
import { Input } from '../components/ui/form/Input';
import { TextArea } from '../components/ui/form/TextArea';

// Text input
<FormField label="Name" required>
  <Input type="text" />
</FormField>

// Text area
<FormField label="Message">
  <TextArea rows={4} />
</FormField>

// With error
<FormField label="Email" error="Invalid email" touched>
  <Input type="email" error />
</FormField>
```

### Loading States
```tsx
import { Spinner } from '../components/ui/loading/Spinner';
import { LoadingOverlay } from '../components/ui/loading/LoadingOverlay';
import { Skeleton } from '../components/ui/loading/Skeleton';

// Spinner
<Spinner size="md" />

// Loading overlay
<LoadingOverlay isLoading={true}>
  <div>Content</div>
</LoadingOverlay>

// Skeleton
<Skeleton variant="text" width="200px" />
```

## Page Components

### Home
The home page showcases the company's main features and mission:
- Hero section with call-to-action buttons
- Features grid displaying company projects
- Responsive design for all screen sizes

### Blog
Blog system with search and filtering:
- Post previews with images
- Category filtering
- Search functionality
- Pagination

### Contact
Contact form with validation:
- Input validation
- Error handling
- Success feedback
- Loading states

## Context Providers

### ThemeProvider
```tsx
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';

// Usage
function App() {
  return (
    <ThemeProvider>
      <YourComponent />
    </ThemeProvider>
  );
}

// In components
function YourComponent() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}
```

### LoadingProvider
```tsx
import { LoadingProvider, useLoading } from '../contexts/LoadingContext';

// Usage
function App() {
  return (
    <LoadingProvider>
      <YourComponent />
    </LoadingProvider>
  );
}

// In components
function YourComponent() {
  const { isLoading, setLoading } = useLoading();
  return (
    <LoadingOverlay isLoading={isLoading}>
      <div>Content</div>
    </LoadingOverlay>
  );
}
```