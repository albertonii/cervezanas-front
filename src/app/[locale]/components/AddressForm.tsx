import useSWRMutation from "swr/mutation";
import { useTranslations } from "next-intl";
import { DisplayInputError } from "./common/DisplayInputError";
import React, { ComponentProps, useEffect, useState } from "react";

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

  const { data, trigger, error } = useSWRMutation(
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

  if (error) return <div>failed to load</div>;

  return (
    <form className="w-full">
      {/* Address Information */}
      <fieldset className="mb-3 rounded bg-beer-foam">
        <div className="w-full">
          <h2 className="my-2 text-lg font-semibold tracking-wide text-gray-700">
            {t(`${addressNameId}_data`)}
          </h2>

          <label className="my-3 flex h-12 items-center rounded border border-bear-alvine py-3">
            <input
              {...register("name", { required: true })}
              className="mr-6 w-full px-3 focus:outline-none"
              placeholder={`${t("name")}`}
              required
            />
            {errors.name && <DisplayInputError message={errors.name.message} />}
          </label>

          <label className="my-3 flex h-12 items-center rounded border border-bear-alvine py-3">
            <input
              {...register("lastname", { required: true })}
              className="mr-6 w-full px-3 focus:outline-none"
              placeholder={`${t("lastname")}`}
              required
            />
            {errors.lastname && (
              <DisplayInputError message={errors.lastname.message} />
            )}
          </label>

          <label className="my-3 flex h-12 items-center rounded border border-bear-alvine py-3">
            <input
              {...register("document_id", { required: true })}
              className="mr-6 w-full px-3 focus:outline-none"
              placeholder={`${t("document_id")}`}
            />
            {errors.document_id && (
              <DisplayInputError message={errors.document_id.message} />
            )}
          </label>

          <label className="my-3 flex h-12 items-center rounded border border-bear-alvine py-3">
            <input
              {...register("phone", { required: true })}
              type="tel"
              className="mr-6 w-full border-none px-3 focus:outline-none"
              placeholder={`${t("loc_phone")}`}
            />

            {errors.phone && (
              <DisplayInputError message={errors.phone.message} />
            )}
          </label>
        </div>

        <div className="mt-6 w-full">
          <h2 className="my-2 text-lg font-semibold tracking-wide text-gray-700">
            {/* {t("shipping_address")} */}
            {t(`${addressNameId}_address`)}
          </h2>

          {/* <AutocompletePlaces /> */}

          <label className="my-3 flex h-12 items-center rounded border border-bear-alvine py-3">
            <input
              {...register("address", { required: true })}
              className="mr-6 w-full px-3 focus:outline-none"
              placeholder={`${t("address")}`}
            />
            {errors.address && (
              <DisplayInputError message={errors.address.message} />
            )}
          </label>

          <label className="my-3 flex h-12 items-center rounded border border-bear-alvine py-3">
            <input
              {...register("address_extra", { required: false })}
              className="mr-6 w-full px-3 focus:outline-none"
              placeholder={`${t("address")} 2*`}
            />
            {errors.address_extra && (
              <DisplayInputError message={errors.address_extra.message} />
            )}
          </label>

          <label className="my-3 flex h-12 items-center rounded border border-bear-alvine py-3">
            <input
              {...register("address_observations", { required: false })}
              className="mr-6 w-full px-3 focus:outline-none"
              placeholder={`${t("address_observations")}*`}
            />
            {errors.address_observations && (
              <DisplayInputError
                message={errors.address_observations.message}
              />
            )}
          </label>

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
            <label
              className={`my-3 flex h-12 w-1/3 items-center rounded border border-bear-alvine py-3 ${
                !subRegions || (subRegions.length === 0 && "bg-gray-100")
              }`}
            >
              <input
                {...register("zipcode", { required: true })}
                className="mr-6 w-full px-3 focus:outline-none"
                placeholder={`${t("loc_pc")}`}
                disabled={!subRegions || subRegions.length === 0}
              />
              {errors.zipcode && (
                <DisplayInputError message={errors.zipcode.message} />
              )}
            </label>

            <label
              className={`my-3 flex h-12 w-2/3 items-center rounded border border-bear-alvine py-3 ${
                !subRegions || (subRegions.length === 0 && "bg-gray-100")
              }`}
            >
              <input
                {...register("city", { required: true })}
                className="mr-6 w-full px-3 focus:outline-none"
                placeholder={`${t("loc_town")}`}
                disabled={!subRegions || subRegions.length === 0}
              />
              {errors.city && (
                <DisplayInputError message={errors.city.message} />
              )}
            </label>
          </div>
        </div>

        <div className="flex items-center">
          <input
            {...register("is_default", { required: false })}
            id={`${addressNameId}-checked-checkbox`}
            type="checkbox"
            value=""
            className="h-4 w-4 rounded border-bear-light bg-beer-softBlonde text-beer-blonde focus:ring-2 focus:ring-bear-alvine dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-beer-softBlonde"
          />
          <label
            htmlFor={`${addressNameId}-checked-checkbox`}
            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            {/* {t("shipping_checkbox")} */}
            {t(`${addressNameId}_checkbox`)}
          </label>
        </div>
      </fieldset>
    </form>
  );
}
