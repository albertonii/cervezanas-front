export interface IStep {
    id: number;
    title: string;
    description: string;
    location: string;
    isUnlocked: boolean;
    isCompleted: boolean;
    isQRScanned: boolean;
    questions: IQuestion[];
    currentQuestionIndex: number;
    correctAnswers: number;
    reward?: IReward;
    timeSpent?: number;
    lastVisited?: Date;
}

export interface IQuestion {
    id: number;
    text: string;
    options: string[];
    correctAnswer: number;
    answered?: boolean;
    explanation?: string;
    // difficulty: 'fácil' | 'medio' | 'difícil';
    difficulty: string;
    points: number;
}

export interface IGameState {
    currentStep: number;
    totalSteps: number;
    progress: number;
    totalPoints: number;
    achievements: IAchievement[];
}

export interface IReward {
    type: string;
    name: string;
    description: string;
    condition: {
        correctAnswers: number;
        totalQuestions: number;
    };
    claimLocation: string;
    claimed: boolean;
}

export interface IAchievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt?: Date;
    progress: number;
    target: number;
    type: string;
    // type: 'progress' | 'accuracy' | 'speed' | 'streak';
}
