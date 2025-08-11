import { Injectable } from '@nestjs/common';

@Injectable()
export class SystemService {
  /**
   * Get available languages for the application
   */
  async getAvailableLanguages() {
    const languages = [
      {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        flag: '🇺🇸',
        isDefault: true,
      },
      {
        code: 'es',
        name: 'Spanish',
        nativeName: 'Español',
        flag: '🇪🇸',
        isDefault: false,
      },
      {
        code: 'fr',
        name: 'French',
        nativeName: 'Français',
        flag: '🇫🇷',
        isDefault: false,
      },
      {
        code: 'ar',
        name: 'Arabic',
        nativeName: 'العربية',
        flag: '🇸🇦',
        isDefault: false,
      },
    ];

    return {
      success: true,
      data: languages,
    };
  }

  /**
   * Get relationship phases for user selection
   */
  async getRelationshipPhases() {
    const phases = [
      {
        id: 'single',
        name: 'Singles Journey',
        description: 'For individuals preparing for meaningful relationships',
        theme: 'Reflective, clean, airy',
        colors: ['#E8E2F0', '#F5F3F7', '#FFE4E6'], // Lavender, cool beige, soft rose
        features: ['self-reflection', 'partner-values', 'personality-tests'],
        icon: '🌸',
      },
      {
        id: 'preparing',
        name: 'Preparing for Engagement',
        description: 'For couples preparing for engagement',
        theme: 'Hopeful, structured, playful',
        colors: ['#FFE4E6', '#FF8A80', '#1A237E'], // Blush pink, warm coral, navy blue
        features: ['vision-boards', 'relationship-timeline', 'couples-journal'],
        icon: '💕',
      },
      {
        id: 'engaged',
        name: 'Before Engagement',
        description: 'For engaged couples preparing for marriage',
        theme: 'Romantic, elegant, focused',
        colors: ['#E91E63', '#1565C0', '#8E24AA'], // Rose gold, deep blue, muted plum
        features: ['wedding-planning', 'vendor-database', 'financial-planning'],
        icon: '💍',
      },
    ];

    return {
      success: true,
      data: phases,
    };
  }

  /**
   * Get ice breaker questions for conversations
   */
  async getIceBreakers(language = 'en') {
    const iceBreakers = {
      en: [
        "What's your favorite way to spend a weekend?",
        "If you could travel anywhere in the world, where would you go?",
        "What's something you're passionate about?",
        "What's your favorite book or movie and why?",
        "What's the best advice you've ever received?",
        "If you could have dinner with anyone, who would it be?",
        "What's something new you'd like to learn?",
        "What's your favorite childhood memory?",
        "What makes you laugh the most?",
        "What's your dream job?",
      ],
      es: [
        "¿Cuál es tu forma favorita de pasar un fin de semana?",
        "Si pudieras viajar a cualquier lugar del mundo, ¿a dónde irías?",
        "¿Qué es algo que te apasiona?",
        "¿Cuál es tu libro o película favorita y por qué?",
        "¿Cuál es el mejor consejo que has recibido?",
        "Si pudieras cenar con cualquier persona, ¿quién sería?",
        "¿Qué es algo nuevo que te gustaría aprender?",
        "¿Cuál es tu recuerdo favorito de la infancia?",
        "¿Qué es lo que más te hace reír?",
        "¿Cuál es el trabajo de tus sueños?",
      ],
      fr: [
        "Quelle est votre façon préférée de passer un week-end?",
        "Si vous pouviez voyager n'importe où dans le monde, où iriez-vous?",
        "Qu'est-ce qui vous passionne?",
        "Quel est votre livre ou film préféré et pourquoi?",
        "Quel est le meilleur conseil que vous ayez jamais reçu?",
        "Si vous pouviez dîner avec n'importe qui, qui serait-ce?",
        "Qu'est-ce que vous aimeriez apprendre de nouveau?",
        "Quel est votre souvenir d'enfance préféré?",
        "Qu'est-ce qui vous fait le plus rire?",
        "Quel est le travail de vos rêves?",
      ],
      ar: [
        "ما هي طريقتك المفضلة لقضاء عطلة نهاية الأسبوع؟",
        "إذا كان بإمكانك السفر إلى أي مكان في العالم، فأين ستذهب؟",
        "ما هو الشيء الذي تشعر بالشغف تجاهه؟",
        "ما هو كتابك أو فيلمك المفضل ولماذا؟",
        "ما هي أفضل نصيحة تلقيتها على الإطلاق؟",
        "إذا كان بإمكانك تناول العشاء مع أي شخص، فمن سيكون؟",
        "ما هو الشيء الجديد الذي تود تعلمه؟",
        "ما هي ذكرى طفولتك المفضلة؟",
        "ما الذي يجعلك تضحك أكثر؟",
        "ما هو عملك المثالي؟",
      ],
    };

    return {
      success: true,
      data: iceBreakers[language] || iceBreakers.en,
    };
  }

  /**
   * Get date activity suggestions
   */
  async getDateActivities(language = 'en') {
    const activities = {
      en: [
        { category: 'Outdoor', name: 'Walk in the park', description: 'Enjoy nature together' },
        { category: 'Cultural', name: 'Visit a museum', description: 'Explore art and history' },
        { category: 'Food', name: 'Try a new restaurant', description: 'Discover new cuisines' },
        { category: 'Entertainment', name: 'Watch a movie', description: 'Enjoy a film together' },
        { category: 'Active', name: 'Go hiking', description: 'Adventure in nature' },
        { category: 'Creative', name: 'Art class', description: 'Learn something new together' },
        { category: 'Relaxing', name: 'Coffee shop', description: 'Casual conversation' },
        { category: 'Adventure', name: 'Mini golf', description: 'Fun and playful activity' },
      ],
      es: [
        { category: 'Al aire libre', name: 'Caminar en el parque', description: 'Disfruten de la naturaleza juntos' },
        { category: 'Cultural', name: 'Visitar un museo', description: 'Exploren arte e historia' },
        { category: 'Comida', name: 'Probar un restaurante nuevo', description: 'Descubran nuevas cocinas' },
        { category: 'Entretenimiento', name: 'Ver una película', description: 'Disfruten de un filme juntos' },
        { category: 'Activo', name: 'Ir de excursión', description: 'Aventura en la naturaleza' },
        { category: 'Creativo', name: 'Clase de arte', description: 'Aprendan algo nuevo juntos' },
        { category: 'Relajante', name: 'Cafetería', description: 'Conversación casual' },
        { category: 'Aventura', name: 'Mini golf', description: 'Actividad divertida y juguetona' },
      ],
      fr: [
        { category: 'Extérieur', name: 'Promenade dans le parc', description: 'Profitez de la nature ensemble' },
        { category: 'Culturel', name: 'Visiter un musée', description: 'Explorez l\'art et l\'histoire' },
        { category: 'Nourriture', name: 'Essayer un nouveau restaurant', description: 'Découvrez de nouvelles cuisines' },
        { category: 'Divertissement', name: 'Regarder un film', description: 'Profitez d\'un film ensemble' },
        { category: 'Actif', name: 'Faire de la randonnée', description: 'Aventure dans la nature' },
        { category: 'Créatif', name: 'Cours d\'art', description: 'Apprenez quelque chose de nouveau ensemble' },
        { category: 'Relaxant', name: 'Café', description: 'Conversation décontractée' },
        { category: 'Aventure', name: 'Mini golf', description: 'Activité amusante et ludique' },
      ],
      ar: [
        { category: 'في الهواء الطلق', name: 'المشي في الحديقة', description: 'استمتعا بالطبيعة معاً' },
        { category: 'ثقافي', name: 'زيارة متحف', description: 'استكشفا الفن والتاريخ' },
        { category: 'طعام', name: 'تجربة مطعم جديد', description: 'اكتشفا مأكولات جديدة' },
        { category: 'ترفيه', name: 'مشاهدة فيلم', description: 'استمتعا بفيلم معاً' },
        { category: 'نشط', name: 'المشي لمسافات طويلة', description: 'مغامرة في الطبيعة' },
        { category: 'إبداعي', name: 'درس فني', description: 'تعلما شيئاً جديداً معاً' },
        { category: 'مريح', name: 'مقهى', description: 'محادثة غير رسمية' },
        { category: 'مغامرة', name: 'الجولف المصغر', description: 'نشاط ممتع ومرح' },
      ],
    };

    return {
      success: true,
      data: activities[language] || activities.en,
    };
  }
}
