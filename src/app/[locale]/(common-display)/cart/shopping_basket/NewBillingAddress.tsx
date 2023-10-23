"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useAuth } from "../../../Auth/useAuth";
import { Modal } from "../../../components/modals/Modal";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { useMutation, useQueryClient } from "react-query";
import { IModalBillingAddress } from "../../../../../lib/types.d";
import { useSupabase } from "../../../../../context/SupabaseProvider";
import { DisplayInputError } from "../../../components/common/DisplayInputError";

export function NewBillingAddress() {
  const t = useTranslations();
  const { supabase } = useSupabase();

  const { user } = useAuth();

  const [showModal, setShowModal] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<IModalBillingAddress>();

  const handleAddBillingAddress = async (formValues: IModalBillingAddress) => {
    const {
      name,
      lastname,
      document_id,
      phone,
      address,
      country,
      state,
      city,
      zipcode,
      is_default,
    } = formValues;

    const { error } = await supabase.from("billing_info").insert({
      owner_id: user?.id,
      name,
      lastname,
      document_id,
      phone,
      address,
      country,
      zipcode,
      city,
      state,
      is_default,
    });

    if (error) throw error;
    setShowModal(false);
  };

  const insertBillingMutation = useMutation({
    mutationKey: ["insertBilling"],
    mutationFn: handleAddBillingAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billingAddresses"] });
      setShowModal(false);
      reset();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmit = (formValues: IModalBillingAddress) => {
    try {
      insertBillingMutation.mutate(formValues);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal
      showBtn={true}
      showModal={showModal}
      setShowModal={setShowModal}
      title={t("add_billing_address")}
      btnTitle={t("add_billing_address")}
      description={""}
      icon={faAdd}
      handler={handleSubmit(onSubmit)}
      classIcon={"w-6 h-6"}
      classContainer={"!w-1/2"}
      btnSize={"large"}
    >
      <form id="billing-info-form" className="w-full">
        {/* Billing information */}
        <section>
          <fieldset className="mb-3 rounded bg-beer-foam">
            {/* Billing Data */}
            <div className="w-full">
              <h2 className="my-2 text-lg font-semibold tracking-wide text-gray-700">
                {t("billing_data")}
              </h2>

              <label className="my-3 flex h-12 items-center rounded border border-bear-alvine py-3">
                <input
                  {...register("name", { required: true })}
                  className="mr-6 w-full px-3 focus:outline-none"
                  placeholder={`${t("name")}*`}
                  required
                />
                {errors.name?.type === "required" && (
                  <DisplayInputError message="errors.input_required" />
                )}
              </label>

              <label className="my-3 flex h-12 items-center rounded border border-bear-alvine py-3">
                <input
                  {...register("lastname", { required: true })}
                  className="mr-6 w-full px-3 focus:outline-none"
                  placeholder={`${t("lastname")}*`}
                  required
                />
                {errors.lastname?.type === "required" && (
                  <DisplayInputError message="errors.input_required" />
                )}
              </label>

              <label className="my-3 flex h-12 items-center rounded border border-bear-alvine py-3">
                <input
                  {...register("document_id", { required: true })}
                  className="mr-6 w-full px-3 focus:outline-none"
                  placeholder={`${t("document_id")}*`}
                />
                {errors.document_id?.type === "required" && (
                  <DisplayInputError message="errors.input_required" />
                )}
              </label>

              <label className="my-3 flex h-12 items-center rounded border border-bear-alvine py-3">
                <input
                  {...register("phone", { required: true })}
                  type="tel"
                  className="mr-6 w-full px-3 focus:outline-none"
                  placeholder={`${t("loc_phone")}*`}
                />
                {errors.phone?.type === "required" && (
                  <DisplayInputError message="errors.input_required" />
                )}
              </label>
            </div>

            {/* Billing Address */}
            <div className="mt-6 w-full">
              <h2 className="my-2 text-lg font-semibold tracking-wide text-gray-700">
                {t("billing_address")}
              </h2>

              <label className="my-3 flex h-12 items-center rounded border border-bear-alvine py-3">
                <input
                  {...register("address", { required: true })}
                  className="mr-6 w-full px-3 focus:outline-none"
                  placeholder={`${t("address")}*`}
                />
                {errors.address?.type === "required" && (
                  <DisplayInputError message="errors.input_required" />
                )}
              </label>

              <label className="my-3 flex h-12 items-center rounded border border-bear-alvine py-3">
                <input
                  {...register("country", { required: true })}
                  className="mr-6 w-full px-3 focus:outline-none"
                  placeholder={`${t("country")}*`}
                />
                {errors.country?.type === "required" && (
                  <DisplayInputError message="errors.input_required" />
                )}
              </label>

              <label className="my-3 flex h-12 items-center rounded border border-bear-alvine py-3">
                <input
                  {...register("zipcode", { required: true })}
                  className="mr-6 w-full px-3 focus:outline-none"
                  placeholder={`${t("loc_pc")}*`}
                />
                {errors.zipcode?.type === "required" && (
                  <DisplayInputError message="errors.input_required" />
                )}
              </label>

              <label className="my-3 flex h-12 items-center rounded border border-bear-alvine py-3">
                <input
                  {...register("city", { required: true })}
                  className="mr-6 w-full px-3 focus:outline-none"
                  placeholder={`${t("loc_town")}*`}
                />
                {errors.city?.type === "required" && (
                  <DisplayInputError message="errors.input_required" />
                )}
              </label>

              <label className="my-3 flex h-12 items-center rounded border border-bear-alvine py-3">
                <input
                  {...register("state", { required: true })}
                  className="mr-6 w-full px-3 focus:outline-none"
                  placeholder={`${t("loc_province")}*`}
                />
                {errors.state?.type === "required" && (
                  <DisplayInputError message="errors.input_required" />
                )}
              </label>
            </div>

            <div className="flex items-center">
              <input
                {...register("is_default", { required: false })}
                id="billing-checked-checkbox"
                type="checkbox"
                value=""
                className="h-4 w-4 rounded border-bear-light bg-beer-softBlonde text-beer-blonde focus:ring-2 focus:ring-bear-alvine dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-beer-softBlonde"
              />
              <label
                htmlFor="billing-checked-checkbox"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                {t("billing_checkbox")}
              </label>
            </div>
          </fieldset>
        </section>
      </form>
    </Modal>
  );
}
