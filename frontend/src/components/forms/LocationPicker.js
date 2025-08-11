/**
 * BLONG Enhanced Location Picker Component
 * Dynamic location selection with country → region → city → postal code
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { locationService } from '../../services/locationService';

const LocationPicker = ({ 
  label, 
  required = false, 
  value = {}, 
  onLocationChange,
  placeholder = "Select location",
  colors = {
    background: '#FFFFFF',
    surface: '#FAFAFA',
    text: '#0A0A0A',
    textSecondary: '#6B6B6B',
    accent: '#FF6B35',
    border: '#E0E0E0'
  }
}) => {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState('country'); // country, region, city, postal
  const [loading, setLoading] = useState(false);
  
  // Data states
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  
  // Selection states
  const [selectedCountry, setSelectedCountry] = useState(value.country || null);
  const [selectedRegion, setSelectedRegion] = useState(value.region || null);
  const [selectedCity, setSelectedCity] = useState(value.city || null);
  const [postalCode, setPostalCode] = useState(value.postalCode || '');
  
  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    setLoading(true);
    try {
      const countriesData = await locationService.getCountries();
      setCountries(countriesData);
    } catch (error) {
      console.error('Error loading countries:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRegions = async (countryCode) => {
    setLoading(true);
    try {
      const regionsData = await locationService.getRegions(countryCode);
      setRegions(regionsData);
    } catch (error) {
      console.error('Error loading regions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCities = async (countryCode, regionCode = null) => {
    setLoading(true);
    try {
      const citiesData = await locationService.getCities(countryCode, regionCode);
      setCities(citiesData);
    } catch (error) {
      console.error('Error loading cities:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchPlaces = async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const results = await locationService.searchPlaces(query, selectedCountry?.code);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching places:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCountrySelect = async (country) => {
    setSelectedCountry(country);
    setSelectedRegion(null);
    setSelectedCity(null);
    setPostalCode('');
    setShowModal(false);

    // Small delay for better UX
    setTimeout(async () => {
      await loadRegions(country.code);
      setStep('region');
      setShowModal(true);
    }, 300);
  };

  const handleRegionSelect = async (region) => {
    setSelectedRegion(region);
    setSelectedCity(null);
    setPostalCode('');
    setShowModal(false);

    // Small delay for better UX
    setTimeout(async () => {
      await loadCities(selectedCountry.code, region.code);
      setStep('city');
      setShowModal(true);
    }, 300);
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setShowModal(false);

    // Small delay for better UX
    setTimeout(() => {
      setStep('postal');
      setShowModal(true);
    }, 300);
  };

  const handleComplete = () => {
    const locationData = {
      country: selectedCountry,
      region: selectedRegion,
      city: selectedCity,
      postalCode: postalCode.trim(),
      coordinates: selectedCity ? {
        latitude: selectedCity.latitude,
        longitude: selectedCity.longitude
      } : null
    };

    onLocationChange(locationData);
    setShowModal(false);
  };

  const validatePostalCode = (code) => {
    if (!selectedCountry) return true;
    return locationService.validatePostalCode(code, selectedCountry.code);
  };

  const getDisplayText = () => {
    if (!selectedCountry) return placeholder;

    let text = selectedCountry.flag + ' ' + selectedCountry.name;
    if (selectedRegion) text += `, ${selectedRegion.name}`;
    if (selectedCity) text += `, ${selectedCity.name}`;
    if (postalCode) text += ` ${postalCode}`;

    return text;
  };

  const resetSelection = () => {
    setSelectedCountry(null);
    setSelectedRegion(null);
    setSelectedCity(null);
    setPostalCode('');
    setStep('country');
  };

  const renderCountryStep = () => (
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 18, fontWeight: '300', color: colors.text, marginBottom: 16 }}>
        Select Country
      </Text>
      
      <TextInput
        style={{
          backgroundColor: colors.surface,
          borderRadius: 8,
          padding: 16,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: colors.border,
          fontSize: 16,
          color: colors.text
        }}
        placeholder="Search countries..."
        placeholderTextColor={colors.textSecondary}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <ScrollView style={{ flex: 1 }}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 32 }} />
        ) : (
          countries
            .filter(country => 
              !searchQuery || 
              country.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((country, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 16,
                  backgroundColor: colors.surface,
                  borderRadius: 8,
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: colors.border
                }}
                onPress={() => handleCountrySelect(country)}
              >
                <Text style={{ fontSize: 24, marginRight: 12 }}>{country.flag}</Text>
                <Text style={{ fontSize: 16, color: colors.text, flex: 1 }}>
                  {country.name}
                </Text>
              </TouchableOpacity>
            ))
        )}
      </ScrollView>
    </View>
  );

  const renderRegionStep = () => (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}
        onPress={() => setStep('country')}
      >
        <Text style={{ fontSize: 16, color: colors.accent }}>← Back</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 18, fontWeight: '300', color: colors.text, marginBottom: 16 }}>
        Select Region/State in {selectedCountry?.name}
      </Text>

      <ScrollView style={{ flex: 1 }}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 32 }} />
        ) : regions.length === 0 ? (
          <View>
            <Text style={{
              fontSize: 14,
              color: colors.textSecondary,
              textAlign: 'center',
              marginBottom: 16,
              lineHeight: 20
            }}>
              No regions found for {selectedCountry?.name}. We'll show all cities instead.
            </Text>
            <TouchableOpacity
              style={{
                padding: 16,
                backgroundColor: colors.accent,
                borderRadius: 8,
                alignItems: 'center'
              }}
              onPress={() => {
                setSelectedRegion(null);
                setShowModal(false);
                setTimeout(async () => {
                  await loadCities(selectedCountry.code);
                  setStep('city');
                  setShowModal(true);
                }, 300);
              }}
            >
              <Text style={{ fontSize: 16, color: colors.background, fontWeight: '500' }}>
                Continue to Cities
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          regions.map((region, index) => (
            <TouchableOpacity
              key={index}
              style={{
                padding: 16,
                backgroundColor: colors.surface,
                borderRadius: 8,
                marginBottom: 8,
                borderWidth: 1,
                borderColor: colors.border
              }}
              onPress={() => handleRegionSelect(region)}
            >
              <Text style={{ fontSize: 16, color: colors.text }}>
                {region.name}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );

  const renderCityStep = () => (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}
        onPress={() => setStep('region')}
      >
        <Text style={{ fontSize: 16, color: colors.accent }}>← Back</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 18, fontWeight: '300', color: colors.text, marginBottom: 16 }}>
        Select City in {selectedRegion ? `${selectedRegion.name}, ` : ''}{selectedCountry?.name}
      </Text>

      <TextInput
        style={{
          backgroundColor: colors.surface,
          borderRadius: 8,
          padding: 16,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: colors.border,
          fontSize: 16,
          color: colors.text
        }}
        placeholder="Search cities..."
        placeholderTextColor={colors.textSecondary}
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          searchPlaces(text);
        }}
      />

      <ScrollView style={{ flex: 1 }}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 32 }} />
        ) : (
          (searchQuery ? searchResults : cities).map((city, index) => (
            <TouchableOpacity
              key={index}
              style={{
                padding: 16,
                backgroundColor: colors.surface,
                borderRadius: 8,
                marginBottom: 8,
                borderWidth: 1,
                borderColor: colors.border
              }}
              onPress={() => handleCitySelect(city)}
            >
              <Text style={{ fontSize: 16, color: colors.text, fontWeight: '300' }}>
                {city.name}
              </Text>
              {city.region && (
                <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 4 }}>
                  {city.region}, {city.country}
                </Text>
              )}
              {city.population && (
                <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>
                  Population: {city.population.toLocaleString()}
                </Text>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );

  const renderPostalStep = () => (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}
        onPress={() => setStep('city')}
      >
        <Text style={{ fontSize: 16, color: colors.accent }}>← Back</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 18, fontWeight: '300', color: colors.text, marginBottom: 8 }}>
        Postal Code (Optional)
      </Text>

      <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 16 }}>
        {selectedCity?.name}, {selectedRegion?.name}, {selectedCountry?.name}
      </Text>

      <TextInput
        style={{
          backgroundColor: colors.surface,
          borderRadius: 8,
          padding: 16,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: validatePostalCode(postalCode) ? colors.border : colors.accent,
          fontSize: 16,
          color: colors.text
        }}
        placeholder="Enter postal code (optional)"
        placeholderTextColor={colors.textSecondary}
        value={postalCode}
        onChangeText={setPostalCode}
        autoCapitalize="characters"
      />

      {postalCode && !validatePostalCode(postalCode) && (
        <Text style={{ fontSize: 12, color: colors.accent, marginBottom: 16 }}>
          Invalid postal code format for {selectedCountry?.name}
        </Text>
      )}

      <TouchableOpacity
        style={{
          backgroundColor: colors.accent,
          borderRadius: 8,
          padding: 16,
          alignItems: 'center',
          marginTop: 24
        }}
        onPress={handleComplete}
      >
        <Text style={{ fontSize: 16, color: colors.background, fontWeight: '500' }}>
          Complete Location Selection
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{
        fontSize: 14,
        fontWeight: '300',
        color: colors.text,
        marginBottom: 8,
        letterSpacing: 0.5
      }}>
        {label} {required && <Text style={{ color: colors.accent }}>*</Text>}
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          style={{
            backgroundColor: colors.surface,
            borderRadius: 8,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.border,
            minHeight: 56,
            flex: 1,
            marginRight: value.country ? 8 : 0
          }}
          onPress={() => {
            if (value.country) {
              // If location is already selected, restart from country selection
              resetSelection();
            }
            setShowModal(true);
          }}
        >
          <Text style={{
            fontSize: 16,
            color: value.country ? colors.text : colors.textSecondary
          }}>
            {getDisplayText()}
          </Text>
        </TouchableOpacity>

        {value.country && (
          <TouchableOpacity
            style={{
              backgroundColor: colors.accent,
              borderRadius: 8,
              padding: 16,
              minHeight: 56,
              justifyContent: 'center',
              alignItems: 'center',
              width: 80
            }}
            onPress={() => {
              resetSelection();
              setShowModal(true);
            }}
          >
            <Text style={{ fontSize: 14, color: colors.background, fontWeight: '500' }}>
              Change
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={{ flex: 1, backgroundColor: colors.background, padding: 24, paddingTop: 60 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={{ fontSize: 16, color: colors.accent }}>Cancel</Text>
            </TouchableOpacity>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: '300', color: colors.text }}>
                {step === 'country' && 'Select Country'}
                {step === 'region' && 'Select Region'}
                {step === 'city' && 'Select City'}
                {step === 'postal' && 'Postal Code'}
              </Text>
              <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>
                Step {step === 'country' ? '1' : step === 'region' ? '2' : step === 'city' ? '3' : '4'} of 4
              </Text>
            </View>
            {step === 'postal' ? (
              <TouchableOpacity onPress={handleComplete}>
                <Text style={{ fontSize: 16, color: colors.accent, fontWeight: '500' }}>Done</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ width: 50 }} />
            )}
          </View>

          {step === 'country' && renderCountryStep()}
          {step === 'region' && renderRegionStep()}
          {step === 'city' && renderCityStep()}
          {step === 'postal' && renderPostalStep()}
        </View>
      </Modal>
    </View>
  );
};

export default LocationPicker;
