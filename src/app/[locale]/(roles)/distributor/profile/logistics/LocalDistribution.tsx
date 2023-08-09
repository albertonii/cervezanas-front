import Label from "../../../../components/Label";
import enLocale from "i18n-iso-countries/langs/en.json";
import esLocale from "i18n-iso-countries/langs/es.json";
import countries from "i18n-iso-countries";
import PCRanges from "./PCRanges";
import React, { useEffect, useState } from "react";
import { CountryDropdown } from "react-country-region-selector";
import { useTranslations } from "next-intl";
import { Button, IconButton } from "../../../../../../components/common";
import { useFieldArray, useForm } from "react-hook-form";
import { ILocal, IPCRangesProps } from "../../../../../../lib/types";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import LogisticMap from "./LogisticMap";
import { useSupabase } from "../../../../../../components/Context/SupabaseProvider";
import { useMutation, useQueryClient } from "react-query";

interface FormData {
  country: string;
  ranges: IPCRangesProps[];
}

type LocalDistributionProps = {
  localDistribution: ILocal[];
};

export default function LocalDistribution({
  localDistribution: locals,
}: LocalDistributionProps) {
  const t = useTranslations();
  const [countryOption, setCountryOption] = useState<any>("ES");
  const queryClient = useQueryClient();

  const { supabase } = useSupabase();

  const [displayCountry, setDisplayCountry] = useState(
    esLocale.countries["ES"]
  );
  console.log(locals);
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

  const handleUpdateLocalDistribution = async (form: FormData) => {
    const { country, ranges } = form;

    const { data, error } = await supabase
      .from("local_distribution")
      .update({
        country,
        ranges,
        coverage_area_id: "5804f470-2710-4ee4-93f5-51940f5a004a",
      })
      .select();

    if (error) {
      console.error(error);
    }
  };

  const updateLocalDistributionMutation = useMutation({
    mutationKey: "updateLocalDistribution",
    mutationFn: handleUpdateLocalDistribution,
    onMutate: () => {
      console.log("onMutate");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["distribution"] });
      console.log("onSuccess");
    },
    onError: () => {
      console.log("onError");
    },
  });

  return (
    <section>
      <form>
        {/* Country  */}
        <div className="w-60">
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
        <div className="space-y-2">
          <div className="space-y-2">
            <div className="items-center space-y-2">
              <span>Ranges</span>

              {fields.map((item, index) => {
                return (
                  <div
                    key={item.id}
                    className="grid w-full grid-cols-2 space-x-4 rounded-md border-2 border-beer-gold p-4"
                  >
                    <PCRanges register={register} item={item} index={index} />
                    {/* Delete range  */}
                    <IconButton
                      btnType="button"
                      danger
                      box
                      onClick={() => remove(index)}
                      icon={faTrash}
                      title={"Delete"}
                    />
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
          </div>

          {/* Map displaying ranges */}
          <LogisticMap locals={locals} />

          <Button btnType="submit" class="" primary medium>
            {t("save")}
          </Button>
        </div>
      </form>
    </section>
  );
}
