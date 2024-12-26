# ProfileSections Component

## Overview
The ProfileSections component is a flexible and customizable component for managing different sections of a user's profile. It provides drag-and-drop functionality, section visibility controls, and section-specific content editing.

## Features
- Drag-and-drop section reordering
- Section visibility toggling
- Section-specific content editing
- Custom section creation
- Real-time validation
- Responsive design

## Installation

```bash
npm install react-beautiful-dnd @types/react-beautiful-dnd
```

## Dependencies
- React
- react-beautiful-dnd
- react-hook-form
- Tailwind CSS

## Basic Usage

```tsx
import { ProfileSections } from '@/components/profile/ProfileSections';

const Profile = () => {
  const handleSave = async (sections) => {
    // Handle saving sections
  };

  return <ProfileSections onSave={handleSave} />;
};
```

## Advanced Usage

```tsx
import { ProfileSections } from '@/components/profile/ProfileSections';

const Profile = () => {
  const handleSave = async (sections) => {
    try {
      // Save sections to backend
      await api.updateProfileSections(sections);
      
      // Show success message
      toast.success('Profile sections updated successfully');
    } catch (error) {
      // Handle error
      toast.error('Failed to update profile sections');
      console.error(error);
    }
  };

  const initialSections = [
    {
      id: 'personal',
      type: 'personal',
      title: 'Personal Information',
      content: {
        fullName: 'John Doe',
        title: 'Software Engineer',
        bio: 'Passionate about web development'
      },
      isVisible: true
    },
    {
      id: 'work',
      type: 'work',
      title: 'Work History',
      content: {
        company: 'Tech Corp',
        position: 'Senior Developer',
        description: 'Leading frontend development'
      },
      isVisible: true
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
      <ProfileSections
        initialSections={initialSections}
        onSave={handleSave}
      />
    </div>
  );
};
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| initialSections | Section[] | No | Pre-configured sections |
| onSave | (sections: Section[]) => Promise<void> | Yes | Save callback |

## Section Types

### Personal Information
- Full Name
- Professional Title
- Bio

### Work History
- Company
- Position
- Description

### Skills & Expertise
- Skills (comma separated)
- Areas of Expertise

### Custom Sections
- Custom Title
- Custom Content

## Styling
The component uses Tailwind CSS for styling. You can customize the appearance by:

1. Overriding default classes
2. Adding custom CSS
3. Modifying the Tailwind config

Example custom styling:

```css
.profile-section {
  @apply border-2 border-blue-500;
}

.section-header {
  @apply bg-blue-50;
}

.section-content {
  @apply p-6;
}
```

## Events

### onSave
Called when sections are updated. Returns a promise that resolves when the save is complete.

```typescript
const handleSave = async (sections: Section[]) => {
  try {
    await api.updateProfileSections(sections);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
```

## Error Handling

The component includes built-in error handling for:
- Invalid section types
- Failed drag-and-drop operations
- Form validation errors
- Save operation failures

Example error handling:

```typescript
const handleSave = async (sections: Section[]) => {
  try {
    await api.updateProfileSections(sections);
    toast.success('Saved successfully');
  } catch (error) {
    if (error instanceof ValidationError) {
      toast.error('Invalid section data');
    } else if (error instanceof NetworkError) {
      toast.error('Network error');
    } else {
      toast.error('Unknown error');
    }
    console.error(error);
  }
};
```

## Best Practices

1. **Validation**
   - Validate section content before saving
   - Implement proper form validation
   - Handle validation errors gracefully

2. **Performance**
   - Implement proper memoization
   - Use optimistic updates
   - Cache section data when appropriate

3. **Accessibility**
   - Maintain proper ARIA attributes
   - Ensure keyboard navigation
   - Provide proper focus management

4. **Security**
   - Validate user input
   - Sanitize HTML content
   - Implement proper access control

## Common Issues

1. **Drag-and-Drop Not Working**
   - Ensure react-beautiful-dnd is properly installed
   - Check for strict mode issues
   - Verify drag handle implementation

2. **Form Reset Issues**
   - Use proper form reset methods
   - Clear form state properly
   - Handle form state updates correctly

3. **Save Operation Failures**
   - Implement proper error handling
   - Add retry mechanisms
   - Show appropriate error messages

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License
MIT License 