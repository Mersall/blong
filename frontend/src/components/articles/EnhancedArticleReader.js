/**
 * BLONG Enhanced Article Reader Component
 * Premium reading experience with enhanced typography and layout
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Dimensions, 
  Platform,
  Animated,
  LayoutAnimation,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

// Enhanced typography system
const TYPOGRAPHY = {
  // Font families - fallback to system fonts
  fonts: {
    title: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
    body: Platform.select({
      ios: 'Georgia',
      android: 'serif', 
      default: 'serif',
    }),
    sans: Platform.select({
      ios: 'Helvetica Neue',
      android: 'sans-serif',
      default: 'sans-serif',
    }),
  },
  
  // Responsive font sizes based on screen width
  sizes: {
    h1: screenWidth < 375 ? 26 : 28,
    h2: screenWidth < 375 ? 22 : 24,
    h3: screenWidth < 375 ? 18 : 20,
    body: screenWidth < 375 ? 16 : 17,
    caption: screenWidth < 375 ? 13 : 14,
    small: 12,
  },
  
  // Line heights for optimal readability
  lineHeights: {
    title: 1.2,
    heading: 1.3,
    body: 1.6,
    caption: 1.4,
  },
  
  // Letter spacing for different contexts
  letterSpacing: {
    title: -0.5,
    heading: -0.25,
    body: 0,
    caption: 0.25,
  },
};

// Enhanced color system
const READING_COLORS = {
  background: '#FEFEFE',
  paper: '#FFFFFF',
  text: {
    primary: '#1A1A1A',
    secondary: '#4A4A4A',
    tertiary: '#6B6B6B',
    caption: '#8E8E8E',
  },
  accent: '#FF6B35',
  border: '#E8E8E8',
  highlight: 'rgba(255, 107, 53, 0.1)',
  shadow: 'rgba(0, 0, 0, 0.08)',
};

// Reading preferences
const READING_SETTINGS = {
  // Optimal line length (45-75 characters)
  maxWidth: Math.min(screenWidth - 64, 600),
  
  // Comfortable padding
  padding: {
    horizontal: 32,
    vertical: 24,
    paragraph: 20,
    section: 32,
  },
  
  // Reading flow
  rhythm: {
    small: 8,
    medium: 16, 
    large: 24,
    xlarge: 32,
  },
};

const EnhancedArticleReader = ({ 
  content, 
  style = {},
  onReadingProgress,
  readingTime,
}) => {
  const [readingProgress, setReadingProgress] = useState(0);
  const [estimatedReadingTime, setEstimatedReadingTime] = useState(0);
  const scrollViewRef = useRef(null);
  const progressAnimation = useRef(new Animated.Value(0)).current;

  // Calculate estimated reading time (average 200 words per minute)
  useEffect(() => {
    if (content) {
      const wordCount = content.split(/\s+/).length;
      const minutes = Math.ceil(wordCount / 200);
      setEstimatedReadingTime(minutes);
    }
  }, [content]);

  // Handle scroll progress
  const handleScroll = (event) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    
    if (contentSize.height > layoutMeasurement.height) {
      const progress = contentOffset.y / (contentSize.height - layoutMeasurement.height);
      const normalizedProgress = Math.max(0, Math.min(1, progress));
      
      setReadingProgress(normalizedProgress);
      
      // Animate progress indicator
      Animated.timing(progressAnimation, {
        toValue: normalizedProgress,
        duration: 100,
        useNativeDriver: false,
      }).start();
      
      // Callback for parent component
      if (onReadingProgress) {
        onReadingProgress(normalizedProgress);
      }
    }
  };

  // Parse and render content with enhanced typography
  const renderContent = (text) => {
    if (!text) return null;
    
    const sections = text.split('\n\n');
    
    return sections.map((section, index) => {
      const trimmedSection = section.trim();
      if (!trimmedSection) return null;
      
      // Handle different content types
      if (trimmedSection.startsWith('# ')) {
        return renderHeading(trimmedSection.substring(2), 1, index);
      } else if (trimmedSection.startsWith('## ')) {
        return renderHeading(trimmedSection.substring(3), 2, index);
      } else if (trimmedSection.startsWith('### ')) {
        return renderHeading(trimmedSection.substring(4), 3, index);
      } else if (trimmedSection.startsWith('- ') || trimmedSection.startsWith('• ')) {
        return renderList(trimmedSection, index);
      } else {
        return renderParagraph(trimmedSection, index);
      }
    }).filter(Boolean);
  };

  const renderHeading = (text, level, key) => {
    const fontSize = level === 1 ? TYPOGRAPHY.sizes.h1 : 
                   level === 2 ? TYPOGRAPHY.sizes.h2 : TYPOGRAPHY.sizes.h3;
    
    const marginTop = level === 1 ? READING_SETTINGS.rhythm.xlarge : 
                     level === 2 ? READING_SETTINGS.rhythm.large : READING_SETTINGS.rhythm.medium;

    return (
      <Text
        key={key}
        style={{
          fontFamily: TYPOGRAPHY.fonts.title,
          fontSize,
          fontWeight: level === 1 ? '400' : '500',
          lineHeight: fontSize * TYPOGRAPHY.lineHeights.heading,
          letterSpacing: TYPOGRAPHY.letterSpacing.heading,
          color: READING_COLORS.text.primary,
          marginTop,
          marginBottom: READING_SETTINGS.rhythm.medium,
          textAlign: 'left',
        }}
      >
        {text}
      </Text>
    );
  };

  const renderParagraph = (text, key) => {
    return (
      <Text
        key={key}
        style={{
          fontFamily: TYPOGRAPHY.fonts.body,
          fontSize: TYPOGRAPHY.sizes.body,
          lineHeight: TYPOGRAPHY.sizes.body * TYPOGRAPHY.lineHeights.body,
          letterSpacing: TYPOGRAPHY.letterSpacing.body,
          color: READING_COLORS.text.primary,
          marginBottom: READING_SETTINGS.padding.paragraph,
          textAlign: 'left',
        }}
      >
        {text}
      </Text>
    );
  };

  const renderList = (text, key) => {
    const items = text.split('\n').filter(line => line.trim());
    
    return (
      <View key={key} style={{ marginBottom: READING_SETTINGS.padding.paragraph }}>
        {items.map((item, itemIndex) => {
          const cleanItem = item.replace(/^[-•]\s*/, '');
          return (
            <View
              key={itemIndex}
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginBottom: READING_SETTINGS.rhythm.small,
              }}
            >
              <Text
                style={{
                  fontFamily: TYPOGRAPHY.fonts.body,
                  fontSize: TYPOGRAPHY.sizes.body,
                  color: READING_COLORS.accent,
                  marginRight: 12,
                  marginTop: 2,
                }}
              >
                •
              </Text>
              <Text
                style={{
                  flex: 1,
                  fontFamily: TYPOGRAPHY.fonts.body,
                  fontSize: TYPOGRAPHY.sizes.body,
                  lineHeight: TYPOGRAPHY.sizes.body * TYPOGRAPHY.lineHeights.body,
                  letterSpacing: TYPOGRAPHY.letterSpacing.body,
                  color: READING_COLORS.text.primary,
                }}
              >
                {cleanItem}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={[{ flex: 1, backgroundColor: READING_COLORS.background }, style]}>
      {/* Reading Progress Indicator */}
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: READING_COLORS.border,
        zIndex: 1000,
      }}>
        <Animated.View
          style={{
            height: '100%',
            backgroundColor: READING_COLORS.accent,
            width: progressAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          }}
        />
      </View>

      {/* Main Content */}
      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1 }}
        contentContainerStyle={{
          maxWidth: READING_SETTINGS.maxWidth,
          alignSelf: 'center',
          paddingHorizontal: READING_SETTINGS.padding.horizontal,
          paddingVertical: READING_SETTINGS.padding.vertical,
          paddingBottom: 80, // Extra space at bottom
        }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="normal"
      >
        {/* Reading Time Indicator */}
        {estimatedReadingTime > 0 && (
          <View style={{
            alignSelf: 'center',
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: READING_COLORS.highlight,
            borderRadius: 20,
            marginBottom: READING_SETTINGS.rhythm.large,
          }}>
            <Text style={{
              fontFamily: TYPOGRAPHY.fonts.sans,
              fontSize: TYPOGRAPHY.sizes.caption,
              color: READING_COLORS.accent,
              fontWeight: '500',
              textAlign: 'center',
            }}>
              {estimatedReadingTime} min read
            </Text>
          </View>
        )}

        {/* Article Content */}
        <View style={{
          backgroundColor: READING_COLORS.paper,
          borderRadius: 8,
          padding: READING_SETTINGS.padding.horizontal,
          shadowColor: READING_COLORS.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 8,
          elevation: 2,
        }}>
          {renderContent(content)}
        </View>

        {/* Reading Progress Summary */}
        <View style={{
          alignItems: 'center',
          paddingVertical: READING_SETTINGS.rhythm.large,
          marginTop: READING_SETTINGS.rhythm.xlarge,
        }}>
          <View style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: READING_COLORS.accent,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: READING_SETTINGS.rhythm.medium,
          }}>
            <Text style={{
              fontFamily: TYPOGRAPHY.fonts.sans,
              fontSize: TYPOGRAPHY.sizes.body,
              color: READING_COLORS.paper,
              fontWeight: '600',
            }}>
              {Math.round(readingProgress * 100)}%
            </Text>
          </View>
          
          <Text style={{
            fontFamily: TYPOGRAPHY.fonts.sans,
            fontSize: TYPOGRAPHY.sizes.caption,
            color: READING_COLORS.text.caption,
            textAlign: 'center',
          }}>
            Reading Progress
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default EnhancedArticleReader;