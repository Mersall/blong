---
type: "always_apply"
description: "Example description"
---
# BLONG Design System - Quick Reference

## 🎨 COLORS (Copy & Paste Ready)

```javascript
const COLORS = {
  background: '#FFFFFF',      // Pure white backgrounds
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

## 📝 TYPOGRAPHY QUICK STYLES

```javascript
// BLONG Brand Logo
{
  fontSize: 28,
  fontWeight: '300',
  letterSpacing: 8,
  color: COLORS.text,
}

// Page Title
{
  fontSize: 24,
  fontWeight: '300',
  color: COLORS.text,
}

// Section Title
{
  fontSize: 18,
  fontWeight: '300',
  color: COLORS.text,
}

// Body Text
{
  fontSize: 16,
  fontWeight: '300',
  color: COLORS.textSecondary,
}

// Small Text
{
  fontSize: 14,
  color: COLORS.textSecondary,
}

// Caption
{
  fontSize: 12,
  color: COLORS.textTertiary,
}
```

## 📦 COMPONENT QUICK STYLES

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

### Button Text
```javascript
{
  color: COLORS.background,
  fontSize: 14,
  fontWeight: '500',
  letterSpacing: 0.5,
  textAlign: 'center',
}
```

## 📐 SPACING SYSTEM

```javascript
const SPACING = {
  xs: 8,    // 8px
  sm: 16,   // 16px
  md: 24,   // 24px
  lg: 32,   // 32px
  xl: 40,   // 40px
  xxl: 48,  // 48px
};
```

## 🏗️ SCREEN STRUCTURE TEMPLATE

```javascript
<AppTransition>
  <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
    <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

    {/* Elite Header */}
    <View style={{
      paddingTop: 40,
      paddingBottom: 32,
      paddingHorizontal: 32,
      alignItems: 'center',
    }}>
      <Text style={{
        fontSize: 28,
        fontWeight: '300',
        letterSpacing: 8,
        color: COLORS.text,
        marginBottom: 16,
      }}>
        BLONG
      </Text>
      <View style={{
        width: 40,
        height: 2,
        backgroundColor: COLORS.accent,
        marginBottom: 24,
      }} />
    </View>

    {/* Content */}
    <ScrollView 
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Your content here */}
    </ScrollView>
  </SafeAreaView>
</AppTransition>
```

## 🚀 MANDATORY IMPORTS

```javascript
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';
import { AppTransition } from '../../components/AppTransition';
import { useTheme } from '../../contexts/AppContext';
```

## ✅ QUICK CHECKLIST

Before submitting any UI work:

### Colors ✓
- [ ] Uses exact COLORS constants
- [ ] No custom colors outside the palette
- [ ] Proper text contrast ratios

### Typography ✓
- [ ] Font weights: 300, 500, 700, 800 only
- [ ] BLONG logo has 8px letter spacing
- [ ] Proper font size hierarchy

### Spacing ✓
- [ ] All spacing is multiples of 8px
- [ ] 32px horizontal padding
- [ ] 120px bottom padding for navigation

### Components ✓
- [ ] 8px border radius for cards
- [ ] 24px border radius for buttons
- [ ] 0.05 shadow opacity for cards
- [ ] Proper elevation values

### Structure ✓
- [ ] AppTransition wrapper
- [ ] SafeAreaView with background color
- [ ] StatusBar configuration
- [ ] ScrollView with proper padding
- [ ] Elite header pattern

### Accessibility ✓
- [ ] Proper touch targets (44px minimum)
- [ ] Accessibility labels
- [ ] Sufficient color contrast

## 🚨 COMMON MISTAKES TO AVOID

❌ **Don't use:**
- Custom colors outside COLORS palette
- Font weights other than 300, 500, 700, 800
- Spacing that's not multiples of 8px
- Border radius other than 8px or 24px
- Shadow opacity above 0.05 for cards

❌ **Don't forget:**
- AppTransition wrapper
- StatusBar configuration
- Proper horizontal padding (32px)
- Bottom padding for navigation (120px)
- BLONG logo letter spacing (8px)

## 📱 RESPONSIVE NOTES

- **Minimum touch target**: 44px
- **Horizontal padding**: Always 32px
- **Content width**: Full width with padding
- **Bottom navigation space**: 120px
- **Safe area handling**: Use SafeAreaView

## 🎯 DESIGN PRINCIPLES REMINDER

1. **Minimalism**: Clean, uncluttered interfaces
2. **Elegance**: Sophisticated typography and colors
3. **Premium Feel**: High-quality visual elements
4. **Consistency**: Unified design language
5. **User-Centric**: Intuitive and accessible
