/**
 * BLONG Spanish Translations (Español)
 * Complete Spanish language pack
 */

export default {
  common: {
    continue: 'CONTINUAR',
    back: 'Atrás',
    next: 'Siguiente',
    skip: 'Omitir',
    done: 'Hecho',
    save: 'Guardar',
    cancel: 'Cancelar',
    loading: 'Cargando...',
    error: 'Algo salió mal',
    success: '¡Éxito!',
    retry: 'Intentar de nuevo',
    tryAgain: 'Intentar de nuevo',
    ok: 'OK',
    processing: 'PROCESANDO...',
    changing: 'CAMBIANDO...',
    notSelected: 'No seleccionado',
    notNow: 'Ahora no',
    viewDetails: 'Ver detalles',
    
    // Form fields
    email: 'Email',
    password: 'Contraseña',
    name: 'Nombre',
    phone: 'Número de teléfono',
  },

  // Onboarding flow
  onboarding: {
    // Brand
    brand: 'BLONG',
    brandSubtitle: 'Matrimonio Elite',
    tagline: 'MATRIMONIAL DE ÉLITE',
    
    // Language selection
    languageTitle: 'Elige tu idioma',
    languageSubtitle: 'Selecciona tu idioma preferido para la mejor experiencia',
    languageFooter: 'Puedes cambiar esto más tarde en configuración',
    
    // Phase selection
    phaseTitle: '¿Cuál es tu viaje?',
    phaseSubtitle: 'Cuéntanos sobre tu fase de relación actual',
    phaseFooter: 'Esto nos ayuda a personalizar tu experiencia',
    startJourney: 'COMENZAR TU VIAJE',
    
    // Language options with native names
    languages: {
      english: {
        name: 'Inglés',
        nativeName: 'English',
        description: 'Idioma global',
        flag: '🇺🇸',
      },
      arabic: {
        name: 'Árabe',
        nativeName: 'العربية',
        description: 'Idioma árabe',
        flag: '🇸🇦',
      },
      french: {
        name: 'Francés',
        nativeName: 'Français',
        description: 'Idioma francés',
        flag: '🇫🇷',
      },
      spanish: {
        name: 'Español',
        nativeName: 'Español',
        description: 'Idioma español',
        flag: '🇪🇸',
      },
    },
    
    // Relationship phases
    phases: {
      single: {
        title: 'Soltero',
        subtitle: 'Solicitar una cita',
        description: 'Solicita una cita y nuestra IA encontrará tu pareja perfecta, reservará un lugar increíble y organizará todo para ti',
        icon: '💝',
      },
      engagement: {
        title: 'Compromiso',
        subtitle: 'Planificando juntos',
        description: 'Comprometidos y planificando su futuro juntos con su pareja',
        icon: '💍',
      },
      engagement_day_prep: {
        title: 'Preparación del Día de Compromiso',
        subtitle: 'Preparativos Finales',
        description: 'Preparándote para tu día de compromiso con todos los toques y preparativos finales',
        icon: '✨',
      },
    },
  },

  // Authentication
  auth: {
    loginTitle: 'Bienvenido de vuelta',
    loginSubtitle: 'Inicia sesión para continuar tu viaje',
    loginButton: 'Iniciar sesión',
    
    registerTitle: 'Crea tu cuenta',
    registerSubtitle: 'Únete a miles encontrando conexiones significativas',
    registerButton: 'Crear cuenta',
    alreadyHaveAccount: '¿Ya tienes una cuenta?',
    dontHaveAccount: '¿No tienes una cuenta?',
    createAccount: 'Crear cuenta',
    signIn: 'Iniciar sesión',
    
    forgotPassword: '¿Olvidaste tu contraseña?',
    resetPassword: 'Restablecer contraseña',
    rememberMe: 'Recordarme',
    
    // Success messages
    loginSuccess: '¡Bienvenido de vuelta!',
    registerSuccess: '¡Bienvenido a BLONG!',

    // Field labels
    firstName: 'Nombre',
    lastName: 'Apellido',
    email: 'Dirección de correo electrónico',
    password: 'Contraseña',
    confirmPassword: 'Confirmar contraseña',

    // Placeholders
    firstNamePlaceholder: 'Ingresa tu nombre',
    lastNamePlaceholder: 'Ingresa tu apellido',
    emailPlaceholder: 'Ingresa tu dirección de correo electrónico',
    passwordPlaceholder: 'Ingresa tu contraseña',
    confirmPasswordPlaceholder: 'Confirma tu contraseña',
    dateOfBirthPlaceholder: 'Selecciona tu fecha de nacimiento',
    
    // Additional auth fields
    dateOfBirth: 'Fecha de nacimiento',
    gender: 'Género',
    
    // Gender options
    'gender.male': 'Hombre',
    'gender.female': 'Mujer',
    'gender.non_binary': 'No binario',
    'gender.other': 'Otro',
  },

  // Main app
  dashboard: {
    welcome: 'Bienvenido a BLONG',
    subtitle: 'Tu experiencia matrimonial de élite',
    featuredProfiles: 'PERFILES DESTACADOS',
    compatibilityAnalysis: 'ANÁLISIS DE COMPATIBILIDAD',
    takeAction: 'TOMAR ACCIÓN',
    premiumFeatures: 'CARACTERÍSTICAS PREMIUM',
  },

  // Settings
  settings: {
    title: 'Configuración',
    appearance: 'Apariencia',
    language: 'Idioma',
    accessibility: 'Accesibilidad',
    account: 'Cuenta',
    privacy: 'Privacidad',
    notifications: 'Notificaciones',
    signOut: 'Cerrar sesión',
  },

  // Actions
  actions: {
    pass: 'PASAR',
    connect: 'CONECTAR',
    like: 'Me gusta',
    superLike: 'Súper me gusta',
    message: 'Mensaje',
    call: 'Llamar',
    videoCall: 'Videollamada',
  },

  // Premium features
  premium: {
    title: 'BLONG ÉLITE',
    subtitle: 'Acceso exclusivo a perfiles verificados, emparejamiento prioritario y servicio de conserjería',
    upgradeNow: 'ACTUALIZAR AHORA',
    features: {
      verifiedProfiles: 'Perfiles verificados',
      priorityService: 'Servicio prioritario',
      conciergeService: 'Servicio de conserjería',
      unlimitedLikes: 'Me gustas ilimitados',
      advancedFilters: 'Filtros avanzados',
      readReceipts: 'Confirmaciones de lectura',
    },
  },

  // Error messages
  errors: {
    networkError: 'Error de conexión de red',
    serverError: 'Error del servidor, por favor intenta de nuevo',
    validationError: 'Por favor verifica tu entrada',
    authError: 'Fallo de autenticación',
    permissionError: 'Permiso denegado',
  },

  // Profile completion flow
  profile: {
    completion: {
      // Step titles and subtitles
      basicInfo: 'Información básica',
      basicInfoSubtitle: 'Cuéntanos sobre ti',
      location: 'Ubicación',
      locationSubtitle: '¿Dónde te encuentras?',
      physical: 'Detalles físicos',
      physicalSubtitle: 'Información física opcional',
      professional: 'Vida profesional',
      professionalSubtitle: 'Tu carrera y educación',
      personal: 'Contexto personal',
      personalSubtitle: 'Estilo de vida y preferencias',
      additional: 'Información adicional',
      additionalSubtitle: 'Completa tu perfil',
      
      // Navigation
      step: 'Paso',
      of: 'de',
      saving: 'Guardando',
      savingSubtitle: 'Por favor espera mientras guardamos tu información de forma segura...',
      retrySubtitle: 'Intentando reconectar y guardar tus datos',
      processing: 'Procesando tu información...',
      validating: 'Validando información...',
      finalizing: 'Finalizando tu perfil...',

      // Completion messages
      profileComplete: '¡Perfil completado!',
      profileCompleteMessage: 'Tu perfil ha sido completado exitosamente. ¡Ahora puedes comenzar a encontrar coincidencias!',
      errorSaving: 'Hubo un error al guardar tu perfil. Por favor, inténtalo de nuevo.',
    },
    
    // Form fields
    form: {
      // Basic info
      dateOfBirth: 'Fecha de nacimiento',
      dateOfBirthPlaceholder: 'Selecciona tu fecha de nacimiento',
      gender: 'Género',
      genderPlaceholder: 'Selecciona tu género',
      
      // Gender options
      male: 'Hombre',
      female: 'Mujer',
      nonBinary: 'No binario',
      other: 'Otro',
      
      // Physical
      height: 'Altura',
      heightPlaceholder: 'Altura en cm (opcional)',
      weight: 'Peso',
      weightPlaceholder: 'Peso en kg (opcional)',
      
      // Professional
      occupation: 'Ocupación',
      occupationPlaceholder: '¿A qué te dedicas? (opcional)',
      education: 'Educación',
      educationPlaceholder: 'Tu nivel educativo (opcional)',
      
      // Personal
      maritalStatus: 'Estado civil',
      maritalStatusPlaceholder: 'Selecciona tu estado civil (opcional)',
      hasChildren: 'Tiene hijos',
      wantChildren: 'Quiere hijos',
      smoking: 'Fumador',
      drinking: 'Bebedor',
      
      // Marital status options
      single: 'Soltero/a',
      divorced: 'Divorciado/a',
      widowed: 'Viudo/a',
      separated: 'Separado/a',
      
      // Additional
      interests: 'Intereses',
      interestsPlaceholder: 'Selecciona tus intereses (opcional)',
      languages: 'Idiomas',
      languagesPlaceholder: 'Idiomas que hablas (opcional)',
      religion: 'Religión',
      religionPlaceholder: 'Tu religión (opcional)',
      ethnicity: 'Etnia',
      ethnicityPlaceholder: 'Tu etnia (opcional)',
      
      // Interest options
      travel: 'Viajes',
      reading: 'Lectura',
      sports: 'Deportes',
      music: 'Música',
      movies: 'Películas',
      cooking: 'Cocina',
      art: 'Arte',
      photography: 'Fotografía',
      dancing: 'Baile',
      hiking: 'Senderismo',
      fitness: 'Fitness',
      gaming: 'Videojuegos',
      technology: 'Tecnología',
      fashion: 'Moda',
      food: 'Comida',
    },
  },

  // Geolocation and form components
  location: {
    detecting: 'Detectando tu ubicación...',
    detectingSubtitle: 'Estamos encontrando automáticamente tu ubicación para proporcionarte mejores coincidencias cercanas.',
    detected: '¡Ubicación detectada exitosamente!',
    detectionError: 'No se pudo detectar la ubicación',
    detectionErrorSubtitle: 'No pudimos detectar automáticamente tu ubicación. Puedes intentar de nuevo o ingresarla manualmente.',
    findVenues: 'Encuentra mejores lugares cerca',
    findVenuesSubtitle: 'Podemos detectar automáticamente tu ubicación para mostrarte lugares de cita en tu área.',
    detectButton: 'Detectar mi ubicación',
    editManually: 'Editar manualmente',
    enterManually: 'Ingresar manualmente',
    enterManuallyInstead: 'Ingresar manualmente en su lugar',
    detectAgain: 'Detectar de nuevo',
    tryAgain: 'Intentar de nuevo',
    locationCaptured: 'Información de ubicación capturada',
    
    // Form fields
    country: 'País',
    countryPlaceholder: 'Ingresa tu país',
    city: 'Ciudad',
    cityPlaceholder: 'Ingresa tu ciudad',
    region: 'Región/Estado',
    regionPlaceholder: 'Ingresa tu región o estado (opcional)',
    district: 'Distrito/Barrio',
    districtPlaceholder: 'Ingresa tu distrito o barrio (opcional)',
    postalCode: 'Código postal',
    postalCodePlaceholder: 'Ingresa tu código postal (opcional)',
  },

  // Form components
  form: {
    // Date picker
    selectDate: 'Selecciona tu fecha de nacimiento',
    cancel: 'Cancelar',
    done: 'Listo',
    
    // Multi-select
    selected: 'seleccionado(s)',
    
    // General
    required: 'Requerido',
    optional: 'Opcional',
  },

  // Settings screens
  settings: {
    title: 'Configuración',
    subtitle: 'Administra tu cuenta y preferencias',
    loading: 'Cargando configuración',
    loadingSubtitle: 'Preparando tus preferencias',
    
    // User profile card
    phaseNotSelected: 'Fase no seleccionada',
    
    // Settings sections
    account: 'Cuenta',
    privacySecurity: 'Privacidad y seguridad',
    support: 'Soporte',
    
    // Account items
    editProfile: 'Editar perfil',
    editProfileSubtitle: 'Actualiza tu información personal',
    preferences: 'Preferencias',
    preferencesSubtitle: 'Configuración de idioma y fase relacional',
    
    // Privacy & Security items
    privacySettings: 'Configuración de privacidad',
    privacySettingsSubtitle: 'Controla tu privacidad y visibilidad',
    security: 'Seguridad',
    securitySubtitle: 'Contraseña y seguridad de cuenta',
    
    // Support items
    helpSupport: 'Ayuda y soporte',
    helpSupportSubtitle: 'Obtén ayuda y contacta al soporte',
    about: 'Acerca de BLONG',
    aboutSubtitle: 'Versión de la aplicación e información',
    
    // Logout
    logout: 'Cerrar sesión',
    loggingOut: 'Cerrando sesión...',
    logoutConfirm: '¿Estás seguro de que quieres cerrar sesión?',
  },

  // Help & Support
  help: {
    faq: {
      howDating: '¿Cómo funciona el sistema de citas de BLONG?',
      howDatingAnswer: 'BLONG utiliza algoritmos de IA avanzados para analizar tu personalidad y preferencias para crear experiencias de cita perfectas en lugares increíbles.',
      dataSecure: '¿Están seguros mis datos?',
      dataSecureAnswer: 'Sí, utilizamos encriptación y medidas de seguridad estándar de la industria para proteger tu información personal y garantizar tu privacidad.',
      improveDates: '¿Cómo puedo obtener mejores recomendaciones de citas?',
      improveDatesAnswer: 'Completa tu evaluación de personalidad, agrega información detallada al perfil, y actualiza regularmente tus preferencias para obtener mejores recomendaciones de citas.',
      changePhase: '¿Puedo cambiar mi fase relacional?',
      changePhaseAnswer: 'Sí, puedes actualizar tu fase relacional en la sección Preferencias de Configuración en cualquier momento.',
      reportBehavior: '¿Cómo reporto comportamiento inapropiado?',
      reportBehaviorAnswer: 'Puedes reportar cualquier comportamiento inapropiado a través del menú de perfil o contactando directamente a nuestro equipo de soporte.',
    },
    
    contact: {
      emailSupport: 'Soporte por correo',
      emailSupportSubtitle: 'Obtén ayuda por correo electrónico',
      phone: 'Soporte telefónico',
      phoneSubtitle: 'Llámanos para asistencia inmediata',
      chat: 'Chat en vivo',
      chatSubtitle: 'Chatea con nuestro equipo de soporte',
    },
  },

  // Error handling
  errors: {
    network: {
      title: 'Problema de conexión',
      message: 'Por favor verifica tu conexión a internet e inténtalo de nuevo.',
      action: 'Reintentar',
    },
    auth: {
      invalidCredentials: {
        title: 'Credenciales inválidas',
        message: 'El correo electrónico o la contraseña que ingresaste es incorrecta.',
        action: 'Intentar de nuevo',
      },
      general: {
        title: 'Error de autenticación',
        message: 'No se pudo autenticar. Por favor inténtalo de nuevo.',
        action: 'Reintentar',
      },
    },
    validation: {
      title: 'Información inválida',
      message: 'Por favor verifica tu información e inténtalo de nuevo.',
      action: 'Corregir errores',
    },
    server: {
      critical: {
        title: 'Servicio no disponible',
        message: 'Nuestros servidores están temporalmente no disponibles. Por favor inténtalo más tarde.',
        action: 'Intentar más tarde',
      },
      general: {
        title: 'Error del servidor',
        message: 'Algo salió mal de nuestro lado. Por favor inténtalo de nuevo.',
        action: 'Reintentar',
      },
    },
    unknown: {
      title: 'Error inesperado',
      message: 'Ocurrió un error inesperado. Por favor inténtalo de nuevo.',
      action: 'Reintentar',
    },
  },

  // Form validation
  validation: {
    email: {
      required: 'La dirección de correo electrónico es requerida',
      invalid: 'Por favor ingresa una dirección de correo electrónico válida',
    },
    password: {
      required: 'La contraseña es requerida',
      minLength: 'La contraseña debe tener al menos 8 caracteres',
    },
    firstName: {
      required: 'El nombre es requerido',
      invalid: 'Por favor ingresa un nombre válido',
    },
    lastName: {
      required: 'El apellido es requerido',
      invalid: 'Por favor ingresa un apellido válido',
    },
    confirmPassword: {
      required: 'Por favor confirma tu contraseña',
      mismatch: 'Las contraseñas no coinciden',
    },
    fillBasicInfo: 'Por favor completa la información básica',
    selectCountryCity: 'Por favor selecciona tu país y ciudad',
    requiredFields: 'Campos requeridos',
    maritalStatusRequired: 'El estado civil es requerido',
    hasChildrenRequired: 'Por favor especifica si tienes hijos',
    wantChildrenRequired: 'Por favor especifica si quieres hijos',
  },

  // App general
  app: {
    name: 'BLONG',
  },

  // Navigation
  navigation: {
    home: 'Inicio',
    dates: 'Citas',
    personality: 'Personalidad',
    articles: 'Artículos',
    settings: 'Configuración',
  },

  // Evaluación de personalidad (mejorada)
  assessment: {
    title: 'Evaluación de personalidad',
    subtitle: 'Ayúdanos a entenderte mejor para encontrar tu pareja ideal',
    startButton: 'Comenzar evaluación',
    continueButton: 'Continuar',
    previousButton: 'Anterior',
    nextButton: 'Siguiente',
    finishButton: 'Terminar evaluación',
    saveProgress: 'Guardar progreso',

    // Progreso
    progress: 'Pregunta {{current}} de {{total}}',
    sectionProgress: 'Sección {{current}} de {{total}}',
    timeRemaining: '{{minutes}} minutos restantes',

    // Secciones
    sections: {
      personalityCore: 'Personalidad fundamental',
      personalityCoreDesc: 'Entender tus rasgos fundamentales de personalidad',
      relationshipValues: 'Valores de relación',
      relationshipValuesDesc: 'Tu enfoque hacia las relaciones y comunicación',
      lifestyleGoals: 'Estilo de vida y objetivos',
      lifestyleGoalsDesc: 'Tus prioridades de vida y preferencias sociales',
    },

    // Etiquetas de escala Likert
    likert: {
      stronglyDisagree: 'Muy en desacuerdo',
      disagree: 'En desacuerdo',
      slightlyDisagree: 'Algo en desacuerdo',
      neutral: 'Neutral',
      slightlyAgree: 'Algo de acuerdo',
      agree: 'De acuerdo',
      stronglyAgree: 'Muy de acuerdo',
    },

    // Preguntas de evaluación
    questions: {
      // Extraversión
      ext_1: 'Soy el alma de la fiesta',
      ext_2: 'Prefiero mantenerme solo/a',
      ext_3: 'Me siento cómodo/a con las personas',

      // Amabilidad
      agr_1: 'Me interesan las personas',
      agr_2: 'Insulto a las personas',
      agr_3: 'Simpatizo con los sentimientos de otros',

      // Responsabilidad
      con_1: 'Siempre estoy preparado/a',
      con_2: 'Dejo mis pertenencias por ahí',
      con_3: 'Presto atención a los detalles',

      // Neuroticismo
      neu_1: 'Me estreso fácilmente',
      neu_2: 'Estoy relajado/a la mayor parte del tiempo',

      // Apertura
      ope_1: 'Tengo un vocabulario rico',
      ope_2: 'Tengo dificultad para entender ideas abstractas',

      // Orientación familiar
      fam_1: 'La familia es lo más importante en mi vida',
      fam_2: '¿Cuántos hijos te gustaría tener idealmente?',

      // Estilo de comunicación
      com_1: 'Prefiero discutir los problemas abiertamente en lugar de evitarlos',
      com_2: 'Cuando no estoy de acuerdo con alguien, usualmente:',

      // Resolución de conflictos
      conf_1: 'Trato de encontrar compromisos cuando hay desacuerdos',
      conf_2: 'Durante una discusión, tiendo a:',

      // Metas de vida
      goal_1: 'Clasifica estas prioridades de vida en orden de importancia para ti:',

      // Preferencias sociales
      soc_1: 'Disfruto las reuniones sociales grandes',
      soc_2: '¿Cuánto disfrutas ser el centro de atención?',

      // Valores financieros
      fin_1: '¿Qué describe mejor tu enfoque hacia el dinero?',
    },

    // Opciones de respuesta
    options: {
      // Preferencias de tamaño de familia
      fam_2_1: 'Sin hijos',
      fam_2_2: '1-2 hijos',
      fam_2_3: '3-4 hijos',
      fam_2_4: '5+ hijos',

      // Comunicación durante desacuerdos
      com_2_1: 'Escucho cuidadosamente y trato de entender su perspectiva',
      com_2_2: 'Expreso mi posición clara y firmemente',
      com_2_3: 'Trato de encontrar un punto medio',
      com_2_4: 'Evito la conversación si es posible',

      // Estilo de resolución de conflictos
      conf_2_1: 'Me mantengo calmado/a y me enfoco en soluciones',
      conf_2_2: 'Expreso mis emociones abiertamente',
      conf_2_3: 'Tomo tiempo para calmarme primero',
      conf_2_4: 'Trato de terminarlo rápidamente',

      // Prioridades de vida
      goal_1_1: 'Avance profesional',
      goal_1_2: 'Familia y relaciones',
      goal_1_3: 'Viajes y experiencias',
      goal_1_4: 'Crecimiento personal',
      goal_1_5: 'Seguridad financiera',

      // Enfoque financiero
      fin_1_1: 'Ahorrar para el futuro, gastar cuidadosamente',
      fin_1_2: 'Equilibrar ahorro y disfrute de la vida',
      fin_1_3: 'Vivir el momento, el dinero es para gastarlo',
      fin_1_4: 'Invertir agresivamente para el crecimiento',
    },

    // Etiquetas
    labels: {
      soc_2: 'Para nada → Me encanta',
    },

    // Flujo de evaluación
    continueTitle: '¿Continuar evaluación?',
    continueMessage: 'Tienes una evaluación guardada en progreso. ¿Te gustaría continuar o empezar de nuevo?',
    startOver: 'Empezar de nuevo',
    continue: 'Continuar',

    exitTitle: '¿Salir de la evaluación?',
    exitMessage: 'Tu progreso se guardará. Puedes continuar más tarde.',
    saveAndExit: 'Guardar y salir',
    exitWithoutSaving: 'Salir sin guardar',

    errorTitle: 'Error de evaluación',
    errorMessage: 'Hubo un error completando tu evaluación. Por favor, inténtalo de nuevo.',
    errorLoading: 'Falló cargar la evaluación. Por favor, inténtalo de nuevo.',

    loading: 'Cargando evaluación...',
    saving: 'Guardando...',
    save: 'Guardar',
    complete: 'Completo',
    answered: 'Respondido',

    scaleInstruction: 'Selecciona el número que mejor represente tu respuesta',
    multipleChoiceInstruction: 'Selecciona la opción que mejor te describa:',
    optionSelected: 'Opción seleccionada',
    rankingInstruction: 'Clasifica estos elementos en orden de importancia para ti (1 = más importante):',
    priority: 'Prioridad',
    rankingComplete: '¡Clasificación completa!',
    sliderInstruction: 'Arrastra el deslizador para indicar tu preferencia:',
    valueSelected: 'Valor seleccionado',

    // Etiquetas descriptivas del deslizador
    slider: {
      veryLow: 'Muy bajo',
      low: 'Bajo',
      moderate: 'Moderado',
      high: 'Alto',
      veryHigh: 'Muy alto',
    },
  },

  // Mensajes de éxito
  success: {
    profileUpdated: 'Perfil actualizado exitosamente',
    messageSent: 'Mensaje enviado',
    matchFound: '¡Nueva coincidencia encontrada!',
    dateBooked: 'Cita reservada exitosamente',
    preferencesUpdated: 'Preferencias actualizadas exitosamente',
    quizCompleted: '¡Quiz completado exitosamente!',
    assessmentSaved: 'Progreso de evaluación guardado',
  },

  // Sistema de quiz - Implementación completa
  quiz: {
    intro: {
      title: 'Evaluación de personalidad',
      subtitle: 'Descubre tus rasgos únicos de personalidad',
      startButton: 'Comenzar evaluación',
      continueButton: 'Continuar evaluación',
      viewResultsButton: 'Ver tus resultados',
      features: {
        bigFive: {
          title: 'Los cinco grandes rasgos',
          description: 'Analizar tus características fundamentales de personalidad'
        },
        loveLanguages: {
          title: 'Lenguajes del amor',
          description: 'Descubrir cómo expresas y recibes amor'
        },
        compatibility: {
          title: 'Análisis de compatibilidad',
          description: 'Entender tus patrones de compatibilidad relacional'
        }
      },
      estimatedTime: 'Tiempo estimado: {{minutes}} minutos',
      questionsCount: '{{count}} preguntas completas',
      privacyNote: 'Tus respuestas son privadas y seguras'
    },
    session: {
      starting: 'Iniciando tu viaje de personalidad...',
      loading: 'Cargando siguiente pregunta...',
      saving: 'Guardando tu progreso...',
      completing: 'Completando tu evaluación...',
      error: 'Falló iniciar sesión de quiz. Por favor, inténtalo de nuevo.',
      submitError: 'Falló enviar respuesta. Por favor, inténtalo de nuevo.',
      connectionError: 'Error de conexión. Por favor, verifica tu internet e inténtalo de nuevo.',
      resumeSession: '¿Reanudar sesión anterior?',
      newSession: 'Comenzar nueva evaluación'
    },
    navigation: {
      next: 'Siguiente pregunta',
      previous: 'Pregunta anterior',
      skip: 'Saltar pregunta',
      skipConfirm: '¿Estás seguro/a de que quieres saltar esta pregunta?',
      skipWarning: 'Las preguntas saltadas pueden afectar la precisión de tus resultados.',
      finish: 'Terminar evaluación',
      cancel: 'Cancelar',
      exitConfirm: '¿Salir de la evaluación?',
      exitMessage: 'Tu progreso se guardará automáticamente.',
      saveAndExit: 'Guardar y salir'
    },
    progress: {
      question: 'Pregunta {{current}} de {{total}}',
      section: 'Sección {{current}} de {{total}}',
      completion: '{{percentage}}% completado',
      timeRemaining: '{{minutes}} minutos restantes',
      questionsAnswered: '{{answered}} de {{total}} respondidas',
      currentSection: 'Sección actual: {{section}}'
    },
    personality: {
      traits: {
        openness: 'Apertura a la experiencia',
        conscientiousness: 'Responsabilidad',
        extraversion: 'Extraversión',
        agreeableness: 'Amabilidad',
        neuroticism: 'Estabilidad emocional'
      },
      scores: {
        veryLow: 'Muy bajo',
        low: 'Bajo',
        moderate: 'Moderado',
        high: 'Alto',
        veryHigh: 'Muy alto'
      },
      insights: {
        openness: {
          high: 'Eres imaginativo/a, creativo/a y abierto/a a nuevas experiencias.',
          low: 'Prefieres la rutina y enfoques tradicionales a la vida.'
        },
        conscientiousness: {
          high: 'Eres organizado/a, disciplinado/a y orientado/a a objetivos.',
          low: 'Tiendes a ser más espontáneo/a y flexible en tu enfoque.'
        },
        extraversion: {
          high: 'Eres extrovertido/a, enérgico/a y disfrutas las interacciones sociales.',
          low: 'Prefieres ambientes más tranquilos y grupos sociales pequeños.'
        },
        agreeableness: {
          high: 'Eres cooperativo/a, confiado/a y considerado/a con otros.',
          low: 'Tiendes a ser más competitivo/a y escéptico/a de otros.'
        },
        neuroticism: {
          high: 'Eres emocionalmente estable y manejas bien el estrés.',
          low: 'Podrías ser más sensible al estrés y cambios emocionales.'
        }
      }
    },
    results: {
      title: 'Tu perfil de personalidad',
      subtitle: 'Basado en tus respuestas, aquí está tu análisis único de personalidad',
      shareTitle: 'Mis resultados de personalidad BLONG',
      shareMessage: '¡Acabo de completar mi evaluación de personalidad en BLONG! Mira mis resultados.',
      retakeButton: 'Repetir evaluación',
      saveResults: 'Guardar resultados',
      requestDate: 'Solicitar una cita',
      detailedAnalysis: 'Ver análisis detallado',
      personalityType: 'Tu tipo de personalidad: {{type}}',
      overallScore: 'Puntuación de compatibilidad general: {{score}}%'
    }
  },

  // Sistema de alertas y errores
  alerts: {
    errors: {
      quizFailed: 'Falló iniciar sesión de quiz. Por favor, inténtalo de nuevo.',
      loadFailed: 'Falló cargar datos. Por favor, inténtalo de nuevo.',
      profileSaveFailed: 'Falló guardar perfil. Por favor, inténtalo de nuevo.',
      connectionFailed: 'Falló la conexión. Por favor, verifica tu conexión a internet.',
      sessionExpired: 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.',
      permissionDenied: 'Permiso denegado. Por favor, verifica tu configuración.',
      validationFailed: 'Por favor, verifica tu entrada e inténtalo de nuevo.',
      unknownError: 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.',
      networkTimeout: 'Tiempo de espera de solicitud agotado. Por favor, inténtalo de nuevo.',
      serverError: 'Error del servidor. Por favor, inténtalo más tarde.',
      storageError: 'Falló guardar datos localmente. Por favor, verifica el espacio de almacenamiento.',
      cameraError: 'Acceso a cámara denegado. Por favor, habilita permisos de cámara.',
      locationError: 'Acceso a ubicación denegado. Por favor, habilita permisos de ubicación.',

      // Pasos de recuperación
      recoverySteps: 'Cómo solucionarlo:',
      assessmentError: 'Falló cargar evaluación. Por favor, inténtalo de nuevo.',
      paymentError: 'Falló procesar pago. Por favor, inténtalo de nuevo.',
      bookingError: 'Falló reservar cita. Por favor, inténtalo de nuevo.',
      uploadError: 'Falló subir imagen. Por favor, inténtalo de nuevo.',
      deleteError: 'Falló eliminar elemento. Por favor, inténtalo de nuevo.',
      updateError: 'Falló actualizar información. Por favor, inténtalo de nuevo.',
      syncError: 'Falló sincronizar datos. Por favor, verifica tu conexión.',
      backupError: 'Falló respaldar datos. Por favor, inténtalo más tarde.',
      restoreError: 'Falló restaurar datos. Por favor, inténtalo de nuevo.',
      exportError: 'Falló exportar datos. Por favor, inténtalo de nuevo.',
      importError: 'Falló importar datos. Por favor, verifica el formato del archivo.',
      subscriptionError: 'Error de suscripción. Por favor, contacta soporte.',
      premiumRequired: 'Esta función requiere suscripción BLONG Premium.',
      accountLocked: 'Cuenta temporalmente bloqueada. Por favor, contacta soporte.',
      tooManyAttempts: 'Demasiados intentos. Por favor, inténtalo más tarde.'
    },
    success: {
      messageSent: '¡Tu mensaje ha sido enviado. Te contactaremos pronto!',
      profileUpdated: '¡Perfil actualizado exitosamente!',
      preferencesUpdated: '¡Preferencias actualizadas exitosamente!',
      assessmentCompleted: '¡Evaluación completada exitosamente!',
      photoUploaded: '¡Foto subida exitosamente!',
      matchFound: '¡Nueva coincidencia encontrada!',
      dateBooked: '¡Cita reservada exitosamente!',
      paymentProcessed: '¡Pago procesado exitosamente!',
      passwordChanged: '¡Contraseña cambiada exitosamente!',
      emailVerified: '¡Email verificado exitosamente!',
      accountCreated: '¡Cuenta creada exitosamente!',
      subscriptionUpdated: '¡Suscripción actualizada exitosamente!',
      dataExported: '¡Datos exportados exitosamente!',
      dataImported: '¡Datos importados exitosamente!',
      backupCreated: '¡Respaldo creado exitosamente!',
      dataRestored: '¡Datos restaurados exitosamente!',
      settingsSaved: '¡Configuración guardada exitosamente!',
      notificationsSent: '¡Notificaciones enviadas exitosamente!'
    },
    warnings: {
      unsavedChanges: 'Tienes cambios sin guardar. ¿Estás seguro/a de que quieres salir?',
      deleteConfirm: '¿Estás seguro/a de que quieres eliminar este elemento?',
      permanentAction: 'Esta acción no se puede deshacer.',
      dataLoss: 'Esta acción puede resultar en pérdida de datos.',
      offlineMode: 'Actualmente estás sin conexión. Algunas funciones pueden no estar disponibles.',
      lowStorage: 'El almacenamiento del dispositivo está bajo. Por favor, libera algo de espacio.',
      expiringSoon: 'Tu suscripción expira pronto. Renueva para continuar disfrutando las funciones premium.',
      incompleteProfile: 'Completa tu perfil para obtener mejores coincidencias.',
      locationDisabled: 'Los servicios de ubicación están deshabilitados. Habilítalos para mejores coincidencias.',
      notificationDisabled: 'Las notificaciones están deshabilitadas. Podrías perderte actualizaciones importantes.'
    },
    info: {
      loading: 'Por favor, espera mientras procesamos tu solicitud...',
      processing: 'Procesando tu información...',
      syncing: 'Sincronizando tus datos...',
      connecting: 'Conectando al servidor...',
      uploading: 'Subiendo archivos...',
      downloading: 'Descargando contenido...',
      analyzing: 'Analizando tu compatibilidad...',
      searching: 'Buscando coincidencias...',
      optimizing: 'Optimizando tu experiencia...',
      updating: 'Actualizando tu información...',
      verifying: 'Verificando tus detalles...',
      authenticating: 'Autenticando tu cuenta...'
    }
  },

  // Formato de fecha y hora
  dateTime: {
    formats: {
      short: 'dd/MM/yyyy',
      medium: 'dd MMM yyyy',
      long: 'dd MMMM yyyy',
      full: 'EEEE, dd MMMM yyyy',
      time: 'h:mm a',
      dateTime: 'dd MMM yyyy h:mm a'
    },
    relative: {
      now: 'ahora mismo',
      minuteAgo: 'hace 1 minuto',
      minutesAgo: 'hace {{count}} minutos',
      hourAgo: 'hace 1 hora',
      hoursAgo: 'hace {{count}} horas',
      dayAgo: 'hace 1 día',
      daysAgo: 'hace {{count}} días',
      weekAgo: 'hace 1 semana',
      weeksAgo: 'hace {{count}} semanas',
      monthAgo: 'hace 1 mes',
      monthsAgo: 'hace {{count}} meses',
      yearAgo: 'hace 1 año',
      yearsAgo: 'hace {{count}} años'
    },
    calendar: {
      today: 'Hoy',
      tomorrow: 'Mañana',
      yesterday: 'Ayer',
      thisWeek: 'Esta semana',
      nextWeek: 'La próxima semana',
      lastWeek: 'La semana pasada',
      thisMonth: 'Este mes',
      nextMonth: 'El próximo mes',
      lastMonth: 'El mes pasado'
    }
  },

  // Sistema de notificaciones
  notifications: {
    types: {
      dateConfirmed: '¡Cita confirmada! 🎉',
      timeToPrep: '¡Es hora de prepararse!',
      feedback: '¿Cómo fue? 💭',
      dateAvailable: '¡Nueva oportunidad de cita disponible!',
      messageReceived: 'Nuevo mensaje recibido',
      profileViewed: 'Alguien vio tu perfil',
      subscriptionExpiring: 'Suscripción expira pronto',
      assessmentReminder: 'Completa tu evaluación de personalidad',
      dateReminder: 'Tienes una cita próxima',
      paymentDue: 'Pago próximo a vencer'
    },
    actions: {
      view: 'Ver',
      dismiss: 'Descartar',
      remind: 'Recordarme más tarde',
      markRead: 'Marcar como leído',
      markAllRead: 'Marcar todo como leído',
      settings: 'Configuración de notificaciones'
    }
  },

  // Network Status
  network: {
    online: 'En línea',
    offline: 'Sin conexión',
    connected: 'Conectado',
    connecting: 'Conectando...',
    reconnecting: 'Reconectando...',
    connectionRestored: 'Conexión restaurada',
    connectionLost: 'Conexión perdida',
    connectionStable: 'Conexión estable',
    noConnection: 'Sin conexión a Internet',
    weakConnection: 'Conexión débil detectada',
    connectionType: 'Tipo de conexión',
    processingQueue: 'Procesando {{count}} acciones en cola...',
    queuedActions: '{{count}} acciones en cola para cuando esté en línea',
    retryConnection: 'Reintentar conexión',
    checkConnection: 'Verificar conexión',
    offlineMode: 'Modo sin conexión',
    offlineModeDescription: 'Actualmente estás sin conexión. Las acciones se guardarán y procesarán cuando se restaure la conexión.',
    queueStatus: 'Estado de la cola',
    queueEmpty: 'No hay acciones pendientes',
    queueProcessing: 'Procesando acciones en cola...',
    queueCompleted: 'Todas las acciones en cola completadas',
    queueFailed: 'Algunas acciones fallaron al procesarse',
  },

  // Success messages
  success: {
    success: '¡Éxito!',
    operationCompleted: 'Operación completada exitosamente',
    profileUpdated: 'Perfil actualizado exitosamente',
    profileUpdatedMessage: 'La información de tu perfil ha sido guardada y actualizada',
    feedbackSent: 'Comentarios enviados',
    feedbackSentMessage: '¡Gracias por tus comentarios! Apreciamos tu aporte',
    dateAvailable: '¡Nueva cita disponible!',
    dateBooked: 'Cita reservada exitosamente',
    dateBookedMessage: 'Tu cita ha sido confirmada y programada',
    preferencesUpdated: 'Preferencias actualizadas exitosamente',
    preferencesUpdatedMessage: 'Tus preferencias han sido guardadas y se aplicarán',
    quizCompleted: '¡Quiz completado exitosamente!',
    quizCompletedMessage: 'Tu evaluación de personalidad ha sido completada y analizada',
    assessmentSaved: 'Progreso de evaluación guardado',
    assessmentCompleted: '¡Evaluación completada!',
    assessmentCompletedMessage: 'Tu evaluación integral está ahora completa',
    photoUploaded: 'Foto subida exitosamente',
    photoUploadedMessage: 'Tu foto ha sido subida y procesada',
    paymentProcessed: 'Pago procesado exitosamente',
    paymentProcessedMessage: 'Tu pago ha sido confirmado y procesado',
    emailVerified: 'Email verificado exitosamente',
    emailVerifiedMessage: 'Tu dirección de email ha sido verificada y confirmada',
    passwordChanged: 'Contraseña cambiada exitosamente',
    passwordChangedMessage: 'Tu contraseña ha sido actualizada y asegurada',
    accountCreated: 'Cuenta creada exitosamente',
    accountCreatedMessage: '¡Bienvenido a BLONG! Tu cuenta está lista para usar',
    dataSynced: 'Datos sincronizados',
    dataSyncedMessage: 'Tus datos han sido sincronizados en todos los dispositivos',
    backupCreated: 'Respaldo creado exitosamente',
    backupCreatedMessage: 'Tus datos han sido respaldados de forma segura',
    settingsSaved: 'Configuración guardada',
    settingsSavedMessage: 'Tu configuración ha sido guardada y aplicada',
  },

  // Photo Upload
  photoUpload: {
    selectPhoto: 'Seleccionar foto',
    selectPhotoDescription: 'Elige cómo te gustaría agregar una foto',
    takePhoto: 'Tomar foto',
    chooseFromGallery: 'Elegir de la galería',
    processing: 'Procesando imagen',
    processingDescription: 'Optimizando tu foto para la mejor calidad...',
    cameraError: 'Error de cámara',
    cameraErrorMessage: 'No se puede acceder a la cámara. Por favor verifica los permisos.',
    galleryError: 'Error de galería',
    galleryErrorMessage: 'No se puede acceder a la galería de fotos. Por favor verifica los permisos.',
    processingError: 'Error de procesamiento',
    processingErrorMessage: 'Falló el procesamiento de la imagen seleccionada.',
    fileTooLarge: 'Archivo demasiado grande. Tamaño máximo: {{size}}MB.',
    invalidFormat: 'Formato inválido. Formatos soportados: {{formats}}',
    uploadError: 'Fallo en la subida',
    uploadErrorMessage: 'Falló la subida de la foto. Por favor intenta de nuevo.',
    uploadSuccess: 'Foto subida exitosamente',
    uploadSuccessMessage: 'Tu foto ha sido subida y procesada.',
  },

  // Compatibility & Matching
  compatibility: {
    score: 'Puntuación de compatibilidad',
    breakdown: 'Desglose de compatibilidad',
    personality: 'Personalidad',
    preferences: 'Preferencias',
    values: 'Valores',
    interaction: 'Interacción',
    insights: 'Insights de IA',
    conversationStarters: 'Iniciadores de conversación',
    suggestedVenues: 'Lugares de cita sugeridos',
    strengths: 'Fortalezas relacionales',
    challenges: 'Áreas a navegar',
    arrangeDate: 'Organizar cita',
    learnMore: 'Aprender más',
    exceptional: 'Excepcional',
    excellent: 'Excelente',
    good: 'Bueno',
    moderate: 'Moderado',
    challenging: 'Desafiante',
    personalityCompatibility: 'Compatibilidad de personalidad',
    valueAlignment: 'Alineación de valores',
    lifestyleMatch: 'Coincidencia de estilo de vida',
    communicationStyle: 'Estilo de comunicación',
    relationshipGoals: 'Objetivos de relación',
    familyValues: 'Valores familiares',
    religiousViews: 'Puntos de vista religiosos',
    educationLevel: 'Nivel educativo',
    careerAmbitions: 'Ambiciones profesionales',
    socialPreferences: 'Preferencias sociales',
    conflictResolution: 'Resolución de conflictos',
    emotionalIntelligence: 'Inteligencia emocional',
    trustAndSecurity: 'Confianza y seguridad',
    intimacyAndAffection: 'Intimidad y afecto',
    sharedInterests: 'Intereses compartidos',
    complementaryTraits: 'Rasgos complementarios',
    growthPotential: 'Potencial de crecimiento',
    longTermCompatibility: 'Compatibilidad a largo plazo',
    dateRecommendation: 'Recomendación de cita',
    venuePreferences: 'Preferencias de lugar',
    activitySuggestions: 'Sugerencias de actividades',
    timingRecommendations: 'Recomendaciones de tiempo',
    conversationTopics: 'Temas de conversación',
    relationshipAdvice: 'Consejos de relación',
    compatibilityReport: 'Reporte de compatibilidad',
    detailedAnalysis: 'Análisis detallado',
    aiInsights: 'Insights impulsados por IA',
    personalityProfile: 'Perfil de personalidad',
    matchingAlgorithm: 'Algoritmo de emparejamiento',
    compatibilityFactors: 'Factores de compatibilidad',
    relationshipPrediction: 'Predicción de relación',
    successProbability: 'Probabilidad de éxito',
    recommendationConfidence: 'Confianza de recomendación',
  },

  // Safety & Security
  safety: {
    dashboard: {
      title: 'Centro de Seguridad',
    },
    status: {
      title: 'Estado de Seguridad',
      verification: 'Verificación de Perfil',
      threatLevel: 'Nivel de Amenaza',
      activeCheckIns: 'Check-ins Activos',
      active: 'activo',
    },
    verification: {
      basic: 'Verificación básica',
      verified: 'Completamente verificado',
      upgrade: 'Actualizar',
      requested: 'Verificación solicitada exitosamente',
    },
    threatLevel: {
      low: 'Riesgo bajo',
      medium: 'Riesgo medio',
      high: 'Riesgo alto',
      critical: 'Riesgo crítico',
    },
    emergency: {
      title: 'Emergencia',
      alert: 'Alerta de Emergencia',
      confirm: 'Enviar Alerta',
      confirmTitle: 'Alerta de Emergencia',
      confirmMessage: 'Esto notificará inmediatamente a tus contactos de emergencia y autoridades locales. Usar solo en emergencias reales.',
      confirmDescription: 'Los servicios de emergencia y tus contactos de seguridad serán notificados inmediatamente.',
      sending: 'Enviando alerta...',
      alertSent: 'Alerta de Emergencia Enviada',
      alertSentMessage: 'Tu alerta de emergencia ha sido enviada a {{contacts}} contactos. Servicios de emergencia: {{emergency}}',
      alertFailed: 'Falló el envío de la alerta de emergencia',
      helpOnWay: 'La ayuda está en camino. Mantente seguro.',
    },
    checkIn: {
      title: 'Check-in de Seguridad',
      start: 'Iniciar Check-in de Seguridad',
      started: 'Check-in de seguridad iniciado exitosamente',
      startFailed: 'Falló el inicio del check-in de seguridad',
      loadFailed: 'Falló la carga de datos del check-in',
      updateFailed: 'Falló la actualización del estado del check-in',
      endFailed: 'Falló el fin del check-in',
      initializing: 'Inicializando check-in de seguridad...',
      actions: '¿Cómo estás?',
      nextCheckIn: 'hasta el próximo check-in',
      dueTitle: 'Check-in de Seguridad',
      dueMessage: 'Es hora de tu check-in de seguridad. ¿Cómo estás?',
      imSafe: 'Estoy Seguro',
      delayed: 'Llegando Tarde',
      needHelp: 'Necesito Ayuda',
      emergency: 'Emergencia',
      end: 'Terminar Check-in',
      endTitle: 'Terminar Check-in de Seguridad',
      endMessage: '¿Estás seguro de que quieres terminar tu check-in de seguridad?',
      endConfirm: 'Terminar Check-in',
      ended: 'Check-in de seguridad terminado exitosamente',
      statusUpdated: 'Estado de check-in actualizado',
      status: {
        safe: 'Seguro',
        delayed: 'Retrasado',
        help_needed: 'Necesita Ayuda',
        emergency: 'Emergencia',
        no_response: 'Sin Respuesta',
      },
    },
    features: {
      title: 'Características de Seguridad',
      enabled: '{{feature}} habilitado',
      disabled: '{{feature}} deshabilitado',
      updateFailed: 'Falló la actualización de la característica de seguridad',
      threatDetection: 'Detección de Amenazas',
      threatDetectionDescription: 'Monitoreo impulsado por IA para comportamiento sospechoso',
      locationSharing: 'Compartir Ubicación',
      locationSharingDescription: 'Comparte tu ubicación con contactos de emergencia',
      autoCheckIn: 'Check-in Automático',
      autoCheckInDescription: 'Check-ins de seguridad automáticos durante citas',
      incognitoMode: 'Modo Incógnito',
      incognitoModeDescription: 'Privacidad y anonimato mejorados',
    },
    loading: 'Cargando datos de seguridad...',
  },

};
