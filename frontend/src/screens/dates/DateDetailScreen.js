/**
 * BLONG Date Detail Screen - Premium Elite Design
 * Detailed view of a specific date with full interaction capabilities
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, TextInput, Alert } from 'react-native';
import { AppTransition } from '../../components/AppTransition';
import { useTheme } from '../../contexts/AppContext';
import DateCard from '../../components/dates/DateCard';
import InterestSelectionModal from '../../components/dates/InterestSelectionModal';
import SchedulingInterface from '../../components/dates/SchedulingInterface';
import PaymentInterface from '../../components/dates/PaymentInterface';
import { PremiumInlineLoader } from '../../components/loading';
import { useOperationLoading } from '../../hooks/useLoading';
import { dateDeliveryService } from '../../services/dateDeliveryService';

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

const DateDetailScreen = ({
  date: initialDate,
  onBack,
  userPreferences,
  user
}) => {
  const [date, setDate] = useState(initialDate);
  const [loading, setLoading] = useState(false);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [showScheduling, setShowScheduling] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const { colors, isRTL } = useTheme();
  const { withOperationLoading } = useOperationLoading();

  useEffect(() => {
    if (initialDate?.id) {
      refreshDateDetails();
    }
  }, [initialDate?.id]);

  const refreshDateDetails = async () => {
    try {
      await withOperationLoading(
        async () => {
          const updatedDate = await dateDeliveryService.getDateById(initialDate.id);
          setDate(updatedDate);
        },
        {
          message: 'Updating date details...',
          subtitle: 'Please wait while we refresh your information'
        }
      );
    } catch (error) {
      console.error('Error refreshing date details:', error);
      Alert.alert('Error', 'Failed to refresh date details');
    }
  };

  const handleInterestResponse = async (isInterested, response) => {
    try {
      await dateDeliveryService.expressInterest(date.id, isInterested, response);
      await refreshDateDetails();
      setShowInterestModal(false);
      
      if (isInterested) {
        Alert.alert(
          'Interest Sent! 💕',
          'Your response has been sent. We\'ll notify you when your date partner responds!',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Response Sent',
          'Thank you for your response. We\'ll find you a better match soon!',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error expressing interest:', error);
      Alert.alert('Error', 'Failed to send your response. Please try again.');
    }
  };

  const handleScheduleSubmit = async (preferredDates, availability) => {
    try {
      await dateDeliveryService.submitSchedule(date.id, preferredDates, availability);
      await refreshDateDetails();
      setShowScheduling(false);
      
      Alert.alert(
        'Schedule Submitted! 📅',
        'Your preferred times have been submitted. We\'ll find the perfect time for both of you!',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error submitting schedule:', error);
      Alert.alert('Error', 'Failed to submit schedule. Please try again.');
    }
  };

  const handlePaymentComplete = async (paymentData) => {
    try {
      await dateDeliveryService.confirmPayment(date.id, 'COMPLETED', paymentData.paymentIntentId);
      await refreshDateDetails();
      setShowPayment(false);
      
      Alert.alert(
        'Payment Successful! ✅',
        'Your date is now confirmed! We\'ll send you the details soon.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error confirming payment:', error);
      Alert.alert('Error', 'Payment confirmation failed. Please contact support.');
    }
  };

  const renderHeader = () => (
    <View style={{
      paddingTop: 40,
      paddingBottom: 32,
      paddingHorizontal: 32,
      alignItems: 'center',
      backgroundColor: COLORS.background,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    }}>
      {/* BLONG Elite Logo */}
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

      {/* Navigation Row */}
      <View style={{
        flexDirection: isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 16,
      }}>
        <TouchableOpacity onPress={onBack} style={{ padding: 8 }}>
          <Text style={{ fontSize: 18, color: COLORS.accent }}>
            {isRTL ? '→' : '←'}
          </Text>
        </TouchableOpacity>

        <Text style={{
          fontSize: 18,
          fontWeight: '300',
          color: COLORS.text,
          letterSpacing: 1,
        }}>
          Date Details
        </Text>

        <View style={{ width: 34 }} />
      </View>
    </View>
  );

  const renderActionButtons = () => {
    if (!date) return null;

    switch (date.status) {
      case 'PENDING':
        if (!date.userInterest) {
          return (
            <View style={{ padding: 32 }}>
              <TouchableOpacity
                onPress={() => setShowInterestModal(true)}
                style={{
                  backgroundColor: COLORS.accent,
                  paddingVertical: 16,
                  borderRadius: 8,
                  alignItems: 'center',
                }}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: '500',
                  color: COLORS.background,
                  letterSpacing: 0.5,
                }}>
                  Respond to Date
                </Text>
              </TouchableOpacity>
            </View>
          );
        }
        break;

      case 'MUTUAL_INTEREST':
        return (
          <View style={{ padding: 32 }}>
            <TouchableOpacity
              onPress={() => setShowScheduling(true)}
              style={{
                backgroundColor: COLORS.success,
                paddingVertical: 16,
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{
                fontSize: 16,
                fontWeight: '500',
                color: COLORS.background,
                letterSpacing: 0.5,
              }}>
                Schedule Your Date
              </Text>
            </TouchableOpacity>
          </View>
        );

      case 'PAYMENT_PENDING':
        return (
          <View style={{ padding: 32 }}>
            <TouchableOpacity
              onPress={() => setShowPayment(true)}
              style={{
                backgroundColor: COLORS.warning,
                paddingVertical: 16,
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{
                fontSize: 16,
                fontWeight: '500',
                color: COLORS.background,
                letterSpacing: 0.5,
              }}>
                Complete Payment
              </Text>
            </TouchableOpacity>
          </View>
        );

      case 'CONFIRMED':
        return (
          <View style={{ padding: 32 }}>
            <View style={{
              backgroundColor: COLORS.success + '10',
              padding: 20,
              borderRadius: 12,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: COLORS.success + '30',
            }}>
              <Text style={{
                fontSize: 18,
                fontWeight: '500',
                color: COLORS.success,
                marginBottom: 8,
                textAlign: 'center',
              }}>
                🎉 Date Confirmed!
              </Text>
              
              {date.scheduling?.finalDateTime && (
                <Text style={{
                  fontSize: 14,
                  color: COLORS.textSecondary,
                  textAlign: 'center',
                  lineHeight: 20,
                }}>
                  {new Date(date.scheduling.finalDateTime).toLocaleDateString()} at{' '}
                  {new Date(date.scheduling.finalDateTime).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                  {date.scheduling.venue && ` at ${date.scheduling.venue}`}
                </Text>
              )}
            </View>
          </View>
        );

      default:
        return null;
    }

    return null;
  };

  const renderDateInfo = () => {
    if (!date) return null;

    return (
      <View style={{ padding: 32 }}>
        <DateCard
          date={date}
          onPress={() => {}}
          onInterestResponse={() => {}}
          isRTL={isRTL}
          style={{ marginBottom: 0 }}
        />
      </View>
    );
  };

  if (!date) {
    return (
      <AppTransition>
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
          <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
          {renderHeader()}
          <View style={{ flex: 1, paddingHorizontal: 32, paddingTop: 40 }}>
            <PremiumInlineLoader
              message="Date not found"
              size="medium"
              style={{ paddingVertical: 60 }}
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
        
        {renderHeader()}
        
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {renderDateInfo()}
          {renderActionButtons()}
        </ScrollView>

        {/* Interest Selection Modal */}
        <InterestSelectionModal
          visible={showInterestModal}
          onClose={() => setShowInterestModal(false)}
          onSubmit={handleInterestResponse}
          partnerName={date.partner?.firstName}
          isRTL={isRTL}
        />

        {/* Scheduling Interface */}
        <SchedulingInterface
          visible={showScheduling}
          onClose={() => setShowScheduling(false)}
          onSubmit={handleScheduleSubmit}
          date={date}
          isRTL={isRTL}
        />

        {/* Payment Interface */}
        <PaymentInterface
          visible={showPayment}
          onClose={() => setShowPayment(false)}
          onComplete={handlePaymentComplete}
          date={date}
          isRTL={isRTL}
        />


      </SafeAreaView>
    </AppTransition>
  );
};

export default DateDetailScreen;
