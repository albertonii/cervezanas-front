import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Beer } from "../../lib/types";

import { supabase } from "../../utils/supabase-browser";

interface Props {
  beers: Beer[];
  beerId: string;
  isDeleteShowModal: boolean;
  handleDeleteShowModal: React.Dispatch<React.SetStateAction<any>>;
  handleSetBeers: React.Dispatch<React.SetStateAction<any>>;
}

const ProductModalDelete = (props: Props) => {
  const { t } = useTranslation();
  const {
    beers,
    beerId,
    isDeleteShowModal,
    handleDeleteShowModal,
    handleSetBeers,
  } = props;

  const handleClick = () => {
    const handleDelete = async () => {
      const { data, error } = await supabase
        .from("beers")
        .delete()
        .eq("id", beerId);

      if (error) throw error;

      handleDeleteShowModal(false);

      handleSetBeers(
        beers.filter((b) => {
          return b.id !== beerId;
        })
      );

      return data;
    };

    handleDelete();
  };

  return (
    <>
      {isDeleteShowModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none drop-shadow-md focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">{t("delete")}</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => handleDeleteShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>

                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-slate-500 text-lg leading-relaxed">
                    {t("modal_delete_product_description")}
                  </p>

                  {/*footer*/}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                    <button
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      onClick={handleClick}
                    >
                      {t("accept")}
                    </button>
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => handleDeleteShowModal(false)}
                    >
                      {t("close")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default ProductModalDelete;