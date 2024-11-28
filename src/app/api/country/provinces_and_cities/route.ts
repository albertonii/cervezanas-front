import { JSONSubRegion } from '@/lib/types/distribution_areas';
import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);

    const country = requestUrl.searchParams.get('name');
    const fileName = requestUrl.searchParams.get('fileName');

    if (!country) {
        throw new Error('No country provided');
    }

    const loadFile = async () => {
        const file = await fs
            .readFile(
                path.resolve(
                    process.cwd(),
                    'public',
                    'data',
                    country,
                    fileName + '.json',
                ),
                'utf8',
            )
            .catch((err) => {
                throw new Error(err);
            });

        const data = JSON.parse(file);
        return data;
    };

    const resJson = (await loadFile()) as JSONSubRegion[];

    return NextResponse.json(resJson);
}
