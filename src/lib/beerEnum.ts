// export enum Intensity {
//   i_session, // <4% ABC
//   i_standard, // 4-6% ABC
//   i_high, // 6-9% ABC
//   i_very_high, // >9% ABC
// }

import { Type } from './productEnum';

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
    petroleum,
    other,
}

export enum Fermentation {
    high, // Levadura ale
    low, // Levadura lager
    any, // Levadura ale o lager
    wild, // Levadura no Saccharomyces/bacterias
    lagered, // Acondicionamiento en frío
    aged, // Largo acondicionamiento previo
    other,
    none,
}

export enum Origin {
    br, // islas-britícas - Inglaterra, Gales, Escocia, Irlanda
    eu_oc, // europa-occidental - Bélgica, Francia, Países Bajos
    eu_ce, // europa-central - Alemania, Austria, República Checa, Escandinavia
    eu_or, // europa-oriental - Polonia, Estados Bálticos, Rusia
    us_no, // américa-del-norte - Estados Unidos, Canadá, México
    pa, // Pacífico - Australia, Nueva Zelanda
    other,
    none,
}

export enum Family {
    ipa,
    hazy_ipa,
    imperial_ipa,
    ale,
    brown_ale,
    pale_ale,
    belgian_ale,
    german_ale,
    indian_ale,
    american_ipa,
    american_pale_ale,
    indian_pale_ale,
    lager,
    special_lager,
    extra_lager,
    pale_lager,
    pilsen_lager,
    pilsner,
    helles,
    mexican_lager,
    vienna_lager,
    kölsch,
    amber_ale,
    amber_lager,
    dark_lager,
    porter,
    stout,
    milk_stout,
    bock,
    strong,
    wheat_beer,
    hefeweizen,
    witbier,
    dunkelweizen,
    american_wheat,
    specialty_beer,
    saison,
    belgian_dubbel,
    abadia,
    berliner_weisse,
    gose,
    other,
    none,
}

export enum Era {
    artisan, // desarrollada en la era moderna de la cerveza  artesanal
    traditional, // desarrollada antes de la era moderna de la cerveza  artesanal
    historic, // no elaborada actualmente o con producción muy  limitada
    other,
    none,
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
    PINT_125 = 0.125, // 1/8 de litro
    GLASS_200 = 0.2, // Vaso pequeño
    GLASS_250 = 0.25, // Vaso mediano
    GLASS_288 = 0.288,
    GLASS_300 = 0.3,
    BOTTLE_330 = 0.33, // Botella estándar pequeña
    CAN_473 = 0.473, // Lata estándar americana
    GLASS_500 = 0.5, // Medio litro
    GLASS_600 = 0.6,
    GLASS_700 = 0.7,
    GLASS_800 = 0.8,
    GLASS_900 = 0.9,
    LITER_1 = 1.0, // 1 litro
    BARREL_2 = 2.0,
    BARREL_3 = 3.0,
    BARREL_4 = 4.0,
    BARREL_5 = 5.0,
    BARREL_10 = 10.0,
    KEG_1467 = 14.67, // Barril de cerveza pequeño
    KEG_1890 = 18.9, // Barril estándar americano
    KEG_1980 = 19.8, // Variación de barril
    KEG_25 = 25.0,
    KEG_2930 = 29.3, // Barril medio europeo
    KEG_50 = 50.0, // Barril estándar europeo
    KEG_5866 = 58.66, // Barril grande
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

export enum FormatName {
    can = 'can', // lata
    bottle = 'bottle', // cristal
    draft = 'draft', // barril
}

export enum ReviewQualification {
    need_to_improve = 'need_to_improve',
    fair = 'fair',
    good = 'good',
    very_good = 'very_good',
    excellent = 'excellent',
    superb = 'superb',
    not_qualified = 'not_qualified',
}

// export const intensity_options = [
//   { label: "i_session", value: Intensity.i_session },
//   { label: "i_standard", value: Intensity.i_standard },
//   { label: "i_high", value: Intensity.i_high },
//   { label: "i_very_high", value: Intensity.i_very_high },
// ];

export enum RecommendedGlass {
    flute, // Flute (vaso estrecho y alto, usado principalmente para cervezas afrutadas o gaseosas como la bière brut y bière de champagne)
    pint, // Pint (vaso común y versátil, ideal para ales, porters y stouts)
    snifter, // Snifter (copa bulbosa, ideal para cervezas fuertes y aromáticas como Belgian dark ale, double/imperial stout, double/imperial IPA)
    stein, // Stein (jarra robusta con asa, usada para lagers y cervezas de gran volumen)
    tulip, // Tulip (copa con base ancha y boca estrecha, ideal para cervezas belgas como Dubbel, Tripel y Quadrupel)
    weizen, // Weizen (vaso alto y delgado, usado para cervezas de trigo como Weissbier)
    teku, // Teku (copa diseñada para cervezas artesanales de alta calidad)
    stange, // Stange (vaso alto y delgado, ideal para Kölsch y Altbier)
    pilsner, // Pilsner (vaso alto y cónico, usado para cervezas ligeras y Pilsner)
    lager, // Lager (vaso alto y estrecho, ideal para cervezas lager)
    chalice, // Chalice (cáliz, copa grande y ancha, usada para cervezas belgas fuertes)
    goblet, // Goblet (similar al cáliz, pero más decorado y pesado, usado para cervezas complejas)
    tumbler, // Tumbler (vaso corto y ancho, usado para cervezas stouts y porters)
    nonic_pint, // Nonic Pint (variante de vaso de pinta con una curva cerca del borde, usado para ales y lagers)
    dimpled_mug, // Dimpled Mug (jarra con asas y superficie con hoyuelos, usada para cervezas británicas)
    boot, // Boot (vaso en forma de bota, tradicionalmente usado en Alemania para cervezas lager)
    tankard, // Tankard (jarra grande y tradicional, usada para varios tipos de cervezas)
    glass, // Glass (vaso genérico sin una forma específica, usado para varios tipos de cervezas)
    thistle, // Thistle (vaso con una base ancha y una boca más estrecha, usado principalmente para cervezas Scottish Ale)
    yard, // Yard (vaso muy alto y estrecho con una base redonda, tradicionalmente usado en competiciones de bebida)
    tankard_mug, // Tankard Mug (similar al tankard, pero más estilizado y decorado, usado para varios tipos de cervezas)
    ceramic_stein, // Ceramic Stein (jarra de cerámica con tapa, tradicionalmente usada en Alemania para varias cervezas)
    shaker, // Shaker (vaso corto y ancho, usado para cócteles pero también adecuado para algunas cervezas)
    pokal, // Pokal (vaso con una base ancha y una boca más estrecha, usado para cervezas lager y pilsner)
    seidel, // Seidel (similar al Stein, pero generalmente más pequeño y sin tapa)
    grand_cru, // Grand Cru (vaso tipo cáliz, usado para cervezas belgas de alto contenido alcohólico)
    mini_pilsner, // Mini Pilsner (vaso más pequeño, usado para cervezas Pilsner en porciones menores)
    mini_stange, // Mini Stange (versión más pequeña del vaso Stange)
    british_dimple, // British Dimple (similar al Dimpled Mug, pero con un diseño más específico para cervezas británicas)
    ipa, // IPA (diseñado específicamente para cervezas IPA, con una forma que resalta los aromas de los lúpulos)
    becher, // Becher (vaso alto y delgado, usado para lagers y pilsners)
    pub_glass, // Pub Glass (vaso típico de pub, usado para varios tipos de ales y lagers)
    abbey_goblet, // Abbey Goblet (copa grande y decorada, usada para cervezas complejas de abadía)
    weissbier_vase, // Weissbier Vase (vaso alto y delgado, usado para cervezas de trigo)
    pocal, // Pocal (vaso corto y ancho, usado para lagers y pilsners)
    dimple_mug, // Dimple Mug (jarra robusta con asas, usada para cervezas británicas)
    willibecher, // Willibecher (vaso versátil, usado para varias cervezas alemanas)
    jever_pilsner, // Jever Pilsner (vaso alto y delgado, usado para cervezas pilsner)
    lambic_flute, // Lambic Flute (vaso estrecho y alto, usado para cervezas lambic)
    stein_mug, // Stein Mug (jarra robusta con asas y tapa, usada para cervezas alemanas)
    nonic, // Nonic (vaso versátil con un ensanchamiento cerca del borde)
    vase, // Vase (vaso alto y delgado, usado para cervezas de trigo)
    taster, // Taster (vaso pequeño, usado para degustaciones de cervezas)
    boot_mug, // Boot Mug (vaso en forma de bota, usado en festivales cerveceros)
    pilsner_pokal, // Pilsner Pokal (vaso cónico y alto, usado para cervezas pilsner)
    irish_mug, // Irish Mug (jarra robusta usada para stouts irlandesas)
    wheat_glass, // Wheat Glass (vaso alto y ancho, usado para cervezas de trigo)
    ipa_glass, // IPA Glass (diseñado específicamente para resaltar los aromas de las IPAs)
    american_pint, // American Pint (vaso versátil y común en Estados Unidos)
    belgian_tulip, // Belgian Tulip (copa con base ancha y boca estrecha, usada para cervezas belgas)
    english_pint, // English Pint (vaso tradicional usado en pubs británicos)
    italian_teku, // Italian Teku (copa elegante usada para cervezas artesanales)
    scottish_thistle, // Scottish Thistle (vaso con forma de cardo, usado para ales escocesas)
    saaz_pokal, // Saaz Pokal (vaso corto y ancho, usado para cervezas checas)
    bock_glass, // Bock Glass (vaso robusto usado para cervezas bock)
    porter_glass, // Porter Glass (vaso ancho y bajo, usado para porters)
    other, // Otros tipos de vasos menos comunes o específicos
}

export const recommended_glass_options: {
    label: string;
    value: RecommendedGlass;
}[] = [
    { label: 'flute', value: RecommendedGlass.flute },
    { label: 'pint', value: RecommendedGlass.pint },
    { label: 'snifter', value: RecommendedGlass.snifter },
    { label: 'stein', value: RecommendedGlass.stein },
    { label: 'tulip', value: RecommendedGlass.tulip },
    { label: 'weizen', value: RecommendedGlass.weizen },
    { label: 'teku', value: RecommendedGlass.teku },
    { label: 'stange', value: RecommendedGlass.stange },
    { label: 'pilsner', value: RecommendedGlass.pilsner },
    { label: 'lager', value: RecommendedGlass.lager },
    { label: 'chalice', value: RecommendedGlass.chalice },
    { label: 'goblet', value: RecommendedGlass.goblet },
    { label: 'tumbler', value: RecommendedGlass.tumbler },
    { label: 'nonic_pint', value: RecommendedGlass.nonic_pint },
    { label: 'dimpled_mug', value: RecommendedGlass.dimpled_mug },
    { label: 'boot', value: RecommendedGlass.boot },
    { label: 'tankard', value: RecommendedGlass.tankard },
    { label: 'glass', value: RecommendedGlass.glass },
    { label: 'thistle', value: RecommendedGlass.thistle },
    { label: 'yard', value: RecommendedGlass.yard },
    { label: 'tankard_mug', value: RecommendedGlass.tankard_mug },
    { label: 'ceramic_stein', value: RecommendedGlass.ceramic_stein },
    { label: 'shaker', value: RecommendedGlass.shaker },
    { label: 'pokal', value: RecommendedGlass.pokal },
    { label: 'seidel', value: RecommendedGlass.seidel },
    { label: 'grand_cru', value: RecommendedGlass.grand_cru },
    { label: 'mini_pilsner', value: RecommendedGlass.mini_pilsner },
    { label: 'mini_stange', value: RecommendedGlass.mini_stange },
    { label: 'british_dimple', value: RecommendedGlass.british_dimple },
    { label: 'ipa', value: RecommendedGlass.ipa },
    { label: 'becher', value: RecommendedGlass.becher },
    { label: 'pub_glass', value: RecommendedGlass.pub_glass },
    { label: 'abbey_goblet', value: RecommendedGlass.abbey_goblet },
    { label: 'weissbier_vase', value: RecommendedGlass.weissbier_vase },
    { label: 'pocal', value: RecommendedGlass.pocal },
    { label: 'dimple_mug', value: RecommendedGlass.dimple_mug },
    { label: 'willibecher', value: RecommendedGlass.willibecher },
    { label: 'jever_pilsner', value: RecommendedGlass.jever_pilsner },
    { label: 'lambic_flute', value: RecommendedGlass.lambic_flute },
    { label: 'stein_mug', value: RecommendedGlass.stein_mug },
    { label: 'nonic', value: RecommendedGlass.nonic },
    { label: 'vase', value: RecommendedGlass.vase },
    { label: 'taster', value: RecommendedGlass.taster },
    { label: 'boot_mug', value: RecommendedGlass.boot_mug },
    { label: 'pilsner_pokal', value: RecommendedGlass.pilsner_pokal },
    { label: 'irish_mug', value: RecommendedGlass.irish_mug },
    { label: 'wheat_glass', value: RecommendedGlass.wheat_glass },
    { label: 'ipa_glass', value: RecommendedGlass.ipa_glass },
    { label: 'american_pint', value: RecommendedGlass.american_pint },
    { label: 'belgian_tulip', value: RecommendedGlass.belgian_tulip },
    { label: 'english_pint', value: RecommendedGlass.english_pint },
    { label: 'italian_teku', value: RecommendedGlass.italian_teku },
    { label: 'scottish_thistle', value: RecommendedGlass.scottish_thistle },
    { label: 'saaz_pokal', value: RecommendedGlass.saaz_pokal },
    { label: 'bock_glass', value: RecommendedGlass.bock_glass },
    { label: 'porter_glass', value: RecommendedGlass.porter_glass },
    { label: 'other', value: RecommendedGlass.other },
];

export const color_options: {
    label: string;
    value: Color;
}[] = [
    { label: 'very_light', value: Color.very_light },
    { label: 'straw', value: Color.straw },
    { label: 'pale', value: Color.pale },
    { label: 'gold', value: Color.gold },
    { label: 'light_amber', value: Color.light_amber },
    { label: 'amber', value: Color.amber },
    { label: 'medium_amber', value: Color.medium_amber },
    { label: 'copper', value: Color.copper },
    { label: 'light_brown', value: Color.light_brown },
    { label: 'brown', value: Color.brown },
    { label: 'dark_brown', value: Color.dark_brown },
    { label: 'very_dark', value: Color.very_dark },
    { label: 'dark', value: Color.dark },
    { label: 'petroleum', value: Color.petroleum },
    { label: 'other', value: Color.other },
];

export const fermentation_options: {
    label: string;
    value: Fermentation;
}[] = [
    {
        label: 'high',
        value: Fermentation.high,
    },
    {
        label: 'low',
        value: Fermentation.low,
    },
    {
        label: 'any',
        value: Fermentation.any,
    },
    {
        label: 'wild',
        value: Fermentation.wild,
    },
    {
        label: 'lagered',
        value: Fermentation.lagered,
    },
    {
        label: 'aged',
        value: Fermentation.aged,
    },
    {
        label: 'other',
        value: Fermentation.other,
    },
    {
        label: 'none',
        value: Fermentation.none,
    },
];

export const origin_options: {
    label: string;
    value: Origin;
}[] = [
    {
        label: 'br',
        value: Origin.br,
    },
    {
        label: 'eu_oc',
        value: Origin.eu_oc,
    },
    {
        label: 'eu_ce',
        value: Origin.eu_ce,
    },
    {
        label: 'eu_or',
        value: Origin.eu_or,
    },
    {
        label: 'us_no',
        value: Origin.us_no,
    },
    {
        label: 'pa',
        value: Origin.pa,
    },
    {
        label: 'other',
        value: Origin.other,
    },
    {
        label: 'none',
        value: Origin.none,
    },
];

export const family_options: {
    label: string;
    value: Family;
}[] = [
    {
        label: 'ipa',
        value: Family.ipa,
    },
    { label: 'haze_ipa', value: Family.hazy_ipa },
    {
        label: 'ale',
        value: Family.ale,
    },
    {
        label: 'brown_ale',
        value: Family.brown_ale,
    },
    {
        label: 'pale_ale',
        value: Family.pale_ale,
    },
    {
        label: 'belgian_ale',
        value: Family.belgian_ale,
    },
    {
        label: 'german_ale',
        value: Family.german_ale,
    },
    {
        label: 'indian_ale',
        value: Family.indian_ale,
    },
    {
        label: 'american_ipa',
        value: Family.american_ipa,
    },
    {
        label: 'american_pale_ale',
        value: Family.american_pale_ale,
    },
    {
        label: 'indian_pale_ale',
        value: Family.indian_pale_ale,
    },
    {
        label: 'lager',
        value: Family.lager,
    },
    {
        label: 'special_lager',
        value: Family.special_lager,
    },
    {
        label: 'extra_lager',
        value: Family.extra_lager,
    },
    {
        label: 'pale_lager',
        value: Family.pale_lager,
    },
    {
        label: 'pilsen_lager',
        value: Family.pilsen_lager,
    },
    {
        label: 'pilsner',
        value: Family.pilsner,
    },
    {
        label: 'helles',
        value: Family.helles,
    },
    {
        label: 'mexican_lager',
        value: Family.mexican_lager,
    },
    {
        label: 'vienna_lager',
        value: Family.vienna_lager,
    },
    {
        label: 'kölsch',
        value: Family.kölsch,
    },
    {
        label: 'amber_ale',
        value: Family.amber_ale,
    },
    {
        label: 'amber_lager',
        value: Family.amber_lager,
    },
    {
        label: 'dark_lager',
        value: Family.dark_lager,
    },
    {
        label: 'porter',
        value: Family.porter,
    },
    {
        label: 'stout',
        value: Family.stout,
    },
    {
        label: 'milk_stout',
        value: Family.milk_stout,
    },
    {
        label: 'bock',
        value: Family.bock,
    },
    {
        label: 'strong',
        value: Family.strong,
    },
    {
        label: 'wheat_beer',
        value: Family.wheat_beer,
    },
    {
        label: 'hefeweizen',
        value: Family.hefeweizen,
    },
    {
        label: 'witbier',
        value: Family.witbier,
    },
    {
        label: 'dunkelweizen',
        value: Family.dunkelweizen,
    },
    {
        label: 'american_wheat',
        value: Family.american_wheat,
    },
    {
        label: 'specialty_beer',
        value: Family.specialty_beer,
    },
    {
        label: 'saison',
        value: Family.saison,
    },
    {
        label: 'belgian_dubbel',
        value: Family.belgian_dubbel,
    },
    {
        label: 'abadia',
        value: Family.abadia,
    },
    {
        label: 'berliner_weisse',
        value: Family.berliner_weisse,
    },
    {
        label: 'gose',
        value: Family.gose,
    },
    {
        label: 'other',
        value: Family.other,
    },
    {
        label: 'none',
        value: Family.none,
    },
];

export const era_options: {
    label: string;
    value: Era;
}[] = [
    {
        label: 'artisan',
        value: Era.artisan,
    },
    {
        label: 'traditional',
        value: Era.traditional,
    },
    {
        label: 'historic',
        value: Era.historic,
    },
];

export const aroma_options: {
    label: string;
    value: Aroma;
}[] = [
    {
        label: 'maltose',
        value: Aroma.maltose,
    },
    {
        label: 'bitter',
        value: Aroma.bitter,
    },
    {
        label: 'balanced',
        value: Aroma.balanced,
    },
    {
        label: 'hopped',
        value: Aroma.hopped,
    },
    {
        label: 'toast',
        value: Aroma.toast,
    },
    {
        label: 'sweet',
        value: Aroma.sweet,
    },
    {
        label: 'smoked',
        value: Aroma.smoked,
    },
    {
        label: 'sour',
        value: Aroma.sour,
    },
    {
        label: 'wood',
        value: Aroma.wood,
    },
    {
        label: 'fruity',
        value: Aroma.fruity,
    },
    {
        label: 'spicy',
        value: Aroma.spicy,
    },
];

export const format_options: {
    label: string;
    value: Format;
}[] = [
    {
        label: 'can',
        value: Format.can,
    },
    {
        label: 'bottle',
        value: Format.bottle,
    },
    {
        label: 'draft',
        value: Format.draft,
    },
];

export const product_type_options: {
    label: string;
    value: Type;
}[] = [
    {
        label: Type.BEER,
        value: Type.BEER,
    },
    // {
    //   label: Type.MERCHANDISING,
    //   value: Type.MERCHANDISING,
    // },
    // {
    //   label: Type.GIFT_CARD,
    //   value: Type.GIFT_CARD,
    // },
    // {
    //   label: Type.OTHER,
    //   value: Type.OTHER,
    // },
];

export const volume_can_type_options: {
    label: number;
    value: Volume_can;
}[] = [
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

export const volume_bottle_type_options: {
    label: number;
    value: Volume_bottle;
}[] = [
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

export const volume_draft_type_options: {
    label: string;
    value: Volume_draft;
}[] = [
    {
        label: 'Pinta (125 ml)',
        value: Volume_draft.PINT_125,
    },
    {
        label: 'Vaso pequeño (200 ml)',
        value: Volume_draft.GLASS_200,
    },
    {
        label: 'Vaso mediano (250 ml)',
        value: Volume_draft.GLASS_250,
    },
    {
        label: 'Vaso (288 ml)',
        value: Volume_draft.GLASS_288,
    },
    {
        label: 'Vaso grande (300 ml)',
        value: Volume_draft.GLASS_300,
    },
    {
        label: 'Botella estándar pequeña (330 ml)',
        value: Volume_draft.BOTTLE_330,
    },
    {
        label: 'Lata estándar americana (473 ml)',
        value: Volume_draft.CAN_473,
    },
    {
        label: 'Medio litro (500 ml)',
        value: Volume_draft.GLASS_500,
    },
    {
        label: 'Vaso grande (600 ml)',
        value: Volume_draft.GLASS_600,
    },
    {
        label: 'Vaso (700 ml)',
        value: Volume_draft.GLASS_700,
    },
    {
        label: 'Vaso (800 ml)',
        value: Volume_draft.GLASS_800,
    },
    {
        label: 'Vaso grande (900 ml)',
        value: Volume_draft.GLASS_900,
    },
    {
        label: '1 Litro',
        value: Volume_draft.LITER_1,
    },
    {
        label: 'Barril pequeño (3 L)',
        value: Volume_draft.BARREL_3,
    },
    {
        label: 'Barril (4 L)',
        value: Volume_draft.BARREL_4,
    },
    {
        label: 'Barril (5 L)',
        value: Volume_draft.BARREL_5,
    },
    {
        label: 'Barril grande (10 L)',
        value: Volume_draft.BARREL_10,
    },
    {
        label: 'Barril pequeño (14.67 L)',
        value: Volume_draft.KEG_1467,
    },
    {
        label: 'Barril estándar americano (18.9 L)',
        value: Volume_draft.KEG_1890,
    },
    {
        label: 'Barril (19.8 L)',
        value: Volume_draft.KEG_1980,
    },
    {
        label: 'Barril (25 L)',
        value: Volume_draft.KEG_25,
    },
    {
        label: 'Barril medio europeo (29.3 L)',
        value: Volume_draft.KEG_2930,
    },
    {
        label: 'Barril estándar europeo (50 L)',
        value: Volume_draft.KEG_50,
    },
    {
        label: 'Barril grande (58.66 L)',
        value: Volume_draft.KEG_5866,
    },
];

export const pack_type_options: {
    label: number;
    value: Pack_format;
}[] = [
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
