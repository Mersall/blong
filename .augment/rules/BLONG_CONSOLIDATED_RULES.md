---
type: "agent_requested"
description: "Example description"
---
# BLONG Consolidated Development Rules

## 🎯 CORE PRINCIPLES
1. **BLONG Design System Compliance**: All UI must follow exact color, typography, and spacing rules
2. **Premium User Experience**: Elite, minimalist, and sophisticated interfaces
3. **Code Quality**: Clean, maintainable, and well-documented code
4. **Performance First**: Optimized for speed and smooth user experience

## 🎨 DESIGN SYSTEM (MANDATORY)

### Colors - NEVER DEVIATE
```javascript
const COLORS = {
  background: '#FFFFFF',      // Pure white
  surface: '#FAFAFA',         // Card backgrounds
  text: '#0A0A0A',           // Primary text
  textSecondary: '#6B6B6B',  // Secondary text
  textTertiary: '#9E9E9E',   // Tertiary text
  accent: '#FF6B35',         // Action color
  border: '#E0E0E0',         // Borders
  shadow: '#000000',         // Shadows
  success: '#4CAF50',        // Success states
  warning: '#FF9800',        // Warning states
};
```

### Typography
- **BLONG Logo**: 28px, 300 weight, 8px letter spacing
- **Headers**: H1(32px/800), H2(24px/300), H3(20px/300), H4(18px/300)
- **Body**: 16px, 300 weight
- **Buttons**: 14px, 500 weight, 0.5px letter spacing

### Spacing & Layout
- **Base Unit**: 8px (all spacing must be multiples)
- **Horizontal Padding**: Always 32px
- **Card Radius**: 8px for cards, 24px for buttons
- **Shadow Opacity**: 0.05 for cards
- **Bottom Padding**: 120px for navigation clearance

## 🏗️ ARCHITECTURE RULES

### Backend (NestJS)
```typescript
@Module({
  imports: [AppConfigModule, PrismaModule],
  controllers: [FeatureController],
  providers: [FeatureService],
  exports: [FeatureService],
})
export class FeatureModule {}
```

### API Standards
- **Validation**: Use DTOs with proper decorators
- **Error Handling**: Consistent error responses
- **Documentation**: Swagger/OpenAPI for all endpoints
- **Authentication**: JWT guards on protected routes

### Frontend (React Native)
```javascript
// ALWAYS follow this structure
const ScreenComponent = ({ navigation, route }) => {
  // 1. Hooks
  const { colors } = useTheme();
  
  // 2. State
  const [loading, setLoading] = useState(false);
  
  // 3. Effects
  useEffect(() => {}, []);
  
  // 4. Render
  return (
    <AppTransition>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <StatusBar barStyle="dark-content" />
        <ScrollView contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 120 }}>
          {/* Content */}
        </ScrollView>
      </SafeAreaView>
    </AppTransition>
  );
};
```

## 💼 BUSINESS LOGIC

### User Phases
- **Single**: Self-discovery and preparation
- **Engagement**: Relationship dynamics and compatibility  
- **Engagement Day Prep**: Communication and planning

### Quiz System
- **Personality**: Big Five, Emotional Intelligence
- **Relationships**: Love Languages, Attachment Style
- **Compatibility**: Values, Lifestyle, Goals

### Matching Algorithm
- **Personality Compatibility**: 40%
- **Preference Matching**: 30%
- **Value Alignment**: 20%
- **Interaction History**: 10%

## 🔧 DEVELOPMENT STANDARDS

### File Organization
```
feature/
├── index.js                 # Main export
├── FeatureScreen.js         # Main component
├── components/              # Feature components
├── services/               # API and business logic
├── styles/                 # Styling files
└── utils/                  # Utility functions
```

### Import Order
1. React and React Native
2. Third-party libraries
3. Internal components
4. Services and utilities
5. Contexts and hooks
6. Styles (always last)

### Error Handling
```javascript
const handleAsyncOperation = async (operation) => {
  try {
    setLoading(true);
    const result = await operation();
    return result;
  } catch (error) {
    console.error('Operation failed:', error);
    showNotification(error.message, 'error');
    throw error;
  } finally {
    setLoading(false);
  }
};
```

## 📱 COMPONENT PATTERNS

### Screen Wrapper
```javascript
<AppTransition>
  <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
    <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
    
    {/* Elite Header */}
    <View style={{ paddingTop: 40, paddingBottom: 32, paddingHorizontal: 32, alignItems: 'center' }}>
      <Text style={{ fontSize: 28, fontWeight: '300', letterSpacing: 8, color: COLORS.text }}>
        BLONG
      </Text>
      <View style={{ width: 40, height: 2, backgroundColor: COLORS.accent, marginTop: 16 }} />
    </View>
    
    <ScrollView contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 120 }}>
      {/* Content */}
    </ScrollView>
  </SafeAreaView>
</AppTransition>
```

### Elite Card
```javascript
{
  backgroundColor: COLORS.surface,
  borderRadius: 8,
  padding: 24,
  shadowColor: COLORS.shadow,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.05,
  shadowRadius: 12,
  elevation: 2,
  borderWidth: 1,
  borderColor: COLORS.border,
}
```

### Primary Button
```javascript
{
  backgroundColor: COLORS.accent,
  paddingHorizontal: 32,
  paddingVertical: 12,
  borderRadius: 24,
  shadowColor: COLORS.accent,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 8,
  elevation: 4,
}
```

## 🚫 FORBIDDEN PRACTICES

### Never Do These:
- Use colors outside the COLORS palette
- Font weights other than 300, 500, 700, 800
- Spacing that's not multiples of 8px
- Border radius other than 8px or 24px
- Shadow opacity above 0.05 for cards
- Edit package files manually (use package managers)
- Commit code without testing
- Skip error handling

## ✅ MANDATORY CHECKS

### Before Submitting Code:
- [ ] Follows BLONG design system exactly
- [ ] Uses proper spacing (8px multiples)
- [ ] Includes error handling
- [ ] Has proper TypeScript types
- [ ] Includes accessibility props
- [ ] Tested on both platforms
- [ ] Documentation updated

## 📋 QUICK REFERENCE

### Common Patterns
- **Screen Structure**: AppTransition → SafeAreaView → StatusBar → ScrollView
- **Header Pattern**: BLONG logo + accent line + subtitle
- **Card Pattern**: Surface background + 8px radius + subtle shadow
- **Button Pattern**: Accent background + 24px radius + proper shadow

### Performance
- Use React.memo for expensive components
- Implement proper loading states
- Cache API responses appropriately
- Optimize images and assets

### Testing
- Write unit tests for business logic
- Test error scenarios
- Verify accessibility
- Test on multiple screen sizes

## 📚 DOCUMENTATION RULE

### Automatic Documentation Updates
**MANDATORY**: All completed work must be documented with:
- **What was done**: Clear description of changes/implementations
- **Why it was done**: Business justification and requirements
- **How it impacts the system**: Technical implications and dependencies
- **Usage examples**: Code snippets and integration patterns
- **Testing notes**: What was tested and results

### Documentation Locations
- **API Changes**: Update Swagger/OpenAPI documentation
- **Component Changes**: Update component README files
- **Architecture Changes**: Update system architecture docs
- **Business Logic**: Update business rules documentation

---

**These rules are MANDATORY and must be followed for ALL BLONG development.**

## 📖 RULE OPTIMIZATION SUMMARY

This consolidated document replaces the following redundant files:
- `BLONG_ARCHITECTURE_RULES.md` → Merged into Architecture Rules section
- `BLONG_BUSINESS_LOGIC_RULES.md` → Merged into Business Logic section
- `BLONG_DEVELOPMENT_STANDARDS.md` → Merged into Development Standards section
- `augment-agent-design-rules.md` → Merged into Design System section
- `component-library.md` → Merged into Component Patterns section
- `quick-reference.md` → Merged into Quick Reference section

**Total Reduction**: From 11 separate rule files to 1 consolidated file (73% reduction in rule complexity)
