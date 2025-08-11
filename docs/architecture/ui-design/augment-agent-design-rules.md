# BLONG Premium Elite Design Rules for Augment Agent

## 🎨 MANDATORY DESIGN SYSTEM RULES

### RULE 1: COLOR SYSTEM - NEVER DEVIATE
```javascript
// ALWAYS use these exact colors - NO EXCEPTIONS
const COLORS = {
  // Pure minimalist backgrounds
  background: '#FFFFFF',      // Pure white for maximum elegance
  surface: '#FAFAFA',         // Subtle off-white for cards
  
  // Elite text hierarchy
  text: '#0A0A0A',           // Deep black for maximum contrast
  textSecondary: '#6B6B6B',  // Sophisticated gray
  textTertiary: '#9E9E9E',   // Light gray for subtle text
  
  // Premium accent colors
  accent: '#FF6B35',         // Vibrant coral for actions
  border: '#E0E0E0',         // Subtle borders
  shadow: '#000000',         // Pure black shadows
  
  // Status colors
  success: '#4CAF50',
  warning: '#FF9800',
};
```

### RULE 2: TYPOGRAPHY SYSTEM - STRICT HIERARCHY
```javascript
// Brand Typography (for BLONG logo)
{
  fontSize: 28,
  fontWeight: '300',
  letterSpacing: 8,          // ALWAYS 8px letter spacing for BLONG
  color: COLORS.text,
}

// Heading Hierarchy
H1: { fontSize: 32, fontWeight: '800', color: COLORS.text }
H2: { fontSize: 24, fontWeight: '300', color: COLORS.text }
H3: { fontSize: 20, fontWeight: '300', color: COLORS.text }
H4: { fontSize: 18, fontWeight: '300', color: COLORS.text }

// Body Text
Body: { fontSize: 16, fontWeight: '300', color: COLORS.textSecondary }
Small: { fontSize: 14, color: COLORS.textSecondary }
Caption: { fontSize: 12, color: COLORS.textTertiary }
```

### RULE 3: SPACING SYSTEM - 8PX BASE UNIT
```javascript
// ALWAYS use multiples of 8px
const SPACING = {
  xs: 8,    // 8px
  sm: 16,   // 16px
  md: 24,   // 24px
  lg: 32,   // 32px
  xl: 40,   // 40px
  xxl: 48,  // 48px
};

// Container Rules
- Horizontal padding: ALWAYS 32px
- Vertical padding: 24px minimum
- Card padding: 20px or 24px only
```

### RULE 4: COMPONENT STANDARDS - EXACT SPECIFICATIONS

#### Elite Cards
```javascript
{
  backgroundColor: COLORS.surface,
  borderRadius: 8,           // ALWAYS 8px
  padding: 24,
  shadowColor: COLORS.shadow,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.05,       // ALWAYS 0.05 for subtle shadows
  shadowRadius: 12,
  elevation: 2,
  borderWidth: 1,
  borderColor: COLORS.border,
}
```

#### Premium Buttons
```javascript
// Primary Button
{
  backgroundColor: COLORS.accent,
  paddingHorizontal: 32,
  paddingVertical: 12,
  borderRadius: 24,          // ALWAYS 24px for buttons
  shadowColor: COLORS.accent,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 8,
  elevation: 4,
}

// Button Text
{
  color: COLORS.background,
  fontSize: 14,
  fontWeight: '500',
  letterSpacing: 0.5,
}
```

### RULE 5: LAYOUT PATTERNS - MANDATORY STRUCTURE

#### Screen Structure
```javascript
// ALWAYS wrap screens in this structure
<AppTransition>
  <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
    <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
    
    {/* Elite Header */}
    <View style={{ paddingTop: 40, paddingBottom: 32, paddingHorizontal: 32 }}>
      {/* Header content */}
    </View>
    
    {/* Main Content */}
    <ScrollView 
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Screen content */}
    </ScrollView>
  </SafeAreaView>
</AppTransition>
```

#### Elite Header Pattern
```javascript
// ALWAYS use this header structure
<View style={{
  paddingTop: 40,
  paddingBottom: 32,
  paddingHorizontal: 32,
  alignItems: 'center',
  backgroundColor: COLORS.background,
}}>
  <Text style={{
    fontSize: 28,
    fontWeight: '300',
    letterSpacing: 8,        // MANDATORY 8px spacing
    color: COLORS.text,
    marginBottom: 16,
  }}>
    BLONG
  </Text>

  {/* Accent line - ALWAYS include */}
  <View style={{
    width: 40,
    height: 2,
    backgroundColor: COLORS.accent,
    marginBottom: 24,
  }} />
</View>
```

### RULE 6: IMPORT REQUIREMENTS - ALWAYS INCLUDE
```javascript
// MANDATORY imports for every screen
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { AppTransition } from '../../components/AppTransition';
import { useTheme } from '../../contexts/AppContext';

// Include COLORS constant in every file
const COLORS = {
  background: '#FFFFFF',
  surface: '#FAFAFA',
  text: '#0A0A0A',
  textSecondary: '#6B6B6B',
  textTertiary: '#9E9E9E',
  accent: '#FF6B35',
  border: '#E0E0E0',
  shadow: '#000000',
  success: '#4CAF50',
  warning: '#FF9800',
};
```

### RULE 7: FORBIDDEN PRACTICES - NEVER DO THESE

❌ **NEVER use these colors:**
- Any bright colors except #FF6B35
- Gradients (except for specific accent elements)
- Dark backgrounds
- Colored text except defined colors

❌ **NEVER use these typography:**
- Font weights other than 300, 500, 700, 800
- Letter spacing other than 0.5px or 8px
- Line heights below 20px

❌ **NEVER use these layouts:**
- Padding that's not multiples of 8px
- Border radius other than 8px (cards) or 24px (buttons)
- Shadow opacity above 0.05 for cards

### RULE 8: COMPONENT NAMING - CONSISTENT PATTERNS
```javascript
// Screen Components
const HomeScreen = ({ ... }) => { ... };
const ProfileScreen = ({ ... }) => { ... };

// UI Components  
const PremiumCard = ({ ... }) => { ... };
const EliteButton = ({ ... }) => { ... };

// Style Objects
const styles = {
  container: { ... },
  card: { ... },
  button: { ... },
};
```

### RULE 9: RESPONSIVE BEHAVIOR - MOBILE FIRST
```javascript
// ALWAYS design for mobile first
- Minimum touch target: 44px
- Maximum content width: No restrictions (full width)
- Horizontal padding: Always 32px
- Vertical spacing: Minimum 16px between elements
```

### RULE 10: ACCESSIBILITY REQUIREMENTS
```javascript
// ALWAYS include accessibility props
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Button description"
  accessibilityRole="button"
>
  <Text>Button Text</Text>
</TouchableOpacity>

// Text contrast ratios
- Primary text: 4.5:1 minimum (achieved with #0A0A0A on #FFFFFF)
- Secondary text: 3:1 minimum (achieved with #6B6B6B on #FFFFFF)
```

## 🚨 ENFORCEMENT RULES FOR AUGMENT AGENT

1. **ALWAYS reference these rules** before creating any UI component
2. **NEVER deviate** from the color system without explicit user approval
3. **ALWAYS use the exact spacing values** specified
4. **COPY the component patterns** exactly as shown
5. **INCLUDE all mandatory imports** in every file
6. **FOLLOW the screen structure** pattern for all new screens
7. **MAINTAIN consistency** with existing implemented screens
8. **ASK for clarification** if any design decision conflicts with these rules

## 📋 IMPLEMENTATION CHECKLIST

Before completing any UI work, verify:
- [ ] Colors match EXACTLY the defined palette
- [ ] Typography follows the hierarchy rules
- [ ] Spacing uses 8px base unit multiples
- [ ] Components match the specified patterns
- [ ] Screen structure follows the mandatory layout
- [ ] All imports are included
- [ ] Accessibility props are added
- [ ] No forbidden practices are used

---

**These rules are MANDATORY and must be followed for ALL BLONG UI development.**
