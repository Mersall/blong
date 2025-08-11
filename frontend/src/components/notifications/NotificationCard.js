/**
 * BLONG NotificationCard Component - Premium Elite Design
 * Individual notification display with rich content and actions
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Animated,
  Alert 
} from 'react-native';
import { useTheme } from '../../contexts/AppContext';

// MANDATORY COLORS - Following Design Rules
const COLORS = {
  background: '#FFFFFF',
  surface: '#FAFAFA',
  text: '#0A0A0A',
  textSecondary: '#6B6B6B',
  textTertiary: '#9E9E9E',
  accent: '#FF6B35',
  border: '#E0E0E0',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  unreadIndicator: '#FF6B35',
  readBackground: '#F8F8F8',
};

const NotificationCard = ({
  notification,
  onPress,
  onMarkAsRead,
  onDelete,
  isRTL = false,
  style
}) => {
  const [scaleAnim] = useState(new Animated.Value(1));
  const [slideAnim] = useState(new Animated.Value(0));

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true })
    ]).start();
  };

  const handlePress = () => {
    animatePress();
    onPress?.(notification);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            Animated.timing(slideAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true
            }).start(() => onDelete?.(notification.id));
          }
        }
      ]
    );
  };

  const getNotificationIcon = (type, data) => {
    if (data?.type) {
      switch (data.type) {
        case 'date_confirmation':
          return '🎉';
        case 'preparation_tips':
          return '✨';
        case 'venue_directions':
          return '🗺️';
        case 'pre_date_reminder':
          return '💫';
        case 'post_date_feedback':
          return '💭';
        case 'follow_up':
          return '🌟';
        default:
          return '📱';
      }
    }
    
    switch (type) {
      case 'DATE_AVAILABLE':
        return '💝';
      case 'PROFILE_VIEW':
        return '👁️';
      case 'DATE_UPDATE':
        return '📅';
      case 'SYSTEM':
        return '📱';
      default:
        return '📱';
    }
  };

  const getNotificationColor = (type, data) => {
    if (data?.type) {
      switch (data.type) {
        case 'date_confirmation':
          return COLORS.success;
        case 'preparation_tips':
          return COLORS.accent;
        case 'venue_directions':
          return COLORS.warning;
        case 'pre_date_reminder':
          return COLORS.error;
        case 'post_date_feedback':
          return COLORS.accent;
        case 'follow_up':
          return COLORS.success;
        default:
          return COLORS.accent;
      }
    }
    
    switch (type) {
      case 'DATE_AVAILABLE':
        return COLORS.success;
      case 'PROFILE_VIEW':
        return COLORS.accent;
      case 'DATE_UPDATE':
        return COLORS.warning;
      case 'SYSTEM':
        return COLORS.textSecondary;
      default:
        return COLORS.accent;
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return notificationDate.toLocaleDateString();
  };

  const notificationColor = getNotificationColor(notification.type, notification.data);
  const notificationIcon = getNotificationIcon(notification.type, notification.data);

  return (
    <Animated.View
      style={[
        {
          transform: [
            { scale: scaleAnim },
            {
              translateX: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 300]
              })
            }
          ]
        },
        style
      ]}
    >
      <TouchableOpacity
        onPress={handlePress}
        style={{
          backgroundColor: notification.isRead ? COLORS.readBackground : COLORS.background,
          borderRadius: 16,
          padding: 16,
          borderWidth: 1,
          borderColor: notification.isRead ? COLORS.border : notificationColor,
          borderLeftWidth: notification.isRead ? 1 : 4,
          shadowColor: COLORS.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: notification.isRead ? 0.05 : 0.1,
          shadowRadius: 8,
          elevation: notification.isRead ? 2 : 4,
        }}
        activeOpacity={0.9}
      >
        <View style={{
          flexDirection: isRTL ? 'row-reverse' : 'row',
          alignItems: 'flex-start',
        }}>
          {/* Notification Icon */}
          <View style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: `${notificationColor}15`,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: isRTL ? 0 : 12,
            marginLeft: isRTL ? 12 : 0,
          }}>
            <Text style={{ fontSize: 18 }}>
              {notificationIcon}
            </Text>
          </View>

          {/* Content */}
          <View style={{ flex: 1 }}>
            {/* Header */}
            <View style={{
              flexDirection: isRTL ? 'row-reverse' : 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 4,
            }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: notification.isRead ? '500' : '600',
                  color: COLORS.text,
                  flex: 1,
                  marginRight: isRTL ? 0 : 8,
                  marginLeft: isRTL ? 8 : 0,
                }}
                numberOfLines={2}
              >
                {notification.title}
              </Text>

              <View style={{
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
              }}>
                <Text style={{
                  fontSize: 12,
                  color: COLORS.textTertiary,
                  marginRight: isRTL ? 0 : 8,
                  marginLeft: isRTL ? 8 : 0,
                }}>
                  {formatTimeAgo(notification.createdAt)}
                </Text>

                {!notification.isRead && (
                  <View style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: COLORS.unreadIndicator,
                  }} />
                )}
              </View>
            </View>

            {/* Message */}
            <Text
              style={{
                fontSize: 14,
                color: COLORS.textSecondary,
                lineHeight: 20,
                marginBottom: 12,
              }}
              numberOfLines={3}
            >
              {notification.message}
            </Text>

            {/* Action Buttons */}
            <View style={{
              flexDirection: isRTL ? 'row-reverse' : 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              {/* Date-specific action buttons */}
              {notification.data?.type && (
                <View style={{
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                  flex: 1,
                }}>
                  {notification.data.type === 'preparation_tips' && (
                    <TouchableOpacity
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        backgroundColor: COLORS.accent,
                        borderRadius: 12,
                        marginRight: isRTL ? 0 : 8,
                        marginLeft: isRTL ? 8 : 0,
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={{
                        fontSize: 12,
                        fontWeight: '600',
                        color: '#FFFFFF',
                      }}>
                        View Tips
                      </Text>
                    </TouchableOpacity>
                  )}

                  {notification.data.type === 'venue_directions' && (
                    <TouchableOpacity
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        backgroundColor: COLORS.success,
                        borderRadius: 12,
                        marginRight: isRTL ? 0 : 8,
                        marginLeft: isRTL ? 8 : 0,
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={{
                        fontSize: 12,
                        fontWeight: '600',
                        color: '#FFFFFF',
                      }}>
                        Get Directions
                      </Text>
                    </TouchableOpacity>
                  )}

                  {notification.data.type === 'post_date_feedback' && (
                    <TouchableOpacity
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        backgroundColor: COLORS.warning,
                        borderRadius: 12,
                        marginRight: isRTL ? 0 : 8,
                        marginLeft: isRTL ? 8 : 0,
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={{
                        fontSize: 12,
                        fontWeight: '600',
                        color: '#FFFFFF',
                      }}>
                        Give Feedback
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* General action buttons */}
              <View style={{
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
              }}>
                {!notification.isRead && (
                  <TouchableOpacity
                    onPress={() => onMarkAsRead?.(notification.id)}
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      marginRight: isRTL ? 0 : 8,
                      marginLeft: isRTL ? 8 : 0,
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={{
                      fontSize: 12,
                      color: COLORS.accent,
                      fontWeight: '500',
                    }}>
                      Mark Read
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={handleDelete}
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={{
                    fontSize: 12,
                    color: COLORS.textTertiary,
                    fontWeight: '500',
                  }}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default NotificationCard;