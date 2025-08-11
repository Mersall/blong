/**
 * BLONG Date Notification Widget
 * Premium dashboard widget for upcoming dates and events
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
  gold: '#FFD700',
};

const DateNotificationWidget = ({
  upcomingDates = [],
  dateRecommendations = [],
  onDatePress = null,
  onScheduleDate = null,
  userPhase = 'single',
  style = {},
}) => {
  const [activeTab, setActiveTab] = useState('upcoming'); // upcoming, suggestions
  const slideAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse animation for urgent dates
    const hasUrgentDates = upcomingDates.some(date => {
      const dateTime = new Date(date.scheduledFor);
      const now = new Date();
      const timeDiff = dateTime.getTime() - now.getTime();
      const hoursUntil = timeDiff / (1000 * 3600);
      return hoursUntil <= 24 && hoursUntil > 0;
    });

    if (hasUrgentDates) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
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
  }, [upcomingDates]);

  const getTimeUntilDate = (dateString) => {
    const dateTime = new Date(dateString);
    const now = new Date();
    const timeDiff = dateTime.getTime() - now.getTime();
    
    if (timeDiff < 0) return 'Past';
    
    const days = Math.floor(timeDiff / (1000 * 3600 * 24));
    const hours = Math.floor((timeDiff % (1000 * 3600 * 24)) / (1000 * 3600));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;
    return 'Soon';
  };

  const getDateEmoji = (type) => {
    const emojis = {
      coffee: '☕',
      dinner: '🍽️',
      movie: '🎬',
      activity: '🎯',
      cultural: '🎨',
      outdoor: '🌳',
      casual: '☕',
      formal: '🥂',
      virtual: '💻',
      default: '💝',
    };
    return emojis[type] || emojis.default;
  };

  const renderUpcomingDates = () => {
    if (upcomingDates.length === 0) {
      return (
        <View style={{
          alignItems: 'center',
          paddingVertical: 20,
        }}>
          <Text style={{ fontSize: 32, marginBottom: 12 }}>📅</Text>
          <Text style={{
            fontSize: 14,
            color: COLORS.textSecondary,
            textAlign: 'center',
            marginBottom: 16,
          }}>
            No upcoming dates scheduled
          </Text>
          <TouchableOpacity
            onPress={onScheduleDate}
            style={{
              backgroundColor: COLORS.accent,
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 20,
            }}
          >
            <Text style={{
              color: COLORS.background,
              fontSize: 12,
              fontWeight: '500',
            }}>
              Schedule a Date
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 16 }}
        contentContainerStyle={{ paddingHorizontal: 4 }}
      >
        {upcomingDates.map((date, index) => {
          const timeUntil = getTimeUntilDate(date.scheduledFor);
          const isUrgent = timeUntil.includes('h') && !timeUntil.includes('d');
          
          return (
            <TouchableOpacity
              key={date.id || index}
              onPress={() => onDatePress && onDatePress(date)}
              style={{
                width: screenWidth * 0.7,
                marginRight: 12,
              }}
            >
              <Animated.View
                style={{
                  transform: isUrgent ? [{ scale: pulseAnim }] : [],
                }}
              >
                <LinearGradient
                  colors={isUrgent 
                    ? [COLORS.warning + '20', COLORS.warning + '10']
                    : [COLORS.surface, COLORS.background]
                  }
                  style={{
                    borderRadius: 12,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: isUrgent ? COLORS.warning : COLORS.border,
                  }}
                >
                  {/* Date Header */}
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12,
                  }}>
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                      <Text style={{ fontSize: 20, marginRight: 8 }}>
                        {getDateEmoji(date.type)}
                      </Text>
                      <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: COLORS.text,
                      }}>
                        {date.title || 'Date'}
                      </Text>
                    </View>
                    
                    <View style={{
                      backgroundColor: isUrgent ? COLORS.warning : COLORS.accent,
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 12,
                    }}>
                      <Text style={{
                        color: COLORS.background,
                        fontSize: 10,
                        fontWeight: '600',
                      }}>
                        {timeUntil}
                      </Text>
                    </View>
                  </View>

                  {/* Date Details */}
                  <Text style={{
                    fontSize: 12,
                    color: COLORS.textSecondary,
                    marginBottom: 8,
                  }}>
                    {date.venue || 'Location TBD'}
                  </Text>

                  <Text style={{
                    fontSize: 10,
                    color: COLORS.textTertiary,
                  }}>
                    {new Date(date.scheduledFor).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </LinearGradient>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  const renderDateSuggestions = () => {
    if (dateRecommendations.length === 0) {
      return (
        <View style={{
          alignItems: 'center',
          paddingVertical: 20,
        }}>
          <Text style={{ fontSize: 32, marginBottom: 12 }}>💡</Text>
          <Text style={{
            fontSize: 14,
            color: COLORS.textSecondary,
            textAlign: 'center',
          }}>
            Date suggestions will appear here based on your personality and preferences
          </Text>
        </View>
      );
    }

    return (
      <View style={{ marginTop: 16 }}>
        {dateRecommendations.slice(0, 3).map((suggestion, index) => (
          <TouchableOpacity
            key={suggestion.id || index}
            onPress={() => onScheduleDate && onScheduleDate(suggestion)}
            style={{
              backgroundColor: COLORS.surface,
              borderRadius: 12,
              padding: 16,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: COLORS.border,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: `${COLORS.accent}20`,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12,
            }}>
              <Text style={{ fontSize: 16 }}>
                {getDateEmoji(suggestion.type)}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 14,
                fontWeight: '500',
                color: COLORS.text,
                marginBottom: 4,
              }}>
                {suggestion.title}
              </Text>
              <Text style={{
                fontSize: 12,
                color: COLORS.textSecondary,
                marginBottom: 4,
              }}>
                {suggestion.description}
              </Text>
              <Text style={{
                fontSize: 10,
                color: COLORS.accent,
                fontWeight: '500',
              }}>
                {suggestion.estimatedCost || 'Free'} • {suggestion.duration || '2-3 hours'}
              </Text>
            </View>

            <View style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              backgroundColor: COLORS.accent,
              borderRadius: 16,
            }}>
              <Text style={{
                color: COLORS.background,
                fontSize: 10,
                fontWeight: '600',
              }}>
                Book
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={[{
      backgroundColor: COLORS.background,
      borderRadius: 16,
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
      borderWidth: 1,
      borderColor: COLORS.border,
    }, style]}>
      {/* Header */}
      <View style={{
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '600',
            color: COLORS.text,
          }}>
            Your Dates
          </Text>

          <View style={{
            flexDirection: 'row',
            backgroundColor: COLORS.surface,
            borderRadius: 20,
            padding: 2,
          }}>
            {['upcoming', 'suggestions'].map(tab => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 18,
                  backgroundColor: activeTab === tab ? COLORS.accent : 'transparent',
                }}
              >
                <Text style={{
                  fontSize: 10,
                  color: activeTab === tab ? COLORS.background : COLORS.textSecondary,
                  fontWeight: '500',
                  textTransform: 'capitalize',
                }}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={{
        paddingHorizontal: 20,
        paddingBottom: 20,
        minHeight: 120,
      }}>
        {activeTab === 'upcoming' ? renderUpcomingDates() : renderDateSuggestions()}
      </View>
    </View>
  );
};

export default DateNotificationWidget;