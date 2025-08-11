/**
 * BLONG Payment Interface - Premium Elite Design
 * Interface for users to complete payment for confirmed dates
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Alert, ActivityIndicator } from 'react-native';
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
  overlay: 'rgba(0, 0, 0, 0.5)',
};

const PaymentInterface = ({ 
  visible, 
  onClose, 
  onComplete, 
  date,
  isRTL = false 
}) => {
  const [loading, setLoading] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [paymentError, setPaymentError] = useState(null);

  useEffect(() => {
    if (visible && date) {
      initializePayment();
    }
  }, [visible, date]);

  const initializePayment = async () => {
    try {
      setLoading(true);
      setPaymentError(null);

      const amount = date.scheduling?.estimatedCost || 50; // Default amount
      const paymentData = await dateDeliveryService.createPayment(date.id, amount);
      
      setPaymentIntent(paymentData);
    } catch (error) {
      console.error('Error initializing payment:', error);
      setPaymentError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!paymentIntent) return;

    try {
      setLoading(true);
      
      // In a real app, this would integrate with Stripe or another payment processor
      // For now, we'll simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful payment
      const mockPaymentData = {
        paymentIntentId: paymentIntent.paymentIntentId,
        status: 'succeeded',
        amount: paymentIntent.amount,
      };

      onComplete(mockPaymentData);
    } catch (error) {
      console.error('Error processing payment:', error);
      Alert.alert('Payment Failed', 'Please try again or contact support.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPaymentIntent(null);
    setPaymentError(null);
    onClose();
  };

  const renderHeader = () => (
    <View style={{
      paddingBottom: 24,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
      alignItems: 'center',
    }}>
      <Text style={{
        fontSize: 24,
        fontWeight: '300',
        color: COLORS.text,
        marginBottom: 8,
        textAlign: 'center',
        letterSpacing: 0.5,
      }}>
        Complete Payment
      </Text>
      
      <Text style={{
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
      }}>
        Secure your date with {date?.partner?.firstName}
      </Text>
    </View>
  );

  const renderDateSummary = () => (
    <View style={{
      backgroundColor: COLORS.surface,
      borderRadius: 12,
      padding: 20,
      marginVertical: 24,
      borderWidth: 1,
      borderColor: COLORS.border,
    }}>
      <Text style={{
        fontSize: 18,
        fontWeight: '500',
        color: COLORS.text,
        marginBottom: 16,
        textAlign: 'center',
      }}>
        Date Summary
      </Text>

      <View style={{ gap: 12 }}>
        <View style={{
          flexDirection: isRTL ? 'row-reverse' : 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Text style={{
            fontSize: 14,
            color: COLORS.textSecondary,
          }}>
            Partner:
          </Text>
          <Text style={{
            fontSize: 14,
            fontWeight: '500',
            color: COLORS.text,
          }}>
            {date?.partner?.firstName}
          </Text>
        </View>

        {date?.scheduling?.finalDateTime && (
          <View style={{
            flexDirection: isRTL ? 'row-reverse' : 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Text style={{
              fontSize: 14,
              color: COLORS.textSecondary,
            }}>
              Date & Time:
            </Text>
            <Text style={{
              fontSize: 14,
              fontWeight: '500',
              color: COLORS.text,
              textAlign: isRTL ? 'left' : 'right',
              flex: 1,
              marginLeft: isRTL ? 0 : 16,
              marginRight: isRTL ? 16 : 0,
            }}>
              {new Date(date.scheduling.finalDateTime).toLocaleDateString()}{'\n'}
              {new Date(date.scheduling.finalDateTime).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </View>
        )}

        {date?.scheduling?.venue && (
          <View style={{
            flexDirection: isRTL ? 'row-reverse' : 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Text style={{
              fontSize: 14,
              color: COLORS.textSecondary,
            }}>
              Venue:
            </Text>
            <Text style={{
              fontSize: 14,
              fontWeight: '500',
              color: COLORS.text,
              textAlign: isRTL ? 'left' : 'right',
              flex: 1,
              marginLeft: isRTL ? 0 : 16,
              marginRight: isRTL ? 16 : 0,
            }}>
              {date.scheduling.venue}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderPaymentDetails = () => {
    if (!paymentIntent) return null;

    return (
      <View style={{
        backgroundColor: COLORS.accent + '10',
        borderRadius: 12,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: COLORS.accent + '30',
      }}>
        <Text style={{
          fontSize: 18,
          fontWeight: '500',
          color: COLORS.accent,
          marginBottom: 16,
          textAlign: 'center',
        }}>
          Payment Details
        </Text>

        <View style={{
          flexDirection: isRTL ? 'row-reverse' : 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}>
          <Text style={{
            fontSize: 16,
            color: COLORS.text,
          }}>
            Date Experience Fee:
          </Text>
          <Text style={{
            fontSize: 18,
            fontWeight: '600',
            color: COLORS.accent,
          }}>
            ${paymentIntent.amount}
          </Text>
        </View>

        <View style={{
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: COLORS.accent + '30',
        }}>
          <Text style={{
            fontSize: 12,
            color: COLORS.textSecondary,
            textAlign: 'center',
            lineHeight: 16,
          }}>
            This fee covers venue coordination, date activities, and premium experience features.
          </Text>
        </View>
      </View>
    );
  };

  const renderPaymentMethod = () => (
    <View style={{
      backgroundColor: COLORS.surface,
      borderRadius: 12,
      padding: 20,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: COLORS.border,
    }}>
      <Text style={{
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.text,
        marginBottom: 16,
        textAlign: 'center',
      }}>
        Payment Method
      </Text>

      <View style={{
        backgroundColor: COLORS.background,
        borderRadius: 8,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        flexDirection: isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
      }}>
        <Text style={{
          fontSize: 24,
          marginRight: isRTL ? 0 : 12,
          marginLeft: isRTL ? 12 : 0,
        }}>
          💳
        </Text>
        
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '500',
            color: COLORS.text,
            marginBottom: 4,
          }}>
            Secure Payment
          </Text>
          <Text style={{
            fontSize: 14,
            color: COLORS.textSecondary,
          }}>
            Powered by Stripe • 256-bit SSL encryption
          </Text>
        </View>
      </View>
    </View>
  );

  const renderActionButtons = () => (
    <View style={{
      flexDirection: isRTL ? 'row-reverse' : 'row',
      gap: 16,
      paddingTop: 24,
      borderTopWidth: 1,
      borderTopColor: COLORS.border,
    }}>
      <TouchableOpacity
        onPress={handleClose}
        disabled={loading}
        style={{
          flex: 1,
          backgroundColor: COLORS.surface,
          paddingVertical: 16,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: COLORS.border,
        }}
      >
        <Text style={{
          fontSize: 16,
          fontWeight: '500',
          color: COLORS.textSecondary,
          textAlign: 'center',
        }}>
          Cancel
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handlePayment}
        disabled={loading || !paymentIntent}
        style={{
          flex: 1,
          backgroundColor: loading || !paymentIntent ? COLORS.border : COLORS.success,
          paddingVertical: 16,
          borderRadius: 8,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {loading ? (
          <ActivityIndicator size="small" color={COLORS.background} />
        ) : (
          <Text style={{
            fontSize: 16,
            fontWeight: '500',
            color: COLORS.background,
            textAlign: 'center',
          }}>
            Pay ${paymentIntent?.amount || '0'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderError = () => {
    if (!paymentError) return null;

    return (
      <View style={{
        backgroundColor: COLORS.error + '10',
        borderRadius: 8,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: COLORS.error + '30',
      }}>
        <Text style={{
          fontSize: 14,
          color: COLORS.error,
          textAlign: 'center',
          lineHeight: 20,
        }}>
          {paymentError}
        </Text>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: COLORS.overlay,
        justifyContent: 'flex-end',
      }}>
        <View style={{
          backgroundColor: COLORS.background,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          maxHeight: '90%',
          paddingTop: 32,
          paddingHorizontal: 32,
          paddingBottom: 32,
        }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {renderHeader()}
            {renderDateSummary()}
            {renderError()}
            {renderPaymentDetails()}
            {renderPaymentMethod()}
            {renderActionButtons()}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default PaymentInterface;
