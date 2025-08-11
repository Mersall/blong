---
type: "always_apply"
description: "Example description"
---
# BLONG Screen Patterns - Implementation Templates

## 🎨 MANDATORY SCREEN TEMPLATES

### 1. HOME/DASHBOARD SCREEN PATTERN

```javascript
const HomeScreen = ({ userPreferences, user, onLogout, onNavigateToQuestionnaire }) => {
  const [completionStatus, setCompletionStatus] = useState({});
  const [progressPercentages, setProgressPercentages] = useState({});

  // ALWAYS include COLORS constant
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

  return (
    <AppTransition>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

        {/* MANDATORY Elite Header */}
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

          <Text style={{
            fontSize: 20,
            fontWeight: '300',
            color: COLORS.text,
            marginBottom: 8,
            textAlign: 'center',
          }}>
            Welcome back, {user?.firstName}
          </Text>

          <Text style={{
            fontSize: 14,
            color: COLORS.textSecondary,
            textAlign: 'center',
            lineHeight: 20,
          }}>
            Your elite matrimonial experience continues
          </Text>

          {/* Logout button */}
          <TouchableOpacity
            onPress={onLogout}
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
              Logout
            </Text>
          </TouchableOpacity>
        </View>

        {/* MANDATORY ScrollView structure */}
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Content goes here */}
        </ScrollView>
      </SafeAreaView>
    </AppTransition>
  );
};
```

### 2. FORM/QUESTIONNAIRE SCREEN PATTERN

```javascript
const QuestionnaireScreen = ({ userPhase, onComplete }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState({});

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

  return (
    <AppTransition>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

        {/* Elite Header with Back Button */}
        <View style={{
          paddingTop: 40,
          paddingBottom: 24,
          paddingHorizontal: 32,
          backgroundColor: COLORS.background,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={{ fontSize: 16, color: COLORS.accent }}>← Back</Text>
            </TouchableOpacity>
            
            <Text style={{
              fontSize: 18,
              fontWeight: '300',
              color: COLORS.text,
              letterSpacing: 1,
            }}>
              Complete Profile
            </Text>
            
            <View style={{ width: 50 }} />
          </View>
        </View>

        {/* Progress Bar */}
        <View style={{
          paddingHorizontal: 32,
          paddingVertical: 16,
          backgroundColor: COLORS.surface,
        }}>
          <Text style={{
            fontSize: 12,
            color: COLORS.textSecondary,
            marginBottom: 8,
          }}>
            Section {currentSection + 1} of {totalSections}
          </Text>
          <View style={{
            height: 4,
            backgroundColor: COLORS.border,
            borderRadius: 2,
          }}>
            <View style={{
              height: 4,
              backgroundColor: COLORS.accent,
              borderRadius: 2,
              width: `${((currentSection + 1) / totalSections) * 100}%`,
            }} />
          </View>
        </View>

        {/* Form Content */}
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 32, paddingVertical: 24 }}
        >
          {/* Form fields go here */}
        </ScrollView>

        {/* Navigation Footer */}
        <View style={{
          paddingHorizontal: 32,
          paddingVertical: 16,
          backgroundColor: COLORS.background,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
          <TouchableOpacity
            style={{
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 24,
              backgroundColor: COLORS.surface,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <Text style={{ fontSize: 14, color: COLORS.textSecondary }}>Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 24,
              backgroundColor: COLORS.accent,
            }}
          >
            <Text style={{ fontSize: 14, color: COLORS.background, fontWeight: '500' }}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </AppTransition>
  );
};
```

### 3. LIST/BROWSE SCREEN PATTERN

```javascript
const ListScreen = ({ title, items, onItemPress }) => {
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

  return (
    <AppTransition>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

        {/* Simple Header */}
        <View style={{
          paddingTop: 40,
          paddingBottom: 24,
          paddingHorizontal: 32,
          alignItems: 'center',
          backgroundColor: COLORS.background,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        }}>
          <Text style={{
            fontSize: 24,
            fontWeight: '300',
            color: COLORS.text,
            letterSpacing: 1,
          }}>
            {title}
          </Text>
        </View>

        {/* List Content */}
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 32, paddingVertical: 24 }}
        >
          {items.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => onItemPress(item)}
              style={{
                backgroundColor: COLORS.surface,
                borderRadius: 8,
                padding: 20,
                marginBottom: 16,
                shadowColor: COLORS.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
            >
              {/* Item content */}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </AppTransition>
  );
};
```

### 4. PROFILE/SETTINGS SCREEN PATTERN

```javascript
const ProfileScreen = ({ user, sections }) => {
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

  return (
    <AppTransition>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

        {/* Profile Header */}
        <View style={{
          paddingTop: 40,
          paddingBottom: 32,
          paddingHorizontal: 32,
          alignItems: 'center',
          backgroundColor: COLORS.background,
        }}>
          {/* Profile Avatar */}
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: COLORS.surface,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16,
            borderWidth: 2,
            borderColor: COLORS.border,
          }}>
            <Text style={{ fontSize: 32 }}>👤</Text>
          </View>

          <Text style={{
            fontSize: 24,
            fontWeight: '300',
            color: COLORS.text,
            marginBottom: 8,
          }}>
            {user?.firstName} {user?.lastName}
          </Text>

          <Text style={{
            fontSize: 14,
            color: COLORS.textSecondary,
          }}>
            {user?.email}
          </Text>
        </View>

        {/* Profile Sections */}
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 120 }}
        >
          {sections.map((section, index) => (
            <View key={index} style={{ marginBottom: 24 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '300',
                color: COLORS.text,
                marginBottom: 16,
                letterSpacing: 0.5,
              }}>
                {section.title}
              </Text>

              <View style={{
                backgroundColor: COLORS.surface,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}>
                {section.items.map((item, itemIndex) => (
                  <TouchableOpacity
                    key={itemIndex}
                    style={{
                      padding: 20,
                      borderBottomWidth: itemIndex < section.items.length - 1 ? 1 : 0,
                      borderBottomColor: COLORS.border,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{ fontSize: 18, marginRight: 12 }}>{item.icon}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={{
                          fontSize: 14,
                          fontWeight: '300',
                          color: COLORS.text,
                        }}>
                          {item.title}
                        </Text>
                      </View>
                      <Text style={{ fontSize: 14, color: COLORS.accent }}>→</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </AppTransition>
  );
};
```

## 🎯 PATTERN SELECTION GUIDE

### Use HOME PATTERN for:
- Dashboard screens
- Main navigation screens
- Status overview screens

### Use FORM PATTERN for:
- Questionnaires
- Registration forms
- Settings forms
- Multi-step processes

### Use LIST PATTERN for:
- Browse screens (matches, messages)
- Search results
- Category listings

### Use PROFILE PATTERN for:
- User profiles
- Settings screens
- Account management

## 📋 IMPLEMENTATION CHECKLIST

For every screen:
- [ ] Uses AppTransition wrapper
- [ ] Includes SafeAreaView with COLORS.background
- [ ] Sets StatusBar to dark-content
- [ ] Follows header pattern (Elite or Simple)
- [ ] Uses ScrollView with proper contentContainerStyle
- [ ] Implements 32px horizontal padding
- [ ] Includes 120px bottom padding for navigation
- [ ] Uses exact COLORS constants
- [ ] Follows typography hierarchy
- [ ] Implements proper spacing (8px multiples)
