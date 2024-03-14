import {
    ICPFixed,
    ICPMobile,
    IEvent,
    IProducerUser,
    IProduct,
    IUserTable,
} from './types';

export enum Difficulty {
    EASY = 'easy',
    MEDIUM = 'medium',
    HARD = 'hard',
}

export type Question = {
    id?: string;
    category?: string;
    correct_answer: string;
    difficulty: Difficulty;
    incorrect_answers: Array<string>;
    question: string;
    type: string;
    experience_id?: string;
    product_id?: string;
    products?: IProduct;
};

export type QuestionFormData = {
    category?: string;
    difficulty: Difficulty;
    question: string;
    type: string;
    answers: AnswerFormData[];
};

export type AnswerFormData = {
    id?: string;
    answer: string;
    is_correct: boolean;
};

export type QuestionsState = Array<Question & { answers: Array<string> }>;

export type IAddModalExperienceBeerMasterFormData = {
    name: string;
    description: string;
    type: string;
    price: number;
    questions: IAddBeerMasterQuestionFormData[];
};

export type IAddBeerMasterQuestionFormData = {
    question: QuestionFormData;
    beer_master_participation?: IBMExperienceParticipants;
    product_id: string;
};

export type IUpdModalExperienceBeerMasterFormData = {
    id: string;
    name: string;
    description: string;
    type: string;
    price: number;
    producer_id: string;
    questions: IUpdBeerMasterQuestionFormData[];
};

export type IUpdBeerMasterQuestionFormData = {
    id?: string;
    experience_id: string;
    question: QuestionFormData;
    product_id: string;
};

export type IExperience = {
    id: string;
    created_at: string;
    name: string;
    description: string;
    producer_id: string;
    type: string;
    price: number;
    producer_user?: IProducerUser;
    bm_questions?: Question[];
};

export interface IEventExperience {
    id: string;
    created_at: string;
    event_id: string;
    cp_mobile_id: string;
    cp_fixed_id: string;
    experience_id: string;
    cp_mobile?: ICPMobile;
    cp_fixed?: ICPFixed;
    experiences?: IExperience;
    events?: IEvent;
}

export interface IBMExperienceParticipants {
    id: string;
    created_at: string;
    gamification_id: string;
    event_id: string;
    cpm_id: string;
    cpf_id: string;
    score: number;
    is_paid: boolean;
    is_cash: boolean;
    is_finished: boolean;
    correct_answers: number;
    incorrect_answers: number;
    users?: IUserTable[];
}

export interface IBMExperienceUserResponse {
    id?: string;
    created_at: string;
    participation_id: string;
    is_correct: boolean;
    answer: string;
    score: number;
    question_id: string;
    question?: Question;
}
