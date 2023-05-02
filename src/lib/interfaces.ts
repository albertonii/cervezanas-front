import {
  UserAppMetadata,
  UserIdentity,
  UserMetadata,
} from "@supabase/supabase-js";
import { IAward, IConsumptionPoints } from "./types";

export interface IModalAddProduct {
  is_public: boolean;
  name: string;
  description: string;
  campaign: string;
  type: string;
  color: number;
  intensity: number;
  aroma: number;
  family: number;
  fermentation: number;
  origin: number;
  era: number;
  is_gluten: string;
  awards: IAward[];
  p_principal: string;
  p_back: string;
  p_extra_1: string;
  p_extra_2: string;
  p_extra_3: string;
  volume: any;
  price: number;
  pack: any;
  format: any;
  stock_quantity: number;
  stock_limit_notification: number;
  lot_id: number;
  lot_quantity: number;
}

export interface IShippingAddress {
  id: string;
  name: string;
  lastname: string;
  document_id: string;
  phone: string;
  address: string;
  address_extra: string;
  address_observations: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  shipping_checked: boolean;
}

export interface IBillingAddress {
  id: string;
  name: string;
  lastname: string;
  document_id: string;
  phone: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  billing_checked: boolean;
}

export interface IPaymentCard {
  id: string;
  card_number: string;
  card_name: string;
  card_month_expiration: string;
  card_year_expiration: string;
  card_cvv: string;
  card_checked: boolean;
  card_holder: string;
  card_document_id: string;
}

export interface ISignUp {
  userCredentials: { email: string; password: string; phone: string };
  options: {
    redirectTo?: string;
    data?: object;
    captchaToken?: string;
  };
}

export interface IUser {
  id: string;
  app_metadata: UserAppMetadata;
  user_metadata: UserMetadata;
  aud: string;
  confirmation_sent_at?: string;
  recovery_sent_at?: string;
  email_change_sent_at?: string;
  new_email?: string;
  invited_at?: string;
  action_link?: string;
  email?: string;
  phone?: string;
  created_at: string;
  confirmed_at?: string;
  email_confirmed_at?: string;
  phone_confirmed_at?: string;
  last_sign_in_at?: string;
  role?: string;
  updated_at?: string;
  identities?: UserIdentity[];
  username: string;
  avatar_url: string;
  cp_organizer_status: number;
  consumption_points: IConsumptionPoints;
}

export enum ROLE_ENUM {
  Cervezano = "consumer",
  Productor = "producer",
  Moderator = "moderator",
  Admin = "admin",
}
