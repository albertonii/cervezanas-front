import React from "react";
import { IUserReport } from "../../../../../../lib/types";
import createServerClient from "../../../../../../utils/supabaseServer";
import Reports from "./Reports";

export default async function page() {
  const reportsData = await getReports();
  const [reports] = await Promise.all([reportsData]);

  return <Reports reports={reports} />;
}

async function getReports() {
  const supabase = await createServerClient();

  const { data: reports, error: reportErrors } = await supabase
    .from("user_reports")
    .select(`*`);

  if (reportErrors) throw reportErrors;
  return reports as IUserReport[];
}
