import React, { useCallback, useEffect, useRef } from "react";
import { PortalModal } from ".";
import useOnClickOutside from "../../hooks/useOnOutsideClickDOM";

interface Props {
  showModal: boolean;
  children: JSX.Element;
  handlerClose?: () => void;
  btnSize?: "small" | "medium" | "large" | "xLarge" | "xxLarge";
  setShowModal: (b: boolean) => void;
}

export function ImageModal(props: Props) {
  const { children, handlerClose, showModal, setShowModal } = props;

  const modalRef = useRef<HTMLDivElement>(null);

  const handleShowModal = (b: boolean) => {
    setShowModal(b);
  };

  const handleClickOutsideCallback = () => {
    handleShowModal(false);
    if (handlerClose) handlerClose();
  };

  const handleClose = () => {
    handleShowModal(false);
    if (handlerClose) handlerClose();
  };

  useOnClickOutside(modalRef, () => handleClickOutsideCallback());

  // handle what happens on key press
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      const handleClose = () => {
        handleShowModal(false);
        if (handlerClose) handlerClose();
      };

      if (event.key === "Escape") handleClose();
    },
    [handlerClose]
  );

  useEffect(() => {
    handleShowModal(showModal);
  }, [showModal]);

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
          <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overflow-x-hidden bg-beer-blonde/40 outline-none focus:outline-none">
            {/* The modal  */}
            <div className="relative mx-4 my-6 h-screen w-screen shadow-lg ">
              {/* Close modal */}
              <div className="border-slate-200 flex items-start justify-between rounded-t border-b border-solid p-5">
                <button
                  className="float-right ml-auto border-0 p-1 text-3xl font-semibold leading-none text-black outline-none focus:outline-none"
                  onClick={() => handleClose()}
                >
                  <span className=" fixed top-6 right-8 text-5xl font-bold text-beer-foam">
                    &times;
                  </span>
                </button>
              </div>

              {/*body*/}
              <div className="mt-[5rem] grid grid-cols-1 justify-items-center">
                <div ref={modalRef}>{children}</div>
              </div>
            </div>
          </div>
        </PortalModal>
      )}
    </>
  );
}