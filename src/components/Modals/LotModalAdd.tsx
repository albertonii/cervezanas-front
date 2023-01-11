import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import LotForm from "../customLayout/Products/LotForm";

interface Props {
  isVisible: boolean;
}

interface FormProps {}

const LotModalAdd = (props: Props) => {
  const { t } = useTranslation();
  const { isVisible } = props;

  const [showModal, setShowModal] = useState(isVisible);

  const form = useForm<FormProps>({
    mode: "onSubmit",
    defaultValues: {},
  });

  const {
    formState: { errors },
  } = form;

  const handleShowModal = (value: boolean) => {
    setShowModal(value);
  };

  return (
    <>
      <button
        className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        type="button"
        onClick={() => setShowModal(true)}
      >
        {t("modal_lot_add")}
      </button>

      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none drop-shadow-md focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-5xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    {t("modal_lot_title")}
                  </h3>
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
                <LotForm handleShowModal={handleShowModal} />
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default LotModalAdd;
