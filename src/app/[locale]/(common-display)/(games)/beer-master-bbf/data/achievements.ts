import { IAchievement } from '@/lib/types/beerMasterGame';

export const achievementTypes = {
    progress: {
        name: 'Progreso',
        description: 'Logros basados en completar objetivos específicos',
        icon: 'target',
    },
    accuracy: {
        name: 'Precisión',
        description: 'Logros basados en la exactitud de las respuestas',
        icon: 'award',
    },
    speed: {
        name: 'Velocidad',
        description:
            'Logros basados en completar objetivos en un tiempo determinado',
        icon: 'clock',
    },
    streak: {
        name: 'Racha',
        description: 'Logros basados en mantener una constancia de actividad',
        icon: 'flame',
    },
};

export const achievements: IAchievement[] = [
    {
        id: 'first-step',
        name: 'Primer Sorbo',
        description: 'Completa tu primer paso',
        icon: 'beer',
        progress: 0,
        target: 1,
        type: 'progress',
        rarity: 'common',
        points: 100,
        how_to_achieve:
            'Completa cualquier paso del recorrido cervecero por primera vez',
        conditions: {
            steps_completed: 1,
        },
        bm_game_id: '1',
    },
    {
        id: 'perfect-score',
        name: 'Maestría Cervecera',
        description: 'Obtén todas las respuestas correctas en un paso',
        icon: 'award',
        progress: 0,
        target: 1,
        type: 'accuracy',
        rarity: 'rare',
        points: 250,
        how_to_achieve:
            'Responde correctamente todas las preguntas de un paso sin fallar ninguna',
        conditions: {
            perfect_steps: 1,
            required_accuracy: 100,
        },
        bm_game_id: '1',
    },
    {
        id: 'speed-master',
        name: 'Velocista',
        description: 'Completa un paso en menos de 2 minutos',
        icon: 'timer',
        progress: 0,
        target: 1,
        type: 'speed',
        rarity: 'epic',
        points: 300,
        how_to_achieve:
            'Completa todas las preguntas de un paso en menos de 120 segundos',
        conditions: {
            time_limit: 120,
            steps_in_timeframe: 1,
        },
        bm_game_id: '1',
    },
    // {
    //     id: 'daily-streak',
    //     name: 'Sed de Conocimiento',
    //     description: 'Mantén una racha de 3 días',
    //     icon: 'flame',
    //     progress: 0,
    //     target: 3,
    //     type: 'streak',
    //     rarity: 'rare',
    //     points: 200,
    //     howToAchieve: 'Completa al menos un paso durante 3 días consecutivos',
    //     conditions: {
    //         daysRequired: 3,
    //         minimumDailySteps: 1,
    //     },
    // },
    // {
    //     id: 'social-butterfly',
    //     name: 'Mariposa Social',
    //     description: 'Comparte tu progreso en redes sociales 5 veces',
    //     icon: 'share',
    //     progress: 0,
    //     target: 5,
    //     type: 'progress',
    //     rarity: 'common',
    //     points: 150,
    //     howToAchieve:
    //         'Utiliza el botón de compartir para publicar tus logros en redes sociales',
    //     conditions: {
    //         socialShares: 5,
    //     },
    // },
    // {
    //     id: 'collector',
    //     name: 'Coleccionista',
    //     description: 'Reclama 3 recompensas diferentes',
    //     icon: 'gift',
    //     progress: 0,
    //     target: 3,
    //     type: 'progress',
    //     rarity: 'rare',
    //     points: 200,
    //     howToAchieve:
    //         'Completa los requisitos y reclama 3 recompensas diferentes en los stands',
    //     conditions: {
    //         totalRewardsCollected: 3,
    //     },
    // },
    // {
    //     id: 'explorer',
    //     name: 'Explorador',
    //     description: 'Visita todos los stands del evento',
    //     icon: 'compass',
    //     progress: 0,
    //     target: 7,
    //     type: 'progress',
    //     rarity: 'epic',
    //     points: 350,
    //     howToAchieve:
    //         'Escanea los códigos QR de todos los stands participantes',
    //     conditions: {
    //         qrCodesScanned: 7,
    //     },
    // },
    // {
    //     id: 'knowledge-master',
    //     name: 'Maestro del Conocimiento',
    //     description: 'Acumula 1000 puntos en total',
    //     icon: 'brain',
    //     progress: 0,
    //     target: 1000,
    //     type: 'progress',
    //     rarity: 'legendary',
    //     points: 500,
    //     howToAchieve:
    //         'Acumula 1000 puntos respondiendo preguntas y completando desafíos',
    //     conditions: {
    //         totalPointsEarned: 1000,
    //     },
    // },
    // {
    //     id: 'quick-learner',
    //     name: 'Aprendiz Veloz',
    //     description: 'Completa 3 pasos en un solo día',
    //     icon: 'zap',
    //     progress: 0,
    //     target: 3,
    //     type: 'speed',
    //     rarity: 'epic',
    //     points: 400,
    //     howToAchieve:
    //         'Completa 3 pasos diferentes durante el mismo día del evento',
    //     conditions: {
    //         stepsInTimeframe: 3,
    //         timeframeWindow: 24,
    //     },
    // },
    // {
    //     id: 'perfect-week',
    //     name: 'Semana Perfecta',
    //     description: 'Mantén una racha de 7 días consecutivos',
    //     icon: 'calendar',
    //     progress: 0,
    //     target: 7,
    //     type: 'streak',
    //     rarity: 'legendary',
    //     points: 1000,
    //     howToAchieve:
    //         'Completa al menos un paso cada día durante una semana completa',
    //     conditions: {
    //         daysRequired: 7,
    //         minimumDailySteps: 1,
    //     },
    // },
    // {
    //     id: 'accuracy-master',
    //     name: 'Maestro de la Precisión',
    //     description: 'Acierta 20 preguntas consecutivas',
    //     icon: 'target',
    //     progress: 0,
    //     target: 20,
    //     type: 'accuracy',
    //     rarity: 'legendary',
    //     points: 750,
    //     howToAchieve:
    //         'Responde correctamente 20 preguntas seguidas sin fallar ninguna',
    //     conditions: {
    //         consecutiveCorrectAnswers: 20,
    //     },
    // },
    // {
    //     id: 'speed-demon',
    //     name: 'Demonio de la Velocidad',
    //     description:
    //         'Responde 10 preguntas correctamente en menos de 5 minutos',
    //     icon: 'zap',
    //     progress: 0,
    //     target: 10,
    //     type: 'speed',
    //     rarity: 'epic',
    //     points: 500,
    //     howToAchieve:
    //         'Responde correctamente 10 preguntas en menos de 300 segundos',
    //     conditions: {
    //         questionsInTimeframe: 10,
    //         timeLimit: 300,
    //         requiredAccuracy: 100,
    //     },
    // },
];
