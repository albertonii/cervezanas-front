import { CssComponent } from "@stitches/core/types/styled-component";
import { Provider, SupabaseClient } from "@supabase/supabase-js";
import { ThemeVariables } from "../../common/theming";
import { Session } from "@supabase/gotrue-js/src/lib/types.d";
import { User } from "./interfaces";

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

export interface IAuth {
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

export interface IProductCategory {
  id: string;
  name: string;
  description: string;
  created_at: Date;
  product_id: string;
}

export interface IBeer {
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
  intensity: number;
  awards_id: string[];
  awards: Award[];
  price: number;
  volume: number;
  format: string;
  reviews: Review[];
  likes: Like[];
  product_id: string;
  is_gluten: boolean;
}

export interface IMerchandising {
  id: string;
  lot_id: number;
  feedback_id: number;
  category: string;
  is_public: boolean;
  product_id: string;
}

export interface IProductLot {
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
  recipe: string;
  products: IProduct;
}

export interface ICustomizeSettings {
  id: string;
  created_at: Date;
  colors: string[];
  family_styles: string[];
}

export interface IInventory {
  id?: string;
  product_id: string;
  quantity: number;
  limit_notification: number;
  created_at?: Date;
}

export interface IAward {
  id: string;
  name: string;
  description: string;
  img_url: any;
  year: number;
  beer_id: string;
}

export interface IProductMultimedia {
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

interface IProductMultimediaItem {
  id: string;
  created_at: Date;
  name: string;
  bucket_url: string;
}

export interface IProductImg {
  name: string;
  img_url: any;
}

export interface IBeerFormat {
  id: string;
  beer_id: string;
  format_id: string;
  sku: string;
  qty: number;
}

export interface IReview {
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
  products?: IProduct;
}

export interface IProfile {
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
  products: IProduct[];
  reviews: Review[];
  likes: Like[];
  orders: Order[];
  campaigns: Campaign[];
  customize_settings: CustomizeSettings[];
  profile_location: ProfileLocation[];
  cp_organizer_status: number;
}

export interface IConsumptionPoints {
  id: string;
  created_at: Date;
  cp_fixed: ICPFixed[];
  cp_mobile: ICPMobile[];
  cp_organizer_status: number;
  owner_id: User;
  cv_name: string;
  cover_letter_name: string;
}

export interface ICPFixed {
  id: string;
  created_at: Date;
  cp_name: string;
  cp_description: string;
  organizer_name: string;
  organizer_lastname: string;
  organizer_email: string;
  organizer_phone: string;
  start_date: Date;
  end_date: Date;
  address: string;
  geoArgs: GeocodeResult[];
  status: string;
  maximum_capacity: number;
  is_booking_required: boolean;
  cp_id: string;
}

export interface ICPMobile {
  id: string;
  created_at: Date;
  cp_name: string;
  cp_description: string;
  organizer_name: string;
  organizer_lastname: string;
  organizer_email: string;
  organizer_phone: string;
  start_date: Date;
  end_date: Date;
  address: string;
  status: string;
  logo: string;
  gallery: string[];
  maximum_capacity: number;
  is_booking_required: boolean;
  geoArgs: GeocodeResult[];
  cp_id: string;

  // TODO: rrss
}

export interface IProfileLocation {
  id: string;
  created_at: Date;
  name: string;
  lastname: string;
  document_id: string;
  company: string;
  phone: string;
  postalcode: number;
  country: string;
  province: string;
  town: string;
  address_1: string;
  address_2: string;
}

export interface ILike {
  id: string;
  created_at: Date;
  updated_at: Date;
  owner_id: string;
  product_id: string;
}

export interface ISocialCause {
  id: string;
  name: string;
  description: string;
  created_at: Date;
  owner_id: string;
  img_url: any;
  is_public: boolean;
  products: IProduct[];
}

export interface ICampaign {
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
  products?: ICampaignItem[];
}

export interface ICampaignItem {
  campaign_id: string;
  product_id: any;
  product_price: number;
}

export interface IOrder {
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
  products: IOrderItem[];
  order_number: string;
}

export interface IOrderItem {
  order_id: string;
  product_id: string;
  quantity: number;
  is_reviewed: boolean;
  created_at: Date;
}

export interface IPaymentCardMethod {
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

export interface IPaymentStandardTransferMethod {
  id: string;
  created_at: number;
  status: string;
  iban: string;
  concept: string;
  amount: number;
  currency: string;
  recipient: string;
}

export interface IShippingInfo {
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

export interface IBillingInfo {
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
  p_principal: File;
  p_back: File;
  p_extra_1: File;
  p_extra_2: File;
  p_extra_3: File;
  volume: any;
  price: number;
  pack: any;
  format: any;
  stock_quantity: number;
  stock_limit_notification: number;
  lot_id: number;
  lot_quantity: number;
  awards: Award[];
  beers: BeerModalProps[]; // We need this to avoid circular dependency
  merchandisings: Merchandising[];
  is_gluten: boolean;
  is_public: boolean;
  packs: IProductPack[];
};

export type ProductPack = {
  id: string;
  pack: number;
  price: number;
  img_url: any;
  name: string;
  randomUUID: string;
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
  intensity: number;
  p_principal: File;
  p_back: File;
  p_extra_1: File;
  p_extra_2: File;
  p_extra_3: File;
  volume: any;
  price: number;
  pack: any;
  format: any;
  stock_quantity: number;
  stock_limit_notification: number;
  lot_id: number;
  lot_quantity: number;
  awards?: Award[];
  beers: BeerModalProps[]; // We need this to avoid circular dependency
  merchandisings: Merchandising[];
  is_gluten: boolean;
  is_public: boolean;
  packs: IProductPack[];
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
  awards_id: string[];
  price: number;
  volume: number;
  format: string;
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

export interface IProduct {
  id: string;
  name: string;
  description: string;
  created_at: Date;
  social_cause_id: string;
  product_category_id: string;
  campaign_id: string;
  owner_id: string;
  product_lot: IProductLot[];
  product_inventory: Inventory[];
  product_multimedia: IProductMultimedia[];
  reviews: Review[];
  likes: Like[];
  is_public: boolean;
  price: number;
  beers: Beer[];
  product_variant: IProductVariant[];
  order_item: OrderItem[];
  awards: Award[];
  is_archived: boolean;
  state: IProductEnum.State;
  status: IProductEnum.Status;
  type: IProductEnum.Type;
  product_pack: IProductPack[];
  is_monthly: boolean;
}

export interface IProductVariant {
  id: string;
  product_id: string;
  name: string;
  product_number: number;
}

export interface IMonthlyProduct {
  id: string;
  category: string;
  month: number;
  year: number;
  product_id: IProduct;
}

export enum SortBy {
  NONE = "none",
  USERNAME = "username",
  NAME = "name",
  LAST = "last",
  COUNTRY = "country",
  CREATED_DATE = "created_date",
}

declare global {
  interface Array<T> {
    toSorted(compareFn?: (a: T, b: T) => number): T[];
  }
}

export interface IMarker {
  address: google.maps.GeocoderRequest;
  type: MarkerType;
}

export enum MarkerType {
  NONE = "none",
  FIXED = "fixed",
  MOBILE = "mobile",
}

export interface INotification {
  id: string;
  created_at: Date;
  user_id: string;
  message: string;
  link: string;
  read: boolean;
}
