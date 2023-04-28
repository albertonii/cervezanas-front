import CPGoogleMap from "./CPGoogleMap";
import ListCPFixed from "./ListCPFixed";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { supabase } from "../../../utils/supabaseClient";
import { Modal } from "../../modals";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { ICPFixed } from "../../../lib/types.d";
import { getGeocode } from "use-places-autocomplete";
import { isValidObject } from "../../../utils/utils";
import { useQuery } from "react-query";
import { useAuth } from "../../Auth";
import DisplayInputError from "../../common/DisplayInputError";
import { IUser } from "../../../lib/interfaces";

interface FormData {
  cp_name: string;
  cp_description: string;
  organizer_name: string;
  organizer_lastname: string;
  organizer_email: string;
  organizer_phone: string;
  start_date: string;
  end_date: string;
  address: string;
  status: string;
  is_internal_organizer: boolean;
}

interface Props {
  cpsId: string;
  cpFixed: ICPFixed[];
}

export default function CPFixed({ cpsId, cpFixed }: Props) {
  const { t } = useTranslation();

  const { user } = useAuth();

  const [address, setAddress] = useState<string>("");
  const [cpList, setCpList] = useState<ICPFixed[]>(cpFixed);

  const [isInternalOrganizer, setIsInternalOrganizer] = useState<boolean>(true);

  const [addressInputRequired, setAddressInputRequired] =
    useState<boolean>(false);

  const [externalOrganizers, setExternalOrganizers] = useState<IUser[]>([]);
  const [selectedEOrganizer, setSelectedEOrganizer] = useState<string>();

  const [showModal, setShowModal] = useState<boolean>(false);

  const [errorOnSelectEOrganizer, setErrorOnSelectEOrganizer] = useState(false);

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

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<FormData>();

  const handleAddress = (address: string) => {
    setAddress(address);
  };

  const handleCPList = (cps: ICPFixed[]) => {
    setCpList(cps);
  };

  const onSubmit = async (formValues: FormData) => {
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
      start_date,
      end_date,
    } = formValues;

    if (!isValidObject(address)) {
      setAddressInputRequired(true);
      return;
    }

    const results = await getGeocode({ address });

    const { data, error } = await supabase.from("cp_fixed").insert({
      cp_name,
      cp_description,
      organizer_name,
      organizer_lastname,
      organizer_email,
      organizer_phone,
      start_date,
      end_date,
      address,
      status: "active",
      cp_id: cpsId,
      geoArgs: results,
    });

    if (error) {
      throw error;
    }

    if (!isInternalOrganizer) {
      // Notify user that has been assigned as organizer
      const { error } = await supabase.from("notifications").insert({
        message: `You have been assigned as organizer for the fixed consumption point ${cp_name}`,
        user_id: selectedEOrganizer,
        link: "/profile?a=consumption_points",
        source: user?.id, // User that has created the consumption point
      });

      if (error) {
        throw error;
      }
    }

    const newCPList = [...cpList, data[0]];
    handleCPList(newCPList);

    setShowModal(false);
    reset();
  };

  const handleIsInternalOrganizer = (e: any) => {
    if (e.target.value === "true") {
      setIsInternalOrganizer(true);
    } else {
      const loadExternalOrganizer = async () => {
        const { data } = await query.refetch();
        setExternalOrganizers(data?.data ?? []);
      };

      loadExternalOrganizer();

      setIsInternalOrganizer(false);
    }
  };

  return (
    <>
      <Modal
        showBtn={true}
        showModal={showModal}
        setShowModal={setShowModal}
        title={t("add_new_cp_fixed")}
        btnTitle={t("new_cp_fixed_config")}
        description={""}
        icon={faAdd}
        handler={handleSubmit(onSubmit)}
        btnSize={"large"}
        classIcon={"w-6 h-6"}
        classContainer={""}
      >
        <form>
          {/* Event Information  */}
          <fieldset className="space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
            <legend className="m-2 text-2xl">{t("cp_fixed_info")}</legend>

            {/* Event name  */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="cp_name">{t("cp_name")}</label>
              <input
                className="rounded-md border-2 border-beer-softBlondeBubble bg-beer-softFoam px-2 py-1 text-xl focus:border-beer-blonde focus:outline-none"
                type="text"
                id="name"
                {...register("cp_name", { required: true })}
              />
            </div>
            {errors.cp_name && (
              <DisplayInputError message="errors.input_required" />
            )}

            {/* Event description  */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="cp_description">{t("description")}</label>
              <textarea
                className="max-h-[180px] rounded-md border-2 border-beer-softBlondeBubble bg-beer-softFoam px-2 py-1 text-xl focus:border-beer-blonde focus:outline-none"
                {...register("cp_description", { required: true })}
              />
            </div>
            {errors.cp_description && (
              <DisplayInputError message="errors.input_required" />
            )}

            {/* Start date and end date  */}
            <div className="flex flex-row space-x-2">
              <div className="flex w-full  flex-col">
                <label htmlFor="start_date">{t("start_date")}</label>
                <input
                  type="date"
                  id="start_date"
                  className="text-md rounded-md border-2 border-beer-softBlondeBubble bg-beer-softFoam px-2 py-1 focus:border-beer-blonde focus:outline-none "
                  {...register("start_date", { required: true })}
                />

                {errors.start_date && (
                  <DisplayInputError message="errors.input_required" />
                )}
              </div>

              <div className="flex w-full flex-col">
                <label htmlFor="end_date">{t("end_date")}</label>
                <input
                  className="text-md rounded-md border-2 border-beer-softBlondeBubble bg-beer-softFoam px-2 py-1 focus:border-beer-blonde focus:outline-none "
                  type="date"
                  id="end_date"
                  {...register("end_date", { required: true })}
                />

                {errors.end_date && (
                  <DisplayInputError message="errors.input_required" />
                )}
              </div>
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
                  className="text-md rounded-md border-2 border-beer-softBlondeBubble bg-beer-softFoam px-2 py-1 focus:border-beer-blonde focus:outline-none "
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
                <div className="flex flex-row space-x-2 ">
                  <div className="flex w-full flex-col">
                    <label htmlFor="organizer_name">{t("name")}</label>
                    <input
                      className="text-md rounded-md border-2 border-beer-softBlondeBubble bg-beer-softFoam px-2 py-1 focus:border-beer-blonde focus:outline-none "
                      type="text"
                      id="organizer_name"
                      {...register("organizer_name", { required: true })}
                    />

                    {errors.organizer_name && (
                      <DisplayInputError message="errors.input_required" />
                    )}
                  </div>

                  <div className="flex w-full flex-col">
                    <label htmlFor="organizer_lastname">{t("lastname")}</label>
                    <input
                      className="text-md rounded-md border-2 border-beer-softBlondeBubble bg-beer-softFoam px-2 py-1 focus:border-beer-blonde focus:outline-none "
                      type="text"
                      id="organizer_lastname"
                      {...register("organizer_lastname", { required: true })}
                    />

                    {errors.organizer_lastname && (
                      <DisplayInputError message="errors.input_required" />
                    )}
                  </div>
                </div>

                {/* Email and phone  */}
                <div className="flex flex-row space-x-2">
                  <div className="flex flex-col">
                    <label htmlFor="organizer_email">{t("email")}</label>
                    <input
                      className="text-md rounded-md border-2 border-beer-softBlondeBubble bg-beer-softFoam px-2 py-1 focus:border-beer-blonde focus:outline-none "
                      type="email"
                      id="organizer_email"
                      {...register("organizer_email", { required: true })}
                    />

                    {errors.organizer_email && (
                      <DisplayInputError message="errors.input_required" />
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="organizer_phone">{t("phone")}</label>
                    <input
                      className="text-md rounded-md border-2 border-beer-softBlondeBubble bg-beer-softFoam px-2 py-1 focus:border-beer-blonde focus:outline-none "
                      type="text"
                      id="organizer_phone"
                      {...register("organizer_phone", { required: true })}
                    />

                    {errors.organizer_phone && (
                      <DisplayInputError message="errors.input_required" />
                    )}
                  </div>
                </div>
              </>
            )}

            {/* In case organizer is external from company*/}
            {!isInternalOrganizer && (
              <>
                <div className="flex w-full flex-col">
                  <span className="mt-2 mb-2">
                    Selecciona del listado de abajo el organizador externo
                    responsable de este evento. Una vez creado el evento
                    enviaremos una confirmación al organizador externo para que
                    pueda gestionar el evento y acepta los términos y
                    condiciones de uso de la plataforma. Dicho evento tendrá el
                    estado `Pendiente de confirmación` hasta que el organizador
                    externo acepte los términos y condiciones.
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

          {/* Location  */}
          <fieldset className="mt-12 space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
            <legend className="text-2xl">{t("cp_fixed_location")}</legend>

            {addressInputRequired && (
              <span className="text-red-500">{t("errors.input_required")}</span>
            )}

            {/* Address  */}
            <CPGoogleMap handleAddress={handleAddress} />
          </fieldset>
        </form>
      </Modal>

      {/* Section displaying all the fixed consumption points created by the organizer  */}
      <section className="mt-4 flex flex-col space-y-4 ">
        <h2 className="text-2xl">{t("cp_fixed_list")}</h2>

        <ListCPFixed
          cpFixed={cpList}
          cpsId={cpsId}
          handleCPList={handleCPList}
        />
      </section>
    </>
  );
}
