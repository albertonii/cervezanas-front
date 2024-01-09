"use client";

import CPGoogleMap from "./CPGoogleMap";
import ListCPMProducts from "./ListCPMProducts";
import useFetchCPFixedPacks from "../../../../../../hooks/useFetchCPFixedPacks";
import React, { ComponentProps, useEffect, useState } from "react";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import {
  ICPFixed,
  ICPMProductsEditCPFixedModal,
  IUser,
} from "../../../../../../lib/types";
import { useAuth } from "../../../../Auth/useAuth";
import Modal from "../../../../components/modals/Modal";
import { DisplayInputError } from "../../../../components/common/DisplayInputError";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { GeocodeResult } from "use-places-autocomplete";
import { cleanObject, isValidObject } from "../../../../../../utils/utils";
import { formatDateDefaultInput } from "../../../../../../utils/formatDate";
import SelectInput from "../../../../components/common/SelectInput";
import InputLabel from "../../../../components/common/InputLabel";
import InputTextarea from "../../../../components/common/InputTextarea";

enum CPFixedStatus {
  active = "active",
  finished = "finished",
  error = "error",
  cancelled = "cancelled",
  paused = "paused",
}

export const cp_fixed_status_options: {
  label: string;
  value: CPFixedStatus;
}[] = [
  { label: "active", value: CPFixedStatus.active },
  { label: "finished", value: CPFixedStatus.finished },
  { label: "error", value: CPFixedStatus.error },
  { label: "cancelled", value: CPFixedStatus.cancelled },
  { label: "paused", value: CPFixedStatus.paused },
];

interface FormData {
  cp_name: string;
  cp_description: string;
  organizer_name: string;
  organizer_lastname: string;
  organizer_email: string;
  organizer_phone: string;
  start_date: any;
  end_date: any;
  address: string;
  status: string;
  is_internal_organizer: boolean;
  product_items: string[];
  geoArgs: GeocodeResult[];
  is_booking_required: boolean;
  maximum_capacity: number;
}

interface Props {
  selectedCP: ICPFixed;
  isEditModal: boolean;
  handleEditModal: ComponentProps<any>;
}

export default function EditCPFixedModal({
  selectedCP,
  isEditModal,
  handleEditModal,
}: Props) {
  const t = useTranslations();
  const { user, supabase } = useAuth();

  const {
    data: packsInProduct,
    refetch,
    isLoading: isFetchLoading,
  } = useFetchCPFixedPacks(selectedCP.id);

  const [productItems, setProductItems] = useState<string[]>([]);

  const [address, setAddress] = useState<string>(selectedCP?.address ?? "");
  const [isInternalOrganizer, setIsInternalOrganizer] = useState<boolean>(true);
  const [addressInputRequired, setAddressInputRequired] =
    useState<boolean>(false);

  const [externalOrganizers, setExternalOrganizers] = useState<IUser[]>([]);
  const [selectedEOrganizer, setSelectedEOrganizer] = useState<string>();

  const [errorOnSelectEOrganizer, setErrorOnSelectEOrganizer] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const getExternalOrganizers = async () => {
    return await supabase
      .from("users")
      .select("id, name, lastname")
      .eq("cp_organizer_status", 1)
      .neq("id", user?.id);
  };

  const query = useQuery({
    queryKey: ["organizers"],
    queryFn: getExternalOrganizers,
    enabled: false,
  });

  const form = useForm<FormData>({
    defaultValues: {
      cp_name: selectedCP?.cp_name,
      cp_description: selectedCP?.cp_description,
      organizer_name: selectedCP?.organizer_name,
      organizer_lastname: selectedCP?.organizer_lastname,
      organizer_email: selectedCP?.organizer_email,
      organizer_phone: selectedCP?.organizer_phone,
      address: selectedCP?.address,
      is_internal_organizer: selectedCP.is_internal_organizer,
      geoArgs: selectedCP?.geoArgs,
      start_date: formatDateDefaultInput(selectedCP?.start_date.toString()),
      end_date: formatDateDefaultInput(selectedCP?.end_date.toString()),
      product_items: productItems,
      status: selectedCP?.status,
      // is_booking_required: selectedCP?.is_booking_required,
    },
  });

  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
  } = form;

  useEffect(() => {
    if (packsInProduct) {
      packsInProduct.map((item: ICPMProductsEditCPFixedModal) => {
        const productPackId: string = item.product_pack_id;
        setProductItems((current) => {
          if (!current.includes(productPackId))
            return [...current, productPackId];
          return current;
        });
      });
    }
  }, [packsInProduct]);

  const handleAddress = (address: string) => {
    setAddress(address);
  };

  const handleIsInternalOrganizer = (e: any) => {
    const value = e.target.value; // esto será un string "true" o "false"
    setIsInternalOrganizer(value === "true");
    setValue("is_internal_organizer", value === "true");

    if (value === "false") {
      const loadExternalOrganizer = async () => {
        const { data } = await query.refetch();
        const externalOrganizers = data?.data as any[];
        setExternalOrganizers(externalOrganizers);
      };

      loadExternalOrganizer();
    }
  };

  // Update CP Fixed in database
  const handleUpdate = async (formValues: FormData) => {
    if (!selectedEOrganizer && !isInternalOrganizer) {
      setErrorOnSelectEOrganizer(true);
      return;
    }

    const {
      cp_name,
      cp_description,
      organizer_name,
      organizer_lastname,
      organizer_email,
      organizer_phone,
      address,
      is_internal_organizer,
      is_booking_required,
      maximum_capacity,
      product_items,
    } = formValues;

    if (!isValidObject(address)) {
      setAddressInputRequired(true);
      return;
    }

    if (selectedCP) {
      const { error } = await supabase
        .from("cp_fixed")
        .update({
          cp_name,
          cp_description,
          organizer_name,
          organizer_lastname,
          organizer_email,
          organizer_phone,
          address,
          is_internal_organizer,
          is_booking_required,
          maximum_capacity,
        })
        .eq("id", selectedCP.id);

      if (error) throw error;

      const { error: errorDelete } = await supabase
        .from("cpf_products")
        .delete()
        .eq("cp_id", selectedCP.id);

      if (errorDelete) throw errorDelete;

      // Insert product items in cpm_products table
      const pItemsFiltered = cleanObject(product_items);

      if (pItemsFiltered) {
        // Convert pItemsFiltered JSON objects to array
        const pItemsFilteredArray = Object.values(pItemsFiltered);

        const cpFixedId = selectedCP.id;

        // Link the pack with the consumption Point
        pItemsFilteredArray.map(async (pack: any) => {
          // TODO: Desde el register de accordionItem se introduce un product pack como string/json o como array de objetos. Habría que normalizar la información
          if (typeof pack.id === "object") {
            pack.id.map(async (packId: string) => {
              const { error } = await supabase.from("cpf_products").insert({
                cp_id: cpFixedId,
                product_pack_id: packId,
              });

              if (error) {
                throw error;
              }
            });
          } else {
            const { error } = await supabase.from("cpf_products").insert({
              cp_id: cpFixedId,
              product_pack_id: pack.id,
            });

            if (error) {
              throw error;
            }
          }
        });

        refetch();
      }
    }
  };

  const updateCPFixedMutation = useMutation({
    mutationKey: ["updateCPFixed"],
    mutationFn: handleUpdate,
    onMutate: () => {
      setIsSubmitting(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cpFixed"] });
      setIsSubmitting(false);
      handleEditModal(false);
    },
    onError: (e: any) => {
      console.error(e);
      setIsSubmitting(false);
    },
  });

  const onSubmit = (formValues: FormData) => {
    try {
      updateCPFixedMutation.mutate(formValues);
    } catch (e) {
      console.error(e);
    }
  };

  if (isFetchLoading) return <></>;

  return (
    <Modal
      showBtn={false}
      showModal={isEditModal}
      setShowModal={handleEditModal}
      title={t("edit_cp_fixed_config")}
      btnTitle={t("edit_cp_fixed_config")}
      description={""}
      icon={faAdd}
      handler={handleSubmit(onSubmit)}
      handlerClose={() => {
        handleEditModal(false);
      }}
      btnSize={"large"}
      classIcon={"w-6 h-6"}
      classContainer={""}
    >
      <form>
        <fieldset className="grid grid-cols-1 gap-2 rounded-md border-2 border-beer-softBlondeBubble p-4">
          <legend className="m-2 text-2xl">{t("cp_fixed_info")}</legend>

          {/* Status */}
          <SelectInput
            form={form}
            labelTooltip={"cp_fixed_status_tooltip"}
            options={cp_fixed_status_options}
            label={"status"}
            registerOptions={{
              required: true,
            }}
          />

          {/* Event name  */}
          <InputLabel
            form={form}
            label={"cp_name"}
            registerOptions={{
              required: true,
            }}
          />

          {/* Event description  */}
          <InputTextarea
            form={form}
            label={"cp_description"}
            labelText={t("description")}
            registerOptions={{
              required: true,
            }}
          />

          {errors.cp_description && (
            <DisplayInputError message="errors.input_required" />
          )}

          {/* Start date and end date  */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <InputLabel
              form={form}
              label={"start_date"}
              registerOptions={{
                required: true,
              }}
              inputType="date"
            />

            <InputLabel
              form={form}
              label={"end_date"}
              registerOptions={{
                required: true,
              }}
              inputType="date"
            />
          </div>
        </fieldset>

        {/* Organizer Information  */}
        <fieldset className="mt-12 space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
          <legend className="text-2xl">{t("organizer_info")}</legend>

          {/* Is internal organizer value  */}
          <div className="flex flex-row space-x-2">
            <div className="flex w-full flex-col">
              <label htmlFor="is_internal_organizer">
                {t("is_internal_organizer")}
              </label>

              <select
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                id="is_internal_organizer"
                {...register("is_internal_organizer", { required: true })}
                onChange={(e) => {
                  handleIsInternalOrganizer(e);
                }}
              >
                <option value="true">{t("yes")}</option>
                <option value="false">{t("no")}</option>
              </select>

              {errors.is_internal_organizer && (
                <DisplayInputError message="errors.input_required" />
              )}
            </div>
          </div>

          {/* In case organizer is internal from company*/}
          {isInternalOrganizer && (
            <>
              {/* Organizer name and lastname  */}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <InputLabel
                  form={form}
                  label={"organizer_name"}
                  labelText={t("name")}
                  registerOptions={{
                    required: true,
                  }}
                />

                <InputLabel
                  form={form}
                  label={"organizer_lastname"}
                  labelText={t("lastname")}
                  registerOptions={{
                    required: true,
                  }}
                />
              </div>

              {/* Email and phone  */}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <InputLabel
                  form={form}
                  label={"organizer_email"}
                  labelText={t("email")}
                  registerOptions={{
                    required: true,
                  }}
                  inputType="email"
                />

                <InputLabel
                  form={form}
                  label={"organizer_phone"}
                  labelText={t("phone")}
                  registerOptions={{
                    required: true,
                  }}
                />
              </div>
            </>
          )}

          {/* In case organizer is external from company*/}
          {!isInternalOrganizer && (
            <>
              <div className="flex w-full flex-col">
                <span className="mb-2 mt-2">
                  Selecciona del listado de abajo el organizador externo
                  responsable de este evento. Una vez creado el evento
                  enviaremos una confirmación al organizador externo para que
                  pueda gestionar el evento y acepta los términos y condiciones
                  de uso de la plataforma. Dicho evento tendrá el estado
                  `Pendiente de confirmación` hasta que el organizador externo
                  acepte los términos y condiciones.
                </span>

                <select
                  className="text-md rounded-md border-2 border-beer-softBlondeBubble bg-beer-softFoam px-2 py-1 focus:border-beer-blonde focus:outline-none "
                  id="is_external_organizer"
                  onClick={(e: any) => {
                    const value = e.target.value;
                    setSelectedEOrganizer(value);
                  }}
                >
                  {externalOrganizers &&
                    externalOrganizers.map((organizer: any) => (
                      <option
                        key={organizer.id}
                        value={organizer.id}
                        onSelect={() => {
                          setSelectedEOrganizer(organizer);
                          setErrorOnSelectEOrganizer(false);
                        }}
                      >
                        {organizer.name} {organizer.lastname}
                      </option>
                    ))}
                </select>

                {errorOnSelectEOrganizer && (
                  <DisplayInputError message="errors.input_required" />
                )}
              </div>
            </>
          )}
        </fieldset>

        <fieldset className="mt-12 space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
          <legend className="text-2xl">{t("cp_fixed_location")}</legend>

          {addressInputRequired && (
            <span className="text-red-500">{t("errors.input_required")}</span>
          )}

          {/* Address  */}
          <CPGoogleMap
            handleAddress={handleAddress}
            defaultLocation={address}
            defaultGeoArgs={selectedCP.geoArgs}
          />
        </fieldset>

        <fieldset className="mt-4 flex flex-col space-y-4">
          <legend className="text-2xl">{t("cp_fixed_products")}</legend>

          {/* List of selectable products that the owner can use */}
          <ListCPMProducts form={form} productItems={productItems} />
        </fieldset>
      </form>
    </Modal>
  );
}
