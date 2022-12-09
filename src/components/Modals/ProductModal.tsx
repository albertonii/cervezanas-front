import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { aroma_options, intensity_options } from "../../lib/beerEnum";

interface Props {
  isVisible: boolean;
  title: string;
  description: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  name: string;
  intensity: string;
  fermentation: string;
  color: string;
  origin: string;
  family: string;
  era: string;
  aroma: string;
  format: string;
  isGluten: boolean;
}

enum product_type_enum {
  Beer = "beer",
  Merchandising = "merchandising",
}

const product_type_options = [
  {
    label: "Beer",
    value: product_type_enum.Beer,
  },
  {
    label: "Merchandising",
    value: product_type_enum.Merchandising,
  },
];

const campaigns = [
  {
    label: "None",
    value: "-",
  },
  {
    label: "Campaign 1",
    value: "campaign_1",
  },
  {
    label: "Campaign 2",
    value: "campaign_2",
  },
];

type FormValues = { name: string };

const ProductModal = (props: Props) => {
  const { t } = useTranslation();
  const {
    isVisible,
    name,
    intensity,
    fermentation,
    color,
    origin,
    family,
    era,
    aroma,
    format,
    isGluten,
    setName,
  } = props;

  const [showModal, setShowModal] = React.useState(isVisible);

  const {
    register,
    formState: { errors },
    watch,
    setValue,
    getValues,
    handleSubmit,
  } = useForm({
    defaultValues: {
      campaign: "-",
      name: "Jaira IPA",
      color: "red",
      intensity: "",
      aroma: "",
      family: "",
      type: product_type_enum.Beer,
    },
  });

  const onSubmit = (data: FormValues) => {
    setName(data.name);
    setShowModal(false);
  };

  return (
    <>
      <button
        className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Añadir producto
      </button>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <h3 className="text-3xl font-semibold">{t("title")}</h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowModal(false)}
                    >
                      <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                        ×
                      </span>
                    </button>
                  </div>

                  {/*body*/}
                  <div className="relative p-6 flex-auto">
                    <p className="my-4 text-slate-500 text-lg leading-relaxed">
                      {t("product_description")}
                    </p>

                    <div className="w-full">
                      <select
                        {...register("type")}
                        value={product_type_enum.Beer}
                        className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      >
                        {product_type_options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex w-full flex-row space-x-3 ">
                      <div className="w-full space-y">
                        <label
                          htmlFor="product_name"
                          className="text-sm text-gray-600"
                        >
                          {t("product_name")}
                        </label>
                        <input
                          type="text"
                          id="name"
                          placeholder="IPA Jaira"
                          className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          value={name}
                          {...register("name", {
                            required: true,
                          })}
                        />
                        {errors.name?.type === "required" && (
                          <p>Campo nombre es requerido</p>
                        )}
                        {errors.name?.type === "maxLength" && (
                          <p>Nombre debe tener menos de 20 caracteres</p>
                        )}
                      </div>

                      <div className="w-full ">
                        <select
                          {...register("campaign")}
                          value={""}
                          className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        >
                          {campaigns.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex w-full flex-row space-x-3 ">
                      <div className="w-full ">
                        <select
                          {...register("intensity")}
                          className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        >
                          {intensity_options.map((option) => (
                            <option key={option.value} value={option.value}>
                              {t(option.label)}
                            </option>
                          ))}
                        </select>

                        {errors.intensity?.type === "required" && (
                          <p>Campo intensidad requerido</p>
                        )}
                      </div>

                      <div className="w-full ">
                        <select
                          {...register("aroma")}
                          className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        >
                          {aroma_options.map((option) => (
                            <option key={option.value} value={option.value}>
                              {t(option.label)}
                            </option>
                          ))}
                        </select>
                        {errors.intensity?.type === "required" && (
                          <p>Campo aroma requerido</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/*footer*/}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                    <button
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="submit"
                    >
                      {t("save")}
                    </button>
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      {t("close")}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </>
      ) : null}
    </>
  );
};

export default ProductModal;
