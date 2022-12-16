import { CssComponent } from "@stitches/core/types/styled-component";
import { Provider, SupabaseClient } from "@supabase/supabase-js";
import { ThemeVariables } from "../common/theming";

export interface AnimationTailwindClasses {
  enter?: string;
  enterFrom?: string;
  enterTo?: string;
  leave?: string;
  leaveFrom?: string;
  leaveTo?: string;
}

export type AuthProviders = Provider;
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

export interface Product {
  id: string;
  name: string;
  description: string;
  created_at: Date;
  social_cause_id: string;
  product_lot_id: string;
  type_id: number;
  type: number;
  product_category_id: string;
  campaign_id: string;
  owner_id: string;
}

export interface Beer extends Product {
  lot_id: number;
  feedback_id: number;
  category: number;
  intensity: string;
  fermentation: string;
  color: string;
  origin: string;
  family: string;
  era: string;
  aroma: string;
  beer_format_id: string;
  is_gluten: boolean;
  awards_id: string[];
  awards: Award[];
}

export interface Award {
  id: string;
  name: string;
  description: string;
  img_url: any;
  year: number;
  beer_id: string;
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
