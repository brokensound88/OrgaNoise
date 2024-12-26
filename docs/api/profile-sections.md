# Profile Sections API Documentation

## Overview
The Profile Sections component provides a flexible and customizable way to manage different sections of a user's profile. It supports drag-and-drop reordering, visibility toggling, and section-specific content editing.

## Component Props

### ProfileSectionsProps
```typescript
interface ProfileSectionsProps {
  initialSections?: Section[];
  onSave: (sections: Section[]) => Promise<void>;
}
```

- `initialSections`: Optional array of pre-configured sections
- `onSave`: Callback function called when sections are updated

### Section Interface
```typescript
interface Section {
  id: string;
  type: 'personal' | 'work' | 'skills' | 'education' | 'custom';
  title: string;
  content: Record<string, unknown>;
  isVisible: boolean;
}
```

## Features

### 1. Section Management
- Add new custom sections
- Reorder sections via drag-and-drop
- Toggle section visibility
- Edit section content
- Save section changes

### 2. Section Types
1. **Personal Information**
   - Full Name
   - Professional Title
   - Bio

2. **Work History**
   - Company
   - Position
   - Description

3. **Skills & Expertise**
   - Skills (comma separated)
   - Areas of Expertise

4. **Custom Sections**
   - Custom Title
   - Custom Content

## Usage Example

```tsx
import { ProfileSections } from '@/components/profile/ProfileSections';

const MyProfile = () => {
  const handleSave = async (sections) => {
    try {
      await api.updateProfileSections(sections);
    } catch (error) {
      console.error('Failed to save sections:', error);
    }
  };

  return (
    <ProfileSections
      initialSections={[
        {
          id: 'personal',
          type: 'personal',
          title: 'Personal Information',
          content: {},
          isVisible: true
        }
      ]}
      onSave={handleSave}
    />
  );
};
```

## Styling
The component uses Tailwind CSS classes for styling. Custom styles can be applied by overriding the following classes:
- `.profile-section`: Individual section container
- `.section-header`: Section title and controls
- `.section-content`: Section content area
- `.section-form`: Section editing form

## Best Practices
1. Always handle errors in the onSave callback
2. Implement proper validation for section content
3. Consider implementing undo/redo functionality
4. Cache section data to prevent loss of changes
5. Implement proper loading states during save operations

## Security Considerations
1. Validate all user input before saving
2. Implement proper access control
3. Sanitize HTML content in custom sections
4. Rate limit save operations
5. Implement CSRF protection

## Performance Tips
1. Implement proper memoization for section rendering
2. Use optimistic updates for better UX
3. Implement proper loading states
4. Cache section data when appropriate
5. Use proper error boundaries 