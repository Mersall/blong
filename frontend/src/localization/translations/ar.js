/**
 * BLONG Arabic Translations (العربية)
 * Complete Arabic language pack with RTL support
 */

export default {
  common: {
    continue: 'متابعة',
    back: 'رجوع',
    next: 'التالي',
    skip: 'تخطي',
    done: 'تم',
    save: 'حفظ',
    cancel: 'إلغاء',
    loading: 'جاري التحميل...',
    error: 'حدث خطأ ما',
    success: 'نجح!',
    retry: 'حاول مرة أخرى',
    tryAgain: 'حاول مرة أخرى',
    ok: 'موافق',
    processing: 'جاري المعالجة...',
    changing: 'جاري التغيير...',
    notSelected: 'غير محدد',
    notNow: 'ليس الآن',
    viewDetails: 'عرض التفاصيل',
    
    // Form fields
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    name: 'الاسم',
    phone: 'رقم الهاتف',
  },

  // Onboarding flow
  onboarding: {
    // Brand
    brand: 'بلونغ',
    brandSubtitle: 'الزواج النخبة',
    tagline: 'زواج النخبة',
    
    // Language selection
    languageTitle: 'اختر لغتك',
    languageSubtitle: 'اختر لغتك المفضلة للحصول على أفضل تجربة',
    languageFooter: 'يمكنك تغيير هذا لاحقاً في الإعدادات',
    
    // Phase selection
    phaseTitle: 'ما هي رحلتك؟',
    phaseSubtitle: 'أخبرنا عن مرحلة علاقتك الحالية',
    phaseFooter: 'هذا يساعدنا في تخصيص تجربتك',
    startJourney: 'ابدأ رحلتك',
    
    // Language options with native names
    languages: {
      english: {
        name: 'الإنجليزية',
        nativeName: 'English',
        description: 'اللغة العالمية',
        flag: '🇺🇸',
      },
      arabic: {
        name: 'العربية',
        nativeName: 'العربية',
        description: 'اللغة العربية',
        flag: '🇸🇦',
      },
      french: {
        name: 'الفرنسية',
        nativeName: 'Français',
        description: 'اللغة الفرنسية',
        flag: '🇫🇷',
      },
      spanish: {
        name: 'الإسبانية',
        nativeName: 'Español',
        description: 'اللغة الإسبانية',
        flag: '🇪🇸',
      },
    },
    
    // Relationship phases
    phases: {
      single: {
        title: 'أعزب',
        subtitle: 'طلب موعد',
        description: 'اطلب موعداً وسيجد الذكاء الاصطناعي لدينا شريكك المثالي، ويحجز مكاناً رائعاً، وينظم كل شيء لك',
        icon: '💝',
      },
      engagement: {
        title: 'خطوبة',
        subtitle: 'التخطيط معاً',
        description: 'مخطوبان وتخططان لمستقبلكما معاً مع شريكك',
        icon: '💍',
      },
      engagement_day_prep: {
        title: 'تحضير يوم الخطوبة',
        subtitle: 'التحضيرات الأخيرة',
        description: 'الاستعداد ليوم خطوبتك مع جميع اللمسات والتحضيرات الأخيرة',
        icon: '✨',
      },
    },
  },

  // Authentication
  auth: {
    loginTitle: 'مرحباً بعودتك',
    loginSubtitle: 'سجل دخولك لمتابعة رحلتك',
    loginButton: 'تسجيل الدخول',
    loginSuccess: 'مرحباً بعودتك!',

    registerTitle: 'إنشاء حسابك',
    registerSubtitle: 'انضم للآلاف الذين يجدون علاقات ذات معنى',
    registerButton: 'إنشاء حساب',
    registerSuccess: 'مرحباً بك في بلونغ!',

    alreadyHaveAccount: 'لديك حساب بالفعل؟',
    dontHaveAccount: 'ليس لديك حساب؟',
    createAccount: 'إنشاء حساب',
    signIn: 'تسجيل الدخول',

    forgotPassword: 'نسيت كلمة المرور؟',
    resetPassword: 'إعادة تعيين كلمة المرور',
    rememberMe: 'تذكرني',

    // Field labels
    firstName: 'الاسم الأول',
    lastName: 'اسم العائلة',
    email: 'عنوان البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',

    // Placeholders
    firstNamePlaceholder: 'أدخل اسمك الأول',
    lastNamePlaceholder: 'أدخل اسم العائلة',
    emailPlaceholder: 'أدخل عنوان بريدك الإلكتروني',
    passwordPlaceholder: 'أدخل كلمة المرور',
    confirmPasswordPlaceholder: 'أكد كلمة المرور',
    dateOfBirthPlaceholder: 'اختر تاريخ ميلادك',
    
    // Additional auth fields
    dateOfBirth: 'تاريخ الميلاد',
    gender: 'الجنس',
    
    // Gender options
    'gender.male': 'ذكر',
    'gender.female': 'أنثى',
    'gender.non_binary': 'غير ثنائي',
    'gender.other': 'آخر',
  },

  // Main app
  dashboard: {
    welcome: 'مرحباً بك في بلونغ',
    subtitle: 'تجربة الزواج النخبة الخاصة بك',
    featuredProfiles: 'الملفات المميزة',
    compatibilityAnalysis: 'تحليل التوافق',
    takeAction: 'اتخذ إجراء',
    premiumFeatures: 'الميزات المميزة',
  },

  // Settings
  settings: {
    title: 'الإعدادات',
    appearance: 'المظهر',
    language: 'اللغة',
    accessibility: 'إمكانية الوصول',
    account: 'الحساب',
    privacy: 'الخصوصية',
    notifications: 'الإشعارات',
    signOut: 'تسجيل الخروج',
  },

  // Actions
  actions: {
    pass: 'تمرير',
    connect: 'اتصال',
    like: 'إعجاب',
    superLike: 'إعجاب فائق',
    message: 'رسالة',
    call: 'اتصال',
    videoCall: 'مكالمة فيديو',
  },

  // Premium features
  premium: {
    title: 'بلونغ النخبة',
    subtitle: 'وصول حصري للملفات المتحققة، مطابقة أولوية، وخدمة الكونسيرج',
    upgradeNow: 'ترقية الآن',
    features: {
      verifiedProfiles: 'ملفات متحققة',
      priorityService: 'خدمة أولوية',
      conciergeService: 'خدمة الكونسيرج',
      unlimitedLikes: 'إعجابات غير محدودة',
      advancedFilters: 'فلاتر متقدمة',
      readReceipts: 'إيصالات القراءة',
    },
  },

  // Error messages
  errors: {
    networkError: 'خطأ في الاتصال بالشبكة',
    serverError: 'خطأ في الخادم، يرجى المحاولة مرة أخرى',
    validationError: 'يرجى التحقق من المدخلات',
    authError: 'فشل في المصادقة',
    permissionError: 'تم رفض الإذن',
  },

  // Profile completion flow
  profile: {
    completion: {
      // Step titles and subtitles
      basicInfo: 'المعلومات الأساسية',
      basicInfoSubtitle: 'أخبرنا عن نفسك',
      location: 'الموقع',
      locationSubtitle: 'أين تقع؟',
      physical: 'التفاصيل الجسدية',
      physicalSubtitle: 'معلومات جسدية اختيارية',
      professional: 'الحياة المهنية',
      professionalSubtitle: 'مهنتك وتعليمك',
      personal: 'الخلفية الشخصية',
      personalSubtitle: 'نمط الحياة والتفضيلات',
      additional: 'معلومات إضافية',
      additionalSubtitle: 'أكمل ملفك الشخصي',
      
      // Navigation
      step: 'خطوة',
      of: 'من',
      saving: 'جاري الحفظ',
      savingSubtitle: 'يرجى الانتظار بينما نحفظ معلوماتك بأمان...',
      retrySubtitle: 'محاولة إعادة الاتصال وحفظ بياناتك',
      processing: 'معالجة معلوماتك...',
      validating: 'التحقق من المعلومات...',
      finalizing: 'إنهاء ملفك الشخصي...',

      // Completion messages
      profileComplete: 'اكتمل الملف الشخصي!',
      profileCompleteMessage: 'تم إكمال ملفك الشخصي بنجاح. يمكنك الآن البدء في العثور على الشريك المناسب!',
      errorSaving: 'حدث خطأ أثناء حفظ ملفك الشخصي. يرجى المحاولة مرة أخرى.',
    },
    
    // Form fields
    form: {
      // Basic info
      dateOfBirth: 'تاريخ الميلاد',
      dateOfBirthPlaceholder: 'اختر تاريخ ميلادك',
      gender: 'الجنس',
      genderPlaceholder: 'اختر جنسك',
      
      // Gender options
      male: 'ذكر',
      female: 'أنثى',
      nonBinary: 'غير ثنائي',
      other: 'آخر',
      
      // Physical
      height: 'الطول',
      heightPlaceholder: 'الطول بالسنتيمتر (اختياري)',
      weight: 'الوزن',
      weightPlaceholder: 'الوزن بالكيلوغرام (اختياري)',
      
      // Professional
      occupation: 'المهنة',
      occupationPlaceholder: 'ما هو عملك؟ (اختياري)',
      education: 'التعليم',
      educationPlaceholder: 'مستوى تعليمك (اختياري)',
      
      // Personal
      maritalStatus: 'الحالة الاجتماعية',
      maritalStatusPlaceholder: 'اختر حالتك الاجتماعية (اختياري)',
      hasChildren: 'لديه أطفال',
      wantChildren: 'يريد أطفال',
      smoking: 'التدخين',
      drinking: 'الشرب',
      
      // Marital status options
      single: 'أعزب',
      divorced: 'مطلق',
      widowed: 'أرمل',
      separated: 'منفصل',
      
      // Additional
      interests: 'الاهتمامات',
      interestsPlaceholder: 'اختر اهتماماتك (اختياري)',
      languages: 'اللغات',
      languagesPlaceholder: 'اللغات التي تتحدثها (اختياري)',
      religion: 'الديانة',
      religionPlaceholder: 'ديانتك (اختياري)',
      ethnicity: 'العرق',
      ethnicityPlaceholder: 'عرقك (اختياري)',
      
      // Interest options
      travel: 'السفر',
      reading: 'القراءة',
      sports: 'الرياضة',
      music: 'الموسيقى',
      movies: 'الأفلام',
      cooking: 'الطبخ',
      art: 'الفن',
      photography: 'التصوير',
      dancing: 'الرقص',
      hiking: 'المشي لمسافات طويلة',
      fitness: 'اللياقة البدنية',
      gaming: 'الألعاب',
      technology: 'التكنولوجيا',
      fashion: 'الموضة',
      food: 'الطعام',
    },
  },

  // Geolocation and form components
  location: {
    detecting: 'جاري تحديد موقعك...',
    detectingSubtitle: 'نحن نجد موقعك تلقائياً لتوفير مطابقات أفضل بالقرب منك.',
    detected: 'تم تحديد الموقع بنجاح!',
    detectionError: 'لا يمكن تحديد الموقع',
    detectionErrorSubtitle: 'لم نتمكن من تحديد موقعك تلقائياً. يمكنك المحاولة مرة أخرى أو إدخاله يدوياً.',
    findVenues: 'ابحث عن أماكن أفضل بالقرب منك',
    findVenuesSubtitle: 'يمكننا تحديد موقعك تلقائياً لإظهار أماكن المواعيد في منطقتك.',
    detectButton: 'حدد موقعي',
    editManually: 'تحرير يدوي',
    enterManually: 'إدخال يدوي',
    enterManuallyInstead: 'إدخال يدوي بدلاً من ذلك',
    detectAgain: 'حدد مرة أخرى',
    tryAgain: 'حاول مرة أخرى',
    locationCaptured: 'تم التقاط معلومات الموقع',
    
    // Form fields
    country: 'البلد',
    countryPlaceholder: 'أدخل بلدك',
    city: 'المدينة',
    cityPlaceholder: 'أدخل مدينتك',
    region: 'المنطقة/الولاية',
    regionPlaceholder: 'أدخل منطقتك أو ولايتك (اختياري)',
    district: 'المقاطعة/الحي',
    districtPlaceholder: 'أدخل مقاطعتك أو حيك (اختياري)',
    postalCode: 'الرمز البريدي',
    postalCodePlaceholder: 'أدخل رمزك البريدي (اختياري)',
  },

  // Form components
  form: {
    // Date picker
    selectDate: 'اختر تاريخ ميلادك',
    cancel: 'إلغاء',
    done: 'تم',
    
    // Multi-select
    selected: 'مختار',
    
    // General
    required: 'مطلوب',
    optional: 'اختياري',
  },

  // Settings screens
  settings: {
    title: 'الإعدادات',
    subtitle: 'إدارة حسابك وتفضيلاتك',
    loading: 'جاري تحميل الإعدادات',
    loadingSubtitle: 'جاري تحضير تفضيلاتك',
    
    // User profile card
    phaseNotSelected: 'لم يتم اختيار المرحلة',
    
    // Settings sections
    account: 'الحساب',
    privacySecurity: 'الخصوصية والأمان',
    support: 'الدعم',
    
    // Account items
    editProfile: 'تحرير الملف الشخصي',
    editProfileSubtitle: 'تحديث معلوماتك الشخصية',
    preferences: 'التفضيلات',
    preferencesSubtitle: 'إعدادات اللغة ومرحلة العلاقة',
    
    // Privacy & Security items
    privacySettings: 'إعدادات الخصوصية',
    privacySettingsSubtitle: 'التحكم في خصوصيتك وظهورك',
    security: 'الأمان',
    securitySubtitle: 'كلمة المرور وأمان الحساب',
    
    // Support items
    helpSupport: 'المساعدة والدعم',
    helpSupportSubtitle: 'احصل على المساعدة واتصل بالدعم',
    about: 'حول بلونغ',
    aboutSubtitle: 'إصدار التطبيق والمعلومات',
    
    // Logout
    logout: 'تسجيل الخروج',
    loggingOut: 'جاري تسجيل الخروج...',
    logoutConfirm: 'هل أنت متأكد من أنك تريد تسجيل الخروج؟',
  },

  // Help & Support
  help: {
    faq: {
      howDating: 'كيف يعمل نظام المواعيد في بلونغ؟',
      howDatingAnswer: 'يستخدم بلونغ خوارزميات الذكاء الاصطناعي المتقدمة لتحليل شخصيتك وتفضيلاتك لخلق تجارب مواعيد مثالية في أماكن رائعة.',
      dataSecure: 'هل بياناتي آمنة؟',
      dataSecureAnswer: 'نعم، نحن نستخدم التشفير ومقاييس الأمان المعيارية في الصناعة لحماية معلوماتك الشخصية وضمان خصوصيتك.',
      improveDates: 'كيف يمكنني الحصول على توصيات مواعيد أفضل؟',
      improveDatesAnswer: 'أكمل تقييم شخصيتك، أضف معلومات مفصلة للملف الشخصي، وحديث تفضيلاتك بانتظام للحصول على توصيات مواعيد أفضل.',
      changePhase: 'هل يمكنني تغيير مرحلة علاقتي؟',
      changePhaseAnswer: 'نعم، يمكنك تحديث مرحلة علاقتك في قسم التفضيلات في الإعدادات في أي وقت.',
      reportBehavior: 'كيف أبلغ عن سلوك غير مناسب؟',
      reportBehaviorAnswer: 'يمكنك الإبلاغ عن أي سلوك غير مناسب من خلال قائمة الملف الشخصي أو بالاتصال بفريق الدعم مباشرة.',
    },
    
    contact: {
      emailSupport: 'دعم البريد الإلكتروني',
      emailSupportSubtitle: 'احصل على المساعدة عبر البريد الإلكتروني',
      phone: 'دعم الهاتف',
      phoneSubtitle: 'اتصل بنا للحصول على مساعدة فورية',
      chat: 'المحادثة المباشرة',
      chatSubtitle: 'تحدث مع فريق الدعم',
    },
  },

  // Validation messages
  validation: {
    fillBasicInfo: 'يرجى ملء المعلومات الأساسية',
    selectCountryCity: 'يرجى اختيار بلدك ومدينتك',
    requiredFields: 'الحقول المطلوبة',
    maritalStatusRequired: 'الحالة الاجتماعية مطلوبة',
    hasChildrenRequired: 'يرجى تحديد ما إذا كان لديك أطفال',
    wantChildrenRequired: 'يرجى تحديد ما إذا كنت تريد أطفالاً',
  },

  // App general
  app: {
    name: 'بلونغ',
  },

  // Navigation
  navigation: {
    home: 'الرئيسية',
    dates: 'المواعيد',
    personality: 'الشخصية',
    articles: 'المقالات',
    settings: 'الإعدادات',
  },

  // تقييم الشخصية (محسن)
  assessment: {
    title: 'تقييم الشخصية',
    subtitle: 'ساعدنا في فهمك بشكل أفضل للعثور على شريكك المثالي',
    startButton: 'بدء التقييم',
    continueButton: 'متابعة',
    previousButton: 'السابق',
    nextButton: 'التالي',
    finishButton: 'إنهاء التقييم',
    saveProgress: 'حفظ التقدم',

    // التقدم
    progress: 'السؤال {{current}} من {{total}}',
    sectionProgress: 'القسم {{current}} من {{total}}',
    timeRemaining: '{{minutes}} دقيقة متبقية',

    // الأقسام
    sections: {
      personalityCore: 'الشخصية الأساسية',
      personalityCoreDesc: 'فهم سمات شخصيتك الأساسية',
      relationshipValues: 'قيم العلاقة',
      relationshipValuesDesc: 'نهجك في العلاقات والتواصل',
      lifestyleGoals: 'نمط الحياة والأهداف',
      lifestyleGoalsDesc: 'أولويات حياتك وتفضيلاتك الاجتماعية',
    },

    // تسميات مقياس ليكرت
    likert: {
      stronglyDisagree: 'لا أوافق بشدة',
      disagree: 'لا أوافق',
      slightlyDisagree: 'لا أوافق قليلاً',
      neutral: 'محايد',
      slightlyAgree: 'أوافق قليلاً',
      agree: 'أوافق',
      stronglyAgree: 'أوافق بشدة',
    },

    // أسئلة التقييم
    questions: {
      // الانبساط
      ext_1: 'أنا روح الحفلة',
      ext_2: 'أفضل أن أبقى لوحدي',
      ext_3: 'أشعر بالراحة حول الناس',

      // الود
      agr_1: 'أهتم بالناس',
      agr_2: 'أهين الناس',
      agr_3: 'أتعاطف مع مشاعر الآخرين',

      // الضمير الحي
      con_1: 'أنا مستعد دائماً',
      con_2: 'أترك أغراضي في كل مكان',
      con_3: 'أنتبه للتفاصيل',

      // العصابية
      neu_1: 'أتوتر بسهولة',
      neu_2: 'أنا مسترخٍ معظم الوقت',

      // الانفتاح
      ope_1: 'لدي مفردات غنية',
      ope_2: 'أجد صعوبة في فهم الأفكار المجردة',

      // التوجه العائلي
      fam_1: 'العائلة هي أهم شيء في حياتي',
      fam_2: 'كم عدد الأطفال الذي تريده مثالياً؟',

      // أسلوب التواصل
      com_1: 'أفضل مناقشة المشاكل بصراحة بدلاً من تجنبها',
      com_2: 'عند الاختلاف مع شخص ما، عادة:',

      // حل النزاعات
      conf_1: 'أحاول إيجاد حلول وسط عند وجود خلافات',
      conf_2: 'أثناء الجدال، أميل إلى:',

      // أهداف الحياة
      goal_1: 'رتب أولويات الحياة هذه حسب أهميتها لك:',

      // التفضيلات الاجتماعية
      soc_1: 'أستمتع بالتجمعات الاجتماعية الكبيرة',
      soc_2: 'كم تستمتع بأن تكون محور الاهتمام؟',

      // القيم المالية
      fin_1: 'ما الذي يصف نهجك مع المال بشكل أفضل؟',
    },

    // خيارات الإجابة
    options: {
      // تفضيلات حجم العائلة
      fam_2_1: 'لا أطفال',
      fam_2_2: '1-2 طفل',
      fam_2_3: '3-4 أطفال',
      fam_2_4: '5+ أطفال',

      // التواصل أثناء الخلافات
      com_2_1: 'أستمع بعناية وأحاول فهم وجهة نظرهم',
      com_2_2: 'أذكر موقفي بوضوح وحزم',
      com_2_3: 'أحاول إيجاد حل وسط',
      com_2_4: 'أتجنب المحادثة إن أمكن',

      // أسلوب حل النزاعات
      conf_2_1: 'أبقى هادئاً وأركز على الحلول',
      conf_2_2: 'أعبر عن مشاعري بصراحة',
      conf_2_3: 'آخذ وقتاً للهدوء أولاً',
      conf_2_4: 'أحاول إنهاءه بسرعة',

      // أولويات الحياة
      goal_1_1: 'التقدم المهني',
      goal_1_2: 'العائلة والعلاقات',
      goal_1_3: 'السفر والتجارب',
      goal_1_4: 'النمو الشخصي',
      goal_1_5: 'الأمان المالي',

      // النهج المالي
      fin_1_1: 'الادخار للمستقبل، الإنفاق بحذر',
      fin_1_2: 'توازن بين الادخار والاستمتاع بالحياة',
      fin_1_3: 'عيش اللحظة، المال للإنفاق',
      fin_1_4: 'الاستثمار بقوة للنمو',
    },

    // التسميات
    labels: {
      soc_2: 'لا على الإطلاق ← أحبه',
    },

    // تدفق التقييم
    continueTitle: 'متابعة التقييم؟',
    continueMessage: 'لديك تقييم محفوظ قيد التقدم. هل تريد المتابعة أم البدء من جديد؟',
    startOver: 'البدء من جديد',
    continue: 'متابعة',

    exitTitle: 'الخروج من التقييم؟',
    exitMessage: 'سيتم حفظ تقدمك. يمكنك المتابعة لاحقاً.',
    saveAndExit: 'حفظ والخروج',
    exitWithoutSaving: 'الخروج بدون حفظ',

    errorTitle: 'خطأ في التقييم',
    errorMessage: 'حدث خطأ في إكمال تقييمك. يرجى المحاولة مرة أخرى.',
    errorLoading: 'فشل في تحميل التقييم. يرجى المحاولة مرة أخرى.',

    loading: 'تحميل التقييم...',
    saving: 'حفظ...',
    save: 'حفظ',
    complete: 'مكتمل',
    answered: 'مُجاب عليه',

    scaleInstruction: 'اختر الرقم الذي يمثل إجابتك بشكل أفضل',
    multipleChoiceInstruction: 'اختر الخيار الذي يصفك بشكل أفضل:',
    optionSelected: 'تم اختيار الخيار',
    rankingInstruction: 'رتب هذه العناصر حسب أهميتها لك (1 = الأهم):',
    priority: 'الأولوية',
    rankingComplete: 'اكتمل الترتيب!',
    sliderInstruction: 'اسحب المؤشر لتحديد تفضيلك:',
    valueSelected: 'تم تحديد القيمة',

    // تسميات المؤشر الوصفي
    slider: {
      veryLow: 'منخفض جداً',
      low: 'منخفض',
      moderate: 'معتدل',
      high: 'عالي',
      veryHigh: 'عالي جداً',
    },
  },

  // Success messages
  success: {
    profileUpdated: 'تم تحديث الملف الشخصي بنجاح',
    messageSent: 'تم إرسال الرسالة',
    matchFound: 'تم العثور على مطابقة جديدة!',
    dateBooked: 'تم حجز الموعد بنجاح',
    preferencesUpdated: 'تم تحديث التفضيلات بنجاح',
    quizCompleted: 'تم إكمال الاختبار بنجاح!',
    assessmentSaved: 'تم حفظ تقدم التقييم',
  },

  // نظام الاختبار - التنفيذ الكامل
  quiz: {
    intro: {
      title: 'تقييم الشخصية',
      subtitle: 'اكتشف سمات شخصيتك الفريدة',
      startButton: 'بدء التقييم',
      continueButton: 'متابعة التقييم',
      viewResultsButton: 'عرض النتائج',
      features: {
        bigFive: {
          title: 'السمات الخمس الكبرى',
          description: 'تحليل خصائص شخصيتك الأساسية'
        },
        loveLanguages: {
          title: 'لغات الحب',
          description: 'اكتشف كيف تعبر عن الحب وتتلقاه'
        },
        compatibility: {
          title: 'تحليل التوافق',
          description: 'فهم أنماط التوافق في علاقاتك'
        }
      },
      estimatedTime: 'الوقت المقدر: {{minutes}} دقيقة',
      questionsCount: '{{count}} سؤال شامل',
      privacyNote: 'إجاباتك خاصة وآمنة'
    },
    session: {
      starting: 'بدء رحلة شخصيتك...',
      loading: 'تحميل السؤال التالي...',
      saving: 'حفظ تقدمك...',
      completing: 'إكمال تقييمك...',
      error: 'فشل في بدء جلسة الاختبار. يرجى المحاولة مرة أخرى.',
      submitError: 'فشل في إرسال الإجابة. يرجى المحاولة مرة أخرى.',
      connectionError: 'خطأ في الاتصال. يرجى التحقق من الإنترنت والمحاولة مرة أخرى.',
      resumeSession: 'استئناف الجلسة السابقة؟',
      newSession: 'بدء تقييم جديد'
    },
    navigation: {
      next: 'السؤال التالي',
      previous: 'السؤال السابق',
      skip: 'تخطي السؤال',
      skipConfirm: 'هل أنت متأكد من تخطي هذا السؤال؟',
      skipWarning: 'الأسئلة المتخطاة قد تؤثر على دقة نتائجك.',
      finish: 'إنهاء التقييم',
      cancel: 'إلغاء',
      exitConfirm: 'الخروج من التقييم؟',
      exitMessage: 'سيتم حفظ تقدمك تلقائياً.',
      saveAndExit: 'حفظ والخروج'
    },
    progress: {
      question: 'السؤال {{current}} من {{total}}',
      section: 'القسم {{current}} من {{total}}',
      completion: '{{percentage}}% مكتمل',
      timeRemaining: '{{minutes}} دقيقة متبقية',
      questionsAnswered: '{{answered}} من {{total}} مجاب عليها',
      currentSection: 'القسم الحالي: {{section}}'
    },
    personality: {
      traits: {
        openness: 'الانفتاح على التجارب',
        conscientiousness: 'الضمير الحي',
        extraversion: 'الانبساط',
        agreeableness: 'الود',
        neuroticism: 'الاستقرار العاطفي'
      },
      scores: {
        veryLow: 'منخفض جداً',
        low: 'منخفض',
        moderate: 'متوسط',
        high: 'عالي',
        veryHigh: 'عالي جداً'
      },
      insights: {
        openness: {
          high: 'أنت مبدع ومتخيل ومنفتح على التجارب الجديدة.',
          low: 'تفضل الروتين والطرق التقليدية في الحياة.'
        },
        conscientiousness: {
          high: 'أنت منظم ومنضبط وموجه نحو الهدف.',
          low: 'تميل إلى أن تكون أكثر عفوية ومرونة في نهجك.'
        },
        extraversion: {
          high: 'أنت منفتح ونشيط وتستمتع بالتفاعلات الاجتماعية.',
          low: 'تفضل البيئات الهادئة والمجموعات الاجتماعية الأصغر.'
        },
        agreeableness: {
          high: 'أنت متعاون وثقة ومراعي للآخرين.',
          low: 'تميل إلى أن تكون أكثر تنافسية وشكاً في الآخرين.'
        },
        neuroticism: {
          high: 'أنت مستقر عاطفياً وتتعامل مع الضغط بشكل جيد.',
          low: 'قد تكون أكثر حساسية للضغط والتغيرات العاطفية.'
        }
      }
    },
    results: {
      title: 'ملف شخصيتك',
      subtitle: 'بناءً على إجاباتك، إليك تحليل شخصيتك الفريد',
      shareTitle: 'نتائج شخصيتي في بلونغ',
      shareMessage: 'لقد أكملت للتو تقييم شخصيتي على بلونغ! اطلع على نتائجي.',
      retakeButton: 'إعادة التقييم',
      saveResults: 'حفظ النتائج',
      requestDate: 'طلب موعد',
      detailedAnalysis: 'عرض التحليل المفصل',
      personalityType: 'نوع شخصيتك: {{type}}',
      overallScore: 'نتيجة التوافق الإجمالية: {{score}}%'
    }
  },

  // نظام التنبيهات والأخطاء
  alerts: {
    errors: {
      quizFailed: 'فشل في بدء جلسة الاختبار. يرجى المحاولة مرة أخرى.',
      loadFailed: 'فشل في تحميل البيانات. يرجى المحاولة مرة أخرى.',
      profileSaveFailed: 'فشل في حفظ الملف الشخصي. يرجى المحاولة مرة أخرى.',
      connectionFailed: 'فشل الاتصال. يرجى التحقق من اتصال الإنترنت.',
      sessionExpired: 'انتهت صلاحية جلستك. يرجى تسجيل الدخول مرة أخرى.',
      permissionDenied: 'تم رفض الإذن. يرجى التحقق من إعداداتك.',
      validationFailed: 'يرجى التحقق من مدخلاتك والمحاولة مرة أخرى.',
      unknownError: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
      networkTimeout: 'انتهت مهلة الطلب. يرجى المحاولة مرة أخرى.',
      serverError: 'خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.',
      storageError: 'فشل في حفظ البيانات محلياً. يرجى التحقق من مساحة التخزين.',
      cameraError: 'تم رفض الوصول للكاميرا. يرجى تمكين أذونات الكاميرا.',
      locationError: 'تم رفض الوصول للموقع. يرجى تمكين أذونات الموقع.',

      // إرشادات الاسترداد
      recoverySteps: 'كيفية إصلاح هذا:',
      assessmentError: 'فشل في تحميل التقييم. يرجى المحاولة مرة أخرى.',
      paymentError: 'فشل في معالجة الدفع. يرجى المحاولة مرة أخرى.',
      bookingError: 'فشل في حجز الموعد. يرجى المحاولة مرة أخرى.',
      uploadError: 'فشل في رفع الصورة. يرجى المحاولة مرة أخرى.',
      deleteError: 'فشل في حذف العنصر. يرجى المحاولة مرة أخرى.',
      updateError: 'فشل في تحديث المعلومات. يرجى المحاولة مرة أخرى.',
      syncError: 'فشل في مزامنة البيانات. يرجى التحقق من الاتصال.',
      backupError: 'فشل في نسخ البيانات احتياطياً. يرجى المحاولة لاحقاً.',
      restoreError: 'فشل في استعادة البيانات. يرجى المحاولة مرة أخرى.',
      exportError: 'فشل في تصدير البيانات. يرجى المحاولة مرة أخرى.',
      importError: 'فشل في استيراد البيانات. يرجى التحقق من تنسيق الملف.',
      subscriptionError: 'خطأ في الاشتراك. يرجى التواصل مع الدعم.',
      premiumRequired: 'هذه الميزة تتطلب اشتراك بلونغ المميز.',
      accountLocked: 'الحساب مقفل مؤقتاً. يرجى التواصل مع الدعم.',
      tooManyAttempts: 'محاولات كثيرة جداً. يرجى المحاولة لاحقاً.'
    },
    success: {
      messageSent: 'تم إرسال رسالتك. سنتواصل معك قريباً!',
      profileUpdated: 'تم تحديث الملف الشخصي بنجاح!',
      preferencesUpdated: 'تم تحديث التفضيلات بنجاح!',
      assessmentCompleted: 'تم إكمال التقييم بنجاح!',
      photoUploaded: 'تم رفع الصورة بنجاح!',
      matchFound: 'تم العثور على مطابقة جديدة!',
      dateBooked: 'تم حجز الموعد بنجاح!',
      paymentProcessed: 'تم معالجة الدفع بنجاح!',
      passwordChanged: 'تم تغيير كلمة المرور بنجاح!',
      emailVerified: 'تم التحقق من البريد الإلكتروني بنجاح!',
      accountCreated: 'تم إنشاء الحساب بنجاح!',
      subscriptionUpdated: 'تم تحديث الاشتراك بنجاح!',
      dataExported: 'تم تصدير البيانات بنجاح!',
      dataImported: 'تم استيراد البيانات بنجاح!',
      backupCreated: 'تم إنشاء النسخة الاحتياطية بنجاح!',
      dataRestored: 'تم استعادة البيانات بنجاح!',
      settingsSaved: 'تم حفظ الإعدادات بنجاح!',
      notificationsSent: 'تم إرسال الإشعارات بنجاح!'
    },
    warnings: {
      unsavedChanges: 'لديك تغييرات غير محفوظة. هل أنت متأكد من الرغبة في المغادرة؟',
      deleteConfirm: 'هل أنت متأكد من حذف هذا العنصر؟',
      permanentAction: 'لا يمكن التراجع عن هذا الإجراء.',
      dataLoss: 'قد يؤدي هذا الإجراء إلى فقدان البيانات.',
      offlineMode: 'أنت حالياً في وضع عدم الاتصال. قد لا تكون بعض الميزات متاحة.',
      lowStorage: 'مساحة التخزين منخفضة. يرجى تحرير بعض المساحة.',
      expiringSoon: 'سينتهي اشتراكك قريباً. جدد للاستمرار في الاستفادة من الميزات المميزة.',
      incompleteProfile: 'أكمل ملفك الشخصي للحصول على مطابقات أفضل.',
      locationDisabled: 'خدمات الموقع معطلة. قم بتمكينها للحصول على مطابقات أفضل.',
      notificationDisabled: 'الإشعارات معطلة. قد تفوتك التحديثات المهمة.'
    },
    info: {
      loading: 'يرجى الانتظار أثناء معالجة طلبك...',
      processing: 'معالجة معلوماتك...',
      syncing: 'مزامنة بياناتك...',
      connecting: 'الاتصال بالخادم...',
      uploading: 'رفع الملفات...',
      downloading: 'تحميل المحتوى...',
      analyzing: 'تحليل توافقك...',
      searching: 'البحث عن المطابقات...',
      optimizing: 'تحسين تجربتك...',
      updating: 'تحديث معلوماتك...',
      verifying: 'التحقق من تفاصيلك...',
      authenticating: 'مصادقة حسابك...'
    }
  },

  // تنسيق التاريخ والوقت
  dateTime: {
    formats: {
      short: 'dd/MM/yyyy',
      medium: 'dd MMM، yyyy',
      long: 'dd MMMM، yyyy',
      full: 'EEEE، dd MMMM، yyyy',
      time: 'h:mm a',
      dateTime: 'dd MMM، yyyy h:mm a'
    },
    relative: {
      now: 'الآن',
      minuteAgo: 'منذ دقيقة',
      minutesAgo: 'منذ {{count}} دقائق',
      hourAgo: 'منذ ساعة',
      hoursAgo: 'منذ {{count}} ساعات',
      dayAgo: 'منذ يوم',
      daysAgo: 'منذ {{count}} أيام',
      weekAgo: 'منذ أسبوع',
      weeksAgo: 'منذ {{count}} أسابيع',
      monthAgo: 'منذ شهر',
      monthsAgo: 'منذ {{count}} أشهر',
      yearAgo: 'منذ سنة',
      yearsAgo: 'منذ {{count}} سنوات'
    },
    calendar: {
      today: 'اليوم',
      tomorrow: 'غداً',
      yesterday: 'أمس',
      thisWeek: 'هذا الأسبوع',
      nextWeek: 'الأسبوع القادم',
      lastWeek: 'الأسبوع الماضي',
      thisMonth: 'هذا الشهر',
      nextMonth: 'الشهر القادم',
      lastMonth: 'الشهر الماضي'
    }
  },

  // نظام الإشعارات
  notifications: {
    types: {
      dateConfirmed: 'تم تأكيد الموعد! 🎉',
      timeToPrep: 'حان وقت التحضير!',
      feedback: 'كيف سار الأمر؟ 💭',
      dateAvailable: 'فرصة موعد جديدة متاحة!',
      messageReceived: 'تم استلام رسالة جديدة',
      profileViewed: 'شخص ما شاهد ملفك الشخصي',
      subscriptionExpiring: 'الاشتراك سينتهي قريباً',
      assessmentReminder: 'أكمل تقييم شخصيتك',
      dateReminder: 'لديك موعد قادم',
      paymentDue: 'استحقاق الدفع قريباً'
    },
    actions: {
      view: 'عرض',
      dismiss: 'تجاهل',
      remind: 'ذكرني لاحقاً',
      markRead: 'تحديد كمقروء',
      markAllRead: 'تحديد الكل كمقروء',
      settings: 'إعدادات الإشعارات'
    }
  },

  // Network Status
  network: {
    online: 'متصل',
    offline: 'غير متصل',
    connected: 'متصل',
    connecting: 'جاري الاتصال...',
    reconnecting: 'جاري إعادة الاتصال...',
    connectionRestored: 'تم استعادة الاتصال',
    connectionLost: 'فقد الاتصال',
    connectionStable: 'الاتصال مستقر',
    noConnection: 'لا يوجد اتصال بالإنترنت',
    weakConnection: 'تم اكتشاف اتصال ضعيف',
    connectionType: 'نوع الاتصال',
    processingQueue: 'جاري معالجة {{count}} إجراءات في الانتظار...',
    queuedActions: '{{count}} إجراءات في الانتظار عند الاتصال',
    retryConnection: 'إعادة محاولة الاتصال',
    checkConnection: 'فحص الاتصال',
    offlineMode: 'الوضع غير المتصل',
    offlineModeDescription: 'أنت غير متصل حالياً. سيتم حفظ الإجراءات ومعالجتها عند استعادة الاتصال.',
    queueStatus: 'حالة الانتظار',
    queueEmpty: 'لا توجد إجراءات معلقة',
    queueProcessing: 'جاري معالجة الإجراءات المعلقة...',
    queueCompleted: 'تم إكمال جميع الإجراءات المعلقة',
    queueFailed: 'فشل في معالجة بعض الإجراءات',
  },

  // Success messages
  success: {
    success: 'نجح!',
    operationCompleted: 'تم إكمال العملية بنجاح',
    profileUpdated: 'تم تحديث الملف الشخصي بنجاح',
    profileUpdatedMessage: 'تم حفظ وتحديث معلومات ملفك الشخصي',
    feedbackSent: 'تم إرسال التعليقات',
    feedbackSentMessage: 'شكراً لك على تعليقاتك! نحن نقدر مساهمتك',
    dateAvailable: 'موعد جديد متاح!',
    dateBooked: 'تم حجز الموعد بنجاح',
    dateBookedMessage: 'تم تأكيد وجدولة موعدك',
    preferencesUpdated: 'تم تحديث التفضيلات بنجاح',
    preferencesUpdatedMessage: 'تم حفظ تفضيلاتك وسيتم تطبيقها',
    quizCompleted: 'تم إكمال الاختبار بنجاح!',
    quizCompletedMessage: 'تم إكمال وتحليل تقييم شخصيتك',
    assessmentSaved: 'تم حفظ تقدم التقييم',
    assessmentCompleted: 'تم إكمال التقييم!',
    assessmentCompletedMessage: 'تم إكمال تقييمك الشامل',
    photoUploaded: 'تم رفع الصورة بنجاح',
    photoUploadedMessage: 'تم رفع ومعالجة صورتك',
    paymentProcessed: 'تم معالجة الدفع بنجاح',
    paymentProcessedMessage: 'تم تأكيد ومعالجة دفعتك',
    emailVerified: 'تم التحقق من البريد الإلكتروني بنجاح',
    emailVerifiedMessage: 'تم التحقق من وتأكيد عنوان بريدك الإلكتروني',
    passwordChanged: 'تم تغيير كلمة المرور بنجاح',
    passwordChangedMessage: 'تم تحديث وتأمين كلمة مرورك',
    accountCreated: 'تم إنشاء الحساب بنجاح',
    accountCreatedMessage: 'مرحباً بك في بلونغ! حسابك جاهز للاستخدام',
    dataSynced: 'تم مزامنة البيانات',
    dataSyncedMessage: 'تم مزامنة بياناتك عبر جميع الأجهزة',
    backupCreated: 'تم إنشاء النسخة الاحتياطية بنجاح',
    backupCreatedMessage: 'تم حفظ بياناتك بأمان كنسخة احتياطية',
    settingsSaved: 'تم حفظ الإعدادات',
    settingsSavedMessage: 'تم حفظ وتطبيق إعداداتك',
  },

  // Photo Upload
  photoUpload: {
    selectPhoto: 'اختيار صورة',
    selectPhotoDescription: 'اختر كيف تريد إضافة صورة',
    takePhoto: 'التقاط صورة',
    chooseFromGallery: 'اختيار من المعرض',
    processing: 'معالجة الصورة',
    processingDescription: 'جاري تحسين صورتك للحصول على أفضل جودة...',
    cameraError: 'خطأ في الكاميرا',
    cameraErrorMessage: 'غير قادر على الوصول للكاميرا. يرجى فحص الأذونات.',
    galleryError: 'خطأ في المعرض',
    galleryErrorMessage: 'غير قادر على الوصول لمعرض الصور. يرجى فحص الأذونات.',
    processingError: 'خطأ في المعالجة',
    processingErrorMessage: 'فشل في معالجة الصورة المحددة.',
    fileTooLarge: 'الملف كبير جداً. الحد الأقصى للحجم هو {{size}} ميجابايت.',
    invalidFormat: 'تنسيق غير صالح. التنسيقات المدعومة: {{formats}}',
    uploadError: 'فشل الرفع',
    uploadErrorMessage: 'فشل في رفع الصورة. يرجى المحاولة مرة أخرى.',
    uploadSuccess: 'تم رفع الصورة بنجاح',
    uploadSuccessMessage: 'تم رفع ومعالجة صورتك.',
  },

  // Compatibility & Matching
  compatibility: {
    score: 'نقاط التوافق',
    breakdown: 'تفصيل التوافق',
    personality: 'الشخصية',
    preferences: 'التفضيلات',
    values: 'القيم',
    interaction: 'التفاعل',
    insights: 'رؤى الذكاء الاصطناعي',
    conversationStarters: 'بدايات المحادثة',
    suggestedVenues: 'أماكن المواعيد المقترحة',
    strengths: 'نقاط القوة في العلاقة',
    challenges: 'المجالات التي تحتاج للتنقل',
    arrangeDate: 'ترتيب موعد',
    learnMore: 'تعلم المزيد',
    exceptional: 'استثنائي',
    excellent: 'ممتاز',
    good: 'جيد',
    moderate: 'متوسط',
    challenging: 'تحدي',
    personalityCompatibility: 'توافق الشخصية',
    valueAlignment: 'توافق القيم',
    lifestyleMatch: 'توافق نمط الحياة',
    communicationStyle: 'أسلوب التواصل',
    relationshipGoals: 'أهداف العلاقة',
    familyValues: 'قيم الأسرة',
    religiousViews: 'الآراء الدينية',
    educationLevel: 'المستوى التعليمي',
    careerAmbitions: 'الطموحات المهنية',
    socialPreferences: 'التفضيلات الاجتماعية',
    conflictResolution: 'حل النزاعات',
    emotionalIntelligence: 'الذكاء العاطفي',
    trustAndSecurity: 'الثقة والأمان',
    intimacyAndAffection: 'الحميمية والعاطفة',
    sharedInterests: 'الاهتمامات المشتركة',
    complementaryTraits: 'الصفات المكملة',
    growthPotential: 'إمكانية النمو',
    longTermCompatibility: 'التوافق طويل المدى',
    dateRecommendation: 'توصية الموعد',
    venuePreferences: 'تفضيلات المكان',
    activitySuggestions: 'اقتراحات الأنشطة',
    timingRecommendations: 'توصيات التوقيت',
    conversationTopics: 'مواضيع المحادثة',
    relationshipAdvice: 'نصائح العلاقة',
    compatibilityReport: 'تقرير التوافق',
    detailedAnalysis: 'تحليل مفصل',
    aiInsights: 'رؤى مدعومة بالذكاء الاصطناعي',
    personalityProfile: 'ملف الشخصية',
    matchingAlgorithm: 'خوارزمية المطابقة',
    compatibilityFactors: 'عوامل التوافق',
    relationshipPrediction: 'توقع العلاقة',
    successProbability: 'احتمالية النجاح',
    recommendationConfidence: 'ثقة التوصية',
  },

  // Safety & Security
  safety: {
    dashboard: {
      title: 'مركز الأمان',
    },
    status: {
      title: 'حالة الأمان',
      verification: 'التحقق من الملف الشخصي',
      threatLevel: 'مستوى التهديد',
      activeCheckIns: 'عمليات التحقق النشطة',
      active: 'نشط',
    },
    verification: {
      basic: 'تحقق أساسي',
      verified: 'تم التحقق بالكامل',
      upgrade: 'ترقية',
      requested: 'تم طلب التحقق بنجاح',
    },
    threatLevel: {
      low: 'خطر منخفض',
      medium: 'خطر متوسط',
      high: 'خطر عالي',
      critical: 'خطر حرج',
    },
    emergency: {
      title: 'طوارئ',
      alert: 'تنبيه طوارئ',
      confirm: 'إرسال التنبيه',
      confirmTitle: 'تنبيه طوارئ',
      confirmMessage: 'سيتم إشعار جهات الاتصال الطارئة والسلطات المحلية فوراً. استخدم فقط في حالات الطوارئ الحقيقية.',
      confirmDescription: 'سيتم إشعار خدمات الطوارئ وجهات الاتصال الآمنة فوراً.',
      sending: 'جاري إرسال التنبيه...',
      alertSent: 'تم إرسال تنبيه الطوارئ',
      alertSentMessage: 'تم إرسال تنبيه الطوارئ إلى {{contacts}} جهة اتصال. خدمات الطوارئ: {{emergency}}',
      alertFailed: 'فشل في إرسال تنبيه الطوارئ',
      helpOnWay: 'المساعدة في الطريق. ابق آمناً.',
    },
    checkIn: {
      title: 'تسجيل الأمان',
      start: 'بدء تسجيل الأمان',
      started: 'تم بدء تسجيل الأمان بنجاح',
      startFailed: 'فشل في بدء تسجيل الأمان',
      loadFailed: 'فشل في تحميل بيانات التسجيل',
      updateFailed: 'فشل في تحديث حالة التسجيل',
      endFailed: 'فشل في إنهاء التسجيل',
      initializing: 'جاري تهيئة تسجيل الأمان...',
      actions: 'كيف حالك؟',
      nextCheckIn: 'حتى التسجيل التالي',
      dueTitle: 'تسجيل الأمان',
      dueMessage: 'حان وقت تسجيل الأمان. كيف حالك؟',
      imSafe: 'أنا بأمان',
      delayed: 'متأخر',
      needHelp: 'أحتاج مساعدة',
      emergency: 'طوارئ',
      end: 'إنهاء التسجيل',
      endTitle: 'إنهاء تسجيل الأمان',
      endMessage: 'هل أنت متأكد من إنهاء تسجيل الأمان؟',
      endConfirm: 'إنهاء التسجيل',
      ended: 'تم إنهاء تسجيل الأمان بنجاح',
      statusUpdated: 'تم تحديث حالة التسجيل',
      status: {
        safe: 'آمن',
        delayed: 'متأخر',
        help_needed: 'يحتاج مساعدة',
        emergency: 'طوارئ',
        no_response: 'لا يوجد رد',
      },
    },
    features: {
      title: 'ميزات الأمان',
      enabled: 'تم تفعيل {{feature}}',
      disabled: 'تم إلغاء {{feature}}',
      updateFailed: 'فشل في تحديث ميزة الأمان',
      threatDetection: 'كشف التهديدات',
      threatDetectionDescription: 'مراقبة مدعومة بالذكاء الاصطناعي للسلوك المشبوه',
      locationSharing: 'مشاركة الموقع',
      locationSharingDescription: 'شارك موقعك مع جهات الاتصال الطارئة',
      autoCheckIn: 'التسجيل التلقائي',
      autoCheckInDescription: 'تسجيلات أمان تلقائية أثناء المواعيد',
      incognitoMode: 'الوضع المخفي',
      incognitoModeDescription: 'خصوصية وإخفاء هوية محسنة',
    },
    loading: 'جاري تحميل بيانات الأمان...',
  },

};
