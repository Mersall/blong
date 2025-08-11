# BLONG Premium Loading Components

## Overview

The BLONG Premium Loading Components provide sophisticated, branded loading states that maintain the app's elite design aesthetic. These components feature elegant animations, consistent branding, and multiple variants for different use cases.

## Design Philosophy

- **Premium Aesthetics**: Sophisticated animations and elegant styling
- **Brand Consistency**: BLONG logo integration and color scheme adherence
- **User Experience**: Clear feedback with appropriate messaging
- **Performance**: Optimized animations using native driver
- **Accessibility**: Screen reader friendly with proper semantics

## Components

### 1. PremiumSpinner

Basic animated spinner with optional branding.

#### Props
- `size`: `'small' | 'medium' | 'large'` (default: `'medium'`)
- `color`: String (default: `COLORS.accent`)
- `showBrand`: Boolean (default: `false`)

#### Usage
```javascript
import { PremiumSpinner } from '../../components/loading';

// Basic spinner
<PremiumSpinner />

// Large spinner with branding
<PremiumSpinner size="large" showBrand />

// Custom color
<PremiumSpinner color="#FF6B35" />
```

### 2. PremiumFullScreenLoader

Full-screen overlay loader for major operations.

#### Props
- `visible`: Boolean (default: `false`)
- `message`: String (default: `'Loading...'`)
- `subtitle`: String (optional)
- `showProgress`: Boolean (default: `false`)
- `progress`: Number 0-100 (default: `0`)

#### Usage
```javascript
import { PremiumFullScreenLoader } from '../../components/loading';

<PremiumFullScreenLoader
  visible={isLoading}
  message="Processing your request..."
  subtitle="This may take a few moments"
  showProgress={true}
  progress={uploadProgress}
/>
```

### 3. PremiumInlineLoader

Inline loading state for content areas.

#### Props
- `message`: String (default: `'Loading...'`)
- `size`: `'small' | 'medium' | 'large'` (default: `'medium'`)
- `style`: Object (optional)

#### Usage
```javascript
import { PremiumInlineLoader } from '../../components/loading';

<PremiumInlineLoader 
  message="Loading your dates..."
  size="small"
  style={{ paddingVertical: 20 }}
/>
```

### 4. PremiumLoadingCard

Card-style loader for content sections.

#### Props
- `message`: String (default: `'Loading...'`)
- `subtitle`: String (optional)
- `style`: Object (optional)

#### Usage
```javascript
import { PremiumLoadingCard } from '../../components/loading';

<PremiumLoadingCard 
  message="Loading your dates..."
  subtitle="Curating perfect matches just for you"
  style={{ marginBottom: 20 }}
/>
```

## Design Specifications

### Colors
```javascript
const COLORS = {
  background: '#FFFFFF',
  surface: '#FAFAFA',
  text: '#0A0A0A',
  textSecondary: '#6B6B6B',
  textTertiary: '#9E9E9E',
  accent: '#FF6B35',
  border: '#E0E0E0',
  shadow: '#000000',
};
```

### Typography
- **Brand Text**: 18-28px, weight 300, letter-spacing 4-8px
- **Message Text**: 14-16px, weight 300
- **Subtitle Text**: 12px, color textSecondary

### Animations
- **Rotation**: 2000ms duration, continuous loop
- **Pulse**: 1000ms duration, 0.8-1.0 scale
- **Fade In**: 300ms duration with spring scale
- **Fade Out**: 200ms duration

### Spacing
- **Card Padding**: 32-40px
- **Element Spacing**: 16-24px
- **Brand Spacing**: 24-32px bottom margin

## Implementation Guidelines

### When to Use Each Component

#### PremiumSpinner
- Simple loading indicators
- Button loading states
- Small content areas

#### PremiumFullScreenLoader
- App initialization
- Major data operations
- File uploads/downloads
- Payment processing

#### PremiumInlineLoader
- List pagination
- Content refreshing
- Section loading

#### PremiumLoadingCard
- Initial screen loads
- Empty state transitions
- Featured content loading

### Best Practices

1. **Message Clarity**: Use descriptive, user-friendly messages
2. **Timing**: Show loaders for operations > 500ms
3. **Progress**: Include progress bars for long operations
4. **Branding**: Use brand elements sparingly for impact
5. **Accessibility**: Include proper loading announcements

### Performance Considerations

- All animations use `useNativeDriver: true`
- Components unmount cleanly to prevent memory leaks
- Minimal re-renders with proper dependency arrays
- Optimized for 60fps performance

## Examples

### Screen Loading Pattern
```javascript
const MyScreen = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  if (loading) {
    return (
      <View style={{ flex: 1, paddingHorizontal: 32, paddingTop: 40 }}>
        <PremiumLoadingCard 
          message="Loading your content..."
          subtitle="Please wait while we prepare everything"
        />
      </View>
    );
  }

  return (
    // Your screen content
  );
};
```

### Pagination Loading
```javascript
{loading && items.length > 0 && (
  <PremiumInlineLoader 
    message="Loading more items..."
    size="small"
    style={{ paddingVertical: 20 }}
  />
)}
```

### Full Screen Operation
```javascript
<PremiumFullScreenLoader
  visible={isProcessing}
  message="Processing payment..."
  subtitle="Please do not close the app"
  showProgress={true}
  progress={paymentProgress}
/>
```

## Accessibility

All loading components include:
- Proper semantic roles
- Screen reader announcements
- Keyboard navigation support
- High contrast compatibility
- Reduced motion respect

## Quick Reference

### Import Statement
```javascript
import {
  PremiumSpinner,
  PremiumFullScreenLoader,
  PremiumInlineLoader,
  PremiumLoadingCard
} from '../../components/loading';
```

### Common Patterns
```javascript
// Screen initialization
<PremiumLoadingCard message="Loading..." subtitle="Please wait" />

// Inline content loading
<PremiumInlineLoader message="Loading more..." size="small" />

// Full screen operations
<PremiumFullScreenLoader visible={loading} message="Processing..." />

// Simple spinner
<PremiumSpinner size="medium" showBrand />
```

## Testing

Components are tested for:
- Animation performance
- Memory leak prevention
- Accessibility compliance
- Cross-platform consistency
- Edge case handling
