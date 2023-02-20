import React, { useCallback, useEffect, useRef, useState } from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import useOnClickOutside from "../../hooks/useOnOutsideClickDOM";
import PortalModal from "./PortalModal";
import Link from "next/link";
import Button from "../common/Button";
import { useRouter } from "next/router";

interface Props {
  isVisible: boolean;
}

const Modal = (props: Props) => {
  const { isVisible } = props;

  const { t } = useTranslation();

  const router = useRouter();

  const modalRef = useRef<HTMLDivElement>(null);

  const [showModal, setShowModal] = useState(isVisible);

  const handleShowModal = (b: boolean) => {
    setShowModal(b);
  };

  const handleClickOutsideCallback = () => {
    handleShowModal(false);
  };

  const handleAccept = () => {
    handleShowModal(false);
    router.push({
      pathname: `/profile`,
    });
  };

  useOnClickOutside(modalRef, () => handleClickOutsideCallback());

  // handle what happens on key press
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") handleShowModal(false);
  }, []);

  useEffect(() => {
    if (showModal) {
      // attach the event listener if the modal is shown
      document.addEventListener("keydown", handleKeyPress);
      // remove the event listener
      return () => {
        document.removeEventListener("keydown", handleKeyPress);
      };
    }
  }, [handleKeyPress, showModal]);

  return (
    <>
      {showModal && (
        <PortalModal wrapperId="modal-portal">
          <div className="justify-center items-start pt-16 flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            {/* The modal  */}
            <div
              className="relative w-auto my-6 mx-auto max-w-3xl"
              ref={modalRef}
            >
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <p className="text-xl font-semibold">
                    {t("successful_product_review_title")}
                  </p>

                  <button
                    className="p-1 ml-auto border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => handleShowModal(false)}
                  >
                    <span className=" text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                      <FontAwesomeIcon
                        // className={`${className} `}
                        // onMouseEnter={() => setHoverColor("filled")}
                        // onMouseLeave={() => setHoverColor("unfilled")}
                        icon={faXmark}
                        style={{ color: "beer-dark" }}
                        onClick={() => handleShowModal(false)}
                        title={"Close Modal"}
                      />
                    </span>
                  </button>
                </div>

                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <div className="flex justify-center w-full">
                    <p className="my-4 text-slate-500 text-3xl leading-relaxed font-semibold text-beer-draft">
                      ¡Gracias por tu opinión!
                    </p>
                  </div>

                  <p className="my-4 text-slate-500 text-lg leading-relaxed">
                    Acabas de conseguir 30 puntos por todo el contenido aportado
                    en este formulario ¡Recuerda que a más contenido aportes,
                    más puntos!
                  </p>

                  <br />

                  <p className="my-4 text-slate-500 text-lg leading-relaxed">
                    Con tu valoración acabas de entrar al sorteo que se realiza
                    todos los meses, en el que podrás ganar 50, 100 o 200€
                    ¡Sigue así!
                  </p>

                  <p className="my-4 text-slate-500 text-lg leading-relaxed">
                    {/* Underline link  */}
                    <Link
                      className="text-beer-draft underline hover:font-semibold"
                      href="#"
                    >
                      Ver condiciones del sorteo{" "}
                    </Link>
                  </p>
                </div>

                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <Button
                    class=""
                    accent
                    onClick={() => handleShowModal(false)}
                  >
                    {t("close")}
                  </Button>

                  <Button
                    btnType="submit"
                    class="bg-beer-draft text-white active:bg-beer-dark font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    onClick={handleAccept}
                  >
                    {t("continue_reviewing")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </PortalModal>
      )}
    </>
  );
};

export default Modal;
