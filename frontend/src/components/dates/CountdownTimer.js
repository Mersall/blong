/**
 * BLONG CountdownTimer Component - Premium Elite Design
 * Elegant countdown timer for upcoming dates
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
};

const CountdownTimer = ({ 
  targetDate, 
  style,
  showLabels = true,
  size = 'medium',
  theme = 'default'
}) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(targetDate) - +new Date();
    
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isActive: true,
      };
    }
    
    return { isActive: false };
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          numberText: { fontSize: 16, lineHeight: 20 },
          labelText: { fontSize: 10, marginTop: 2 },
          container: { paddingHorizontal: 8, paddingVertical: 6 },
        };
      case 'large':
        return {
          numberText: { fontSize: 28, lineHeight: 32 },
          labelText: { fontSize: 12, marginTop: 4 },
          container: { paddingHorizontal: 16, paddingVertical: 12 },
        };
      default: // medium
        return {
          numberText: { fontSize: 20, lineHeight: 24 },
          labelText: { fontSize: 11, marginTop: 3 },
          container: { paddingHorizontal: 12, paddingVertical: 8 },
        };
    }
  };

  const getThemeStyles = () => {
    switch (theme) {
      case 'accent':
        return {
          background: COLORS.accent,
          textColor: COLORS.background,
          labelColor: COLORS.background,
        };
      case 'minimal':
        return {
          background: 'transparent',
          textColor: COLORS.text,
          labelColor: COLORS.textSecondary,
        };
      default:
        return {
          background: COLORS.surface,
          textColor: COLORS.text,
          labelColor: COLORS.textSecondary,
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const themeStyles = getThemeStyles();

  if (!timeLeft.isActive) {
    return (
      <View style={[styles.container, style]}>
        <Text style={[styles.expiredText, { color: themeStyles.textColor }]}>
          Date has started!
        </Text>
      </View>
    );
  }

  const formatTimeUnit = (value) => {
    return value.toString().padStart(2, '0');
  };

  const timeUnits = [
    { value: timeLeft.days, label: 'Days', shortLabel: 'd' },
    { value: timeLeft.hours, label: 'Hours', shortLabel: 'h' },
    { value: timeLeft.minutes, label: 'Minutes', shortLabel: 'm' },
    { value: timeLeft.seconds, label: 'Seconds', shortLabel: 's' },
  ];

  // Filter out zero values for cleaner display
  const activeUnits = timeUnits.filter((unit, index) => {
    // Always show at least minutes and seconds
    if (index >= 2) return true;
    // Show days/hours only if they have values or if larger units have values
    return unit.value > 0 || timeUnits.slice(0, index).some(u => u.value > 0);
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.timerContainer}>
        {activeUnits.map((unit, index) => (
          <React.Fragment key={unit.label}>
            <View style={[
              styles.timeUnit,
              sizeStyles.container,
              { backgroundColor: themeStyles.background }
            ]}>
              <Text style={[
                styles.timeNumber,
                sizeStyles.numberText,
                { color: themeStyles.textColor }
              ]}>
                {formatTimeUnit(unit.value)}
              </Text>
              {showLabels && (
                <Text style={[
                  styles.timeLabel,
                  sizeStyles.labelText,
                  { color: themeStyles.labelColor }
                ]}>
                  {size === 'small' ? unit.shortLabel : unit.label}
                </Text>
              )}
            </View>
            {index < activeUnits.length - 1 && (
              <Text style={[
                styles.separator,
                { color: themeStyles.labelColor }
              ]}>
                :
              </Text>
            )}
          </React.Fragment>
        ))}
      </View>
      
      {timeLeft.days === 0 && timeLeft.hours < 2 && (
        <View style={styles.urgentIndicator}>
          <View style={styles.urgentDot} />
          <Text style={styles.urgentText}>Starting soon!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeUnit: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginHorizontal: 2,
    minWidth: 40,
    // Subtle elevation
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  timeNumber: {
    fontWeight: '600',
    textAlign: 'center',
  },
  timeLabel: {
    fontWeight: '400',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  separator: {
    fontSize: 18,
    fontWeight: '300',
    marginHorizontal: 4,
    opacity: 0.6,
  },
  expiredText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  urgentIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: COLORS.warning + '15', // 15% opacity
    borderRadius: 12,
  },
  urgentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.warning,
    marginRight: 6,
  },
  urgentText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.warning,
  },
});

export default CountdownTimer;