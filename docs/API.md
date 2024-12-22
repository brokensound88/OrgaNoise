# API Documentation

## Hooks

### `useForm`
Form state management hook.
```tsx
const { values, errors, handleSubmit } = useForm({
  initialValues,
  validate: (values) => ({ /* validation logic */ }),
  onSubmit: async (values) => { /* submit logic */ }
});
```

### `useBlogSearch`
Blog post search and filtering.
```tsx
const results = useBlogSearch(posts, searchQuery);
```

### `useDynamicTitle`
Page title management.
```tsx
useDynamicTitle('Page Title');
```

## Utilities

### Validation
```tsx
import { validateEmail, validateRequired } from '../utils/validation';

validateEmail('user@example.com'); // true/false
validateRequired('value'); // true/false
```

### SEO
```tsx
import { generatePageMetadata } from '../utils/seo';

const metadata = generatePageMetadata('Title', 'Description', {
  keywords: ['key1', 'key2']
});
```