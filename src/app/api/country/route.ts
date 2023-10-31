import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);

  const country = requestUrl.searchParams.get("name");
  const fileName = requestUrl.searchParams.get("fileName");

  if (!country) {
    throw new Error("No country provided");
  }

  const loadFile = async () => {
    const file = await fs
      .readFile(
        process.cwd() + `/public/data/${country}/${fileName}.json`,
        "utf8"
      )
      .catch((err) => {
        throw new Error(err);
      });

    const data = JSON.parse(file);
    return data;
  };

  const resJson = await loadFile();

  return NextResponse.json(resJson);
}
