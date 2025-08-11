import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native';
import { AppTransition } from '../../components/AppTransition';
import { useTheme, useLanguage } from '../../contexts/AppContext';
import { safetyService } from '../../services/safetyService';

const SafetyDashboardScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [safetyData, setSafetyData] = useState({
    verificationStatus: null,
    emergencyContacts: [],
    recentCheckIns: [],
    blockedUsers: [],
  });

  // ALWAYS include COLORS constant
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
    danger: '#F44336',
  };

  useEffect(() => {
    loadSafetyData();
  }, []);

  const loadSafetyData = async () => {
    setLoading(true);
    try {
      const [verificationStatus, emergencyContacts, checkIns, blockedUsers] = await Promise.all([
        safetyService.getVerificationStatus(),
        safetyService.getEmergencyContacts(),
        safetyService.getSafetyCheckIns(),
        safetyService.getBlockedUsers(),
      ]);

      setSafetyData({
        verificationStatus: verificationStatus.data,
        emergencyContacts: emergencyContacts.data || [],
        recentCheckIns: checkIns.data?.slice(0, 3) || [],
        blockedUsers: blockedUsers.data || [],
      });
    } catch (error) {
      console.error('Failed to load safety data:', error);
      Alert.alert('Error', 'Failed to load safety information');
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencyCheckIn = () => {
    Alert.alert(
      'Emergency Check-In',
      'Are you in immediate danger? This will notify your emergency contacts.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Yes, I need help', 
          style: 'destructive',
          onPress: () => navigation.navigate('EmergencyCheckIn')
        },
      ]
    );
  };

  const safetyFeatures = [
    {
      id: 'verification',
      title: 'Profile Verification',
      subtitle: safetyData.verificationStatus?.isVerified ? 'Verified' : 'Not verified',
      icon: '✓',
      color: safetyData.verificationStatus?.isVerified ? COLORS.success : COLORS.warning,
      onPress: () => navigation.navigate('ProfileVerification'),
    },
    {
      id: 'emergency_contacts',
      title: 'Emergency Contacts',
      subtitle: `${safetyData.emergencyContacts.length} contacts`,
      icon: '📞',
      color: COLORS.accent,
      onPress: () => navigation.navigate('EmergencyContacts'),
    },
    {
      id: 'safety_checkin',
      title: 'Safety Check-In',
      subtitle: 'Check in during dates',
      icon: '🛡️',
      color: COLORS.success,
      onPress: () => navigation.navigate('SafetyCheckIn'),
    },
    {
      id: 'report_user',
      title: 'Report & Block',
      subtitle: 'Report inappropriate behavior',
      icon: '⚠️',
      color: COLORS.danger,
      onPress: () => navigation.navigate('ReportUser'),
    },
    {
      id: 'blocked_users',
      title: 'Blocked Users',
      subtitle: `${safetyData.blockedUsers.length} blocked`,
      icon: '🚫',
      color: COLORS.textSecondary,
      onPress: () => navigation.navigate('BlockedUsers'),
    },
    {
      id: 'safety_resources',
      title: 'Safety Resources',
      subtitle: 'Tips and emergency numbers',
      icon: '📚',
      color: COLORS.accent,
      onPress: () => navigation.navigate('SafetyResources'),
    },
  ];

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
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            marginBottom: 16,
          }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={{ fontSize: 16, color: COLORS.accent }}>← Back</Text>
            </TouchableOpacity>
            
            <Text style={{
              fontSize: 24,
              fontWeight: '300',
              color: COLORS.text,
              letterSpacing: 1,
            }}>
              Safety Center
            </Text>
            
            <View style={{ width: 50 }} />
          </View>

          <Text style={{
            fontSize: 14,
            color: COLORS.textSecondary,
            textAlign: 'center',
            lineHeight: 20,
          }}>
            Your safety is our priority. Manage your security settings and emergency contacts.
          </Text>
        </View>

        {/* Emergency Check-In Button */}
        <View style={{
          paddingHorizontal: 32,
          paddingVertical: 16,
          backgroundColor: COLORS.surface,
        }}>
          <TouchableOpacity
            onPress={handleEmergencyCheckIn}
            style={{
              backgroundColor: COLORS.danger,
              borderRadius: 12,
              paddingVertical: 16,
              paddingHorizontal: 24,
              alignItems: 'center',
              shadowColor: COLORS.shadow,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              color: COLORS.background,
              marginBottom: 4,
            }}>
              🚨 Emergency Check-In
            </Text>
            <Text style={{
              fontSize: 12,
              color: COLORS.background,
              opacity: 0.9,
            }}>
              Tap if you need immediate help
            </Text>
          </TouchableOpacity>
        </View>

        {/* Safety Features */}
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 32, paddingVertical: 24, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={{
            fontSize: 18,
            fontWeight: '300',
            color: COLORS.text,
            marginBottom: 20,
            letterSpacing: 0.5,
          }}>
            Safety Features
          </Text>

          {safetyFeatures.map((feature, index) => (
            <TouchableOpacity
              key={feature.id}
              onPress={feature.onPress}
              style={{
                backgroundColor: COLORS.surface,
                borderRadius: 12,
                padding: 20,
                marginBottom: 16,
                shadowColor: COLORS.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: `${feature.color}15`,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16,
                }}>
                  <Text style={{ fontSize: 20 }}>{feature.icon}</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '300',
                    color: COLORS.text,
                    marginBottom: 4,
                  }}>
                    {feature.title}
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: feature.color,
                    fontWeight: '500',
                  }}>
                    {feature.subtitle}
                  </Text>
                </View>

                <Text style={{ fontSize: 16, color: COLORS.accent }}>→</Text>
              </View>
            </TouchableOpacity>
          ))}

          {/* Recent Activity */}
          {safetyData.recentCheckIns.length > 0 && (
            <View style={{ marginTop: 24 }}>
              <Text style={{
                fontSize: 18,
                fontWeight: '300',
                color: COLORS.text,
                marginBottom: 16,
                letterSpacing: 0.5,
              }}>
                Recent Check-Ins
              </Text>

              {safetyData.recentCheckIns.map((checkIn, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: COLORS.surface,
                    borderRadius: 8,
                    padding: 16,
                    marginBottom: 12,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{
                      fontSize: 14,
                      fontWeight: '300',
                      color: COLORS.text,
                    }}>
                      {checkIn.status === 'SAFE' ? '✅ Safe' : 
                       checkIn.status === 'EMERGENCY' ? '🚨 Emergency' : 
                       '⏰ Checking In'}
                    </Text>
                    <Text style={{
                      fontSize: 12,
                      color: COLORS.textSecondary,
                    }}>
                      {new Date(checkIn.checkInTime).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </AppTransition>
  );
};

export default SafetyDashboardScreen;
