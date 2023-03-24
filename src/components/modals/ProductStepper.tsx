import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  activeStep: number;
  handleSetActiveStep: React.Dispatch<React.SetStateAction<any>>;
  children: JSX.Element;
}

export function ProductStepper(props: Props) {
  const { t } = useTranslation();

  const { children, handleSetActiveStep, activeStep } = props;

  const [detailsClass, setDetailsClass] = useState("");
  const [awardsClass, setAwardsClass] = useState("");
  const [multimediaClass, setMultimediaClass] = useState("");
  const [confirmClass, setConfirmClass] = useState("");

  const [detailsIconClass, setDetailsIconClass] = useState("");
  const [awardsIconClass, setAwardsIconClass] = useState("");
  const [multimediaIconClass, setMultimediaIconClass] = useState("");
  const [confirmIconClass, setConfirmIconClass] = useState("");

  const statusPastClass = "border-beer-softBlonde";
  const statusPresentClass = "bg-beer-blonde beer-blonde";
  const statusFutureClass = "border-beer-softBlonde";

  const statusPastIconClass = "#fdc300"; // Beer Blonde
  const statusPresentIconClass = "white";
  const statusFutureIconClass = "gray";

  useEffect(() => {
    const handleStepper = (param: number) => {
      switch (param) {
        case 0:
          setDetailsClass(statusPresentClass);
          setAwardsClass(statusFutureClass);
          setMultimediaClass(statusFutureClass);
          setConfirmClass(statusFutureClass);

          setDetailsIconClass(statusPresentIconClass);
          setAwardsIconClass(statusFutureIconClass);
          setMultimediaIconClass(statusFutureIconClass);
          setConfirmIconClass(statusFutureIconClass);
          return "";
        case 1:
          setDetailsClass(statusPastClass);
          setAwardsClass(statusPresentClass);
          setMultimediaClass(statusFutureClass);
          setConfirmClass(statusFutureClass);

          setDetailsIconClass(statusPastIconClass);
          setAwardsIconClass(statusPresentIconClass);
          setMultimediaIconClass(statusFutureIconClass);
          setConfirmIconClass(statusFutureIconClass);
          return "";
        case 2:
          setDetailsClass(statusPastClass);
          setAwardsClass(statusPastClass);
          setMultimediaClass(statusPresentClass);
          setConfirmClass(statusFutureClass);

          setDetailsIconClass(statusPastIconClass);
          setAwardsIconClass(statusPastIconClass);
          setMultimediaIconClass(statusPresentIconClass);
          setConfirmIconClass(statusFutureIconClass);
          return "";
        default:
          setDetailsClass(statusPastClass);
          setAwardsClass(statusPastClass);
          setMultimediaClass(statusPastClass);
          setConfirmClass(statusPresentClass);

          setDetailsIconClass(statusPastIconClass);
          setAwardsIconClass(statusPastIconClass);
          setMultimediaIconClass(statusPastIconClass);
          setConfirmIconClass(statusPresentIconClass);
          return "";
      }
    };

    handleStepper(0);
  }, []);

  const handleStepper = (param: number) => {
    handleSetActiveStep(param);

    switch (param) {
      case 0:
        setDetailsClass(statusPresentClass);
        setAwardsClass(statusFutureClass);
        setMultimediaClass(statusFutureClass);
        setConfirmClass(statusFutureClass);

        setDetailsIconClass(statusPresentIconClass);
        setAwardsIconClass(statusFutureIconClass);
        setMultimediaIconClass(statusFutureIconClass);
        setConfirmIconClass(statusFutureIconClass);
        return "";
      case 1:
        setDetailsClass(statusPastClass);
        setAwardsClass(statusPresentClass);
        setMultimediaClass(statusFutureClass);
        setConfirmClass(statusFutureClass);

        setDetailsIconClass(statusPastIconClass);
        setAwardsIconClass(statusPresentIconClass);
        setMultimediaIconClass(statusFutureIconClass);
        setConfirmIconClass(statusFutureIconClass);
        return "";
      case 2:
        setDetailsClass(statusPastClass);
        setAwardsClass(statusPastClass);
        setMultimediaClass(statusPresentClass);
        setConfirmClass(statusFutureClass);

        setDetailsIconClass(statusPastIconClass);
        setAwardsIconClass(statusPastIconClass);
        setMultimediaIconClass(statusPresentIconClass);
        setConfirmIconClass(statusFutureIconClass);
        return "";
      default:
        setDetailsClass(statusPastClass);
        setAwardsClass(statusPastClass);
        setMultimediaClass(statusPastClass);
        setConfirmClass(statusPresentClass);

        setDetailsIconClass(statusPastIconClass);
        setAwardsIconClass(statusPastIconClass);
        setMultimediaIconClass(statusPastIconClass);
        setConfirmIconClass(statusPresentIconClass);
        return "";
    }
  };

  return (
    <div className="p-5">
      <div className="mx-4 p-4">
        <div className="flex items-center">
          <div className="flex items-center text-beer-draft relative">
            <div
              className={`rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 ${detailsClass} `}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                fill="none"
                viewBox="0 0 24 24"
                stroke={`${detailsIconClass}`}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-bookmark "
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <div className="absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase text-gray-500">
              {t("details")}
            </div>
          </div>

          <div
            className={`flex-auto border-t-2 transition duration-500 ease-in-out ${awardsClass}`}
          ></div>
          <div className="flex items-center text-white relative">
            <div
              className={`rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 ${awardsClass}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                fill="none"
                viewBox="0 0 24 24"
                stroke={`${awardsIconClass}`}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-user-plus "
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
            </div>
            <div className="absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase text-gray-500">
              {t("awards")}
            </div>
          </div>

          <div
            className={`flex-auto border-t-2 transition duration-500 ease-in-out ${multimediaClass}`}
          ></div>
          <div className="flex items-center text-gray-500 relative">
            <div
              className={`rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 ${multimediaClass}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                fill="none"
                viewBox="0 0 24 24"
                stroke={`${multimediaIconClass}`}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-mail "
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <div className="absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase text-gray-500">
              {t("multimedia")}
            </div>
          </div>
          <div
            className={`flex-auto border-t-2 transition duration-500 ease-in-out ${confirmClass}`}
          ></div>
          <div className="flex items-center text-gray-500 relative">
            <div
              className={`rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 ${confirmClass}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                fill="none"
                viewBox="0 0 24 24"
                stroke={`${confirmIconClass}`}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-database "
              >
                <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
              </svg>
            </div>
            <div className="absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase text-gray-500">
              {t("confirm")}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 p-4">
        <div>{children}</div>

        <div className="flex p-2 mt-4">
          <button
            disabled={activeStep === 0}
            onClick={() => handleStepper(activeStep - 1)}
            className="text-base hover:scale-110 focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer 
        hover:bg-gray-200  
        bg-gray-100 
        text-gray-700 
        border duration-200 ease-in-out 
        border-gray-600 transition"
          >
            {t("back")}
          </button>

          <div className="flex-auto flex flex-row-reverse">
            {activeStep < 3 && (
              <button
                onClick={() => handleStepper(activeStep + 1)}
                className="text-base  ml-2  hover:scale-110 focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer 
        hover:bg-beer-softBlondeBubble  
        bg-beer-blonde 
        text-beer-draft 
        border duration-200 ease-in-out 
        border-beer-draft transition"
              >
                {t("next")}
              </button>
            )}

            {activeStep !== 3 && (
              <button
                onClick={() => handleStepper(3)}
                className="text-base hover:scale-110 focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer 
        hover:bg-bear-blonde  
        bg-bear-alvine 
        text-beer-draft 
        border duration-200 ease-in-out 
        border-beer-draft transition"
              >
                {t("skip")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
