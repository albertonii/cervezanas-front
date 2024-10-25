import classNames from "classnames";
import { Alert } from "@reach/alert";
import {
  faExclamationCircle,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MessageProps } from "./message.types";
import { useTranslations } from "next-intl";

export function Message({ message, type }: MessageProps) {
  const t = useTranslations();

  return (
    <Alert
      className={classNames(
        "text-shadow rounded px-10 py-2 shadow-md transition-all h-[40px] border-b-4 border-beer-gold",
        type === "error"
          ? "bg-red-500 text-white rounded-tl-lg rounded-br-lg rounded-bl-full rounded-tr-full italic"
          : type === "success"
          ? "bg-green-300 text-gray-800 rounded-tl-lg rounded-br-lg rounded-bl-full rounded-tr-full"
          : type === "warning"
          ? "bg-yellow-300 text-gray-800 rounded-tl-lg rounded-br-lg rounded-bl-full rounded-tr-full"
          : type === "info"
          ? "bg-blue-300 text-gray-800 rounded-tl-lg rounded-br-lg rounded-bl-full rounded-tr-full"
          : "bg-gray-100 text-gray-800 rounded-tl-lg rounded-br-lg rounded-bl-full rounded-tr-full"
      )}
    >
      {type === "success" ? (
        <FontAwesomeIcon
          icon={faCheckCircle}
          style={{ color: "#fdc300" }}
          title={"check_warning"}
          className="relative text-6xl filter drop-shadow-[0_0_6px_rgba(0,0,0,0.6)] z-2 float-left"
          width={80}
          height={80}
        />
      ) : (
        <FontAwesomeIcon
          icon={faExclamationCircle}
          style={{ color: "#fdc300" }}
          title={"check_warning"}
          className="relative text-6xl filter drop-shadow-[0_0_6px_rgba(0,0,0,0.6)] z-2 float-left"
          width={80}
          height={80}
        />
      )}
      &nbsp; {t(message)}
    </Alert>
  );
}
