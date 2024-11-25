import { IUserProfile } from './types';

export interface IGameState {
    id: string;
    created_at: string;
    current_step: number;
    total_steps: number;
    progress: number;
    total_points: number;
    title: string;
    description: string;
    location: string;
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
    bm_steps_game_state?: IGameState;
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
    rarity: string; // common | rare | epic | legendary
    points: number;
    share_message?: string;
    how_to_achieve: string;
    conditions: IAchievementConditions;
}

export interface IAchievementConditions {
    // Progreso
    steps_completed?: number;
    total_rewards_collected?: number;
    total_points_earned?: number;
    qr_codes_scanned?: number;
    social_shared?: number;

    // Precisión
    correct_answers?: number;
    required_accuracy?: number;
    consecutive_correct_answers?: number;
    perfect_steps?: number;

    // Velocidad
    time_limit?: number; // Segundos
    steps_in_timeframe?: number;
    questions_in_timeframe?: number;
    timeframe_window?: number; // Horas

    // Racha
    days_required?: number;
    minimum_daily_steps?: number;
    minimum_daily_points?: number;
    last_login_date?: string;
    current_streak?: number;
}

export interface IBMGameStepsRegistered {
    user_id: string;
    step_id: string;
    created_at: string;
    is_unlocked: boolean;
    is_qr_scanned: boolean;
    is_completed: boolean;
    current_question_index: number;
    correct_answers: number;
    time_spent: number;
    users?: IUserProfile[];
    bm_steps?: IStep[];
}

export interface IStepFormData {
    id?: string;
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
    bm_steps_game_state?: IGameStateFormData;
    bm_steps_questions?: IQuestionFormData[];
    bm_steps_rewards?: IRewardFormData[];
}

export interface IStepQuestionFormData {
    id: string;
    text: string;
    options: string[];
    correct_answer: number;
    explanation?: string;
    difficulty: string;
    points: number;
    created_at?: string;
    bm_step_id?: string;
}

export interface IGameStateFormData {
    id: string;
    created_at: string;
    current_step: number;
    total_steps: number;
    progress: number;
    total_points: number;
    title: string;
    description: string;
    location: string;
}

export interface IQuestionFormData {
    id: string;
    text: string;
    options: string[];
    correct_answer: string;
    answered?: boolean;
    explanation?: string;
    difficulty: string;
    points: number;
    bm_step_id?: string;
}

export interface IRewardFormData {
    id: string;
    name: string;
    description: string;
    correct_answers: number;
    total_questions: number;
    claim_location: string;
    claimed: boolean;
    bm_step_id?: string;
}

export interface IConfigurationStepFormData {
    id: string;
    step_number: number;
    title: string;
    description: string;
    location: string;
    is_unlocked: boolean;
    bm_state_id: string;
    bm_steps_game_state?: IGameStateFormData;
    bm_steps_questions: IQuestionFormData[];
    bm_steps_rewards?: IRewardFormData[];
}
