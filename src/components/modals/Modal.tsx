import { faXmark, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ComponentProps, useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { PortalModal } from ".";
import useOnClickOutside from "../../hooks/useOnOutsideClickDOM";
import { Button, IconButton } from "../common";

interface Props {
  showBtn?: boolean;
  showModal: boolean;
  title: string;
  btnTitle: string;
  description: string;
  children: JSX.Element;
  handler: ComponentProps<any>;
  handlerClose?: () => void;
  icon?: IconDefinition;
  classIcon: string;
  classContainer: string;
  color?: { filled: string; unfilled: string };
  btnSize?: "small" | "medium" | "large" | "xLarge" | "xxLarge";
  setShowModal: (b: boolean) => void;
}

export function Modal(props: Props) {
  const {
    btnTitle,
    title,
    description,
    children,
    handler,
    handlerClose,
    icon,
    classIcon,
    classContainer,
    color,
    btnSize,
    showBtn,
    showModal,
    setShowModal,
  } = props;

  const t = useTranslations();

  const modalRef = useRef<HTMLDivElement>(null);

  const handleShowModal = (b: boolean) => {
    setShowModal(b);
  };

  const handleClickOutsideCallback = () => {
    handleShowModal(false);
    if (handlerClose) handlerClose();
  };

  const handleAccept = async () => {
    handler();
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
      {showBtn && (
        <>
          {icon ? (
            <IconButton
              icon={icon}
              classIcon={classIcon}
              classContainer={classContainer}
              onClick={() => handleShowModal(true)}
              isActive={false}
              color={color}
              title={title}
              size={btnSize}
            >
              {t(btnTitle)}
            </IconButton>
          ) : (
            <Button
              class={`${classContainer} px-2 py-1`}
              onClick={() => handleShowModal(true)}
              title={title}
              primary
            >
              {t(btnTitle)}
            </Button>
          )}
        </>
      )}

      {showModal && (
        <PortalModal wrapperId="modal-portal">
          <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overflow-x-hidden pt-16 outline-none focus:outline-none">
            {/* The modal  */}
            <div
              className="relative mx-4 my-6 w-4/5 max-w-3xl sm:mx-auto md:w-2/3 lg:w-1/2"
              ref={modalRef}
            >
              {/*content*/}
              <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
                {/*header*/}
                <div className="border-slate-200 flex items-start justify-between rounded-t border-b border-solid p-5">
                  <h3 className="text-3xl font-semibold">{t(title)}</h3>

                  <button
                    className="float-right ml-auto border-0 p-1 text-3xl font-semibold leading-none text-black outline-none focus:outline-none"
                    onClick={() => handleClose()}
                  >
                    <span className=" block h-6 w-6 text-2xl text-black outline-none focus:outline-none">
                      <FontAwesomeIcon
                        icon={faXmark}
                        style={{ color: "beer-dark" }}
                        onClick={() => handleClose()}
                        title={"Close Modal"}
                      />
                    </span>
                  </button>
                </div>

                {/*body*/}
                <div className="relative flex-auto p-6">
                  <p className="text-slate-500 my-4 text-lg leading-relaxed">
                    {t(description)}
                  </p>

                  {children}
                </div>

                {/*footer*/}
                <div className="border-slate-200 grid grid-cols-1 place-items-center gap-2 rounded-b border-t border-solid p-6 sm:grid-cols-2">
                  <Button
                    primary
                    class="mr-4"
                    medium
                    btnType="submit"
                    onClick={handleAccept}
                  >
                    {t(btnTitle)}
                  </Button>

                  <Button
                    accent
                    class=""
                    btnType="button"
                    medium
                    onClick={handleClose}
                  >
                    {t("close")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </PortalModal>
      )}
    </>
  );
}
