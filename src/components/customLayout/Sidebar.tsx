import { useTranslation } from "react-i18next";
import { useAppContext } from "../Context/AppContext";

type Props = {
  parentCallback: (menuOption: string) => void;
};

export function Sidebar(props: Props) {
  const { parentCallback } = props;
  const { sidebar } = useAppContext();

  const { t } = useTranslation();

  const handleCallback = (option: string) => {
    parentCallback(option);
  };

  const sidebarLinks = [
    {
      name: t("profile"),
      icon: "user",
      option: "profile",
    },
    {
      name: t("products"),
      icon: "box",
      option: "products",
    },
    {
      name: t("campaigns"),
      icon: "gift",
      option: "campaigns",
    },
    {
      name: t("factories"),
      icon: "truck",
      option: "factories",
    },
    {
      name: t("orders"),
      icon: "shopping-cart",
      option: "orders",
    },
    {
      name: t("reviews"),
      icon: "review",
      option: "reviews",
    },
    {
      name: t("watchlist"),
      icon: "watchlist",
      option: "likes_history",
    },
    {
      name: t("consumption_points"),
      icon: "location",
      option: "consumption_points",
    },
  ];

  return (
    <>
      <aside className="w-64 " aria-label="Sidebar">
        <div className="overflow-y-auto py-4 px-3 h-full bg-gray-50 rounded dark:bg-gray-800">
          <ul className="space-y-2">
            {sidebarLinks.map((link) => (
              <li
                className={`
                hover:cursor-pointer flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-beer-blonde dark:hover:bg-gray-700
                ${
                  sidebar === link.option
                    ? "bg-beer-softBlonde text-gray-700"
                    : "text-gray-600"
                } `}
                key={link.name}
                onClick={() => handleCallback(link.option)}
              >
                <span className="mx-4 font-medium">{t(link.name)}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}
