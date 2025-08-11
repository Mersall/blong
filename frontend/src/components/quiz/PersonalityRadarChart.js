/**
 * BLONG Personality Radar Chart
 * Interactive radar chart for Big Five personality traits
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import Svg, {
  Circle,
  Line,
  Polygon,
  Text as SvgText,
  G,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from 'react-native-svg';

const AnimatedPolygon = Animated.createAnimatedComponent(Polygon);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const PersonalityRadarChart = ({ 
  data, 
  size = 280, 
  animated = true,
  colors = ['#667eea', '#764ba2'],
  style 
}) => {
  // Animation values
  const scaleAnimation = useRef(new Animated.Value(0)).current;
  const rotateAnimation = useRef(new Animated.Value(0)).current;
  const opacityAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.parallel([
        Animated.spring(scaleAnimation, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.timing(rotateAnimation, {
            toValue: 1,
            duration: 20000,
            useNativeDriver: true,
          })
        ),
      ]).start();
    } else {
      scaleAnimation.setValue(1);
      opacityAnimation.setValue(1);
    }
  }, [animated]);

  const center = size / 2;
  const radius = size * 0.35;
  const numberOfSides = 5;
  
  // Trait labels
  const traits = [
    { key: 'openness', label: 'Openness', short: 'O' },
    { key: 'conscientiousness', label: 'Conscientiousness', short: 'C' },
    { key: 'extraversion', label: 'Extraversion', short: 'E' },
    { key: 'agreeableness', label: 'Agreeableness', short: 'A' },
    { key: 'emotionalStability', label: 'Emotional Stability', short: 'S' },
  ];

  // Calculate polygon points for data
  const getPolygonPoints = (values, radiusMultiplier = 1) => {
    return traits.map((trait, index) => {
      const angle = (index * 2 * Math.PI) / numberOfSides - Math.PI / 2;
      const value = (values[trait.key] || 0) / 100;
      const pointRadius = radius * value * radiusMultiplier;
      
      return {
        x: center + pointRadius * Math.cos(angle),
        y: center + pointRadius * Math.sin(angle),
      };
    });
  };

  // Generate polygon points string
  const generatePolygonPoints = (points) => {
    return points.map(point => `${point.x},${point.y}`).join(' ');
  };

  // Calculate grid polygon points
  const getGridPoints = (level) => {
    const gridRadius = radius * (level / 5);
    return traits.map((_, index) => {
      const angle = (index * 2 * Math.PI) / numberOfSides - Math.PI / 2;
      return {
        x: center + gridRadius * Math.cos(angle),
        y: center + gridRadius * Math.sin(angle),
      };
    });
  };

  // Calculate label positions
  const getLabelPosition = (index, offset = 1.2) => {
    const angle = (index * 2 * Math.PI) / numberOfSides - Math.PI / 2;
    const labelRadius = radius * offset;
    
    return {
      x: center + labelRadius * Math.cos(angle),
      y: center + labelRadius * Math.sin(angle),
    };
  };

  const dataPoints = getPolygonPoints(data);
  const dataPolygonPoints = generatePolygonPoints(dataPoints);

  const rotateInterpolate = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        {
          width: size,
          height: size,
          opacity: opacityAnimation,
          transform: [{ scale: scaleAnimation }],
        },
      ]}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <SvgLinearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={colors[0]} stopOpacity="0.6" />
            <Stop offset="100%" stopColor={colors[1]} stopOpacity="0.3" />
          </SvgLinearGradient>
          
          <SvgLinearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={colors[0]} stopOpacity="0.8" />
            <Stop offset="100%" stopColor={colors[1]} stopOpacity="0.8" />
          </SvgLinearGradient>
        </Defs>

        {/* Background grid */}
        <G opacity="0.2">
          {[1, 2, 3, 4, 5].map(level => {
            const gridPoints = getGridPoints(level);
            const gridPolygonPoints = generatePolygonPoints(gridPoints);
            
            return (
              <Polygon
                key={level}
                points={gridPolygonPoints}
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1"
              />
            );
          })}
        </G>

        {/* Grid lines from center */}
        <G opacity="0.2">
          {traits.map((_, index) => {
            const angle = (index * 2 * Math.PI) / numberOfSides - Math.PI / 2;
            const endX = center + radius * Math.cos(angle);
            const endY = center + radius * Math.sin(angle);
            
            return (
              <Line
                key={index}
                x1={center}
                y1={center}
                x2={endX}
                y2={endY}
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1"
              />
            );
          })}
        </G>

        {/* Data polygon */}
        <Polygon
          points={dataPolygonPoints}
          fill="url(#radarGradient)"
          stroke="url(#strokeGradient)"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {dataPoints.map((point, index) => (
          <Circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="6"
            fill={colors[0]}
            stroke="white"
            strokeWidth="2"
          />
        ))}

        {/* Center point */}
        <Circle
          cx={center}
          cy={center}
          r="4"
          fill="rgba(255,255,255,0.8)"
        />
      </Svg>

      {/* Trait labels */}
      {traits.map((trait, index) => {
        const position = getLabelPosition(index);
        const value = data[trait.key] || 0;
        
        return (
          <View
            key={trait.key}
            style={[
              styles.labelContainer,
              {
                left: position.x - 40,
                top: position.y - 30,
              },
            ]}
          >
            <View style={styles.labelBadge}>
              <Text style={styles.labelShort}>{trait.short}</Text>
            </View>
            <Text style={styles.labelText}>{trait.label}</Text>
            <Text style={styles.labelValue}>{value}%</Text>
          </View>
        );
      })}

      {/* Animated background decoration */}
      <Animated.View
        style={[
          styles.backgroundDecoration,
          {
            transform: [{ rotate: rotateInterpolate }],
          },
        ]}
      >
        <View style={styles.decorationRing} />
        <View style={[styles.decorationRing, styles.decorationRing2]} />
        <View style={[styles.decorationRing, styles.decorationRing3]} />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    position: 'absolute',
    alignItems: 'center',
    width: 80,
  },
  labelBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  labelShort: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#667eea',
  },
  labelText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  labelValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  backgroundDecoration: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1,
  },
  decorationRing: {
    position: 'absolute',
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  decorationRing2: {
    width: '120%',
    height: '120%',
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  decorationRing3: {
    width: '140%',
    height: '140%',
    borderColor: 'rgba(255, 255, 255, 0.03)',
  },
});

export default PersonalityRadarChart;