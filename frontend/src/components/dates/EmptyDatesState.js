/**
 * BLONG Empty Dates State Component - Premium Elite Design
 * Displays when user has no dates with encouraging message
 */

import React from 'react';
import { View, Text } from 'react-native';
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
};

const EmptyDatesState = ({ isRTL = false }) => {
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
      paddingVertical: 60,
    }}>
      {/* Elegant illustration */}
      <View style={{
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: COLORS.accent + '10',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
        borderWidth: 2,
        borderColor: COLORS.accent + '20',
      }}>
        <Text style={{
          fontSize: 48,
          textAlign: 'center',
        }}>
          💝
        </Text>
      </View>

      {/* Main message */}
      <Text style={{
        fontSize: 24,
        fontWeight: '300',
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: 16,
        letterSpacing: 0.5,
      }}>
        Your Perfect Date Awaits
      </Text>

      {/* Subtitle */}
      <Text style={{
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
      }}>
        Our AI is working around the clock to find someone special for you. 
        Check back soon for your curated date opportunities!
      </Text>

      {/* Feature highlights */}
      <View style={{
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        padding: 24,
        width: '100%',
        borderWidth: 1,
        borderColor: COLORS.border,
      }}>
        <Text style={{
          fontSize: 16,
          fontWeight: '500',
          color: COLORS.text,
          textAlign: 'center',
          marginBottom: 16,
        }}>
          What makes BLONG special?
        </Text>

        <View style={{ gap: 12 }}>
          <View style={{
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
          }}>
            <Text style={{
              fontSize: 16,
              marginRight: isRTL ? 0 : 12,
              marginLeft: isRTL ? 12 : 0,
            }}>
              🧠
            </Text>
            <Text style={{
              fontSize: 14,
              color: COLORS.textSecondary,
              flex: 1,
              textAlign: isRTL ? 'right' : 'left',
            }}>
              AI-powered personality matching
            </Text>
          </View>

          <View style={{
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
          }}>
            <Text style={{
              fontSize: 16,
              marginRight: isRTL ? 0 : 12,
              marginLeft: isRTL ? 12 : 0,
            }}>
              🎯
            </Text>
            <Text style={{
              fontSize: 14,
              color: COLORS.textSecondary,
              flex: 1,
              textAlign: isRTL ? 'right' : 'left',
            }}>
              Curated dates, not endless swiping
            </Text>
          </View>

          <View style={{
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
          }}>
            <Text style={{
              fontSize: 16,
              marginRight: isRTL ? 0 : 12,
              marginLeft: isRTL ? 12 : 0,
            }}>
              ✨
            </Text>
            <Text style={{
              fontSize: 14,
              color: COLORS.textSecondary,
              flex: 1,
              textAlign: isRTL ? 'right' : 'left',
            }}>
              Premium date experiences delivered
            </Text>
          </View>

          <View style={{
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
          }}>
            <Text style={{
              fontSize: 16,
              marginRight: isRTL ? 0 : 12,
              marginLeft: isRTL ? 12 : 0,
            }}>
              🔒
            </Text>
            <Text style={{
              fontSize: 14,
              color: COLORS.textSecondary,
              flex: 1,
              textAlign: isRTL ? 'right' : 'left',
            }}>
              Safe, verified, and exclusive
            </Text>
          </View>
        </View>
      </View>

      {/* Encouraging note */}
      <View style={{
        backgroundColor: COLORS.accent + '10',
        borderRadius: 8,
        padding: 16,
        marginTop: 24,
        borderLeftWidth: 3,
        borderLeftColor: COLORS.accent,
      }}>
        <Text style={{
          fontSize: 13,
          color: COLORS.accent,
          fontWeight: '500',
          textAlign: 'center',
          lineHeight: 18,
        }}>
          💡 Tip: Complete your profile questionnaire to improve your matching accuracy!
        </Text>
      </View>
    </View>
  );
};

export default EmptyDatesState;
