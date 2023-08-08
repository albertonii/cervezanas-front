import Label from "../../../../components/Label";
import enLocale from "i18n-iso-countries/langs/en.json";
import esLocale from "i18n-iso-countries/langs/es.json";
import countries from "i18n-iso-countries";
import PCRanges from "./PCRanges";
import React, { useEffect, useState } from "react";
import { CountryDropdown } from "react-country-region-selector";
import { useTranslations } from "next-intl";
import { Button } from "../../../../../../components/common";
import { useFieldArray, useForm } from "react-hook-form";
import { IPCRangesProps } from "../../../../../../lib/types";

type LocalDistributionProps = {
  country: string;
  ranges: IPCRangesProps[];
};

export default function LocalDistribution() {
  const t = useTranslations();
  const [countryOption, setCountryOption] = useState<any>("ES");

  const [displayCountry, setDisplayCountry] = useState(
    esLocale.countries["ES"]
  );

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm({
    defaultValues: {
      country: countryOption,
      ranges: [{ from: 35000, to: 35999 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "ranges",
    control,
  });

  useEffect(() => {
    countries.registerLocale(enLocale);
    countries.registerLocale(esLocale);
  }, []);

  useEffect(() => {
    setDisplayCountry(countries.getName(countryOption, "es"));
  }, [countryOption]);

  const handleSelectCountry = (e: string) => {
    setCountryOption(e);
  };

  return (
    <>
      {/* Country  */}
      <div>
        <span>{displayCountry}</span>
        <Label>
          <CountryDropdown
            classes="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
            value={countryOption}
            defaultOptionLabel="Select a country"
            onChange={(val) => handleSelectCountry(val)}
            valueType="short"
            labelType="full"
            priorityOptions={["ES"]}
          />
        </Label>
      </div>

      {/* Ranges  */}
      <div>
        <div>
          <span>Ranges</span>

          {fields.map((item, index) => {
            return (
              <div key={item.id} className="grid grid-cols-2">
                <PCRanges register={register} item={item} index={index} />
              </div>
            );
          })}

          <Button
            btnType="button"
            class="mt-4"
            primary
            medium
            onClick={() => append({ from: 35000, to: 35999 })}
          >
            {t("add_range")}
          </Button>
        </div>

        <Button btnType="submit" class="" primary medium>
          {t("save")}
        </Button>
      </div>
    </>
  );
}
