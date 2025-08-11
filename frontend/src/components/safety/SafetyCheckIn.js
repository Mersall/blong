/**
 * BLONG Safety Check-In Component
 * Real-time safety monitoring for dates with emergency features
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, SafeAreaView, StatusBar, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AppTransition } from '../AppTransition';
import { useSuccessMessage } from '../../contexts/SuccessMessageContext';
import advancedSafetyService, { CHECK_IN_STATUS } from '../../services/advancedSafetyService';
import ProgressIndicator, { PROGRESS_TYPES } from '../ui/ProgressIndicator';

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

const SafetyCheckIn = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { showGenericSuccess } = useSuccessMessage();
  const { dateDetails, mode = 'start' } = route.params || {};

  const [checkInData, setCheckInData] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(CHECK_IN_STATUS.SAFE);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [emergencyModalVisible, setEmergencyModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const timerRef = useRef(null);
  const checkInIntervalRef = useRef(null);

  useEffect(() => {
    if (mode === 'start') {
      initializeCheckIn();
    } else if (mode === 'active' && route.params.checkInId) {
      loadActiveCheckIn(route.params.checkInId);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (checkInIntervalRef.current) clearInterval(checkInIntervalRef.current);
    };
  }, []);

  const initializeCheckIn = async () => {
    try {
      setLoading(true);

      const result = await advancedSafetyService.startSafetyCheckIn({
        dateId: dateDetails?.id,
        partnerId: dateDetails?.partnerId,
        location: dateDetails?.location,
        expectedDuration: dateDetails?.duration || 120,
      });

      setCheckInData(result);
      setIsActive(true);
      startTimer(result.nextCheckIn);

      showGenericSuccess(t('safety.checkIn.started'));

    } catch (error) {
      Alert.alert(t('error.title'), t('safety.checkIn.startFailed'));
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const loadActiveCheckIn = async (checkInId) => {
    try {
      setLoading(true);

      const checkIn = await advancedSafetyService.getActiveCheckIn(checkInId);
      setCheckInData(checkIn);
      setCurrentStatus(checkIn.status);
      setIsActive(true);

      if (checkIn.nextCheckIn) {
        startTimer(new Date(checkIn.nextCheckIn));
      }

    } catch (error) {
      Alert.alert(t('error.title'), t('safety.checkIn.loadFailed'));
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const startTimer = (nextCheckInTime) => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      const now = new Date();
      const remaining = Math.max(0, nextCheckInTime.getTime() - now.getTime());

      setTimeRemaining(remaining);

      if (remaining === 0) {
        handleCheckInDue();
      }
    }, 1000);
  };

  const handleCheckInDue = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    Alert.alert(
      t('safety.checkIn.dueTitle'),
      t('safety.checkIn.dueMessage'),
      [
        {
          text: t('safety.checkIn.imSafe'),
          onPress: () => updateStatus(CHECK_IN_STATUS.SAFE),
        },
        {
          text: t('safety.checkIn.delayed'),
          onPress: () => updateStatus(CHECK_IN_STATUS.DELAYED),
        },
        {
          text: t('safety.checkIn.needHelp'),
          style: 'destructive',
          onPress: () => updateStatus(CHECK_IN_STATUS.HELP_NEEDED),
        },
      ]
    );
  };

  const updateStatus = async (status, additionalInfo = {}) => {
    try {
      setLoading(true);

      const result = await advancedSafetyService.updateCheckInStatus(
        checkInData.checkInId,
        status,
        additionalInfo
      );

      setCurrentStatus(status);

      if (status === CHECK_IN_STATUS.SAFE) {
        // Schedule next check-in
        const nextCheckIn = new Date(Date.now() + 30 * 60000); // 30 minutes
        startTimer(nextCheckIn);
        showGenericSuccess(t('safety.checkIn.statusUpdated'));
      } else if (status === CHECK_IN_STATUS.EMERGENCY) {
        setIsActive(false);
        Alert.alert(
          t('safety.emergency.alertSent'),
          t('safety.emergency.helpOnWay'),
          [{ text: t('common.ok'), onPress: () => navigation.goBack() }]
        );
      }

    } catch (error) {
      Alert.alert(t('error.title'), t('safety.checkIn.updateFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleEmergency = () => {
    setEmergencyModalVisible(true);
  };

  const confirmEmergency = async () => {
    setEmergencyModalVisible(false);
    await updateStatus(CHECK_IN_STATUS.EMERGENCY);
  };

  const endCheckIn = async () => {
    Alert.alert(
      t('safety.checkIn.endTitle'),
      t('safety.checkIn.endMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('safety.checkIn.endConfirm'),
          onPress: async () => {
            try {
              await advancedSafetyService.endCheckIn(checkInData.checkInId);
              setIsActive(false);
              showGenericSuccess(t('safety.checkIn.ended'));
              navigation.goBack();
            } catch (error) {
              Alert.alert(t('error.title'), t('safety.checkIn.endFailed'));
            }
          },
        },
      ]
    );
  };

  const formatTimeRemaining = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case CHECK_IN_STATUS.SAFE:
        return COLORS.success;
      case CHECK_IN_STATUS.DELAYED:
        return COLORS.warning;
      case CHECK_IN_STATUS.HELP_NEEDED:
        return COLORS.error;
      case CHECK_IN_STATUS.EMERGENCY:
        return COLORS.emergency;
      default:
        return COLORS.textSecondary;
    }
  };

  const renderCheckInStatus = () => (
    <View style={{
      backgroundColor: COLORS.surface,
      borderRadius: 16,
      padding: 24,
      marginBottom: 24,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: getStatusColor(currentStatus) + '30',
    }}>
      {/* Status Icon */}
      <View style={{
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: getStatusColor(currentStatus) + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
      }}>
        <Ionicons
          name={currentStatus === CHECK_IN_STATUS.SAFE ? 'shield-checkmark' : 'warning'}
          size={40}
          color={getStatusColor(currentStatus)}
        />
      </View>

      {/* Status Text */}
      <Text style={{
        fontSize: 20,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 8,
      }}>
        {t(`safety.checkIn.status.${currentStatus}`)}
      </Text>

      {/* Timer */}
      {isActive && timeRemaining > 0 && (
        <View style={{
          alignItems: 'center',
          marginBottom: 16,
        }}>
          <Text style={{
            fontSize: 32,
            fontWeight: '300',
            color: COLORS.accent,
            marginBottom: 4,
          }}>
            {formatTimeRemaining(timeRemaining)}
          </Text>
          <Text style={{
            fontSize: 14,
            color: COLORS.textSecondary,
          }}>
            {t('safety.checkIn.nextCheckIn')}
          </Text>
        </View>
      )}

      {/* Progress Ring */}
      {isActive && (
        <ProgressIndicator
          type={PROGRESS_TYPES.CIRCULAR}
          progress={timeRemaining > 0 ? ((30 * 60000 - timeRemaining) / (30 * 60000)) * 100 : 100}
          color={getStatusColor(currentStatus)}
          size="large"
          showPercentage={false}
          showLabel={false}
        />
      )}
    </View>
  );

  const renderActionButtons = () => (
    <View style={{
      backgroundColor: COLORS.surface,
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
    }}>
      <Text style={{
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 16,
        textAlign: 'center',
      }}>
        {t('safety.checkIn.actions')}
      </Text>

      {/* Safe Button */}
      <TouchableOpacity
        onPress={() => updateStatus(CHECK_IN_STATUS.SAFE)}
        disabled={loading}
        style={{
          backgroundColor: COLORS.success,
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
            name="checkmark-circle"
            size={24}
            color={COLORS.background}
            style={{ marginRight: 12 }}
          />
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: COLORS.background,
          }}>
            {t('safety.checkIn.imSafe')}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Delayed Button */}
      <TouchableOpacity
        onPress={() => updateStatus(CHECK_IN_STATUS.DELAYED)}
        disabled={loading}
        style={{
          backgroundColor: COLORS.warning,
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
            name="time"
            size={24}
            color={COLORS.background}
            style={{ marginRight: 12 }}
          />
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: COLORS.background,
          }}>
            {t('safety.checkIn.delayed')}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Emergency Button */}
      <TouchableOpacity
        onPress={handleEmergency}
        disabled={loading}
        style={{
          backgroundColor: COLORS.emergency,
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
            {t('safety.checkIn.emergency')}
          </Text>
        </View>
      </TouchableOpacity>

      {/* End Check-in Button */}
      {isActive && (
        <TouchableOpacity
          onPress={endCheckIn}
          disabled={loading}
          style={{
            backgroundColor: COLORS.textSecondary,
            borderRadius: 12,
            padding: 16,
            alignItems: 'center',
          }}
        >
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: COLORS.background,
          }}>
            {t('safety.checkIn.end')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderEmergencyModal = () => (
    <Modal
      visible={emergencyModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setEmergencyModalVisible(false)}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
      }}>
        <View style={{
          backgroundColor: COLORS.background,
          borderRadius: 16,
          padding: 24,
          width: '100%',
          maxWidth: 400,
        }}>
          <View style={{
            alignItems: 'center',
            marginBottom: 24,
          }}>
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: COLORS.emergency + '20',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 16,
            }}>
              <Ionicons
                name="warning"
                size={40}
                color={COLORS.emergency}
              />
            </View>

            <Text style={{
              fontSize: 20,
              fontWeight: '600',
              color: COLORS.text,
              textAlign: 'center',
              marginBottom: 8,
            }}>
              {t('safety.emergency.confirmTitle')}
            </Text>

            <Text style={{
              fontSize: 14,
              color: COLORS.textSecondary,
              textAlign: 'center',
              lineHeight: 20,
            }}>
              {t('safety.emergency.confirmDescription')}
            </Text>
          </View>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
            <TouchableOpacity
              onPress={() => setEmergencyModalVisible(false)}
              style={{
                flex: 1,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 24,
                backgroundColor: COLORS.surface,
                borderWidth: 1,
                borderColor: COLORS.border,
                marginRight: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{
                fontSize: 14,
                color: COLORS.textSecondary,
                fontWeight: '500',
              }}>
                {t('common.cancel')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={confirmEmergency}
              style={{
                flex: 1,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 24,
                backgroundColor: COLORS.emergency,
                marginLeft: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{
                fontSize: 14,
                color: COLORS.background,
                fontWeight: '600',
              }}>
                {t('safety.emergency.confirm')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (loading && !checkInData) {
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
              label={t('safety.checkIn.initializing')}
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
              fontSize: 18,
              fontWeight: '300',
              color: COLORS.text,
              letterSpacing: 1,
            }}>
              {t('safety.checkIn.title')}
            </Text>

            <View style={{ width: 24 }} />
          </View>
        </View>

        {/* Content */}
        <View style={{
          flex: 1,
          paddingHorizontal: 32,
          paddingVertical: 24,
        }}>
          {renderCheckInStatus()}
          {renderActionButtons()}
        </View>

        {renderEmergencyModal()}
      </SafeAreaView>
    </AppTransition>
  );
};

export default SafetyCheckIn;