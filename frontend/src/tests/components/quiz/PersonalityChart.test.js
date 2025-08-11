/**
 * PersonalityChart Component Tests
 * Tests for the personality radar chart visualization component
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import PersonalityChart from '../../../components/quiz/PersonalityChart';

// Mock React Native SVG
jest.mock('react-native-svg', () => {
  const React = require('react');
  return {
    Svg: ({ children, width, height, testID }) => 
      React.createElement('div', { testID: testID || 'svg-chart', 'data-width': width, 'data-height': height }, children),
    Polygon: ({ points, fill, stroke, testID }) => 
      React.createElement('div', { testID: testID || 'polygon', 'data-points': points, 'data-fill': fill, 'data-stroke': stroke }),
    Circle: ({ cx, cy, r, fill, testID }) => 
      React.createElement('div', { testID: testID || 'circle', 'data-cx': cx, 'data-cy': cy, 'data-r': r, 'data-fill': fill }),
    Line: ({ x1, y1, x2, y2, stroke, testID }) => 
      React.createElement('div', { testID: testID || 'line', 'data-x1': x1, 'data-y1': y1, 'data-x2': x2, 'data-y2': y2, 'data-stroke': stroke }),
    Text: ({ x, y, children, testID }) => 
      React.createElement('div', { testID: testID || 'svg-text', 'data-x': x, 'data-y': y }, children),
    Defs: ({ children }) => React.createElement('div', { testID: 'defs' }, children),
    LinearGradient: ({ children, id }) => React.createElement('div', { testID: 'gradient', 'data-id': id }, children),
    Stop: ({ offset, stopColor, stopOpacity }) => 
      React.createElement('div', { testID: 'stop', 'data-offset': offset, 'data-color': stopColor, 'data-opacity': stopOpacity }),
  };
});

// Mock React Native components
jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  Dimensions: {
    get: () => ({ width: 375, height: 812 }),
  },
  Animated: {
    Value: jest.fn((value) => ({ setValue: jest.fn(), _value: value })),
    timing: jest.fn(() => ({ start: jest.fn() })),
    parallel: jest.fn(() => ({ start: jest.fn() })),
  },
}));

describe('PersonalityChart', () => {
  const mockPersonalityProfile = {
    opennessScore: 75,
    conscientiousnessScore: 80,
    extraversionScore: 60,
    agreeablenessScore: 85,
    neuroticismScore: 40,
  };

  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      const { getByText } = render(
        <PersonalityChart personalityProfile={mockPersonalityProfile} />
      );
      
      expect(getByText('🧠 Personality Profile')).toBeTruthy();
    });

    it('should render chart title and description', () => {
      const { getByText } = render(
        <PersonalityChart personalityProfile={mockPersonalityProfile} />
      );
      
      expect(getByText('🧠 Personality Profile')).toBeTruthy();
      expect(getByText('Your unique personality pattern based on the Big Five model')).toBeTruthy();
    });

    it('should render SVG chart with correct dimensions', () => {
      const { getByTestId } = render(
        <PersonalityChart personalityProfile={mockPersonalityProfile} />
      );
      
      const svgChart = getByTestId('svg-chart');
      expect(svgChart).toBeTruthy();
      // Chart size should be calculated based on screen width
      expect(svgChart.props['data-width']).toBeDefined();
      expect(svgChart.props['data-height']).toBeDefined();
    });

    it('should show placeholder when no personality profile provided', () => {
      const { getByText, queryByTestId } = render(
        <PersonalityChart personalityProfile={null} />
      );
      
      expect(getByText('No personality data available')).toBeTruthy();
      expect(queryByTestId('svg-chart')).toBeFalsy();
    });

    it('should show placeholder when personality profile is undefined', () => {
      const { getByText } = render(
        <PersonalityChart />
      );
      
      expect(getByText('No personality data available')).toBeTruthy();
    });
  });

  describe('Personality Data Visualization', () => {
    it('should render personality polygon with correct data', () => {
      const { getAllByTestId } = render(
        <PersonalityChart personalityProfile={mockPersonalityProfile} />
      );
      
      const polygons = getAllByTestId('polygon');
      expect(polygons.length).toBeGreaterThan(0);
      
      // Should have grid polygons plus personality data polygon
      const personalityPolygon = polygons.find(polygon => 
        polygon.props['data-fill'] && polygon.props['data-fill'].includes('url(#personalityGradient)')
      );
      expect(personalityPolygon).toBeTruthy();
    });

    it('should render trait points for each personality dimension', () => {
      const { getAllByTestId } = render(
        <PersonalityChart personalityProfile={mockPersonalityProfile} />
      );
      
      const circles = getAllByTestId('circle');
      expect(circles).toHaveLength(5); // One for each Big Five trait
    });

    it('should render axis lines for each trait', () => {
      const { getAllByTestId } = render(
        <PersonalityChart personalityProfile={mockPersonalityProfile} />
      );
      
      const lines = getAllByTestId('line');
      expect(lines).toHaveLength(5); // One axis line for each trait
    });

    it('should render grid lines for scale reference', () => {
      const { getAllByTestId } = render(
        <PersonalityChart personalityProfile={mockPersonalityProfile} />
      );
      
      const polygons = getAllByTestId('polygon');
      // Should have 5 grid levels plus 1 personality polygon
      expect(polygons.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe('Trait Labels and Scores', () => {
    it('should display trait labels correctly', () => {
      const { getAllByTestId } = render(
        <PersonalityChart personalityProfile={mockPersonalityProfile} />
      );
      
      const textElements = getAllByTestId('svg-text');
      expect(textElements.length).toBeGreaterThan(0);
      
      // Should contain labels for all traits
      const textContent = textElements.map(element => 
        element.children ? element.children.join('') : ''
      ).join(' ');
      
      expect(textContent).toContain('Openness');
      expect(textContent).toContain('Conscientiousness');
      expect(textContent).toContain('Extraversion');
      expect(textContent).toContain('Agreeableness');
      expect(textContent).toContain('Emotional Stability'); // neuroticism is labeled as emotional stability
    });

    it('should display personality scores correctly', () => {
      const { getAllByTestId } = render(
        <PersonalityChart personalityProfile={mockPersonalityProfile} />
      );
      
      const textElements = getAllByTestId('svg-text');
      const textContent = textElements.map(element => 
        element.children ? element.children.join('') : ''
      ).join(' ');
      
      // Should display the actual scores
      expect(textContent).toContain('75%'); // openness
      expect(textContent).toContain('80%'); // conscientiousness
      expect(textContent).toContain('60%'); // extraversion
      expect(textContent).toContain('85%'); // agreeableness
      expect(textContent).toContain('40%'); // neuroticism
    });
  });

  describe('Visual Styling', () => {
    it('should render gradient definition for personality polygon', () => {
      const { getByTestId } = render(
        <PersonalityChart personalityProfile={mockPersonalityProfile} />
      );
      
      const defs = getByTestId('defs');
      expect(defs).toBeTruthy();
      
      const gradient = getByTestId('gradient');
      expect(gradient).toBeTruthy();
      expect(gradient.props['data-id']).toBe('personalityGradient');
    });

    it('should render gradient stops', () => {
      const { getAllByTestId } = render(
        <PersonalityChart personalityProfile={mockPersonalityProfile} />
      );
      
      const stops = getAllByTestId('stop');
      expect(stops).toHaveLength(2); // Start and end stops for gradient
    });

    it('should apply custom styles when provided', () => {
      const customStyle = { marginTop: 20, backgroundColor: '#f0f0f0' };
      const { getByText } = render(
        <PersonalityChart 
          personalityProfile={mockPersonalityProfile} 
          style={customStyle}
        />
      );
      
      // Component should render with custom styles (styles are applied but not easily testable in this setup)
      expect(getByText('🧠 Personality Profile')).toBeTruthy();
    });
  });

  describe('Data Validation', () => {
    it('should handle missing personality scores gracefully', () => {
      const incompleteProfile = {
        opennessScore: 75,
        // Missing other scores
      };
      
      const { getByText, getAllByTestId } = render(
        <PersonalityChart personalityProfile={incompleteProfile} />
      );
      
      expect(getByText('🧠 Personality Profile')).toBeTruthy();
      
      // Should still render chart elements
      const circles = getAllByTestId('circle');
      expect(circles).toHaveLength(5);
    });

    it('should handle zero personality scores', () => {
      const zeroProfile = {
        opennessScore: 0,
        conscientiousnessScore: 0,
        extraversionScore: 0,
        agreeablenessScore: 0,
        neuroticismScore: 0,
      };
      
      const { getByText, getAllByTestId } = render(
        <PersonalityChart personalityProfile={zeroProfile} />
      );
      
      expect(getByText('🧠 Personality Profile')).toBeTruthy();
      
      const textElements = getAllByTestId('svg-text');
      const textContent = textElements.map(element => 
        element.children ? element.children.join('') : ''
      ).join(' ');
      
      expect(textContent).toContain('0%');
    });

    it('should handle maximum personality scores', () => {
      const maxProfile = {
        opennessScore: 100,
        conscientiousnessScore: 100,
        extraversionScore: 100,
        agreeablenessScore: 100,
        neuroticismScore: 100,
      };
      
      const { getAllByTestId } = render(
        <PersonalityChart personalityProfile={maxProfile} />
      );
      
      const textElements = getAllByTestId('svg-text');
      const textContent = textElements.map(element => 
        element.children ? element.children.join('') : ''
      ).join(' ');
      
      expect(textContent).toContain('100%');
    });
  });

  describe('Animation Integration', () => {
    it('should initialize animated values for all traits', () => {
      const { Animated } = require('react-native');
      
      render(<PersonalityChart personalityProfile={mockPersonalityProfile} />);
      
      // Animated.Value should be called for each trait
      expect(Animated.Value).toHaveBeenCalledWith(0);
    });

    it('should trigger animations when personality profile is provided', () => {
      const { Animated } = require('react-native');
      
      render(<PersonalityChart personalityProfile={mockPersonalityProfile} />);
      
      // Animation timing should be called
      expect(Animated.timing).toHaveBeenCalled();
      expect(Animated.parallel).toHaveBeenCalled();
    });
  });

  describe('Responsive Design', () => {
    it('should calculate chart size based on screen dimensions', () => {
      const { getByTestId } = render(
        <PersonalityChart personalityProfile={mockPersonalityProfile} />
      );
      
      const svgChart = getByTestId('svg-chart');
      const width = svgChart.props['data-width'];
      const height = svgChart.props['data-height'];
      
      // Chart should be square and sized appropriately for mobile
      expect(width).toBe(height);
      expect(width).toBeLessThanOrEqual(375 - 64); // Screen width minus padding
      expect(width).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('should provide meaningful text content for screen readers', () => {
      const { getByText } = render(
        <PersonalityChart personalityProfile={mockPersonalityProfile} />
      );
      
      expect(getByText('🧠 Personality Profile')).toBeTruthy();
      expect(getByText('Your unique personality pattern based on the Big Five model')).toBeTruthy();
    });
  });
});