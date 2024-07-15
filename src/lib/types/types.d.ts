import {
    UserAppMetadata,
    UserIdentity,
    UserMetadata,
} from '@supabase/supabase-js';
import { GeoArgs, GeocodeResult } from 'use-places-autocomplete';
import { CssComponent } from '@stitches/core/types/styled-component';
import { Provider, SupabaseClient } from '@supabase/supabase-js';
import { ThemeVariables } from '../../../common/theming';
import { Session } from '@supabase/gotrue-js/src/lib/types.d';
import { Type as ProductType } from '../productEnum';
import { Fermentation } from '../beerEnum';
import { IBoxPack } from './product';

export type ButtonTypes = 'button' | 'submit' | 'reset';

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
    ['en']: I18nVariables;
    ['ja']: I18nVariables;
    ['de_formal']: I18nVariables;
    ['de_informal']: I18nVariables;
}

export type SocialLayout = 'horizontal' | 'vertical';
export type SocialButtonSize = 'tiny' | 'small' | 'medium' | 'large' | 'xlarge';

export type ViewSignIn = 'signin';
export type ViewSignUp = 'signup';
export type ViewSignOut = 'signout';
export type ViewMagicLink = 'magic_link';
export type ViewForgottenPassword = 'forgotten_password';
export type ViewUpdatePassword = 'update_password';

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
        lang?: 'en' | 'ja'; // es
        variables?: I18nVariables;
    };
    appearance?: Appearance;
    theme?: 'default' | string;
}

export interface IBeer {
    product_id: string; // FK
    created_at: string;
    category: string;
    fermentation: string;
    color: string;
    family: string;
    era?: string;
    aroma: string;
    is_gluten: boolean;
    format: string;
    volume: number;
    sku: string;
    intensity: number;
    origin?: string;
    country: string;
    composition: string;
    srm: number;
    og: number;
    fg: number;
    ibu: number;
    products?: IProduct;
}

export interface IProductLot {
    id: string;
    created_at: string;
    lot_id: string;
    lot_number: string;
    lot_name: string;
    product_id: string;
    quantity: number;
    limit_notification: number;
    expiration_date: string;
    manufacture_date: string;
    packaging: string;
    recipe: string;
    products?: IProduct;
}

export interface IRefProductLot {
    id: string;
    created_at: string;
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
    created_at: string;
    colors: string[];
    family_styles: string[];
    owner_id: string;
    users?: User;
}

export interface IProductInventory {
    id?: string;
    product_id: string;
    quantity: number;
    limit_notification: number;
    created_at?: string;
    products?: IProduct;
}

export interface IAward {
    id?: string;
    name: string;
    description: string;
    img_url: any;
    year: number;
    product_id: string;
    products?: IProduct;
}

export interface IProductMultimedia {
    product_id: string; // PK
    p_principal: string;
    p_back: string;
    p_extra_1: string;
    p_extra_2: string;
    p_extra_3: string;
    p_extra_4: string;
    v_principal: string;
    v_extra_1: string;
    v_extra_2: string;
    products?: IProduct;
}

interface IProductMultimediaItem {
    id: string;
    created_at: string;
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

export interface IRefReview {
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
    created_at: string;
    updated_at: string;
    owner_id: string;
    name: string;
    lastname: string;
    phone: string;
    address: string;
    country: string;
    region: string;
    sub_region: string;
    city: string;
    zipcode: string;
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
    reviews: IReview[];
    likes: ILike[];
    orders: IOrder[];
    campaigns: ICampaign[];
    customize_settings: ICustomizeSettings[];
    profile_location: IProfileLocation[];
    cp_organizer_status: number;
}

export interface IEvent {
    id: string;
    created_at: string;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    logo_url: string;
    promotional_url: string;
    status: string;
    // geoArgs: GeocodeResult[];
    geoArgs: any[];
    address: string;
    owner_id: string;
    cp_mobile: ICPMobile[];
    cp_fixed: ICPFixed[];
    users: IUserTable;
    is_activated: boolean;
    is_cervezanas_event: boolean;
}

export interface IConsumptionPoints {
    id: string;
    created_at: string;
    cp_fixed: ICPFixed[];
    cp_mobile: ICPMobile[];
    cp_organizer_status: number;
    owner_id: string;
    users?: User;
    cv_name: string;
    cover_letter_name: string;
}

export interface ICPFixed {
    id: string;
    created_at: string;
    cp_name: string;
    cp_description: string;
    organizer_name: string;
    organizer_lastname: string;
    organizer_email: string;
    organizer_phone: string;
    start_date: string;
    end_date: string;
    address: string;
    logo_url: string;
    status: string;
    maximum_capacity: number;
    is_booking_required: boolean;
    cp_id: string;
    is_internal_organizer: boolean;
    cpf_products?: ICPFProducts[];
    // geoArgs: GeocodeResult[];
    geoArgs: any[];
    consumption_points?: IConsumptionPoints;
    owner_id: string;
}

export interface ICPMobile {
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
    cpm_products?: ICPMProducts[];
    consumption_points?: IConsumptionPoints;
    owner_id: string;
}

export interface ICPFProducts {
    id: string;
    created_at: string;
    stock: number;
    stock_consumed: number;
    cp_id: string;
    product_pack_id: string;
    is_active: boolean;
    product_packs?: IProductPack;
    cp_fixed?: ICPFixed;
}

export interface ICPMProducts {
    id: string;
    created_at: string;
    stock: number;
    stock_consumed: number;
    cp_id: string;
    product_pack_id: string;
    is_active: boolean;
    product_packs?: IProductPack;
    cp_mobile?: ICPMobile;
}

export interface IRefCPMProducts {
    id: string;
    created_at: string;
    cp_id: any;
    product_pack_id: IProductPack;
    stock: number;
    stock_consumed: number;
}

export interface ICPMProductsEditCPMobileModal {
    id: string;
    created_at: string;
    cp_id: any;
    product_pack_id: string;
    stock: number;
    stock_consumed: number;
}

export interface ICPMProductsEditCPFixedModal {
    id: string;
    created_at: string;
    cp_id: any;
    product_pack_id: string;
    stock: number;
    stock_consumed: number;
}

export interface ICPM_events {
    cp_id: string;
    event_id: string;
    is_active: boolean;
    is_cervezanas_event: boolean;
    owner_id: string;
    cp_mobile?: ICPMobile;
    events?: IEvent;
}

export interface ICPF_events {
    cp_id: string;
    event_id: string;
    is_active: boolean;
    is_cervezanas_event: boolean;
    owner_id: string;
    cp_fixed?: ICPFixed;
    events?: IEvent;
}

export interface IProfileLocation {
    id: string;
    created_at: string;
    name: string;
    lastname: string;
    document_id: string;
    company: string;
    phone: string;
    postalcode: number;
    country: string;
    region: string;
    sub_region: string;
    city: string;
    address_1: string;
    address_2: string;
}

export interface ILocation {
    id: string;
    created_at: string;
    name: string;
    lastname: string;
    document_id: string;
    company: string;
    phone: string;
    postalcode: number;
    country: string;
    region: string;
    sub_region: string;
    city: string;
    address_1: string;
    address_2: string;
}

export interface ILike {
    id: string;
    created_at: string;
    owner_id: string;
    product_id: string;
    products?: IProduct;
}

export interface ISocialCause {
    id: string;
    name: string;
    description: string;
    created_at: string;
    owner_id: string;
    img_url: any;
    is_public: boolean;
    products: IProduct[];
}

export interface ICampaign {
    id: string;
    created_at: string;
    name: string;
    description: string;
    img_url: any;
    is_public: boolen;
    start_date: string;
    end_date?: string;
    owner_id: string;
    slogan: string;
    goal: string;
    status: string;
    campaign_discount: number;
    social_cause: string;
    products?: ICampaignItem[];
}

export interface ICampaignItem {
    campaign_id: string;
    product_id: string;
    product_price: number;
    campaigns?: ICampaign;
    products?: IProduct;
}

export interface IOrder {
    id: string;
    created_at: string;
    updated_at: string;
    owner_id: string;
    status: string;
    shipping_info_id: string;
    billing_info_id: string;
    customer_name: string;
    tracking_id: string;
    issue_date: string;
    estimated_date: string;
    total: number;
    subtotal: number;
    shipping: number;
    tax: number;
    currency: string;
    discount: number;
    discount_code: string;
    order_number: string;
    shipping_info?: IShippingInfo;
    billing_info?: IBillingInfo;
    business_orders?: IBusinessOrder[];
    users?: IUserTable;
}

export interface IOrderItem {
    business_order_id: string;
    product_pack_id: string;
    created_at: string;
    quantity: number;
    is_reviewed: boolean;
    business_orders?: IBusinessOrder;
    product_packs?: IProductPack;
}

export interface IEventOrder {
    id: string;
    created_at: string;
    updated_at: string;
    customer_id: string;
    event_id: string;
    status: string;
    total: number;
    subtotal: number;
    tax: number;
    currency: string;
    discount: number;
    discount_code: string;
    order_number: string;
    event_order_items?: IEventOrderItem[];
    customer_id: string;
    users?: IUserTable;
    events?: IEvent;
    // cp_m_owner: ICPMobile;
}

export interface IEventOrderItem {
    id: string;
    created_at: string;
    order_id: string;
    product_pack_id: string;
    quantity: number;
    quantity_served: number;
    status: string;
    is_reviewed: boolean;
    product_packs?: IProductPack;
    product_multimedia?: IProductMultimedia[];
    orders?: IOrder;
}

export interface IShippingInfo {
    id: string;
    created_at: string;
    updated_at: string;
    owner_id: string;
    name: string;
    lastname: string;
    document_id: string;
    phone: string;
    address: string;
    address_extra: string;
    address_observations: string;
    country: string;
    region: string;
    sub_region: string;
    city: string;
    zipcode: string;
    is_default: boolean;
}

export interface IBillingInfo {
    id: string;
    created_at: string;
    updated_at: string;
    owner_id: string;
    name: string;
    lastname: string;
    document_id: string;
    phone: string;
    address: string;
    country: string;
    region: string;
    sub_region: string;
    city: string;
    zipcode: string;
    is_default: boolean;
    users?: IUserTable;
}

export interface IAddressForm {
    owner_id: string;
    name: string;
    lastname: string;
    document_id: string;
    phone: string;
    address: string;
    address_extra: string;
    address_observations: string;
    country: string;
    region: string;
    sub_region: string;
    city: string;
    zipcode: string;
    is_default: boolean;
}

export type UserProps = {
    user: User;
    session: Session;
};

export type IProductPack = {
    id: string; // PK
    product_id: string; // FK
    created_at: string;
    quantity: number;
    price: number;
    img_url: any;
    name: string;
    randomUUID: string;
    products?: IProduct;
};

export type IModalAddProductPack = {
    quantity: number;
    price: number;
    img_url?: any;
    name: string;
    product_id?: string;
};

export type IModalUpdateProductPack = {
    id: string;
    quantity: number;
    price: number;
    img_url?: any;
    name: string;
    product_id?: string;
};

export type IRefProductPack = {
    id: string;
    created_at: string;
    name: string;
    price: number;
    quantity: number;
    img_url: any;
    randomUUID: string;
    product_id?: any;
};

export type IPackItem = {
    id: string;
    quantity: number;
    price: number;
    name: string;
};

export type ModalAddProductFormData = {
    name: string;
    description?: string;
    price: number;
    fermentation: number;
    color: number;
    intensity: number;
    aroma: number;
    family: number;
    origin?: number;
    era?: number;
    is_gluten: boolean;
    type: string;
    p_principal?: any;
    p_back?: any;
    p_extra_1?: any;
    p_extra_2?: any;
    p_extra_3?: any;
    is_public: boolean;
    volume: number;
    weight: number;
    format: string;
    stock_quantity: number;
    stock_limit_notification: number;
    category: string;
    ibu: number;
    // campaign: string;
    awards: ModalAddProductAwardFormData[];
    packs: ModalAddProductPackFormData[];
};

export type ModalUpdateProductFormData = {
    product_id: string; // FK
    name: string;
    description: string;
    price: number;
    fermentation: Fermentation;
    color: number;
    intensity: number;
    ibu: number;
    aroma: number;
    family: number;
    origin?: number;
    era?: number;
    is_gluten: boolean;
    type: string;
    p_principal?: any;
    p_back?: any;
    p_extra_1?: any;
    p_extra_2?: any;
    p_extra_3?: any;
    is_public: boolean;
    volume: number;
    weight: number;
    format: string;
    category: string;
    // campaign: string;
    stock_quantity: number;
    stock_limit_notification: number;
    awards: ModalUpdateProductAwardFormData[];
    packs: ModalUpdateProductPackFormData[];
};

type ModalAddProductAwardFormData = {
    id?: string;
    name: string;
    description: string;
    img_url?: any;
    year: number;
    product_id?: string;
};

type ModalUpdateProductAwardFormData = {
    id?: string;
    name: string;
    description: string;
    img_url?: any;
    year: number;
    product_id?: string;
};

type ModalAddProductPackFormData = {
    id: string;
    product_id: string;
    quantity: number;
    price: number;
    img_url?: any;
    name: string;
    product_id?: string;
};

type ModalUpdateProductPackFormData = {
    id?: string;
    product_id: string;
    quantity: number;
    price: number;
    img_url?: any;
    prev_img_url?: any;
    name: string;
};

export type ModalAddCampaignFormData = {
    name: string;
    description: string;
    img_url?: FileList;
    is_public: boolean;
    start_date: Date;
    end_date: Date;
    slogan: string;
    goal: string;
    status: string;
    products?: ModalAddCampaignProductFormData[];
};

export type ModalAddCampaignProductFormData = {
    campaign_id: string;
    product_id: any;
    product_price: number;
};

export type ModalUpdateLotProps = {
    lot_number: string;
    lot_name: string;
    product_id: string;
    quantity: number;
    limit_notification: number;
    expiration_date: string;
    manufacture_date: string;
    packaging: string;
};

export type ICampaignFormProps = {
    campaigns: ICampaign[];
};

export interface IProductPackCartItem {
    id: string; // PK
    product_id: string; // FK
    packs: IProductPack[];
    quantity: number;
    price: number;
    image: string;
    name: string;
    producer_id: string;
    distributor_id: string;
    products?: IProduct;
}

export interface IProductPackEventCartItem {
    id: string; // PK
    product_id: string; // FK
    packs: IProductPack[];
    quantity: number;
    price: number;
    image: string;
    name: string;
    products?: IEventProduct;
    producer_id: string;
    cpf_id: string;
    cpm_id: string;
    cp_name: string;
}

export interface ICarouselItem {
    link: string;
    imageUrl: string;
    title: string;
}

export type FileImg = {
    lastModified: number;
    lastModifiedDate: string;
    name: string;
    size: number;
    type: string;
    webkitRelativePath: string;
};

export interface IProduct {
    id: string;
    created_at: string;
    name: string;
    description: string;
    type: ProductType;
    is_public: boolean;
    discount_percent: number;
    weight: number;
    discount_code: string;
    price: number; // TODO : quitar el price - pq está en product_pack
    campaign_id: string;
    is_archived: boolean;
    category: string;
    is_monthly: boolean;
    owner_id: string;
    order_items?: IOrderItem[];
    product_lots?: IProductLot[];
    reviews?: IReview[];
    likes?: ILike[];
    awards?: IAward[];
    product_packs?: IProductPack[];
    beers?: IBeer;
    users?: IUserTable;
    product_inventory?: IProductInventory;
    product_multimedia?: IProductMultimedia;
    box_packs?: IBoxPack[];
}

export interface IEventProduct {
    id: string;
    created_at: string;
    name: string;
    description: string;
    type: ProductType;
    is_public: boolean;
    discount_percent: number;
    weight: number;
    discount_code: string;
    price: number; // TODO : quitar el price - pq está en product_pack
    campaign_id: string;
    is_archived: boolean;
    category: string;
    is_monthly: boolean;
    owner_id: string;
    beers?: IBee;
    product_multimedia?: IProductMultimedia;
    product_lots?: IProductLot[];
    product_inventory?: IProductInventory;
    reviews?: IReview[];
    likes?: ILike[];
    awards?: IAward[];
    product_packs?: IProductPack[];
    cpm_id: string;
    cpf_id: string;
    cp_name: string;
}

export interface IModalProduct {
    id: string;
    created_at: string;
    name: string;
    description: string;
    type: ProductType;
    is_public: boolean;
    discount_percent: number;
    discount_code: string;
    price: number;
    campaign_id: string;
    is_archived: boolean;
    category: string;
    is_monthly: boolean;
    owner_id: string;
    product_multimedia: IProductMultimedia[];
    order_items?: OrderItem[];

    // Debemos de mirar en las respectivas tablas para hacer el vínculo correcto tal y como se hace en supabase:
    // Ejemplo: product_multimedia!product_multimedia_product_id_fkey (p_principal),
    product_lots?: IProductLot[];
    product_inventory?: IProductInventory[];
    reviews?: IReview[];
    likes?: ILike[];
    beers: IBeer[];
    awards?: IAward[];
    product_packs?: IProductPack;
}

export interface IMonthlyProduct {
    product_id: string;
    created_at: string;
    category: string;
    month: number;
    year: number;
    products?: IProduct;
}

export enum SortBy {
    NONE = 'none',
    USERNAME = 'username',
    NAME = 'name',
    LAST = 'last',
    COUNTRY = 'country',
    CREATED_DATE = 'created_date',
    START_DATE = 'start_date',
    END_DATE = 'end_date',
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
    NONE = 'none',
    FIXED = 'fixed',
    MOBILE = 'mobile',
}

export interface INotification {
    id: string;
    created_at: string;
    user_id: string;
    message: string;
    link: string;
    read: boolean;
    source: string;
    // source_user?: UserTable; - TODO: Buscar el tipo de propiedad, no any
    source_user?: any;
}

export type UserProps = {
    user: User;
    session: Session;
};

export type CartItem = {
    id: string;
    quantity: number;
};

export type FileImg = {
    lastModified: number;
    lastModifiedDate: string;
    name: string;
    size: number;
    type: string;
    webkitRelativePath: string;
};

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
    origin?: number;
    era?: number;
    is_gluten: string;
    awards: IAward[];
    p_principal: string;
    p_back: string;
    p_extra_1: string;
    p_extra_2: string;
    p_extra_3: string;
    volume: any;
    price: number;
    packs: IModalAddProductPack[];
    format: any;
    stock_quantity: number;
    stock_limit_notification: number;
    lot_id: number;
    lot_quantity: number;
}

export interface IModalShippingAddress {
    owner_id: string;
    name: string;
    lastname: string;
    document_id: string;
    phone: string;
    address: string;
    address_extra?: string;
    address_observations?: string;
    country: string;
    region: string;
    sub_region: string;
    city: string;
    zipcode: string;
    is_default: boolean;
}

export interface IModalBillingAddress {
    owner_id: string;
    name: string;
    lastname: string;
    document_id: string;
    phone: string;
    address: string;
    address_extra?: string;
    country: string;
    region: string;
    sub_region: string;
    city: string;
    zipcode: string;
    is_default: boolean;
}

export interface ModalShippingAddressFormData {
    name: string;
    lastname: string;
    document_id: string;
    phone: string;
    address: string;
    address_extra?: string;
    address_observations?: string;
    country: string;
    zipcode: string;
    city: string;
    region: string;
    sub_region: string;
    is_default: boolean;
}

export interface ModalBillingAddressFormData {
    name: string;
    lastname: string;
    document_id: string;
    phone: string;
    address: string;
    address_extra?: string;
    country: string;
    region: string;
    sub_region: string;
    zipcode: string;
    city: string;
    region: string;
    sub_region: string;
    is_default: boolean;
}

export interface IAddress {
    id: string;
    name: string;
    lastname: string;
    document_id: string;
    phone: string;
    address: string;
    address_extra?: string;
    address_observations?: string;
    country: string;
    region: string;
    sub_region: string;
    city: string;
    zipcode: string;
    is_default: boolean;
}

export interface IBillingAddress {
    id: string;
    name: string;
    lastname: string;
    document_id: string;
    phone: string;
    address: string;
    country: string;
    region: string;
    sub_region: string;
    city: string;
    zipcode: string;
    is_default: boolean;
}

export interface ISignUp {
    userCredentials: {
        email: string;
        password: string;
        phone: string;
        options: {
            emailRedirectTo?: string;
            data?: object;
            captchaToken?: string;
        };
    };
}

export interface IUser {
    id: string;
    aud: string;
    role?: string;
    email?: string;
    email_confirmed_at?: string;
    phone?: string;
    confirmation_sent_at?: string;
    confirmed_at?: string;
    recovery_sent_at?: string;
    last_sign_in_at?: string;
    app_metadata: UserAppMetadata;
    user_metadata: UserMetadata;
    email_change_sent_at?: string;
    new_email?: string;
    new_phone?: string;
    invited_at?: string;
    action_link?: string;
    created_at: string;
    phone_confirmed_at?: string;
    updated_at?: string;
    identities?: UserIdentity[];
    username: string;
    avatar_url: string;
    cp_organizer_status: number;
    factors?: Factor[];
    consumption_points?: IConsumptionPoints;
}

export interface IUserTable {
    id: string;
    created_at: string;
    name: string;
    lastname: string;
    email: string;
    username: string;
    role: string[];
    avatar_url: string;
    bg_url: string;
    updated_at: string;
    birthdate: string;
    cp_organizer_status: number;
    provider: string;
    distributor_user?: IDistributorUser;
    producer_user?: IProducerUser;
}

export interface IUserProfile {
    id: string;
    username: string;
    email: string;
    name: string;
    lastname: string;
    role: string[];
    updated_at: string;
    provider: string;
    created_at: string;
    cp_organizer_status: number;
    birthdate: string;
    bg_url: string;
    avatar_url: string;
}

export enum PROVIDER_TYPE {
    GOOGLE = 'google',
}

export interface IDistributorUser {
    user_id: string; // FK ID
    created_at: string;
    id_number: string;
    bank_account: string;
    company_name: string;
    company_description: string;
    location_id: string;
    is_authorized: boolean;
    profile_location?: IProfileLocation[];
    users?: IUserTable; // To access embeded information we need to get into the table and the look for data
    coverage_areas?: ICoverageArea[];
    distribution_costs?: IDistributionCost;
}

export interface IProducerUser {
    user_id: string; // FK ID
    created_at: string;
    company_name: string;
    company_description: string;
    id_number: string;
    location_id: string;
    is_authorized: boolean;
    profile_location?: IProfileLocation[];
    users?: IUserTable; // To access embeded information we need to get into the table and the look for data
}

export interface IConsumptionPointUser {
    user_id: string; // FK ID
    created_at: string;
    company_name: string;
    company_description: string;
    is_authorized: boolean;
    users?: IUserTable;
}

export interface IDistributionContract {
    producer_id: string;
    distributor_id: string;
    created_at: string;
    status: string;
    producer_accepted: boolean;
    distributor_accepted: boolean;
    message: string;
    producer_user?: IProducerUser;
    distributor_user?: IDistributorUser;
}

export interface IBusinessOrder {
    id: string;
    created_at: string;
    order_id: string;
    orders?: IOrder;
    order_items?: IOrderItem[];
    producer_id: string;
    distributor_id: string;
    status: string;
    producer_user?: IProducerUser;
    distributor_user?: IDistributorUser;
}

export interface IBusinessOrderRef {
    id: string;
    created_at: string;
    order_id: IOrder;
}

export interface IDistribution {
    id: string;
    created_at: string;
    origin_distributor: string;
    business_order_id: string;
    type: string;
    price: quantity;
    estimated_time;
    shipment_date: string;
    delivery_date: string;
    order_status: string;
    feedback: string;
    business_orders: IBusinessOrder;
    origin_distributor: IDistributorUser;
    coverage_areas: ICoverageArea;
}

export interface ICoverageArea {
    id?: string;
    distributor_id: string;
    country_iso_code: string;
    country: string;
    region: string;
    sub_region?: string;
    city?: string;
    administrative_division: string; // Provincia, Distrito, Región, Comarca, Comunidad Autónoma, etc
    distributor_user?: IDistributorUser;
}

export interface FlatrateCostFormData {
    local_distribution_cost: number;
    national_distribution_cost: number;
    europe_distribution_cost: number;
    international_distribution_cost: number;
    is_checked_local?: boolean;
    is_checked_national?: boolean;
    is_checked_europe?: boolean;
    is_checked_international?: boolean;
}

export interface FlatrateAndWeightCostFormData {
    distribution_costs_id: string;
    weight_range_cost: {
        weight_from: number;
        weight_to: number;
        base_cost: number;
    }[];
    cost_extra_per_kg: number;
}

export interface AreaAndWeightCostFormData {
    distribution_costs_id: string;
    cities: AreaAndWeightInformationFormData[];
    sub_regions: AreaAndWeightInformationFormData[];
    regions: AreaAndWeightInformationFormData[];
    international: AreaAndWeightInformationFormData[];
}

interface AreaAndWeightInformationFormData {
    id?: string;
    type?: string; // City, SubRegion, Region, International
    name?: string;
    area_weight_range: AreaAndWeightRangeFormData[];
}

interface AreaAndWeightRangeFormData {
    weight_from: number;
    weight_to: number;
    base_cost: number;
    area_and_weight_information_id: string;
}

export interface PriceRangeCostFormData {
    distribution_range_cost: {
        lower: number;
        upper: number;
        shippingCost: number;
    }[];
}

export interface DistributionRangeCost {
    lower: number;
    upper: number;
    shippingCost: number;
}

export interface IDistributionCost {
    id: string;
    distributor_id: string;
    distribution_costs_in_product: boolean;
    selected_method: string;
    distributor_user?: IDistributorUser;
    flatrate_cost?: IFlatrateCost;
    flatrate_and_weight_cost?: IFlatrateAndWeightCost[];
    area_and_weight_cost?: IAreaAndWeightCost;
}

export interface IFlatrateCost {
    created_at?: string;
    distribution_costs_id?: string; // PK and FK
    local_distribution_cost?: number;
    national_distribution_cost?: number;
    europe_distribution_cost?: number;
    international_distribution_cost?: number;
    is_checked_local?: boolean;
    is_checked_national?: boolean;
    is_checked_europe?: boolean;
    is_checked_international?: boolean;
}

export interface IFlatrateAndWeightCost {
    id?: string;
    distribution_costs_id?: string;
    created_at?: string;
    updated_at?: string;
    weight_from: number;
    weight_to: number;
    base_cost: number;
}

export interface IAreaAndWeightCost {
    id?: string;
    distribution_costs_id?: string;
    area_and_weight_information?: IAreaAndWeightInformation[];
    cost_extra_per_kg: number;
}

export interface IAreaAndWeightInformation {
    id: string;
    coverage_area_id: string;
    area_and_weight_cost_id: string;
    coverage_areas?: ICoverageArea;
    area_and_weight_cost?: IAreaAndWeightCost;
    area_weight_cost_range?: IAreaAndWeightCostRange[];
}

export interface IAreaAndWeightCostRange {
    id?: string;
    weight_from: number;
    weight_to: number;
    base_cost: number;
    area_and_weight_information_id: string;
}

export interface IFlatrateAndWeightCostForm {
    id?: string;
    distribution_costs_id?: string;
    created_at?: string;
    updated_at?: string;
    weight_from: number;
    weight_to: number;
    base_cost: number;
}

export interface IUserReport {
    id: string;
    created_at: string;
    title: string;
    description: string;
    file: string;
    is_resolved: boolean;
}

export interface IGamification {
    user_id: string;
    score: number;
    users?: IUserProfile;
}

export interface IExperience {
    id: string;
    created_at: string;
    name: string;
    description: string;
    producer_id: string;
    type: string;
    price: number;
    producer_user?: IProducerUser;
    bm_questions?: IBeerMasterQuestion[];
}

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

// export interface IBMExperienceParticipants {
//   id: string;
//   created_at: string;
//   gamification_id: string;
//   event_id: string;
//   cpm_id: string;
//   cpf_id: string;
//   score: number;
//   is_paid: boolean;
//   is_cash: boolean;
//   is_finished: boolean;
//   correct_answers: number;
//   incorrect_answers: number;
// }

export interface IBeerMasterQuestionParticipationFormData {
    question?: string;
    difficulty: number;
    experience_id: string;
    product_id: string;
    answers: IBeerMasterAnswerParticipationFormData[];
}

export interface IBeerMasterAnswerParticipationFormData {
    selected_id: string;
    answer: string;
    is_correct: boolean;
}

// export interface IBeerMasterQuestion {
//   id: string;
//   question: string;
//   experience_id: string;
//   product_id: string;
//   difficulty: number;
//   answers: IBeerMasterAnswer[];
//   beer_master_participation?: IBMExperienceParticipants;
//   products?: IProduct;
// }

export interface IBeerMasterAnswer {
    id: string;
    answer: string;
    is_correct: boolean;
    question_id: string;
    beer_master_question?: IBeerMasterQuestion;
}

export interface IAddBeerMasterQuestionFormData {
    question: string;
    answers: IAddBeerMasterAnswerFormData[];
    beer_master_participation?: IBMExperienceParticipants;
    product_id: string;
}

export interface IAddBeerMasterAnswerFormData {
    answer: string;
    is_correct: boolean;
}

export interface IAddModalExperienceFormData {
    name: string;
    description: string;
    type: string;
}

export interface IAddModalExperienceBeerMasterFormData {
    name: string;
    description: string;
    type: string;
    price: number;
    questions: IAddBeerMasterQuestionFormData[];
}

export interface IUpdModalExperienceBeerMasterFormData {
    id: string;
    name: string;
    description: string;
    type: string;
    price: number;
    producer_id: string;
    questions: IUpdBeerMasterQuestionFormData[];
}

export interface IUpdBeerMasterQuestionFormData {
    id?: string;
    experience_id: string;
    question: string;
    answers: IUpdBeerMasterAnswerFormData[];
    product_id: string;
}

export interface IUpdBeerMasterAnswerFormData {
    id?: string;
    answer: string;
    is_correct: boolean;
    question_id: string;
}

// User response to the Beer Master Experience
export interface IBMExperienceUserResponse {
    id: string;
    created_at: string;
    question_id: string;
    answer_id: string;
    participation_id: string;
    is_correct: boolean;
    questions?: IBeerMasterQuestion;
    answers?: IBeerMasterAnswer;
    beer_master_participation?: IBMExperienceParticipants;
}

export interface IBMExperienceUserResponseFormData {
    question_id: string;
    answer_id: string;
    participation_id: string;
    is_correct: boolean;
}

export interface IDiscountCode {
    id: string;
    created_at: string;
    code: string;
    discount_type: string;
    discount_value: number;
    max_uses: number;
    uses: number;
    expiration_date: string;
    updated_at: string;
}

export interface IUserDiscountCode {
    id: string;
    user_id: string;
    discount_code_id: string;
    used_at: string;
}
