import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get user profile with all related data
   */
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        gender: true,
        phone: true,
        profilePicture: true,
        isVerified: true,
        verificationStatus: true,
        relationshipStatus: true,
        createdAt: true,
        // profile: true,
        // preferences: true,
        // personalityProfile: true,
        // photos: {
        //   orderBy: { order: 'asc' },
        // },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, profileData: any) {
    // Separate User model fields from UserProfile model fields
    const userFields = ['firstName', 'lastName', 'dateOfBirth', 'gender', 'phone', 'profilePicture', 'relationshipStatus'];
    const profileFields = ['bio', 'height', 'education', 'occupation', 'city', 'country', 'latitude', 'longitude',
                          'interests', 'smoking', 'drinking', 'exercise', 'diet', 'maritalStatus', 'hasChildren',
                          'wantsChildren', 'familyValues', 'religion', 'religiosity', 'prayerFrequency', 'ethnicity',
                          'languages', 'salaryMax', 'salaryMin', 'weight', 'bodyType', 'skinTone', 'eyeColor',
                          'hairColor', 'personalityType', 'zodiacSign', 'motherTongue', 'spokenLanguages',
                          'educationLevel', 'fieldOfStudy', 'workExperience', 'annualIncome', 'workLocation',
                          'hobbies', 'sportsActivities', 'musicPreferences', 'lifeGoals', 'values', 'dealBreakers',
                          'familySize', 'siblingCount', 'livingArrangement', 'communicationStyle', 'conflictResolution',
                          'loveLanguagePrimary', 'relationshipGoals', 'marriageTimeline', 'relocateWillingness',
                          'careerPriority', 'workLifeBalance', 'financialGoals', 'politicalViews', 'culturalBackground',
                          'traditionImportance', 'parentingStyle', 'fitnessLevel', 'socialCircle', 'attachmentStyle',
                          'humorStyle', 'adaptability', 'planningStyle', 'cookingSkills', 'technologyComfort',
                          'learningStyle', 'careerAmbitions', 'lifePhilosophy', 'personalMotto', 'futureAspirations',
                          'goalsFor1Year', 'goalsFor5Years', 'familyTraditions', 'neighborhoodPreference',
                          'climatePreference', 'healthcarePreferences', 'spiritualPractices', 'moralValues',
                          'emotionalIntelligence', 'empathyLevel', 'optimismLevel', 'flexibilityLevel'];

    const userData: any = {};
    const profileInfo: any = {};

    // Separate fields based on their model
    Object.keys(profileData).forEach(key => {
      if (key === 'profile' && typeof profileData[key] === 'object') {
        // If profile is nested, merge it with profileInfo
        Object.assign(profileInfo, profileData[key]);
      } else if (userFields.includes(key)) {
        userData[key] = profileData[key];
      } else if (profileFields.includes(key)) {
        profileInfo[key] = profileData[key];
      }
    });

    // Extract location data if present
    if (profileData.location && typeof profileData.location === 'object') {
      console.log('Extracting location data:', JSON.stringify(profileData.location, null, 2));

      if (profileData.location.city) {
        profileInfo.city = profileData.location.city;
      }
      if (profileData.location.country) {
        profileInfo.country = profileData.location.country;
      }
      if (profileData.location.latitude) {
        profileInfo.latitude = profileData.location.latitude;
      }
      if (profileData.location.longitude) {
        profileInfo.longitude = profileData.location.longitude;
      }

      console.log('Location data extracted to profileInfo');
    }

    // Debug logging
    console.log('ProfileService.updateProfile - userData before conversion:', JSON.stringify(userData, null, 2));
    console.log('ProfileService.updateProfile - profileInfo:', JSON.stringify(profileInfo, null, 2));
    console.log('ProfileService.updateProfile - dateOfBirth type:', typeof userData.dateOfBirth);

    // Convert dateOfBirth string to DateTime if present
    if (userData.dateOfBirth && typeof userData.dateOfBirth === 'string') {
      console.log('Converting dateOfBirth from string:', userData.dateOfBirth);
      
      // Ensure proper ISO format for Prisma
      let parsedDate: Date;
      if (userData.dateOfBirth.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // Handle YYYY-MM-DD format by adding time component
        parsedDate = new Date(userData.dateOfBirth + 'T00:00:00.000Z');
      } else {
        parsedDate = new Date(userData.dateOfBirth);
      }
      
      if (isNaN(parsedDate.getTime())) {
        throw new BadRequestException('Invalid date format for dateOfBirth');
      }
      
      userData.dateOfBirth = parsedDate;
      console.log('Converted dateOfBirth to Date object:', userData.dateOfBirth);
      console.log('ISO String:', userData.dateOfBirth.toISOString());
    }

    // Convert gender to uppercase enum value if present
    if (userData.gender && typeof userData.gender === 'string') {
      console.log('Converting gender from string:', userData.gender);
      userData.gender = userData.gender.toUpperCase();
      console.log('Converted gender to uppercase:', userData.gender);
    }

    // Convert maritalStatus to proper enum value if present
    console.log('DEBUG: Checking maritalStatus conversion condition:', {
      hasMaritalStatus: !!profileInfo.maritalStatus,
      maritalStatusValue: profileInfo.maritalStatus,
      maritalStatusType: typeof profileInfo.maritalStatus
    });

    if (profileInfo.maritalStatus && typeof profileInfo.maritalStatus === 'string') {
      console.log('Converting maritalStatus from string:', profileInfo.maritalStatus);
      const maritalStatusMap = {
        'single': 'NEVER_MARRIED',
        'never_married': 'NEVER_MARRIED',
        'divorced': 'DIVORCED',
        'widowed': 'WIDOWED'
      };

      const mappedStatus = maritalStatusMap[profileInfo.maritalStatus.toLowerCase()];
      if (mappedStatus) {
        profileInfo.maritalStatus = mappedStatus;
        console.log('Converted maritalStatus to enum:', profileInfo.maritalStatus);
      } else {
        console.warn('Unknown maritalStatus value:', profileInfo.maritalStatus);
        // Default to NEVER_MARRIED if unknown
        profileInfo.maritalStatus = 'NEVER_MARRIED';
      }
    }

    // Convert hasChildren and wantChildren to proper boolean values if present
    if (profileInfo.hasChildren && typeof profileInfo.hasChildren === 'string') {
      console.log('Converting hasChildren from string:', profileInfo.hasChildren);
      profileInfo.hasChildren = profileInfo.hasChildren.toLowerCase() === 'yes';
      console.log('Converted hasChildren to boolean:', profileInfo.hasChildren);
    }

    if (profileInfo.wantChildren && typeof profileInfo.wantChildren === 'string') {
      console.log('Converting wantChildren from string:', profileInfo.wantChildren);
      profileInfo.wantChildren = profileInfo.wantChildren.toLowerCase() === 'yes';
      console.log('Converted wantChildren to boolean:', profileInfo.wantChildren);
    }

    // Convert smoking and drinking to proper enum values if present
    console.log('DEBUG: Checking smoking conversion condition:', {
      hasSmoking: !!profileInfo.smoking,
      smokingValue: profileInfo.smoking,
      smokingType: typeof profileInfo.smoking,
      smokingExists: 'smoking' in profileInfo
    });

    if (profileInfo.smoking !== undefined && profileInfo.smoking !== null && typeof profileInfo.smoking === 'string') {
      console.log('Converting smoking from string:', profileInfo.smoking);
      const lifestyleMap = {
        'never': 'NEVER',
        'occasionally': 'OCCASIONALLY',
        'regularly': 'REGULARLY'
      };

      const mappedSmoking = lifestyleMap[profileInfo.smoking.toLowerCase()];
      if (mappedSmoking) {
        profileInfo.smoking = mappedSmoking;
        console.log('Converted smoking to enum:', profileInfo.smoking);
      } else {
        console.warn('Unknown smoking value:', profileInfo.smoking);
        profileInfo.smoking = 'NEVER'; // Default to NEVER if unknown
      }
    }

    console.log('DEBUG: Checking drinking conversion condition:', {
      hasDrinking: !!profileInfo.drinking,
      drinkingValue: profileInfo.drinking,
      drinkingType: typeof profileInfo.drinking,
      drinkingExists: 'drinking' in profileInfo
    });

    if (profileInfo.drinking !== undefined && profileInfo.drinking !== null && typeof profileInfo.drinking === 'string') {
      console.log('Converting drinking from string:', profileInfo.drinking);
      const lifestyleMap = {
        'never': 'NEVER',
        'occasionally': 'OCCASIONALLY',
        'regularly': 'REGULARLY',
        'socially': 'OCCASIONALLY', // Map 'socially' to 'OCCASIONALLY'
        '': 'NEVER' // Handle empty string
      };

      const mappedDrinking = lifestyleMap[profileInfo.drinking.toLowerCase()];
      if (mappedDrinking) {
        profileInfo.drinking = mappedDrinking;
        console.log('Converted drinking to enum:', profileInfo.drinking);
      } else {
        console.warn('Unknown drinking value:', profileInfo.drinking);
        profileInfo.drinking = 'NEVER'; // Default to NEVER if unknown
      }
    }

    console.log('ProfileService.updateProfile - userData after conversion:', JSON.stringify(userData, null, 2));
    console.log('ProfileService.updateProfile - profileInfo after conversion:', JSON.stringify(profileInfo, null, 2));

    // Update user basic info only if there's user data
    let updatedUser: any;
    if (Object.keys(userData).length > 0) {
      updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: userData,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          dateOfBirth: true,
          gender: true,
          phone: true,
          profilePicture: true,
          relationshipStatus: true,
        },
      });
    } else {
      // Get current user data if no updates
      updatedUser = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          dateOfBirth: true,
          gender: true,
          phone: true,
          profilePicture: true,
          relationshipStatus: true,
        },
      });
    }

    // Update or create profile if there's profile data
    if (Object.keys(profileInfo).length > 0) {
      console.log('🔍 Profile upsert debug:', {
        profileInfoKeys: Object.keys(profileInfo),
        city: profileInfo.city,
        country: profileInfo.country,
        cityFallback: profileInfo.city || 'Unknown',
        countryFallback: profileInfo.country || 'Unknown'
      });

      // Ensure required fields are present for create operation
      const createData = {
        userId,
        city: profileInfo.city || 'Unknown',
        country: profileInfo.country || 'Unknown',
        ...profileInfo,
      };

      console.log('🔍 Final create data:', createData);

      const updatedProfile = await this.prisma.userProfile.upsert({
        where: { userId },
        update: profileInfo,
        create: createData,
      });

      return {
        ...updatedUser,
        profile: updatedProfile,
      };
    }

    return updatedUser;
  }

  /**
   * Get user preferences
   */
  async getPreferences(userId: string) {
    const preferences = await this.prisma.userPreferences.findUnique({
      where: { userId },
    });

    if (!preferences) {
      // Return default preferences
      return {
        minAge: 18,
        maxAge: 80,
        maxDistance: 50,
        education: [],
        occupation: [],
        interests: [],
        dealBreakers: [],
      };
    }

    return preferences;
  }

  /**
   * Update user preferences
   */
  async updatePreferences(userId: string, preferencesData: any) {
    // Filter out language and phase data - these should use separate endpoints
    const { language, languageData, phase, ...validPreferencesData } = preferencesData;

    // Log if language/phase data was sent to wrong endpoint
    if (language || languageData || phase) {
      console.warn('Language/phase data sent to preferences endpoint. Use /profile/language and /profile/phase endpoints instead.');
    }

    const preferences = await this.prisma.userPreferences.upsert({
      where: { userId },
      update: validPreferencesData,
      create: {
        userId,
        ...validPreferencesData,
      },
    });

    return {
      success: true,
      data: preferences,
      message: 'Preferences updated successfully',
    };
  }

  /**
   * Upload photo
   */
  async uploadPhoto(
    userId: string,
    photoData: { url: string; isPrimary?: boolean },
  ) {
    const { url, isPrimary = false } = photoData;

    // If setting as primary, unset other primary photos
    if (isPrimary) {
      await this.prisma.photo.updateMany({
        where: { userId, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    // Get next order
    const lastPhoto = await this.prisma.photo.findFirst({
      where: { userId },
      orderBy: { order: 'desc' },
    });

    const nextOrder = lastPhoto ? lastPhoto.order + 1 : 0;

    const photo = await this.prisma.photo.create({
      data: {
        userId,
        url,
        isPrimary,
        order: nextOrder,
      },
    });

    // Update user profile picture if this is primary
    if (isPrimary) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { profilePicture: url },
      });
    }

    return photo;
  }

  /**
   * Get user photos
   */
  async getPhotos(userId: string) {
    return this.prisma.photo.findMany({
      where: { userId },
      orderBy: { order: 'asc' },
    });
  }

  /**
   * Delete photo
   */
  async deletePhoto(userId: string, photoId: string) {
    const photo = await this.prisma.photo.findUnique({
      where: { id: photoId },
    });

    if (!photo) {
      throw new NotFoundException('Photo not found');
    }

    if (photo.userId !== userId) {
      throw new ForbiddenException('You can only delete your own photos');
    }

    await this.prisma.photo.delete({
      where: { id: photoId },
    });

    // If this was the primary photo, update user profile picture
    if (photo.isPrimary) {
      const nextPrimaryPhoto = await this.prisma.photo.findFirst({
        where: { userId },
        orderBy: { order: 'asc' },
      });

      if (nextPrimaryPhoto) {
        await this.prisma.photo.update({
          where: { id: nextPrimaryPhoto.id },
          data: { isPrimary: true },
        });

        await this.prisma.user.update({
          where: { id: userId },
          data: { profilePicture: nextPrimaryPhoto.url },
        });
      } else {
        await this.prisma.user.update({
          where: { id: userId },
          data: { profilePicture: null },
        });
      }
    }

    return { message: 'Photo deleted successfully' };
  }

  /**
   * Set primary photo
   */
  async setPrimaryPhoto(userId: string, photoId: string) {
    const photo = await this.prisma.photo.findUnique({
      where: { id: photoId },
    });

    if (!photo) {
      throw new NotFoundException('Photo not found');
    }

    if (photo.userId !== userId) {
      throw new ForbiddenException('You can only modify your own photos');
    }

    // Unset other primary photos
    await this.prisma.photo.updateMany({
      where: { userId, isPrimary: true },
      data: { isPrimary: false },
    });

    // Set this photo as primary
    await this.prisma.photo.update({
      where: { id: photoId },
      data: { isPrimary: true },
    });

    // Update user profile picture
    await this.prisma.user.update({
      where: { id: userId },
      data: { profilePicture: photo.url },
    });

    return { message: 'Primary photo updated successfully' };
  }

  /**
   * Get profile completion status
   */
  async getCompletionStatus(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        gender: true,
        email: true,
        profilePicture: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get profile data
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    // Get preferences
    const preferences = await this.prisma.userPreferences.findUnique({
      where: { userId },
    });

    // Get photos count
    const photosCount = await this.prisma.photo.count({
      where: { userId },
    });

    // Check completion status for different sections
    const basicInfo = {
      completed: Boolean(
        user.firstName &&
        user.lastName &&
        user.gender &&
        user.email &&
        user.dateOfBirth
      ),
      fields: {
        firstName: Boolean(user.firstName),
        lastName: Boolean(user.lastName),
        gender: Boolean(user.gender),
        email: Boolean(user.email),
        dateOfBirth: Boolean(user.dateOfBirth),
      },
      weight: 25 // 25% of total completion
    };

    // Debug profile completion logic
    console.log('🔍 Profile completion debug:', {
      profileExists: Boolean(profile),
      city: profile?.city,
      country: profile?.country,
      height: profile?.height,
      occupation: profile?.occupation,
      education: profile?.education,
      maritalStatus: profile?.maritalStatus,
      smoking: profile?.smoking,
      drinking: profile?.drinking,
      interests: profile?.interests,
      interestsLength: profile?.interests?.length
    });

    const profileDetailsCompleted = Boolean(
      profile &&
      profile.city &&
      profile.country &&
      profile.height &&
      profile.occupation &&
      profile.education &&
      profile.maritalStatus &&
      profile.smoking &&
      profile.drinking &&
      profile.interests && profile.interests.length > 0
    );

    console.log('✅ Profile details completion result:', profileDetailsCompleted);

    const profileDetails = {
      completed: profileDetailsCompleted,
      fields: {
        city: Boolean(profile?.city),
        country: Boolean(profile?.country),
        height: Boolean(profile?.height),
        occupation: Boolean(profile?.occupation),
        education: Boolean(profile?.education),
        interests: Boolean(profile?.interests && profile.interests.length > 0),
        maritalStatus: Boolean(profile?.maritalStatus),
        smoking: Boolean(profile?.smoking),
        drinking: Boolean(profile?.drinking),
        bio: Boolean(profile?.bio), // Optional field
        hasChildren: Boolean(profile?.hasChildren !== undefined),
        wantsChildren: Boolean(profile?.wantsChildren !== undefined),
      },
      weight: 35 // 35% of total completion
    };

    const photos = {
      completed: true, // Make photos optional for now - focus on profile data completion
      count: photosCount,
      hasProfilePicture: Boolean(user.profilePicture),
      minimumMet: photosCount >= 1,
      recommendedMet: photosCount >= 3,
      weight: 20 // 20% of total completion
    };

    const preferencesComplete = {
      completed: true, // Make preferences optional for initial profile completion
      fields: {
        ageRange: Boolean(preferences?.minAge && preferences?.maxAge),
        maxDistance: Boolean(preferences?.maxDistance),
        education: Boolean(preferences?.education),
        occupation: Boolean(preferences?.occupation),
        interests: Boolean(preferences?.interests && preferences.interests.length > 0),
      },
      weight: 20 // 20% of total completion
    };

    // Calculate weighted completion percentage
    let completionPercentage = 0;
    if (basicInfo.completed) completionPercentage += basicInfo.weight;
    if (profileDetails.completed) completionPercentage += profileDetails.weight;
    if (photos.completed) completionPercentage += photos.weight;
    if (preferencesComplete.completed) completionPercentage += preferencesComplete.weight;

    // Count completed sections for summary
    const completedSections = [
      basicInfo.completed,
      profileDetails.completed,
      photos.completed,
      preferencesComplete.completed
    ].filter(Boolean).length;

    const totalSections = 4;

    return {
      overall: {
        completed: completionPercentage >= 70, // Profile is considered "complete" with at least 70% completion
        percentage: completionPercentage,
        completedSections,
        totalSections,
        level: this.getCompletionLevel(completionPercentage),
        score: this.getCompletionScore(basicInfo, profileDetails, photos, preferencesComplete)
      },
      sections: {
        basicInfo,
        profileDetails,
        photos,
        preferences: preferencesComplete
      },
      nextSteps: this.getNextSteps(basicInfo, profileDetails, photos, preferencesComplete),
      recommendations: this.getCompletionRecommendations(basicInfo, profileDetails, photos, preferencesComplete),
      analytics: {
        strengthAreas: this.getStrengthAreas(basicInfo, profileDetails, photos, preferencesComplete),
        improvementAreas: this.getImprovementAreas(basicInfo, profileDetails, photos, preferencesComplete),
        completionTrend: 'improving' // This could be calculated based on historical data
      }
    };
  }

  /**
   * Get recommended next steps for profile completion
   */
  private getNextSteps(basicInfo: any, profileDetails: any, photos: any, preferences: any) {
    const steps: Array<{
      action: string;
      title: string;
      description: string;
      priority: string;
    }> = [];

    if (!basicInfo.completed) {
      steps.push({
        action: 'complete_basic_info',
        title: 'Complete Basic Information',
        description: 'Add your name, gender, and other basic details',
        priority: 'high'
      });
    }

    if (!profileDetails.completed) {
      steps.push({
        action: 'complete_profile',
        title: 'Complete Profile Details',
        description: 'Add your location, occupation, and physical details',
        priority: 'high'
      });
    }

    if (!photos.completed) {
      steps.push({
        action: 'add_photos',
        title: 'Add Profile Photos',
        description: 'Upload at least one photo to attract matches',
        priority: 'medium'
      });
    }

    if (!preferences.completed) {
      steps.push({
        action: 'set_preferences',
        title: 'Set Match Preferences',
        description: 'Define your ideal match criteria',
        priority: 'low'
      });
    }

    return steps;
  }

  /**
   * Get completion level based on percentage
   */
  private getCompletionLevel(percentage: number): string {
    if (percentage >= 90) return 'excellent';
    if (percentage >= 70) return 'good';
    if (percentage >= 50) return 'fair';
    if (percentage >= 25) return 'basic';
    return 'incomplete';
  }

  /**
   * Get detailed completion score
   */
  private getCompletionScore(basicInfo: any, profileDetails: any, photos: any, preferences: any) {
    const scores = {
      basicInfo: this.calculateSectionScore(basicInfo),
      profileDetails: this.calculateSectionScore(profileDetails),
      photos: this.calculatePhotoScore(photos),
      preferences: this.calculateSectionScore(preferences)
    };

    return {
      ...scores,
      overall: Math.round((scores.basicInfo + scores.profileDetails + scores.photos + scores.preferences) / 4)
    };
  }

  /**
   * Calculate section completion score
   */
  private calculateSectionScore(section: any): number {
    if (!section.fields) return section.completed ? 100 : 0;

    const totalFields = Object.keys(section.fields).length;
    const completedFields = Object.values(section.fields).filter(Boolean).length;

    return Math.round((completedFields / totalFields) * 100);
  }

  /**
   * Calculate photo section score
   */
  private calculatePhotoScore(photos: any): number {
    let score = 0;
    if (photos.hasProfilePicture) score += 50;
    if (photos.count >= 1) score += 25;
    if (photos.count >= 3) score += 25;
    return Math.min(score, 100);
  }

  /**
   * Get completion recommendations
   */
  private getCompletionRecommendations(basicInfo: any, profileDetails: any, photos: any, preferences: any) {
    const recommendations: any[] = [];

    if (!photos.recommendedMet) {
      recommendations.push({
        type: 'photos',
        priority: 'high',
        title: 'Add More Photos',
        description: 'Profiles with 3+ photos get 40% more matches',
        action: 'Upload more photos to showcase your personality'
      });
    }

    if (!profileDetails.fields.bio) {
      recommendations.push({
        type: 'bio',
        priority: 'high',
        title: 'Write Your Bio',
        description: 'A compelling bio increases profile views by 60%',
        action: 'Add a bio that describes your personality and interests'
      });
    }

    if (!profileDetails.fields.interests || !preferences.fields.interests) {
      recommendations.push({
        type: 'interests',
        priority: 'medium',
        title: 'Add Your Interests',
        description: 'Shared interests improve match compatibility',
        action: 'Select interests that represent your hobbies and passions'
      });
    }

    return recommendations;
  }

  /**
   * Get strength areas
   */
  private getStrengthAreas(basicInfo: any, profileDetails: any, photos: any, preferences: any) {
    const strengths: string[] = [];

    if (basicInfo.completed) strengths.push('Complete basic information');
    if (profileDetails.completed) strengths.push('Detailed profile information');
    if (photos.recommendedMet) strengths.push('Great photo collection');
    if (preferences.completed) strengths.push('Clear relationship preferences');

    return strengths;
  }

  /**
   * Get improvement areas
   */
  private getImprovementAreas(basicInfo: any, profileDetails: any, photos: any, preferences: any) {
    const improvements: string[] = [];

    if (!basicInfo.completed) improvements.push('Basic information needs completion');
    if (!profileDetails.fields.bio) improvements.push('Add a compelling bio');
    if (!photos.recommendedMet) improvements.push('Upload more photos');
    if (!preferences.completed) improvements.push('Set relationship preferences');

    return improvements;
  }

  /**
   * Upload multiple photos with compression and optimization
   */
  async uploadMultiplePhotos(
    userId: string,
    photoData: Array<{
      url: string;
      originalName?: string;
      fileSize?: number;
      mimeType?: string;
      description?: string;
    }>
  ) {
    const uploadedPhotos: any[] = [];
    const existingPhotosCount = await this.prisma.photo.count({
      where: { userId }
    });

    const maxPhotos = 6;
    const remainingSlots = maxPhotos - existingPhotosCount;
    const photosToUpload = photoData.slice(0, remainingSlots);

    for (let i = 0; i < photosToUpload.length; i++) {
      const photo = photosToUpload[i];
      const order = existingPhotosCount + i;
      const isPrimary = existingPhotosCount === 0 && i === 0;

      const uploadedPhoto = await this.prisma.photo.create({
        data: {
          userId,
          url: photo.url,
          isPrimary,
          order,
        }
      });

      uploadedPhotos.push(uploadedPhoto);

      if (isPrimary) {
        await this.prisma.user.update({
          where: { id: userId },
          data: { profilePicture: photo.url }
        });
      }
    }

    return {
      uploadedPhotos,
      totalPhotos: existingPhotosCount + uploadedPhotos.length,
      remainingSlots: maxPhotos - (existingPhotosCount + uploadedPhotos.length),
      message: `Successfully uploaded ${uploadedPhotos.length} photo(s)`
    };
  }

  /**
   * Get profile optimization suggestions
   */
  async getProfileOptimizationSuggestions(userId: string) {
    const profile = await this.getProfile(userId);
    const userProfile = await this.prisma.userProfile.findUnique({
      where: { userId }
    });
    const photos = await this.getPhotos(userId);
    const personalityProfile = await this.prisma.userPersonalityProfile.findUnique({
      where: { user_id: userId }
    });

    const suggestions: any[] = [];

    if (!userProfile?.bio || userProfile.bio.length < 50) {
      suggestions.push({
        category: 'bio',
        type: 'missing_bio',
        title: 'Add a compelling bio',
        description: 'Profiles with bios get 40% more engagement',
        impact: 'high',
        action: 'Write 2-3 sentences about yourself and your interests'
      });
    }

    if (photos.length < 3) {
      suggestions.push({
        category: 'photos',
        type: 'more_photos',
        title: 'Add more photos',
        description: 'Profiles with 3+ photos get 60% more engagement',
        impact: 'high',
        action: `Upload ${3 - photos.length} more photo(s) showing different aspects of your life`
      });
    }

    if (!personalityProfile) {
      suggestions.push({
        category: 'personality',
        type: 'take_assessment',
        title: 'Complete personality assessment',
        description: 'Get better date recommendations with personality insights',
        impact: 'high',
        action: 'Take our 10-minute personality quiz to improve recommendations'
      });
    }

    return {
      score: this.calculateOptimizationScore(profile, userProfile, photos, personalityProfile),
      suggestions
    };
  }

  /**
   * Calculate profile optimization score (0-100)
   */
  private calculateOptimizationScore(profile: any, userProfile: any, photos: any[], personalityProfile: any): number {
    let score = 0;

    if (profile.firstName && profile.lastName && profile.gender) score += 20;
    if (userProfile?.bio && userProfile.bio.length >= 50) score += 15;
    if (userProfile?.city && userProfile?.country) score += 10;
    if (photos.length >= 1) score += 15;
    if (photos.length >= 3) score += 15;
    if (personalityProfile) score += 15;
    if (profile.isVerified) score += 10;

    return Math.min(score, 100);
  }

  /**
   * Get profile analytics
   */
  async getProfileAnalytics(userId: string) {
    const profile = await this.getProfile(userId);
    const userProfile = await this.prisma.userProfile.findUnique({
      where: { userId }
    });
    const photos = await this.getPhotos(userId);
    const completionStatus = await this.getCompletionStatus(userId);

    const strengthScore = this.calculateProfileStrength(profile, userProfile, photos);
    
    return {
      strength: {
        score: strengthScore.score,
        level: strengthScore.level,
        tips: strengthScore.tips
      },
      completion: completionStatus,
      lastUpdated: profile.createdAt, // Using createdAt since updatedAt not available
      profileAge: Math.floor((Date.now() - new Date(profile.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    };
  }

  /**
   * Calculate profile strength
   */
  private calculateProfileStrength(profile: any, userProfile: any, photos: any[]) {
    let score = 0;
    const tips: string[] = [];

    if (profile.firstName && profile.lastName) score += 25;
    if (userProfile?.bio) {
      if (userProfile.bio.length >= 50 && userProfile.bio.length <= 300) {
        score += 25;
      } else {
        score += 10;
        tips.push('Write a bio between 50-300 characters');
      }
    } else {
      tips.push('Add a compelling bio to your profile');
    }

    if (photos.length >= 3) {
      score += 30;
    } else {
      tips.push(`Upload ${3 - photos.length} more photos for better visibility`);
    }

    if (profile.isVerified) {
      score += 20;
    } else {
      tips.push('Verify your profile to build trust');
    }

    let level = 'Getting Started';
    if (score >= 80) level = 'Excellent';
    else if (score >= 60) level = 'Good';
    else if (score >= 40) level = 'Basic';

    return { score: Math.min(score, 100), level, tips: tips.slice(0, 3) };
  }

  /**
   * Request profile verification
   */
  async requestProfileVerification(userId: string, verificationType: 'photo' | 'identity' | 'phone') {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.verificationStatus === 'VERIFIED') {
      return {
        success: false,
        message: 'Profile is already verified'
      };
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        verificationStatus: 'PENDING'
      }
    });

    return {
      success: true,
      message: 'Verification request submitted successfully',
      type: verificationType,
      estimatedProcessingTime: '1-3 business days'
    };
  }

  /**
   * Get user analytics data
   */
  async getUserAnalytics(userId: string) {
    try {
      // In a real implementation, you would query various tables for analytics
      // For now, returning mock data based on user activity
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { createdAt: true, updatedAt: true },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const analytics = {
        profileViews: Math.floor(Math.random() * 100) + 10,
        matches: Math.floor(Math.random() * 20) + 1,
        messages: Math.floor(Math.random() * 50) + 5,
        dates: Math.floor(Math.random() * 10) + 1,
        completionRate: 85,
        lastActive: user.updatedAt || user.createdAt,
        accountAge: Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
      };

      return {
        success: true,
        data: analytics,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Failed to get user analytics:', error);
      throw new BadRequestException('Failed to retrieve user analytics');
    }
  }

  /**
   * Update user relationship phase
   */
  async updateUserPhase(userId: string, phase: string) {
    try {
      const validPhases = ['single', 'preparing', 'engaged'];
      if (!validPhases.includes(phase)) {
        throw new BadRequestException('Invalid relationship phase');
      }

      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: { currentPhase: phase },
        select: {
          id: true,
          currentPhase: true,
          preferredLanguage: true
        },
      });

      return {
        success: true,
        data: {
          id: userId,
          phase: updatedUser.currentPhase,
          language: updatedUser.preferredLanguage
        },
        message: 'Relationship phase updated successfully',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Failed to update user phase:', error);
      throw new BadRequestException('Failed to update relationship phase');
    }
  }

  /**
   * Update user preferred language
   */
  async updateUserLanguage(userId: string, language: string) {
    try {
      const validLanguages = ['en', 'es', 'fr', 'ar'];
      if (!validLanguages.includes(language)) {
        throw new BadRequestException('Invalid language code');
      }

      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: { preferredLanguage: language },
        select: {
          id: true,
          preferredLanguage: true,
          currentPhase: true
        },
      });

      return {
        success: true,
        data: {
          id: userId,
          language: updatedUser.preferredLanguage,
          phase: updatedUser.currentPhase
        },
        message: 'Preferred language updated successfully',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Failed to update user language:', error);
      throw new BadRequestException('Failed to update preferred language');
    }
  }
}
