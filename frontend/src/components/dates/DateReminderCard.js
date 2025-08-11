/**
 * BLONG DateReminderCard Component - Premium Elite Design
 * Smart reminder system for dates with different reminder types and actions
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated,
  Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');

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

const DateReminderCard = ({ 
  reminder,
  date,
  onDismiss,
  onSnooze,
  onAction,
  style,
  isRTL = false
}) => {
  const [slideAnim] = useState(new Animated.Value(0));
  const [isExpanded, setIsExpanded] = useState(false);

  const getReminderConfig = (type) => {
    const configs = {
      DATE_CONFIRMATION: {
        icon: '📅',
        color: COLORS.accent,
        bgColor: COLORS.accent + '15',
        title: 'Confirm Your Date',
        urgency: 'medium',
        actionText: 'Confirm',
      },
      PREPARATION_TIPS: {
        icon: '💡',
        color: COLORS.warning,
        bgColor: COLORS.warning + '15',
        title: 'Preparation Tips',
        urgency: 'low',
        actionText: 'View Tips',
      },
      VENUE_DIRECTIONS: {
        icon: '🗺️',
        color: COLORS.success,
        bgColor: COLORS.success + '15', 
        title: 'Get Directions',
        urgency: 'medium',
        actionText: 'Directions',
      },
      PRE_DATE_REMINDER: {
        icon: '⏰',
        color: COLORS.error,
        bgColor: COLORS.error + '15',
        title: 'Date Starting Soon!',
        urgency: 'high',
        actionText: 'I\'m Ready',
      },
      POST_DATE_FEEDBACK: {
        icon: '💭',
        color: COLORS.accent,
        bgColor: COLORS.accent + '15',
        title: 'How Was Your Date?',
        urgency: 'low',
        actionText: 'Give Feedback',
      },
      FOLLOW_UP: {
        icon: '💕',
        color: COLORS.success,
        bgColor: COLORS.success + '15',
        title: 'Follow Up',
        urgency: 'low',
        actionText: 'Send Message',
      },
    };

    return configs[type] || configs.DATE_CONFIRMATION;
  };

  const getTimeUntilReminder = () => {
    const now = new Date();
    const reminderTime = new Date(reminder.scheduledFor);
    const diffMs = reminderTime - now;
    
    if (diffMs <= 0) return 'Now';
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    }
    return `${diffMinutes}m`;
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: date.toLocaleDateString([], { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      }),
    };
  };

  const handleDismiss = () => {
    Animated.timing(slideAnim, {
      toValue: -width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (onDismiss) {
        onDismiss(reminder.id);
      }
    });
  };

  const handleSnooze = () => {
    if (onSnooze) {
      onSnooze(reminder.id, 15); // Snooze for 15 minutes
    }
  };

  const handleAction = () => {
    if (onAction) {
      onAction(reminder.reminderType, reminder, date);
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const config = getReminderConfig(reminder.reminderType);
  const dateTime = formatDateTime(reminder.scheduledFor);
  const timeUntil = getTimeUntilReminder();

  return (
    <Animated.View 
      style={[
        styles.container,
        { backgroundColor: config.bgColor },
        { transform: [{ translateX: slideAnim }] },
        style
      ]}
    >
      {/* Header */}
      <TouchableOpacity
        style={styles.header}
        onPress={toggleExpanded}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <View style={[styles.iconContainer, { backgroundColor: config.color }]}>
            <Text style={styles.icon}>{config.icon}</Text>
          </View>
          
          <View style={styles.headerText}>
            <Text style={styles.title}>{config.title}</Text>
            <Text style={styles.timeText}>
              {timeUntil === 'Now' ? 'Now' : `in ${timeUntil}`}
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          {config.urgency === 'high' && (
            <View style={styles.urgentBadge}>
              <Text style={styles.urgentText}>!</Text>
            </View>
          )}
          <Text style={[
            styles.expandIcon,
            isExpanded && styles.expandIconRotated
          ]}>
            ▼
          </Text>
        </View>
      </TouchableOpacity>

      {/* Expanded content */}
      {isExpanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.message}>
            {reminder.message}
          </Text>

          {/* Date information */}
          <View style={styles.dateInfo}>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>Date</Text>
              <Text style={styles.dateValue}>{dateTime.date}</Text>
            </View>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>Time</Text>
              <Text style={styles.dateValue}>{dateTime.time}</Text>
            </View>
            {date?.venue && (
              <View style={styles.dateItem}>
                <Text style={styles.dateLabel}>Venue</Text>
                <Text style={styles.dateValue} numberOfLines={1}>
                  {date.venue.name}
                </Text>
              </View>
            )}
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.dismissButton]}
              onPress={handleDismiss}
              activeOpacity={0.8}
            >
              <Text style={styles.dismissButtonText}>Dismiss</Text>
            </TouchableOpacity>

            {reminder.reminderType !== 'POST_DATE_FEEDBACK' && (
              <TouchableOpacity
                style={[styles.actionButton, styles.snoozeButton]}
                onPress={handleSnooze}
                activeOpacity={0.8}
              >
                <Text style={styles.snoozeButtonText}>Snooze 15m</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.actionButton, 
                styles.primaryButton,
                { backgroundColor: config.color }
              ]}
              onPress={handleAction}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>
                {config.actionText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Quick action bar when collapsed */}
      {!isExpanded && (
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={handleDismiss}
            activeOpacity={0.7}
          >
            <Text style={styles.quickActionText}>✕</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: config.color }]}
            onPress={handleAction}
            activeOpacity={0.7}
          >
            <Text style={styles.quickActionTextPrimary}>
              {config.actionText}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Progress indicator for time-sensitive reminders */}
      {(config.urgency === 'high' || config.urgency === 'medium') && (
        <View style={styles.progressContainer}>
          <View style={[
            styles.progressBar,
            { backgroundColor: config.color }
          ]} />
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
    // Premium shadow
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 18,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  timeText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  urgentBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.error,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  urgentText: {
    color: COLORS.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
  expandIcon: {
    fontSize: 10,
    color: COLORS.textSecondary,
    transform: [{ rotate: '0deg' }],
  },
  expandIconRotated: {
    transform: [{ rotate: '180deg' }],  
  },
  expandedContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border + '50',
  },
  message: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  dateInfo: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  dateItem: {
    flex: 1,
    marginRight: 12,
  },
  dateLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  dismissButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dismissButtonText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  snoozeButton: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  snoozeButtonText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  primaryButton: {
    // backgroundColor set dynamically
  },
  primaryButtonText: {
    fontSize: 14,
    color: COLORS.background,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  quickAction: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
  },
  quickActionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  quickActionTextPrimary: {
    fontSize: 14,
    color: COLORS.background,
    fontWeight: '600',
  },
  progressContainer: {
    height: 2,
  },
  progressBar: {
    height: '100%',
    width: '100%',
    opacity: 0.3,
  },
});

export default DateReminderCard;