import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import {
  Country,
  State,
  City,
  ICountry,
  IState,
  ICity,
} from "country-state-city";

type Props = {
  cities: string[];
};

export default function CityDistribution({ cities }: Props) {
  const t = useTranslations();

  const [addressCountry, setAddressCountry] = useState<string>();
  const [addressRegion, setAddressRegion] = useState<string>();
  const [listOfRegions, setListOfRegions] = useState<IState[] | undefined>();
  const [listOfCities, setListOfCities] = useState<ICity[] | undefined>();
  const [citiesSelected, setCitiesSelected] = useState<string[]>();

  const countryData = Country.getAllCountries();

  useEffect(() => {
    const regionData = State.getStatesOfCountry(addressCountry);
    setListOfRegions(regionData);
  }, [addressCountry]);

  useEffect(() => {
    if (!addressCountry || !addressRegion) return;
    const cityData = City.getCitiesOfState(addressCountry, addressRegion);
    setListOfCities(cityData);
  }, [addressRegion]);

  return (
    <div>
      {/* Select country  */}
      {/* List of cities in the country  */}
      <div className="flex flex-row items-end space-x-3">
        <div className="w-full">
          <label htmlFor="addressCountry" className="text-sm text-gray-600">
            {t("loc_country")}
          </label>

          {/* Display all countries  */}
          <select
            name="addressCountry"
            id="addressCountry"
            className="mt-2 w-full rounded-lg border-transparent bg-gray-100 px-4 py-2 text-base text-gray-700 focus:border-gray-500 focus:bg-white focus:ring-0"
            onChange={(e) => setAddressCountry(e.target.value)}
          >
            {countryData.map((country: ICountry) => (
              <option key={country.isoCode} value={country.isoCode}>
                {country.name}
              </option>
            ))}
          </select>

          {/* Display states of that country  */}
          <label htmlFor="addressRegion" className="text-sm text-gray-600">
            {t("loc_state")}
          </label>

          <select
            name="addressRegion"
            id="addressRegion"
            className="mt-2 w-full rounded-lg border-transparent bg-gray-100 px-4 py-2 text-base text-gray-700 focus:border-gray-500 focus:bg-white focus:ring-0"
            onChange={(e) => setAddressRegion(e.target.value)}
          >
            {listOfRegions?.map((state: IState) => (
              <option key={state.isoCode} value={state.isoCode}>
                {state.name}
              </option>
            ))}
          </select>

          {/* Display selectable table with all cities in the country selected */}
          <label htmlFor="addressCity" className="text-sm text-gray-600">
            {t("loc_city")}
          </label>

          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Select</th>
                <th className="text-left">City</th>
                <th className="text-left">State</th>
                <th className="text-left">Country</th>
              </tr>
            </thead>
            <tbody>
              {listOfCities?.map((city: ICity) => (
                <tr key={city.name}>
                  <td>
                    <input
                      type="checkbox"
                      name="addressCity"
                      id="addressCity"
                      value={city.name}
                    />
                  </td>
                  <td>{city.name}</td>
                  <td>{city.stateCode}</td>
                  <td>{city.countryCode}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 
          {errors.addressCountry?.type === "required" && (
            <DisplayInputError message="errors.input_required" />
          )} */}
        </div>
      </div>
    </div>
  );
}
