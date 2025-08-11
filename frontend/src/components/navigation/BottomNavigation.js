import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { a11y } from '../../utils/AccessibilityUtils';

// MANDATORY COLORS - Following Design Rules
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

const BottomNavigation = ({
  activeTab,
  onTabPress,
  isProfileComplete = false
}) => {
  // Elite tab configuration with professional Ionicons
  const tabs = [
    {
      id: 'home',
      icon: 'home-outline',
      activeIcon: 'home',
      label: 'Home',
      enabled: true,
    },
    {
      id: 'quizzes',
      icon: 'help-circle-outline',
      activeIcon: 'help-circle',
      label: 'Quizzes',
      enabled: true,
    },
    {
      id: 'dates',
      icon: 'heart-outline',
      activeIcon: 'heart',
      label: 'Dates',
      enabled: isProfileComplete, // Only enabled when profile is complete
    },
    {
      id: 'articles',
      icon: 'library-outline',
      activeIcon: 'library',
      label: 'Articles',
      enabled: true,
    },
    {
      id: 'settings',
      icon: 'settings-outline',
      activeIcon: 'settings',
      label: 'Settings',
      enabled: true,
    },
  ];

  return (
    <View style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: COLORS.background,
      borderTopWidth: 1,
      borderTopColor: COLORS.border,
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 8,
    }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}>
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const isEnabled = tab.enabled;

          // Handle tab press with haptic feedback
          const handleTabPress = async () => {
            if (!isEnabled) {
              // Warning haptic for disabled tabs
              if (Haptics?.notificationAsync) {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              }
              return;
            }

            // Success haptic for enabled tabs
            if (Haptics?.impactAsync) {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            
            onTabPress(tab.id);
          };

          // Accessibility props
          const accessibilityProps = a11y.navigationAccessibility.getTabProps(
            tab,
            isActive,
            index,
            tabs.length
          );

          return (
            <TouchableOpacity
              key={tab.id}
              onPress={handleTabPress}
              disabled={!isEnabled}
              style={{
                flex: 1,
                alignItems: 'center',
                paddingVertical: 8,
                opacity: isEnabled ? 1 : 0.4,
                ...a11y.touchTarget.getStyles(),
              }}
              activeOpacity={0.7}
              {...accessibilityProps}
            >
              {/* Elite tab styling with professional icons */}
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 4,
                backgroundColor: isActive ? COLORS.accent : 'transparent',
              }}>
                <Ionicons
                  name={isActive ? tab.activeIcon : tab.icon}
                  size={20}
                  color={isActive ? COLORS.background : COLORS.textSecondary}
                />
              </View>

              <Text style={{
                fontSize: 10,
                fontWeight: isActive ? '500' : '300',
                color: isActive ? COLORS.accent : COLORS.textSecondary,
                letterSpacing: 0.5,
                textAlign: 'center',
              }}>
                {tab.label}
              </Text>

              {/* Active indicator dot */}
              {isActive && (
                <View style={{
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: COLORS.accent,
                  marginTop: 2,
                }} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
      <SafeAreaView />
    </View>
  );
};

export default BottomNavigation;
