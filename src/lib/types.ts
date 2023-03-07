import { CssComponent } from "@stitches/core/types/styled-component";
import { Provider, SupabaseClient } from "@supabase/supabase-js";
import { ThemeVariables } from "../../common/theming";
import { Session } from "@supabase/gotrue-js/src/lib/types";
import { User } from "../lib/interfaces";

export type ButtonTypes = "button" | "submit" | "reset";

export interface AnimationTailwindClasses {
  enter?: string;
  enterFrom?: string;
  enterTo?: string;
  leave?: string;
  leaveFrom?: string;
  leaveTo?: string;
}

export type AuthProviders = Provider;

export type I18nVariables = {
  sign_up?: {
    email_label?: string;
    password_label?: string;
    email_input_placeholder?: string;
    password_input_placeholder?: string;
    button_label?: string;
    social_provider_text?: string;
    link_text?: string;
  };
  sign_in?: {
    email_label?: string;
    password_label?: string;
    email_input_placeholder?: string;
    password_input_placeholder?: string;
    button_label?: string;
    social_provider_text?: string;
    link_text?: string;
  };
  magic_link?: {
    email_input_label?: string;
    email_input_placeholder?: string;
    button_label?: string;
    link_text?: string;
  };
  forgotten_password?: {
    email_label?: string;
    password_label?: string;
    email_input_placeholder?: string;
    button_label?: string;
    link_text?: string;
  };
  update_password?: {
    password_label?: string;
    password_input_placeholder?: string;
    button_label?: string;
  };
};

export interface Localization {
  // [key: string]: I18nVariables
  ["en"]: I18nVariables;
  ["ja"]: I18nVariables;
  ["de_formal"]: I18nVariables;
  ["de_informal"]: I18nVariables;
}

export type SocialLayout = "horizontal" | "vertical";
export type SocialButtonSize = "tiny" | "small" | "medium" | "large" | "xlarge";

export type ViewSignIn = "sign_in";
export type ViewSignUp = "sign_up";
export type ViewMagicLink = "magic_link";
export type ViewForgottenPassword = "forgotten_password";
export type ViewUpdatePassword = "update_password";

export type ViewType =
  | ViewSignIn
  | ViewSignUp
  | ViewMagicLink
  | ViewForgottenPassword
  | ViewUpdatePassword;

export interface ViewsMap {
  [key: string]: ViewType;
}

export interface Theme {
  default: ThemeVariables;
  [key: string]: ThemeVariables;
}

export type RedirectTo = undefined | string;

export interface Appearance {
  theme?: Theme;
  prependedClassName?: string;
  variables?: {
    default: ThemeVariables;
    [key: string]: ThemeVariables;
  };
  className?: {
    anchor?: string | CssComponent;
    button?: string | CssComponent;
    container?: string | CssComponent;
    divider?: string | CssComponent;
    input?: string | CssComponent;
    label?: string | CssComponent;
    loader?: string | CssComponent;
    message?: string | CssComponent;
  };
  style?: {
    anchor?: React.CSSProperties;
    button?: React.CSSProperties;
    container?: React.CSSProperties;
    divider?: React.CSSProperties;
    input?: React.CSSProperties;
    label?: React.CSSProperties;
    loader?: React.CSSProperties;
    message?: React.CSSProperties;
  };
}

export interface Auth {
  supabaseClient: SupabaseClient;
  children?: React.ReactNode;
  socialLayout?: SocialLayout;
  providers?: Provider[];
  view?: ViewType;
  redirectTo?: RedirectTo;
  onlyThirdPartyProviders?: boolean;
  magicLink?: boolean;
  showLinks?: boolean;

  /**
   * This will toggle on the dark variation of the theme
   */
  dark?: boolean;
  /**
   * Override the labels and button text
   */
  localization?: {
    lang?: "en" | "ja"; // es
    variables?: I18nVariables;
  };
  appearance?: Appearance;
  theme?: "default" | string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  created_at: Date;
  product_id: string;
}

export interface Beer {
  id: string;
  lot_id: number;
  feedback_id: number;
  category: string;
  fermentation: string;
  aroma: string;
  color: string;
  origin: string;
  family: string;
  era: string;
  intensity: string;
  beer_format_id: string;
  awards_id: string[];
  awards: Award[];
  price: number;
  volume: number;
  format: string;
  pack: number;
  reviews: Review[];
  likes: Like[];
  product_id: string;
  is_public: boolean;
  is_gluten: boolean;
}

export interface Merchandising {
  id: string;
  lot_id: number;
  feedback_id: number;
  category: string;
  is_public: boolean;
  product_id: string;
}

export interface ProductLot {
  id: string;
  created_at: Date;
  lot_id: string;
  lot_number: string;
  lot_name: string;
  product_id: string;
  quantity: number;
  limit_notification: number;
  expiration_date: any;
  manufacture_date: any;
  packaging: string;
  beer_recipe: string;
  products: Product;
}

export interface Inventory {
  id?: string;
  product_id: string;
  quantity: number;
  limit_notification: number;
  created_at?: Date;
}

export interface Award {
  id: string;
  name: string;
  description: string;
  img_url: any;
  year: number;
  beer_id: string;
}

export interface ProductMultimedia {
  id: string;
  p_principal: string;
  p_back: string;
  p_extra_1: string;
  p_extra_2: string;
  p_extra_3: string;
  p_extra_4: string;
  v_principal: string;
  v_extra_1: string;
  v_extra_2: string;
}

interface ProductMultimediaItem {
  id: string;
  created_at: Date;
  name: string;
  bucket_url: string;
}

export interface ProductImg {
  name: string;
  img_url: any;
}

export interface BeerFormat {
  id: string;
  beer_id: string;
  format_id: string;
  sku: string;
  qty: number;
}

export interface Format {
  id: string;
  volume: number;
  type: string;
}

export interface Review {
  id: string;
  created_at: string;
  updated_at: string;
  owner_id: string;
  product_id: string;
  comment: string;
  aroma: number;
  appearance: number;
  taste: number;
  bitterness: number;
  mouthfeel: number;
  overall: number;
  users?: User;
  products?: Product;
}

export interface Profile {
  id: string;
  created_at: Date;
  updated_at: Date;
  owner_id: string;
  name: string;
  lastname: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  img_url: any;
  is_public: boolean;
  users?: User;
  avatar_url: string;
  bg_url: string;
  birthdate: string;
  email: string;
  image: string;
  role: string;
  username: string;
  products: Product[];
  reviews: Review[];
  likes: Like[];
  orders: Order[];
  campaigns: Campaign[];
}

export interface Like {
  id: string;
  created_at: Date;
  updated_at: Date;
  owner_id: string;
  product_id: string;
}

export interface SocialCause {
  id: string;
  name: string;
  description: string;
  created_at: Date;
  owner_id: string;
  img_url: any;
  is_public: boolean;
  products: Product[];
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  created_at: Date;
  owner_id: string;
  img_url: any;
  is_public: boolean;
  slogan: string;
  goal: string;
  start_date: Date;
  end_date: Date;
  status: string;
  products?: CampaignItem[];
}

export interface CampaignItem {
  campaign_id: string;
  product_id: any;
  product_price: number;
}

export interface Order {
  id: string;
  created_at: Date;
  updated_at: Date;
  owner_id: string;
  status: string;
  shipping_info: ShippingInfo;
  billing_info: BillingInfo;
  payment_method: PaymentCardMethod;
  customer_name: string;
  tracking_id: string;
  issue_date: Date;
  estimated_date: Date;
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  currency: string;
  discount: number;
  discount_code: string;
  products: OrderItem[];
  order_number: string;
}

export interface OrderItem {
  order_id: string;
  product_id: string;
  quantity: number;
  is_reviewed: boolean;
  created_at: Date;
}

export interface PaymentCardMethod {
  id: string;
  created_at: number;
  status: string;
  type: string;
  order_id: string;
  card_number: number;
  card_expiration_month: number;
  card_expiration_year: number;
  card_cvc: number;
  card_name: string;
  checkSave: boolean;
}

export interface PaymentStandardTransferMethod {
  id: string;
  created_at: number;
  status: string;
  iban: string;
  concept: string;
  amount: number;
  currency: string;
  recipient: string;
}

export interface ShippingInfo {
  id: string;
  created_at: Date;
  updated_at: Date;
  owner_id: string;
  name: string;
  lastname: string;
  document_id: string;
  phone: string;
  address: string;
  address_extra: string;
  address_observation: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  is_default: boolean;
}

export interface BillingInfo {
  id: string;
  created_at: Date;
  updated_at: Date;
  owner_id: string;
  name: string;
  lastname: string;
  document_id: string;
  phone: string;
  address: string;
  address_extra: string;
  address_observation: string;
  country: string;
  zipcode: string;
  city: string;
  state: string;
  is_default: boolean;
}

export type UserProps = {
  user: User;
  session: Session;
};

export type ModalAddProductProps = {
  name: string;
  description: string;
  campaign: string;
  type: string;
  color: number;
  aroma: number;
  family: number;
  fermentation: number;
  origin: number;
  era: number;
  intensity: number;
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
  beers: BeerModalProps[]; // We need this to avoid circular dependency
  merchandisings: Merchandising[];
  is_gluten: boolean;
  is_public: boolean;
};

export type ModalUpdateProductProps = {
  name: string;
  description: string;
  campaign: string;
  type: string;
  color: string;
  aroma: string;
  family: string;
  fermentation: string;
  origin: string;
  era: string;
  intensity: string;
  awards?: Award[];
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
  beers: BeerModalProps[]; // We need this to avoid circular dependency
  merchandisings: Merchandising[];
  is_gluten: boolean;
  is_public: boolean;
};

type BeerModalProps = {
  id: string;
  lot_id: number;
  feedback_id: number;
  category: string;
  fermentation: string;
  aroma: string;
  color: string;
  origin: string;
  family: string;
  era: string;
  intensity: string;
  beer_format_id: string;
  awards_id: string[];
  price: number;
  volume: number;
  format: string;
  pack: number;
  product_id: string;
  is_public: boolean;
  is_gluten: boolean;
};

export type CampaignFormProps = {
  campaigns: Campaign[];
};

export type CartItem = {
  id: string;
  quantity: number;
};

export interface ICarouselItem {
  link: string;
  imageUrl: string;
  title: string;
}

export type FileImg = {
  lastModified: number;
  lastModifiedDate: Date;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;
};

export enum ProductType {
  BEER = "beer",
  WINE = "wine",
  SPIRIT = "spirit",
  OTHER = "other",
  MERCHANDISING = "merchandising",
}

export interface Product {
  id: string;
  name: string;
  description: string;
  created_at: Date;
  social_cause_id: string;
  type: ProductType;
  product_category_id: string;
  campaign_id: string;
  owner_id: string;
  product_lot: ProductLot[];
  product_inventory: Inventory[];
  product_multimedia: ProductMultimedia[];
  reviews: Review[];
  likes: Like[];
  is_public: boolean;
  price: number;
  beers: Beer[];
  product_variant: ProductVariant[];
  order_item: OrderItem[];
  awards: Award[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  product_number: number;
}
