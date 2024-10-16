export interface Timezones {
    zoneName: string;
    gmtOffset: number;
    gmtOffsetName: string;
    abbreviation: string;
    tzName: string;
}
export interface ICountry {
    name: string;
    phonecode: string;
    iso2: string;
    isoCode: string;
    flag: string;
    currency: string;
    latitude: string;
    longitude: string;
    timezones?: Timezones[];
    getAllCountries?(): ICountry[];
    getCountryByCode?(): ICountry;
}
export interface IState {
    name: string;
    iso2: string;
    isoCode: string;
    countryCode: string;
    latitude?: string | null;
    longitude?: string | null;
    getStatesOfCountry?(): IState[];
    getStateByCodeAndCountry?(): IState;
    getStateByCode?(): IState;
}
export interface ICity {
    name: string;
    countryCode: string;
    state2?: string;
    stateCode: string;
    latitude?: string | null;
    longitude?: string | null;
    getAllCities?(): ICity[];
    getCitiesOfState?(): ICity[];
    getCitiesOfCountry?(): ICity[];
}

export interface JSONCountry {
    name: string;
    regions: JSONRegion[];
}

export interface JSONRegion {
    name: string;
    country: string;
    country_iso_code: string;
    subregions: JSONSubRegion[];
}

export interface JSONSubRegion {
    name: string;
    country: string;
    country_iso_code: string;
    region: string;
    cities?: string[];
}

export interface IRegionCoverageAreas {
    id: string;
    country_iso_code: string;
    regions: string[];
    distributor_id: string;
}

export interface ISubRegionCoverageAreasForDB {
    id: string;
    country_iso_code: string;
    country: string;
    region: string;
    name: string;
    distributor_id: string;
}
