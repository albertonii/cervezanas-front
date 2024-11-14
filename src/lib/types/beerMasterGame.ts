export interface IGameState {
    id: string;
    created_at: string;
    current_step: number;
    total_steps: number;
    progress: number;
    total_points: number;
    bm_steps?: IStep[];
    bm_steps_achievements?: IAchievement[];
}

export interface IStep {
    id: string;
    created_at: string;
    step_number: number;
    title: string;
    description: string;
    location: string;
    is_unlocked: boolean;
    is_completed: boolean;
    is_qr_scanned: boolean;
    current_question_index: number;
    correct_answers: number;
    time_spent?: number;
    last_visited?: string;
    bm_state_id: string;
    bm_steps_game_stae?: IGameState;
    bm_steps_questions?: IQuestion[];
    bm_steps_rewards?: IReward[];
}

export interface IQuestion {
    id: string;
    created_at: string;
    text: string;
    options: string[];
    correct_answer: number;
    answered?: boolean;
    explanation?: string;
    // difficulty: 'fácil' | 'medio' | 'difícil';
    difficulty: string;
    points: number;
    bm_step_id: string;
    bm_steps?: IStep;
}

export interface IReward {
    id: string;
    name: string;
    description: string;
    correct_answers: number;
    total_questions: number;
    claim_location: string;
    claimed: boolean;
    bm_step_id: string;
    bm_steps?: IStep;
}

export interface IAchievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlocked_at?: string;
    progress: number;
    target: number;
    type: string;
    bm_game_id: string;
    bm_steps_game_state?: IGameState;
    // type: 'progress' | 'accuracy' | 'speed' | 'streak';
}
