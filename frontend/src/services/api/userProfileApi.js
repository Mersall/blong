/**
 * BLONG User Profile API Service
 * React Query integration for user profile and questionnaire functionality
 */

import { useQuery, useMutation } from '@tanstack/react-query';
import { queryKeys, cacheUtils } from '../../config/reactQueryConfig';
import { useQueryWithLoading, useMutationWithLoading } from '../../hooks/useQueryWithLoading';
import { LOADING_TYPES } from '../../contexts/LoadingContext';
import { apiClient } from '../api';

// User Profile API functions using existing apiClient
export const userProfileApi = {
  getUserProfile: async () => {
    return await apiClient.request('/profile');
  },

  updateUserProfile: async (data) => {
    return await apiClient.request('/profile', {
      method: 'PUT',
      body: data
    });
  },

  getQuestionnaireData: async (phase) => {
    // TODO: Create backend endpoint for questionnaire data
    return await apiClient.request(`/questionnaire/${phase}`);
  },

  getQuestionnaireAnswers: async (phase) => {
    // TODO: Create backend endpoint for questionnaire answers
    return await apiClient.request(`/questionnaire/${phase}/answers`);
  },

  saveQuestionnaireAnswers: async (phase, answers) => {
    // TODO: Create backend endpoint for saving questionnaire answers
    return await apiClient.request(`/questionnaire/${phase}/answers`, {
      method: 'POST',
      body: { answers }
    });
  },

  getCompletionStatus: async () => {
    return await apiClient.request('/profile/completion-status');
  },

  getUserPreferences: async () => {
    return await apiClient.request('/profile/preferences');
  },

  updateUserPreferences: async (data) => {
    return await apiClient.request('/profile/preferences', {
      method: 'PUT',
      body: data
    });
  },

  getUserAnalytics: async () => {
    return await apiClient.request('/profile/analytics');
  },

  updateUserPhase: async (phase) => {
    // TODO: Create backend endpoint for updating user phase
    return await apiClient.request('/profile/phase', {
      method: 'PUT',
      body: { phase }
    });
  },

  getOnboardingStatus: async () => {
    // TODO: Create backend endpoint for onboarding status
    return await apiClient.request('/onboarding-status');
  },

  updateOnboardingStatus: async (completed) => {
    // TODO: Create backend endpoint for updating onboarding status
    return await apiClient.request('/onboarding-status', {
      method: 'PUT',
      body: { completed }
    });
  },
};

// React Query Hooks for User Profile

/**
 * Get user profile
 */
export const useUserProfile = (options = {}) => {
  return useQueryWithLoading({
    queryKey: queryKeys.user.profile(),
    queryFn: userProfileApi.getUserProfile,
    loadingType: LOADING_TYPES.SCREEN,
    loadingMessage: 'Loading your profile...',
    loadingSubtitle: 'Preparing your information',
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
    ...options,
  });
};

/**
 * Update user profile mutation
 */
export const useUpdateUserProfile = () => {
  return useMutationWithLoading({
    mutationFn: userProfileApi.updateUserProfile,
    loadingMessage: 'Updating your profile...',
    loadingSubtitle: 'Saving your changes',
    onSuccess: () => {
      // Invalidate profile and completion status
      cacheUtils.invalidateQueries(queryKeys.user.profile());
      cacheUtils.invalidateQueries(queryKeys.user.all.concat('completion-status'));
    },
  });
};

/**
 * Get questionnaire data for specific phase
 */
export const useQuestionnaireData = (phase) => {
  return useQuery({
    queryKey: queryKeys.user.questionnaire(phase),
    queryFn: () => userProfileApi.getQuestionnaireData(phase),
    enabled: !!phase,
    staleTime: 30 * 60 * 1000, // 30 minutes - questionnaire structure doesn't change often
    cacheTime: 60 * 60 * 1000, // 1 hour
  });
};

/**
 * Get user's questionnaire answers for specific phase
 */
export const useQuestionnaireAnswers = (phase) => {
  return useQueryWithLoading({
    queryKey: queryKeys.user.all.concat('answers', phase),
    queryFn: () => userProfileApi.getQuestionnaireAnswers(phase),
    loadingType: LOADING_TYPES.INLINE,
    loadingMessage: 'Loading your answers...',
    enabled: !!phase,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Save questionnaire answers mutation
 */
export const useSaveQuestionnaireAnswers = () => {
  return useMutationWithLoading({
    mutationFn: ({ phase, answers }) => 
      userProfileApi.saveQuestionnaireAnswers(phase, answers),
    loadingMessage: 'Saving your answers...',
    loadingSubtitle: 'Updating your profile',
    onSuccess: (data, { phase }) => {
      // Invalidate answers and completion status
      cacheUtils.invalidateQueries(queryKeys.user.all.concat('answers', phase));
      cacheUtils.invalidateQueries(queryKeys.user.all.concat('completion-status'));
      cacheUtils.invalidateQueries(queryKeys.user.profile());
    },
  });
};

/**
 * Get profile completion status
 */
export const useCompletionStatus = () => {
  return useQueryWithLoading({
    queryKey: queryKeys.user.all.concat('completion-status'),
    queryFn: userProfileApi.getCompletionStatus,
    loadingType: LOADING_TYPES.INLINE,
    loadingMessage: 'Checking completion status...',
    staleTime: 1 * 60 * 1000, // 1 minute
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Get user preferences
 */
export const useUserPreferences = () => {
  return useQueryWithLoading({
    queryKey: queryKeys.user.preferences(),
    queryFn: userProfileApi.getUserPreferences,
    loadingType: LOADING_TYPES.INLINE,
    loadingMessage: 'Loading preferences...',
    staleTime: 5 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
  });
};

/**
 * Update user preferences mutation
 */
export const useUpdateUserPreferences = () => {
  return useMutationWithLoading({
    mutationFn: userProfileApi.updateUserPreferences,
    loadingMessage: 'Updating preferences...',
    onSuccess: () => {
      // Invalidate preferences
      cacheUtils.invalidateQueries(queryKeys.user.preferences());
    },
  });
};

/**
 * Get user analytics
 */
export const useUserAnalytics = () => {
  return useQuery({
    queryKey: queryKeys.user.all.concat('analytics'),
    queryFn: userProfileApi.getUserAnalytics,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};

/**
 * Update user phase mutation
 */
export const useUpdateUserPhase = () => {
  return useMutationWithLoading({
    mutationFn: userProfileApi.updateUserPhase,
    loadingMessage: 'Updating your phase...',
    onSuccess: () => {
      // Invalidate profile and related data
      cacheUtils.invalidateQueries(queryKeys.user.profile());
      cacheUtils.invalidateQueries(queryKeys.user.all.concat('completion-status'));
    },
  });
};

/**
 * Get onboarding status
 */
export const useOnboardingStatus = () => {
  return useQuery({
    queryKey: queryKeys.user.all.concat('onboarding-status'),
    queryFn: userProfileApi.getOnboardingStatus,
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Update onboarding status mutation
 */
export const useUpdateOnboardingStatus = () => {
  return useMutationWithLoading({
    mutationFn: userProfileApi.updateOnboardingStatus,
    loadingMessage: 'Updating onboarding status...',
    onSuccess: () => {
      // Invalidate onboarding status
      cacheUtils.invalidateQueries(queryKeys.user.all.concat('onboarding-status'));
    },
  });
};

// Utility functions for cache management
export const userProfileCache = {
  // Get cached profile data
  getCachedProfile: () => {
    return cacheUtils.getQueryData(queryKeys.user.profile());
  },

  // Set profile data in cache
  setCachedProfile: (data) => {
    return cacheUtils.setQueryData(queryKeys.user.profile(), data);
  },

  // Get cached preferences
  getCachedPreferences: () => {
    return cacheUtils.getQueryData(queryKeys.user.preferences());
  },

  // Invalidate all user-related cache
  invalidateAll: () => {
    return cacheUtils.invalidateQueries(queryKeys.user.all);
  },

  // Prefetch questionnaire data
  prefetchQuestionnaire: (phase) => {
    return cacheUtils.prefetchQuery({
      queryKey: queryKeys.user.questionnaire(phase),
      queryFn: () => userProfileApi.getQuestionnaireData(phase),
      staleTime: 30 * 60 * 1000,
    });
  },
};

export default userProfileApi;
