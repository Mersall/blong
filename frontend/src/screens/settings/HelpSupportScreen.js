/**
 * BLONG Help & Support Screen - Premium Elite Design
 * Help resources and support contact
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, TextInput, Alert, Linking } from 'react-native';
import { AppTransition } from '../../components/AppTransition';

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
};

const HelpSupportScreen = ({ onBack }) => {
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    email: '',
  });
  const [isSending, setIsSending] = useState(false);

  const faqItems = [
    {
      question: 'How does BLONG matching work?',
      answer: 'BLONG uses advanced AI algorithms to analyze your personality and preferences to find compatible matches based on deep compatibility factors.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, we use industry-standard encryption and security measures to protect your personal information. Your privacy is our top priority.',
    },
    {
      question: 'How can I improve my matches?',
      answer: 'Complete your personality assessment, add detailed profile information, and regularly update your preferences to get better matches.',
    },
    {
      question: 'Can I change my relationship phase?',
      answer: 'Yes, you can update your relationship phase in the Preferences section of Settings at any time.',
    },
    {
      question: 'How do I report inappropriate behavior?',
      answer: 'You can report any inappropriate behavior through the profile menu or by contacting our support team directly.',
    },
  ];

  const supportOptions = [
    {
      title: 'Email Support',
      subtitle: 'Get help via email',
      icon: '📧',
      action: () => Linking.openURL('mailto:support@blong.app'),
    },
  ];

  const handleSendMessage = async () => {
    if (!contactForm.subject.trim() || !contactForm.message.trim() || !contactForm.email.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsSending(true);
    try {
      // Simulate sending message
      await new Promise(resolve => setTimeout(resolve, 2000));
      Alert.alert('Success', 'Your message has been sent. We\'ll get back to you soon!');
      setContactForm({ subject: '', message: '', email: '' });
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const FAQItem = ({ item, index }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        style={{
          backgroundColor: COLORS.surface,
          borderRadius: 8,
          padding: 20,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: COLORS.border,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '300',
            color: COLORS.text,
            flex: 1,
            marginRight: 16,
          }}>
            {item.question}
          </Text>
          <Text style={{
            fontSize: 18,
            color: COLORS.accent,
            transform: [{ rotate: isExpanded ? '180deg' : '0deg' }],
          }}>
            ↓
          </Text>
        </View>
        
        {isExpanded && (
          <Text style={{
            fontSize: 14,
            color: COLORS.textSecondary,
            lineHeight: 20,
            marginTop: 12,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: COLORS.border,
          }}>
            {item.answer}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const SupportOption = ({ option }) => (
    <TouchableOpacity
      onPress={option.action}
      style={{
        backgroundColor: COLORS.surface,
        borderRadius: 8,
        padding: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: 24, marginRight: 16 }}>{option.icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: 16,
          fontWeight: '300',
          color: COLORS.text,
          marginBottom: 4,
        }}>
          {option.title}
        </Text>
        <Text style={{
          fontSize: 12,
          color: COLORS.textSecondary,
        }}>
          {option.subtitle}
        </Text>
      </View>
      <Text style={{ fontSize: 14, color: COLORS.accent }}>→</Text>
    </TouchableOpacity>
  );

  return (
    <AppTransition>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

        {/* Elite Header */}
        <View style={{
          paddingTop: 20,
          paddingBottom: 24,
          paddingHorizontal: 32,
          backgroundColor: COLORS.background,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={onBack} style={{ padding: 8 }}>
              <Text style={{ fontSize: 18, color: COLORS.accent }}>←</Text>
            </TouchableOpacity>
            
            <Text style={{
              fontSize: 18,
              fontWeight: '300',
              color: COLORS.text,
              letterSpacing: 1,
            }}>
              Help & Support
            </Text>
            
            <View style={{ width: 40 }} />
          </View>
        </View>

        {/* Help Content */}
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 32, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Support Options */}
          <View style={{ marginBottom: 32 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '300',
              color: COLORS.text,
              marginBottom: 16,
              letterSpacing: 0.5,
            }}>
              Contact Support
            </Text>

            {supportOptions.map((option, index) => (
              <SupportOption key={index} option={option} />
            ))}
          </View>

          {/* FAQ Section */}
          <View style={{ marginBottom: 32 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '300',
              color: COLORS.text,
              marginBottom: 16,
              letterSpacing: 0.5,
            }}>
              Frequently Asked Questions
            </Text>

            {faqItems.map((item, index) => (
              <FAQItem key={index} item={item} index={index} />
            ))}
          </View>

          {/* Contact Form */}
          <View style={{ marginBottom: 32 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '300',
              color: COLORS.text,
              marginBottom: 16,
              letterSpacing: 0.5,
            }}>
              Send us a Message
            </Text>

            <View style={{
              backgroundColor: COLORS.surface,
              borderRadius: 8,
              padding: 24,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}>
              <TextInput
                value={contactForm.email}
                onChangeText={(text) => setContactForm({ ...contactForm, email: text })}
                placeholder="Your email address"
                placeholderTextColor={COLORS.textTertiary}
                style={{
                  backgroundColor: COLORS.background,
                  borderRadius: 8,
                  padding: 16,
                  fontSize: 16,
                  color: COLORS.text,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  marginBottom: 16,
                }}
              />

              <TextInput
                value={contactForm.subject}
                onChangeText={(text) => setContactForm({ ...contactForm, subject: text })}
                placeholder="Subject"
                placeholderTextColor={COLORS.textTertiary}
                style={{
                  backgroundColor: COLORS.background,
                  borderRadius: 8,
                  padding: 16,
                  fontSize: 16,
                  color: COLORS.text,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  marginBottom: 16,
                }}
              />

              <TextInput
                value={contactForm.message}
                onChangeText={(text) => setContactForm({ ...contactForm, message: text })}
                placeholder="Describe your issue or question..."
                placeholderTextColor={COLORS.textTertiary}
                multiline
                numberOfLines={4}
                style={{
                  backgroundColor: COLORS.background,
                  borderRadius: 8,
                  padding: 16,
                  fontSize: 16,
                  color: COLORS.text,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  textAlignVertical: 'top',
                  minHeight: 100,
                  marginBottom: 20,
                }}
              />

              <TouchableOpacity
                onPress={handleSendMessage}
                disabled={isSending}
                style={{
                  backgroundColor: COLORS.accent,
                  borderRadius: 8,
                  padding: 16,
                  alignItems: 'center',
                  opacity: isSending ? 0.6 : 1,
                }}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: '500',
                  color: COLORS.background,
                  letterSpacing: 0.5,
                }}>
                  {isSending ? 'Sending...' : 'Send Message'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </AppTransition>
  );
};

export default HelpSupportScreen;
