"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { IUserReport } from "../../../../../../../lib/types";
import { useAuth } from "../../../../../Auth/useAuth";
import { Button } from "../../../../../components/common/Button";
import { useMessage } from "../../../../../components/message/useMessage";

interface Props {
  report: IUserReport;
}

export default function ReportDetails({ report }: Props) {
  const t = useTranslations();

  const [status, setStatus] = useState(report.is_resolved);
  const { handleMessage } = useMessage();
  const { supabase } = useAuth();

  const [file, setFile] = useState<Blob | null>(null);

  useEffect(() => {
    // Cargar file
    const getFile = async () => {
      const { data: file, error } = await supabase.storage
        .from("reports")
        .download(`reports/${report.file}`);

      if (error) {
        console.error(error);
        return;
      }

      setFile(file);
    };

    getFile();
  }, []);

  const handleUpdateIsResolved = async () => {
    const { error } = await supabase
      .from("user_reports")
      .update({ is_resolved: !status })
      .eq("id", report.id);

    if (error) {
      console.error(error);

      handleMessage({
        type: "error",
        message: `${t("errors.updating_report")}. Error message: ${
          error.message
        }. Error details: ${error.details}`,
      });
      return;
    }

    setStatus(!status);

    handleMessage({
      type: "success",
      message: `${t("report_updated_successfully")}`,
    });
  };

  return (
    <section className="container mx-auto space-y-4 p-4">
      <h1 className="mb-2 text-xl font-bold">{t("report_details")}</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">{t("title")}:</h2>
        <p>{report.title}</p>
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">{t("description")}:</h2>
        <p>{report.description}</p>
      </div>
      {/* Añadir aquí más detalles del reporte según sea necesario */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">{t("status")}:</h2>
        <p>{status ? t("resolved") : t("pending")}</p>
      </div>

      {file?.type === "image/png" && (
        <figure>
          <Image
            src={URL.createObjectURL(file)}
            alt={report.title}
            width={200}
            height={200}
          />
        </figure>
      )}

      <Button onClick={handleUpdateIsResolved} primary large>
        {status ? t("mark_as_pending") : t("mark_as_resolved")}
      </Button>
    </section>
  );
}