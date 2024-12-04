export enum DistributionOption {
    ORIGIN_INFORMATION = 'origin_information',
    DESTINATION = 'coverage_area',
    COST = 'distribution_cost',
}

export enum EventOption {
    EVENT = 'event',
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
