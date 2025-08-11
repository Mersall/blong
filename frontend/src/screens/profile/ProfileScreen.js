import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { AppTransition } from '../../components/AppTransition';

// ALWAYS include COLORS constant - BLONG Design System
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
};

const ProfileScreen = ({ userPreferences, user, onLogout, userPhase }) => {
  const getPhaseInfo = () => {
    switch (userPhase) {
      case 'single':
        return { icon: '🌸', title: 'Singles Journey', color: COLORS.accent };
      case 'engagement':
        return { icon: '💍', title: 'Engagement Phase', color: COLORS.accent };
      case 'engagement_day_prep':
        return { icon: '✨', title: 'Engagement Day Prep', color: COLORS.accent };
      default:
        return { icon: '🌸', title: 'Singles Journey', color: COLORS.accent };
    }
  };

  const phaseInfo = getPhaseInfo();

  return (
    <AppTransition>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

        {/* Elite Header */}
        <View style={{
          paddingTop: 40,
          paddingBottom: 32,
          paddingHorizontal: 32,
          alignItems: 'center',
          backgroundColor: COLORS.background,
        }}>
          <Text style={{
            fontSize: 28,
            fontWeight: '300',
            letterSpacing: 8,
            color: COLORS.text,
            marginBottom: 16,
          }}>
            BLONG
          </Text>

          <View style={{
            width: 40,
            height: 2,
            backgroundColor: COLORS.accent,
            marginBottom: 24,
          }} />

          <Text style={{
            fontSize: 24,
            fontWeight: '300',
            color: COLORS.text,
            marginBottom: 8,
          }}>
            My Profile
          </Text>

          <Text style={{
            fontSize: 14,
            color: COLORS.textSecondary,
            textAlign: 'center',
            lineHeight: 20,
          }}>
            Manage your account and preferences
          </Text>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={onLogout}
            style={{
              position: 'absolute',
              top: 50,
              right: 32,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: COLORS.surface,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <Text style={{
              fontSize: 12,
              color: COLORS.textSecondary,
              fontWeight: '500',
            }}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* User Info Card */}
          <View style={{
            backgroundColor: COLORS.surface,
            borderRadius: 8,
            padding: 24,
            marginBottom: 24,
            shadowColor: COLORS.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 12,
            elevation: 2,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}>
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: phaseInfo.color + '15',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 12,
            }}>
              <Text style={{ fontSize: 36 }}>{phaseInfo.icon}</Text>
            </View>
            <Text style={{
              fontSize: 24,
              fontWeight: '300',
              color: COLORS.text,
              marginBottom: 4,
            }}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={{
              fontSize: 14,
              color: COLORS.textSecondary,
            }}>
              {phaseInfo.title}
            </Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{
              fontSize: 14,
              fontWeight: '300',
              color: COLORS.text,
              marginBottom: 16,
              letterSpacing: 0.5,
            }}>
              Account Information
            </Text>
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 12, color: COLORS.textTertiary, marginBottom: 4 }}>Email</Text>
              <Text style={{ fontSize: 14, color: COLORS.textSecondary }}>{user?.email}</Text>
            </View>
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 12, color: COLORS.textTertiary, marginBottom: 4 }}>Language</Text>
              <Text style={{ fontSize: 14, color: COLORS.textSecondary }}>
                {userPreferences?.language?.name || 'Not selected'}
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: 12, color: COLORS.textTertiary, marginBottom: 4 }}>Relationship Phase</Text>
              <Text style={{ fontSize: 14, color: COLORS.textSecondary }}>
                {userPreferences?.phase?.title || 'Not selected'}
              </Text>
            </View>
          </View>
          </View>

          {/* Settings Options */}
          <View style={{
            backgroundColor: COLORS.surface,
            borderRadius: 8,
            shadowColor: COLORS.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 12,
            elevation: 2,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}>
            {[
              { icon: '⚙️', title: 'Account Settings', subtitle: 'Update your personal information' },
              { icon: '🔔', title: 'Notifications', subtitle: 'Manage your notification preferences' },
              { icon: '🔒', title: 'Privacy', subtitle: 'Control your privacy settings' },
              { icon: '❓', title: 'Help & Support', subtitle: 'Get help and contact support' },
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 20,
                  borderBottomWidth: index < 3 ? 1 : 0,
                  borderBottomColor: COLORS.border,
                }}
              >
                <Text style={{ fontSize: 20, marginRight: 16 }}>{item.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '300',
                    color: COLORS.text,
                    marginBottom: 4,
                  }}>
                    {item.title}
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: COLORS.textSecondary,
                    lineHeight: 16,
                  }}>
                    {item.subtitle}
                  </Text>
                </View>
                <Text style={{ fontSize: 16, color: COLORS.accent, fontWeight: '300' }}>→</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </AppTransition>
  );
};

export default ProfileScreen;
