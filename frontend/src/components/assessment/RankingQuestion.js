/**
 * BLONG Ranking Question Component
 * Interactive drag-and-drop ranking for priority-based assessment questions
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanGestureHandler,
  State,
} from 'react-native';

const RankingQuestion = ({
  options,
  value,
  onValueChange,
  colors,
  isRTL,
  t,
  style,
}) => {
  const [rankedItems, setRankedItems] = useState([]);
  const [itemAnims] = useState(
    options.map(() => new Animated.Value(0.8))
  );

  useEffect(() => {
    // Initialize ranked items from value or default order
    if (value && Array.isArray(value)) {
      setRankedItems(value);
    } else {
      // Initialize with unranked items
      setRankedItems(options.map(option => ({ ...option, rank: null })));
    }

    // Animate items entrance
    const animations = itemAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      })
    );

    Animated.stagger(100, animations).start();
  }, [options]);

  const handleItemPress = (item, newRank) => {
    const updatedItems = rankedItems.map(rankedItem => {
      if (rankedItem.value === item.value) {
        return { ...rankedItem, rank: newRank };
      }
      // If another item has this rank, remove it
      if (rankedItem.rank === newRank) {
        return { ...rankedItem, rank: null };
      }
      return rankedItem;
    });

    setRankedItems(updatedItems);
    
    // Convert to the format expected by the assessment service
    const rankedValues = updatedItems
      .filter(item => item.rank !== null)
      .sort((a, b) => a.rank - b.rank)
      .map(item => ({ value: item.value, rank: item.rank }));
    
    onValueChange(rankedValues);

    // Animate the pressed item
    const itemIndex = options.findIndex(opt => opt.value === item.value);
    if (itemIndex >= 0) {
      Animated.sequence([
        Animated.timing(itemAnims[itemIndex], {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(itemAnims[itemIndex], {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const getRankForItem = (item) => {
    const rankedItem = rankedItems.find(ri => ri.value === item.value);
    return rankedItem?.rank || null;
  };

  const isRankTaken = (rank) => {
    return rankedItems.some(item => item.rank === rank);
  };

  const getCompletionPercentage = () => {
    const rankedCount = rankedItems.filter(item => item.rank !== null).length;
    return Math.round((rankedCount / options.length) * 100);
  };

  const styles = createStyles(colors, isRTL);

  return (
    <View style={[styles.container, style]}>
      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          {t('assessment.rankingInstruction') || 'Rank these items in order of importance to you (1 = most important):'}
        </Text>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {getCompletionPercentage()}% {t('assessment.complete') || 'Complete'}
          </Text>
        </View>
      </View>

      {/* Ranking Numbers */}
      <View style={styles.rankingNumbersContainer}>
        <Text style={styles.rankingNumbersTitle}>
          {t('assessment.priority') || 'Priority:'}
        </Text>
        <View style={styles.rankingNumbers}>
          {Array.from({ length: options.length }, (_, index) => {
            const rank = index + 1;
            const isTaken = isRankTaken(rank);
            
            return (
              <View
                key={rank}
                style={[
                  styles.rankNumber,
                  isTaken && styles.rankNumberTaken,
                ]}
              >
                <Text style={[
                  styles.rankNumberText,
                  isTaken && styles.rankNumberTextTaken,
                ]}>
                  {rank}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Items to Rank */}
      <View style={styles.itemsContainer}>
        {options.map((option, index) => {
          const currentRank = getRankForItem(option);
          const isRanked = currentRank !== null;
          
          return (
            <Animated.View
              key={option.value}
              style={[
                styles.itemContainer,
                {
                  transform: [{ scale: itemAnims[index] }],
                },
              ]}
            >
              <View style={[
                styles.itemCard,
                isRanked && styles.itemCardRanked,
              ]}>
                {/* Rank Badge */}
                <View style={[
                  styles.rankBadge,
                  isRanked && styles.rankBadgeRanked,
                ]}>
                  <Text style={[
                    styles.rankBadgeText,
                    isRanked && styles.rankBadgeTextRanked,
                  ]}>
                    {isRanked ? currentRank : '?'}
                  </Text>
                </View>

                {/* Item Text */}
                <View style={styles.itemTextContainer}>
                  <Text style={[
                    styles.itemText,
                    isRanked && styles.itemTextRanked,
                  ]}>
                    {t(option.key)}
                  </Text>
                </View>

                {/* Ranking Buttons */}
                <View style={styles.rankingButtonsContainer}>
                  {Array.from({ length: options.length }, (_, rankIndex) => {
                    const rank = rankIndex + 1;
                    const isCurrentRank = currentRank === rank;
                    const isDisabled = isRankTaken(rank) && !isCurrentRank;
                    
                    return (
                      <TouchableOpacity
                        key={rank}
                        style={[
                          styles.rankingButton,
                          isCurrentRank && styles.rankingButtonSelected,
                          isDisabled && styles.rankingButtonDisabled,
                        ]}
                        onPress={() => handleItemPress(option, rank)}
                        disabled={isDisabled}
                        activeOpacity={0.7}
                      >
                        <Text style={[
                          styles.rankingButtonText,
                          isCurrentRank && styles.rankingButtonTextSelected,
                          isDisabled && styles.rankingButtonTextDisabled,
                        ]}>
                          {rank}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </Animated.View>
          );
        })}
      </View>

      {/* Completion Status */}
      {getCompletionPercentage() === 100 && (
        <Animated.View style={styles.completionContainer}>
          <View style={styles.completionIndicator}>
            <Text style={styles.completionIcon}>✓</Text>
          </View>
          <Text style={styles.completionText}>
            {t('assessment.rankingComplete') || 'Ranking complete!'}
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

const createStyles = (colors, isRTL) => StyleSheet.create({
  container: {
    paddingVertical: 16,
  },

  instructionsContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },

  instructionsText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
    marginBottom: 8,
  },

  progressContainer: {
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },

  progressText: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '600',
  },

  rankingNumbersContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },

  rankingNumbersTitle: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 8,
  },

  rankingNumbers: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    gap: 8,
  },

  rankNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  rankNumberTaken: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },

  rankNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  rankNumberTextTaken: {
    color: colors.surface,
  },

  itemsContainer: {
    gap: 12,
  },

  itemContainer: {
    marginBottom: 4,
  },

  itemCard: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  itemCardRanked: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.accent,
    elevation: 4,
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  rankBadge: {
    position: 'absolute',
    top: -8,
    left: isRTL ? undefined : 12,
    right: isRTL ? 12 : undefined,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },

  rankBadgeRanked: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },

  rankBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },

  rankBadgeTextRanked: {
    color: colors.surface,
  },

  itemTextContainer: {
    marginBottom: 12,
    paddingTop: 8,
  },

  itemText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
    textAlign: isRTL ? 'right' : 'left',
  },

  itemTextRanked: {
    color: colors.accent,
    fontWeight: '600',
  },

  rankingButtonsContainer: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },

  rankingButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  rankingButtonSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },

  rankingButtonDisabled: {
    opacity: 0.3,
  },

  rankingButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  rankingButtonTextSelected: {
    color: colors.surface,
  },

  rankingButtonTextDisabled: {
    color: colors.textTertiary,
  },

  completionContainer: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  completionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: isRTL ? 0 : 8,
    marginLeft: isRTL ? 8 : 0,
  },

  completionIcon: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: 'bold',
  },

  completionText: {
    fontSize: 14,
    color: colors.success,
    fontWeight: '600',
  },
});

export default RankingQuestion;
