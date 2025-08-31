/**
 * BLONG Elite Onboarding Flow
 * Sophisticated onboarding navigation with smooth transitions
 */

import React, { useState } from 'react';
import { View } from 'react-native';
import LanguageSelection from './LanguageSelection';
import ThemeSelection from './ThemeSelection';
import PhaseSelection from './PhaseSelection';

const ONBOARDING_STEPS = {
  LANGUAGE: 'language',
  THEME: 'theme',
  PHASE: 'phase',
  COMPLETE: 'complete',
};

const OnboardingFlow = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(ONBOARDING_STEPS.LANGUAGE);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState('light');

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setCurrentStep(ONBOARDING_STEPS.THEME);
  };

  const handleThemeSelect = (theme) => {
    setSelectedTheme(theme);
    setCurrentStep(ONBOARDING_STEPS.PHASE);
  };

  const handlePhaseSelect = (phase) => {
    // Complete onboarding
    if (onComplete) {
      onComplete({
        language: selectedLanguage,
        phase: phase,
      });
    }
  };

  const renderCurrentScreen = () => {
    switch (currentStep) {
      case ONBOARDING_STEPS.LANGUAGE:
        return (
          <LanguageSelection
            onLanguageSelect={handleLanguageSelect}
          />
        );

      case ONBOARDING_STEPS.PHASE:
        return (
          <PhaseSelection
            onPhaseSelect={handlePhaseSelect}
          />
        );
      case ONBOARDING_STEPS.THEME:
        return (
          <ThemeSelection onThemeSelect={handleThemeSelect} />
        );

      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {renderCurrentScreen()}
    </View>
  );
};

export default OnboardingFlow;
