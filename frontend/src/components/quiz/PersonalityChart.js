/**
 * BLONG Personality Chart
 * Beautiful radar chart visualization for Big Five personality traits
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Animated,
  Dimensions,
} from 'react-native';
import Svg, { 
  Polygon, 
  Circle, 
  Line, 
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

const PersonalityChart = ({ personalityProfile, style }) => {
  const [animatedValues] = useState({
    openness: new Animated.Value(0),
    conscientiousness: new Animated.Value(0),
    extraversion: new Animated.Value(0),
    agreeableness: new Animated.Value(0),
    neuroticism: new Animated.Value(0),
  });

  const COLORS = {
    background: '#FFFFFF',
    surface: '#FAFAFA',
    text: '#0A0A0A',
    textSecondary: '#6B6B6B',
    textTertiary: '#9E9E9E',
    accent: '#FF6B35',
    border: '#E0E0E0',
    shadow: '#000000',
    // Personality trait colors
    openness: '#9C27B0',
    conscientiousness: '#2196F3',
    extraversion: '#FF9800',
    agreeableness: '#4CAF50',
    neuroticism: '#F44336',
  };

  const chartSize = Math.min(screenWidth - 64, 300);
  const center = chartSize / 2;
  const maxRadius = center - 40;

  const traits = [
    { key: 'openness', label: 'Openness', color: COLORS.openness, angle: 0 },
    { key: 'conscientiousness', label: 'Conscientiousness', color: COLORS.conscientiousness, angle: 72 },
    { key: 'extraversion', label: 'Extraversion', color: COLORS.extraversion, angle: 144 },
    { key: 'agreeableness', label: 'Agreeableness', color: COLORS.agreeableness, angle: 216 },
    { key: 'neuroticism', label: 'Emotional Stability', color: COLORS.neuroticism, angle: 288 },
  ];

  useEffect(() => {
    if (personalityProfile) {
      animateChart();
    }
  }, [personalityProfile]);

  const animateChart = () => {
    const animations = traits.map((trait, index) => {
      const score = personalityProfile[`${trait.key}Score`] || 0;
      return Animated.timing(animatedValues[trait.key], {
        toValue: score,
        duration: 1500,
        delay: index * 200,
        useNativeDriver: false,
      });
    });

    Animated.parallel(animations).start();
  };

  const getPointCoordinates = (angle, radius) => {
    const radian = (angle - 90) * (Math.PI / 180);
    return {
      x: center + radius * Math.cos(radian),
      y: center + radius * Math.sin(radian),
    };
  };

  const renderGridLines = () => {
    const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];
    
    return gridLevels.map((level, index) => {
      const radius = maxRadius * level;
      const points = traits.map(trait => {
        const coords = getPointCoordinates(trait.angle, radius);
        return `${coords.x},${coords.y}`;
      }).join(' ');

      return (
        <Polygon
          key={index}
          points={points}
          fill="none"
          stroke={COLORS.border}
          strokeWidth={level === 1.0 ? 2 : 1}
          strokeOpacity={level === 1.0 ? 0.3 : 0.15}
        />
      );
    });
  };

  const renderAxisLines = () => {
    return traits.map((trait, index) => {
      const endPoint = getPointCoordinates(trait.angle, maxRadius);
      
      return (
        <Line
          key={index}
          x1={center}
          y1={center}
          x2={endPoint.x}
          y2={endPoint.y}
          stroke={COLORS.border}
          strokeWidth={1}
          strokeOpacity={0.2}
        />
      );
    });
  };

  const renderLabels = () => {
    return traits.map((trait, index) => {
      const labelPoint = getPointCoordinates(trait.angle, maxRadius + 25);
      const score = personalityProfile?.[`${trait.key}Score`] || 0;
      
      return (
        <View key={index}>
          <SvgText
            x={labelPoint.x}
            y={labelPoint.y}
            fontSize="12"
            fill={trait.color}
            textAnchor="middle"
            fontWeight="500"
          >
            {trait.label}
          </SvgText>
          <SvgText
            x={labelPoint.x}
            y={labelPoint.y + 15}
            fontSize="10"
            fill={COLORS.textSecondary}
            textAnchor="middle"
          >
            {score}%
          </SvgText>
        </View>
      );
    });
  };

  const renderPersonalityPolygon = () => {
    if (!personalityProfile) return null;

    const points = traits.map(trait => {
      const score = personalityProfile[`${trait.key}Score`] || 0;
      const radius = (score / 100) * maxRadius;
      const coords = getPointCoordinates(trait.angle, radius);
      return `${coords.x},${coords.y}`;
    }).join(' ');

    return (
      <View>
        <Defs>
          <LinearGradient id="personalityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={COLORS.accent} stopOpacity="0.3" />
            <Stop offset="100%" stopColor={COLORS.accent} stopOpacity="0.1" />
          </LinearGradient>
        </Defs>
        
        <Polygon
          points={points}
          fill="url(#personalityGradient)"
          stroke={COLORS.accent}
          strokeWidth={2}
          strokeOpacity={0.8}
        />
      </View>
    );
  };

  const renderTraitPoints = () => {
    return traits.map((trait, index) => {
      const score = personalityProfile?.[`${trait.key}Score`] || 0;
      const radius = (score / 100) * maxRadius;
      const coords = getPointCoordinates(trait.angle, radius);
      
      return (
        <Circle
          key={index}
          cx={coords.x}
          cy={coords.y}
          r={4}
          fill={trait.color}
          stroke={COLORS.background}
          strokeWidth={2}
        />
      );
    });
  };

  if (!personalityProfile) {
    return (
      <View style={[{
        alignItems: 'center',
        justifyContent: 'center',
        height: chartSize,
      }, style]}>
        <Text style={{
          fontSize: 16,
          color: COLORS.textSecondary,
        }}>
          No personality data available
        </Text>
      </View>
    );
  }

  return (
    <View style={[{
      alignItems: 'center',
      backgroundColor: COLORS.surface,
      borderRadius: 16,
      padding: 20,
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    }, style]}>
      <Text style={{
        fontSize: 18,
        fontWeight: '500',
        color: COLORS.text,
        marginBottom: 20,
        textAlign: 'center',
      }}>
        🧠 Personality Profile
      </Text>

      <Svg width={chartSize} height={chartSize}>
        {renderGridLines()}
        {renderAxisLines()}
        {renderPersonalityPolygon()}
        {renderTraitPoints()}
        {renderLabels()}
      </Svg>

      {/* Legend */}
      <View style={{
        marginTop: 20,
        alignItems: 'center',
      }}>
        <Text style={{
          fontSize: 12,
          color: COLORS.textTertiary,
          textAlign: 'center',
          lineHeight: 16,
        }}>
          Your unique personality pattern based on the Big Five model
        </Text>
      </View>
    </View>
  );
};

export default PersonalityChart;
