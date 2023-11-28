export enum DistributionType {
  LOCAL = "local",
  CITY = "city",
  PROVINCE = "province",
  REGION = "region",
  EUROPE = "europe",
  INTERNATIONAL = "international",
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
