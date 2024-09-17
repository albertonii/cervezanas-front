import { NextRequest, NextResponse } from 'next/server';
import createServerClient from '@/utils/supabaseServer';
import { generateFileNameExtension, isEmpty } from '@/utils/utils';
import { SupabaseProps } from '@/constants';
import readUserSession, { generateUUID } from '@/lib//actions';

export async function POST(request: NextRequest) {
    try {
        const randomUUID = await generateUUID();

        const supabase = await createServerClient();

        const session = await readUserSession();
        const userId = session?.id;

        const formData = await request.formData();

        const name = formData.get('name') as string;
        const foundationYear = parseInt(
            formData.get('foundation_year') as string,
        );
        const description = formData.get('description') as string;
        const history = formData.get('history') as string;
        const country = formData.get('country') as string;
        const region = formData.get('region') as string;
        const subRegion = formData.get('sub_region') as string;
        const city = formData.get('city') as string;
        const address = formData.get('address') as string;
        const website = formData.get('website') as string;
        const rrss_ig = formData.get('rrss_ig') as string;
        const rrss_fb = formData.get('rrss_fb') as string;
        const rrss_linkedin = formData.get('rrss_linkedin') as string;
        const typesOfBeersProduced = formData.get(
            'types_of_beers_produced',
        ) as string;
        const specialProcessingMethods = formData.get(
            'special_processing_methods',
        ) as string;
        const guidedTours = formData.get('guided_tours') as string;

        const logo = formData.get('logo') as File;
        let logoFileName = null;

        // Transformar string a array separado por comas
        const typesOfBeersProducedArray = typesOfBeersProduced.split(',');
        const specialProcessingMethodsArray =
            specialProcessingMethods.split(',');

        if (!isEmpty(logo)) {
            logoFileName = `${randomUUID}${generateFileNameExtension(
                logo.name,
            )}`;
            const logoFile = logo as File;

            const { error } = await supabase.storage
                .from(SupabaseProps.BREWERIES_LOGOS)
                .upload(logoFileName, logoFile);

            if (error) {
                return NextResponse.json(
                    { message: 'Error uploading logo' },
                    { status: 500 },
                );
            }
        }

        // Insertar en la tabla de cervecerías
        const { error } = await supabase.from('breweries').insert({
            name,
            foundation_year: foundationYear,
            description,
            history,
            country,
            region,
            sub_region: subRegion,
            city,
            address,
            website,
            rrss_ig,
            rrss_fb,
            rrss_linkedin,
            types_of_beers_produced: typesOfBeersProducedArray,
            special_processing_methods: specialProcessingMethodsArray,
            guided_tours: guidedTours,
            logo: logo ? logoFileName : null,
            producer_id: userId,
        });

        if (error) {
            console.error('Error updating brewery', error);
            return NextResponse.json(
                { message: 'Error updating brewery' },
                { status: 500 },
            );
        }

        return NextResponse.json(
            { message: 'Brewery successfully created' },
            { status: 200 },
        );
    } catch (err) {
        return NextResponse.json(
            { message: 'Error updating brewery' },
            { status: 500 },
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const randomUUID = await generateUUID();

        const supabase = await createServerClient();

        const session = await readUserSession();
        const userId = session?.id;

        const formData = await request.formData();

        const breweryId = formData.get('brewery_id') as string;
        const name = formData.get('name') as string;
        const foundationYear = parseInt(
            formData.get('foundation_year') as string,
        );
        const description = formData.get('description') as string;
        const history = formData.get('history') as string;
        const country = formData.get('country') as string;
        const region = formData.get('region') as string;
        const subRegion = formData.get('sub_region') as string;
        const city = formData.get('city') as string;
        const address = formData.get('address') as string;
        const website = formData.get('website') as string;
        const rrss_ig = formData.get('rrss_ig') as string;
        const rrss_fb = formData.get('rrss_fb') as string;
        const rrss_linkedin = formData.get('rrss_linkedin') as string;
        const typesOfBeersProduced = formData.get(
            'types_of_beers_produced',
        ) as string;
        const specialProcessingMethods = formData.get(
            'special_processing_methods',
        ) as string;
        const guidedTours = formData.get('guided_tours') as string;

        const logo = formData.get('logo') as File;
        let logoFileName = null;

        // Transformar string a array separado por comas
        const typesOfBeersProducedArray = typesOfBeersProduced.split(',');
        const specialProcessingMethodsArray =
            specialProcessingMethods.split(',');

        if (!isEmpty(logo)) {
            logoFileName = `${randomUUID}${generateFileNameExtension(
                logo.name,
            )}`;
            const logoFile = logo as File;

            const { error } = await supabase.storage
                .from(SupabaseProps.BREWERIES_LOGOS)
                .upload(logoFileName, logoFile);

            if (error) {
                return NextResponse.json(
                    { message: 'Error uploading logo' },
                    { status: 500 },
                );
            }
        }

        // Insertar en la tabla de cervecerías
        const { error } = await supabase
            .from('breweries')
            .update({
                name,
                foundation_year: foundationYear,
                description,
                history,
                country,
                region,
                sub_region: subRegion,
                city,
                address,
                website,
                rrss_ig,
                rrss_fb,
                rrss_linkedin,
                types_of_beers_produced: typesOfBeersProducedArray,
                special_processing_methods: specialProcessingMethodsArray,
                guided_tours: guidedTours,
                logo: logo ? logoFileName : null,
                producer_id: userId,
            })
            .eq('id', breweryId);

        if (error) {
            console.error('Error updating brewery', error);
            return NextResponse.json(
                { message: 'Error updating brewery' },
                { status: 500 },
            );
        }

        return NextResponse.json(
            { message: 'Brewery successfully updated' },
            { status: 200 },
        );
    } catch (err) {
        return NextResponse.json(
            { message: 'Error updating brewery' },
            { status: 500 },
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const formData = await request.formData();

        const supabase = await createServerClient();

        const breweryId = formData.get('brewery_id') as string;

        const { error: productError } = await supabase
            .from('breweries')
            .delete()
            .eq('id', breweryId);

        if (productError) {
            return NextResponse.json(
                { message: 'Error deleting brewery' },
                { status: 500 },
            );
        }

        return NextResponse.json(
            { message: 'Brewery successfully deleted' },
            { status: 200 },
        );
    } catch (err) {
        return NextResponse.json(
            { message: 'Error deleting brewery' },
            { status: 500 },
        );
    }
}
