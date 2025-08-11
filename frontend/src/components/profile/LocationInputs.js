/**
 * BLONG Location Input Components
 * Simple location inputs with dynamic data loading
 */

import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { FormDropdown, FormInput } from './FormComponents';
import { locationService } from '../../services/locationService';

export const LocationInputs = ({ 
  values = {}, 
  onLocationChange,
  required = true 
}) => {
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load countries on mount
  useEffect(() => {
    loadCountries();
  }, []);

  // Load regions when country changes
  useEffect(() => {
    if (values.country) {
      loadRegions(values.country);
    } else {
      setRegions([]);
      setCities([]);
    }
  }, [values.country]);

  // Load cities when region changes
  useEffect(() => {
    if (values.country && values.region) {
      loadCities(values.country, values.region);
    } else if (values.country && !values.region) {
      // Load all cities for country if no region selected
      loadCities(values.country, null);
    } else {
      setCities([]);
    }
  }, [values.country, values.region]);

  const loadCountries = async () => {
    setLoading(true);
    try {
      // Use static data for now - more reliable
      const staticCountries = [
        'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany',
        'France', 'Italy', 'Spain', 'Netherlands', 'Sweden', 'UAE', 'Saudi Arabia',
        'India', 'Japan', 'South Korea', 'Singapore', 'Brazil', 'Mexico', 'Argentina',
        'South Africa', 'Egypt', 'Morocco', 'Nigeria', 'Kenya', 'Turkey', 'Russia',
        'China', 'Thailand', 'Malaysia', 'Indonesia', 'Philippines', 'Vietnam'
      ];
      setCountries(staticCountries.sort());
    } catch (error) {
      console.error('Error loading countries:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRegions = async (countryName) => {
    setLoading(true);
    try {
      // Static regions/states data for major countries
      const regionData = {
        'United States': ['California', 'New York', 'Texas', 'Florida', 'Illinois', 'Pennsylvania', 'Ohio', 'Georgia', 'North Carolina', 'Michigan'],
        'Canada': ['Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba', 'Saskatchewan', 'Nova Scotia', 'New Brunswick', 'Newfoundland and Labrador', 'Prince Edward Island'],
        'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
        'Australia': ['New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'South Australia', 'Tasmania', 'Australian Capital Territory', 'Northern Territory'],
        'Germany': ['Bavaria', 'North Rhine-Westphalia', 'Baden-Württemberg', 'Lower Saxony', 'Hesse', 'Saxony', 'Rhineland-Palatinate', 'Schleswig-Holstein'],
        'France': ['Île-de-France', 'Auvergne-Rhône-Alpes', 'Hauts-de-France', 'Occitanie', 'Nouvelle-Aquitaine', 'Grand Est', 'Provence-Alpes-Côte d\'Azur', 'Pays de la Loire'],
        'India': ['Maharashtra', 'Uttar Pradesh', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'West Bengal', 'Rajasthan', 'Andhra Pradesh', 'Telangana', 'Kerala'],
        'UAE': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Fujairah', 'Ras Al Khaimah', 'Umm Al Quwain']
      };

      const regions = regionData[countryName] || [];
      setRegions(regions);
    } catch (error) {
      console.error('Error loading regions:', error);
      setRegions([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCities = async (countryName, regionName = null) => {
    setLoading(true);
    try {
      // Static cities data for major countries and regions
      const cityData = {
        'United States': {
          'California': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'San Jose', 'Fresno', 'Long Beach', 'Oakland', 'Bakersfield', 'Anaheim'],
          'New York': ['New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse', 'Albany', 'New Rochelle', 'Mount Vernon', 'Schenectady', 'Utica'],
          'Texas': ['Houston', 'San Antonio', 'Dallas', 'Austin', 'Fort Worth', 'El Paso', 'Arlington', 'Corpus Christi', 'Plano', 'Lubbock'],
          'Florida': ['Jacksonville', 'Miami', 'Tampa', 'Orlando', 'St. Petersburg', 'Hialeah', 'Tallahassee', 'Fort Lauderdale', 'Port St. Lucie', 'Cape Coral']
        },
        'Canada': {
          'Ontario': ['Toronto', 'Ottawa', 'Hamilton', 'London', 'Kitchener', 'Windsor', 'Oshawa', 'Barrie', 'Kingston', 'Guelph'],
          'Quebec': ['Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Longueuil', 'Sherbrooke', 'Saguenay', 'Lévis', 'Trois-Rivières', 'Terrebonne'],
          'British Columbia': ['Vancouver', 'Victoria', 'Surrey', 'Burnaby', 'Richmond', 'Abbotsford', 'Coquitlam', 'Kelowna', 'Saanich', 'Langley']
        },
        'United Kingdom': {
          'England': ['London', 'Birmingham', 'Manchester', 'Liverpool', 'Leeds', 'Sheffield', 'Bristol', 'Newcastle', 'Nottingham', 'Leicester'],
          'Scotland': ['Glasgow', 'Edinburgh', 'Aberdeen', 'Dundee', 'Stirling', 'Perth', 'Inverness', 'Paisley', 'East Kilbride', 'Hamilton'],
          'Wales': ['Cardiff', 'Swansea', 'Newport', 'Wrexham', 'Barry', 'Caerphilly', 'Bridgend', 'Neath', 'Port Talbot', 'Cwmbran']
        },
        'UAE': {
          'Dubai': ['Dubai City', 'Deira', 'Bur Dubai', 'Jumeirah', 'Marina', 'Downtown Dubai', 'Business Bay', 'DIFC', 'JLT', 'Palm Jumeirah'],
          'Abu Dhabi': ['Abu Dhabi City', 'Al Ain', 'Ruwais', 'Madinat Zayed', 'Liwa', 'Ghayathi', 'Mirfa', 'Sila', 'Delma', 'Zirku'],
          'Sharjah': ['Sharjah City', 'Khorfakkan', 'Kalba', 'Dibba Al-Hisn', 'Mleiha', 'Al Dhaid', 'Al Madam', 'Hamriyah', 'Al Batayeh', 'Al Suyoh']
        }
      };

      let cities = [];
      if (regionName && cityData[countryName] && cityData[countryName][regionName]) {
        cities = cityData[countryName][regionName];
      } else if (cityData[countryName]) {
        // If no region specified, get all cities from all regions
        cities = Object.values(cityData[countryName]).flat();
      } else {
        // Default cities for countries not in our data
        cities = [`${countryName} City`, `Capital of ${countryName}`, `Major City 1`, `Major City 2`, `Major City 3`];
      }

      setCities(cities);
    } catch (error) {
      console.error('Error loading cities:', error);
      setCities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCountryChange = (country) => {
    onLocationChange({
      ...values,
      country,
      region: '', // Reset region when country changes
      city: '',   // Reset city when country changes
      district: '', // Reset district when country changes
      postalCode: values.postalCode || '' // Keep postal code
    });
  };

  const handleRegionChange = (region) => {
    onLocationChange({
      ...values,
      region,
      city: '',   // Reset city when region changes
      district: '' // Reset district when region changes
    });
  };

  const handleCityChange = (city) => {
    onLocationChange({
      ...values,
      city,
      district: '' // Reset district when city changes
    });
  };

  const handleDistrictChange = (district) => {
    onLocationChange({
      ...values,
      district
    });
  };

  const handlePostalCodeChange = (postalCode) => {
    onLocationChange({
      ...values,
      postalCode
    });
  };

  return (
    <View>
      {/* Country Selection */}
      <FormDropdown
        label="Country"
        required={required}
        value={values.country || ''}
        onSelect={handleCountryChange}
        options={countries}
        placeholder="Select your country"
      />

      {/* Region/State Selection */}
      {values.country && (
        <FormDropdown
          label="Region/State"
          required={false}
          value={values.region || ''}
          onSelect={handleRegionChange}
          options={regions}
          placeholder={regions.length > 0 ? "Select your region/state" : "No regions available"}
        />
      )}

      {/* City Selection */}
      {values.country && (
        <FormDropdown
          label="City"
          required={required}
          value={values.city || ''}
          onSelect={handleCityChange}
          options={cities}
          placeholder={cities.length > 0 ? "Select your city" : "No cities available"}
        />
      )}

      {/* District/Neighborhood */}
      {values.city && (
        <FormInput
          label="District/Neighborhood"
          required={false}
          value={values.district || ''}
          onChangeText={handleDistrictChange}
          placeholder="Enter your district or neighborhood (optional)"
        />
      )}

      {/* Postal Code */}
      {values.city && (
        <FormInput
          label="Postal Code"
          required={false}
          value={values.postalCode || ''}
          onChangeText={handlePostalCodeChange}
          placeholder="Enter postal code (optional)"
          keyboardType="default"
        />
      )}
    </View>
  );
};
