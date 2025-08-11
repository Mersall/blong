/**
 * BLONG Elite Onboarding Flow
 * Sophisticated onboarding navigation with smooth transitions
 */

import React, { useState } from 'react';
import { View } from 'react-native';
import LanguageSelection from './LanguageSelection';
import PhaseSelection from './PhaseSelection';

const ONBOARDING_STEPS = {
  LANGUAGE: 'language',
  PHASE: 'phase',
  COMPLETE: 'complete',
};

const OnboardingFlow = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(ONBOARDING_STEPS.LANGUAGE);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
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
