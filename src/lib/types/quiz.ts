import { Type as ProductType } from '../productEnum';
import { GeoArgs, GeocodeResult } from 'use-places-autocomplete';
import {
    ICPFixed,
    ICPMobile,
    IEvent,
    IProducerUser,
    IProductMedia,
    IUserProfile,
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
    products?: IProductQuizFormData;
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
    experience_id: string;
    cpm_id: string;
    cpf_id: string;
    score: number;
    is_paid: boolean;
    is_cash: boolean;
    is_finished: boolean;
    correct_answers: number;
    incorrect_answers: number;
    gamification?: IGamificationQuizFormData;
    events?: IEventQuizFormData;
    cp_mobile?: ICPMobileQuizFormData;
    cp_fixed?: ICPFixedQuizFormData;
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

interface IEventQuizFormData {
    id: string;
    created_at: string;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    logo_url: string;
    promotional_url: string;
    status: string;
    geoArgs: any[];
    address: string;
    owner_id: string;
}

interface ICPMobileQuizFormData {
    id: string;
    created_at: string;
    cp_id: string;
    cp_name: string;
    cp_description: string;
    organizer_name: string;
    organizer_lastname: string;
    organizer_email: string;
    organizer_phone: string;
    start_date: string;
    end_date: string;
    address: string;
    status: string;
    logo_url: string;
    maximum_capacity: number;
    is_booking_required: boolean;
    // geoArgs: GeoArgs[];
    geoArgs: any[];
    is_internal_organizer: boolean;
    cpm_products?: ICPMProductsQuizFormData[];
    consumption_points?: IConsumptionPointsQuizFormData;
}

interface ICPFixedQuizFormData {
    id: string;
    created_at: string;
    cp_id: string;
    cp_name: string;
    cp_description: string;
    organizer_name: string;
    organizer_lastname: string;
    organizer_email: string;
    organizer_phone: string;
    start_date: string;
    end_date: string;
    address: string;
    status: string;
    logo_url: string;
    maximum_capacity: number;
    is_booking_required: boolean;
    // geoArgs: GeoArgs[];
    geoArgs: any[];

    is_internal_organizer: boolean;
    cpf_products?: ICPFProductsQuizFormData[];
    consumption_points?: IConsumptionPointsQuizFormData;
}

export interface IConsumptionPointsQuizFormData {
    id: string;
    created_at: string;
    cp_fixed_id: string;
    cp_mobile_id: string;
    cp_organizer_status: number;
    owner_id: string;
    cv_name: string;
    cover_letter_name: string;
}

export interface ICPMProductsQuizFormData {
    id: string;
    created_at: string;
    stock: number;
    stock_consumed: number;
    cp_id: string;
    product_pack_id: string;
    product_packs?: IProductPackQuizFormData;
}

export interface ICPFProductsQuizFormData {
    id: string;
    created_at: string;
    stock: number;
    stock_consumed: number;
    cp_id: string;
    product_pack_id: string;
    product_packs?: IProductPackQuizFormData;
}

export type IProductPackQuizFormData = {
    id: string; // PK
    product_id: string; // FK
    created_at: string;
    quantity: number;
    price: number;
    img_url: any;
    name: string;
    randomUUID: string;
};

export type IProductQuizFormData = {
    id: string;
    created_at: string;
    name: string;
    description: string;
    type: ProductType;
    is_public: boolean;
    discount_percent: number;
    weight: number;
    promo_code: string;
    price: number; // TODO : quitar el price - pq está en product_pack
    campaign_id: string;
    is_archived: boolean;
    category: string;
    is_monthly: boolean;
    owner_id: string;
    beers?: IBeerQuizFormData;
    product_media?: IProductMediaQuizFormData;
};

export interface IBeerQuizFormData {
    product_id: string; // FK
    created_at: string;
    category: string;
    fermentation: string;
    color: string;
    family: string;
    era: string;
    aroma: string;
    is_gluten: boolean;
    format: string;
    volume: number;
    sku: string;
    intensity: number;
    origin: string;
    country: string;
    composition: string;
    srm: number;
    og: number;
    fg: number;
}

export interface IProductMediaQuizFormData {
    product_id: string; // PK
    product_media: IProductMedia[];
}

export interface IGamificationQuizFormData {
    user_id: string;
    score: number;
    users?: IUserProfile;
}
