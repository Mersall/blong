/**
 * BLONG Quiz Question Transition
 * Smooth animated transitions between quiz questions
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const QuizQuestionTransition = ({ 
  children, 
  transitionKey, 
  direction = 'forward',
  onTransitionComplete 
}) => {
  const [currentKey, setCurrentKey] = useState(transitionKey);
  const [nextKey, setNextKey] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const currentAnim = useRef(new Animated.Value(1)).current;
  const nextAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (transitionKey !== currentKey && !isTransitioning) {
      setNextKey(transitionKey);
      startTransition();
    }
  }, [transitionKey, currentKey, isTransitioning]);

  const startTransition = () => {
    setIsTransitioning(true);
    
    const isForward = direction === 'forward';
    const slideDistance = isForward ? -screenWidth : screenWidth;
    
    // Parallel animations for smooth transition
    Animated.parallel([
      // Slide animation
      Animated.timing(slideAnim, {
        toValue: slideDistance,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      
      // Scale animation for depth effect
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      
      // Fade animation
      Animated.timing(fadeAnim, {
        toValue: 0.3,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Switch content
      setCurrentKey(nextKey);
      setNextKey(null);
      
      // Reset animations for new content
      slideAnim.setValue(isForward ? screenWidth : -screenWidth);
      scaleAnim.setValue(0.95);
      fadeAnim.setValue(0.3);
      
      // Animate in new content
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          delay: 100,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
        
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          delay: 100,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsTransitioning(false);
        if (onTransitionComplete) {
          onTransitionComplete();
        }
      });
    });
  };

  const renderTransitionOverlay = () => {
    if (!isTransitioning) return null;
    
    return (
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        zIndex: 1000,
      }}>
        {/* Particle effect overlay */}
        <View style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 100,
          height: 100,
          marginTop: -50,
          marginLeft: -50,
          borderRadius: 50,
          backgroundColor: 'rgba(255, 107, 53, 0.1)',
          transform: [
            { scale: scaleAnim.interpolate({
              inputRange: [0.95, 1],
              outputRange: [2, 0],
              extrapolate: 'clamp',
            }) }
          ],
        }} />
      </View>
    );
  };

  return (
    <View style={{ flex: 1, overflow: 'hidden' }}>
      <Animated.View style={{
        flex: 1,
        transform: [
          { translateX: slideAnim },
          { scale: scaleAnim },
        ],
        opacity: fadeAnim,
      }}>
        {children}
      </Animated.View>
      
      {renderTransitionOverlay()}
    </View>
  );
};

// Enhanced Quiz Question Card with micro-interactions
export const QuizQuestionCard = ({ 
  question, 
  options, 
  selectedOption, 
  onOptionSelect,
  style 
}) => {
  const [optionAnimations] = useState(
    options.reduce((acc, option) => {
      acc[option.id] = {
        scale: new Animated.Value(1),
        opacity: new Animated.Value(1),
      };
      return acc;
    }, {})
  );

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

  const handleOptionPress = (option) => {
    // Animate the pressed option
    const anim = optionAnimations[option.id];
    if (anim) {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(anim.scale, {
            toValue: 0.95,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(anim.opacity, {
            toValue: 0.8,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(anim.scale, {
            toValue: 1,
            duration: 200,
            easing: Easing.out(Easing.back(1.5)),
            useNativeDriver: true,
          }),
          Animated.timing(anim.opacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }

    // Animate other options to fade slightly
    Object.keys(optionAnimations).forEach(optionId => {
      if (optionId !== option.id) {
        Animated.timing(optionAnimations[optionId].opacity, {
          toValue: 0.6,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    });

    // Call the selection handler with a slight delay for animation
    setTimeout(() => {
      onOptionSelect(option);
    }, 300);
  };

  return (
    <View style={[{
      flex: 1,
      paddingHorizontal: 32,
      paddingVertical: 40,
      justifyContent: 'center',
    }, style]}>
      {/* Question Text */}
      <View style={{
        alignItems: 'center',
        marginBottom: 48,
      }}>
        <Animated.Text style={{
          fontSize: 24,
          fontWeight: '300',
          color: COLORS.text,
          textAlign: 'center',
          lineHeight: 32,
          paddingHorizontal: 16,
        }}>
          {question}
        </Animated.Text>
      </View>

      {/* Options */}
      <View style={{ gap: 16 }}>
        {options.map((option, index) => {
          const isSelected = selectedOption === option.id;
          const anim = optionAnimations[option.id];
          
          return (
            <Animated.View
              key={option.id}
              style={{
                transform: anim ? [{ scale: anim.scale }] : [],
                opacity: anim ? anim.opacity : 1,
              }}
            >
              <Animated.View style={{
                opacity: Animated.add(
                  new Animated.Value(0.3),
                  Animated.multiply(
                    new Animated.Value(0.7),
                    new Animated.Value(index * 0.1)
                  )
                ),
              }}>
                <TouchableOpacity
                  onPress={() => handleOptionPress(option)}
                  style={{
                    backgroundColor: isSelected ? `${COLORS.accent}15` : COLORS.surface,
                    borderRadius: 16,
                    padding: 20,
                    borderWidth: 2,
                    borderColor: isSelected ? COLORS.accent : COLORS.border,
                    shadowColor: COLORS.shadow,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: isSelected ? 0.1 : 0.05,
                    shadowRadius: isSelected ? 12 : 8,
                    elevation: isSelected ? 4 : 2,
                  }}
                >
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '400',
                    color: isSelected ? COLORS.accent : COLORS.text,
                    textAlign: 'center',
                    lineHeight: 22,
                  }}>
                    {option.optionText}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
};

export default QuizQuestionTransition;
