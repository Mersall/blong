/**
 * BLONG DatePreparationCard Component - Premium Elite Design
 * Comprehensive date preparation interface with tips, checklist, and guidance
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager
} from 'react-native';
import CountdownTimer from './CountdownTimer';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// MANDATORY COLORS - Following Design Rules
const COLORS = {
  background: '#FFFFFF',
  surface: '#FAFAFA',
  text: '#0A0A0A',
  textSecondary: '#6B6B6B',
  textTertiary: '#9E9E9E',
  accent: '#FF6B35',
  border: '#E0E0E0',
  shadow: '#000000',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
};

const DatePreparationCard = ({ 
  date,
  preparationData,
  onUpdateChecklist,
  style,
  isRTL = false
}) => {
  const [expandedSections, setExpandedSections] = useState({
    timeline: false,
    tips: false,
    conversation: false,
    outfit: false,
    logistics: false,
  });
  
  const [checkedItems, setCheckedItems] = useState({});

  const toggleSection = (section) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleChecklistItem = (itemId) => {
    const newCheckedItems = {
      ...checkedItems,
      [itemId]: !checkedItems[itemId]
    };
    setCheckedItems(newCheckedItems);
    
    if (onUpdateChecklist) {
      onUpdateChecklist(itemId, newCheckedItems[itemId]);
    }
  };

  const getPreparationStatus = () => {
    const totalItems = preparationData?.checklist?.length || 0;
    const completedItems = Object.values(checkedItems).filter(Boolean).length;
    
    return {
      completed: completedItems,
      total: totalItems,
      percentage: totalItems > 0 ? (completedItems / totalItems) * 100 : 0
    };
  };

  const renderSectionHeader = (title, iconEmoji, sectionKey, subtitle) => (
    <TouchableOpacity
      style={styles.sectionHeader}
      onPress={() => toggleSection(sectionKey)}
      activeOpacity={0.7}
    >
      <View style={styles.sectionHeaderLeft}>
        <Text style={styles.sectionIcon}>{iconEmoji}</Text>
        <View style={styles.sectionHeaderText}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {subtitle && (
            <Text style={styles.sectionSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      <Text style={[
        styles.expandIcon,
        expandedSections[sectionKey] && styles.expandIconRotated
      ]}>
        ▼
      </Text>
    </TouchableOpacity>
  );

  const renderTimelineChecklist = () => {
    if (!preparationData?.timeline) return null;

    return (
      <View style={styles.sectionContent}>
        {preparationData.timeline.map((timeframe, index) => (
          <View key={index} style={styles.timelineItem}>
            <Text style={styles.timelineHeader}>{timeframe.timeframe}</Text>
            
            {timeframe.tasks.map((task, taskIndex) => {
              const itemId = `timeline-${index}-${taskIndex}`;
              return (
                <TouchableOpacity
                  key={taskIndex}
                  style={styles.checklistItem}
                  onPress={() => toggleChecklistItem(itemId)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.checkbox,
                    checkedItems[itemId] && styles.checkboxChecked
                  ]}>
                    {checkedItems[itemId] && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                  <Text style={[
                    styles.checklistText,
                    checkedItems[itemId] && styles.checklistTextCompleted
                  ]}>
                    {task}
                  </Text>
                </TouchableOpacity>
              );
            })}

            {timeframe.tips && timeframe.tips.length > 0 && (
              <View style={styles.tipsContainer}>
                {timeframe.tips.map((tip, tipIndex) => (
                  <View key={tipIndex} style={styles.tipItem}>
                    <Text style={styles.tipBullet}>💡</Text>
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderPersonalizedTips = () => {
    if (!preparationData?.personalizedTips) return null;

    return (
      <View style={styles.sectionContent}>
        {preparationData.personalizedTips.map((tip, index) => (
          <View key={index} style={styles.tipItem}>
            <Text style={styles.tipBullet}>✨</Text>
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderConversationStarters = () => {
    if (!preparationData?.conversationStarters) return null;

    return (
      <View style={styles.sectionContent}>
        {preparationData.conversationStarters.map((starter, index) => (
          <View key={index} style={styles.conversationItem}>
            <Text style={styles.conversationText}>"{starter}"</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderOutfitSuggestions = () => {
    if (!preparationData?.outfitSuggestions) return null;

    const outfit = preparationData.outfitSuggestions;

    return (
      <View style={styles.sectionContent}>
        <View style={styles.outfitHeader}>
          <Text style={styles.outfitStyle}>{outfit.style}</Text>
          <Text style={styles.outfitDescription}>{outfit.description}</Text>
        </View>
        
        {outfit.items && (
          <View style={styles.outfitSection}>
            <Text style={styles.outfitSectionTitle}>Suggested Items:</Text>
            {outfit.items.map((item, index) => (
              <Text key={index} style={styles.outfitItem}>• {item}</Text>
            ))}
          </View>
        )}

        {outfit.colors && (
          <View style={styles.outfitSection}>
            <Text style={styles.outfitSectionTitle}>Color Palette:</Text>
            <View style={styles.colorRow}>
              {outfit.colors.slice(0, 4).map((color, index) => (
                <Text key={index} style={styles.colorTag}>{color}</Text>
              ))}
            </View>
          </View>
        )}

        {outfit.confidenceBoost && (
          <View style={styles.confidenceBoost}>
            <Text style={styles.confidenceIcon}>💪</Text>
            <Text style={styles.confidenceText}>
              {outfit.confidenceBoost[0] || "Wear something that makes you feel confident and comfortable!"}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderLogistics = () => {
    if (!preparationData?.logistics) return null;

    const logistics = preparationData.logistics;

    return (
      <View style={styles.sectionContent}>
        {logistics.arrivalTime && (
          <View style={styles.logisticsItem}>
            <Text style={styles.logisticsIcon}>🕐</Text>
            <View style={styles.logisticsContent}>
              <Text style={styles.logisticsLabel}>Arrival Time</Text>
              <Text style={styles.logisticsValue}>{logistics.arrivalTime}</Text>
            </View>
          </View>
        )}

        {logistics.parkingInfo && (
          <View style={styles.logisticsItem}>
            <Text style={styles.logisticsIcon}>🚗</Text>
            <View style={styles.logisticsContent}>
              <Text style={styles.logisticsLabel}>Parking</Text>
              <Text style={styles.logisticsValue}>{logistics.parkingInfo}</Text>
            </View>
          </View>
        )}

        {logistics.publicTransport && (
          <View style={styles.logisticsItem}>
            <Text style={styles.logisticsIcon}>🚌</Text>
            <View style={styles.logisticsContent}>
              <Text style={styles.logisticsLabel}>Public Transport</Text>
              <Text style={styles.logisticsValue}>{logistics.publicTransport}</Text>
            </View>
          </View>
        )}

        {logistics.contactInfo && (
          <View style={styles.logisticsItem}>
            <Text style={styles.logisticsIcon}>📞</Text>
            <View style={styles.logisticsContent}>
              <Text style={styles.logisticsLabel}>Venue Contact</Text>
              <Text style={styles.logisticsValue}>{logistics.contactInfo}</Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  const status = getPreparationStatus();

  return (
    <View style={[styles.container, style]}>
      {/* Header with countdown and progress */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Date Preparation</Text>
          <Text style={styles.subtitle}>
            {status.completed} of {status.total} items completed
          </Text>
        </View>
        <CountdownTimer 
          targetDate={date.scheduledDateTime}
          size="small"
          theme="minimal"
        />
      </View>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View style={[
            styles.progressFill,
            { width: `${status.percentage}%` }
          ]} />
        </View>
        <Text style={styles.progressText}>
          {Math.round(status.percentage)}% Complete
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Timeline Checklist */}
        {renderSectionHeader(
          'Preparation Timeline',
          '📅',
          'timeline',
          'Step-by-step preparation guide'
        )}
        {expandedSections.timeline && renderTimelineChecklist()}

        {/* Personalized Tips */}
        {renderSectionHeader(
          'Personalized Tips',
          '💡',
          'tips',
          'Based on your personality and preferences'
        )}
        {expandedSections.tips && renderPersonalizedTips()}

        {/* Conversation Starters */}
        {renderSectionHeader(
          'Conversation Starters',
          '💬',
          'conversation',
          'Break the ice naturally'
        )}
        {expandedSections.conversation && renderConversationStarters()}

        {/* Outfit Suggestions */}
        {renderSectionHeader(
          'Outfit Suggestions',
          '👔',
          'outfit',
          'Dress to impress'
        )}
        {expandedSections.outfit && renderOutfitSuggestions()}

        {/* Logistics */}
        {renderSectionHeader(
          'Logistics & Details',
          '📍',
          'logistics',
          'Practical information'
        )}
        {expandedSections.logistics && renderLogistics()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    // Premium shadow
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  scrollView: {
    maxHeight: 400,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  sectionHeaderText: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  expandIcon: {
    fontSize: 12,
    color: COLORS.textSecondary,
    transform: [{ rotate: '0deg' }],
  },
  expandIconRotated: {
    transform: [{ rotate: '180deg' }],
  },
  sectionContent: {
    padding: 16,
  },
  timelineItem: {
    marginBottom: 20,
  },
  timelineHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.accent,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  checkmark: {
    color: COLORS.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
  checklistText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  checklistTextCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.textSecondary,
  },
  tipsContainer: {
    marginTop: 8,
    paddingLeft: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipBullet: {
    fontSize: 14,
    marginRight: 8,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  conversationItem: {
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
  },
  conversationText: {
    fontSize: 14,
    color: COLORS.text,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  outfitHeader: {
    marginBottom: 16,
  },
  outfitStyle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  outfitDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  outfitSection: {
    marginBottom: 16,
  },
  outfitSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  outfitItem: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
    lineHeight: 20,
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorTag: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    color: COLORS.text,
    marginRight: 8,
    marginBottom: 4,
  },
  confidenceBoost: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.accent + '10',
    padding: 12,
    borderRadius: 8,
  },
  confidenceIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  confidenceText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
    lineHeight: 20,
  },
  logisticsItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  logisticsIcon: {
    fontSize: 16,
    marginRight: 12,
    marginTop: 2,
  },
  logisticsContent: {
    flex: 1,
  },
  logisticsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  logisticsValue: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 18,
  },
});

export default DatePreparationCard;