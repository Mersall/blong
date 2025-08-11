# BLONG Component Library - Implementation Guide

## 🎨 PREMIUM COMPONENT SPECIFICATIONS

### 1. ELITE CARDS

#### Standard Card
```javascript
const EliteCard = ({ children, style = {} }) => (
  <View style={{
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
    ...style,
  }}>
    {children}
  </View>
);
```

#### Status Card (for completion states)
```javascript
const StatusCard = ({ type, icon, title, subtitle, children }) => (
  <View style={{
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: type === 'success' ? COLORS.success + '30' : COLORS.warning + '30',
  }}>
    <View style={{
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: type === 'success' ? COLORS.success : COLORS.warning + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    }}>
      <Text style={{ fontSize: 20, color: type === 'success' ? COLORS.background : 'inherit' }}>
        {icon}
      </Text>
    </View>
    <Text style={{
      fontSize: 18,
      fontWeight: '300',
      color: COLORS.text,
      marginBottom: 8,
      textAlign: 'center',
    }}>
      {title}
    </Text>
    <Text style={{
      fontSize: 14,
      color: COLORS.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    }}>
      {subtitle}
    </Text>
    {children}
  </View>
);
```

### 2. PREMIUM BUTTONS

#### Primary Button
```javascript
const PrimaryButton = ({ title, onPress, disabled = false, style = {} }) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    style={{
      backgroundColor: disabled ? COLORS.textTertiary : COLORS.accent,
      paddingHorizontal: 32,
      paddingVertical: 12,
      borderRadius: 24,
      shadowColor: COLORS.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: disabled ? 0 : 0.2,
      shadowRadius: 8,
      elevation: disabled ? 0 : 4,
      ...style,
    }}
  >
    <Text style={{
      color: COLORS.background,
      fontSize: 14,
      fontWeight: '500',
      letterSpacing: 0.5,
      textAlign: 'center',
    }}>
      {title}
    </Text>
  </TouchableOpacity>
);
```

#### Secondary Button
```javascript
const SecondaryButton = ({ title, onPress, style = {} }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: COLORS.surface,
      borderWidth: 1,
      borderColor: COLORS.border,
      ...style,
    }}
  >
    <Text style={{
      fontSize: 12,
      color: COLORS.textSecondary,
      fontWeight: '500',
      textAlign: 'center',
    }}>
      {title}
    </Text>
  </TouchableOpacity>
);
```

### 3. ELITE HEADERS

#### Main Header (with BLONG branding)
```javascript
const EliteHeader = ({ subtitle, rightAction }) => (
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

    {subtitle && (
      <Text style={{
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
      }}>
        {subtitle}
      </Text>
    )}

    {rightAction && (
      <TouchableOpacity
        onPress={rightAction.onPress}
        style={{
          position: 'absolute',
          top: 50,
          right: 32,
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 20,
          backgroundColor: COLORS.surface,
          borderWidth: 1,
          borderColor: COLORS.border,
        }}
      >
        <Text style={{
          fontSize: 12,
          color: COLORS.textSecondary,
          fontWeight: '500',
        }}>
          {rightAction.title}
        </Text>
      </TouchableOpacity>
    )}
  </View>
);
```

### 4. MENU ITEMS

#### Elite Menu Item
```javascript
const EliteMenuItem = ({ icon, title, subtitle, onPress, disabled = false }) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    style={{
      backgroundColor: disabled ? COLORS.surface : COLORS.background,
      borderRadius: 8,
      padding: 20,
      marginBottom: 16,
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: disabled ? 0.02 : 0.05,
      shadowRadius: 8,
      elevation: disabled ? 1 : 2,
      borderWidth: 1,
      borderColor: COLORS.border,
      opacity: disabled ? 0.5 : 1,
    }}
  >
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
    }}>
      <Text style={{ 
        fontSize: 20, 
        marginRight: 16,
        opacity: disabled ? 0.5 : 1,
      }}>
        {icon}
      </Text>
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: 16,
          fontWeight: '300',
          color: disabled ? COLORS.textTertiary : COLORS.text,
          marginBottom: 4,
        }}>
          {title}
        </Text>
        <Text style={{
          fontSize: 12,
          color: disabled ? COLORS.textTertiary : COLORS.textSecondary,
          lineHeight: 16,
        }}>
          {subtitle}
        </Text>
      </View>
      <Text style={{
        fontSize: 16,
        color: disabled ? COLORS.textTertiary : COLORS.accent,
        fontWeight: '300',
      }}>
        →
      </Text>
    </View>
  </TouchableOpacity>
);
```

### 5. INFORMATION CARDS

#### User Info Card
```javascript
const UserInfoCard = ({ title, fields }) => (
  <View style={{
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
  }}>
    <Text style={{ 
      fontSize: 14, 
      fontWeight: '300', 
      color: COLORS.text,
      marginBottom: 16,
      letterSpacing: 0.5,
    }}>
      {title}
    </Text>
    
    {fields.map((field, index) => (
      <View key={index} style={{ marginBottom: index === fields.length - 1 ? 0 : 12 }}>
        <Text style={{ fontSize: 12, color: COLORS.textTertiary, marginBottom: 4 }}>
          {field.label}
        </Text>
        <Text style={{ fontSize: 14, color: COLORS.textSecondary }}>
          {field.value}
        </Text>
      </View>
    ))}
  </View>
);
```

### 6. SCREEN WRAPPER

#### Standard Screen Layout
```javascript
const ScreenWrapper = ({ children, showHeader = true, headerProps = {} }) => (
  <AppTransition>
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {showHeader && <EliteHeader {...headerProps} />}
      
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  </AppTransition>
);
```

## 🎯 USAGE EXAMPLES

### Complete Screen Implementation
```javascript
const ExampleScreen = ({ user, onLogout }) => {
  return (
    <ScreenWrapper
      headerProps={{
        subtitle: `Welcome back, ${user?.firstName}!`,
        rightAction: { title: 'Logout', onPress: onLogout }
      }}
    >
      <StatusCard
        type="success"
        icon="✓"
        title="Profile Complete"
        subtitle="Ready to discover your perfect match"
      />
      
      <EliteMenuItem
        icon="💕"
        title="Your Matches"
        subtitle="Browse potential matches"
        onPress={() => console.log('Navigate to matches')}
      />
      
      <UserInfoCard
        title="Account Information"
        fields={[
          { label: 'Name', value: `${user?.firstName} ${user?.lastName}` },
          { label: 'Email', value: user?.email },
        ]}
      />
    </ScreenWrapper>
  );
};
```

## 📋 COMPONENT CHECKLIST

When creating components, ensure:
- [ ] Uses exact COLORS constants
- [ ] Follows spacing rules (8px multiples)
- [ ] Includes proper shadows and elevation
- [ ] Has consistent border radius (8px cards, 24px buttons)
- [ ] Implements accessibility props
- [ ] Matches typography hierarchy
- [ ] Follows naming conventions
