import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);

    const country = requestUrl.searchParams.get("country");

    if (!country) {
      throw new Error("No country provided");
    }

    const loadProvinceFile = async (country: string) => {
      const provincesFile = await fs
        .readFile(
          process.cwd() + `/public/data/${country}/provinces.json`,
          "utf8"
        )
        .catch((err) => {
          throw new Error(err);
        });

      const provinces = JSON.parse(provincesFile);
      return provinces;
    };

    const resJson = await loadProvinceFile(country);

    return NextResponse.json(resJson);
  } catch (error) {
    return NextResponse.error();
  }
}
