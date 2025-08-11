import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/AppContext';

const PremiumHeader = ({ 
  title,
  subtitle,
  leftAction,
  rightAction,
  userPhase = 'single',
  showBackButton = false,
  onBackPress,
  transparent = false,
}) => {
  const { colors } = useTheme();

  const getPhaseGradient = () => {
    switch (userPhase) {
      case 'single':
        return ['#FF6B35', '#FF8A65', '#FFAB91'];
      case 'engagement':
        return ['#FFD700', '#FFA000', '#FFB74D'];
      case 'engagement_day_prep':
        return ['#FF6B35', '#FFD700', '#FFCC80'];
      default:
        return ['#FF6B35', '#FF8A65', '#FFAB91'];
    }
  };

  const phaseGradient = getPhaseGradient();
  const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 24;

  if (transparent) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          paddingTop: statusBarHeight,
          paddingHorizontal: 20,
          paddingBottom: 16,
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            {showBackButton ? (
              <TouchableOpacity
                onPress={onBackPress}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 4,
                }}
              >
                <Text style={{ fontSize: 18, color: phaseGradient[0] }}>←</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ width: 40 }} />
            )}
            
            {rightAction && (
              <TouchableOpacity
                onPress={rightAction.onPress}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 4,
                }}
              >
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: phaseGradient[0],
                }}>
                  {rightAction.title}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={phaseGradient[0]} translucent />
      <LinearGradient
        colors={phaseGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: statusBarHeight,
          paddingHorizontal: 20,
          paddingBottom: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 12,
        }}
      >
        {/* Navigation Row */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: subtitle ? 16 : 8,
        }}>
          {/* Left Action */}
          {showBackButton ? (
            <TouchableOpacity
              onPress={onBackPress}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: 'rgba(255,255,255,0.2)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 18, color: '#FFFFFF' }}>←</Text>
            </TouchableOpacity>
          ) : leftAction ? (
            <TouchableOpacity onPress={leftAction.onPress}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#FFFFFF',
                opacity: 0.9,
              }}>
                {leftAction.title}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 40 }} />
          )}

          {/* Center Title */}
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{
              fontSize: 20,
              fontWeight: '700',
              color: '#FFFFFF',
              letterSpacing: 1,
              textShadowColor: 'rgba(0,0,0,0.2)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 2,
            }}>
              {title}
            </Text>
          </View>

          {/* Right Action */}
          {rightAction ? (
            <TouchableOpacity
              onPress={rightAction.onPress}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.3)',
              }}
            >
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: '#FFFFFF',
              }}>
                {rightAction.title}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 40 }} />
          )}
        </View>

        {/* Subtitle */}
        {subtitle && (
          <View style={{ alignItems: 'center' }}>
            <Text style={{
              fontSize: 16,
              color: 'rgba(255,255,255,0.9)',
              textAlign: 'center',
              letterSpacing: 0.5,
              lineHeight: 22,
            }}>
              {subtitle}
            </Text>
          </View>
        )}

        {/* Elegant bottom border */}
        <View style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 1,
          backgroundColor: 'rgba(255,255,255,0.2)',
        }} />
      </LinearGradient>
    </>
  );
};

export default PremiumHeader;
