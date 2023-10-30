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
        "text-shadow  mt-2 rounded px-3 py-2 shadow-md transition-all",
        type === "error"
          ? "bg-red-500 text-white"
          : type === "success"
          ? "bg-green-300 text-gray-800"
          : type === "warning"
          ? "bg-yellow-300 text-gray-800"
          : type === "info"
          ? "bg-blue-300 text-gray-800"
          : "bg-gray-100 text-gray-800"
      )}
    >
      {type === "success" ? (
        <FontAwesomeIcon
          icon={faCheckCircle}
          style={{ color: "#fdc300" }}
          title={"check_warning"}
          width={80}
          height={80}
        />
      ) : (
        <FontAwesomeIcon
          icon={faExclamationCircle}
          style={{ color: "#fdc300" }}
          title={"check_warning"}
          width={80}
          height={80}
        />
      )}
      &nbsp; {t(message)}
    </Alert>
  );
}
