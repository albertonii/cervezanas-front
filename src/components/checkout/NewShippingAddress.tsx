import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Modal from "../modals/Modal";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "../../utils/supabaseClient";
import { useAuth } from "../Auth";
import { ShippingAddress } from "../../lib/interfaces";

interface FormData {
  name: string;
  lastname: string;
  document_id: string;
  phone: string;
  address: string;
  address_extra: string;
  address_observations: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  shipping_checked: boolean;
}

interface Props {
  shipping: ShippingAddress[];
  handleShippingAddresses: React.Dispatch<
    React.SetStateAction<ShippingAddress[]>
  >;
}

export default function NewShippingAddress({
  shipping,
  handleShippingAddresses,
}: Props) {
  const { t } = useTranslation();

  const { user } = useAuth();

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<FormData>();

  const onSubmit = async (formValues: FormData) => {
    const {
      name,
      lastname,
      document_id,
      phone,
      address,
      address_extra,
      address_observations,
      country,
      state,
      city,
      zipcode,
      shipping_checked,
    } = formValues;

    const handleAddShippingAddress = async () => {
      const { data, error } = await supabase.from("shipping_info").insert({
        owner_id: user!.id,
        name,
        lastname,
        document_id,
        phone,
        address,
        address_extra,
        address_observations,
        country,
        zipcode,
        city,
        state,
        is_default: shipping_checked,
      });

      if (error) throw error;

      handleShippingAddresses((prev) => [...prev, data[0]]);

      reset();
    };

    handleAddShippingAddress();
  };

  return (
    <Modal
      isVisible={false}
      title={t("add_shipping_address")}
      btnTitle={t("add_shipping_address")}
      description={""}
      icon={faAdd}
      handler={handleSubmit(onSubmit)}
      btnSize={"large"}
      classIcon={"w-6 h-6"}
      classContainer={"!w-1/2"}
    >
      <form className="w-full">
        <>
          {/* Shipping information */}
          <section>
            <fieldset className="mb-3 bg-beer-foam rounded">
              {/* Shipping Data */}
              <div className="w-full">
                <h2 className="tracking-wide text-lg font-semibold text-gray-700 my-2">
                  {t("shipping_data")}
                </h2>

                <label className="flex border border-bear-alvine rounded h-12 py-3 my-3 items-center">
                  <input
                    {...register("name", { required: true })}
                    className="focus:outline-none px-3 w-full mr-6"
                    placeholder={`${t("name")}*`}
                    required
                  />
                  {errors.name?.type === "required" && (
                    <p>{t("input_required")}</p>
                  )}
                </label>

                <label className="flex border border-bear-alvine rounded h-12 py-3 my-3 items-center">
                  <input
                    {...register("lastname", { required: true })}
                    className="focus:outline-none px-3 w-full mr-6"
                    placeholder={`${t("lastname")}*`}
                    required
                  />
                  {errors.lastname?.type === "required" && (
                    <p>{t("input_required")}</p>
                  )}
                </label>

                <label className="flex border border-bear-alvine rounded h-12 py-3 my-3 items-center">
                  <input
                    {...register("document_id", { required: true })}
                    className="focus:outline-none px-3 w-full mr-6"
                    placeholder={`${t("document_id")}*`}
                  />
                  {errors.document_id?.type === "required" && (
                    <p>{t("input_required")}</p>
                  )}
                </label>

                <label className="flex border border-bear-alvine rounded h-12 py-3 my-3 items-center">
                  <input
                    {...register("phone", { required: true })}
                    type="tel"
                    className="focus:outline-none px-3 w-full mr-6 border-none"
                    placeholder={`${t("loc_phone")}*`}
                  />
                  {errors.phone?.type === "required" && (
                    <p>{t("input_required")}</p>
                  )}
                </label>
              </div>

              {/* Shipping Address */}
              <div className="w-full mt-6">
                <h2 className="tracking-wide text-lg font-semibold text-gray-700 my-2">
                  {t("shipping_address")}
                </h2>

                <label className="flex border border-bear-alvine rounded h-12 py-3 my-3 items-center">
                  <input
                    {...register("address", { required: true })}
                    className="focus:outline-none px-3 w-full mr-6"
                    placeholder={`${t("address")}*`}
                  />
                  {errors.address?.type === "required" && (
                    <p>{t("input_required")}</p>
                  )}
                </label>

                <label className="flex border border-bear-alvine rounded h-12 py-3 my-3 items-center">
                  <input
                    {...register("address_extra", { required: false })}
                    className="focus:outline-none px-3 w-full mr-6"
                    placeholder={`${t("address")} 2*`}
                  />
                  {errors.address_extra?.type === "required" && (
                    <p>{t("input_required")}</p>
                  )}
                </label>

                <label className="flex border border-bear-alvine rounded h-12 py-3 my-3 items-center">
                  <input
                    {...register("address_observations", { required: false })}
                    className="focus:outline-none px-3 w-full mr-6"
                    placeholder={`${t("address_observations")}*`}
                  />
                  {errors.address_observations?.type === "required" && (
                    <p>{t("input_required")}</p>
                  )}
                </label>

                <label className="flex border border-bear-alvine rounded h-12 py-3 my-3 items-center">
                  <input
                    {...register("country", { required: true })}
                    className="focus:outline-none px-3 w-full mr-6"
                    placeholder={`${t("country")}*`}
                  />
                  {errors.country?.type === "required" && (
                    <p>{t("input_required")}</p>
                  )}
                </label>

                <label className="flex border border-bear-alvine rounded h-12 py-3 my-3 items-center">
                  <input
                    {...register("zipcode", { required: true })}
                    className="focus:outline-none px-3 w-full mr-6"
                    placeholder={`${t("loc_pc")}*`}
                  />
                  {errors.zipcode?.type === "required" && (
                    <p>{t("input_required")}</p>
                  )}
                </label>

                <label className="flex border border-bear-alvine rounded h-12 py-3 my-3 items-center">
                  <input
                    {...register("city", { required: true })}
                    className="focus:outline-none px-3 w-full mr-6"
                    placeholder={`${t("loc_town")}*`}
                  />
                  {errors.city?.type === "required" && (
                    <p>{t("input_required")}</p>
                  )}
                </label>

                <label className="flex border border-bear-alvine rounded h-12 py-3 my-3 items-center">
                  <input
                    {...register("state", { required: true })}
                    className="focus:outline-none px-3 w-full mr-6"
                    placeholder={`${t("loc_province")}*`}
                  />
                  {errors.state?.type === "required" && (
                    <p>{t("input_required")}</p>
                  )}
                </label>
              </div>

              <div className="flex items-center">
                <input
                  {...register("shipping_checked", { required: false })}
                  id="shipping-checked-checkbox"
                  type="checkbox"
                  value=""
                  className="w-4 h-4 text-beer-blonde bg-beer-softBlonde border-bear-light rounded focus:ring-bear-alvine dark:focus:ring-beer-softBlonde dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="shipping-checked-checkbox"
                  className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  {t("shipping_checkbox")}
                </label>
              </div>
            </fieldset>
          </section>
        </>
      </form>
    </Modal>
  );
}