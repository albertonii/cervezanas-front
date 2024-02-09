import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);

  const country = requestUrl.searchParams.get('country');

  if (!country) {
    throw new Error('No country provided');
  }

  const loadProvinceFile = async (country: string) => {
    const provincesFile = await fs
      .readFile(
        process.cwd() + `/public/data/${country}/provinces.json`,
        'utf8',
      )
      .catch((err) => {
        throw new Error(err);
      });

    const provinces = JSON.parse(provincesFile);
    return provinces;
  };

  const loadRegionsFile = async (country: string) => {
    const regionsFile = await fs
      .readFile(process.cwd() + `/public/data/${country}/regions.json`, 'utf8')
      .catch((err) => {
        throw new Error(err);
      });

    const regions = JSON.parse(regionsFile);
    return regions;
  };

  const loadDistrictsFile = async (country: string) => {
    const regionsFile = await fs
      .readFile(
        process.cwd() + `/public/data/${country}/districts.json`,
        'utf8',
      )
      .catch((err) => {
        throw new Error(err);
      });

    const districts = JSON.parse(regionsFile);
    return districts;
  };

  if (country === 'spain' || country === 'italy') {
    const resJson = await loadProvinceFile(country);
    return NextResponse.json(resJson);
  } else if (country === 'france') {
    const resJson = await loadRegionsFile(country);
    return NextResponse.json(resJson);
  } else if (country === 'portugal') {
    const resJson = await loadDistrictsFile(country);
    return NextResponse.json(resJson);
  } else {
    throw new Error('Country not found');
  }
}
