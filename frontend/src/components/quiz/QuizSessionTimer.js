/**
 * BLONG Quiz Session Timer
 * Real-time timer for quiz sessions
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const QuizSessionTimer = ({ startTime, style, showIcon = true }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const start = new Date(startTime);
      const elapsed = Math.floor((now - start) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimerColor = (seconds) => {
    if (seconds < 300) return '#4ECDC4'; // Under 5 minutes - green
    if (seconds < 600) return '#FFD93D'; // Under 10 minutes - yellow
    return '#FF6B6B'; // Over 10 minutes - red
  };

  return (
    <View style={[styles.container, style]}>
      {showIcon && (
        <Ionicons 
          name="time" 
          size={16} 
          color={getTimerColor(elapsedTime)} 
          style={styles.icon}
        />
      )}
      <Text style={[styles.timerText, { color: getTimerColor(elapsedTime) }]}>
        {formatTime(elapsedTime)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 4,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
});

export default QuizSessionTimer;