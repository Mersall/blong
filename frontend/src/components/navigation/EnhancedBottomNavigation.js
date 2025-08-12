/**
 * BLONG Enhanced Bottom Navigation
 * Premium navigation with animations, haptic feedback, and sophisticated UX
 */

import React, { useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  Animated, 
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useApp } from '../../contexts/AppContext';
import { safeTranslate } from '../../localization/i18n';
import { a11y } from '../../utils/AccessibilityUtils';

const { width: screenWidth } = Dimensions.get('window');

// Elite color system
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
  gradient: {
    active: ['#FF6B35', '#FF8A65'],
    inactive: ['transparent', 'transparent'],
  },
};

const EnhancedBottomNavigation = ({
  activeTab,
  onTabPress,
  isProfileComplete = false,
  userPhase = 'single',
  notificationCount = 0,
}) => {
  const { t } = useApp();
  const homeAnimRef = useRef(new Animated.Value(1));
  const datesAnimRef = useRef(new Animated.Value(1));
  const articlesAnimRef = useRef(new Animated.Value(1));
  const settingsAnimRef = useRef(new Animated.Value(1));

  const tabAnimations = React.useMemo(() => (
    new Map([
      ['home', homeAnimRef.current],
      ['dates', datesAnimRef.current],
      ['articles', articlesAnimRef.current],
      ['settings', settingsAnimRef.current],
    ])
  ), []);

  const indicatorAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Elite tab configuration with professional Ionicons
  const tabs = React.useMemo(() => ([
    {
      id: 'home',
      icon: 'home-outline',
      activeIcon: 'home',
      label: safeTranslate(t, 'navigation.home', 'Home'),
      enabled: true,
      color: COLORS.accent,
    },
    {
      id: 'dates',
      icon: 'heart-outline',
      activeIcon: 'heart',
      label: safeTranslate(t, 'navigation.dates', 'Dates'),
      enabled: isProfileComplete,
      color: '#E91E63',
      requiresProfile: true,
    },
    {
      id: 'articles',
      icon: 'library-outline',
      activeIcon: 'library',
      label: safeTranslate(t, 'navigation.articles', 'Articles'),
      enabled: true,
      color: '#9C27B0',
    },
    {
      id: 'settings',
      icon: 'settings-outline',
      activeIcon: 'settings',
      label: safeTranslate(t, 'navigation.settings', 'Settings'),
      enabled: true,
      color: COLORS.textSecondary,
      hasNotification: notificationCount > 0,
    },
  ]), [t, isProfileComplete, notificationCount]);

  useEffect(() => {
    // Animate indicator to active tab position
    const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
    const indicatorPosition = activeIndex * (screenWidth / tabs.length);
    
    Animated.spring(indicatorAnim, {
      toValue: indicatorPosition,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();

    // Pulse animation for tabs with notifications
    if (notificationCount > 0 && activeTab === 'settings') {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();

      return () => pulseAnimation.stop();
    }
  }, [activeTab, notificationCount, indicatorAnim, pulseAnim, tabs]);

  const handleTabPress = (tab) => {
    if (!tab.enabled) {
      // Haptic feedback for disabled tabs
      if (Haptics?.notificationAsync) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
      
      // Show tooltip or modal explaining why tab is disabled
      return;
    }

    // Success haptic feedback
    if (Haptics?.impactAsync) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Animate tab press
    const tabAnim = tabAnimations.get(tab.id);
    if (tabAnim) {
      Animated.sequence([
        Animated.timing(tabAnim, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(tabAnim, {
          toValue: 1,
          tension: 300,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();
    }

    onTabPress(tab.id);
  };

  const renderTab = (tab, index) => {
    const isActive = activeTab === tab.id;
    const isEnabled = tab.enabled;
    const tabAnim = tabAnimations.get(tab.id);

    // Enhanced accessibility props
    const accessibilityProps = {
      ...a11y.navigationAccessibility.getTabProps(tab, isActive, index, tabs.length),
      ...a11y.touchTarget.getStyles(),
      ...(tab.requiresProfile && !isProfileComplete && {
        accessibilityHint: 'Complete your profile to access this feature',
      }),
    };

    return (
      <TouchableOpacity
        key={tab.id}
        onPress={() => handleTabPress(tab)}
        disabled={!isEnabled}
        style={{
          flex: 1,
          alignItems: 'center',
          paddingVertical: 12,
          paddingHorizontal: 8,
        }}
        activeOpacity={0.7}
        {...accessibilityProps}
      >
        <Animated.View
          style={{
            alignItems: 'center',
            transform: tabAnim ? [{ scale: tabAnim }] : [],
          }}
        >
          {/* Tab Icon Container */}
          <View style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 4,
            position: 'relative',
          }}>
            {/* Active Tab Background */}
            {isActive && (
              <LinearGradient
                colors={COLORS.gradient.active}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: 24,
                  opacity: 0.9,
                }}
              />
            )}

            {/* Disabled Tab Overlay */}
            {!isEnabled && (
              <View style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: 24,
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                zIndex: 1,
              }} />
            )}

            {/* Tab Icon */}
            <Animated.View
              style={{
                opacity: isEnabled ? 1 : 0.4,
                transform: tab.hasNotification && tab.id === 'settings' 
                  ? [{ scale: pulseAnim }] 
                  : [],
              }}
            >
              <Ionicons
                name={isActive ? tab.activeIcon : tab.icon}
                size={22}
                color={isActive ? COLORS.background : tab.color || COLORS.textSecondary}
              />
            </Animated.View>

            {/* Notification Badge */}
            {tab.hasNotification && notificationCount > 0 && (
              <Animated.View
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: '#FF3B30',
                  justifyContent: 'center',
                  alignItems: 'center',
                  transform: [{ scale: pulseAnim }],
                }}
              >
                <Text style={{
                  color: COLORS.background,
                  fontSize: 8,
                  fontWeight: 'bold',
                }}>
                  {notificationCount > 9 ? '9+' : notificationCount}
                </Text>
              </Animated.View>
            )}

            {/* Profile Required Indicator */}
            {tab.requiresProfile && !isProfileComplete && (
              <View style={{
                position: 'absolute',
                top: 6,
                right: 6,
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: COLORS.warning,
              }} />
            )}
          </View>

          {/* Tab Label */}
          <Text style={{
            fontSize: 10,
            fontWeight: isActive ? '600' : '400',
            color: isActive 
              ? COLORS.accent 
              : isEnabled 
                ? COLORS.textSecondary 
                : COLORS.textTertiary,
            letterSpacing: 0.5,
            textAlign: 'center',
          }}>
            {tab.label}
          </Text>

          {/* Active Indicator Dot */}
          {isActive && (
            <View style={{
              width: 4,
              height: 4,
              borderRadius: 2,
              backgroundColor: COLORS.accent,
              marginTop: 4,
            }} />
          )}
        </Animated.View>
      </TouchableOpacity>
    );
  };

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
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 12,
    }}>
      {/* Floating Active Indicator */}
      <Animated.View
        style={{
          position: 'absolute',
          top: -2,
          width: screenWidth / tabs.length,
          height: 4,
          borderRadius: 2,
          transform: [{
            translateX: indicatorAnim,
          }],
        }}
      >
        <LinearGradient
          colors={COLORS.gradient.active}
          style={{
            flex: 1,
            borderRadius: 2,
          }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </Animated.View>

      {/* Tab Container */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingTop: 8,
        paddingBottom: 4,
      }}>
        {tabs.map((tab, index) => renderTab(tab, index))}
      </View>

      {/* Phase Progress Indicator */}
      {userPhase && (
        <View style={{
          paddingHorizontal: 16,
          paddingBottom: 8,
        }}>
          <View style={{
            height: 2,
            backgroundColor: COLORS.border,
            borderRadius: 1,
            overflow: 'hidden',
          }}>
            <View
              style={{
                width: userPhase === 'single' ? '33%' : userPhase === 'preparing' ? '66%' : '100%',
                height: '100%',
                backgroundColor: COLORS.accent,
                borderRadius: 1,
              }}
            />
          </View>
        </View>
      )}

      <SafeAreaView />
    </View>
  );
};

export default EnhancedBottomNavigation;