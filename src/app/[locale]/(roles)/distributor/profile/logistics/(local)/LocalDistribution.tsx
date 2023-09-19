import PCRanges from "./PCRanges";
import Label from "../../../../../components/Label";
import enLocale from "i18n-iso-countries/langs/en.json";
import esLocale from "i18n-iso-countries/langs/es.json";
import countries from "i18n-iso-countries";
import React, { useEffect, useState } from "react";
import { CountryDropdown } from "react-country-region-selector";
import { useTranslations } from "next-intl";
import { Button } from "../../../../../components/common/Button";
import { IconButton } from "../../../../../components/common/IconButton";
import { useFieldArray, useForm } from "react-hook-form";
import { ILocal, IPCRangesProps } from "../../../../../../../lib/types.d";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useSupabase } from "../../../../../../../context/SupabaseProvider";
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

  const defaultRanges = locals.map((local) => {
    return {
      from: local.from,
      to: local.to,
    };
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm({
    defaultValues: {
      country: countryOption,
      ranges: defaultRanges,
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

    // Delete all ranges in local distribution
    const { error: errorDelete } = await supabase
      .from("local_distribution")
      .delete()
      .eq("coverage_area_id", "5804f470-2710-4ee4-93f5-51940f5a004a");

    if (errorDelete) {
      console.error(errorDelete);
    }

    // Insert new ranges
    ranges.map(async (range) => {
      const { error: errorLocal } = await supabase
        .from("local_distribution")
        .insert({
          country,
          from: range.from,
          to: range.to,
          coverage_area_id: "5804f470-2710-4ee4-93f5-51940f5a004a",
        })
        .eq("from", range.from)
        .select();

      if (errorLocal) {
        console.error(errorLocal);
      }
    });
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
      console.error("onError");
    },
  });

  const onSubmit = (formValues: FormData) => {
    try {
      updateLocalDistributionMutation.mutate(formValues);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Button btnType="submit" class="" primary medium>
          {t("save")}
        </Button>

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
          {/* <LocalMap locals={locals} /> */}
        </div>
      </form>
    </section>
  );
}
