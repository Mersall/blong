# BLONG Loading System - Quick Reference

## 🚀 Quick Start

### 1. Setup (Already Done)
```javascript
// App.js
<AppProvider>
  <LoadingProvider>
    <YourApp />
    <UniversalLoader />
  </LoadingProvider>
</AppProvider>
```

### 2. Basic Usage
```javascript
import { useLoading } from '../hooks/useLoading';

const { withLoading } = useLoading();

// Wrap any async operation
await withLoading(
  () => api.fetchData(),
  { message: 'Loading data...' }
);
```

## 📚 Hook Reference

### useLoading (General Purpose)
```javascript
const {
  showLoading,      // (config) => loadingId
  hideLoading,      // (loadingId) => void
  withLoading,      // (operation, config) => Promise
  isLoading,        // boolean
  activeLoading,    // object | null
} = useLoading();
```

### useScreenLoading (Full Screen)
```javascript
const {
  showScreenLoading,    // (message, subtitle) => loadingId
  hideScreenLoading,    // (loadingId) => void
  withScreenLoading,    // (operation, config) => Promise
} = useScreenLoading();
```

### useOperationLoading (Modal Style)
```javascript
const {
  showOperationLoading,     // (message, options) => loadingId
  hideOperationLoading,     // (loadingId) => void
  withOperationLoading,     // (operation, config) => Promise
  updateOperationProgress,  // (loadingId, progress, message) => void
} = useOperationLoading();
```

### useInlineLoading (Content Areas)
```javascript
const {
  showInlineLoading,    // (message) => loadingId
  hideInlineLoading,    // (loadingId) => void
  isInlineLoading,      // boolean
} = useInlineLoading();
```

### useSimpleLoading (Boolean Style)
```javascript
const {
  setLoading,    // (boolean, message?) => void
  isLoading,     // boolean
} = useSimpleLoading();
```

## 🎯 Common Patterns

### Screen Initialization
```javascript
const MyScreen = () => {
  const { showScreenLoading, hideScreenLoading } = useScreenLoading();

  useEffect(() => {
    const loadingId = showScreenLoading('Loading...');
    initializeScreen().finally(() => hideScreenLoading(loadingId));
  }, []);
};
```

### Button Actions
```javascript
const MyButton = () => {
  const { withLoading } = useLoading();

  const handlePress = () => withLoading(
    () => api.submitForm(),
    { message: 'Submitting...' }
  );

  return <Button onPress={handlePress}>Submit</Button>;
};
```

### List Pagination
```javascript
const MyList = () => {
  const { showInlineLoading, hideInlineLoading } = useInlineLoading();

  const loadMore = async () => {
    const loadingId = showInlineLoading('Loading more...');
    await fetchMoreItems();
    hideInlineLoading(loadingId);
  };
};
```

### Form Submission with Progress
```javascript
const MyForm = () => {
  const { showOperationLoading, updateOperationProgress, hideOperationLoading } = useOperationLoading();

  const handleSubmit = async () => {
    const loadingId = showOperationLoading('Uploading...', { showProgress: true });
    
    try {
      await uploadWithProgress({
        onProgress: (progress) => {
          updateOperationProgress(loadingId, progress, `Uploading... ${progress}%`);
        }
      });
    } finally {
      hideOperationLoading(loadingId);
    }
  };
};
```

### Simple Toggle Loading
```javascript
const MyComponent = () => {
  const { setLoading } = useSimpleLoading();

  const handleAction = async () => {
    setLoading(true, 'Processing...');
    await doSomething();
    setLoading(false);
  };
};
```

## ⚙️ Configuration Options

### Loading Config Object
```javascript
{
  type: 'screen' | 'operation' | 'inline' | 'background',
  priority: 1-4, // 1=LOW, 2=MEDIUM, 3=HIGH, 4=CRITICAL
  message: 'Loading...',
  subtitle: 'Please wait...',
  showProgress: false,
  progress: 0, // 0-100
  timeout: 30000, // milliseconds
}
```

### Loading Types
- **screen**: Full screen overlay (high priority)
- **operation**: Modal overlay (medium priority)  
- **inline**: Content area spinner (low priority)
- **background**: Corner indicator (low priority)

## 🔧 Advanced Usage

### Batch Operations
```javascript
import { useBatchLoading } from '../hooks/useLoading';

const { withBatchLoading } = useBatchLoading();

await withBatchLoading([
  () => api.operation1(),
  () => api.operation2(),
  () => api.operation3(),
], { message: 'Processing batch...' });
```

### Retry Logic
```javascript
import { useRetryLoading } from '../hooks/useLoading';

const { withRetryLoading } = useRetryLoading();

await withRetryLoading(
  () => api.unreliableOperation(),
  { 
    message: 'Attempting...',
    maxRetries: 3,
    retryDelay: 1000 
  }
);
```

### Debounced Loading
```javascript
import { useDebouncedLoading } from '../hooks/useLoading';

const { showDebouncedLoading, hideDebouncedLoading } = useDebouncedLoading(500);

const handleSearch = (query) => {
  const key = showDebouncedLoading({ message: 'Searching...' });
  performSearch(query).finally(() => hideDebouncedLoading(key));
};
```

## 🚨 Common Mistakes

### ❌ Don't Do This
```javascript
// Manual loading management
const [loading, setLoading] = useState(false);
const [loadingMessage, setLoadingMessage] = useState('');

// Multiple loading states
const [screenLoading, setScreenLoading] = useState(false);
const [buttonLoading, setButtonLoading] = useState(false);

// Forgetting to hide loading
showLoading();
// ... operation
// Missing: hideLoading()
```

### ✅ Do This Instead
```javascript
// Use global system
const { withLoading } = useLoading();

// Single operation wrapper
await withLoading(operation, { message: 'Loading...' });

// Automatic cleanup
const { showLoading, hideLoading } = useLoading();
// Cleanup happens automatically on unmount
```

## 🎨 UI Customization

### Message Guidelines
```javascript
// ✅ Good messages
'Loading your dates...'
'Processing payment...'
'Uploading photos...'
'Syncing data...'

// ❌ Avoid generic messages
'Loading...'
'Please wait...'
'Working...'
```

### Progress Updates
```javascript
// ✅ Descriptive progress
updateProgress(id, 25, 'Uploading photo 1 of 4...');
updateProgress(id, 50, 'Processing images...');
updateProgress(id, 75, 'Finalizing upload...');

// ❌ Just numbers
updateProgress(id, 25);
updateProgress(id, 50);
```

## 🔍 Debugging

### Check Loading State
```javascript
const { isLoading, activeLoading } = useLoading();

console.log('Is Loading:', isLoading);
console.log('Active Loading:', activeLoading);
```

### Performance Stats
```javascript
import { loadingManager } from '../services/loadingManager';

const stats = loadingManager.getOperationStats();
console.log('Loading Stats:', stats);
```

### Debug Mode
```javascript
// In development
if (__DEV__) {
  // Enable detailed logging
  console.log('Loading system initialized');
}
```

## 📱 Platform Considerations

### iOS
- Respects reduced motion settings
- Native driver animations
- Proper safe area handling

### Android
- Material Design loading indicators
- Hardware acceleration
- Back button handling during loading

### Web
- Keyboard navigation support
- Screen reader compatibility
- Focus management

## 🔄 Migration Checklist

- [ ] Remove local loading states
- [ ] Replace loading UI with hooks
- [ ] Update error handling
- [ ] Test all loading scenarios
- [ ] Verify cleanup behavior
- [ ] Check accessibility
- [ ] Performance testing

## 📞 Support

For issues or questions:
1. Check this reference guide
2. Review the full documentation
3. Check existing loading implementations
4. Test in isolation
5. Ask the team for help

Remember: The global loading system handles complexity so you don't have to! 🚀
