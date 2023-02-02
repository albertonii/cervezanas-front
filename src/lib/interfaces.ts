import { Award } from "./types";

export interface IModalAddProduct {
  is_public: boolean;
  name: string;
  description: string;
  campaign: string;
  type: number;
  color: number;
  intensity: number;
  aroma: number;
  family: number;
  fermentation: number;
  origin: number;
  era: number;
  isGluten: string;
  awards: Award[];
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

export interface ShippingAddress {
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

export interface BillingAddress {
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

export interface PaymentCard {
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
