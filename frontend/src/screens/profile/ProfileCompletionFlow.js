/**
 * BLONG Clean Profile Completion Flow
 * Simplified wrapper for the new profile completion system
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLoadingContext } from '../../contexts/LoadingContext';
import { useErrorModal } from '../../contexts/ErrorModalContext';
import { useSuccessMessage } from '../../contexts/SuccessMessageContext';
import { apiService } from '../../services/apiService';
import { handleErrorWithLogging, showSuccessAlert } from '../../utils/errorCommunication';
import SimplifiedProfileCompletion from './SimplifiedProfileCompletion';

const ProfileCompletionFlow = ({ onComplete }) => {
  const { t } = useTranslation();
  const { showLoading, hideLoading } = useLoadingContext();
  const { showNetworkError, showValidationError, showServerError } = useErrorModal();
  const { showProfileSuccess } = useSuccessMessage();

  const handleProfileComplete = async (profileData) => {
    try {
      console.log('🚀 Starting profile completion process...');
      showLoading('Saving your profile...');

      // Transform data for backend
      const cleanedData = {
        dateOfBirth: profileData.dateOfBirth ? profileData.dateOfBirth.toISOString().split('T')[0] : null,
        gender: profileData.gender,
        location: profileData.location,
        occupation: profileData.occupation,
        education: profileData.education,
        maritalStatus: profileData.maritalStatus,
        smoking: profileData.smoking,
        drinking: profileData.drinking,
        height: profileData.height ? parseInt(profileData.height) : null,
        interests: profileData.interests || [],
        languages: profileData.languages || [],
      };

      console.log('📤 Submitting profile data:', cleanedData);

      const response = await apiService.put('/profile/complete', cleanedData);
      console.log('📥 Received response from backend:', response);

      // Backend returns the profile data directly, not wrapped in success object
      if (response.data) {
        console.log('✅ Profile saved successfully:', response.data);

        // Hide loading immediately
        hideLoading();

        // Show brief success message using the existing success context
        showProfileSuccess('🎉 Profile completed successfully! Welcome to BLONG!');

        // Force redirect immediately - don't wait for completion status check
        console.log('🚀 Profile save successful - redirecting to home immediately');
        onComplete(response.data);

        return; // Exit early to avoid finally block
      } else {
        throw new Error('Failed to save profile - no data returned');
      }
    } catch (error) {
      // Use comprehensive error communication system
      handleErrorWithLogging(
        error,
        {
          operation: 'profile_save',
          screen: 'ProfileCompletion',
          userId: 'current_user' // Could be passed from context
        },
        () => {
          // Retry action
          handleProfileComplete(profileData);
        }
      );
    } finally {
      hideLoading();
    }
  };

  return <SimplifiedProfileCompletion onComplete={handleProfileComplete} />;
};

export default ProfileCompletionFlow;
