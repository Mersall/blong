/**
 * BLONG French Translations (Français)
 * Complete French language pack
 */

export default {
  common: {
    continue: 'CONTINUER',
    back: 'Retour',
    next: 'Suivant',
    skip: 'Passer',
    done: 'Terminé',
    save: 'Enregistrer',
    cancel: 'Annuler',
    loading: 'Chargement...',
    error: 'Une erreur s\'est produite',
    success: 'Succès !',
    retry: 'Réessayer',
    tryAgain: 'Réessayer',
    ok: 'OK',
    processing: 'TRAITEMENT...',
    changing: 'CHANGEMENT...',
    notSelected: 'Non sélectionné',
    notNow: 'Pas maintenant',
    viewDetails: 'Voir les détails',
    
    // Form fields
    email: 'Email',
    password: 'Mot de passe',
    name: 'Nom',
    phone: 'Numéro de téléphone',
  },

  // Onboarding flow
  onboarding: {
    // Brand
    brand: 'BLONG',
    brandSubtitle: 'Mariage Élite',
    tagline: 'MATRIMONIAL D\'ÉLITE',
    
    // Language selection
    languageTitle: 'Choisissez votre langue',
    languageSubtitle: 'Sélectionnez votre langue préférée pour la meilleure expérience',
    languageFooter: 'Vous pouvez changer cela plus tard dans les paramètres',
    
    // Phase selection
    phaseTitle: 'Quel est votre parcours ?',
    phaseSubtitle: 'Parlez-nous de votre phase relationnelle actuelle',
    phaseFooter: 'Cela nous aide à personnaliser votre expérience',
    startJourney: 'COMMENCER VOTRE VOYAGE',
    
    // Language options with native names
    languages: {
      english: {
        name: 'Anglais',
        nativeName: 'English',
        description: 'Langue mondiale',
        flag: '🇺🇸',
      },
      arabic: {
        name: 'Arabe',
        nativeName: 'العربية',
        description: 'Langue arabe',
        flag: '🇸🇦',
      },
      french: {
        name: 'Français',
        nativeName: 'Français',
        description: 'Langue française',
        flag: '🇫🇷',
      },
      spanish: {
        name: 'Espagnol',
        nativeName: 'Español',
        description: 'Langue espagnole',
        flag: '🇪🇸',
      },
    },
    
    // Relationship phases
    phases: {
      single: {
        title: 'Parcours des Célibataires',
        subtitle: 'Découverte de soi et clarté',
        description: 'Définissez vos valeurs et préférences pendant que nous préparons des présentations et expériences parfaites pour vous',
        icon: '🌸',
      },
      preparing: {
        title: 'Préparer les Fiançailles',
        subtitle: 'Planification et alignement',
        description: 'Construisez une vision commune, alignez vos valeurs et planifiez des étapes significatives ensemble',
        icon: '💕',
      },
      engaged: {
        title: 'Avant les Fiançailles',
        subtitle: 'Concentré et élégant',
        description: 'Des expériences soignées et des décisions alors que vous avancez vers un avenir engagé',
        icon: '💍',
      },
    },
  },

  // Authentication
  auth: {
    loginTitle: 'Bon retour',
    loginSubtitle: 'Connectez-vous pour continuer votre voyage',
    loginButton: 'Se connecter',
    
    registerTitle: 'Créez votre compte',
    registerSubtitle: 'Rejoignez des milliers de personnes trouvant des connexions significatives',
    registerButton: 'Créer un compte',
    alreadyHaveAccount: 'Vous avez déjà un compte ?',
    dontHaveAccount: 'Vous n\'avez pas de compte ?',
    createAccount: 'Créer un compte',
    signIn: 'Se connecter',
    
    forgotPassword: 'Mot de passe oublié ?',
    resetPassword: 'Réinitialiser le mot de passe',
    rememberMe: 'Se souvenir de moi',
    
    // Success messages
    loginSuccess: 'Bon retour !',
    registerSuccess: 'Bienvenue sur BLONG !',

    // Field labels
    firstName: 'Prénom',
    lastName: 'Nom de famille',
    email: 'Adresse e-mail',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',

    // Placeholders
    firstNamePlaceholder: 'Entrez votre prénom',
    lastNamePlaceholder: 'Entrez votre nom de famille',
    emailPlaceholder: 'Entrez votre adresse e-mail',
    passwordPlaceholder: 'Entrez votre mot de passe',
    confirmPasswordPlaceholder: 'Confirmez votre mot de passe',
    dateOfBirthPlaceholder: 'Sélectionnez votre date de naissance',
    
    // Additional auth fields
    dateOfBirth: 'Date de naissance',
    gender: 'Genre',
    
    // Gender options
    'gender.male': 'Homme',
    'gender.female': 'Femme',
    'gender.non_binary': 'Non-binaire',
    'gender.other': 'Autre',
  },

  // Main app
  dashboard: {
    welcome: 'Bienvenue sur BLONG',
    subtitle: 'Votre expérience matrimoniale d\'élite',
    featuredProfiles: 'PROFILS EN VEDETTE',
    compatibilityAnalysis: 'ANALYSE DE COMPATIBILITÉ',
    takeAction: 'PASSER À L\'ACTION',
    premiumFeatures: 'FONCTIONNALITÉS PREMIUM',
  },

  // Settings
  settings: {
    title: 'Paramètres',
    appearance: 'Apparence',
    language: 'Langue',
    accessibility: 'Accessibilité',
    account: 'Compte',
    privacy: 'Confidentialité',
    notifications: 'Notifications',
    signOut: 'Se déconnecter',
  },

  // Actions
  actions: {
    pass: 'PASSER',
    connect: 'CONNECTER',
    like: 'J\'aime',
    superLike: 'Super J\'aime',
    message: 'Message',
    call: 'Appeler',
    videoCall: 'Appel vidéo',
  },

  // Premium features
  premium: {
    title: 'BLONG ÉLITE',
    subtitle: 'Accès exclusif aux profils vérifiés, correspondance prioritaire et service de conciergerie',
    upgradeNow: 'METTRE À NIVEAU MAINTENANT',
    features: {
      verifiedProfiles: 'Profils vérifiés',
      priorityService: 'Service prioritaire',
      conciergeService: 'Service de conciergerie',
      unlimitedLikes: 'J\'aimes illimités',
      advancedFilters: 'Filtres avancés',
      readReceipts: 'Accusés de lecture',
    },
  },

  // Error messages
  errors: {
    networkError: 'Erreur de connexion réseau',
    serverError: 'Erreur serveur, veuillez réessayer',
    validationError: 'Veuillez vérifier votre saisie',
    authError: 'Échec de l\'authentification',
    permissionError: 'Permission refusée',
  },

  // Profile completion flow
  profile: {
    completion: {
      // Step titles and subtitles
      basicInfo: 'Informations de base',
      basicInfoSubtitle: 'Parlez-nous de vous',
      location: 'Localisation',
      locationSubtitle: 'Où êtes-vous situé ?',
      physical: 'Détails physiques',
      physicalSubtitle: 'Informations physiques optionnelles',
      professional: 'Vie professionnelle',
      professionalSubtitle: 'Votre carrière et éducation',
      personal: 'Contexte personnel',
      personalSubtitle: 'Style de vie et préférences',
      additional: 'Informations supplémentaires',
      additionalSubtitle: 'Complétez votre profil',
      
      // Navigation
      step: 'Étape',
      of: 'sur',
      saving: 'Enregistrement',
      savingSubtitle: 'Veuillez patienter pendant que nous sauvegardons vos informations en sécurité...',
      retrySubtitle: 'Tentative de reconnexion et sauvegarde de vos données',
      processing: 'Traitement de vos informations...',
      validating: 'Validation des informations...',
      finalizing: 'Finalisation de votre profil...',

      // Completion messages
      profileComplete: 'Profil terminé !',
      profileCompleteMessage: 'Votre profil a été complété avec succès. Vous pouvez maintenant commencer à trouver des correspondances !',
      errorSaving: 'Une erreur s\'est produite lors de l\'enregistrement de votre profil. Veuillez réessayer.',
    },
    
    // Form fields
    form: {
      // Basic info
      dateOfBirth: 'Date de naissance',
      dateOfBirthPlaceholder: 'Sélectionnez votre date de naissance',
      gender: 'Genre',
      genderPlaceholder: 'Sélectionnez votre genre',
      
      // Gender options
      male: 'Homme',
      female: 'Femme',
      nonBinary: 'Non-binaire',
      other: 'Autre',
      
      // Physical
      height: 'Taille',
      heightPlaceholder: 'Taille en cm (optionnel)',
      weight: 'Poids',
      weightPlaceholder: 'Poids en kg (optionnel)',
      
      // Professional
      occupation: 'Profession',
      occupationPlaceholder: 'Que faites-vous dans la vie ? (optionnel)',
      education: 'Éducation',
      educationPlaceholder: 'Votre niveau d\'éducation (optionnel)',
      
      // Personal
      maritalStatus: 'État civil',
      maritalStatusPlaceholder: 'Sélectionnez votre état civil (optionnel)',
      hasChildren: 'A des enfants',
      wantChildren: 'Veut des enfants',
      smoking: 'Fumeur',
      drinking: 'Buveur',
      
      // Marital status options
      single: 'Célibataire',
      divorced: 'Divorcé(e)',
      widowed: 'Veuf/Veuve',
      separated: 'Séparé(e)',
      
      // Additional
      interests: 'Intérêts',
      interestsPlaceholder: 'Sélectionnez vos intérêts (optionnel)',
      languages: 'Langues',
      languagesPlaceholder: 'Langues que vous parlez (optionnel)',
      religion: 'Religion',
      religionPlaceholder: 'Votre religion (optionnel)',
      ethnicity: 'Origine ethnique',
      ethnicityPlaceholder: 'Votre origine ethnique (optionnel)',
      
      // Interest options
      travel: 'Voyage',
      reading: 'Lecture',
      sports: 'Sports',
      music: 'Musique',
      movies: 'Films',
      cooking: 'Cuisine',
      art: 'Art',
      photography: 'Photographie',
      dancing: 'Danse',
      hiking: 'Randonnée',
      fitness: 'Fitness',
      gaming: 'Jeux vidéo',
      technology: 'Technologie',
      fashion: 'Mode',
      food: 'Nourriture',
    },
  },

  // Geolocation and form components
  location: {
    detecting: 'Détection de votre localisation...',
    detectingSubtitle: 'Nous trouvons automatiquement votre localisation pour vous proposer de meilleures correspondances à proximité.',
    detected: 'Localisation détectée avec succès !',
    detectionError: 'Impossible de détecter la localisation',
    detectionErrorSubtitle: 'Nous n\'avons pas pu détecter automatiquement votre localisation. Vous pouvez réessayer ou la saisir manuellement.',
    findVenues: 'Trouvez de meilleurs lieux à proximité',
    findVenuesSubtitle: 'Nous pouvons détecter automatiquement votre localisation pour vous montrer les lieux de rendez-vous dans votre région.',
    detectButton: 'Détecter ma localisation',
    editManually: 'Modifier manuellement',
    enterManually: 'Saisir manuellement',
    enterManuallyInstead: 'Saisir manuellement à la place',
    detectAgain: 'Détecter à nouveau',
    tryAgain: 'Réessayer',
    locationCaptured: 'Informations de localisation capturées',
    
    // Form fields
    country: 'Pays',
    countryPlaceholder: 'Entrez votre pays',
    city: 'Ville',
    cityPlaceholder: 'Entrez votre ville',
    region: 'Région/État',
    regionPlaceholder: 'Entrez votre région ou état (optionnel)',
    district: 'District/Quartier',
    districtPlaceholder: 'Entrez votre district ou quartier (optionnel)',
    postalCode: 'Code postal',
    postalCodePlaceholder: 'Entrez votre code postal (optionnel)',
  },

  // Form components
  form: {
    // Date picker
    selectDate: 'Sélectionnez votre date de naissance',
    cancel: 'Annuler',
    done: 'Terminé',
    
    // Multi-select
    selected: 'sélectionné(s)',
    
    // General
    required: 'Requis',
    optional: 'Optionnel',
  },

  // Settings screens
  settings: {
    title: 'Paramètres',
    subtitle: 'Gérez votre compte et vos préférences',
    loading: 'Chargement des paramètres',
    loadingSubtitle: 'Préparation de vos préférences',
    
    // User profile card
    phaseNotSelected: 'Phase non sélectionnée',
    
    // Settings sections
    account: 'Compte',
    privacySecurity: 'Confidentialité et sécurité',
    support: 'Support',
    
    // Account items
    editProfile: 'Modifier le profil',
    editProfileSubtitle: 'Mettez à jour vos informations personnelles',
    preferences: 'Préférences',
    preferencesSubtitle: 'Paramètres de langue et de phase relationnelle',
    
    // Privacy & Security items
    privacySettings: 'Paramètres de confidentialité',
    privacySettingsSubtitle: 'Contrôlez votre confidentialité et visibilité',
    security: 'Sécurité',
    securitySubtitle: 'Mot de passe et sécurité du compte',
    
    // Support items
    helpSupport: 'Aide et support',
    helpSupportSubtitle: 'Obtenez de l\'aide et contactez le support',
    about: 'À propos de BLONG',
    aboutSubtitle: 'Version de l\'application et informations',
    
    // Logout
    logout: 'Se déconnecter',
    loggingOut: 'Déconnexion...',
    logoutConfirm: 'Êtes-vous sûr de vouloir vous déconnecter ?',
  },

  // Help & Support
  help: {
    faq: {
      howDating: 'Comment fonctionne le service de rendez-vous BLONG ?',
      howDatingAnswer: 'BLONG utilise des algorithmes d\'IA avancés pour analyser votre personnalité et préférences afin de créer des expériences de rendez-vous parfaites dans des lieux incroyables.',
      dataSecure: 'Mes données sont-elles sécurisées ?',
      dataSecureAnswer: 'Oui, nous utilisons un chiffrement et des mesures de sécurité standards de l\'industrie pour protéger vos informations personnelles et assurer votre confidentialité.',
      improveDates: 'Comment puis-je obtenir de meilleures recommandations de rendez-vous ?',
      improveDatesAnswer: 'Complétez votre évaluation de personnalité, ajoutez des informations détaillées au profil, et mettez à jour régulièrement vos préférences pour obtenir de meilleures recommandations de rendez-vous.',
      changePhase: 'Puis-je changer ma phase relationnelle ?',
      changePhaseAnswer: 'Oui, vous pouvez mettre à jour votre phase relationnelle dans la section Préférences des Paramètres à tout moment.',
      reportBehavior: 'Comment signaler un comportement inapproprié ?',
      reportBehaviorAnswer: 'Vous pouvez signaler tout comportement inapproprié via le menu de profil ou en contactant directement notre équipe de support.',
    },
    
    contact: {
      emailSupport: 'Support par e-mail',
      emailSupportSubtitle: 'Obtenez de l\'aide par e-mail',
      phone: 'Support téléphonique',
      phoneSubtitle: 'Appelez-nous pour une assistance immédiate',
      chat: 'Chat en direct',
      chatSubtitle: 'Chattez avec notre équipe de support',
    },
  },

  // Error handling
  errors: {
    network: {
      title: 'Problème de connexion',
      message: 'Veuillez vérifier votre connexion internet et réessayer.',
      action: 'Réessayer',
    },
    auth: {
      invalidCredentials: {
        title: 'Identifiants invalides',
        message: 'L\'e-mail ou le mot de passe que vous avez entré est incorrect.',
        action: 'Réessayer',
      },
      general: {
        title: 'Erreur d\'authentification',
        message: 'Impossible de s\'authentifier. Veuillez réessayer.',
        action: 'Réessayer',
      },
    },
    validation: {
      title: 'Informations invalides',
      message: 'Veuillez vérifier vos informations et réessayer.',
      action: 'Corriger les erreurs',
    },
    server: {
      critical: {
        title: 'Service indisponible',
        message: 'Nos serveurs sont temporairement indisponibles. Veuillez réessayer plus tard.',
        action: 'Réessayer plus tard',
      },
      general: {
        title: 'Erreur serveur',
        message: 'Une erreur s\'est produite de notre côté. Veuillez réessayer.',
        action: 'Réessayer',
      },
    },
    unknown: {
      title: 'Erreur inattendue',
      message: 'Une erreur inattendue s\'est produite. Veuillez réessayer.',
      action: 'Réessayer',
    },
  },

  // Form validation
  validation: {
    email: {
      required: 'L\'adresse e-mail est requise',
      invalid: 'Veuillez entrer une adresse e-mail valide',
    },
    password: {
      required: 'Le mot de passe est requis',
      minLength: 'Le mot de passe doit contenir au moins 8 caractères',
    },
    firstName: {
      required: 'Le prénom est requis',
      invalid: 'Veuillez entrer un prénom valide',
    },
    lastName: {
      required: 'Le nom de famille est requis',
      invalid: 'Veuillez entrer un nom de famille valide',
    },
    confirmPassword: {
      required: 'Veuillez confirmer votre mot de passe',
      mismatch: 'Les mots de passe ne correspondent pas',
    },
    fillBasicInfo: 'Veuillez remplir les informations de base',
    selectCountryCity: 'Veuillez sélectionner votre pays et votre ville',
    requiredFields: 'Champs requis',
    maritalStatusRequired: 'Le statut matrimonial est requis',
    hasChildrenRequired: 'Veuillez préciser si vous avez des enfants',
    wantChildrenRequired: 'Veuillez préciser si vous voulez des enfants',
  },

  // App general
  app: {
    name: 'BLONG',
  },

  // Navigation
  navigation: {
    home: 'Accueil',
    dates: 'Rendez-vous',
    personality: 'Personnalité',
    articles: 'Articles',
    settings: 'Paramètres',
  },

  // Évaluation de personnalité (améliorée)
  assessment: {
    title: 'Évaluation de personnalité',
    subtitle: 'Aidez-nous à mieux vous comprendre pour trouver votre partenaire idéal',
    startButton: 'Commencer l\'évaluation',
    continueButton: 'Continuer',
    previousButton: 'Précédent',
    nextButton: 'Suivant',
    finishButton: 'Terminer l\'évaluation',
    saveProgress: 'Sauvegarder le progrès',

    // Progrès
    progress: 'Question {{current}} sur {{total}}',
    sectionProgress: 'Section {{current}} sur {{total}}',
    timeRemaining: '{{minutes}} minutes restantes',

    // Sections
    sections: {
      personalityCore: 'Personnalité fondamentale',
      personalityCoreDesc: 'Comprendre vos traits de personnalité fondamentaux',
      relationshipValues: 'Valeurs relationnelles',
      relationshipValuesDesc: 'Votre approche des relations et de la communication',
      lifestyleGoals: 'Style de vie et objectifs',
      lifestyleGoalsDesc: 'Vos priorités de vie et préférences sociales',
    },

    // Étiquettes d\'échelle de Likert
    likert: {
      stronglyDisagree: 'Totalement en désaccord',
      disagree: 'En désaccord',
      slightlyDisagree: 'Plutôt en désaccord',
      neutral: 'Neutre',
      slightlyAgree: 'Plutôt d\'accord',
      agree: 'D\'accord',
      stronglyAgree: 'Totalement d\'accord',
    },

    // Questions d\'évaluation
    questions: {
      // Extraversion
      ext_1: 'Je suis l\'âme de la fête',
      ext_2: 'Je préfère rester seul(e)',
      ext_3: 'Je me sens à l\'aise avec les gens',

      // Agréabilité
      agr_1: 'Je m\'intéresse aux gens',
      agr_2: 'J\'insulte les gens',
      agr_3: 'Je compatís aux sentiments des autres',

      // Conscienciosité
      con_1: 'Je suis toujours préparé(e)',
      con_2: 'Je laisse traîner mes affaires',
      con_3: 'Je fais attention aux détails',

      // Névrosisme
      neu_1: 'Je me stresse facilement',
      neu_2: 'Je suis détendu(e) la plupart du temps',

      // Ouverture
      ope_1: 'J\'ai un vocabulaire riche',
      ope_2: 'J\'ai du mal à comprendre les idées abstraites',

      // Orientation familiale
      fam_1: 'La famille est la chose la plus importante dans ma vie',
      fam_2: 'Combien d\'enfants aimeriez-vous idéalement avoir ?',

      // Style de communication
      com_1: 'Je préfère discuter ouvertement des problèmes plutôt que de les éviter',
      com_2: 'Quand je ne suis pas d\'accord avec quelqu\'un, d\'habitude :',

      // Résolution de conflits
      conf_1: 'J\'essaie de trouver des compromis quand il y a des désaccords',
      conf_2: 'Pendant une dispute, j\'ai tendance à :',

      // Objectifs de vie
      goal_1: 'Classez ces priorités de vie par ordre d\'importance pour vous :',

      // Préférences sociales
      soc_1: 'J\'aime les grands rassemblements sociaux',
      soc_2: 'À quel point aimez-vous être le centre d\'attention ?',

      // Valeurs financières
      fin_1: 'Qu\'est-ce qui décrit le mieux votre approche de l\'argent ?',
    },

    // Options de réponse
    options: {
      // Préférences de taille de famille
      fam_2_1: 'Pas d\'enfants',
      fam_2_2: '1-2 enfants',
      fam_2_3: '3-4 enfants',
      fam_2_4: '5+ enfants',

      // Communication pendant les désaccords
      com_2_1: 'J\'écoute attentivement et j\'essaie de comprendre leur point de vue',
      com_2_2: 'J\'exprime ma position clairement et fermement',
      com_2_3: 'J\'essaie de trouver un terrain d\'entente',
      com_2_4: 'J\'évite la conversation si possible',

      // Style de résolution de conflits
      conf_2_1: 'Je reste calme et me concentre sur les solutions',
      conf_2_2: 'J\'exprime mes émotions ouvertement',
      conf_2_3: 'Je prends le temps de me calmer d\'abord',
      conf_2_4: 'J\'essaie de terminer rapidement',

      // Priorités de vie
      goal_1_1: 'Avancement professionnel',
      goal_1_2: 'Famille et relations',
      goal_1_3: 'Voyages et expériences',
      goal_1_4: 'Croissance personnelle',
      goal_1_5: 'Sécurité financière',

      // Approche financière
      fin_1_1: 'Épargner pour l\'avenir, dépenser prudemment',
      fin_1_2: 'Équilibrer épargne et plaisir de vivre',
      fin_1_3: 'Vivre l\'instant présent, l\'argent est fait pour être dépensé',
      fin_1_4: 'Investir agressivement pour la croissance',
    },

    // Étiquettes
    labels: {
      soc_2: 'Pas du tout → J\'adore ça',
    },

    // Flux d\'évaluation
    continueTitle: 'Continuer l\'évaluation ?',
    continueMessage: 'Vous avez une évaluation sauvegardée en cours. Voulez-vous continuer ou recommencer ?',
    startOver: 'Recommencer',
    continue: 'Continuer',

    exitTitle: 'Quitter l\'évaluation ?',
    exitMessage: 'Votre progrès sera sauvegardé. Vous pourrez continuer plus tard.',
    saveAndExit: 'Sauvegarder et quitter',
    exitWithoutSaving: 'Quitter sans sauvegarder',

    errorTitle: 'Erreur d\'évaluation',
    errorMessage: 'Une erreur s\'est produite lors de votre évaluation. Veuillez réessayer.',
    errorLoading: 'Échec du chargement de l\'évaluation. Veuillez réessayer.',

    loading: 'Chargement de l\'évaluation...',
    saving: 'Sauvegarde...',
    save: 'Sauvegarder',
    complete: 'Terminé',
    answered: 'Répondu',

    scaleInstruction: 'Sélectionnez le nombre qui représente le mieux votre réponse',
    multipleChoiceInstruction: 'Sélectionnez l\'option qui vous décrit le mieux :',
    optionSelected: 'Option sélectionnée',
    rankingInstruction: 'Classez ces éléments par ordre d\'importance pour vous (1 = le plus important) :',
    priority: 'Priorité',
    rankingComplete: 'Classement terminé !',
    sliderInstruction: 'Faites glisser le curseur pour indiquer votre préférence :',
    valueSelected: 'Valeur sélectionnée',

    // Étiquettes descriptives du curseur
    slider: {
      veryLow: 'Très faible',
      low: 'Faible',
      moderate: 'Modéré',
      high: 'Élevé',
      veryHigh: 'Très élevé',
    },
  },

  // Messages de succès
  success: {
    profileUpdated: 'Profil mis à jour avec succès',
    messageSent: 'Message envoyé',
    matchFound: 'Nouvelle correspondance trouvée !',
    dateBooked: 'Rendez-vous réservé avec succès',
    preferencesUpdated: 'Préférences mises à jour avec succès',
    quizCompleted: 'Quiz terminé avec succès !',
    assessmentSaved: 'Progrès de l\'évaluation sauvegardé',
  },

  // Système de quiz - Implémentation complète
  quiz: {
    intro: {
      title: 'Évaluation de personnalité',
      subtitle: 'Découvrez vos traits de personnalité uniques',
      startButton: 'Commencer l\'évaluation',
      continueButton: 'Continuer l\'évaluation',
      viewResultsButton: 'Voir vos résultats',
      features: {
        bigFive: {
          title: 'Les cinq grands traits',
          description: 'Analyser vos caractéristiques fondamentales de personnalité'
        },
        loveLanguages: {
          title: 'Langages d\'amour',
          description: 'Découvrir comment vous exprimez et recevez l\'amour'
        },
        compatibility: {
          title: 'Analyse de compatibilité',
          description: 'Comprendre vos schémas de compatibilité relationnelle'
        }
      },
      estimatedTime: 'Temps estimé : {{minutes}} minutes',
      questionsCount: '{{count}} questions complètes',
      privacyNote: 'Vos réponses sont privées et sécurisées'
    },
    session: {
      starting: 'Démarrage de votre voyage de personnalité...',
      loading: 'Chargement de la question suivante...',
      saving: 'Sauvegarde de votre progrès...',
      completing: 'Finalisation de votre évaluation...',
      error: 'Échec du démarrage de la session de quiz. Veuillez réessayer.',
      submitError: 'Échec de l\'envoi de la réponse. Veuillez réessayer.',
      connectionError: 'Erreur de connexion. Veuillez vérifier votre internet et réessayer.',
      resumeSession: 'Reprendre la session précédente ?',
      newSession: 'Commencer une nouvelle évaluation'
    },
    navigation: {
      next: 'Question suivante',
      previous: 'Question précédente',
      skip: 'Passer la question',
      skipConfirm: 'Êtes-vous sûr de vouloir passer cette question ?',
      skipWarning: 'Les questions passées peuvent affecter la précision de vos résultats.',
      finish: 'Terminer l\'évaluation',
      cancel: 'Annuler',
      exitConfirm: 'Quitter l\'évaluation ?',
      exitMessage: 'Votre progrès sera sauvegardé automatiquement.',
      saveAndExit: 'Sauvegarder et quitter'
    },
    progress: {
      question: 'Question {{current}} sur {{total}}',
      section: 'Section {{current}} sur {{total}}',
      completion: '{{percentage}}% terminé',
      timeRemaining: '{{minutes}} minutes restantes',
      questionsAnswered: '{{answered}} sur {{total}} répondues',
      currentSection: 'Section actuelle : {{section}}'
    },
    personality: {
      traits: {
        openness: 'Ouverture à l\'expérience',
        conscientiousness: 'Conscienciosité',
        extraversion: 'Extraversion',
        agreeableness: 'Agréabilité',
        neuroticism: 'Stabilité émotionnelle'
      },
      scores: {
        veryLow: 'Très faible',
        low: 'Faible',
        moderate: 'Modéré',
        high: 'Élevé',
        veryHigh: 'Très élevé'
      },
      insights: {
        openness: {
          high: 'Vous êtes imaginatif, créatif et ouvert aux nouvelles expériences.',
          low: 'Vous préférez la routine et les approches traditionnelles de la vie.'
        },
        conscientiousness: {
          high: 'Vous êtes organisé, discipliné et orienté vers les objectifs.',
          low: 'Vous avez tendance à être plus spontané et flexible dans votre approche.'
        },
        extraversion: {
          high: 'Vous êtes extraverti, énergique et appréciez les interactions sociales.',
          low: 'Vous préférez les environnements plus calmes et les petits groupes sociaux.'
        },
        agreeableness: {
          high: 'Vous êtes coopératif, confiant et attentionné envers les autres.',
          low: 'Vous avez tendance à être plus compétitif et sceptique envers les autres.'
        },
        neuroticism: {
          high: 'Vous êtes émotionnellement stable et gérez bien le stress.',
          low: 'Vous pourriez être plus sensible au stress et aux changements émotionnels.'
        }
      }
    },
    results: {
      title: 'Votre profil de personnalité',
      subtitle: 'Basé sur vos réponses, voici votre analyse de personnalité unique',
      shareTitle: 'Mes résultats de personnalité BLONG',
      shareMessage: 'Je viens de terminer mon évaluation de personnalité sur BLONG ! Regardez mes résultats.',
      retakeButton: 'Refaire l\'évaluation',
      saveResults: 'Sauvegarder les résultats',
      requestDate: 'Demander un rendez-vous',
      detailedAnalysis: 'Voir l\'analyse détaillée',
      personalityType: 'Votre type de personnalité : {{type}}',
      overallScore: 'Score de compatibilité global : {{score}}%'
    }
  },

  // Système d\'alertes et d\'erreurs
  alerts: {
    errors: {
      quizFailed: 'Échec du démarrage de la session de quiz. Veuillez réessayer.',
      loadFailed: 'Échec du chargement des données. Veuillez réessayer.',
      profileSaveFailed: 'Échec de la sauvegarde du profil. Veuillez réessayer.',
      connectionFailed: 'Échec de la connexion. Veuillez vérifier votre connexion internet.',
      sessionExpired: 'Votre session a expiré. Veuillez vous reconnecter.',
      permissionDenied: 'Permission refusée. Veuillez vérifier vos paramètres.',
      validationFailed: 'Veuillez vérifier votre saisie et réessayer.',
      unknownError: 'Une erreur inattendue s\'est produite. Veuillez réessayer.',
      networkTimeout: 'Délai d\'attente de la requête dépassé. Veuillez réessayer.',
      serverError: 'Erreur serveur. Veuillez réessayer plus tard.',
      storageError: 'Échec de la sauvegarde locale des données. Veuillez vérifier l\'espace de stockage.',
      cameraError: 'Accès à la caméra refusé. Veuillez activer les permissions de caméra.',
      locationError: 'Accès à la localisation refusé. Veuillez activer les permissions de localisation.',

      // Conseils de récupération
      recoverySteps: 'Comment résoudre ceci :',
      assessmentError: 'Échec du chargement de l\'évaluation. Veuillez réessayer.',
      paymentError: 'Échec du traitement du paiement. Veuillez réessayer.',
      bookingError: 'Échec de la réservation du rendez-vous. Veuillez réessayer.',
      uploadError: 'Échec du téléchargement de l\'image. Veuillez réessayer.',
      deleteError: 'Échec de la suppression de l\'élément. Veuillez réessayer.',
      updateError: 'Échec de la mise à jour des informations. Veuillez réessayer.',
      syncError: 'Échec de la synchronisation des données. Veuillez vérifier votre connexion.',
      backupError: 'Échec de la sauvegarde des données. Veuillez réessayer plus tard.',
      restoreError: 'Échec de la restauration des données. Veuillez réessayer.',
      exportError: 'Échec de l\'exportation des données. Veuillez réessayer.',
      importError: 'Échec de l\'importation des données. Veuillez vérifier le format du fichier.',
      subscriptionError: 'Erreur d\'abonnement. Veuillez contacter le support.',
      premiumRequired: 'Cette fonctionnalité nécessite un abonnement BLONG Premium.',
      accountLocked: 'Compte temporairement verrouillé. Veuillez contacter le support.',
      tooManyAttempts: 'Trop de tentatives. Veuillez réessayer plus tard.'
    },
    success: {
      messageSent: 'Votre message a été envoyé. Nous vous recontacterons bientôt !',
      profileUpdated: 'Profil mis à jour avec succès !',
      preferencesUpdated: 'Préférences mises à jour avec succès !',
      assessmentCompleted: 'Évaluation terminée avec succès !',
      photoUploaded: 'Photo téléchargée avec succès !',
      matchFound: 'Nouvelle correspondance trouvée !',
      dateBooked: 'Rendez-vous réservé avec succès !',
      paymentProcessed: 'Paiement traité avec succès !',
      passwordChanged: 'Mot de passe changé avec succès !',
      emailVerified: 'Email vérifié avec succès !',
      accountCreated: 'Compte créé avec succès !',
      subscriptionUpdated: 'Abonnement mis à jour avec succès !',
      dataExported: 'Données exportées avec succès !',
      dataImported: 'Données importées avec succès !',
      backupCreated: 'Sauvegarde créée avec succès !',
      dataRestored: 'Données restaurées avec succès !',
      settingsSaved: 'Paramètres sauvegardés avec succès !',
      notificationsSent: 'Notifications envoyées avec succès !'
    },
    warnings: {
      unsavedChanges: 'Vous avez des modifications non sauvegardées. Êtes-vous sûr de vouloir partir ?',
      deleteConfirm: 'Êtes-vous sûr de vouloir supprimer cet élément ?',
      permanentAction: 'Cette action ne peut pas être annulée.',
      dataLoss: 'Cette action peut entraîner une perte de données.',
      offlineMode: 'Vous êtes actuellement hors ligne. Certaines fonctionnalités peuvent ne pas être disponibles.',
      lowStorage: 'L\'espace de stockage est faible. Veuillez libérer de l\'espace.',
      expiringSoon: 'Votre abonnement expire bientôt. Renouvelez pour continuer à profiter des fonctionnalités premium.',
      incompleteProfile: 'Complétez votre profil pour obtenir de meilleures correspondances.',
      locationDisabled: 'Les services de localisation sont désactivés. Activez-les pour de meilleures correspondances.',
      notificationDisabled: 'Les notifications sont désactivées. Vous pourriez manquer des mises à jour importantes.'
    },
    info: {
      loading: 'Veuillez patienter pendant que nous traitons votre demande...',
      processing: 'Traitement de vos informations...',
      syncing: 'Synchronisation de vos données...',
      connecting: 'Connexion au serveur...',
      uploading: 'Téléchargement des fichiers...',
      downloading: 'Téléchargement du contenu...',
      analyzing: 'Analyse de votre compatibilité...',
      searching: 'Recherche de correspondances...',
      optimizing: 'Optimisation de votre expérience...',
      updating: 'Mise à jour de vos informations...',
      verifying: 'Vérification de vos détails...',
      authenticating: 'Authentification de votre compte...'
    }
  },

  // Formatage de date et heure
  dateTime: {
    formats: {
      short: 'dd/MM/yyyy',
      medium: 'dd MMM yyyy',
      long: 'dd MMMM yyyy',
      full: 'EEEE dd MMMM yyyy',
      time: 'HH:mm',
      dateTime: 'dd MMM yyyy HH:mm'
    },
    relative: {
      now: 'à l\'instant',
      minuteAgo: 'il y a 1 minute',
      minutesAgo: 'il y a {{count}} minutes',
      hourAgo: 'il y a 1 heure',
      hoursAgo: 'il y a {{count}} heures',
      dayAgo: 'il y a 1 jour',
      daysAgo: 'il y a {{count}} jours',
      weekAgo: 'il y a 1 semaine',
      weeksAgo: 'il y a {{count}} semaines',
      monthAgo: 'il y a 1 mois',
      monthsAgo: 'il y a {{count}} mois',
      yearAgo: 'il y a 1 an',
      yearsAgo: 'il y a {{count}} ans'
    },
    calendar: {
      today: 'Aujourd\'hui',
      tomorrow: 'Demain',
      yesterday: 'Hier',
      thisWeek: 'Cette semaine',
      nextWeek: 'La semaine prochaine',
      lastWeek: 'La semaine dernière',
      thisMonth: 'Ce mois-ci',
      nextMonth: 'Le mois prochain',
      lastMonth: 'Le mois dernier'
    }
  },

  // Système de notifications
  notifications: {
    types: {
      dateConfirmed: 'Rendez-vous confirmé ! 🎉',
      timeToPrep: 'Il est temps de se préparer !',
      feedback: 'Comment ça s\'est passé ? 💭',
      dateAvailable: 'Nouvelle opportunité de rendez-vous disponible !',
      messageReceived: 'Nouveau message reçu',
      profileViewed: 'Quelqu\'un a consulté votre profil',
      subscriptionExpiring: 'Abonnement expire bientôt',
      assessmentReminder: 'Terminez votre évaluation de personnalité',
      dateReminder: 'Vous avez un rendez-vous à venir',
      paymentDue: 'Paiement dû bientôt'
    },
    actions: {
      view: 'Voir',
      dismiss: 'Ignorer',
      remind: 'Me rappeler plus tard',
      markRead: 'Marquer comme lu',
      markAllRead: 'Tout marquer comme lu',
      settings: 'Paramètres de notification'
    }
  },

  // Network Status
  network: {
    online: 'En ligne',
    offline: 'Hors ligne',
    connected: 'Connecté',
    connecting: 'Connexion...',
    reconnecting: 'Reconnexion...',
    connectionRestored: 'Connexion rétablie',
    connectionLost: 'Connexion perdue',
    connectionStable: 'Connexion stable',
    noConnection: 'Aucune connexion Internet',
    weakConnection: 'Connexion faible détectée',
    connectionType: 'Type de connexion',
    processingQueue: 'Traitement de {{count}} actions en attente...',
    queuedActions: '{{count}} actions en attente pour la connexion',
    retryConnection: 'Réessayer la connexion',
    checkConnection: 'Vérifier la connexion',
    offlineMode: 'Mode hors ligne',
    offlineModeDescription: 'Vous êtes actuellement hors ligne. Les actions seront sauvegardées et traitées lors du rétablissement de la connexion.',
    queueStatus: 'Statut de la file d\'attente',
    queueEmpty: 'Aucune action en attente',
    queueProcessing: 'Traitement des actions en attente...',
    queueCompleted: 'Toutes les actions en attente sont terminées',
    queueFailed: 'Certaines actions ont échoué',
  },

  // Success messages
  success: {
    success: 'Succès !',
    operationCompleted: 'Opération terminée avec succès',
    profileUpdated: 'Profil mis à jour avec succès',
    profileUpdatedMessage: 'Les informations de votre profil ont été sauvegardées et mises à jour',
    feedbackSent: 'Commentaires envoyés',
    feedbackSentMessage: 'Merci pour vos commentaires ! Nous apprécions votre contribution',
    dateAvailable: 'Nouveau rendez-vous disponible !',
    dateBooked: 'Rendez-vous réservé avec succès',
    dateBookedMessage: 'Votre rendez-vous a été confirmé et programmé',
    preferencesUpdated: 'Préférences mises à jour avec succès',
    preferencesUpdatedMessage: 'Vos préférences ont été sauvegardées et seront appliquées',
    quizCompleted: 'Quiz terminé avec succès !',
    quizCompletedMessage: 'Votre évaluation de personnalité a été terminée et analysée',
    assessmentSaved: 'Progression de l\'évaluation sauvegardée',
    assessmentCompleted: 'Évaluation terminée !',
    assessmentCompletedMessage: 'Votre évaluation complète est maintenant terminée',
    photoUploaded: 'Photo téléchargée avec succès',
    photoUploadedMessage: 'Votre photo a été téléchargée et traitée',
    paymentProcessed: 'Paiement traité avec succès',
    paymentProcessedMessage: 'Votre paiement a été confirmé et traité',
    emailVerified: 'Email vérifié avec succès',
    emailVerifiedMessage: 'Votre adresse email a été vérifiée et confirmée',
    passwordChanged: 'Mot de passe changé avec succès',
    passwordChangedMessage: 'Votre mot de passe a été mis à jour et sécurisé',
    accountCreated: 'Compte créé avec succès',
    accountCreatedMessage: 'Bienvenue sur BLONG ! Votre compte est prêt à être utilisé',
    dataSynced: 'Données synchronisées',
    dataSyncedMessage: 'Vos données ont été synchronisées sur tous les appareils',
    backupCreated: 'Sauvegarde créée avec succès',
    backupCreatedMessage: 'Vos données ont été sauvegardées en toute sécurité',
    settingsSaved: 'Paramètres sauvegardés',
    settingsSavedMessage: 'Vos paramètres ont été sauvegardés et appliqués',
  },

  // Photo Upload
  photoUpload: {
    selectPhoto: 'Sélectionner une photo',
    selectPhotoDescription: 'Choisissez comment vous souhaitez ajouter une photo',
    takePhoto: 'Prendre une photo',
    chooseFromGallery: 'Choisir dans la galerie',
    processing: 'Traitement de l\'image',
    processingDescription: 'Optimisation de votre photo pour la meilleure qualité...',
    cameraError: 'Erreur de caméra',
    cameraErrorMessage: 'Impossible d\'accéder à la caméra. Veuillez vérifier les autorisations.',
    galleryError: 'Erreur de galerie',
    galleryErrorMessage: 'Impossible d\'accéder à la galerie photo. Veuillez vérifier les autorisations.',
    processingError: 'Erreur de traitement',
    processingErrorMessage: 'Échec du traitement de l\'image sélectionnée.',
    fileTooLarge: 'Fichier trop volumineux. Taille maximale : {{size}}MB.',
    invalidFormat: 'Format invalide. Formats supportés : {{formats}}',
    uploadError: 'Échec du téléchargement',
    uploadErrorMessage: 'Échec du téléchargement de la photo. Veuillez réessayer.',
    uploadSuccess: 'Photo téléchargée avec succès',
    uploadSuccessMessage: 'Votre photo a été téléchargée et traitée.',
  },

  // Compatibility & Matching
  compatibility: {
    score: 'Score de compatibilité',
    breakdown: 'Répartition de la compatibilité',
    personality: 'Personnalité',
    preferences: 'Préférences',
    values: 'Valeurs',
    interaction: 'Interaction',
    insights: 'Insights IA',
    conversationStarters: 'Sujets de conversation',
    suggestedVenues: 'Lieux de rendez-vous suggérés',
    strengths: 'Forces relationnelles',
    challenges: 'Domaines à naviguer',
    arrangeDate: 'Organiser un rendez-vous',
    learnMore: 'En savoir plus',
    exceptional: 'Exceptionnel',
    excellent: 'Excellent',
    good: 'Bon',
    moderate: 'Modéré',
    challenging: 'Difficile',
    personalityCompatibility: 'Compatibilité de personnalité',
    valueAlignment: 'Alignement des valeurs',
    lifestyleMatch: 'Correspondance de style de vie',
    communicationStyle: 'Style de communication',
    relationshipGoals: 'Objectifs relationnels',
    familyValues: 'Valeurs familiales',
    religiousViews: 'Vues religieuses',
    educationLevel: 'Niveau d\'éducation',
    careerAmbitions: 'Ambitions professionnelles',
    socialPreferences: 'Préférences sociales',
    conflictResolution: 'Résolution de conflits',
    emotionalIntelligence: 'Intelligence émotionnelle',
    trustAndSecurity: 'Confiance et sécurité',
    intimacyAndAffection: 'Intimité et affection',
    sharedInterests: 'Intérêts partagés',
    complementaryTraits: 'Traits complémentaires',
    growthPotential: 'Potentiel de croissance',
    longTermCompatibility: 'Compatibilité à long terme',
    dateRecommendation: 'Recommandation de rendez-vous',
    venuePreferences: 'Préférences de lieu',
    activitySuggestions: 'Suggestions d\'activités',
    timingRecommendations: 'Recommandations de timing',
    conversationTopics: 'Sujets de conversation',
    relationshipAdvice: 'Conseils relationnels',
    compatibilityReport: 'Rapport de compatibilité',
    detailedAnalysis: 'Analyse détaillée',
    aiInsights: 'Insights alimentés par l\'IA',
    personalityProfile: 'Profil de personnalité',
    matchingAlgorithm: 'Algorithme de correspondance',
    compatibilityFactors: 'Facteurs de compatibilité',
    relationshipPrediction: 'Prédiction relationnelle',
    successProbability: 'Probabilité de succès',
    recommendationConfidence: 'Confiance de recommandation',
  },

  // Safety & Security
  safety: {
    dashboard: {
      title: 'Centre de Sécurité',
    },
    status: {
      title: 'Statut de Sécurité',
      verification: 'Vérification du Profil',
      threatLevel: 'Niveau de Menace',
      activeCheckIns: 'Check-ins Actifs',
      active: 'actif',
    },
    verification: {
      basic: 'Vérification de base',
      verified: 'Entièrement vérifié',
      upgrade: 'Améliorer',
      requested: 'Vérification demandée avec succès',
    },
    threatLevel: {
      low: 'Risque faible',
      medium: 'Risque moyen',
      high: 'Risque élevé',
      critical: 'Risque critique',
    },
    emergency: {
      title: 'Urgence',
      alert: 'Alerte d\'Urgence',
      confirm: 'Envoyer l\'Alerte',
      confirmTitle: 'Alerte d\'Urgence',
      confirmMessage: 'Ceci notifiera immédiatement vos contacts d\'urgence et les autorités locales. À utiliser uniquement en cas d\'urgence réelle.',
      confirmDescription: 'Les services d\'urgence et vos contacts de sécurité seront notifiés immédiatement.',
      sending: 'Envoi de l\'alerte...',
      alertSent: 'Alerte d\'Urgence Envoyée',
      alertSentMessage: 'Votre alerte d\'urgence a été envoyée à {{contacts}} contacts. Services d\'urgence : {{emergency}}',
      alertFailed: 'Échec de l\'envoi de l\'alerte d\'urgence',
      helpOnWay: 'L\'aide arrive. Restez en sécurité.',
    },
    checkIn: {
      title: 'Check-in de Sécurité',
      start: 'Démarrer le Check-in de Sécurité',
      started: 'Check-in de sécurité démarré avec succès',
      startFailed: 'Échec du démarrage du check-in de sécurité',
      loadFailed: 'Échec du chargement des données de check-in',
      updateFailed: 'Échec de la mise à jour du statut de check-in',
      endFailed: 'Échec de la fin du check-in',
      initializing: 'Initialisation du check-in de sécurité...',
      actions: 'Comment allez-vous ?',
      nextCheckIn: 'jusqu\'au prochain check-in',
      dueTitle: 'Check-in de Sécurité',
      dueMessage: 'Il est temps pour votre check-in de sécurité. Comment allez-vous ?',
      imSafe: 'Je vais bien',
      delayed: 'En retard',
      needHelp: 'Besoin d\'aide',
      emergency: 'Urgence',
      end: 'Terminer le Check-in',
      endTitle: 'Terminer le Check-in de Sécurité',
      endMessage: 'Êtes-vous sûr de vouloir terminer votre check-in de sécurité ?',
      endConfirm: 'Terminer le Check-in',
      ended: 'Check-in de sécurité terminé avec succès',
      statusUpdated: 'Statut de check-in mis à jour',
      status: {
        safe: 'En sécurité',
        delayed: 'En retard',
        help_needed: 'Besoin d\'aide',
        emergency: 'Urgence',
        no_response: 'Aucune réponse',
      },
    },
    features: {
      title: 'Fonctionnalités de Sécurité',
      enabled: '{{feature}} activé',
      disabled: '{{feature}} désactivé',
      updateFailed: 'Échec de la mise à jour de la fonctionnalité de sécurité',
      threatDetection: 'Détection de Menaces',
      threatDetectionDescription: 'Surveillance alimentée par l\'IA pour les comportements suspects',
      locationSharing: 'Partage de Localisation',
      locationSharingDescription: 'Partagez votre localisation avec les contacts d\'urgence',
      autoCheckIn: 'Check-in Automatique',
      autoCheckInDescription: 'Check-ins de sécurité automatiques pendant les rendez-vous',
      incognitoMode: 'Mode Incognito',
      incognitoModeDescription: 'Confidentialité et anonymat renforcés',
    },
    loading: 'Chargement des données de sécurité...',
  },

};
