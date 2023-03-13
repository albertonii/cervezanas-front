export namespace ProductEnum {
  export enum State {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
  }

  export enum Type {
    PRODUCT = "PRODUCT",
    MERCHANDISING = "MERCHANDISING",
    WINE = "WINE",
    SPIRIT = "SPIRIT",
    BEER = "BEER",
    CIDER = "CIDER",
    MIXED = "MIXED",
    NON_ALCOHOLIC = "NON_ALCOHOLIC",
    GIFT_CARD = "GIFT_CARD",
    GIFT_VOUCHER = "GIFT_VOUCHER",
    GIFT_PACK = "GIFT_PACK",
    OTHER = "OTHER",
  }

  export enum Visibility {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
  }

  export enum Status {
    DRAFT = "DRAFT",
    PUBLISHED = "PUBLISHED",
    DELETED = "DELETED",
    ARCHIVED = "ARCHIVED",
  }
}
