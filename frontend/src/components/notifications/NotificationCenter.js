/**
 * BLONG NotificationCenter Component - Premium Elite Design
 * Central hub for all user notifications with real-time updates
 */

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl,
  Animated 
} from 'react-native';
import { useTheme } from '../../contexts/AppContext';
import NotificationCard from './NotificationCard';
import EmptyNotificationsState from './EmptyNotificationsState';
import { PremiumInlineLoader } from '../loading';

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

const NotificationCenter = ({
  notifications = [],
  loading = false,
  refreshing = false,
  hasMore = false,
  unreadCount = 0,
  onRefresh,
  onLoadMore,
  onNotificationPress,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  style
}) => {
  const { isRTL } = useTheme();
  const [selectedTab, setSelectedTab] = useState('all'); // 'all', 'unread', 'read'
  const fadeAnim = new Animated.Value(1);

  // Filter notifications based on selected tab
  const filteredNotifications = notifications.filter(notification => {
    if (selectedTab === 'unread') return !notification.isRead;
    if (selectedTab === 'read') return notification.isRead;
    return true; // 'all'
  });

  const handleNotificationPress = async (notification) => {
    if (!notification.isRead) {
      await onMarkAsRead(notification.id);
    }
    onNotificationPress?.(notification);
  };

  const handleMarkAllAsRead = async () => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.5, duration: 200, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true })
    ]).start();
    
    await onMarkAllAsRead();
  };

  const renderHeader = () => (
    <View style={{
      paddingHorizontal: 24,
      paddingVertical: 20,
      backgroundColor: COLORS.background,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    }}>
      {/* Title and Actions */}
      <View style={{
        flexDirection: isRTL ? 'row-reverse' : 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
      }}>
        <Text style={{
          fontSize: 24,
          fontWeight: '600',
          color: COLORS.text,
        }}>
          Notifications
        </Text>

        {unreadCount > 0 && (
          <TouchableOpacity
            onPress={handleMarkAllAsRead}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              backgroundColor: COLORS.surface,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
            activeOpacity={0.7}
          >
            <Text style={{
              fontSize: 12,
              fontWeight: '500',
              color: COLORS.accent,
            }}>
              Mark All Read
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tab Navigation */}
      <View style={{
        flexDirection: isRTL ? 'row-reverse' : 'row',
        backgroundColor: COLORS.surface,
        borderRadius: 25,
        padding: 4,
      }}>
        {[
          { key: 'all', label: 'All', count: notifications.length },
          { key: 'unread', label: 'Unread', count: unreadCount },
          { key: 'read', label: 'Read', count: notifications.length - unreadCount }
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setSelectedTab(tab.key)}
            style={{
              flex: 1,
              paddingVertical: 12,
              paddingHorizontal: 16,
              backgroundColor: selectedTab === tab.key ? COLORS.accent : 'transparent',
              borderRadius: 21,
              alignItems: 'center',
            }}
            activeOpacity={0.7}
          >
            <View style={{
              flexDirection: isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
            }}>
              <Text style={{
                fontSize: 14,
                fontWeight: selectedTab === tab.key ? '600' : '500',
                color: selectedTab === tab.key ? '#FFFFFF' : COLORS.textSecondary,
                marginRight: isRTL ? 0 : (tab.count > 0 ? 6 : 0),
                marginLeft: isRTL ? (tab.count > 0 ? 6 : 0) : 0,
              }}>
                {tab.label}
              </Text>
              
              {tab.count > 0 && (
                <View style={{
                  backgroundColor: selectedTab === tab.key 
                    ? 'rgba(255, 255, 255, 0.3)' 
                    : COLORS.accent,
                  borderRadius: 10,
                  minWidth: 20,
                  height: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 6,
                }}>
                  <Text style={{
                    fontSize: 11,
                    fontWeight: '600',
                    color: selectedTab === tab.key ? '#FFFFFF' : '#FFFFFF',
                  }}>
                    {tab.count > 99 ? '99+' : tab.count}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderNotificationList = () => {
    if (loading && filteredNotifications.length === 0) {
      return (
        <View style={{ paddingVertical: 40 }}>
          <PremiumInlineLoader
            message="Loading notifications..."
            size="medium"
          />
        </View>
      );
    }

    if (filteredNotifications.length === 0) {
      return (
        <EmptyNotificationsState
          type={selectedTab}
          onRefresh={onRefresh}
        />
      );
    }

    return (
      <Animated.View style={{ opacity: fadeAnim }}>
        {filteredNotifications.map((notification, index) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onPress={() => handleNotificationPress(notification)}
            onMarkAsRead={() => onMarkAsRead(notification.id)}
            onDelete={() => onDeleteNotification(notification.id)}
            isRTL={isRTL}
            style={{
              marginHorizontal: 16,
              marginBottom: 12,
            }}
          />
        ))}

        {hasMore && (
          <TouchableOpacity
            onPress={onLoadMore}
            style={{
              marginHorizontal: 16,
              marginVertical: 20,
              paddingVertical: 16,
              backgroundColor: COLORS.surface,
              borderRadius: 12,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
            activeOpacity={0.7}
          >
            <Text style={{
              fontSize: 14,
              fontWeight: '500',
              color: COLORS.accent,
            }}>
              Load More Notifications
            </Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    );
  };

  return (
    <View style={[{ flex: 1, backgroundColor: COLORS.background }, style]}>
      {renderHeader()}
      
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.accent]}
            tintColor={COLORS.accent}
          />
        }
        contentContainerStyle={{
          paddingBottom: 100,
          paddingTop: 16,
        }}
      >
        {renderNotificationList()}
      </ScrollView>
    </View>
  );
};

export default NotificationCenter;