/**
 * BLONG Date Card Component - Premium Elite Design
 * Displays date information with premium styling and RTL support
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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

const DateCard = ({ 
  date, 
  onPress, 
  onInterestResponse, 
  isRTL = false, 
  style 
}) => {
  const [showInterestButtons, setShowInterestButtons] = useState(false);
  const [responseText, setResponseText] = useState('');

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return COLORS.warning;
      case 'MUTUAL_INTEREST': return COLORS.success;
      case 'SCHEDULING': return COLORS.accent;
      case 'PAYMENT_PENDING': return COLORS.warning;
      case 'CONFIRMED': return COLORS.success;
      case 'COMPLETED': return COLORS.textSecondary;
      case 'CANCELLED': return COLORS.error;
      case 'EXPIRED': return COLORS.textTertiary;
      default: return COLORS.textSecondary;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING': return 'Awaiting Response';
      case 'MUTUAL_INTEREST': return 'Mutual Interest!';
      case 'SCHEDULING': return 'Scheduling Date';
      case 'PAYMENT_PENDING': return 'Payment Required';
      case 'CONFIRMED': return 'Date Confirmed';
      case 'COMPLETED': return 'Date Completed';
      case 'CANCELLED': return 'Cancelled';
      case 'EXPIRED': return 'Expired';
      default: return status;
    }
  };

  const formatCompatibilityScore = (score) => {
    return `${Math.round(score * 100)}% Match`;
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const handleInterestPress = (isInterested) => {
    onInterestResponse(date.id, isInterested, responseText);
    setShowInterestButtons(false);
    setResponseText('');
  };

  const renderPartnerInfo = () => (
    <View style={{
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      marginBottom: 16,
    }}>
      {/* Profile Picture */}
      <View style={{
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.surface,
        marginRight: isRTL ? 0 : 16,
        marginLeft: isRTL ? 16 : 0,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: COLORS.border,
      }}>
        {date.partner.profilePicture ? (
          <Image
            source={{ uri: date.partner.profilePicture }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        ) : (
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: COLORS.accent + '20',
          }}>
            <Text style={{
              fontSize: 24,
              color: COLORS.accent,
            }}>
              {date.partner.firstName.charAt(0)}
            </Text>
          </View>
        )}
      </View>

      {/* Partner Details */}
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: 20,
          fontWeight: '300',
          color: COLORS.text,
          marginBottom: 4,
          textAlign: isRTL ? 'right' : 'left',
        }}>
          {date.partner.firstName}, {date.partner.age}
        </Text>
        
        <Text style={{
          fontSize: 14,
          color: COLORS.textSecondary,
          marginBottom: 8,
          textAlign: isRTL ? 'right' : 'left',
        }}>
          📍 {date.partner.city}
        </Text>

        {/* Compatibility Score */}
        <View style={{
          backgroundColor: COLORS.accent + '20',
          paddingHorizontal: 12,
          paddingVertical: 4,
          borderRadius: 12,
          alignSelf: isRTL ? 'flex-end' : 'flex-start',
        }}>
          <Text style={{
            fontSize: 12,
            fontWeight: '500',
            color: COLORS.accent,
            letterSpacing: 0.5,
          }}>
            {formatCompatibilityScore(date.compatibilityScore)}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderInterests = () => {
    if (!date.partner.interests || date.partner.interests.length === 0) return null;

    return (
      <View style={{ marginBottom: 16 }}>
        <Text style={{
          fontSize: 14,
          fontWeight: '500',
          color: COLORS.text,
          marginBottom: 8,
          textAlign: isRTL ? 'right' : 'left',
        }}>
          Interests
        </Text>
        
        <View style={{
          flexDirection: isRTL ? 'row-reverse' : 'row',
          flexWrap: 'wrap',
          gap: 8,
        }}>
          {date.partner.interests.slice(0, 3).map((interest, index) => (
            <View
              key={index}
              style={{
                backgroundColor: COLORS.surface,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
            >
              <Text style={{
                fontSize: 12,
                color: COLORS.textSecondary,
                fontWeight: '300',
              }}>
                {interest}
              </Text>
            </View>
          ))}
          
          {date.partner.interests.length > 3 && (
            <View style={{
              backgroundColor: COLORS.accent + '10',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: COLORS.accent + '30',
            }}>
              <Text style={{
                fontSize: 12,
                color: COLORS.accent,
                fontWeight: '500',
              }}>
                +{date.partner.interests.length - 3} more
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderMatchReason = () => {
    if (!date.matchReason) return null;

    return (
      <View style={{
        backgroundColor: COLORS.success + '10',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderLeftWidth: 3,
        borderLeftColor: COLORS.success,
      }}>
        <Text style={{
          fontSize: 13,
          color: COLORS.success,
          fontWeight: '500',
          textAlign: isRTL ? 'right' : 'left',
          lineHeight: 18,
        }}>
          💡 {date.matchReason}
        </Text>
      </View>
    );
  };

  const renderActionButtons = () => {
    if (date.userInterest) {
      // User has already responded
      return (
        <View style={{
          backgroundColor: date.userInterest.isInterested ? COLORS.success + '10' : COLORS.error + '10',
          padding: 12,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: date.userInterest.isInterested ? COLORS.success + '30' : COLORS.error + '30',
        }}>
          <Text style={{
            fontSize: 14,
            color: date.userInterest.isInterested ? COLORS.success : COLORS.error,
            fontWeight: '500',
            textAlign: 'center',
          }}>
            {date.userInterest.isInterested ? '✓ You\'re Interested' : '✗ Not Interested'}
          </Text>
          {date.userInterest.response && (
            <Text style={{
              fontSize: 12,
              color: COLORS.textSecondary,
              textAlign: 'center',
              marginTop: 4,
              fontStyle: 'italic',
            }}>
              "{date.userInterest.response}"
            </Text>
          )}
        </View>
      );
    }

    if (date.status === 'PENDING') {
      return (
        <View style={{ gap: 12 }}>
          <View style={{
            flexDirection: isRTL ? 'row-reverse' : 'row',
            gap: 12,
          }}>
            <TouchableOpacity
              onPress={() => handleInterestPress(false)}
              style={{
                flex: 1,
                backgroundColor: COLORS.surface,
                paddingVertical: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
            >
              <Text style={{
                fontSize: 14,
                fontWeight: '500',
                color: COLORS.textSecondary,
                textAlign: 'center',
              }}>
                Not Interested
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleInterestPress(true)}
              style={{
                flex: 1,
                backgroundColor: COLORS.accent,
                paddingVertical: 12,
                borderRadius: 8,
              }}
            >
              <Text style={{
                fontSize: 14,
                fontWeight: '500',
                color: COLORS.background,
                textAlign: 'center',
              }}>
                I'm Interested!
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return null;
  };

  const renderStatusBadge = () => (
    <View style={{
      position: 'absolute',
      top: 16,
      right: isRTL ? undefined : 16,
      left: isRTL ? 16 : undefined,
      backgroundColor: getStatusColor(date.status) + '20',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: getStatusColor(date.status) + '40',
    }}>
      <Text style={{
        fontSize: 11,
        fontWeight: '500',
        color: getStatusColor(date.status),
        letterSpacing: 0.5,
      }}>
        {getStatusText(date.status)}
      </Text>
    </View>
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          backgroundColor: COLORS.background,
          borderRadius: 16,
          padding: 20,
          shadowColor: COLORS.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 4,
          borderWidth: 1,
          borderColor: COLORS.border,
        },
        style,
      ]}
      activeOpacity={0.95}
    >
      {renderStatusBadge()}
      {renderPartnerInfo()}
      {renderInterests()}
      {renderMatchReason()}
      {renderActionButtons()}
      
      {/* Time stamp */}
      <Text style={{
        fontSize: 11,
        color: COLORS.textTertiary,
        textAlign: isRTL ? 'left' : 'right',
        marginTop: 12,
      }}>
        {formatTimeAgo(date.createdAt)}
      </Text>
    </TouchableOpacity>
  );
};

export default DateCard;
