/**
 * BLONG Safety Dashboard
 * Comprehensive safety management interface with emergency features
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AppTransition } from '../AppTransition';
import { useSuccessMessage } from '../../contexts/SuccessMessageContext';
import advancedSafetyService, { THREAT_LEVELS, CHECK_IN_STATUS } from '../../services/advancedSafetyService';
import ProgressIndicator from '../ui/ProgressIndicator';

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
  emergency: '#D32F2F',
  safe: '#4CAF50',
};

const SafetyDashboard = ({ navigation, user }) => {
  const { t } = useTranslation();
  const { showGenericSuccess } = useSuccessMessage();

  const [safetyStatus, setSafetyStatus] = useState({
    verificationLevel: 'basic',
    threatLevel: THREAT_LEVELS.LOW,
    activeCheckIns: 0,
    emergencyContacts: 0,
  });

  const [activeFeatures, setActiveFeatures] = useState({
    threatDetection: true,
    locationSharing: false,
    autoCheckIn: false,
    incognitoMode: false,
  });

  const [emergencyMode, setEmergencyMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSafetyData();
  }, []);

  const loadSafetyData = async () => {
    try {
      setLoading(true);

      // Load safety status
      const status = await advancedSafetyService.getSafetyStatus();
      setSafetyStatus(status);

      // Load active features
      const features = await advancedSafetyService.getActiveFeatures();
      setActiveFeatures(features);

    } catch (error) {
      console.error('Failed to load safety data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencyAlert = async () => {
    Alert.alert(
      t('safety.emergency.title'),
      t('safety.emergency.confirmMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('safety.emergency.confirm'),
          style: 'destructive',
          onPress: async () => {
            try {
              setEmergencyMode(true);
              const result = await advancedSafetyService.triggerEmergencyAlert({
                type: 'manual_trigger',
                location: 'user_initiated',
              });

              Alert.alert(
                t('safety.emergency.alertSent'),
                t('safety.emergency.alertSentMessage', {
                  contacts: result.contactsNotified,
                  emergency: result.emergencyNumber
                }),
                [{ text: t('common.ok') }]
              );
            } catch (error) {
              Alert.alert(t('error.title'), t('safety.emergency.alertFailed'));
            } finally {
              setEmergencyMode(false);
            }
          },
        },
      ]
    );
  };

  const handleStartCheckIn = () => {
    navigation.navigate('SafetyCheckIn', {
      mode: 'start',
      onComplete: (checkInId) => {
        showGenericSuccess(t('safety.checkIn.started'));
        loadSafetyData();
      },
    });
  };

  const handleVerificationRequest = () => {
    navigation.navigate('ProfileVerification', {
      mode: 'advanced',
      onComplete: () => {
        showGenericSuccess(t('safety.verification.requested'));
        loadSafetyData();
      },
    });
  };

  const toggleFeature = async (featureName) => {
    try {
      const newValue = !activeFeatures[featureName];

      await advancedSafetyService.updateFeatureSetting(featureName, newValue);

      setActiveFeatures(prev => ({
        ...prev,
        [featureName]: newValue,
      }));

      showGenericSuccess(
        newValue
          ? t('safety.features.enabled', { feature: t(`safety.features.${featureName}`) })
          : t('safety.features.disabled', { feature: t(`safety.features.${featureName}`) })
      );

    } catch (error) {
      Alert.alert(t('error.title'), t('safety.features.updateFailed'));
    }
  };

  const renderSafetyStatus = () => (
    <View style={{
      backgroundColor: COLORS.surface,
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: COLORS.border,
    }}>
      <Text style={{
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 16,
      }}>
        {t('safety.status.title')}
      </Text>

      {/* Verification Level */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
      }}>
        <View style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: safetyStatus.verificationLevel === 'verified' ? COLORS.success + '20' : COLORS.warning + '20',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 12,
        }}>
          <Ionicons
            name={safetyStatus.verificationLevel === 'verified' ? 'shield-checkmark' : 'shield-outline'}
            size={20}
            color={safetyStatus.verificationLevel === 'verified' ? COLORS.success : COLORS.warning}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: 14,
            fontWeight: '500',
            color: COLORS.text,
          }}>
            {t('safety.status.verification')}
          </Text>
          <Text style={{
            fontSize: 12,
            color: COLORS.textSecondary,
          }}>
            {t(`safety.verification.${safetyStatus.verificationLevel}`)}
          </Text>
        </View>

        {safetyStatus.verificationLevel !== 'verified' && (
          <TouchableOpacity
            onPress={handleVerificationRequest}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 16,
              backgroundColor: COLORS.accent,
            }}
          >
            <Text style={{
              fontSize: 12,
              color: COLORS.background,
              fontWeight: '600',
            }}>
              {t('safety.verification.upgrade')}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Threat Level */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
      }}>
        <View style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: safetyStatus.threatLevel === THREAT_LEVELS.LOW ? COLORS.success + '20' : COLORS.warning + '20',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 12,
        }}>
          <Ionicons
            name="analytics"
            size={20}
            color={safetyStatus.threatLevel === THREAT_LEVELS.LOW ? COLORS.success : COLORS.warning}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: 14,
            fontWeight: '500',
            color: COLORS.text,
          }}>
            {t('safety.status.threatLevel')}
          </Text>
          <Text style={{
            fontSize: 12,
            color: COLORS.textSecondary,
          }}>
            {t(`safety.threatLevel.${safetyStatus.threatLevel}`)}
          </Text>
        </View>
      </View>

      {/* Active Check-ins */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        <View style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: safetyStatus.activeCheckIns > 0 ? COLORS.accent + '20' : COLORS.border + '20',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 12,
        }}>
          <Ionicons
            name="time"
            size={20}
            color={safetyStatus.activeCheckIns > 0 ? COLORS.accent : COLORS.textTertiary}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: 14,
            fontWeight: '500',
            color: COLORS.text,
          }}>
            {t('safety.status.activeCheckIns')}
          </Text>
          <Text style={{
            fontSize: 12,
            color: COLORS.textSecondary,
          }}>
            {safetyStatus.activeCheckIns} {t('safety.status.active')}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderEmergencyActions = () => (
    <View style={{
      backgroundColor: COLORS.surface,
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: COLORS.border,
    }}>
      <Text style={{
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 16,
      }}>
        {t('safety.emergency.title')}
      </Text>

      {/* Emergency Alert Button */}
      <TouchableOpacity
        onPress={handleEmergencyAlert}
        disabled={emergencyMode}
        style={{
          backgroundColor: emergencyMode ? COLORS.error + '80' : COLORS.emergency,
          borderRadius: 12,
          padding: 16,
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Ionicons
            name="warning"
            size={24}
            color={COLORS.background}
            style={{ marginRight: 12 }}
          />
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: COLORS.background,
          }}>
            {emergencyMode ? t('safety.emergency.sending') : t('safety.emergency.alert')}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Safety Check-in Button */}
      <TouchableOpacity
        onPress={handleStartCheckIn}
        style={{
          backgroundColor: COLORS.accent,
          borderRadius: 12,
          padding: 16,
          alignItems: 'center',
        }}
      >
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Ionicons
            name="shield-checkmark"
            size={24}
            color={COLORS.background}
            style={{ marginRight: 12 }}
          />
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: COLORS.background,
          }}>
            {t('safety.checkIn.start')}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderSafetyFeatures = () => (
    <View style={{
      backgroundColor: COLORS.surface,
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: COLORS.border,
    }}>
      <Text style={{
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 16,
      }}>
        {t('safety.features.title')}
      </Text>

      {/* Feature Toggles */}
      {Object.entries(activeFeatures).map(([featureName, isEnabled]) => (
        <View key={featureName} style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        }}>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 14,
              fontWeight: '500',
              color: COLORS.text,
              marginBottom: 4,
            }}>
              {t(`safety.features.${featureName}`)}
            </Text>
            <Text style={{
              fontSize: 12,
              color: COLORS.textSecondary,
            }}>
              {t(`safety.features.${featureName}Description`)}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => toggleFeature(featureName)}
            style={{
              width: 50,
              height: 30,
              borderRadius: 15,
              backgroundColor: isEnabled ? COLORS.success : COLORS.border,
              justifyContent: 'center',
              paddingHorizontal: 2,
            }}
          >
            <View style={{
              width: 26,
              height: 26,
              borderRadius: 13,
              backgroundColor: COLORS.background,
              alignSelf: isEnabled ? 'flex-end' : 'flex-start',
            }} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  if (loading) {
    return (
      <AppTransition>
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
          <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <ProgressIndicator
              indeterminate={true}
              label={t('safety.loading')}
              color={COLORS.accent}
            />
          </View>
        </SafeAreaView>
      </AppTransition>
    );
  }

  return (
    <AppTransition>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

        {/* Header */}
        <View style={{
          paddingTop: 40,
          paddingBottom: 24,
          paddingHorizontal: 32,
          backgroundColor: COLORS.background,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={COLORS.text} />
            </TouchableOpacity>

            <Text style={{
              fontSize: 20,
              fontWeight: '300',
              color: COLORS.text,
              letterSpacing: 1,
            }}>
              {t('safety.dashboard.title')}
            </Text>

            <TouchableOpacity onPress={() => navigation.navigate('SafetySettings')}>
              <Ionicons name="settings-outline" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 32, paddingVertical: 24, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {renderSafetyStatus()}
          {renderEmergencyActions()}
          {renderSafetyFeatures()}
        </ScrollView>
      </SafeAreaView>
    </AppTransition>
  );
};

export default SafetyDashboard;