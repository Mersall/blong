/**
 * BLONG Elite Relationship Phase Selection Screen
 * Sophisticated phase selection with premium design
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  I18nManager,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp, useTheme, useRTL } from '../../contexts/AppContext';
import { AppTransition } from '../../components/AppTransition';
import styles, { PHASE_GRADIENTS } from './styles/PhaseSelectionStyles';

const RELATIONSHIP_PHASES = [
  {
    id: 'single',
    icon: '💝',
    gradient: ['#FF6B35', '#FF8A65'],
  },
  {
    id: 'engagement',
    icon: '💍',
    gradient: ['#FFD700', '#FFA000'],
  },
  {
    id: 'engagement_day_prep',
    icon: '✨',
    gradient: ['#FF6B35', '#FFD700'],
  },
];

const PhaseSelection = ({ onPhaseSelect }) => {
  const { t } = useApp();
  const { colors } = useTheme();
  const { isRTL, rtlStyles } = useRTL();
  const [selectedPhase, setSelectedPhase] = useState(null);

  const handlePhaseSelect = (phase) => {
    setSelectedPhase(phase);
  };

  const handleContinue = () => {
    if (selectedPhase && onPhaseSelect) {
      // Add translated title and other details to the phase object
      const enrichedPhase = {
        ...selectedPhase,
        title: t(`onboarding.phases.${selectedPhase.id}.title`),
        subtitle: t(`onboarding.phases.${selectedPhase.id}.subtitle`),
        description: t(`onboarding.phases.${selectedPhase.id}.description`),
      };

      onPhaseSelect(enrichedPhase);
    }
  };

  return (
    <AppTransition>
      <SafeAreaView style={{
        flex: 1,
        backgroundColor: colors.background,
      }}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Elite Header */}
      <View style={{
        paddingTop: 40,
        paddingBottom: 60,
        paddingHorizontal: 32,
        alignItems: 'center',
      }}>
        <Text style={{
          fontSize: 28,
          fontWeight: '300',
          letterSpacing: 8,
          color: colors.text,
          marginBottom: 16,
          textAlign: rtlStyles.textAlign,
          writingDirection: rtlStyles.writingDirection,
        }}>
          {t('onboarding.brand')}
        </Text>

        <View style={{
          width: 40,
          height: 2,
          backgroundColor: colors.accent,
          marginBottom: 24,
          alignSelf: rtlStyles.alignSelf,
        }} />

        <Text style={{
          fontSize: 20,
          fontWeight: '300',
          color: colors.text,
          marginBottom: 8,
          textAlign: rtlStyles.textAlignCenter,
          writingDirection: rtlStyles.writingDirection,
        }}>
          {t('onboarding.phaseTitle')}
        </Text>

        <Text style={{
          fontSize: 14,
          color: colors.textSecondary,
          textAlign: rtlStyles.textAlignCenter,
          lineHeight: 20,
          writingDirection: rtlStyles.writingDirection,
        }}>
          {t('onboarding.phaseSubtitle')}
        </Text>
      </View>

      {/* Phase Options - Scrollable */}
      <ScrollView
        style={{
          flex: 1,
        }}
        contentContainerStyle={{
          paddingHorizontal: 32,
          paddingBottom: 140, // Add space for fixed button + extra padding
        }}
        showsVerticalScrollIndicator={false}
      >
        {RELATIONSHIP_PHASES.map((phase) => (
          <TouchableOpacity
            key={phase.id}
            style={{
              marginBottom: 20,
              borderRadius: 12,
              overflow: 'hidden',
              shadowColor: colors.shadow,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: selectedPhase?.id === phase.id ? 0.15 : 0.08,
              shadowRadius: 16,
              elevation: selectedPhase?.id === phase.id ? 8 : 4,
            }}
            onPress={() => handlePhaseSelect(phase)}
          >
            <LinearGradient
              colors={selectedPhase?.id === phase.id
                ? phase.gradient
                : [colors.surface, colors.background]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                padding: 24,
                borderWidth: selectedPhase?.id === phase.id ? 0 : 1,
                borderColor: colors.border,
                borderRadius: 12,
              }}
            >
              <View style={{
                flexDirection: rtlStyles.flexDirection,
                alignItems: 'center',
                marginBottom: 12,
              }}>
                <Text style={{
                  fontSize: 32,
                  marginRight: isRTL ? 0 : 16,
                  marginLeft: isRTL ? 16 : 0,
                }}>
                  {phase.icon}
                </Text>

                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 20,
                    fontWeight: '500',
                    color: selectedPhase?.id === phase.id
                      ? colors.background
                      : colors.text,
                    marginBottom: 4,
                    textAlign: rtlStyles.textAlign,
                    writingDirection: rtlStyles.writingDirection,
                  }}>
                    {t(`onboarding.phases.${phase.id}.title`)}
                  </Text>

                  <Text style={{
                    fontSize: 14,
                    fontWeight: '400',
                    color: selectedPhase?.id === phase.id
                      ? colors.background
                      : colors.textSecondary,
                    letterSpacing: 1,
                    textAlign: rtlStyles.textAlign,
                    writingDirection: rtlStyles.writingDirection,
                  }}>
                    {t(`onboarding.phases.${phase.id}.subtitle`)}
                  </Text>
                </View>
                
                {selectedPhase?.id === phase.id && (
                  <View style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: colors.background,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <Text style={{
                      color: colors.accent,
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}>
                      ✓
                    </Text>
                  </View>
                )}
              </View>
              
              <Text style={{
                fontSize: 14,
                color: selectedPhase?.id === phase.id
                  ? colors.background
                  : colors.textSecondary,
                lineHeight: 20,
                opacity: selectedPhase?.id === phase.id ? 0.9 : 1,
                textAlign: rtlStyles.textAlign,
                writingDirection: rtlStyles.writingDirection,
              }}>
                {t(`onboarding.phases.${phase.id}.description`)}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Continue Button - Fixed positioning */}
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.background,
        paddingHorizontal: 32,
        paddingBottom: 40,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        zIndex: 1000,
      }}>
        <TouchableOpacity
          style={{
            backgroundColor: selectedPhase ? colors.text : colors.border,
            paddingVertical: 16,
            borderRadius: 8,
            alignItems: 'center',
            opacity: selectedPhase ? 1 : 0.5,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 8,
          }}
          onPress={handleContinue}
          disabled={!selectedPhase}
        >
          <Text style={{
            color: colors.background,
            fontSize: 16,
            fontWeight: '500',
            letterSpacing: 1,
          }}>
            {t('onboarding.startJourney')}
          </Text>
        </TouchableOpacity>

        <Text style={{
          fontSize: 12,
          color: colors.textTertiary,
          textAlign: rtlStyles.textAlignCenter,
          marginTop: 16,
          letterSpacing: 1,
          writingDirection: rtlStyles.writingDirection,
        }}>
          {t('onboarding.phaseFooter')}
        </Text>
      </View>
      </SafeAreaView>
    </AppTransition>
  );
};

export default PhaseSelection;
