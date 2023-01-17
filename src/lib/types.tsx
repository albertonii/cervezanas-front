import { type User, Session } from "@supabase/gotrue-js/src/lib/types";
import { Award } from "../types";

export type UserProps = {
  user: User;
  session: Session;
};

export type ModalAddProductProps = {
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
  p_principal: FileImg;
  p_back: FileImg;
  p_extra_1: FileImg;
  p_extra_2: FileImg;
  p_extra_3: FileImg;
  volume: any;
  price: number;
  pack: any;
  format: any;
  stock_quantity: number;
  stock_limit_notification: number;
  lot_id: number;
  lot_quantity: number;
};

export type CartItem = {
  id: string;
  quantity: number;
};

export type FileImg = {
  lastModified: number;
  lastModifiedDate: Date;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;
};
