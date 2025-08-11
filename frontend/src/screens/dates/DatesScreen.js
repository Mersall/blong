/**
 * BLONG Dates Screen - Premium Elite Design
 * Main screen for viewing delivered dates with RTL/LTR support
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, SafeAreaView, StatusBar } from 'react-native';
import { AppTransition } from '../../components/AppTransition';
import { useTheme } from '../../contexts/AppContext';
import DateCard from '../../components/dates/DateCard';
import EmptyDatesState from '../../components/dates/EmptyDatesState';
import { PremiumInlineLoader, PremiumLoadingCard } from '../../components/loading';
import { useScreenLoading, useInlineLoading } from '../../hooks/useLoading';
import { dateDeliveryService } from '../../services/dateDeliveryService';

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

const DatesScreen = ({
  onNavigateToDateDetail,
  userPreferences,
  user
}) => {
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const { colors, isRTL } = useTheme();
  const { showScreenLoading, hideScreenLoading } = useScreenLoading();
  const { showInlineLoading, hideInlineLoading } = useInlineLoading();

  useEffect(() => {
    loadDates();
  }, []);

  const loadDates = async (pageNum = 1, refresh = false) => {
    let screenLoadingId = null;
    let inlineLoadingId = null;

    try {
      if (refresh) {
        setRefreshing(true);
        setPage(1);
      } else if (pageNum === 1) {
        setLoading(true);
        // Show global screen loading for initial load
        screenLoadingId = showScreenLoading(
          'Loading your dates...',
          'Curating perfect matches just for you'
        );
      } else {
        // Show inline loading for pagination
        inlineLoadingId = showInlineLoading('Loading more dates...');
      }

      const response = await dateDeliveryService.getUserDates(pageNum, 10);

      if (refresh || pageNum === 1) {
        setDates(response.dates);
      } else {
        setDates(prev => [...prev, ...response.dates]);
      }

      setHasMore(response.hasMore);
      setError(null);
    } catch (err) {
      console.error('Error loading dates:', err);
      setError('Failed to load dates. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);

      // Hide global loading states
      if (screenLoadingId) hideScreenLoading(screenLoadingId);
      if (inlineLoadingId) hideInlineLoading(inlineLoadingId);
    }
  };

  const handleRefresh = () => {
    loadDates(1, true);
  };

  const handleDatePress = (date) => {
    onNavigateToDateDetail(date);
  };

  const handleInterestResponse = async (dateId, isInterested, response) => {
    try {
      await dateDeliveryService.expressInterest(dateId, isInterested, response);
      
      // Update the date in the local state
      setDates(prev => prev.map(date => 
        date.id === dateId 
          ? { 
              ...date, 
              userInterest: { 
                isInterested, 
                response, 
                respondedAt: new Date() 
              } 
            }
          : date
      ));
    } catch (err) {
      console.error('Error expressing interest:', err);
      // TODO: Show error toast
    }
  };

  const renderHeader = () => (
    <View style={{
      paddingTop: 40,
      paddingBottom: 32,
      paddingHorizontal: 32,
      alignItems: 'center',
      backgroundColor: COLORS.background,
    }}>
      {/* BLONG Elite Logo */}
      <Text style={{
        fontSize: 28,
        fontWeight: '300',
        letterSpacing: 8,
        color: COLORS.text,
        marginBottom: 16,
      }}>
        BLONG
      </Text>

      <View style={{
        width: 40,
        height: 2,
        backgroundColor: COLORS.accent,
        marginBottom: 24,
      }} />

      <Text style={{
        fontSize: 20,
        fontWeight: '300',
        color: COLORS.text,
        marginBottom: 8,
        textAlign: 'center',
      }}>
        Your Dates
      </Text>

      <Text style={{
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
      }}>
        Curated matches delivered just for you
      </Text>
    </View>
  );

  const renderContent = () => {
    if (loading && dates.length === 0) {
      return (
        <View style={{ paddingHorizontal: 32, paddingTop: 40 }}>
          <PremiumLoadingCard
            message="Loading your dates..."
            subtitle="Curating perfect matches just for you"
          />
        </View>
      );
    }

    if (error && dates.length === 0) {
      return (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 60,
          paddingHorizontal: 32,
        }}>
          <Text style={{
            fontSize: 18,
            color: COLORS.error,
            textAlign: 'center',
            marginBottom: 16,
          }}>
            Oops! Something went wrong
          </Text>
          <Text style={{
            fontSize: 14,
            color: COLORS.textSecondary,
            textAlign: 'center',
            lineHeight: 20,
          }}>
            {error}
          </Text>
        </View>
      );
    }

    if (dates.length === 0) {
      return <EmptyDatesState />;
    }

    return (
      <View style={{ paddingHorizontal: 32, paddingBottom: 120 }}>
        {dates.map((date, index) => (
          <DateCard
            key={date.id}
            date={date}
            onPress={() => handleDatePress(date)}
            onInterestResponse={handleInterestResponse}
            isRTL={isRTL}
            style={{ marginBottom: 24 }}
          />
        ))}
        
        {loading && dates.length > 0 && (
          <PremiumInlineLoader
            message="Loading more dates..."
            size="small"
            style={{ paddingVertical: 20 }}
          />
        )}
      </View>
    );
  };

  return (
    <AppTransition>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        
        {renderHeader()}
        
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[COLORS.accent]}
              tintColor={COLORS.accent}
            />
          }
          onScroll={({ nativeEvent }) => {
            const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
            const paddingToBottom = 20;
            
            if (
              layoutMeasurement.height + contentOffset.y >=
              contentSize.height - paddingToBottom &&
              hasMore &&
              !loading
            ) {
              const nextPage = page + 1;
              setPage(nextPage);
              loadDates(nextPage);
            }
          }}
          scrollEventThrottle={400}
        >
          {renderContent()}
        </ScrollView>
      </SafeAreaView>
    </AppTransition>
  );
};

export default DatesScreen;
