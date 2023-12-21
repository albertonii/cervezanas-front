export enum DistributionOption {
  ORIGIN_INFORMATION = "origin_information",
  DESTINATION = "coverage_area",
  COST = "distribution_cost",
}

export enum DistributionDestinationType {
  LOCAL = "local",
  CITY = "city",
  PROVINCE = "province",
  REGION = "region",
  EUROPE = "europe",
  INTERNATIONAL = "international",
}

export enum DistributionCostType {
  FLATRATE = "flatrate",
  DISTANCE = "distance",
  VOLUME_AND_WEIGHT = "volume_and_weight",
  RANGE = "range",
}

export enum DistributionStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  CANCELLED = "cancelled",
  ERROR = "error",
}

export enum ROLE_ENUM {
  Cervezano = "consumer",
  Productor = "producer",
  Moderator = "moderator",
  Distributor = "distributor",
  Admin = "admin",
}

export const ROLE_OPTIONS = [
  {
    label: "Cervezano",
    value: ROLE_ENUM.Cervezano,
  },
  {
    label: "Productor",
    value: ROLE_ENUM.Productor,
  },
  {
    label: "Distribuidor",
    value: ROLE_ENUM.Distributor,
  },
];

export enum DeliveryType {
  FLATRATE_INTERNATIONAL = "FLATRATE_INTERNATIONAL",
  FLATRATE_EUROPE = "FLATRATE_EUROPE",
  FLATRATE_NATIONAL = "FLATRATE_NATIONAL",
  FLATRATE_LOCAL = "FLATRATE_LOCAL",
  NONE = "NONE",
}
