# Design System

## Brand Guidelines

### Logo
- **Primary Logo**
  - Full color version
  - Monochrome version
  - Reversed version
  - Minimum size: 32px
  - Clear space: 1x height

- **Logo Variations**
  - Horizontal layout
  - Vertical layout
  - Icon only
  - Wordmark only

### Color Palette

#### Primary Colors
| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| Primary Blue | #2196F3 | 33, 150, 243 | Main brand color |
| Secondary Green | #4CAF50 | 76, 175, 80 | Accent & success |
| Dark Gray | #2E2E2E | 46, 46, 46 | Text & backgrounds |

#### Secondary Colors
| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| Light Gray | #F5F5F5 | 245, 245, 245 | Backgrounds |
| Accent Blue | #1976D2 | 25, 118, 210 | Hover states |
| Accent Green | #388E3C | 56, 142, 60 | Secondary actions |

#### System Colors
| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| Success | #4CAF50 | 76, 175, 80 | Positive actions |
| Warning | #FFC107 | 255, 193, 7 | Alerts |
| Error | #F44336 | 244, 67, 54 | Critical states |
| Info | #2196F3 | 33, 150, 243 | Information |

### Typography

#### Primary Font
- **Montserrat**
  - Weights: 400, 500, 600, 700
  - Use cases:
    - Headers
    - Navigation
    - Buttons
    - Labels

#### Secondary Font
- **Open Sans**
  - Weights: 400, 600
  - Use cases:
    - Body text
    - Paragraphs
    - Lists
    - Captions

#### Font Sizes
| Level | Size | Weight | Line Height |
|-------|------|--------|-------------|
| H1 | 36px | 700 | 1.2 |
| H2 | 28px | 600 | 1.3 |
| H3 | 22px | 600 | 1.4 |
| Body | 16px | 400 | 1.5 |
| Small | 14px | 400 | 1.5 |

## Components

### Buttons

#### Primary Button
- Background: Primary Blue
- Text: White
- Hover: Accent Blue
- Padding: 12px 24px
- Border Radius: 4px

#### Secondary Button
- Border: Primary Blue
- Text: Primary Blue
- Hover: Light Blue background
- Padding: 12px 24px
- Border Radius: 4px

#### Text Button
- Text: Primary Blue
- Hover: Light Blue background
- Padding: 8px 16px
- Border Radius: 4px

### Forms

#### Text Input
- Height: 40px
- Padding: 8px 12px
- Border: 1px solid Light Gray
- Border Radius: 4px
- Focus: Primary Blue

#### Select
- Height: 40px
- Padding: 8px 12px
- Border: 1px solid Light Gray
- Border Radius: 4px
- Dropdown Icon: Dark Gray

#### Checkbox
- Size: 20px
- Border: 2px solid Light Gray
- Checked: Primary Blue
- Border Radius: 4px

### Cards

#### Standard Card
- Background: White
- Border Radius: 8px
- Shadow: 0 2px 4px rgba(0,0,0,0.1)
- Padding: 16px

#### Interactive Card
- Hover: Shadow increase
- Active: Slight scale
- Transition: 0.2s ease

### Navigation

#### Top Navigation
- Height: 64px
- Background: White
- Shadow: 0 2px 4px rgba(0,0,0,0.1)
- Links: Dark Gray

#### Sidebar
- Width: 240px
- Background: White
- Links: Dark Gray
- Active: Primary Blue

## Layout

### Grid System
- Columns: 12
- Gutter: 24px
- Margin: 24px
- Breakpoints:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

### Spacing
| Size | Value | Usage |
|------|-------|-------|
| xs | 4px | Minimal spacing |
| sm | 8px | Tight spacing |
| md | 16px | Standard spacing |
| lg | 24px | Section spacing |
| xl | 32px | Large gaps |

### Container Widths
- Max width: 1200px
- Large: 1024px
- Medium: 768px
- Small: 100%

## Icons

### Icon System
- **Style**: Line icons
- **Size**: 24x24px
- **Stroke**: 2px
- **Corner Radius**: 2px

### Icon Categories
- Navigation
- Actions
- Status
- Social
- File types

## Imagery

### Photography Style
- Clean and modern
- Natural lighting
- Neutral backgrounds
- Professional context

### Illustration Style
- Geometric shapes
- Brand colors
- Consistent line weight
- Simple compositions

## Motion

### Transitions
- Duration: 0.2s
- Easing: ease-in-out
- Properties:
  - opacity
  - transform
  - background-color

### Animations
- Loading: Subtle spin
- Success: Scale and fade
- Error: Shake
- Hover: Smooth scale

## Accessibility

### Color Contrast
- Text: WCAG AA standard
- Interactive elements: WCAG AAA
- Background/foreground: 4.5:1 minimum

### Focus States
- Visible outline
- Color: Primary Blue
- Width: 2px
- Style: Solid

## Design Tokens

### Shadows
```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.1);
--shadow-md: 0 2px 4px rgba(0,0,0,0.1);
--shadow-lg: 0 4px 8px rgba(0,0,0,0.1);
```

### Border Radius
```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 16px;
```

### Z-Index
```css
--z-dropdown: 1000;
--z-sticky: 1020;
--z-modal: 1030;
--z-popover: 1040;
--z-tooltip: 1050;
```

## Resources

### Design Tools
- Figma for UI design
- Adobe CC for assets
- Zeplin for handoff
- InVision for prototypes

### Asset Libraries
- Icon sets
- Photo libraries
- Illustration packs
- UI kit components

## Version Control

### Changelog
| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-01 | Initial release |
| 1.1.0 | TBD | Component updates |
| 2.0.0 | TBD | Major revision |

### Update Process
1. Design review
2. Documentation update
3. Developer handoff
4. Implementation
5. QA testing 