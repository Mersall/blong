/**
 * BLONG About Screen - Premium Elite Design
 * App information, version, and legal links
 */

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Linking } from 'react-native';
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
};

const AboutScreen = ({ onBack }) => {
  const appInfo = {
    version: '1.0.0',
    buildNumber: '2024.1',
    releaseDate: 'December 2024',
    developer: 'BLONG Team',
  };

  const legalLinks = [
    {
      title: 'Terms of Service',
      subtitle: 'Read our terms and conditions',
      icon: '📄',
      url: 'https://blong.app/terms',
    },
    {
      title: 'Privacy Policy',
      subtitle: 'How we protect your privacy',
      icon: '🔒',
      url: 'https://blong.app/privacy',
    },
    {
      title: 'Community Guidelines',
      subtitle: 'Our community standards',
      icon: '👥',
      url: 'https://blong.app/guidelines',
    },
    {
      title: 'Cookie Policy',
      subtitle: 'How we use cookies',
      icon: '🍪',
      url: 'https://blong.app/cookies',
    },
  ];

  const socialLinks = [
    {
      title: 'Website',
      icon: '🌐',
      url: 'https://blong.app',
    },
    {
      title: 'Instagram',
      icon: '📷',
      url: 'https://instagram.com/blongapp',
    },
    {
      title: 'Twitter',
      icon: '🐦',
      url: 'https://twitter.com/blongapp',
    },
    {
      title: 'LinkedIn',
      icon: '💼',
      url: 'https://linkedin.com/company/blong',
    },
  ];

  const features = [
    'AI-Powered Personality Matching',
    'Multi-Language Support',
    'Relationship Phase Customization',
    'Advanced Privacy Controls',
    'Secure Messaging',
    'Professional Matchmaking',
  ];

  const handleLinkPress = (url) => {
    Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
  };

  const LinkItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleLinkPress(item.url)}
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
      <Text style={{ fontSize: 20, marginRight: 16 }}>{item.icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: 16,
          fontWeight: '300',
          color: COLORS.text,
          marginBottom: item.subtitle ? 4 : 0,
        }}>
          {item.title}
        </Text>
        {item.subtitle && (
          <Text style={{
            fontSize: 12,
            color: COLORS.textSecondary,
          }}>
            {item.subtitle}
          </Text>
        )}
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
              About BLONG
            </Text>
            
            <View style={{ width: 40 }} />
          </View>
        </View>

        {/* About Content */}
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 32, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* App Logo and Info */}
          <View style={{
            alignItems: 'center',
            marginBottom: 40,
            paddingVertical: 32,
          }}>
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              backgroundColor: COLORS.accent + '20',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 24,
            }}>
              <Text style={{
                fontSize: 32,
                fontWeight: '300',
                letterSpacing: 4,
                color: COLORS.accent,
              }}>
                B
              </Text>
            </View>

            <Text style={{
              fontSize: 28,
              fontWeight: '300',
              letterSpacing: 8,
              color: COLORS.text,
              marginBottom: 8,
            }}>
              BLONG
            </Text>

            <Text style={{
              fontSize: 16,
              color: COLORS.textSecondary,
              textAlign: 'center',
              lineHeight: 24,
              marginBottom: 16,
            }}>
              Elite Matrimonial Platform
            </Text>

            <Text style={{
              fontSize: 14,
              color: COLORS.textTertiary,
              textAlign: 'center',
              lineHeight: 20,
            }}>
              Connecting hearts through intelligent matching and meaningful relationships
            </Text>
          </View>

          {/* App Version Info */}
          <View style={{
            backgroundColor: COLORS.surface,
            borderRadius: 8,
            padding: 24,
            marginBottom: 32,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '300',
              color: COLORS.text,
              marginBottom: 16,
              letterSpacing: 0.5,
            }}>
              App Information
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ fontSize: 14, color: COLORS.textSecondary }}>Version</Text>
              <Text style={{ fontSize: 14, color: COLORS.text }}>{appInfo.version}</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ fontSize: 14, color: COLORS.textSecondary }}>Build</Text>
              <Text style={{ fontSize: 14, color: COLORS.text }}>{appInfo.buildNumber}</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ fontSize: 14, color: COLORS.textSecondary }}>Release Date</Text>
              <Text style={{ fontSize: 14, color: COLORS.text }}>{appInfo.releaseDate}</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, color: COLORS.textSecondary }}>Developer</Text>
              <Text style={{ fontSize: 14, color: COLORS.text }}>{appInfo.developer}</Text>
            </View>
          </View>

          {/* Features */}
          <View style={{ marginBottom: 32 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '300',
              color: COLORS.text,
              marginBottom: 16,
              letterSpacing: 0.5,
            }}>
              Key Features
            </Text>

            <View style={{
              backgroundColor: COLORS.surface,
              borderRadius: 8,
              padding: 24,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}>
              {features.map((feature, index) => (
                <View key={index} style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: index < features.length - 1 ? 12 : 0,
                }}>
                  <Text style={{ fontSize: 12, color: COLORS.accent, marginRight: 12 }}>✓</Text>
                  <Text style={{ fontSize: 14, color: COLORS.text }}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Legal Links */}
          <View style={{ marginBottom: 32 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '300',
              color: COLORS.text,
              marginBottom: 16,
              letterSpacing: 0.5,
            }}>
              Legal & Privacy
            </Text>

            {legalLinks.map((link, index) => (
              <LinkItem key={index} item={link} />
            ))}
          </View>

          {/* Social Links */}
          <View style={{ marginBottom: 32 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '300',
              color: COLORS.text,
              marginBottom: 16,
              letterSpacing: 0.5,
            }}>
              Connect With Us
            </Text>

            {socialLinks.map((link, index) => (
              <LinkItem key={index} item={link} />
            ))}
          </View>

          {/* Copyright */}
          <View style={{
            alignItems: 'center',
            paddingTop: 24,
            borderTopWidth: 1,
            borderTopColor: COLORS.border,
          }}>
            <Text style={{
              fontSize: 12,
              color: COLORS.textTertiary,
              textAlign: 'center',
              lineHeight: 18,
            }}>
              © 2024 BLONG. All rights reserved.{'\n'}
              Made with ❤️ for meaningful connections
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </AppTransition>
  );
};

export default AboutScreen;
