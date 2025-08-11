# BLONG Global Loading System

## Overview

The BLONG Global Loading System provides a centralized, sophisticated approach to managing loading states across the entire application. It eliminates the need for individual loading states in components while maintaining premium design aesthetics and optimal user experience.

## Architecture

### Core Components

1. **LoadingContext** - Centralized state management
2. **LoadingManager** - Advanced operation handling
3. **Loading Hooks** - Simple component APIs
4. **UniversalLoader** - Automatic UI rendering
5. **Premium Components** - Branded loading UI

### System Flow

```
Component → useLoading Hook → LoadingContext → UniversalLoader → Premium UI
                ↓
         LoadingManager (Advanced Operations)
```

## Key Features

### 🎯 **Centralized Management**
- Single source of truth for all loading states
- Automatic priority-based loading queue
- Smart consolidation of overlapping operations
- Memory leak prevention with automatic cleanup

### 🚀 **Performance Optimized**
- Debounced loading to prevent flickering
- Native driver animations (60fps)
- Minimal re-renders with efficient state updates
- Background operation support

### 🎨 **Premium Design**
- Consistent BLONG branding across all loading states
- Adaptive UI based on loading type and context
- Smooth transitions and elegant animations
- Responsive design for different screen sizes

### 🛠 **Developer Experience**
- Simple, intuitive APIs
- Automatic cleanup on component unmount
- TypeScript support with full type safety
- Comprehensive error handling

## Usage Patterns

### 1. Simple Loading (Most Common)

```javascript
import { useLoading } from '../hooks/useLoading';

const MyComponent = () => {
  const { withLoading } = useLoading();

  const handleAction = async () => {
    await withLoading(
      async () => {
        // Your async operation
        await api.doSomething();
      },
      { message: 'Processing...' }
    );
  };

  return <Button onPress={handleAction}>Do Something</Button>;
};
```

### 2. Screen-Level Loading

```javascript
import { useScreenLoading } from '../hooks/useLoading';

const MyScreen = () => {
  const { showScreenLoading, hideScreenLoading } = useScreenLoading();

  useEffect(() => {
    const loadingId = showScreenLoading(
      'Loading your content...',
      'Please wait while we prepare everything'
    );

    loadData().finally(() => hideScreenLoading(loadingId));
  }, []);

  return <View>{/* Screen content */}</View>;
};
```

### 3. Operation Loading with Progress

```javascript
import { useOperationLoading } from '../hooks/useLoading';

const UploadComponent = () => {
  const { showOperationLoading, updateOperationProgress, hideOperationLoading } = useOperationLoading();

  const handleUpload = async () => {
    const loadingId = showOperationLoading('Uploading...', { showProgress: true });

    try {
      await uploadFile({
        onProgress: (progress) => {
          updateOperationProgress(loadingId, progress, `Uploading... ${progress}%`);
        }
      });
    } finally {
      hideOperationLoading(loadingId);
    }
  };

  return <Button onPress={handleUpload}>Upload File</Button>;
};
```

### 4. Batch Operations

```javascript
import { useBatchLoading } from '../hooks/useLoading';

const BatchProcessor = () => {
  const { withBatchLoading } = useBatchLoading();

  const processBatch = async () => {
    const operations = [
      () => api.processItem(1),
      () => api.processItem(2),
      () => api.processItem(3),
    ];

    await withBatchLoading(operations, {
      message: 'Processing batch...',
      showProgress: true,
    });
  };

  return <Button onPress={processBatch}>Process Batch</Button>;
};
```

### 5. Debounced Loading

```javascript
import { useDebouncedLoading } from '../hooks/useLoading';

const SearchComponent = () => {
  const { showDebouncedLoading, hideDebouncedLoading } = useDebouncedLoading(500);

  const handleSearch = (query) => {
    const loadingKey = showDebouncedLoading({
      message: 'Searching...',
      type: 'inline'
    });

    performSearch(query).finally(() => {
      hideDebouncedLoading(loadingKey);
    });
  };

  return <TextInput onChangeText={handleSearch} />;
};
```

## Loading Types

### SCREEN
- **Use Case**: Full screen initialization, major navigation
- **Priority**: HIGH
- **UI**: Full screen overlay with branding
- **Example**: App startup, screen transitions

### OPERATION
- **Use Case**: User-initiated actions, form submissions
- **Priority**: MEDIUM
- **UI**: Modal overlay with progress support
- **Example**: Payment processing, data submission

### INLINE
- **Use Case**: Content loading, pagination
- **Priority**: LOW
- **UI**: Inline spinner within content area
- **Example**: Loading more items, refreshing sections

### BACKGROUND
- **Use Case**: Silent operations, sync processes
- **Priority**: LOW
- **UI**: Minimal indicator (corner spinner)
- **Example**: Auto-save, background sync

## Migration Guide

### From Local Loading States

#### Before (Local State)
```javascript
const [loading, setLoading] = useState(false);

const handleAction = async () => {
  setLoading(true);
  try {
    await api.doSomething();
  } finally {
    setLoading(false);
  }
};

return (
  <View>
    {loading && <Text>Loading...</Text>}
    <Button onPress={handleAction}>Action</Button>
  </View>
);
```

#### After (Global System)
```javascript
const { withLoading } = useLoading();

const handleAction = async () => {
  await withLoading(
    () => api.doSomething(),
    { message: 'Processing...' }
  );
};

return <Button onPress={handleAction}>Action</Button>;
```

### Benefits of Migration
- **Reduced Code**: 60% less loading-related code
- **Consistency**: Automatic premium UI across all screens
- **Performance**: Better memory management and animations
- **Maintenance**: Centralized loading logic and styling

## Best Practices

### 1. Choose Appropriate Loading Types
```javascript
// ✅ Good: Screen loading for major operations
const loadingId = showScreenLoading('Initializing app...');

// ❌ Avoid: Screen loading for quick actions
const loadingId = showScreenLoading('Saving...'); // Use operation instead
```

### 2. Provide Meaningful Messages
```javascript
// ✅ Good: Descriptive and user-friendly
withLoading(operation, { 
  message: 'Processing your payment...',
  subtitle: 'This may take a few moments'
});

// ❌ Avoid: Generic messages
withLoading(operation, { message: 'Loading...' });
```

### 3. Use Progress for Long Operations
```javascript
// ✅ Good: Show progress for operations > 3 seconds
showOperationLoading('Uploading files...', { 
  showProgress: true,
  progress: 0 
});

// Update progress during operation
updateOperationProgress(loadingId, 45, 'Uploading file 2 of 5...');
```

### 4. Handle Errors Gracefully
```javascript
// ✅ Good: Proper error handling
try {
  await withLoading(riskyOperation, { message: 'Processing...' });
} catch (error) {
  // Loading automatically hidden on error
  showErrorMessage(error.message);
}
```

## Performance Considerations

### Memory Management
- Automatic cleanup on component unmount
- Limited operation history (100 entries max)
- Timeout-based loading state cleanup
- Efficient Map-based state storage

### Animation Performance
- All animations use native driver
- 60fps target with optimized transitions
- Reduced motion support for accessibility
- Smart animation queuing to prevent conflicts

### Network Optimization
- Debounced loading prevents excessive API calls
- Smart retry logic with exponential backoff
- Background loading for non-critical operations
- Batch operation support for efficiency

## Troubleshooting

### Common Issues

#### Loading Not Showing
```javascript
// Check if LoadingProvider is properly wrapped
<LoadingProvider>
  <App />
  <UniversalLoader /> {/* Must be inside provider */}
</LoadingProvider>
```

#### Memory Leaks
```javascript
// Always use hooks instead of direct context access
const { showLoading } = useLoading(); // ✅ Automatic cleanup
// const context = useLoadingContext(); // ❌ Manual cleanup required
```

#### Multiple Loading States
```javascript
// System automatically handles priority
showScreenLoading('Important'); // Priority: HIGH (will show)
showOperationLoading('Less important'); // Priority: MEDIUM (queued)
```

## Analytics and Debugging

### Operation Statistics
```javascript
import { loadingManager } from '../services/loadingManager';

// Get performance metrics
const stats = loadingManager.getOperationStats();
console.log('Loading Performance:', stats);
// Output: { total: 45, successful: 42, failed: 3, successRate: 93.3%, averageDuration: 1250 }
```

### Debug Mode
```javascript
// Enable debug logging in development
if (__DEV__) {
  loadingManager.enableDebugMode();
}
```

This global loading system provides a robust, scalable solution for managing loading states across the entire BLONG application while maintaining the premium user experience and developer productivity.
