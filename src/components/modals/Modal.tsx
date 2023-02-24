import { faXmark, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { PortalModal } from ".";
import useOnClickOutside from "../../hooks/useOnOutsideClickDOM";
import { Button, IconButton } from "../common";

interface Props {
  showBtn?: boolean;
  isVisible: boolean;
  title: string;
  btnTitle: string;
  description: string;
  children: JSX.Element;
  handler: () => void;
  handlerClose?: () => void;
  icon?: IconDefinition;
  classIcon: string;
  classContainer: string;
  color?: { filled: string; unfilled: string };
  btnSize?: "small" | "medium" | "large" | "xLarge" | "xxLarge";
}

export function Modal(props: Props) {
  const {
    isVisible,
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
    showBtn: showBtn_,
  } = props;

  const { t } = useTranslation();

  const modalRef = useRef<HTMLDivElement>(null);

  const [showModal, setShowModal] = useState(isVisible);
  const [showBtn, setShowBtn] = useState(showBtn_);

  const handleShowModal = (b: boolean) => {
    setShowModal(b);
  };

  const handleClickOutsideCallback = () => {
    handleShowModal(false);
    if (handlerClose) handlerClose();
  };

  const handleAccept = () => {
    handler();
    handleShowModal(false);
  };

  const handleClose = () => {
    handleShowModal(false);
    if (handlerClose) handlerClose();
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
          <div className="justify-center items-start pt-16 flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            {/* The modal  */}
            <div
              className="relative w-auto my-6 mx-4 sm:mx-auto max-w-3xl"
              ref={modalRef}
            >
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
                    {t(description)}
                  </p>
                  {children}
                </div>

                {/*footer*/}
                <div className="flex items-center justify-start p-6 border-t border-solid border-slate-200 rounded-b">
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
