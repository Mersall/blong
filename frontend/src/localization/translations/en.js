/**
 * BLONG English Translations
 * Complete English language pack with all app strings
 */

export default {
  common: {
    continue: 'CONTINUE',
    back: 'Back',
    previous: 'Previous',
    next: 'Next',
    skip: 'Skip',
    done: 'Done',
    save: 'Save',
    cancel: 'Cancel',
    loading: 'Loading...',
    error: 'Something went wrong',
    success: 'Success!',
    retry: 'Try Again',
    tryAgain: 'Try Again',
    ok: 'OK',
    processing: 'PROCESSING...',
    changing: 'CHANGING...',
    notSelected: 'Not selected',
    notNow: 'Not Now',
    viewDetails: 'View Details',
    retrying: 'Retrying...',
    complete: 'Complete',
    
    // Form fields
    email: 'Email',
    password: 'Password',
    name: 'Name',
    phone: 'Phone Number',
  },

  // Onboarding flow
  onboarding: {
    // Brand
    brand: 'BLONG',
    brandSubtitle: 'Elite Matrimonial',
    tagline: 'ELITE MATRIMONIAL',
    
    // Language selection
    languageTitle: 'Choose Your Language',
    languageSubtitle: 'Select your preferred language for the best experience',
    languageFooter: 'You can change this later in settings',
    
    // Phase selection
    phaseTitle: 'What\'s Your Journey?',
    phaseSubtitle: 'Tell us about your current relationship phase',
    phaseFooter: 'This helps us personalize your experience',
    startJourney: 'START YOUR JOURNEY',
    
    // Language options with native names
    languages: {
      english: {
        name: 'English',
        nativeName: 'English',
        description: 'Global language',
        flag: '🇺🇸',
      },
      arabic: {
        name: 'Arabic',
        nativeName: 'العربية',
        description: 'Arabic language',
        flag: '🇸🇦',
      },
      french: {
        name: 'French',
        nativeName: 'Français',
        description: 'French language',
        flag: '🇫🇷',
      },
      spanish: {
        name: 'Spanish',
        nativeName: 'Español',
        description: 'Spanish language',
        flag: '🇪🇸',
      },
    },
    
    // Relationship phases
    phases: {
      single: {
        title: 'Single',
        subtitle: 'Request a Date',
        description: 'Request a date and our AI will curate the perfect venue and arrange everything for you',
        icon: '💝',
      },
      engagement: {
        title: 'Engagement',
        subtitle: 'Planning Together',
        description: 'Engaged and planning your future together with your partner',
        icon: '💍',
      },
      engagement_day_prep: {
        title: 'Engagement Day Prep',
        subtitle: 'Final Preparations',
        description: 'Getting ready for your engagement day with all the final touches and preparations',
        icon: '✨',
      },
    },
  },

  // Accessibility
  accessibility: {
    datePickerHint: 'Opens date picker to select your birth date',
    passwordStrengthHint: 'Password strength indicator updates as you type',
    genderSelectionHint: 'Select your gender from available options',
    formValidationError: 'Please review and fix the highlighted errors',
    loadingState: 'Please wait while we process your request',
    errorDismiss: 'Tap to dismiss this error message',
    successDismiss: 'Tap to dismiss this success message',
    retryAction: 'Retry the failed operation',
    togglePasswordVisibility: 'Show or hide password text',
    authModeSwitch: 'Switch between sign in and create account',
    requiredField: 'This field is required',
    optionalField: 'This field is optional',
  },

  // Authentication
  auth: {
    loginTitle: 'Welcome Back',
    loginSubtitle: 'Sign in to continue your journey',
    loginButton: 'SIGN IN',

    registerTitle: 'Create Your Account',
    registerSubtitle: 'Join thousands finding meaningful connections',
    registerButton: 'CREATE ACCOUNT',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    createAccount: 'Create Account',
    signIn: 'Sign In',

    forgotPassword: 'Forgot Password?',
    resetPassword: 'Reset Password',
    rememberMe: 'Remember me',

    // Success messages
    loginSuccess: 'Welcome back!',
    registerSuccess: 'Account created successfully!',
    
    // Process messages
    signingIn: 'Signing you in...',
    creatingAccount: 'Creating your account...',
    retryingSignIn: 'Retrying sign in...',
    retryingRegister: 'Retrying registration...',
    retryAttempt: 'Retry attempt {{current}} of {{max}}',
    pleaseWait: 'Please wait while we verify your credentials',
    processingInfo: 'Please wait while we set up your profile',

    // Field labels
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',

    // Placeholders
    firstNamePlaceholder: 'Enter your first name',
    lastNamePlaceholder: 'Enter your last name',
    emailPlaceholder: 'Enter your email address',
    passwordPlaceholder: 'Enter your password',
    confirmPasswordPlaceholder: 'Confirm your password',
    dateOfBirthPlaceholder: 'Select your date of birth',
    
    // Additional auth fields
    dateOfBirth: 'Date of Birth',
    gender: 'Gender',
    
    // Gender options
    'gender.male': 'Male',
    'gender.female': 'Female',
    'gender.non_binary': 'Non-binary',
    'gender.other': 'Other',
  },

  // Personality Assessment (Enhanced)
  assessment: {
    title: 'Personality Assessment',
    subtitle: 'Help us understand your personality to enhance your dating experience',
    startButton: 'Start Assessment',
    continueButton: 'Continue',
    previousButton: 'Previous',
    nextButton: 'Next',
    finishButton: 'Finish Assessment',
    saveProgress: 'Save Progress',

    // Progress
    progress: 'Question {{current}} of {{total}}',
    sectionProgress: 'Section {{current}} of {{total}}',
    timeRemaining: '{{minutes}} minutes remaining',

    // Sections
    sections: {
      personalityCore: 'Core Personality',
      personalityCoreDesc: 'Understanding your fundamental personality traits',
      relationshipValues: 'Relationship Values',
      relationshipValuesDesc: 'Your approach to relationships and communication',
      lifestyleGoals: 'Lifestyle & Goals',
      lifestyleGoalsDesc: 'Your life priorities and social preferences',
    },

    // Likert Scale Labels
    likert: {
      stronglyDisagree: 'Strongly Disagree',
      disagree: 'Disagree',
      slightlyDisagree: 'Slightly Disagree',
      neutral: 'Neutral',
      slightlyAgree: 'Slightly Agree',
      agree: 'Agree',
      stronglyAgree: 'Strongly Agree',
    },

    // Assessment Questions
    questions: {
      // Extraversion
      ext_1: 'I am the life of the party',
      ext_2: 'I prefer to keep to myself',
      ext_3: 'I feel comfortable around people',

      // Agreeableness
      agr_1: 'I am interested in people',
      agr_2: 'I insult people',
      agr_3: 'I sympathize with others\' feelings',

      // Conscientiousness
      con_1: 'I am always prepared',
      con_2: 'I leave my belongings around',
      con_3: 'I pay attention to details',

      // Neuroticism
      neu_1: 'I get stressed out easily',
      neu_2: 'I am relaxed most of the time',

      // Openness
      ope_1: 'I have a rich vocabulary',
      ope_2: 'I have difficulty understanding abstract ideas',

      // Family Orientation
      fam_1: 'Family is the most important thing in my life',
      fam_2: 'How many children would you ideally like to have?',

      // Communication Style
      com_1: 'I prefer to discuss problems openly rather than avoid them',
      com_2: 'When disagreeing with someone, I usually:',

      // Conflict Resolution
      conf_1: 'I try to find compromises when there are disagreements',
      conf_2: 'During an argument, I tend to:',

      // Life Goals
      goal_1: 'Rank these life priorities in order of importance to you:',

      // Social Preferences
      soc_1: 'I enjoy large social gatherings',
      soc_2: 'How much do you enjoy being the center of attention?',

      // Financial Values
      fin_1: 'What best describes your approach to money?',
    },

    // Answer Options
    options: {
      // Family size preferences
      fam_2_1: 'No children',
      fam_2_2: '1-2 children',
      fam_2_3: '3-4 children',
      fam_2_4: '5+ children',

      // Communication during disagreements
      com_2_1: 'Listen carefully and try to understand their perspective',
      com_2_2: 'State my position clearly and firmly',
      com_2_3: 'Try to find middle ground',
      com_2_4: 'Avoid the conversation if possible',

      // Conflict resolution style
      conf_2_1: 'Stay calm and focus on solutions',
      conf_2_2: 'Express my emotions openly',
      conf_2_3: 'Take time to cool down first',
      conf_2_4: 'Try to end it quickly',

      // Life priorities
      goal_1_1: 'Career advancement',
      goal_1_2: 'Family and relationships',
      goal_1_3: 'Travel and experiences',
      goal_1_4: 'Personal growth',
      goal_1_5: 'Financial security',

      // Financial approach
      fin_1_1: 'Save for the future, spend carefully',
      fin_1_2: 'Balance saving and enjoying life',
      fin_1_3: 'Live in the moment, money is for spending',
      fin_1_4: 'Invest aggressively for growth',
    },

    // Labels
    labels: {
      soc_2: 'Not at all → Love it',
    },

    // Assessment Flow
    continueTitle: 'Continue Assessment?',
    continueMessage: 'You have a saved assessment in progress. Would you like to continue or start over?',
    startOver: 'Start Over',
    continue: 'Continue',

    exitTitle: 'Exit Assessment?',
    exitMessage: 'Your progress will be saved. You can continue later.',
    saveAndExit: 'Save & Exit',
    exitWithoutSaving: 'Exit Without Saving',

    errorTitle: 'Assessment Error',
    errorMessage: 'There was an error completing your assessment. Please try again.',
    errorLoading: 'Failed to load assessment. Please try again.',

    loading: 'Loading assessment...',
    saving: 'Saving...',
    save: 'Save',
    complete: 'Complete',
    answered: 'Answered',

    scaleInstruction: 'Select the number that best represents your response',
    multipleChoiceInstruction: 'Select the option that best describes you:',
    optionSelected: 'Option selected',
    rankingInstruction: 'Rank these items in order of importance to you (1 = most important):',
    priority: 'Priority',
    rankingComplete: 'Ranking complete!',
    sliderInstruction: 'Drag the slider to indicate your preference:',
    valueSelected: 'Value selected',

    // Slider descriptive labels
    slider: {
      veryLow: 'Very Low',
      low: 'Low',
      moderate: 'Moderate',
      high: 'High',
      veryHigh: 'Very High',
    },
  },

  // Error handling - Comprehensive error messages
  errors: {
    // Network errors
    network: {
      title: 'Connection Issue',
      message: 'Unable to connect to our servers. Please check your internet connection.',
      retryPrompt: 'Would you like to retry?',
      action: 'Retry',
      suggestions: {
        checkConnection: 'Check your WiFi or mobile data connection',
        tryAgain: 'Try again in a few moments',
        contactSupport: 'Contact support if the issue persists'
      },
    },
    timeout: {
      title: 'Request Timeout',
      message: 'The request took too long to complete. This might be due to a slow connection.',
      action: 'Try Again',
      suggestions: {
        checkSpeed: 'Check your internet speed',
        betterConnection: 'Try again with a better connection',
        waitMoment: 'Wait a moment before trying again'
      },
    },

    // Authentication errors
    auth: {
      invalidCredentials: {
        title: 'Invalid Credentials',
        message: 'The email or password you entered is incorrect.',
        action: 'Try Again',
        suggestions: {
          doubleCheck: 'Double-check your email and password',
          forgotPassword: 'Use "Forgot Password" if needed',
          checkCaps: 'Check if Caps Lock is on'
        },
      },
      sessionExpired: {
        title: 'Session Expired',
        message: 'Your session has expired. Please sign in again.',
        action: 'Sign In',
        suggestions: {
          signInAgain: 'Sign in with your credentials',
          rememberMe: 'Enable "Remember Me" for longer sessions'
        },
      },
      emailNotVerified: {
        title: 'Email Not Verified',
        message: 'Please verify your email address before signing in.',
        action: 'Verify Email',
        suggestions: {
          checkEmail: 'Check your email for a verification link',
          requestNew: 'Request a new verification email'
        },
      },
      accountLocked: {
        title: 'Account Temporarily Locked',
        message: 'Your account has been temporarily locked due to multiple failed login attempts.',
        action: 'Contact Support',
        suggestions: {
          waitTime: 'Wait 15 minutes before trying again',
          contactSupport: 'Contact support if the issue persists'
        },
      },
      insufficientPermissions: {
        title: 'Access Denied',
        message: 'You don\'t have permission to perform this action.',
        action: 'Contact Support',
        suggestions: {
          checkStatus: 'Check your account status',
          contactSupport: 'Contact support for assistance'
        },
      },
      subscriptionRequired: {
        title: 'Premium Feature',
        message: 'This feature requires a premium subscription.',
        action: 'Upgrade Now',
        suggestions: {
          upgradePremium: 'Upgrade to BLONG Premium',
          explorePlans: 'Explore our subscription plans'
        },
      },
      general: {
        title: 'Authentication Error',
        message: 'Unable to authenticate. Please try again.',
        action: 'Retry',
        suggestions: {
          tryAgain: 'Try signing in again',
          checkCredentials: 'Verify your login information',
          contactSupport: 'Contact support if needed'
        },
      },
    },

    // Validation errors
    validation: {
      title: 'Invalid Information',
      message: 'Please check your information and try again.',
      action: 'Fix Errors',
      suggestions: {
        reviewFields: 'Review the highlighted fields',
        requiredInfo: 'Ensure all required information is provided',
        correctFormat: 'Check that data is in the correct format'
      },
    },
    emailExists: {
      title: 'Email Already Registered',
      message: 'An account with this email address already exists.',
      action: 'Sign In Instead',
      suggestions: {
        signInInstead: 'Try signing in instead',
        differentEmail: 'Use a different email address',
        resetPassword: 'Reset your password if forgotten'
      },
    },
    weakPassword: {
      title: 'Password Too Weak',
      message: 'Your password doesn\'t meet our security requirements.',
      action: 'Strengthen Password',
      suggestions: {
        minLength: 'Use at least 8 characters',
        mixedCase: 'Include uppercase and lowercase letters',
        numbersSpecial: 'Add numbers and special characters'
      },
    },
    fieldError: {
      email: 'Please enter a valid email address',
      password: 'Password must be at least 8 characters',
      firstName: 'First name is required',
      lastName: 'Last name is required',
      dateOfBirth: 'Please select your date of birth',
      gender: 'Please select your gender',
      country: 'Please select your country',
      city: 'Please enter your city',
      occupation: 'Please enter your occupation',
      education: 'Please select your education level',
    },

    // Server errors
    server: {
      critical: {
        title: 'Service Unavailable',
        message: 'Our servers are temporarily unavailable. Please try again later.',
        action: 'Try Later',
        suggestions: {
          tryLater: 'Try again in a few minutes',
          checkStatus: 'Check our status page for updates',
          contactSupport: 'Contact support for assistance'
        },
      },
      general: {
        title: 'Server Error',
        message: 'Something went wrong on our end. Our team has been notified.',
        action: 'Retry',
        suggestions: {
          tryAgain: 'Try again in a few minutes',
          teamNotified: 'Our team has been automatically notified',
          contactSupport: 'Contact support if the issue persists'
        },
      },
      maintenance: {
        title: 'Scheduled Maintenance',
        message: 'BLONG is currently undergoing scheduled maintenance.',
        action: 'Check Back Later',
        suggestions: {
          scheduledMaintenance: 'This is planned maintenance',
          checkBack: 'Check back in a few minutes',
          followUpdates: 'Follow our social media for updates'
        },
      },
      rateLimited: {
        title: 'Too Many Requests',
        message: 'You\'re making requests too quickly. Please slow down.',
        action: 'Wait and Retry',
        suggestions: {
          slowDown: 'Wait a moment before trying again',
          avoidRapid: 'Avoid rapid repeated actions'
        },
      },
    },

    // Permission errors
    permission: {
      camera: {
        title: 'Camera Access Required',
        message: 'Please allow camera access to take photos for your profile.',
        action: 'Open Settings',
        suggestions: {
          openSettings: 'Open Settings and enable camera access',
          whyNeeded: 'Camera access is needed for profile photos'
        },
      },
      location: {
        title: 'Location Access Required',
        message: 'Please allow location access to find venues near you.',
        action: 'Open Settings',
        suggestions: {
          openSettings: 'Open Settings and enable location access',
          whyNeeded: 'Location helps us find better date venues'
        },
      },
      notifications: {
        title: 'Notification Permission',
        message: 'Enable notifications to stay updated on your dates and matches.',
        action: 'Enable Notifications',
        suggestions: {
          enableNotifications: 'Enable notifications in Settings',
          stayUpdated: 'Get notified about important updates'
        },
      },
    },

    // Unknown errors
    unknown: {
      title: 'Unexpected Error',
      message: 'An unexpected error occurred. Please try again.',
      action: 'Retry',
      suggestions: {
        tryAgain: 'Try again later',
        restartApp: 'Restart the app if the issue persists',
        contactSupport: 'Contact support for help'
      },
    },

    // Profile specific errors
    profile: {
      saveError: {
        title: 'Profile Save Failed',
        message: 'We couldn\'t save your profile changes. Please try again.',
        action: 'Try Again',
        suggestions: {
          checkConnection: 'Check your internet connection',
          reviewChanges: 'Review your changes',
          tryAgain: 'Try saving again'
        },
      },
      imageUploadError: {
        title: 'Image Upload Failed',
        message: 'We couldn\'t upload your image. Please try again.',
        action: 'Try Again',
        suggestions: {
          checkSize: 'Ensure image is under 5MB',
          checkFormat: 'Use JPG or PNG format',
          tryAgain: 'Try uploading again'
        },
      },
      incompleteProfile: {
        title: 'Profile Incomplete',
        message: 'Please complete all required fields before continuing.',
        action: 'Complete Profile',
        suggestions: {
          requiredFields: 'Fill in all required fields',
          betterMatches: 'Complete profile helps find better matches'
        },
      },
    },

    // Network indicators
    network: {
      indicator: 'Network connection restored',
    },

    // Error details and actions
    details: {
      showDetails: 'Show Details',
      hideDetails: 'Hide Details',
      copyDetails: 'Copy Details', 
      shareReport: 'Share Error Report',
      copied: 'Error details copied to clipboard',
      technicalDetails: 'Technical Details',
      errorType: 'Error Type',
      timestamp: 'Timestamp',
      platform: 'Platform',
    },

    // Support and help
    support: {
      contactSupport: 'Contact Support',
      reportBug: 'Report Bug',
      helpCenter: 'Help Center',
      getHelp: 'Get Help',
      howToGetHelp: 'How would you like to get assistance with this issue?',
    },

    // Retry and recovery
    retry: {
      tryAgain: 'Try Again',
      retrying: 'Retrying...',
      retryIn: 'Retry in {{seconds}} seconds',
      maxRetriesReached: 'Maximum retry attempts reached',
      retryLater: 'Please try again later',
    },
  },

  // Form validation
  validation: {
    formErrors: 'Form Validation Failed',
    pleaseFix: 'Please fix the errors below',
    mustBe18: 'You must be at least 18 years old to register',
    genderRequired: 'Please select your gender',
    dobRequired: 'Please select your date of birth',
    countryRequired: 'Please enter your country',
    cityRequired: 'Please enter your city',
    maritalStatusRequired: 'Marital status is required',
    hasChildrenRequired: 'Please specify if you have children',
    wantChildrenRequired: 'Please specify if you want children',
    email: {
      required: 'Email address is required',
      invalid: 'Please enter a valid email address',
    },
    password: {
      required: 'Password is required',
      minLength: 'Password must be at least 8 characters',
    },
    firstName: {
      required: 'First name is required',
      invalid: 'Please enter a valid first name',
    },
    lastName: {
      required: 'Last name is required',
      invalid: 'Please enter a valid last name',
    },
    confirmPassword: {
      required: 'Please confirm your password',
      mismatch: 'Passwords do not match',
    },
    dateOfBirth: {
      required: 'Date of birth is required',
      mustBe18: 'You must be at least 18 years old to register',
    },
    gender: {
      required: 'Please select your gender',
    },
    // Profile completion validation
    fillBasicInfo: 'Please fill in the basic information',
    selectCountryCity: 'Please select your country and city',
    requiredFields: 'Required Fields',
    maritalStatusRequired: 'Marital status is required',
    hasChildrenRequired: 'Please specify if you have children',
    wantChildrenRequired: 'Please specify if you want children',
  },

  // Main app
  dashboard: {
    welcome: 'Welcome to BLONG',
    subtitle: 'Your elite matrimonial experience',
    featuredProfiles: 'FEATURED PROFILES',
    compatibilityAnalysis: 'COMPATIBILITY ANALYSIS',
    takeAction: 'TAKE ACTION',
    premiumFeatures: 'PREMIUM FEATURES',
  },

  // Settings
  settings: {
    title: 'Settings',
    appearance: 'Appearance',
    language: 'Language',
    accessibility: 'Accessibility',
    account: 'Account',
    privacy: 'Privacy',
    notifications: 'Notifications',
    signOut: 'Sign Out',
  },

  // Actions
  actions: {
    pass: 'PASS',
    connect: 'CONNECT',
    like: 'Like',
    superLike: 'Super Like',
    feedback: 'Feedback',
    call: 'Call',
    videoCall: 'Video Call',
  },

  // Premium features
  premium: {
    title: 'BLONG ELITE',
    subtitle: 'Exclusive access to verified profiles, priority service, and concierge experience',
    upgradeNow: 'UPGRADE NOW',
    features: {
      verifiedProfiles: 'Verified Profiles',
      priorityService: 'Priority Service',
      conciergeService: 'Concierge Service',
      unlimitedLikes: 'Unlimited Likes',
      advancedFilters: 'Advanced Filters',
      readReceipts: 'Read Receipts',
    },
  },



  // Profile completion flow
  profile: {
    completion: {
      // Step titles and subtitles
      essentials: 'Essential Information',
      essentialsSubtitle: 'Basic details and location to get started',
      preferences: 'Your Preferences', 
      preferencesSubtitle: 'What matters to you in a relationship',
      details: 'Profile Details',
      detailsSubtitle: 'Complete your profile with additional information',
      
      basics: 'Basic Information',
      basicsSubtitle: 'Tell us about yourself',
      basicInfo: 'Basic Information',
      basicInfoSubtitle: 'Tell us about yourself',
      location: 'Location',
      locationSubtitle: 'Where are you located?',
      physical: 'Physical Details',
      physicalSubtitle: 'Optional physical information',
      professional: 'Professional Life',
      professionalSubtitle: 'Your career and education',
      personal: 'Personal Background',
      personalSubtitle: 'Lifestyle and preferences',
      lifestyle: 'Lifestyle & Preferences',
      lifestyleSubtitle: 'Your lifestyle and personal preferences',
      additional: 'Additional Information',
      additionalSubtitle: 'Complete your profile',
      
      // Navigation
      step: 'Step',
      of: 'of',
      saving: 'Saving',
      savingSubtitle: 'Please wait while we securely save your information...',
      retrySubtitle: 'Attempting to reconnect and save your data',
      processing: 'Processing your information...',
      validating: 'Validating information...',
      finalizing: 'Finalizing your profile...',

      // Completion messages
      profileComplete: 'Profile Complete!',
      profileCompleteMessage: 'Your profile has been successfully completed. You can now start requesting dates!',
      errorSaving: 'There was an error saving your profile. Please try again.',
      retryPrompt: 'Failed to save profile. Would you like to retry?',
      attemptIndicator: 'Attempt {{current}} of {{max}}',
    },
    
    // Form fields
    form: {
      // Basic info
      dateOfBirth: 'Date of Birth',
      dateOfBirthPlaceholder: 'Select your date of birth',
      gender: 'Gender',
      genderPlaceholder: 'Select your gender',
      
      // Gender options
      male: 'Male',
      female: 'Female',
      nonBinary: 'Non-binary',
      other: 'Other',
      
      // Physical
      height: 'Height',
      heightPlaceholder: 'Height in cm (optional)',
      weight: 'Weight',
      weightPlaceholder: 'Weight in kg (optional)',
      
      // Professional
      occupation: 'Occupation',
      occupationPlaceholder: 'What do you do for work? (optional)',
      education: 'Education',
      educationPlaceholder: 'Your education level (optional)',
      
      // Personal
      maritalStatus: 'Marital Status',
      maritalStatusPlaceholder: 'Select your marital status (optional)',
      hasChildren: 'Has Children',
      wantChildren: 'Want Children',
      smoking: 'Smoking',
      drinking: 'Drinking',
      
      // Marital status options
      single: 'Single',
      divorced: 'Divorced',
      widowed: 'Widowed',
      separated: 'Separated',
      
      // Additional
      interests: 'Interests',
      interestsPlaceholder: 'Select your interests (optional)',
      languages: 'Languages',
      languagesPlaceholder: 'Languages you speak (optional)',
      religion: 'Religion',
      religionPlaceholder: 'Your religion (optional)',
      ethnicity: 'Ethnicity',
      ethnicityPlaceholder: 'Your ethnicity (optional)',
      
      // Interest options
      travel: 'Travel',
      reading: 'Reading',
      sports: 'Sports',
      music: 'Music',
      movies: 'Movies',
      cooking: 'Cooking',
      art: 'Art',
      photography: 'Photography',
      dancing: 'Dancing',
      hiking: 'Hiking',
      fitness: 'Fitness',
      gaming: 'Gaming',
      technology: 'Technology',
      fashion: 'Fashion',
      food: 'Food',
    },
  },

  // Geolocation and form components
  location: {
    detecting: 'Detecting your location...',
    detectingSubtitle: 'We\'re automatically finding your location to provide better date venues nearby.',
    detected: 'Location detected successfully!',
    detectionError: 'Couldn\'t detect location',
    detectionErrorSubtitle: 'We couldn\'t automatically detect your location. You can try again or enter it manually.',
    findVenues: 'Find better venues nearby',
    findVenuesSubtitle: 'We can automatically detect your location to show you date venues in your area.',
    detectButton: 'Detect my location',
    editManually: 'Edit manually',
    enterManually: 'Enter manually',
    enterManuallyInstead: 'Enter manually instead',
    detectAgain: 'Detect again',
    tryAgain: 'Try again',
    locationCaptured: 'Location information captured',
    
    // Form fields
    country: 'Country',
    countryPlaceholder: 'Enter your country',
    city: 'City',
    cityPlaceholder: 'Enter your city',
    region: 'Region/State',
    regionPlaceholder: 'Enter your region or state (optional)',
    district: 'District/Neighborhood',
    districtPlaceholder: 'Enter your district or neighborhood (optional)',
    postalCode: 'Postal Code',
    postalCodePlaceholder: 'Enter your postal code (optional)',
  },

  // Form components
  form: {
    // Date picker
    selectDate: 'Select your date of birth',
    cancel: 'Cancel',
    done: 'Done',
    
    // Multi-select
    selected: 'selected',
    
    // General
    required: 'Required',
    optional: 'Optional',
  },

  // Settings screens
  settings: {
    title: 'Settings',
    subtitle: 'Manage your account and preferences',
    loading: 'Loading Settings',
    loadingSubtitle: 'Preparing your preferences',
    
    // User profile card
    phaseNotSelected: 'Phase not selected',
    
    // Settings sections
    account: 'Account',
    privacySecurity: 'Privacy & Security',
    support: 'Support',
    
    // Account items
    editProfile: 'Edit Profile',
    editProfileSubtitle: 'Update your personal information',
    preferences: 'Preferences',
    preferencesSubtitle: 'Language and relationship phase settings',
    
    // Privacy & Security items
    privacySettings: 'Privacy Settings',
    privacySettingsSubtitle: 'Control your privacy and visibility',
    security: 'Security',
    securitySubtitle: 'Password and account security',
    
    // Support items
    helpSupport: 'Help & Support',
    helpSupportSubtitle: 'Get help and contact support',
    about: 'About BLONG',
    aboutSubtitle: 'App version and information',
    
    // Logout
    logout: 'Logout',
    loggingOut: 'Logging out...',
    logoutConfirm: 'Are you sure you want to logout?',
  },

  // Help & Support
  help: {
    faq: {
      howDating: 'How does BLONG date delivery work?',
      howDatingAnswer: 'BLONG uses advanced AI algorithms to analyze your personality and preferences to curate perfect date experiences at amazing venues.',
      dataSecure: 'Is my data secure?',
      dataSecureAnswer: 'Yes, we use industry-standard encryption and security measures to protect your personal information and ensure your privacy.',
      improveDates: 'How can I get better date recommendations?',
      improveDatesAnswer: 'Complete your personality assessment, add detailed profile information, and regularly update your preferences to get better date recommendations.',
      changePhase: 'Can I change my relationship phase?',
      changePhaseAnswer: 'Yes, you can update your relationship phase in the Preferences section of Settings at any time.',
      reportBehavior: 'How do I report inappropriate behavior?',
      reportBehaviorAnswer: 'You can report any inappropriate behavior through the profile menu or by contacting our support team directly.',
    },
    
    contact: {
      emailSupport: 'Email Support',
      emailSupportSubtitle: 'Get help via email',
      phone: 'Phone Support',
      phoneSubtitle: 'Call us for immediate assistance',
      support: 'Support Center',
      supportSubtitle: 'Get help from our support team',
    },
  },

  // Validation messages (merged with form validation)
  validationMessages: {
    fillBasicInfo: 'Please fill in the basic information',
    selectCountryCity: 'Please select your country and city',
    requiredFields: 'Required Fields',
  },

  // App general
  app: {
    name: 'BLONG',
  },

  // Navigation
  navigation: {
    home: 'Home',
    dates: 'Dates',
    personality: 'Personality',
    articles: 'Articles',
    settings: 'Settings',
  },

  // Network Status
  network: {
    online: 'Online',
    offline: 'Offline',
    connected: 'Connected',
    connecting: 'Connecting...',
    reconnecting: 'Reconnecting...',
    connectionRestored: 'Connection restored',
    connectionLost: 'Connection lost',
    connectionStable: 'Connection stable',
    noConnection: 'No internet connection',
    weakConnection: 'Weak connection detected',
    connectionType: 'Connection type',
    processingQueue: 'Processing {{count}} queued actions...',
    queuedActions: '{{count}} actions queued for when online',
    retryConnection: 'Retry Connection',
    checkConnection: 'Check Connection',
    offlineMode: 'Offline Mode',
    offlineModeDescription: 'You\'re currently offline. Actions will be saved and processed when connection is restored.',
    queueStatus: 'Queue Status',
    queueEmpty: 'No pending actions',
    queueProcessing: 'Processing queued actions...',
    queueCompleted: 'All queued actions completed',
    queueFailed: 'Some actions failed to process',
  },

  // Success messages
  success: {
    success: 'Success!',
    operationCompleted: 'Operation completed successfully',
    profileUpdated: 'Profile updated successfully',
    profileUpdatedMessage: 'Your profile information has been saved and updated',
    feedbackSent: 'Feedback sent',
    feedbackSentMessage: 'Thank you for your feedback! We appreciate your input',
    dateAvailable: 'New date available!',
    dateBooked: 'Date successfully booked',
    dateBookedMessage: 'Your date has been confirmed and scheduled',
    preferencesUpdated: 'Preferences updated successfully',
    preferencesUpdatedMessage: 'Your preferences have been saved and will be applied',
    quizCompleted: 'Quiz completed successfully!',
    quizCompletedMessage: 'Your personality assessment has been completed and analyzed',
    assessmentSaved: 'Assessment progress saved',
    assessmentCompleted: 'Assessment completed!',
    assessmentCompletedMessage: 'Your comprehensive assessment is now complete',
    photoUploaded: 'Photo uploaded successfully',
    photoUploadedMessage: 'Your photo has been uploaded and processed',
    paymentProcessed: 'Payment processed successfully',
    paymentProcessedMessage: 'Your payment has been confirmed and processed',
    emailVerified: 'Email verified successfully',
    emailVerifiedMessage: 'Your email address has been verified and confirmed',
    passwordChanged: 'Password changed successfully',
    passwordChangedMessage: 'Your password has been updated and secured',
    accountCreated: 'Account created successfully',
    accountCreatedMessage: 'Welcome to BLONG! Your account is ready to use',
    dataSynced: 'Data synchronized',
    dataSyncedMessage: 'Your data has been synchronized across all devices',
    backupCreated: 'Backup created successfully',
    backupCreatedMessage: 'Your data has been safely backed up',
    settingsSaved: 'Settings saved',
    settingsSavedMessage: 'Your settings have been saved and applied',
  },

  // Photo Upload
  photoUpload: {
    selectPhoto: 'Select Photo',
    selectPhotoDescription: 'Choose how you\'d like to add a photo',
    takePhoto: 'Take Photo',
    chooseFromGallery: 'Choose from Gallery',
    processing: 'Processing Image',
    processingDescription: 'Optimizing your photo for the best quality...',
    cameraError: 'Camera Error',
    cameraErrorMessage: 'Unable to access camera. Please check permissions.',
    galleryError: 'Gallery Error',
    galleryErrorMessage: 'Unable to access photo gallery. Please check permissions.',
    processingError: 'Processing Error',
    processingErrorMessage: 'Failed to process the selected image.',
    fileTooLarge: 'File too large. Maximum size is {{size}}MB.',
    invalidFormat: 'Invalid format. Supported formats: {{formats}}',
    uploadError: 'Upload failed',
    uploadErrorMessage: 'Failed to upload photo. Please try again.',
    uploadSuccess: 'Photo uploaded successfully',
    uploadSuccessMessage: 'Your photo has been uploaded and processed.',
  },

  // Compatibility & Matching
  compatibility: {
    score: 'Compatibility Score',
    breakdown: 'Compatibility Breakdown',
    personality: 'Personality',
    preferences: 'Preferences',
    values: 'Values',
    interaction: 'Interaction',
    insights: 'AI Insights',
    conversationStarters: 'Conversation Starters',
    suggestedVenues: 'Suggested Date Venues',
    strengths: 'Relationship Strengths',
    challenges: 'Areas to Navigate',
    arrangeDate: 'Arrange Date',
    learnMore: 'Learn More',
    exceptional: 'Exceptional',
    excellent: 'Excellent',
    good: 'Good',
    moderate: 'Moderate',
    challenging: 'Challenging',
    personalityCompatibility: 'Personality Compatibility',
    valueAlignment: 'Value Alignment',
    lifestyleMatch: 'Lifestyle Match',
    communicationStyle: 'Communication Style',
    relationshipGoals: 'Relationship Goals',
    familyValues: 'Family Values',
    religiousViews: 'Religious Views',
    educationLevel: 'Education Level',
    careerAmbitions: 'Career Ambitions',
    socialPreferences: 'Social Preferences',
    conflictResolution: 'Conflict Resolution',
    emotionalIntelligence: 'Emotional Intelligence',
    trustAndSecurity: 'Trust & Security',
    intimacyAndAffection: 'Intimacy & Affection',
    sharedInterests: 'Shared Interests',
    complementaryTraits: 'Complementary Traits',
    growthPotential: 'Growth Potential',
    longTermCompatibility: 'Long-term Compatibility',
    dateRecommendation: 'Date Recommendation',
    venuePreferences: 'Venue Preferences',
    activitySuggestions: 'Activity Suggestions',
    timingRecommendations: 'Timing Recommendations',
    conversationTopics: 'Conversation Topics',
    relationshipAdvice: 'Relationship Advice',
    compatibilityReport: 'Compatibility Report',
    detailedAnalysis: 'Detailed Analysis',
    aiInsights: 'AI-Powered Insights',
    personalityProfile: 'Personality Profile',
    matchingAlgorithm: 'Matching Algorithm',
    compatibilityFactors: 'Compatibility Factors',
    relationshipPrediction: 'Relationship Prediction',
    successProbability: 'Success Probability',
    recommendationConfidence: 'Recommendation Confidence',
  },

  // Quiz System - Complete Implementation
  quiz: {
    intro: {
      title: 'Personality Assessment',
      subtitle: 'Discover your unique personality traits',
      startButton: 'Start Assessment',
      continueButton: 'Continue Assessment',
      viewResultsButton: 'View Your Results',
      features: {
        bigFive: {
          title: 'Big Five Traits',
          description: 'Analyze your fundamental personality characteristics'
        },
        loveLanguages: {
          title: 'Love Languages',
          description: 'Discover how you express and receive love'
        },
        compatibility: {
          title: 'Compatibility Analysis',
          description: 'Understand your relationship compatibility patterns'
        }
      },
      estimatedTime: 'Estimated time: {{minutes}} minutes',
      questionsCount: '{{count}} comprehensive questions',
      privacyNote: 'Your responses are private and secure'
    },
    session: {
      starting: 'Starting your personality journey...',
      loading: 'Loading next question...',
      saving: 'Saving your progress...',
      completing: 'Completing your assessment...',
      error: 'Failed to start quiz session. Please try again.',
      submitError: 'Failed to submit answer. Please try again.',
      connectionError: 'Connection error. Please check your internet and try again.',
      resumeSession: 'Resume your previous session?',
      newSession: 'Start a new assessment'
    },
    navigation: {
      next: 'Next Question',
      previous: 'Previous Question',
      skip: 'Skip Question',
      skipConfirm: 'Are you sure you want to skip this question?',
      skipWarning: 'Skipped questions may affect the accuracy of your results.',
      finish: 'Finish Assessment',
      cancel: 'Cancel',
      exitConfirm: 'Exit Assessment?',
      exitMessage: 'Your progress will be saved automatically.',
      saveAndExit: 'Save & Exit'
    },
    progress: {
      question: 'Question {{current}} of {{total}}',
      section: 'Section {{current}} of {{total}}',
      completion: '{{percentage}}% Complete',
      timeRemaining: '{{minutes}} minutes remaining',
      questionsAnswered: '{{answered}} of {{total}} answered',
      currentSection: 'Current section: {{section}}'
    },
    personality: {
      traits: {
        openness: 'Openness to Experience',
        conscientiousness: 'Conscientiousness',
        extraversion: 'Extraversion',
        agreeableness: 'Agreeableness',
        neuroticism: 'Emotional Stability'
      },
      scores: {
        veryLow: 'Very Low',
        low: 'Low',
        moderate: 'Moderate',
        high: 'High',
        veryHigh: 'Very High'
      },
      insights: {
        openness: {
          high: 'You are imaginative, creative, and open to new experiences.',
          low: 'You prefer routine and traditional approaches to life.'
        },
        conscientiousness: {
          high: 'You are organized, disciplined, and goal-oriented.',
          low: 'You tend to be more spontaneous and flexible in your approach.'
        },
        extraversion: {
          high: 'You are outgoing, energetic, and enjoy social interactions.',
          low: 'You prefer quieter environments and smaller social groups.'
        },
        agreeableness: {
          high: 'You are cooperative, trusting, and considerate of others.',
          low: 'You tend to be more competitive and skeptical of others.'
        },
        neuroticism: {
          high: 'You are emotionally stable and handle stress well.',
          low: 'You may be more sensitive to stress and emotional changes.'
        }
      }
    },
    results: {
      title: 'Your Personality Profile',
      subtitle: 'Based on your responses, here\'s your unique personality analysis',
      shareTitle: 'My BLONG Personality Results',
      shareMessage: 'I just completed my personality assessment on BLONG! Check out my results.',
      retakeButton: 'Retake Assessment',
      saveResults: 'Save Results',
      requestDate: 'Request a Date',
      detailedAnalysis: 'View Detailed Analysis',
      personalityType: 'Your personality type: {{type}}',
      overallScore: 'Overall compatibility score: {{score}}%'
    }
  },

  // Alert and Error System
  alerts: {
    errors: {
      quizFailed: 'Failed to start quiz session. Please try again.',
      loadFailed: 'Failed to load data. Please try again.',
      profileSaveFailed: 'Failed to save profile. Please try again.',
      connectionFailed: 'Connection failed. Please check your internet connection.',
      sessionExpired: 'Your session has expired. Please log in again.',
      permissionDenied: 'Permission denied. Please check your settings.',
      validationFailed: 'Please check your input and try again.',
      unknownError: 'An unexpected error occurred. Please try again.',
      networkTimeout: 'Request timed out. Please try again.',
      serverError: 'Server error. Please try again later.',
      storageError: 'Failed to save data locally. Please check your device storage.',
      cameraError: 'Camera access denied. Please enable camera permissions.',
      locationError: 'Location access denied. Please enable location permissions.',

      // BLONG-specific errors
      profileIncomplete: 'Please complete your profile before proceeding.',
      quizSessionExpired: 'Your quiz session has expired. Your progress has been saved.',
      venueUnavailable: 'The selected venue is no longer available for your preferred date.',
      compatibilityCalculationFailed: 'We couldn\'t calculate your compatibility score at this time.',
      paymentProcessingFailed: 'We couldn\'t process your payment. Your card was not charged.',

      // Context-aware error messages
      profileSaveOffline: 'Unable to save your profile due to connection issues. Your changes are preserved locally.',
      quizSubmissionOffline: 'Your quiz answers couldn\'t be submitted. Don\'t worry, your progress is saved.',
      dateBookingOffline: 'Unable to book your date due to connection issues. The venue is still available.',
      compatibilityOffline: 'We\'re having trouble calculating compatibility scores right now.',

      // Recovery guidance
      recoverySteps: 'How to fix this:',
      assessmentError: 'Failed to load assessment. Please try again.',
      paymentError: 'Payment processing failed. Please try again.',
      bookingError: 'Failed to book date. Please try again.',
      uploadError: 'Failed to upload image. Please try again.',
      deleteError: 'Failed to delete item. Please try again.',
      updateError: 'Failed to update information. Please try again.',
      syncError: 'Failed to sync data. Please check your connection.',
      backupError: 'Failed to backup data. Please try again later.',
      restoreError: 'Failed to restore data. Please try again.',
      exportError: 'Failed to export data. Please try again.',
      importError: 'Failed to import data. Please check the file format.',
      subscriptionError: 'Subscription error. Please contact support.',
      premiumRequired: 'This feature requires BLONG Premium subscription.',
      accountLocked: 'Account temporarily locked. Please contact support.',
      tooManyAttempts: 'Too many attempts. Please try again later.'
    },
    success: {
      feedbackSent: 'Your feedback has been sent. Thank you!',
      profileUpdated: 'Profile updated successfully!',
      preferencesUpdated: 'Preferences updated successfully!',
      assessmentCompleted: 'Assessment completed successfully!',
      photoUploaded: 'Photo uploaded successfully!',
      dateAvailable: 'New date opportunity available!',
      dateBooked: 'Date booked successfully!',
      paymentProcessed: 'Payment processed successfully!',
      passwordChanged: 'Password changed successfully!',
      emailVerified: 'Email verified successfully!',
      accountCreated: 'Account created successfully!',
      subscriptionUpdated: 'Subscription updated successfully!',
      dataExported: 'Data exported successfully!',
      dataImported: 'Data imported successfully!',
      backupCreated: 'Backup created successfully!',
      dataRestored: 'Data restored successfully!',
      settingsSaved: 'Settings saved successfully!',
      notificationsSent: 'Notifications sent successfully!'
    },
    warnings: {
      unsavedChanges: 'You have unsaved changes. Are you sure you want to leave?',
      deleteConfirm: 'Are you sure you want to delete this item?',
      permanentAction: 'This action cannot be undone.',
      dataLoss: 'This action may result in data loss.',
      offlineMode: 'You are currently offline. Some features may not be available.',
      lowStorage: 'Device storage is low. Please free up some space.',
      expiringSoon: 'Your subscription expires soon. Renew to continue enjoying premium features.',
      incompleteProfile: 'Complete your profile to get better date recommendations.',
      locationDisabled: 'Location services are disabled. Enable them for better venue recommendations.',
      notificationDisabled: 'Notifications are disabled. You may miss important updates.'
    },
    info: {
      loading: 'Please wait while we process your request...',
      processing: 'Processing your information...',
      syncing: 'Syncing your data...',
      connecting: 'Connecting to server...',
      uploading: 'Uploading files...',
      downloading: 'Downloading content...',
      analyzing: 'Analyzing your compatibility...',
      searching: 'Finding perfect venues...',
      optimizing: 'Optimizing your experience...',
      updating: 'Updating your information...',
      verifying: 'Verifying your details...',
      authenticating: 'Authenticating your account...'
    }
  },

  // Date and Time Formatting
  dateTime: {
    formats: {
      short: 'MM/dd/yyyy',
      medium: 'MMM dd, yyyy',
      long: 'MMMM dd, yyyy',
      full: 'EEEE, MMMM dd, yyyy',
      time: 'h:mm a',
      dateTime: 'MMM dd, yyyy h:mm a'
    },
    relative: {
      now: 'just now',
      minuteAgo: '1 minute ago',
      minutesAgo: '{{count}} minutes ago',
      hourAgo: '1 hour ago',
      hoursAgo: '{{count}} hours ago',
      dayAgo: '1 day ago',
      daysAgo: '{{count}} days ago',
      weekAgo: '1 week ago',
      weeksAgo: '{{count}} weeks ago',
      monthAgo: '1 month ago',
      monthsAgo: '{{count}} months ago',
      yearAgo: '1 year ago',
      yearsAgo: '{{count}} years ago'
    },
    calendar: {
      today: 'Today',
      tomorrow: 'Tomorrow',
      yesterday: 'Yesterday',
      thisWeek: 'This week',
      nextWeek: 'Next week',
      lastWeek: 'Last week',
      thisMonth: 'This month',
      nextMonth: 'Next month',
      lastMonth: 'Last month'
    }
  },

  // Notifications System
  notifications: {
    types: {
      dateConfirmed: 'Date Confirmed!',
      timeToPrep: 'Time to prepare!',
      feedback: 'How did it go?',
      dateAvailable: 'New date opportunity available!',
      dateUpdate: 'Date update received',
      profileViewed: 'Someone viewed your profile',
      subscriptionExpiring: 'Subscription expiring soon',
      assessmentReminder: 'Complete your personality assessment',
      dateReminder: 'You have a date coming up',
      paymentDue: 'Payment due soon'
    },
    actions: {
      view: 'View',
      dismiss: 'Dismiss',
      remind: 'Remind me later',
      markRead: 'Mark as read',
      markAllRead: 'Mark all as read',
      settings: 'Notification settings'
    }
  },

  // Safety & Security
  safety: {
    dashboard: {
      title: 'Safety Center',
    },
    status: {
      title: 'Safety Status',
      verification: 'Profile Verification',
      threatLevel: 'Threat Level',
      activeCheckIns: 'Active Check-ins',
      active: 'active',
    },
    verification: {
      basic: 'Basic verification',
      verified: 'Fully verified',
      upgrade: 'Upgrade',
      requested: 'Verification requested successfully',
    },
    threatLevel: {
      low: 'Low risk',
      medium: 'Medium risk',
      high: 'High risk',
      critical: 'Critical risk',
    },
    emergency: {
      title: 'Emergency',
      alert: 'Emergency Alert',
      confirm: 'Send Alert',
      confirmTitle: 'Emergency Alert',
      confirmMessage: 'This will immediately notify your emergency contacts and local authorities. Only use in genuine emergencies.',
      confirmDescription: 'Emergency services and your safety contacts will be notified immediately.',
      sending: 'Sending Alert...',
      alertSent: 'Emergency Alert Sent',
      alertSentMessage: 'Your emergency alert has been sent to {{contacts}} contacts. Emergency services: {{emergency}}',
      alertFailed: 'Failed to send emergency alert',
      helpOnWay: 'Help is on the way. Stay safe.',
    },
    checkIn: {
      title: 'Safety Check-In',
      start: 'Start Safety Check-In',
      started: 'Safety check-in started successfully',
      startFailed: 'Failed to start safety check-in',
      loadFailed: 'Failed to load check-in data',
      updateFailed: 'Failed to update check-in status',
      endFailed: 'Failed to end check-in',
      initializing: 'Initializing safety check-in...',
      actions: 'How are you doing?',
      nextCheckIn: 'until next check-in',
      dueTitle: 'Safety Check-In',
      dueMessage: 'Time for your safety check-in. How are you doing?',
      imSafe: 'I\'m Safe',
      delayed: 'Running Late',
      needHelp: 'Need Help',
      emergency: 'Emergency',
      end: 'End Check-In',
      endTitle: 'End Safety Check-In',
      endMessage: 'Are you sure you want to end your safety check-in?',
      endConfirm: 'End Check-In',
      ended: 'Safety check-in ended successfully',
      statusUpdated: 'Check-in status updated',
      status: {
        safe: 'Safe',
        delayed: 'Delayed',
        help_needed: 'Help Needed',
        emergency: 'Emergency',
        no_response: 'No Response',
      },
    },
    features: {
      title: 'Safety Features',
      enabled: '{{feature}} enabled',
      disabled: '{{feature}} disabled',
      updateFailed: 'Failed to update safety feature',
      threatDetection: 'Threat Detection',
      threatDetectionDescription: 'AI-powered monitoring for suspicious behavior',
      locationSharing: 'Location Sharing',
      locationSharingDescription: 'Share your location with emergency contacts',
      autoCheckIn: 'Auto Check-In',
      autoCheckInDescription: 'Automatic safety check-ins during dates',
      incognitoMode: 'Incognito Mode',
      incognitoModeDescription: 'Enhanced privacy and anonymity',
    },
    loading: 'Loading safety data...',
  },

  };
