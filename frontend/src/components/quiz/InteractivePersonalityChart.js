/**
 * BLONG Interactive Personality Chart
 * Premium personality visualization with interactive elements
 */

import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  Animated,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, G, Text as SvgText } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

// Elite color system
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
  traits: {
    openness: '#9C27B0',
    conscientiousness: '#2196F3',
    extraversion: '#FF9800',
    agreeableness: '#4CAF50',
    neuroticism: '#F44336',
  },
};

const InteractivePersonalityChart = ({
  personalityData = {},
  showDetailedView = false,
  onTraitPress = null,
  style = {},
}) => {
  const animationValues = useRef({}).current;
  const [selectedTrait, setSelectedTrait] = useState(null);
  const [viewMode, setViewMode] = useState('radar'); // 'radar', 'bars', 'circle'

  // Default personality traits
  const defaultTraits = [
    { key: 'openness', name: 'Openness', description: 'Openness to experience', value: 0 },
    { key: 'conscientiousness', name: 'Conscientiousness', description: 'Self-discipline and organization', value: 0 },
    { key: 'extraversion', name: 'Extraversion', description: 'Social energy and assertiveness', value: 0 },
    { key: 'agreeableness', name: 'Agreeableness', description: 'Cooperation and trust', value: 0 },
    { key: 'neuroticism', name: 'Emotional Stability', description: 'Emotional resilience', value: 0 },
  ];

  const traits = defaultTraits.map(trait => ({
    ...trait,
    value: personalityData[trait.key] || trait.value,
  }));

  // Initialize animations
  useEffect(() => {
    traits.forEach(trait => {
      if (!animationValues[trait.key]) {
        animationValues[trait.key] = new Animated.Value(0);
      }
      
      Animated.timing(animationValues[trait.key], {
        toValue: trait.value,
        duration: 1000,
        delay: traits.indexOf(trait) * 100,
        useNativeDriver: false,
      }).start();
    });
  }, [personalityData]);

  const handleTraitPress = (trait) => {
    setSelectedTrait(selectedTrait?.key === trait.key ? null : trait);
    if (onTraitPress) {
      onTraitPress(trait);
    }
  };

  const renderRadarChart = () => {
    const centerX = 120;
    const centerY = 120;
    const maxRadius = 80;
    const numTraits = traits.length;

    // Calculate points for radar chart
    const getPoint = (index, value) => {
      const angle = (index * 2 * Math.PI) / numTraits - Math.PI / 2;
      const radius = (value / 100) * maxRadius;
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    };

    // Create path for personality polygon
    const pathData = traits.map((trait, index) => {
      const point = getPoint(index, trait.value);
      return index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`;
    }).join(' ') + ' Z';

    return (
      <View style={{ alignItems: 'center', marginVertical: 20 }}>
        <Svg width={240} height={240}>
          {/* Background grid circles */}
          {[20, 40, 60, 80, 100].map((percentage, index) => (
            <Circle
              key={index}
              cx={centerX}
              cy={centerY}
              r={(percentage / 100) * maxRadius}
              stroke={COLORS.border}
              strokeWidth="1"
              fill="none"
              opacity={0.3}
            />
          ))}

          {/* Grid lines */}
          {traits.map((_, index) => {
            const angle = (index * 2 * Math.PI) / numTraits - Math.PI / 2;
            const endX = centerX + maxRadius * Math.cos(angle);
            const endY = centerY + maxRadius * Math.sin(angle);
            return (
              <Path
                key={index}
                d={`M ${centerX} ${centerY} L ${endX} ${endY}`}
                stroke={COLORS.border}
                strokeWidth="1"
                opacity={0.3}
              />
            );
          })}

          {/* Personality polygon */}
          <Path
            d={pathData}
            fill={`${COLORS.accent}20`}
            stroke={COLORS.accent}
            strokeWidth="2"
          />

          {/* Trait points */}
          {traits.map((trait, index) => {
            const point = getPoint(index, trait.value);
            return (
              <Circle
                key={trait.key}
                cx={point.x}
                cy={point.y}
                r="6"
                fill={COLORS.traits[trait.key] || COLORS.accent}
                stroke={COLORS.background}
                strokeWidth="2"
              />
            );
          })}

          {/* Trait labels */}
          {traits.map((trait, index) => {
            const angle = (index * 2 * Math.PI) / numTraits - Math.PI / 2;
            const labelRadius = maxRadius + 20;
            const labelX = centerX + labelRadius * Math.cos(angle);
            const labelY = centerY + labelRadius * Math.sin(angle);
            
            return (
              <SvgText
                key={`label-${trait.key}`}
                x={labelX}
                y={labelY}
                fontSize="11"
                fill={COLORS.text}
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                {trait.name}
              </SvgText>
            );
          })}
        </Svg>
      </View>
    );
  };

  const renderBarChart = () => {
    return (
      <View style={{ marginVertical: 20 }}>
        {traits.map((trait, index) => (
          <TouchableOpacity
            key={trait.key}
            onPress={() => handleTraitPress(trait)}
            style={{
              marginBottom: 16,
              backgroundColor: selectedTrait?.key === trait.key 
                ? `${COLORS.traits[trait.key]}10` 
                : COLORS.surface,
              borderRadius: 12,
              padding: 16,
              borderWidth: selectedTrait?.key === trait.key ? 2 : 1,
              borderColor: selectedTrait?.key === trait.key 
                ? COLORS.traits[trait.key] 
                : COLORS.border,
            }}
          >
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}>
              <Text style={{
                fontSize: 14,
                fontWeight: '500',
                color: COLORS.text,
              }}>
                {trait.name}
              </Text>
              <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: COLORS.traits[trait.key],
              }}>
                {Math.round(trait.value)}%
              </Text>
            </View>

            {/* Progress bar */}
            <View style={{
              height: 6,
              backgroundColor: COLORS.border,
              borderRadius: 3,
              overflow: 'hidden',
            }}>
              <Animated.View
                style={{
                  height: '100%',
                  backgroundColor: COLORS.traits[trait.key],
                  borderRadius: 3,
                  width: animationValues[trait.key] 
                    ? animationValues[trait.key].interpolate({
                        inputRange: [0, 100],
                        outputRange: ['0%', '100%'],
                        extrapolate: 'clamp',
                      })
                    : '0%',
                }}
              />
            </View>

            {showDetailedView && (
              <Text style={{
                fontSize: 12,
                color: COLORS.textSecondary,
                marginTop: 8,
                lineHeight: 16,
              }}>
                {trait.description}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderCircularChart = () => {
    const size = 200;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    return (
      <View style={{ alignItems: 'center', marginVertical: 20 }}>
        <View style={{ position: 'relative', width: size, height: size }}>
          {traits.map((trait, index) => {
            const offset = circumference - (trait.value / 100) * circumference;
            const rotation = (index * 360) / traits.length;
            
            return (
              <View
                key={trait.key}
                style={{
                  position: 'absolute',
                  width: size,
                  height: size,
                  transform: [{ rotate: `${rotation}deg` }],
                }}
              >
                <Svg width={size} height={size}>
                  <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={`${COLORS.traits[trait.key]}20`}
                    strokeWidth={strokeWidth}
                    fill="none"
                  />
                  <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={COLORS.traits[trait.key]}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                  />
                </Svg>
              </View>
            );
          })}
          
          {/* Center content */}
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Text style={{
              fontSize: 24,
              fontWeight: '300',
              color: COLORS.text,
              textAlign: 'center',
            }}>
              Your{'\n'}Personality
            </Text>
          </View>
        </View>

        {/* Legend */}
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginTop: 20,
          gap: 12,
        }}>
          {traits.map(trait => (
            <View key={trait.key} style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <View style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: COLORS.traits[trait.key],
                marginRight: 6,
              }} />
              <Text style={{
                fontSize: 12,
                color: COLORS.textSecondary,
              }}>
                {trait.name}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderChart = () => {
    switch (viewMode) {
      case 'bars':
        return renderBarChart();
      case 'circle':
        return renderCircularChart();
      default:
        return renderRadarChart();
    }
  };

  return (
    <View style={[{
      backgroundColor: COLORS.background,
      borderRadius: 16,
      padding: 20,
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
      borderWidth: 1,
      borderColor: COLORS.border,
    }, style]}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
      }}>
        <Text style={{
          fontSize: 18,
          fontWeight: '600',
          color: COLORS.text,
        }}>
          Personality Profile
        </Text>

        {/* View Mode Selector */}
        <View style={{
          flexDirection: 'row',
          backgroundColor: COLORS.surface,
          borderRadius: 20,
          padding: 2,
        }}>
          {['radar', 'bars', 'circle'].map(mode => (
            <TouchableOpacity
              key={mode}
              onPress={() => setViewMode(mode)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 18,
                backgroundColor: viewMode === mode ? COLORS.accent : 'transparent',
              }}
            >
              <Text style={{
                fontSize: 10,
                color: viewMode === mode ? COLORS.background : COLORS.textSecondary,
                fontWeight: '500',
                textTransform: 'uppercase',
              }}>
                {mode}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Chart */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderChart()}

        {/* Selected Trait Details */}
        {selectedTrait && (
          <View style={{
            backgroundColor: COLORS.surface,
            borderRadius: 12,
            padding: 16,
            marginTop: 20,
            borderLeftWidth: 4,
            borderLeftColor: COLORS.traits[selectedTrait.key],
          }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: COLORS.text,
              marginBottom: 8,
            }}>
              {selectedTrait.name}
            </Text>
            <Text style={{
              fontSize: 14,
              color: COLORS.textSecondary,
              lineHeight: 20,
              marginBottom: 12,
            }}>
              {selectedTrait.description}
            </Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: COLORS.traits[selectedTrait.key],
                marginRight: 8,
              }}>
                {Math.round(selectedTrait.value)}%
              </Text>
              <Text style={{
                fontSize: 12,
                color: COLORS.textTertiary,
              }}>
                {selectedTrait.value >= 70 ? 'High' : selectedTrait.value >= 40 ? 'Moderate' : 'Low'}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default InteractivePersonalityChart;