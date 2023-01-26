import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutsideDOMClick } from "../../hooks/useOuthsideDOMClick";
import PortalModal from "./PortalModal";

interface Props {
  isVisible: boolean;
  title: string;
  btnTitle: string;
  description: string;
  children: JSX.Element;
}

const Modal = (props: Props) => {
  const { isVisible, btnTitle, title, description, children } = props;

  const { t } = useTranslation();

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
  };

  // handle what happens on key press
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") setShowModal(false);
  }, []);

  useOutsideDOMClick(() => handleClickOutsideCallback(), modalRef);

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
      <button
        className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        type="button"
        onClick={() => handleShowModal(true)}
      >
        {t(btnTitle)}
      </button>

      {showModal && (
        <>
          <PortalModal wrapperId="modal-portal">
            <div
              className="justify-center items-start pt-16 flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
              ref={modalRef}
            >
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <h3 className="text-3xl font-semibold">{t(title)}</h3>

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
                    <p className="my-4 text-slate-500 text-lg leading-relaxed">
                      {description}
                    </p>
                    {children}
                    {/* {React.cloneElement(children, { trigger })} */}
                  </div>

                  {/*footer*/}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => handleShowModal(false)}
                    >
                      {t("close")}
                    </button>

                    <button
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={handleAccept}
                    >
                      {t("save")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </PortalModal>
        </>
      )}
    </>
  );
};

export default Modal;
