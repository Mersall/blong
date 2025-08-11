/**
 * BLONG Geolocation Input Component
 * Automatic location detection with manual input fallback
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, Platform, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { useTranslation } from 'react-i18next';
import { PremiumSpinner } from '../loading';
import { FormInput } from './FormComponents';

// ALWAYS include COLORS constant - BLONG Design System
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
};

export const GeolocationInput = ({ 
  values = {}, 
  onLocationChange,
  required = true 
}) => {
  const { t } = useTranslation();
  const [isDetecting, setIsDetecting] = useState(false);
  const [locationStatus, setLocationStatus] = useState('idle'); // 'idle', 'detecting', 'success', 'error', 'manual', 'permission_denied', 'timeout'
  const [detectedLocation, setDetectedLocation] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [errorDetails, setErrorDetails] = useState(null);
  const locationTimeoutRef = useRef(null);
  
  const MAX_RETRY_ATTEMPTS = 3;
  const LOCATION_TIMEOUT = 15000; // 15 seconds

  // Auto-detect location on mount
  useEffect(() => {
    if (!values.city && !values.country) {
      detectLocation();
    }
  }, []);

  const detectLocation = async (attemptNumber = 0) => {
    setIsDetecting(true);
    setLocationStatus('detecting');
    setErrorDetails(null);
    
    // Clear any existing timeout
    if (locationTimeoutRef.current) {
      clearTimeout(locationTimeoutRef.current);
    }

    try {
      console.log(`🌍 Starting location detection, attempt ${attemptNumber + 1}/${MAX_RETRY_ATTEMPTS + 1}`);
      
      // Request permission with better error handling
      const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        console.log('📍 Location permission denied:', status);
        setLocationStatus('permission_denied');
        setErrorDetails({
          type: 'permission',
          message: status === 'denied' && !canAskAgain 
            ? 'Location access permanently denied. Please enable in device settings.'
            : 'Location permission is required to automatically detect your location.',
          canRetry: canAskAgain,
        });
        setIsDetecting(false);
        
        // Auto-switch to manual after a delay
        setTimeout(() => {
          if (locationStatus === 'permission_denied') {
            setLocationStatus('manual');
          }
        }, 3000);
        return;
      }

      // Set up location timeout
      locationTimeoutRef.current = setTimeout(() => {
        setLocationStatus('timeout');
        setErrorDetails({
          type: 'timeout',
          message: 'Location detection is taking too long. Please try again or enter manually.',
          canRetry: true,
        });
        setIsDetecting(false);
      }, LOCATION_TIMEOUT);

      // Get current location with enhanced options
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: LOCATION_TIMEOUT - 1000, // Slightly less than our wrapper timeout
        maximumAge: 60000, // Accept cached location up to 1 minute old
      });

      // Clear timeout on success
      if (locationTimeoutRef.current) {
        clearTimeout(locationTimeoutRef.current);
        locationTimeoutRef.current = null;
      }

      console.log('📍 Location acquired:', location.coords);

      // Reverse geocode with timeout
      const geocodePromise = Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      
      const geocodeTimeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Geocoding timeout')), 10000)
      );
      
      const reverseGeocode = await Promise.race([geocodePromise, geocodeTimeout]);

      if (reverseGeocode && reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        const locationData = {
          country: address.country || '',
          region: address.region || address.subregion || '',
          city: address.city || address.subregion || '',
          district: address.district || address.street || '',
          postalCode: address.postalCode || '',
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        console.log('✅ Location detected successfully:', locationData);
        setDetectedLocation(locationData);
        setLocationStatus('success');
        setRetryCount(0);
        onLocationChange(locationData);
      } else {
        throw new Error('No address found for this location');
      }
    } catch (error) {
      console.error('❌ Location detection error:', error);
      
      // Clear timeout on error
      if (locationTimeoutRef.current) {
        clearTimeout(locationTimeoutRef.current);
        locationTimeoutRef.current = null;
      }
      
      const isNetworkError = error.message?.includes('Network') || 
                            error.message?.includes('network') ||
                            error.code === 'E_NETWORK_ERROR';
      const isTimeoutError = error.message?.includes('timeout') || 
                            error.message?.includes('Timeout');
      
      // Handle retry logic for network/timeout errors
      if ((isNetworkError || isTimeoutError) && attemptNumber < MAX_RETRY_ATTEMPTS) {
        const nextAttempt = attemptNumber + 1;
        setRetryCount(nextAttempt);
        
        console.log(`🔄 Retrying location detection in 2 seconds... (${nextAttempt}/${MAX_RETRY_ATTEMPTS})`);
        
        setLocationStatus('error');
        setErrorDetails({
          type: isTimeoutError ? 'timeout' : 'network',
          message: `${isTimeoutError ? 'Location timeout' : 'Network error'}. Retrying... (${nextAttempt}/${MAX_RETRY_ATTEMPTS})`,
          canRetry: true,
          isRetrying: true,
        });
        
        setTimeout(() => {
          if (locationStatus !== 'manual') {
            detectLocation(nextAttempt);
          }
        }, 2000);
        return;
      }
      
      // Final error state
      setLocationStatus('error');
      setErrorDetails({
        type: isNetworkError ? 'network' : isTimeoutError ? 'timeout' : 'unknown',
        message: isNetworkError 
          ? 'Unable to connect to location services. Please check your internet connection.'
          : isTimeoutError
            ? 'Location detection timed out. Please try again or enter manually.'
            : 'Unable to detect your location. Please try again or enter manually.',
        canRetry: true,
        finalError: attemptNumber >= MAX_RETRY_ATTEMPTS,
      });
      
      // Auto-switch to manual after final error
      if (attemptNumber >= MAX_RETRY_ATTEMPTS) {
        setTimeout(() => {
          if (locationStatus === 'error') {
            setLocationStatus('manual');
          }
        }, 4000);
      }
    } finally {
      setIsDetecting(false);
    }
  };

  const handleManualMode = () => {
    setLocationStatus('manual');
  };

  const handleRetryLocation = () => {
    setRetryCount(0);
    setErrorDetails(null);
    detectLocation();
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (locationTimeoutRef.current) {
        clearTimeout(locationTimeoutRef.current);
      }
    };
  }, []);

  const handleManualInput = (field, value) => {
    onLocationChange({
      ...values,
      [field]: value
    });
  };

  const renderLocationStatus = () => {
    switch (locationStatus) {
      case 'detecting':
        return (
          <View style={{
            backgroundColor: COLORS.surface,
            borderRadius: 8, // ALWAYS 8px for cards
            padding: 24,
            marginBottom: 24,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: COLORS.border,
            shadowColor: COLORS.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 12,
            elevation: 2,
          }}>
            <PremiumSpinner size="medium" color={COLORS.accent} />
            <Text style={{
              fontSize: 16,
              fontWeight: '500',
              color: COLORS.text,
              marginTop: 16,
              marginBottom: 8,
              textAlign: 'center',
            }}>
              {retryCount > 0 
                ? t('location.retryingDetection') || `Retrying location detection... (${retryCount}/${MAX_RETRY_ATTEMPTS})`
                : t('location.detecting') || 'Detecting your location...'}
            </Text>
            <Text style={{
              fontSize: 14,
              color: COLORS.textSecondary,
              textAlign: 'center',
              lineHeight: 20,
            }}>
              {t('location.detectingSubtitle') || 'This may take a few moments'}
            </Text>
          </View>
        );

      case 'success':
        return (
          <View style={{
            backgroundColor: COLORS.accent + '10',
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: COLORS.accent + '30',
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 12,
            }}>
              <Text style={{ fontSize: 20, marginRight: 8 }}>✅</Text>
              <Text style={{
                fontSize: 16,
                fontWeight: '500',
                color: COLORS.text,
              }}>
                {t('location.detected')}
              </Text>
            </View>
            
            <Text style={{
              fontSize: 14,
              color: COLORS.textSecondary,
              marginBottom: 16,
              lineHeight: 20,
            }}>
              {detectedLocation?.city && detectedLocation?.country 
                ? `${detectedLocation.city}, ${detectedLocation.country}`
                : t('location.locationCaptured')}
            </Text>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
              <TouchableOpacity
                onPress={handleManualMode}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  backgroundColor: COLORS.background,
                }}
              >
                <Text style={{
                  fontSize: 14,
                  color: COLORS.textSecondary,
                }}>
                  {t('location.editManually')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleRetryLocation}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  backgroundColor: COLORS.accent,
                }}
              >
                <Text style={{
                  fontSize: 14,
                  color: COLORS.background,
                  fontWeight: '500',
                }}>
                  {t('location.detectAgain')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'error':
        return (
          <View style={{
            backgroundColor: '#FEF2F2',
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: '#FECACA',
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 12,
            }}>
              <Text style={{ fontSize: 20, marginRight: 8 }}>
                {errorDetails?.type === 'network' ? '🌐' : 
                 errorDetails?.type === 'timeout' ? '⏱️' : '⚠️'}
              </Text>
              <Text style={{
                fontSize: 16,
                fontWeight: '500',
                color: COLORS.text,
              }}>
                {errorDetails?.type === 'network' ? 'Connection Problem' :
                 errorDetails?.type === 'timeout' ? 'Location Timeout' :
                 'Location Detection Failed'}
              </Text>
            </View>
            
            <Text style={{
              fontSize: 14,
              color: COLORS.textSecondary,
              marginBottom: 16,
              lineHeight: 20,
            }}>
              {errorDetails?.message || 'We couldn\'t automatically detect your location.'}
            </Text>

            {errorDetails?.isRetrying && (
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}>
                <ActivityIndicator size="small" color={COLORS.accent} />
                <Text style={{
                  fontSize: 12,
                  color: COLORS.accent,
                  marginLeft: 8,
                  fontStyle: 'italic',
                }}>
                  Retrying automatically...
                </Text>
              </View>
            )}

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 8,
            }}>
              <TouchableOpacity
                onPress={handleManualMode}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  backgroundColor: COLORS.accent,
                  flex: 1,
                  minWidth: 120,
                }}
              >
                <Text style={{
                  fontSize: 14,
                  color: COLORS.background,
                  fontWeight: '500',
                  textAlign: 'center',
                }}>
                  Enter manually
                </Text>
              </TouchableOpacity>

              {errorDetails?.canRetry && !errorDetails?.isRetrying && (
                <TouchableOpacity
                  onPress={handleRetryLocation}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                    backgroundColor: COLORS.background,
                    flex: 1,
                    minWidth: 120,
                  }}
                >
                  <Text style={{
                    fontSize: 14,
                    color: COLORS.textSecondary,
                    textAlign: 'center',
                  }}>
                    Try again
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {errorDetails?.finalError && (
              <Text style={{
                fontSize: 12,
                color: '#DC2626',
                textAlign: 'center',
                marginTop: 12,
                fontStyle: 'italic',
              }}>
                Max retry attempts reached. Please enter location manually.
              </Text>
            )}
          </View>
        );

      case 'permission_denied':
        return (
          <View style={{
            backgroundColor: '#FEF2F2',
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: '#FECACA',
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 12,
            }}>
              <Text style={{ fontSize: 20, marginRight: 8 }}>🔒</Text>
              <Text style={{
                fontSize: 16,
                fontWeight: '500',
                color: COLORS.text,
              }}>
                Location Permission Required
              </Text>
            </View>
            
            <Text style={{
              fontSize: 14,
              color: COLORS.textSecondary,
              marginBottom: 16,
              lineHeight: 20,
            }}>
              {errorDetails?.message || 'Location access is needed to automatically detect your location.'}
            </Text>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 8,
            }}>
              <TouchableOpacity
                onPress={handleManualMode}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  backgroundColor: COLORS.accent,
                  flex: 1,
                  minWidth: 120,
                }}
              >
                <Text style={{
                  fontSize: 14,
                  color: COLORS.background,
                  fontWeight: '500',
                  textAlign: 'center',
                }}>
                  Enter manually
                </Text>
              </TouchableOpacity>

              {errorDetails?.canRetry && (
                <TouchableOpacity
                  onPress={handleRetryLocation}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                    backgroundColor: COLORS.background,
                    flex: 1,
                    minWidth: 120,
                  }}
                >
                  <Text style={{
                    fontSize: 14,
                    color: COLORS.textSecondary,
                    textAlign: 'center',
                  }}>
                    Grant permission
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        );

      case 'timeout':
        return (
          <View style={{
            backgroundColor: '#FEF2F2',
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: '#FECACA',
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 12,
            }}>
              <Text style={{ fontSize: 20, marginRight: 8 }}>⏱️</Text>
              <Text style={{
                fontSize: 16,
                fontWeight: '500',
                color: COLORS.text,
              }}>
                Location Detection Timeout
              </Text>
            </View>
            
            <Text style={{
              fontSize: 14,
              color: COLORS.textSecondary,
              marginBottom: 16,
              lineHeight: 20,
            }}>
              Location detection is taking longer than expected. This might be due to weak GPS signal or network issues.
            </Text>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 8,
            }}>
              <TouchableOpacity
                onPress={handleManualMode}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  backgroundColor: COLORS.accent,
                  flex: 1,
                  minWidth: 120,
                }}
              >
                <Text style={{
                  fontSize: 14,
                  color: COLORS.background,
                  fontWeight: '500',
                  textAlign: 'center',
                }}>
                  Enter manually
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleRetryLocation}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  backgroundColor: COLORS.background,
                  flex: 1,
                  minWidth: 120,
                }}
              >
                <Text style={{
                  fontSize: 14,
                  color: COLORS.textSecondary,
                  textAlign: 'center',
                }}>
                  Try again
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      default:
        return (
          <View style={{
            backgroundColor: COLORS.surface,
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: COLORS.border,
          }}>
            <Text style={{
              fontSize: 24,
              marginBottom: 12,
            }}>📍</Text>
            <Text style={{
              fontSize: 16,
              fontWeight: '500',
              color: COLORS.text,
              marginBottom: 8,
              textAlign: 'center',
            }}>
              Find better matches nearby
            </Text>
            <Text style={{
              fontSize: 14,
              color: COLORS.textSecondary,
              marginBottom: 16,
              textAlign: 'center',
              lineHeight: 20,
            }}>
              We can automatically detect your location to show you matches in your area.
            </Text>
            
            <TouchableOpacity
              onPress={() => detectLocation()}
              disabled={isDetecting}
              style={{
                backgroundColor: isDetecting ? COLORS.textTertiary : COLORS.accent,
                paddingHorizontal: 32,
                paddingVertical: 12,
                borderRadius: 24, // ALWAYS 24px for buttons
                marginBottom: 8,
                shadowColor: COLORS.accent,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: isDetecting ? 0 : 0.2,
                shadowRadius: 8,
                elevation: isDetecting ? 0 : 4,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isDetecting && <PremiumSpinner size="small" color={COLORS.background} />}
              <Text style={{
                color: COLORS.background,
                fontSize: 14,
                fontWeight: '500',
                letterSpacing: 0.5,
                textAlign: 'center',
                marginLeft: isDetecting ? 8 : 0,
              }}>
                {isDetecting ? 'Detecting...' : 'Detect my location'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleManualMode}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
              }}
            >
              <Text style={{
                fontSize: 14,
                color: COLORS.textSecondary,
              }}>
                Enter manually instead
              </Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  const renderManualInputs = () => {
    if (locationStatus !== 'manual' && locationStatus !== 'success') {
      return null;
    }

    return (
      <View>
        <FormInput
          label={t('location.country')}
          required={required}
          value={values.country || ''}
          onChangeText={(value) => handleManualInput('country', value)}
          placeholder={t('location.countryPlaceholder')}
        />

        <FormInput
          label={t('location.city')}
          required={required}
          value={values.city || ''}
          onChangeText={(value) => handleManualInput('city', value)}
          placeholder={t('location.cityPlaceholder')}
        />

        <FormInput
          label={t('location.region')}
          required={false}
          value={values.region || ''}
          onChangeText={(value) => handleManualInput('region', value)}
          placeholder={t('location.regionPlaceholder')}
        />

        <FormInput
          label={t('location.district')}
          required={false}
          value={values.district || ''}
          onChangeText={(value) => handleManualInput('district', value)}
          placeholder={t('location.districtPlaceholder')}
        />
      </View>
    );
  };

  return (
    <View>
      {renderLocationStatus()}
      {renderManualInputs()}
    </View>
  );
};