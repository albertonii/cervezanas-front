import { IBMExperienceParticipants } from './types';

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export type Question = {
  category: string;
  correct_answer: string;
  difficulty: Difficulty;
  incorrect_answers: Array<string>;
  question: string;
  type: string;
};

export type QuestionFormData = {
  category: string;
  difficulty: Difficulty;
  question: string;
  type: string;
  answers: AnswerFormData[];
};

export type AnswerFormData = {
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

export interface IAddBeerMasterQuestionFormData {
  question: QuestionFormData;
  beer_master_participation?: IBMExperienceParticipants;
  product_id: string;
}
