import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface Props {
  activeStep: number;
  handleSetActiveStep: React.Dispatch<React.SetStateAction<any>>;
  children: JSX.Element;
  isSubmitting: boolean;
}

export function ProductStepper(props: Props) {
  const t = useTranslations();

  const { children, handleSetActiveStep, activeStep, isSubmitting } = props;

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
          setMultimediaClass(statusFutureClass);
          setAwardsClass(statusFutureClass);
          setConfirmClass(statusFutureClass);

          setDetailsIconClass(statusPresentIconClass);
          setMultimediaIconClass(statusFutureIconClass);
          setAwardsIconClass(statusFutureIconClass);
          setConfirmIconClass(statusFutureIconClass);
          return "";
        case 1:
          setDetailsClass(statusPastClass);
          setMultimediaClass(statusPresentClass);
          setAwardsClass(statusFutureClass);
          setConfirmClass(statusFutureClass);

          setDetailsIconClass(statusPastIconClass);
          setMultimediaIconClass(statusPresentIconClass);
          setAwardsIconClass(statusFutureIconClass);
          setConfirmIconClass(statusFutureIconClass);
          return "";
        case 2:
          setDetailsClass(statusPastClass);
          setMultimediaClass(statusPastClass);
          setAwardsClass(statusPresentClass);
          setConfirmClass(statusFutureClass);

          setDetailsIconClass(statusPastIconClass);
          setMultimediaIconClass(statusPastIconClass);
          setAwardsIconClass(statusPresentIconClass);
          setConfirmIconClass(statusFutureIconClass);
          return "";
        default:
          setDetailsClass(statusPastClass);
          setMultimediaClass(statusPastClass);
          setAwardsClass(statusPastClass);
          setConfirmClass(statusPresentClass);

          setDetailsIconClass(statusPastIconClass);
          setMultimediaIconClass(statusPastIconClass);
          setAwardsIconClass(statusPastIconClass);
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
        setMultimediaClass(statusFutureClass);
        setAwardsClass(statusFutureClass);
        setConfirmClass(statusFutureClass);

        setDetailsIconClass(statusPresentIconClass);
        setMultimediaIconClass(statusFutureIconClass);
        setAwardsIconClass(statusFutureIconClass);
        setConfirmIconClass(statusFutureIconClass);
        return "";
      case 1:
        setDetailsClass(statusPastClass);
        setMultimediaClass(statusPresentClass);
        setAwardsClass(statusFutureClass);
        setConfirmClass(statusFutureClass);

        setDetailsIconClass(statusPastIconClass);
        setMultimediaIconClass(statusPresentIconClass);
        setAwardsIconClass(statusFutureIconClass);
        setConfirmIconClass(statusFutureIconClass);
        return "";
      case 2:
        setDetailsClass(statusPastClass);
        setMultimediaClass(statusPastClass);
        setAwardsClass(statusPresentClass);
        setConfirmClass(statusFutureClass);

        setDetailsIconClass(statusPastIconClass);
        setMultimediaIconClass(statusPastIconClass);
        setAwardsIconClass(statusPresentIconClass);
        setConfirmIconClass(statusFutureIconClass);
        return "";
      default:
        setDetailsClass(statusPastClass);
        setMultimediaClass(statusPastClass);
        setAwardsClass(statusPastClass);
        setConfirmClass(statusPresentClass);

        setDetailsIconClass(statusPastIconClass);
        setMultimediaIconClass(statusPastIconClass);
        setAwardsIconClass(statusPastIconClass);
        setConfirmIconClass(statusPresentIconClass);
        return "";
    }
  };

  return (
    <section className={`p-5 ${isSubmitting && "opacity-50"}`}>
      <div className="mx-4 p-4">
        <div className="flex items-center">
          <div className="relative flex items-center text-beer-draft">
            <figure
              className={`h-12 w-12 rounded-full border-2 py-3 transition duration-500 ease-in-out ${detailsClass} `}
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
            </figure>
            <h3 className="absolute top-0 -ml-10 mt-16 w-32 text-center text-xs font-medium uppercase text-gray-500">
              {t("details")}
            </h3>
          </div>

          <div
            className={`flex-auto border-t-2 transition duration-500 ease-in-out ${multimediaClass}`}
          ></div>
          <div className="relative flex items-center text-gray-500">
            <figure
              className={`h-12 w-12 rounded-full border-2 py-3 transition duration-500 ease-in-out ${multimediaClass}`}
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
            </figure>
            <div className="absolute top-0 -ml-10 mt-16 w-32 text-center text-xs font-medium uppercase text-gray-500">
              {t("multimedia")}
            </div>
          </div>

          <div
            className={`flex-auto border-t-2 transition duration-500 ease-in-out ${awardsClass}`}
          ></div>

          <figure className="relative flex items-center text-white">
            <div
              className={`h-12 w-12 rounded-full border-2 py-3 transition duration-500 ease-in-out ${awardsClass}`}
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
            <div className="absolute top-0 -ml-10 mt-16 w-32 text-center text-xs font-medium uppercase text-gray-500">
              {t("awards")}
            </div>
          </figure>

          <div
            className={`flex-auto border-t-2 transition duration-500 ease-in-out ${confirmClass}`}
          ></div>
          <figure className="relative flex items-center text-gray-500">
            <div
              className={`h-12 w-12 rounded-full border-2 py-3 transition duration-500 ease-in-out ${confirmClass}`}
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
            <div className="absolute top-0 -ml-10 mt-16 w-32 text-center text-xs font-medium uppercase text-gray-500">
              {t("confirm")}
            </div>
          </figure>
        </div>
      </div>

      <div className="mt-8 p-4">
        <div>{children}</div>

        <div className="mt-4 flex p-2">
          <button
            type="button"
            disabled={activeStep === 0}
            onClick={() => handleStepper(activeStep - 1)}
            className="flex cursor-pointer justify-center rounded border border-gray-600 bg-gray-100 px-4 py-2 text-base 
        font-bold  
        text-gray-700 
        transition 
        duration-200 ease-in-out hover:scale-110 
        hover:bg-gray-200 focus:outline-none"
          >
            {t("back")}
          </button>

          <div className="flex flex-auto flex-row-reverse">
            {activeStep < 3 && (
              <button
                type="button"
                onClick={() => handleStepper(activeStep + 1)}
                className="ml-2  flex  cursor-pointer justify-center rounded border border-beer-draft bg-beer-blonde px-4 py-2 text-base 
        font-bold  
        text-beer-draft 
        transition 
        duration-200 ease-in-out hover:scale-110 
        hover:bg-beer-softBlondeBubble focus:outline-none"
              >
                {t("next")}
              </button>
            )}

            {activeStep !== 3 && (
              <button
                type="button"
                onClick={() => handleStepper(3)}
                className="flex cursor-pointer justify-center rounded border border-beer-draft bg-bear-alvine px-4 py-2 text-base 
        font-bold  
        text-beer-draft 
        transition 
        duration-200 ease-in-out hover:scale-110 
        hover:bg-bear-blonde focus:outline-none"
              >
                {t("skip")}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
