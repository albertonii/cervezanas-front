import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BasicDataForm } from "./BasicDataForm";
import { supabase } from "../../../utils/supabaseClient";
import SecretDataForm from "./SecretDataForm";
import LocationForm from "./LocationForm";
import { User } from "@supabase/supabase-js";
import { HistoryForm } from "./HistoryForm";

interface Props {
  user: User | null;
  historyData: any;
}

export const History = (props: Props) => {
  const { user, historyData } = props;
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user != null && user != undefined) {
      setLoading(false);
    }
  }, [user]);

  return (
    <>
      {loading ? (
        <div>Loading ... </div>
      ) : (
        <div className="py-6 px-4" id="account-container">
          <div className="flex flex-col justify-between py-4" id="header">
            <div id="title" className="text-4xl">
              {t("history_title")}
            </div>
            <span id="rrss" className="text-lg">
              {t("history_description_producer")}
            </span>
          </div>

          <HistoryForm historyData={historyData} />
        </div>
      )}
    </>
  );
};