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
import { Fermentation, RecommendedGlass } from '../beerEnum';
import { IBoxPack } from './product';
import {
    IConsumptionPoints,
    ICPFixed,
    ICPMobile,
    ICPFProducts,
    ICPMProducts,
    IRefCPMProducts,
    ICPMProductsEditCPMobileModal,
    ICPMProductsEditCPFixedModal,
    ICPM_events,
    ICPF_events,
} from './consumptionPoints';
import { IEvent } from './eventOrders';

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
    aroma: string;
    is_gluten: boolean;
    format: string;
    volume: number;
    sku: string;
    intensity: number;
    ibu: number;
    ingredients?: string[];
    pairing?: string;
    recommended_glass?: string;
    brewers_note?: string;
    srm?: number;
    ebc?: number;
    og?: number;
    fg?: number;
    hops_type?: string;
    malt_type?: string;
    consumption_temperature?: number;
    products?: IProduct;
}

export interface IBeerFormData {
    product_id: string; // FK
    created_at: string;
    category: string;
    fermentation: string;
    color: string;
    family: string;
    aroma: string;
    is_gluten: boolean;
    format: string;
    volume: number;
    sku: string;
    intensity: number;
    ibu: number;
    ingredients?: string[];
    pairing?: string;
    recommended_glass?: string;
    brewers_note?: string;
    srm?: number;
    ebc?: number;
    og?: number;
    fg?: number;
    hops_type?: string;
    malt_type?: string;
    consumption_temperature?: number;
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

export interface IProductLotFormData {
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
    users?: IUserTable;
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
    products?: IProduct[];
}

export interface IAwardFormData {
    id?: string;
    name: string;
    description: string;
    img_url: any;
    year: number;
    product_id: string;
}

export interface IAwardUpdateForm {
    id?: string; // Este ID se convierte en el ID que asigna el key al hacer loop en UpdateProductModal
    award_id?: string;
    name: string;
    description: string;
    img_url: any;
    year: number;
    product_id: string;
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
    users?: IUserTable;
    products?: IProduct;
}

export interface IReviewFormData {
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
    users?: IUserTable;
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

export interface ILikeFormData {
    id: string;
    created_at: string;
    owner_id: string;
    product_id: string;
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
    promo_code: string;
    order_number: string;
    is_consumer_email_sent: boolean;
    is_producer_email_sent: boolean;
    is_distributor_email_sent: boolean;
    business_orders?: IBusinessOrder[];
    users?: IUserTable;
    // Información de envío copiada - De esta manera, si el usuario elimina su dirección de envío, la información de envío se mantiene en la orden
    shipping_name: string;
    shipping_lastname: string;
    shipping_document_id: string;
    shipping_phone: string;
    shipping_address: string;
    shipping_address_extra: string;
    shipping_country: string;
    shipping_region: string;
    shipping_sub_region: string;
    shipping_city: string;
    shipping_zipcode: string;

    // Información de facturación
    billing_name: string;
    billing_lastname: string;
    billing_document_id: string;
    billing_phone: string;
    billing_address: string;
    billing_country: string;
    billing_region: string;
    billing_sub_region: string;
    billing_city: string;
    billing_zipcode: string;
    billing_is_company: boolean;
}

export interface IOrderItem {
    business_order_id: string;
    product_pack_id: string;
    created_at: string;
    quantity: number;
    is_reviewed: boolean;
    product_name: string;
    product_pack_name: string;
    product_price: number; // Precio unitario del producto
    subtotal: number; // product_price * quantity
    business_orders?: IBusinessOrder;
    product_packs?: IProductPack;
}

export interface IOrderItemFormData {
    business_order_id: string;
    product_pack_id: string;
    created_at: string;
    quantity: number;
    is_reviewed: boolean;
    product_name: string;
    product_pack_name: string;
    product_price: number; // Precio unitario del producto
    subtotal: number; // product_price * quantity
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
    // promo_code: string;
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
    product_media?: IProductMedia[];
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
    is_company: boolean;
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
    country: string;
    region: string;
    sub_region: string;
    city: string;
    zipcode: string;
    is_default: boolean;
}

export type UserProps = {
    user: IUserTable;
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

export type IProductPackFormData = {
    id: string; // PK
    product_id: string; // FK
    created_at: string;
    quantity: number;
    price: number;
    img_url: any;
    name: string;
    randomUUID: string;
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

export type ModalAddBreweryFormData = {
    name: string;
    foundation_year: number;
    history: string;
    description: string;
    logo?: any;
    country: string;
    region: string;
    sub_region: string;
    city: string;
    address: string;
    website?: string;
    rrss_ig?: string;
    rrss_fb?: string;
    rrss_linkedin?: string;
    types_of_beers_produced?: string[];
    special_processing_methods?: string[];
    guided_tours?: string;
    is_brewery_dirty: boolean;
};

export type ModalUpdateBreweryFormData = {
    id: string;
    name: string;
    foundation_year: number;
    history: string;
    description: string;
    logo?: any;
    country: string;
    region: string;
    sub_region: string;
    city: string;
    address: string;
    website?: string;
    rrss_ig?: string;
    rrss_fb?: string;
    rrss_linkedin?: string;
    types_of_beers_produced?: string[];
    special_processing_methods?: string[];
    guided_tours?: string;
    is_brewery_dirty?: boolean;
};

export type ModalAddProductFormData = {
    name: string;
    description?: string;
    price: number;
    fermentation: number;
    color: number;
    intensity: number;
    ibu: number;
    aroma: number;
    family: number;
    is_gluten: boolean;
    type: string;
    ingredients?: string[];
    pairing?: string | null;
    recommended_glass?: number;
    brewers_note?: string | null;
    og?: number | null;
    fg?: number | null;
    srm?: number | null;
    ebc?: number | null;
    hops_type?: string | null;
    malt_type?: string | null;
    consumption_temperature?: number | null;
    volume: number;
    weight: number;
    format: string;
    // stock_quantity: number;
    // stock_limit_notification: number;
    category: string;
    is_public: boolean;
    is_available: boolean;

    brewery_id?: string;
    // campaign: string;
    awards: ModalAddProductAwardFormData[];
    packs: ModalAddProductPackFormData[];
    multimedia_files?: any[];
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
    is_gluten: boolean;
    type: string;
    ingredients?: string[];
    pairing?: string | null;
    recommended_glass?: RecommendedGlass;
    brewers_note?: string | null;
    og?: number | null;
    fg?: number | null;
    srm?: number | null;
    ebc?: number | null;
    hops_type?: string | null;
    malt_type?: string | null;
    consumption_temperature?: number | null;
    is_public: boolean;
    is_available: boolean;
    volume: number;
    weight: number;
    format: string;
    category: string;
    brewery_id?: string;
    // campaign: string;
    // stock_quantity: number;
    // stock_limit_notification: number;
    awards: ModalUpdateProductAwardFormData[];
    packs: ModalUpdateProductPackFormData[];
    media_files?: IProductMediaFormData[];
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
    img_url_changed?: boolean;
    img_url_from_db?: string;
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
    distributor_id: string;
    cpf_id: string;
    cpm_id: string;
    cp_name: string;
    product_media?: IProductMedia[];
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
    price: number; // TODO : quitar el price - pq está en product_pack
    campaign_id: string;
    is_archived: boolean;
    category: string;
    is_monthly: boolean;
    is_available: boolean;
    owner_id: string;
    brewery_id: string;
    order_items?: IOrderItem[];
    product_lots?: IProductLot[];
    reviews?: IReview[];
    likes?: ILike[];
    awards?: IAward[];
    product_packs?: IProductPack[];
    beers?: IBeer;
    users?: IUserTable;
    product_inventory?: IProductInventory;
    product_media?: IProductMedia[];
    box_packs?: IBoxPack[];
    breweries?: IBrewery;
}

export interface IProductFormData {
    id: string;
    created_at: string;
    name: string;
    description: string;
    type: ProductType;
    is_public: boolean;
    discount_percent: number;
    weight: number;
    price: number; // TODO : quitar el price - pq está en product_pack
    campaign_id: string;
    is_archived: boolean;
    category: string;
    is_monthly: boolean;
    is_available: boolean;
    owner_id: string;
    brewery_id: string;
    order_items?: IOrderItemFormData[];
    product_lots?: IProductLotFormData[];
    reviews?: IReviewFormData[];
    likes?: ILikeFormData[];
    awards?: IAwardFormData[];
    product_packs?: IProductPackFormData[];
    beers?: IBeerFormData;
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
    // promo_code: string;
    price: number; // TODO : quitar el price - pq está en product_pack
    campaign_id: string;
    is_archived: boolean;
    category: string;
    is_monthly: boolean;
    owner_id: string;
    beers?: IBee;
    product_media?: IProductMedia[];
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
    promo_code: string;
    price: number;
    campaign_id: string;
    is_archived: boolean;
    category: string;
    is_monthly: boolean;
    owner_id: string;
    product_media: IProductMedia[];
    order_items?: OrderItem[];
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
    user: IUserTable;
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
    // stock_quantity: number;
    // stock_limit_notification: number;
    lot_id: number;
    lot_quantity: number;
    brewery_id?: string;
}

export interface IModalShippingAddress {
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
    country: string;
    zipcode: string;
    city: string;
    region: string;
    sub_region: string;
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
}

export interface ModalBillingCompanyAddressFormData {
    company_name: string;
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
    country: string;
    region: string;
    sub_region: string;
    city: string;
    zipcode: string;
    is_default: boolean;
    is_company?: boolean;
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
    company_legal_representative: string;
    location_id: string;
    is_authorized: boolean;
    is_active: boolean;
    company_ig?: string;
    company_fb?: string;
    company_linkedin?: string;
    company_website?: string;
    company_logo?: string;
    opening_hours?: {};
    company_history_year?: number;
    company_history_description?: string;
    company_phone: string;
    company_email: string;
    company_vision?: string;
    company_mission?: string;
    company_values?: string;
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
    company_legal_representative: string;
    id_number: string;
    location_id: string;
    is_authorized: boolean;
    is_active: boolean;
    company_ig?: string;
    company_fb?: string;
    company_linkedin?: string;
    company_website?: string;
    company_logo?: string;
    company_history_year?: number;
    company_history_description?: string;
    company_phone: string;
    company_email: string;
    company_vision?: string;
    company_mission?: string;
    company_values?: string;
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
    producer_id: string;
    distributor_id: string;
    tracking_id: string;
    status: string;
    total_sales: number; // Subtotal del IOrderItem
    platform_comission_distributor: number; // Comisión de la plataforma (15% de total_sales para Productores y 5% para Distribuidores)
    platform_comission_producer: number; // Comisión de la plataforma (15% de total_sales para Productores y 5% para Distribuidores)
    net_revenue_distributor: number; // Ingreso neto para el productor/distribuidor
    net_revenue_producer: number; // Ingreso neto para el productor/distribuidor
    invoice_period: string;
    producer_user?: IProducerUser;
    distributor_user?: IDistributorUser;
    shipment_tracking?: IShipmentTracking;
    orders?: IOrder;
    order_items?: IOrderItem[];
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
    cost_extra_per_kg: number;
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
    created_at: string;
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
    cost_extra_per_kg: number;
    area_and_weight_information?: IAreaAndWeightInformation[];
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

export interface IBrewery {
    id: string;
    producer_id: string;
    created_at: string;
    name: string;
    foundation_year: number;
    history: string;
    description: string;
    logo: string;
    country: string;
    region: string;
    sub_region: string;
    city: string;
    address: string;
    website: string;
    rrss_ig: string;
    rrss_fb: string;
    rrss_linkedin: string;
    types_of_beers_produced: string[];
    special_processing_methods: string[];
    guided_tours: string;
    producer_user?: IProducerUser;
}

export interface IShipmentTracking {
    id: string;
    created_at: string;
    status: string;
    order_id: string;
    shipment_company: string;
    shipment_url: string;
    shipment_tracking_id: string;
    estimated_date: string;
    is_updated_by_distributor: boolean;
    orders?: IOrder;
    shipment_tracking_messages: IShipmentTrackingMessage[];
}

export interface IShipmentTrackingMessage {
    id: string;
    created_at: string;
    tracking_id: string;
    content: string;
    // shipment_tracking?: IShipmentTracking;
}

export interface ShipmentTrackingFormData {
    id?: string;
    shipment_company: string;
    shipment_url: string;
    shipment_tracking_id: string;
    estimated_date: string;
    status: string;
    is_updated_by_distributor: boolean;
}

export interface ShipmentTrackingMessagesFormData {
    messages: ShipmentTrackingMessageFormData[];
}

export interface ShipmentTrackingMessageFormData {
    created_at: string;
    content: string;
    tracking_id: string;
}

export interface ISalesRecordsProducer {
    id: string;
    created_at: string;
    updated_at: string;
    producer_id: string;
    total_amount: number; // Sum of net amounts from ISalesRecordsItems
    status: string; // 'Pending', 'Paid', etc.
    invoice_period: string; // 03/2025
    producer_username: string;
    producer_email: string;
    producer_user?: IProducerUser;
    payments?: IPayment[];
    sales_records_items?: ISalesRecordsItem[];
}

export interface ISalesRecordsItem {
    id: string;
    sales_records_id: string;
    business_order_id: string;
    product_name: string;
    product_pack_name: string;
    product_quantity: number;
    total_sales: number;
    platform_commission: number;
    net_amount: number;
    business_orders?: IBusinessOrder;
    sales_records_producer?: ISalesRecordsProducer;
}

export interface IInvoiceProducer {
    id: string;
    created_at: string;
    updated_at: string;
    producer_id: string;
    name: string;
    file_path: string;
    invoice_period: string;
    total_amount: number;
    status: string;
    producer_user?: IProducerUser;
    payments?: IPayment[];
    refunds?: IRefund[];
}

export interface IPayment {
    id: string;
    invoice_id: string;
    amount_paid: number;
    payment_method: string;
    status: string;
    created_at: string;
    updated_at: string;
    invoices?: IInvoiceProducer;
}

export interface IRefund {
    id: string;
    business_order_id: string;
    invoice_id: string;
    amount: number;
    reason: string;
    status: string;
    created_at: string;
    updated_at: string;
    business_orders?: IBusinessOrder;
    invoices?: IInvoiceProducer;
}

export interface InvoiceFormData {
    invoice_name: string;
    invoice_file: FileList;
    total_amount: number;
    invoice_period_selected: string;
}

export interface IProductMedia {
    id: string;
    created_at: string;
    product_id: string;
    type: string; // Photo or Video
    url: string;
    alt_text: string;
    is_primary: boolean;
}

export interface IProductMediaFormData {
    product_id: string;
    type: string; // Photo or Video
    url: string;
    alt_text: string;
    is_primary: boolean;
}

export interface UploadedFile {
    file?: File;
    type: string;
    isMain?: boolean;
    isExisting?: boolean;
    url?: string;
    id?: string;
}

export interface IPromoCode {
    id: string;
    created_at: string;
    code: string;
    discount_type: string;
    discount_value: number;
    max_uses: number;
    uses: number;
    expiration_date: string;
    updated_at: string;
    description: string;
    start_date: string;
    is_active: boolean;
    max_usage_per_user: number;
    product_id: string;
    products?: IProduct[];
}

export interface IUserPromoCode {
    id: string;
    user_id: string;
    promo_code_id: string;
    used_at: string;
    order_id: string;
    created_at: string;
}

export interface AchievementType {
    name: string;
    description: string;
    icon: string;
}
