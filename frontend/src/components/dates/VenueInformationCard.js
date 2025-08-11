/**
 * BLONG VenueInformationCard Component - Premium Elite Design
 * Comprehensive venue information with ratings, reviews, and navigation
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Image,
  Linking,
  Platform
} from 'react-native';

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

const VenueInformationCard = ({ 
  venue,
  style,
  onCallVenue,
  onGetDirections,
  onBookTable,
  showBookingButton = true,
  isRTL = false
}) => {
  const [showAllReviews, setShowAllReviews] = useState(false);

  const openMaps = () => {
    const address = encodeURIComponent(`${venue.name}, ${venue.address}`);
    const coords = venue.latitude && venue.longitude 
      ? `${venue.latitude},${venue.longitude}`
      : null;

    let url;
    if (Platform.OS === 'ios') {
      url = coords 
        ? `maps:0,0?q=${coords}(${encodeURIComponent(venue.name)})`
        : `maps:0,0?q=${address}`;
    } else {
      url = coords
        ? `geo:${coords}?q=${coords}(${encodeURIComponent(venue.name)})`
        : `geo:0,0?q=${address}`;
    }

    Linking.openURL(url).catch(() => {
      // Fallback to web maps
      const webUrl = `https://maps.google.com/maps?q=${address}`;
      Linking.openURL(webUrl);
    });

    if (onGetDirections) {
      onGetDirections(venue);
    }
  };

  const callVenue = () => {
    if (venue.phoneNumber) {
      Linking.openURL(`tel:${venue.phoneNumber}`);
      if (onCallVenue) {
        onCallVenue(venue);
      }
    }
  };

  const openWebsite = () => {
    if (venue.website) {
      Linking.openURL(venue.website);
    }
  };

  const renderStarRating = (rating, size = 'medium') => {
    const starSize = size === 'small' ? 12 : size === 'large' ? 18 : 14;
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.3;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Text key={i} style={[styles.star, { fontSize: starSize, color: COLORS.warning }]}>
            ★
          </Text>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Text key={i} style={[styles.star, { fontSize: starSize, color: COLORS.warning }]}>
            ☆
          </Text>
        );
      } else {
        stars.push(
          <Text key={i} style={[styles.star, { fontSize: starSize, color: COLORS.border }]}>
            ☆
          </Text>
        );
      }
    }

    return <View style={styles.starsContainer}>{stars}</View>;
  };

  const getPriceDisplay = (priceRange) => {
    const priceMap = {
      BUDGET: '$',
      MODERATE: '$$',
      UPSCALE: '$$$',
      LUXURY: '$$$$'
    };
    return priceMap[priceRange] || '$$';
  };

  const formatCategory = (category) => {
    return category
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatAmbiance = (ambianceArray) => {
    if (!ambianceArray || ambianceArray.length === 0) return '';
    
    return ambianceArray
      .slice(0, 3) // Show max 3 ambiance tags
      .map(amb => amb.toLowerCase().replace('_', ' '))
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' • ');
  };

  const renderOpeningHours = () => {
    if (!venue.openingHours) return null;

    const hours = typeof venue.openingHours === 'string' 
      ? JSON.parse(venue.openingHours) 
      : venue.openingHours;

    const today = new Date().getDay();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const todayHours = hours[days[today]];

    return (
      <View style={styles.hoursContainer}>
        <Text style={styles.hoursLabel}>Today's Hours:</Text>
        <Text style={styles.hoursText}>
          {todayHours || 'Hours not available'}
        </Text>
      </View>
    );
  };

  const renderReviews = () => {
    if (!venue.recentReviews || venue.recentReviews.length === 0) {
      return (
        <View style={styles.noReviews}>
          <Text style={styles.noReviewsText}>No reviews yet</Text>
        </View>
      );
    }

    const reviewsToShow = showAllReviews 
      ? venue.recentReviews 
      : venue.recentReviews.slice(0, 2);

    return (
      <View style={styles.reviewsContainer}>
        {reviewsToShow.map((review, index) => (
          <View key={index} style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewerName}>
                {review.user?.firstName || 'Anonymous'}
              </Text>
              {renderStarRating(review.rating, 'small')}
            </View>
            {review.review && (
              <Text style={styles.reviewText} numberOfLines={3}>
                {review.review}
              </Text>
            )}
          </View>
        ))}
        
        {venue.recentReviews.length > 2 && (
          <TouchableOpacity
            style={styles.showMoreReviews}
            onPress={() => setShowAllReviews(!showAllReviews)}
          >
            <Text style={styles.showMoreText}>
              {showAllReviews ? 'Show Less' : `Show ${venue.recentReviews.length - 2} More Reviews`}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {/* Header with venue image placeholder and basic info */}
      <View style={styles.header}>
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>📸</Text>
          </View>
        </View>
        
        <View style={styles.headerInfo}>
          <Text style={styles.venueName} numberOfLines={2}>
            {venue.name}
          </Text>
          
          <View style={styles.categoryRow}>
            <Text style={styles.category}>
              {formatCategory(venue.category)}
            </Text>
            <Text style={styles.priceRange}>
              {getPriceDisplay(venue.priceRange)}
            </Text>
          </View>

          <View style={styles.ratingRow}>
            {renderStarRating(venue.averageRating)}
            <Text style={styles.ratingText}>
              {venue.averageRating.toFixed(1)}
            </Text>
            <Text style={styles.reviewCount}>
              ({venue.reviewCount || venue.totalReviews || 0} reviews)
            </Text>
          </View>

          {venue.ambiance && venue.ambiance.length > 0 && (
            <Text style={styles.ambiance}>
              {formatAmbiance(venue.ambiance)}
            </Text>
          )}
        </View>
      </View>

      {/* Address and contact info */}
      <View style={styles.contactSection}>
        <TouchableOpacity
          style={styles.contactItem}
          onPress={openMaps}
          activeOpacity={0.7}
        >
          <Text style={styles.contactIcon}>📍</Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Address</Text>
            <Text style={styles.contactValue} numberOfLines={2}>
              {venue.address}
            </Text>
            {venue.distance && (
              <Text style={styles.distanceText}>
                {venue.distance.toFixed(1)} km away
              </Text>
            )}
          </View>
          <Text style={styles.actionIcon}>→</Text>
        </TouchableOpacity>

        {venue.phoneNumber && (
          <TouchableOpacity
            style={styles.contactItem}
            onPress={callVenue}
            activeOpacity={0.7}
          >
            <Text style={styles.contactIcon}>📞</Text>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Phone</Text>
              <Text style={styles.contactValue}>
                {venue.phoneNumber}
              </Text>
            </View>
            <Text style={styles.actionIcon}>→</Text>
          </TouchableOpacity>
        )}

        {venue.website && (
          <TouchableOpacity
            style={styles.contactItem}
            onPress={openWebsite}
            activeOpacity={0.7}
          >
            <Text style={styles.contactIcon}>🌐</Text>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Website</Text>
              <Text style={styles.contactValue} numberOfLines={1}>
                {venue.website.replace(/^https?:\/\//, '')}
              </Text>
            </View>
            <Text style={styles.actionIcon}>→</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Opening hours */}
      {renderOpeningHours()}

      {/* Features */}
      {venue.features && venue.features.length > 0 && (
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featuresContainer}>
            {venue.features.slice(0, 6).map((feature, index) => (
              <View key={index} style={styles.featureTag}>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Reviews */}
      <View style={styles.reviewsSection}>
        <Text style={styles.sectionTitle}>Recent Reviews</Text>
        {renderReviews()}
      </View>

      {/* Action buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={openMaps}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonIcon}>🗺️</Text>
          <Text style={styles.secondaryButtonText}>Directions</Text>
        </TouchableOpacity>

        {showBookingButton && venue.bookingRequired && (
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={() => onBookTable && onBookTable(venue)}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonIcon}>📅</Text>
            <Text style={styles.primaryButtonText}>Book Table</Text>
          </TouchableOpacity>
        )}
      </View>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  imageContainer: {
    marginRight: 16,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    fontSize: 24,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  venueName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  category: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginRight: 8,
  },
  priceRange: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.accent,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 6,
  },
  star: {
    marginRight: 1,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  ambiance: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  contactSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  contactIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 20,
    textAlign: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 18,
  },
  distanceText: {
    fontSize: 12,
    color: COLORS.accent,
    marginTop: 2,
  },
  actionIcon: {
    fontSize: 14,
    color: COLORS.textTertiary,
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
  },
  hoursLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginRight: 8,
  },
  hoursText: {
    fontSize: 14,
    color: COLORS.text,
  },
  featuresSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureTag: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 6,
  },
  featureText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  reviewsSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  reviewsContainer: {
    marginTop: 8,
  },
  reviewItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  reviewText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  showMoreReviews: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  showMoreText: {
    fontSize: 14,
    color: COLORS.accent,
    fontWeight: '500',
  },
  noReviews: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noReviewsText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  primaryButton: {
    backgroundColor: COLORS.accent,
  },
  secondaryButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionButtonIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.background,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
});

export default VenueInformationCard;