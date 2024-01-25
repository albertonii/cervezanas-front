import useSWRMutation from "swr/mutation";
import { useTranslations } from "next-intl";
import { DisplayInputError } from "./common/DisplayInputError";
import React, { ComponentProps, useEffect, useState } from "react";
import InputLabel from "./common/InputLabel";

interface Props {
  form: ComponentProps<any>;
  addressNameId: string;
}

const fetcher = (arg: any, ...args: any) =>
  fetch(arg, ...args).then((res) => res.json());

export default function AddressForm({ form, addressNameId }: Props) {
  const t = useTranslations();

  const [selectedCountry, setSelectCountry] = useState<string>();
  const [subRegionType, setSubRegionType] = useState<string>();
  const [subRegions, setSubRegions] = useState<string[]>([]);

  const {
    data,
    trigger,
    error: apiCallError,
  } = useSWRMutation(
    `/api/country?name=${selectedCountry}&fileName=${subRegionType}`,
    fetcher
  );

  const {
    formState: { errors },
    register,
  } = form;

  useEffect(() => {
    if (!selectedCountry) return;

    switch (selectedCountry) {
      case "spain":
        setSubRegionType("provinces");
        break;
      case "italy":
        setSubRegionType("provinces");
        break;
      case "france":
        setSubRegionType("departments");
        break;
      default:
        setSubRegionType("provinces");
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (!subRegionType) return;
    trigger();
  }, [subRegionType]);

  useEffect(() => {
    if (!data) return;
    setSubRegions(data);
  }, [data]);

  const handleSelectCountry = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectCountry(e.target.value);
  };

  return (
    <form className="w-full">
      {/* Address Information */}
      <fieldset className="mb-3 space-y-4 rounded bg-beer-foam">
        <div className="w-full space-y-2">
          <h2 className="my-2 text-lg font-semibold tracking-wide text-gray-700">
            {t(`${addressNameId}_data`)}
          </h2>

          <InputLabel
            form={form}
            label={"name"}
            registerOptions={{
              required: true,
            }}
          />

          <InputLabel
            form={form}
            label={"lastname"}
            registerOptions={{
              required: true,
            }}
          />

          <InputLabel
            form={form}
            label={"document_id"}
            registerOptions={{
              required: true,
            }}
          />

          <InputLabel
            form={form}
            label={"phone"}
            registerOptions={{
              required: true,
            }}
            inputType={"tel"}
          />
        </div>

        <div className="w-full space-y-2">
          <h2 className="my-2 text-lg font-semibold tracking-wide text-gray-700">
            {/* {t("shipping_address")} */}
            {t(`${addressNameId}_address`)}
          </h2>

          {/* <AutocompletePlaces /> */}

          <InputLabel
            form={form}
            label={"address"}
            registerOptions={{
              required: true,
            }}
          />

          <InputLabel
            form={form}
            label={"address_extra"}
            registerOptions={{
              required: false,
            }}
          />

          <InputLabel
            form={form}
            label={"address_observations"}
            registerOptions={{
              required: false,
            }}
            placeholder={`${t("address_observations")}*`}
          />

          {apiCallError && (
            <DisplayInputError message={errors.address_observations.message} />
          )}

          <div className="flex gap-4">
            <label className="my-3 flex h-12 w-1/2 items-center rounded border border-bear-alvine py-3">
              {/* Display all countries */}
              <select
                className=" w-full rounded-lg border-transparent bg-gray-100 px-4 py-2 text-base text-gray-700 focus:border-gray-500 focus:bg-white focus:ring-0"
                {...register("country", { required: true })}
                onChange={(e) => {
                  handleSelectCountry(e);
                }}
              >
                <option key={"ES"} value={"spain"}>
                  {t("spain")}
                </option>
                <option key={"IT"} value={"italy"} selected>
                  {t("italy")}
                </option>
                <option key={"FR"} value={"france"}>
                  {t("france")}
                </option>
              </select>

              {errors.country && (
                <DisplayInputError message={errors.country.message} />
              )}
            </label>

            <label className="my-3 flex h-12 w-1/2 items-center rounded border border-bear-alvine py-3">
              <select
                className=" w-full rounded-lg border-transparent bg-gray-100 px-4 py-2 text-base text-gray-700 focus:border-gray-500 focus:bg-white focus:ring-0"
                {...register("state", { required: true })}
                disabled={!subRegions || subRegions.length === 0}
              >
                {subRegions &&
                  subRegions.map((subRegion: any) => (
                    <option key={subRegion.id} value={subRegion.name}>
                      {subRegion.name}
                    </option>
                  ))}
              </select>

              {errors.state && (
                <DisplayInputError message={errors.state.message} />
              )}
            </label>
          </div>

          <div className="flex gap-4">
            <InputLabel
              form={form}
              label={"zipcode"}
              registerOptions={{
                required: true,
              }}
              placeholder={`${t("loc_pc")}`}
              disabled={!subRegions || subRegions.length === 0}
            />

            <InputLabel
              form={form}
              label={"city"}
              registerOptions={{
                required: true,
              }}
              placeholder={`${t("loc_town")}`}
              disabled={!subRegions || subRegions.length === 0}
            />
          </div>
        </div>

        <div className="flex items-end">
          <div className="w-auto">
            <InputLabel
              form={form}
              label={"is_default"}
              registerOptions={{
                required: true,
              }}
              inputType={"checkbox"}
            />
          </div>

          <p className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            {t(`${addressNameId}_checkbox`)}
          </p>
        </div>
      </fieldset>
    </form>
  );
}
