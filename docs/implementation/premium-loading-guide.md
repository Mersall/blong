# Premium Loading Implementation Guide

## Overview

This guide provides step-by-step instructions for implementing BLONG's premium loading components across different screen types and use cases.

## Screen Type Implementations

### 1. List/Browse Screens

#### Initial Loading
```javascript
const ListScreen = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const renderContent = () => {
    if (loading && items.length === 0) {
      return (
        <View style={{ paddingHorizontal: 32, paddingTop: 40 }}>
          <PremiumLoadingCard 
            message="Loading your content..."
            subtitle="Curating the best results for you"
          />
        </View>
      );
    }

    return (
      <ScrollView>
        {items.map(item => <ItemCard key={item.id} item={item} />)}
        
        {/* Pagination Loading */}
        {loading && items.length > 0 && (
          <PremiumInlineLoader 
            message="Loading more items..."
            size="small"
            style={{ paddingVertical: 20 }}
          />
        )}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {renderContent()}
    </SafeAreaView>
  );
};
```

### 2. Detail Screens

#### Screen Loading with Refresh
```javascript
const DetailScreen = ({ itemId }) => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const refreshItem = async () => {
    setLoading(true);
    try {
      const data = await api.getItem(itemId);
      setItem(data);
    } finally {
      setLoading(false);
    }
  };

  if (!item) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingHorizontal: 32, paddingTop: 40 }}>
          <PremiumInlineLoader 
            message="Item not found"
            size="medium"
            style={{ paddingVertical: 60 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        {/* Content */}
      </ScrollView>

      {/* Full Screen Loader for Refresh */}
      <PremiumFullScreenLoader
        visible={loading}
        message="Updating details..."
        subtitle="Please wait while we refresh your information"
      />
    </SafeAreaView>
  );
};
```

### 3. Form/Process Screens

#### Multi-step Process with Progress
```javascript
const ProcessScreen = () => {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async () => {
    setProcessing(true);
    setProgress(0);

    try {
      // Simulate progress updates
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Form Content */}
      
      <PremiumFullScreenLoader
        visible={processing}
        message="Processing your request..."
        subtitle="This may take a few moments"
        showProgress={true}
        progress={progress}
      />
    </SafeAreaView>
  );
};
```

## Component Integration Patterns

### 1. Replace Basic Loading States

#### Before (Basic)
```javascript
{loading && (
  <View style={{ padding: 20, alignItems: 'center' }}>
    <Text>Loading...</Text>
  </View>
)}
```

#### After (Premium)
```javascript
{loading && (
  <PremiumInlineLoader 
    message="Loading..."
    size="medium"
    style={{ paddingVertical: 20 }}
  />
)}
```

### 2. Enhanced Error States

#### Before (Basic)
```javascript
{error && (
  <Text style={{ color: 'red', textAlign: 'center' }}>
    Error loading data
  </Text>
)}
```

#### After (Premium)
```javascript
{error && (
  <PremiumInlineLoader 
    message="Unable to load content"
    size="medium"
    style={{ paddingVertical: 40 }}
  />
)}
```

### 3. Button Loading States

#### Before (Basic)
```javascript
<TouchableOpacity disabled={loading}>
  <Text>{loading ? 'Loading...' : 'Submit'}</Text>
</TouchableOpacity>
```

#### After (Premium)
```javascript
<TouchableOpacity disabled={loading} style={styles.button}>
  {loading ? (
    <PremiumSpinner size="small" color="#FFFFFF" />
  ) : (
    <Text style={styles.buttonText}>Submit</Text>
  )}
</TouchableOpacity>
```

## Animation Guidelines

### 1. Timing Standards
- **Quick Operations** (< 2s): Use PremiumSpinner or PremiumInlineLoader
- **Medium Operations** (2-10s): Use PremiumLoadingCard
- **Long Operations** (> 10s): Use PremiumFullScreenLoader with progress

### 2. Message Guidelines
- **Be Specific**: "Loading your dates..." vs "Loading..."
- **Set Expectations**: "This may take a few moments"
- **Brand Voice**: Use warm, premium language
- **Progress Context**: "Processing payment..." vs "Loading..."

### 3. Visual Hierarchy
- **Primary Loading**: Full screen or card with branding
- **Secondary Loading**: Inline without branding
- **Micro Loading**: Small spinners for buttons/icons

## Performance Optimization

### 1. Conditional Rendering
```javascript
// Good: Only render when needed
{loading && <PremiumLoader />}

// Avoid: Always rendering with visibility
<PremiumLoader visible={loading} />
```

### 2. Animation Cleanup
```javascript
useEffect(() => {
  // Animation setup
  const animation = startAnimation();
  
  return () => {
    // Cleanup
    animation.stop();
  };
}, []);
```

### 3. Memory Management
```javascript
// Use refs for animation values
const fadeAnim = useRef(new Animated.Value(0)).current;

// Avoid creating new values on each render
// const fadeAnim = new Animated.Value(0); // ❌
```

## Accessibility Implementation

### 1. Screen Reader Support
```javascript
<PremiumLoadingCard 
  message="Loading your dates..."
  subtitle="Please wait while we prepare your matches"
  // Automatically includes accessibility labels
/>
```

### 2. Reduced Motion
```javascript
// Components automatically respect reduced motion preferences
// No additional configuration needed
```

### 3. Focus Management
```javascript
// For full screen loaders, focus is automatically managed
// Screen readers will announce loading state changes
```

## Testing Checklist

### Visual Testing
- [ ] Animations are smooth (60fps)
- [ ] Brand elements display correctly
- [ ] Colors match design system
- [ ] Spacing follows 8px grid

### Functional Testing
- [ ] Loading states show/hide correctly
- [ ] Progress updates work smoothly
- [ ] Memory leaks are prevented
- [ ] Animations clean up properly

### Accessibility Testing
- [ ] Screen readers announce loading states
- [ ] High contrast mode works
- [ ] Reduced motion is respected
- [ ] Keyboard navigation works

### Performance Testing
- [ ] No frame drops during animations
- [ ] Memory usage remains stable
- [ ] CPU usage is reasonable
- [ ] Battery impact is minimal

## Common Patterns

### 1. Screen Initialization
```javascript
const [isInitializing, setIsInitializing] = useState(true);

useEffect(() => {
  initializeScreen().finally(() => setIsInitializing(false));
}, []);

if (isInitializing) {
  return <PremiumLoadingCard message="Initializing..." />;
}
```

### 2. Data Refresh
```javascript
const [refreshing, setRefreshing] = useState(false);

const handleRefresh = async () => {
  setRefreshing(true);
  await refreshData();
  setRefreshing(false);
};

return (
  <>
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} />}>
      {/* Content */}
    </ScrollView>
    
    <PremiumFullScreenLoader 
      visible={refreshing} 
      message="Refreshing..." 
    />
  </>
);
```

### 3. Progressive Loading
```javascript
const [loadingStates, setLoadingStates] = useState({
  profile: true,
  matches: true,
  preferences: true,
});

return (
  <ScrollView>
    {loadingStates.profile ? (
      <PremiumInlineLoader message="Loading profile..." />
    ) : (
      <ProfileSection />
    )}
    
    {loadingStates.matches ? (
      <PremiumLoadingCard message="Finding matches..." />
    ) : (
      <MatchesSection />
    )}
  </ScrollView>
);
```
