/**
 * BLONG Premium Page Transitions
 * Sophisticated page transitions with smooth animations
 */

import React, { useRef, useEffect } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
} from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Fade Transition
export const FadeTransition = ({ 
  children, 
  visible = true, 
  duration = 300,
  delay = 0,
  style = {} 
}) => {
  const fadeAnim = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: visible ? 1 : 0,
      duration,
      delay,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [visible, duration, delay]);

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

// Slide Transition
export const SlideTransition = ({ 
  children, 
  visible = true,
  direction = 'up', // up, down, left, right
  distance = 30,
  duration = 400,
  delay = 0,
  style = {} 
}) => {
  const slideAnim = useRef(new Animated.Value(visible ? 0 : distance)).current;
  const opacityAnim = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: visible ? 0 : distance,
        duration,
        delay,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: visible ? 1 : 0,
        duration: duration * 0.8,
        delay,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, duration, delay, distance]);

  const getTransform = () => {
    switch (direction) {
      case 'up':
        return [{ translateY: slideAnim }];
      case 'down':
        return [{ translateY: slideAnim.interpolate({
          inputRange: [0, distance],
          outputRange: [0, -distance],
        }) }];
      case 'left':
        return [{ translateX: slideAnim }];
      case 'right':
        return [{ translateX: slideAnim.interpolate({
          inputRange: [0, distance],
          outputRange: [0, -distance],
        }) }];
      default:
        return [{ translateY: slideAnim }];
    }
  };

  return (
    <Animated.View
      style={[
        {
          opacity: opacityAnim,
          transform: getTransform(),
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

// Scale Transition
export const ScaleTransition = ({ 
  children, 
  visible = true,
  initialScale = 0.9,
  duration = 300,
  delay = 0,
  style = {} 
}) => {
  const scaleAnim = useRef(new Animated.Value(visible ? 1 : initialScale)).current;
  const opacityAnim = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: visible ? 1 : initialScale,
        tension: 100,
        friction: 8,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: visible ? 1 : 0,
        duration,
        delay,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, duration, delay, initialScale]);

  return (
    <Animated.View
      style={[
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

// Stagger Transition (for lists)
export const StaggerTransition = ({ 
  children, 
  visible = true,
  staggerDelay = 100,
  baseDuration = 300,
  baseDelay = 0,
  direction = 'up',
  style = {} 
}) => {
  return (
    <>
      {React.Children.map(children, (child, index) => (
        <SlideTransition
          visible={visible}
          direction={direction}
          duration={baseDuration}
          delay={baseDelay + (index * staggerDelay)}
          key={index}
        >
          {child}
        </SlideTransition>
      ))}
    </>
  );
};

// Page Slide Transition (for screen navigation)
export const PageSlideTransition = ({ 
  children, 
  visible = true,
  direction = 'horizontal', // horizontal, vertical
  duration = 400,
  style = {} 
}) => {
  const slideAnim = useRef(new Animated.Value(visible ? 0 : 1)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : 1,
      duration,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [visible, duration]);

  const getTransform = () => {
    if (direction === 'horizontal') {
      return [{
        translateX: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, screenWidth],
        }),
      }];
    } else {
      return [{
        translateY: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, screenHeight],
        }),
      }];
    }
  };

  return (
    <Animated.View
      style={[
        {
          flex: 1,
          transform: getTransform(),
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

// Flip Transition
export const FlipTransition = ({ 
  children, 
  visible = true,
  axis = 'y', // x or y
  duration = 600,
  delay = 0,
  style = {} 
}) => {
  const flipAnim = useRef(new Animated.Value(visible ? 0 : 1)).current;

  useEffect(() => {
    Animated.timing(flipAnim, {
      toValue: visible ? 0 : 1,
      duration,
      delay,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [visible, duration, delay]);

  const getTransform = () => {
    if (axis === 'x') {
      return [{
        rotateX: flipAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '180deg'],
        }),
      }];
    } else {
      return [{
        rotateY: flipAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '180deg'],
        }),
      }];
    }
  };

  return (
    <Animated.View
      style={[
        {
          transform: getTransform(),
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

// Modal Transition
export const ModalTransition = ({ 
  children, 
  visible = true,
  backdropOpacity = 0.5,
  duration = 300,
  style = {} 
}) => {
  const backdropAnim = useRef(new Animated.Value(visible ? backdropOpacity : 0)).current;
  const slideAnim = useRef(new Animated.Value(visible ? 0 : 50)).current;
  const scaleAnim = useRef(new Animated.Value(visible ? 1 : 0.9)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: backdropOpacity,
          duration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration,
          easing: Easing.out(Easing.back(1.1)),
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: duration * 0.8,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: duration * 0.8,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: duration * 0.8,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, duration, backdropOpacity]);

  return (
    <>
      {/* Backdrop */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 1)',
          opacity: backdropAnim,
        }}
        pointerEvents={visible ? 'auto' : 'none'}
      />

      {/* Modal Content */}
      <Animated.View
        style={[
          {
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim },
            ],
          },
          style,
        ]}
        pointerEvents={visible ? 'auto' : 'none'}
      >
        {children}
      </Animated.View>
    </>
  );
};

// Enhanced App Transition (replacement for existing AppTransition)
export const EnhancedAppTransition = ({ 
  children, 
  type = 'fade', // fade, slide, scale, page
  duration = 300,
  style = {} 
}) => {
  switch (type) {
    case 'slide':
      return (
        <SlideTransition
          visible={true}
          duration={duration}
          style={[{ flex: 1 }, style]}
        >
          {children}
        </SlideTransition>
      );
    case 'scale':
      return (
        <ScaleTransition
          visible={true}
          duration={duration}
          style={[{ flex: 1 }, style]}
        >
          {children}
        </ScaleTransition>
      );
    case 'page':
      return (
        <PageSlideTransition
          visible={true}
          duration={duration}
          style={[{ flex: 1 }, style]}
        >
          {children}
        </PageSlideTransition>
      );
    default:
      return (
        <FadeTransition
          visible={true}
          duration={duration}
          style={[{ flex: 1 }, style]}
        >
          {children}
        </FadeTransition>
      );
  }
};

export default {
  FadeTransition,
  SlideTransition,
  ScaleTransition,
  StaggerTransition,
  PageSlideTransition,
  FlipTransition,
  ModalTransition,
  EnhancedAppTransition,
};