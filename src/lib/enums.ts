export enum DistributionOption {
    ORIGIN_INFORMATION = 'origin_information',
    DESTINATION = 'coverage_area',
    COST = 'distribution_cost',
}

export enum EventOption {
    EVENTS = 'events_label',
    CERVEZANAS_EVENT = 'CERVEZANAS_EVENT',
}

export enum DistributionDestinationType {
    LOCAL = 'local',
    CITY = 'city',
    SUB_REGION = 'sub_region',
    REGION = 'region',
    EUROPE = 'europe',
    INTERNATIONAL = 'international',
}

export enum DistributionCostType {
    FLATRATE = 'flatrate',
    FLATRATE_AND_WEIGHT = 'flatrate_and_weight',
    DISTANCE = 'distance',
    VOLUME_AND_WEIGHT = 'volume_and_weight',
    PRICE_RANGE = 'price_range',
    AREA_AND_WEIGHT = 'area_and_weight',
}

export enum DistributionStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
    CANCELLED = 'cancelled',
    ERROR = 'error',
}

export enum ROLE_ENUM {
    Cervezano = 'consumer',
    Productor = 'producer',
    Moderator = 'moderator',
    Distributor = 'distributor',
    Consumption_point = 'consumption_point',
    Admin = 'admin',
}

export const ROLE_OPTIONS = [
    {
        label: 'Cervezano',
        value: ROLE_ENUM.Cervezano,
    },
    {
        label: 'Productor',
        value: ROLE_ENUM.Productor,
    },
    {
        label: 'Distribuidor',
        value: ROLE_ENUM.Distributor,
    },
    {
        label: 'Punto de Consumo',
        value: ROLE_ENUM.Consumption_point,
    },
];

export enum DeliveryType {
    FLATRATE_INTERNATIONAL = 'FLATRATE_INTERNATIONAL',
    FLATRATE_EUROPE = 'FLATRATE_EUROPE',
    FLATRATE_NATIONAL = 'FLATRATE_NATIONAL',
    FLATRATE_LOCAL = 'FLATRATE_LOCAL',
    NONE = 'NONE',
}

export enum BillingInformationType {
    INDIVIDUAL = 'individual',
    COMPANY = 'company',
}

export enum CURRENCY_ENUM {
    EUR = 'EUR',
    USD = 'USD',
}

export enum EventCategory {
    BEER_TOURS = 'beer_tours',
    BEER_TASTINGS = 'beer_tastings',
    BREWING_WORKSHOPS = 'brewing_workshops',
    TAP_TAKEOVERS = 'tap_takeovers',
    NEW_BEER_LAUNCHES = 'new_beer_launches',
    MUSICALS = 'musicals',
    CHARITY_EVENTS = 'charity_events',
    NETWORKING = 'networking',
    BREWING_COMPETITIONS = 'brewing_competitions',
    SOCIAL_GATHERINGS = 'social_gatherings',
    TALKS = 'talks',
    EXHIBITIONS = 'exhibitions',
    FOOD_PAIRING_EVENTS = 'food_pairing_events',
    FAIRS_AND_EXHIBITIONS = 'fairs_and_exhibitions',
    Q_AND_A = 'q_and_a',
    HAPPY_HOURS = 'happy_hours',
}

export const EVENT_CATEGORIES = [
    {
        label: 'beer_tours',
        value: EventCategory.BEER_TOURS,
    },
    {
        label: 'beer_tastings',
        value: EventCategory.BEER_TASTINGS,
    },
    {
        label: 'brewing_workshops',
        value: EventCategory.BREWING_WORKSHOPS,
    },
    {
        label: 'tap_takeovers',
        value: EventCategory.TAP_TAKEOVERS,
    },
    {
        label: 'new_beer_launches',
        value: EventCategory.NEW_BEER_LAUNCHES,
    },
    {
        label: 'musicals',
        value: EventCategory.MUSICALS,
    },
    {
        label: 'charity_events',
        value: EventCategory.CHARITY_EVENTS,
    },
    {
        label: 'networking',
        value: EventCategory.NETWORKING,
    },
    {
        label: 'brewing_competitions',
        value: EventCategory.BREWING_COMPETITIONS,
    },
    {
        label: 'social_gatherings',
        value: EventCategory.SOCIAL_GATHERINGS,
    },
    {
        label: 'talks',
        value: EventCategory.TALKS,
    },
    {
        label: 'exhibitions',
        value: EventCategory.EXHIBITIONS,
    },
    {
        label: 'food_pairing_events',
        value: EventCategory.FOOD_PAIRING_EVENTS,
    },
    {
        label: 'fairs_and_exhibitions',
        value: EventCategory.FAIRS_AND_EXHIBITIONS,
    },
    {
        label: 'q_and_a',
        value: EventCategory.Q_AND_A,
    },
    {
        label: 'happy_hours',
        value: EventCategory.HAPPY_HOURS,
    },
];
