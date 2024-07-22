import React from 'react';
import { IUserReport } from '@/lib/types/types';
import createServerClient from '@/utils/supabaseServer';
import ReportDetails from './ReportDetails';

export default async function page({ params }: any) {
    const { id } = params;
    const reportData = await getReport(id);
    const [report] = await Promise.all([reportData]);

    return <ReportDetails report={report} />;
}

async function getReport(id: string) {
    const supabase = await createServerClient();

    const { data: reports, error: reportErrors } = await supabase
        .from('user_reports')
        .select(`*`)
        .eq('id', id)
        .single();

    if (reportErrors) throw reportErrors;
    return reports as IUserReport;
}
