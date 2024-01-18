import { NextRequest, NextResponse } from "next/server";
import createServerClient from "../../../utils/supabaseServer";
import { generateFileNameExtension } from "../../../utils/utils";

export async function POST(request: NextRequest) {
  const data = await request.formData();

  const title = data.get("title");
  const description = data.get("description");
  const reporter_id = data.get("reporter_id");
  const file = data.get("file") as File;

  const supabase = await createServerClient();

  const fileUrl = file
    ? `${reporter_id}_${title}${generateFileNameExtension(file.name)}`
    : null;

  const { error } = await supabase.from("user_reports").insert({
    title,
    description,
    file: fileUrl,
    reporter_id,
  });

  if (error) {
    console.error(`Error inserting report: ${error.message}`);
    return NextResponse.json(
      { error: `Error: ${error.message}. Details: ${error.details}` },
      { status: 500 }
    );
  }

  const fileToUpload = file as File;

  // Add file to storage
  const { error: storageError } = await supabase.storage
    .from("reports")
    .upload(`/reports/${fileUrl}`, fileToUpload, {
      upsert: true,
      cacheControl: "0",
    })
    .catch((err: Error) => {
      console.error(err);
      throw storageError;
    });

  if (storageError) {
    console.error(`Error uploading file: ${storageError.message}`);

    return NextResponse.json({ error: storageError.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Report inserted successfully" });
}
