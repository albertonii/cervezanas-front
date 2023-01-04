import { Award } from "../types";

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
  p_principal: any;
  p_back: any;
  p_extra_1: any;
  p_extra_2: any;
  p_extra_3: any;
  volume: any;
  price: number;
  pack: any;
  format: any;
  stock_quantity: number;
  stock_limit_notification: number;
  lot_id: number;
  lot_quantity: number;
}
