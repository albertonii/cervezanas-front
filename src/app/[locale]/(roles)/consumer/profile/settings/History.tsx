"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { User } from "@supabase/supabase-js";
import { HistoryForm } from "./HistoryForm";

interface Props {
  user: User | null;
}

export function History(props: Props) {
  const { user } = props;
  const t = useTranslations();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user != null && user != undefined) {
      setLoading(false);
    }

    return () => {
      setLoading(true);
    };
  }, [user]);

  return (
    <>
      {loading ? (
        <div>{t("loading")} </div>
      ) : (
        <div className="px-4 py-6" id="account-container">
          <div className="flex flex-col justify-between py-4" id="header">
            <div id="title" className="text-4xl">
              {t("history_title")}
            </div>
            <span id="rrss" className="text-lg">
              {t("history_description_producer")}
            </span>
          </div>

          <HistoryForm />
        </div>
      )}
    </>
  );
}