import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { AppTransition } from '../../components/AppTransition';

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

const ThemeSelection = ({ onThemeSelect }) => {
  const [selected, setSelected] = useState('light');

  return (
    <AppTransition>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

        <View style={{ paddingTop: 40, paddingBottom: 32, paddingHorizontal: 32, alignItems: 'center' }}>
          <Text style={{ fontSize: 28, fontWeight: '300', letterSpacing: 8, color: COLORS.text, marginBottom: 16 }}>BLONG</Text>
          <View style={{ width: 40, height: 2, backgroundColor: COLORS.accent, marginBottom: 24 }} />
          <Text style={{ fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20 }}>
            Choose your theme
          </Text>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          {['light', 'dark'].map((option) => (
            <TouchableOpacity
              key={option}
              accessible
              accessibilityRole="button"
              accessibilityLabel={`Select ${option} theme`}
              onPress={() => setSelected(option)}
              style={{
                backgroundColor: COLORS.surface,
                borderRadius: 8,
                padding: 24,
                shadowColor: COLORS.shadow,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 12,
                elevation: 2,
                borderWidth: selected === option ? 2 : 1,
                borderColor: selected === option ? COLORS.accent : COLORS.border,
                marginBottom: 16,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '300', color: COLORS.text }}>{option === 'light' ? 'Light' : 'Dark'}</Text>
              <Text style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 8 }}>
                {option === 'light' ? 'Bright and minimal' : 'Dimmed and elegant'}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            onPress={() => onThemeSelect?.(selected)}
            accessibilityRole="button"
            accessibilityLabel="Continue"
            style={{
              backgroundColor: COLORS.accent,
              paddingHorizontal: 32,
              paddingVertical: 12,
              borderRadius: 24,
              shadowColor: COLORS.accent,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 4,
              marginTop: 24,
            }}
          >
            <Text style={{ color: COLORS.background, fontSize: 14, fontWeight: '500', letterSpacing: 0.5, textAlign: 'center' }}>Continue</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </AppTransition>
  );
};

export default ThemeSelection;

