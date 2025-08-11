/**
 * BLONG Quiz Navigator
 * Handles smooth navigation between quiz sections with animations
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  PanGestureHandler,
  State,
  Dimensions,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const QuizNavigator = ({ 
  categories, 
  currentCategoryIndex, 
  currentQuestionIndex,
  onNavigate,
  children 
}) => {
  const [slideAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(1));
  const panRef = useRef();

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

  const getCurrentQuestion = () => {
    if (!categories[currentCategoryIndex]) return null;
    const currentCategory = categories[currentCategoryIndex];
    return currentCategory.questions[currentQuestionIndex];
  };

  const getTotalProgress = () => {
    if (categories.length === 0) return 0;
    
    let totalQuestions = 0;
    let currentPosition = 0;
    
    categories.forEach((category, catIndex) => {
      category.questions.forEach((question, qIndex) => {
        totalQuestions++;
        if (catIndex < currentCategoryIndex || 
            (catIndex === currentCategoryIndex && qIndex < currentQuestionIndex)) {
          currentPosition++;
        }
      });
    });
    
    return totalQuestions > 0 ? (currentPosition / totalQuestions) * 100 : 0;
  };

  const getCategoryProgress = () => {
    const currentCategory = categories[currentCategoryIndex];
    if (!currentCategory) return 0;
    
    const totalQuestions = currentCategory.questions.length;
    return totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;
  };

  const animateToNext = (callback) => {
    Animated.sequence([
      // Fade out current content
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      // Slide out to left
      Animated.timing(slideAnim, {
        toValue: -screenWidth,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Execute navigation callback
      if (callback) callback();
      
      // Reset position and fade in
      slideAnim.setValue(screenWidth);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          delay: 100,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const animateToPrevious = (callback) => {
    Animated.sequence([
      // Fade out current content
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      // Slide out to right
      Animated.timing(slideAnim, {
        toValue: screenWidth,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Execute navigation callback
      if (callback) callback();
      
      // Reset position and fade in
      slideAnim.setValue(-screenWidth);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          delay: 100,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleSwipeGesture = (event) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX, velocityX } = event.nativeEvent;
      
      // Swipe right (go to previous)
      if (translationX > 50 || velocityX > 500) {
        const canGoPrevious = currentQuestionIndex > 0 || currentCategoryIndex > 0;
        if (canGoPrevious && onNavigate) {
          animateToPrevious(() => onNavigate('previous'));
        }
      }
      // Swipe left (go to next) - only if question is answered
      else if (translationX < -50 || velocityX < -500) {
        const currentQuestion = getCurrentQuestion();
        // Add logic here to check if question is answered
        // For now, we'll allow navigation
        if (onNavigate) {
          animateToNext(() => onNavigate('next'));
        }
      }
    }
  };

  const renderProgressIndicator = () => {
    const totalProgress = getTotalProgress();
    const categoryProgress = getCategoryProgress();
    const currentCategory = categories[currentCategoryIndex];

    return (
      <View style={{
        paddingHorizontal: 32,
        paddingVertical: 20,
        backgroundColor: COLORS.surface,
      }}>
        {/* Overall Progress */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}>
          <Text style={{
            fontSize: 14,
            fontWeight: '500',
            color: COLORS.text,
          }}>
            Overall Progress
          </Text>
          <Text style={{
            fontSize: 12,
            color: COLORS.textSecondary,
          }}>
            {Math.round(totalProgress)}% Complete
          </Text>
        </View>
        
        <View style={{
          height: 4,
          backgroundColor: COLORS.border,
          borderRadius: 2,
          marginBottom: 16,
          overflow: 'hidden',
        }}>
          <Animated.View style={{
            height: '100%',
            backgroundColor: COLORS.accent,
            borderRadius: 2,
            width: `${totalProgress}%`,
          }} />
        </View>

        {/* Category Progress */}
        {currentCategory && (
          <View>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}>
              <Text style={{
                fontSize: 12,
                color: COLORS.textSecondary,
              }}>
                {currentCategory.name}
              </Text>
              <Text style={{
                fontSize: 12,
                color: COLORS.textTertiary,
              }}>
                {currentQuestionIndex + 1} of {currentCategory.questions.length}
              </Text>
            </View>
            
            <View style={{
              height: 3,
              backgroundColor: COLORS.border,
              borderRadius: 1.5,
              overflow: 'hidden',
            }}>
              <Animated.View style={{
                height: '100%',
                backgroundColor: `${COLORS.accent}80`,
                borderRadius: 1.5,
                width: `${categoryProgress}%`,
              }} />
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderCategoryIndicators = () => {
    return (
      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingVertical: 16,
        gap: 8,
      }}>
        {categories.map((category, index) => {
          const isActive = index === currentCategoryIndex;
          const isCompleted = index < currentCategoryIndex;
          
          return (
            <View
              key={index}
              style={{
                width: isActive ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: isCompleted 
                  ? COLORS.accent
                  : isActive 
                    ? `${COLORS.accent}80`
                    : COLORS.border,
              }}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Progress Indicator */}
      {renderProgressIndicator()}
      
      {/* Category Indicators */}
      {renderCategoryIndicators()}

      {/* Content with Gesture Handler */}
      <PanGestureHandler
        ref={panRef}
        onHandlerStateChange={handleSwipeGesture}
        activeOffsetX={[-10, 10]}
        failOffsetY={[-5, 5]}
      >
        <Animated.View style={{
          flex: 1,
          transform: [
            { translateX: slideAnim },
          ],
        }}>
          <Animated.View style={{
            flex: 1,
            opacity: fadeAnim,
          }}>
            {children}
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>

      {/* Navigation Hints */}
      <View style={{
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 32,
        pointerEvents: 'none',
      }}>
        {/* Previous Hint */}
        {(currentQuestionIndex > 0 || currentCategoryIndex > 0) && (
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            opacity: 0.5,
          }}>
            <Text style={{
              fontSize: 12,
              color: COLORS.textTertiary,
              marginRight: 4,
            }}>
              ← Swipe
            </Text>
            <Text style={{
              fontSize: 10,
              color: COLORS.textTertiary,
            }}>
              Previous
            </Text>
          </View>
        )}

        {/* Next Hint */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          opacity: 0.5,
        }}>
          <Text style={{
            fontSize: 10,
            color: COLORS.textTertiary,
          }}>
            Next
          </Text>
          <Text style={{
            fontSize: 12,
            color: COLORS.textTertiary,
            marginLeft: 4,
          }}>
            Swipe →
          </Text>
        </View>
      </View>
    </View>
  );
};

export default QuizNavigator;
