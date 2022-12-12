export namespace BeerEnum {
  export enum Intensity {
    i_session, // <4% ABC
    i_standard, // 4-6% ABC
    i_high, // 6-9% ABC
    i_very_high, // >9% ABC
  }

  export enum Color {
    pale, // Pajizo a dorado
    amber, // ámbar a marrón-cobrizo
    dark, // marrón oscuro a negro
  }

  export enum Fermentation {
    high, // Levadura ale
    low, // Levadura lager
    any, // Levadura ale o lager
    wild, // Levadura no Saccharomyces/bacterias
    lagered, // Acondicionamiento en frío
    aged, // Largo acondicionamiento previo
  }

  export enum Origin {
    br, // islas-britícas - Inglaterra, Gales, Escocia, Irlanda
    eu_oc, // europa-occidental - Bélgica, Francia, Países Bajos
    eu_ce, // europa-central - Alemania, Austria, República Checa, Escandinavia
    eu_or, // europa-oriental - Polonia, Estados Bálticos, Rusia
    us_no, // américa-del-norte - Estados Unidos, Canadá, México
    pa, // Pacífico - Australia, Nueva Zelanda
  }

  export enum Family {
    ipa,
    brown_ale,
    pale_ale,
    pale_lager,
    pilsner,
    amber_ale,
    amber_lager,
    dark_lager,
    porter,
    stout,
    bock,
    strong,
    wheat_beer,
    specialty_beer,
  }

  export enum Era {
    artisan, // desarrollada en la era moderna de la cerveza  artesanal
    traditional, // desarrollada antes de la era moderna de la cerveza  artesanal
    historic, // no elaborada actualmente o con producción muy  limitada
  }

  export enum Format {
    can, // lata
    glass, // cristal
    draft, // barril
  }

  export enum Aroma {
    maltose, // pronunciado aroma/sabor a malta
    bitter, // pronunciado amargor a lúpulo
    balanced, // intensidad similar de malta y amargor
    hopped, // aroma/sabor a lúpulo
    toast, // malta/grano tostado
    sweet, // dulzor residual evidente o sabor a azúcar
    smoked, // aroma/sabor a malta o grano ahumado
    sour, // carácter cítrico evidente o acidez elevada  intencionalmente
    wood, // carácter a envejecimiento en madera o barril
    fruity, // notable sabor y/o aroma a frutas
    spicy, // notable sabor y/o aroma a especias
  }

  export enum Product_type {
    beer = "beer",
    merchandising = "merchandising",
  }
}

export const intensity_options = [
  { label: "i_session", value: BeerEnum.Intensity.i_session },
  { label: "i_standard", value: BeerEnum.Intensity.i_standard },
  { label: "i_high", value: BeerEnum.Intensity.i_high },
  { label: "i_very_high", value: BeerEnum.Intensity.i_very_high },
];

export const color_options = [
  { label: "pale", value: BeerEnum.Color.pale },
  { label: "amber", value: BeerEnum.Color.amber },
  { label: "dark", value: BeerEnum.Color.dark },
];

export const fermentation_options = [
  {
    label: "high",
    value: BeerEnum.Fermentation.high,
  },
  {
    label: "low",
    value: BeerEnum.Fermentation.low,
  },
  {
    label: "any",
    value: BeerEnum.Fermentation.any,
  },
  {
    label: "wild",
    value: BeerEnum.Fermentation.wild,
  },
  {
    label: "lagered",
    value: BeerEnum.Fermentation.lagered,
  },
  {
    label: "aged",
    value: BeerEnum.Fermentation.aged,
  },
];

export const origin_options = [
  {
    label: "br",
    value: BeerEnum.Origin.br,
  },
  {
    label: "eu_oc",
    value: BeerEnum.Origin.eu_oc,
  },
  {
    label: "eu_ce",
    value: BeerEnum.Origin.eu_ce,
  },
  {
    label: "eu_or",
    value: BeerEnum.Origin.eu_or,
  },
  {
    label: "us_no",
    value: BeerEnum.Origin.us_no,
  },
  {
    label: "pa",
    value: BeerEnum.Origin.pa,
  },
];

export const family_options = [
  {
    label: "ipa",
    value: BeerEnum.Family.ipa,
  },
  {
    label: "brown_ale",
    value: BeerEnum.Family.brown_ale,
  },
  {
    label: "ipa",
    value: BeerEnum.Family.pale_ale,
  },
  {
    label: "pale_lager",
    value: BeerEnum.Family.pale_lager,
  },
  {
    label: "pilsner",
    value: BeerEnum.Family.pilsner,
  },
  {
    label: "amber_ale",
    value: BeerEnum.Family.amber_ale,
  },
  {
    label: "amber_lager",
    value: BeerEnum.Family.amber_lager,
  },
  {
    label: "dark_lager",
    value: BeerEnum.Family.dark_lager,
  },
  {
    label: "porter",
    value: BeerEnum.Family.porter,
  },
  {
    label: "stout",
    value: BeerEnum.Family.stout,
  },
  {
    label: "bock",
    value: BeerEnum.Family.bock,
  },
  {
    label: "strong",
    value: BeerEnum.Family.strong,
  },
  {
    label: "wheat_beer",
    value: BeerEnum.Family.wheat_beer,
  },
  {
    label: "specialty_beer",
    value: BeerEnum.Family.specialty_beer,
  },
];

export const era_options = [
  {
    label: "artisan",
    value: BeerEnum.Era.artisan,
  },
  {
    label: "traditional",
    value: BeerEnum.Era.traditional,
  },
  {
    label: "historic",
    value: BeerEnum.Era.historic,
  },
];

export const aroma_options = [
  {
    label: "maltose",
    value: BeerEnum.Aroma.maltose,
  },
  {
    label: "bitter",
    value: BeerEnum.Aroma.bitter,
  },
  {
    label: "balanced",
    value: BeerEnum.Aroma.balanced,
  },
  {
    label: "hopped",
    value: BeerEnum.Aroma.hopped,
  },
  {
    label: "toast",
    value: BeerEnum.Aroma.toast,
  },
  {
    label: "sweet",
    value: BeerEnum.Aroma.sweet,
  },
  {
    label: "smoked",
    value: BeerEnum.Aroma.smoked,
  },
  {
    label: "sour",
    value: BeerEnum.Aroma.sour,
  },
  {
    label: "wood",
    value: BeerEnum.Aroma.wood,
  },
  {
    label: "fruity",
    value: BeerEnum.Aroma.fruity,
  },
  {
    label: "spicy",
    value: BeerEnum.Aroma.spicy,
  },
];

export const format_options = [
  {
    label: "can",
    value: BeerEnum.Format.can,
  },
  {
    label: "glass",
    value: BeerEnum.Format.glass,
  },
  {
    label: "draft",
    value: BeerEnum.Format.draft,
  },
];

export const product_type_options = [
  {
    label: 0,
    value: BeerEnum.Product_type.beer,
  },
  {
    label: 1,
    value: BeerEnum.Product_type.merchandising,
  },
];
