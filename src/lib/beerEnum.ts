// export enum Intensity {
//   i_session, // <4% ABC
//   i_standard, // 4-6% ABC
//   i_high, // 6-9% ABC
//   i_very_high, // >9% ABC
// }

import { Type } from "./productEnum";

export enum Color {
  very_light,
  straw,
  pale, // Pajizo a dorado
  gold,
  light_amber,
  amber, // ámbar a marrón-cobrizo
  medium_amber,
  copper,
  light_brown,
  brown,
  dark_brown,
  very_dark,
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

export enum Volume_can {
  _150 = 150,
  _200 = 200,
  _207 = 207,
  _222 = 222,
  _237 = 237,
  _248 = 248,
  _250 = 250,
  _300 = 300,
  _320 = 320,
  _330 = 330,
  _341 = 341,
  _350 = 350,
  _355 = 355,
  _375 = 375,
  _440 = 440,
  _473 = 473,
  _500 = 500,
  _550 = 550,
  _568 = 568,
  _650 = 650,
  _750 = 750,
  _940 = 940,
  _1000 = 1000,
  _1500 = 1500,
}

export enum Volume_bottle {
  _150 = 150,
  _200 = 200,
  _207 = 207,
  _222 = 222,
  _237 = 237,
  _248 = 248,
  _250 = 250,
  _300 = 300,
  _320 = 320,
  _330 = 330,
  _341 = 341,
  _350 = 350,
  _355 = 355,
  _375 = 375,
  _440 = 440,
  _473 = 473,
  _500 = 500,
  _550 = 550,
  _568 = 568,
  _650 = 650,
  _750 = 750,
  _940 = 940,
  _1000 = 1000,
  _1500 = 1500,
}

export enum Volume_draft {
  _3 = 3,
  _4 = 4,
  _5 = 5,
  _10 = 10,
  _14_67 = 14.67,
  _18_9 = 18.9,
  _19_8 = 19.8,
  _25 = 25,
  _29_3 = 29.3,
  _50 = 50,
  _58_66 = 58.66,
}

export enum Pack_format {
  _1 = 1,
  _2 = 2,
  _3 = 3,
  _4 = 4,
  _6 = 6,
  _8 = 8,
  _10 = 10,
  _12 = 12,
  _16 = 16,
  _18 = 18,
  _20 = 20,
  _22 = 22,
  _24 = 24,
  _28 = 28,
  _30 = 30,
  _36 = 36,
}

export enum Format {
  can, // lata
  bottle, // cristal
  draft, // barril
}

export enum ReviewQualification {
  need_to_improve = "need_to_improve",
  fair = "fair",
  good = "good",
  very_good = "very_good",
  excellent = "excellent",
  superb = "superb",
  not_qualified = "not_qualified",
}

// export const intensity_options = [
//   { label: "i_session", value: Intensity.i_session },
//   { label: "i_standard", value: Intensity.i_standard },
//   { label: "i_high", value: Intensity.i_high },
//   { label: "i_very_high", value: Intensity.i_very_high },
// ];

export const color_options = [
  { label: "very_light", value: Color.very_light },
  { label: "straw", value: Color.straw },
  { label: "pale", value: Color.pale },
  { label: "gold", value: Color.gold },
  { label: "light_amber", value: Color.light_amber },
  { label: "amber", value: Color.amber },
  { label: "medium_amber", value: Color.medium_amber },
  { label: "copper", value: Color.copper },
  { label: "light_brown", value: Color.light_brown },
  { label: "brown", value: Color.brown },
  { label: "dark_brown", value: Color.dark_brown },
  { label: "very_dark", value: Color.very_dark },
  { label: "dark", value: Color.dark },
  { label: "other", value: "other" },
];

export const fermentation_options = [
  {
    label: "high",
    value: Fermentation.high,
  },
  {
    label: "low",
    value: Fermentation.low,
  },
  {
    label: "any",
    value: Fermentation.any,
  },
  {
    label: "wild",
    value: Fermentation.wild,
  },
  {
    label: "lagered",
    value: Fermentation.lagered,
  },
  {
    label: "aged",
    value: Fermentation.aged,
  },
];

export const origin_options = [
  {
    label: "br",
    value: Origin.br,
  },
  {
    label: "eu_oc",
    value: Origin.eu_oc,
  },
  {
    label: "eu_ce",
    value: Origin.eu_ce,
  },
  {
    label: "eu_or",
    value: Origin.eu_or,
  },
  {
    label: "us_no",
    value: Origin.us_no,
  },
  {
    label: "pa",
    value: Origin.pa,
  },
];

export const family_options = [
  {
    label: "ipa",
    value: Family.ipa,
  },
  {
    label: "brown_ale",
    value: Family.brown_ale,
  },
  {
    label: "ipa",
    value: Family.pale_ale,
  },
  {
    label: "pale_lager",
    value: Family.pale_lager,
  },
  {
    label: "pilsner",
    value: Family.pilsner,
  },
  {
    label: "amber_ale",
    value: Family.amber_ale,
  },
  {
    label: "amber_lager",
    value: Family.amber_lager,
  },
  {
    label: "dark_lager",
    value: Family.dark_lager,
  },
  {
    label: "porter",
    value: Family.porter,
  },
  {
    label: "stout",
    value: Family.stout,
  },
  {
    label: "bock",
    value: Family.bock,
  },
  {
    label: "strong",
    value: Family.strong,
  },
  {
    label: "wheat_beer",
    value: Family.wheat_beer,
  },
  {
    label: "specialty_beer",
    value: Family.specialty_beer,
  },
  {
    label: "other",
    value: "other",
  },
];

export const era_options = [
  {
    label: "artisan",
    value: Era.artisan,
  },
  {
    label: "traditional",
    value: Era.traditional,
  },
  {
    label: "historic",
    value: Era.historic,
  },
];

export const aroma_options = [
  {
    label: "maltose",
    value: Aroma.maltose,
  },
  {
    label: "bitter",
    value: Aroma.bitter,
  },
  {
    label: "balanced",
    value: Aroma.balanced,
  },
  {
    label: "hopped",
    value: Aroma.hopped,
  },
  {
    label: "toast",
    value: Aroma.toast,
  },
  {
    label: "sweet",
    value: Aroma.sweet,
  },
  {
    label: "smoked",
    value: Aroma.smoked,
  },
  {
    label: "sour",
    value: Aroma.sour,
  },
  {
    label: "wood",
    value: Aroma.wood,
  },
  {
    label: "fruity",
    value: Aroma.fruity,
  },
  {
    label: "spicy",
    value: Aroma.spicy,
  },
];

export const format_options = [
  {
    label: "can",
    value: Format.can,
  },
  {
    label: "bottle",
    value: Format.bottle,
  },
  {
    label: "draft",
    value: Format.draft,
  },
];

export const product_type_options = [
  {
    label: Type.BEER,
    value: Type.BEER,
  },
  {
    label: Type.MERCHANDISING,
    value: Type.MERCHANDISING,
  },
  {
    label: Type.GIFT_CARD,
    value: Type.GIFT_CARD,
  },
  {
    label: Type.OTHER,
    value: Type.OTHER,
  },
];

export const volume_can_type_options = [
  {
    label: 0,
    value: Volume_can._150,
  },
  {
    label: 1,
    value: Volume_can._200,
  },
  {
    label: 2,
    value: Volume_can._207,
  },
  {
    label: 3,
    value: Volume_can._222,
  },
  {
    label: 4,
    value: Volume_can._237,
  },
  {
    label: 5,
    value: Volume_can._248,
  },
  {
    label: 6,
    value: Volume_can._250,
  },
  {
    label: 7,
    value: Volume_can._300,
  },
  {
    label: 8,
    value: Volume_can._320,
  },
  {
    label: 9,
    value: Volume_can._330,
  },
  {
    label: 10,
    value: Volume_can._341,
  },
  {
    label: 11,
    value: Volume_can._350,
  },
  {
    label: 12,
    value: Volume_can._355,
  },
  {
    label: 13,
    value: Volume_can._375,
  },
  {
    label: 14,
    value: Volume_can._440,
  },
  {
    label: 15,
    value: Volume_can._473,
  },
  {
    label: 16,
    value: Volume_can._500,
  },
  {
    label: 17,
    value: Volume_can._550,
  },
  {
    label: 18,
    value: Volume_can._568,
  },
  {
    label: 19,
    value: Volume_can._650,
  },
  {
    label: 20,
    value: Volume_can._750,
  },
  {
    label: 21,
    value: Volume_can._940,
  },
  {
    label: 22,
    value: Volume_can._1000,
  },
  {
    label: 23,
    value: Volume_can._1500,
  },
];

export const volume_bottle_type_options = [
  {
    label: 0,
    value: Volume_bottle._150,
  },
  {
    label: 1,
    value: Volume_bottle._200,
  },
  {
    label: 2,
    value: Volume_bottle._207,
  },
  {
    label: 3,
    value: Volume_bottle._222,
  },
  {
    label: 4,
    value: Volume_bottle._237,
  },
  {
    label: 5,
    value: Volume_bottle._248,
  },
  {
    label: 6,
    value: Volume_bottle._250,
  },
  {
    label: 7,
    value: Volume_bottle._300,
  },
  {
    label: 8,
    value: Volume_bottle._320,
  },
  {
    label: 9,
    value: Volume_bottle._330,
  },
  {
    label: 10,
    value: Volume_bottle._341,
  },
  {
    label: 11,
    value: Volume_bottle._350,
  },
  {
    label: 12,
    value: Volume_bottle._355,
  },
  {
    label: 13,
    value: Volume_bottle._375,
  },
  {
    label: 14,
    value: Volume_bottle._440,
  },
  {
    label: 15,
    value: Volume_bottle._473,
  },
  {
    label: 16,
    value: Volume_bottle._500,
  },
  {
    label: 17,
    value: Volume_bottle._550,
  },
  {
    label: 18,
    value: Volume_bottle._568,
  },
  {
    label: 19,
    value: Volume_bottle._650,
  },
  {
    label: 20,
    value: Volume_bottle._750,
  },
  {
    label: 21,
    value: Volume_bottle._940,
  },
  {
    label: 22,
    value: Volume_bottle._1000,
  },
  {
    label: 23,
    value: Volume_bottle._1500,
  },
];

export const volume_draft_type_options = [
  {
    label: 0,
    value: Volume_draft._3,
  },
  {
    label: 1,
    value: Volume_draft._4,
  },
  {
    label: 2,
    value: Volume_draft._5,
  },
  {
    label: 3,
    value: Volume_draft._10,
  },
  {
    label: 4,
    value: Volume_draft._14_67,
  },
  {
    label: 5,
    value: Volume_draft._18_9,
  },
  {
    label: 6,
    value: Volume_draft._19_8,
  },
  {
    label: 7,
    value: Volume_draft._25,
  },
  {
    label: 8,
    value: Volume_draft._29_3,
  },
  {
    label: 9,
    value: Volume_draft._50,
  },
  {
    label: 10,
    value: Volume_draft._58_66,
  },
];

export const pack_type_options = [
  {
    label: 0,
    value: Pack_format._1,
  },
  {
    label: 1,
    value: Pack_format._2,
  },
  {
    label: 2,
    value: Pack_format._3,
  },
  {
    label: 3,
    value: Pack_format._4,
  },
  {
    label: 4,
    value: Pack_format._6,
  },
  {
    label: 5,
    value: Pack_format._8,
  },
  {
    label: 6,
    value: Pack_format._10,
  },
  {
    label: 7,
    value: Pack_format._12,
  },
  {
    label: 8,
    value: Pack_format._16,
  },
  {
    label: 9,
    value: Pack_format._18,
  },
  {
    label: 10,
    value: Pack_format._20,
  },
  {
    label: 11,
    value: Pack_format._22,
  },
  {
    label: 12,
    value: Pack_format._24,
  },
  {
    label: 13,
    value: Pack_format._28,
  },
  {
    label: 14,
    value: Pack_format._30,
  },
  {
    label: 15,
    value: Pack_format._36,
  },
];
