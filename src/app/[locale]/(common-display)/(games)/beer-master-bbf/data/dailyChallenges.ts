export const generateDailyChallenges = (): any[] => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    return [
        {
            id: 'daily-1',
            title: 'Explorador Matutino',
            description: 'Completa 2 pasos antes del mediodía',
            points: 200,
            type: 'exploration',
            expiresAt: tomorrow,
            completed: false,
        },
        {
            id: 'daily-2',
            title: 'Sabio Cervecero',
            description: 'Responde 10 preguntas correctamente',
            points: 150,
            type: 'quiz',
            expiresAt: tomorrow,
            completed: false,
        },
        {
            id: 'daily-3',
            title: 'Influencer de la Cerveza',
            description: 'Comparte tu progreso en redes sociales',
            points: 100,
            type: 'social',
            expiresAt: tomorrow,
            completed: false,
        },
    ];
};
