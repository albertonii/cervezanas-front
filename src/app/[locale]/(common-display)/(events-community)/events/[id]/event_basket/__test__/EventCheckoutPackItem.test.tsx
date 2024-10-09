import { Type as ProductType } from '@/lib/productEnum';
import {
    IProduct,
    IProductPack,
    IProductPackCartItem,
} from '@/lib/types/types';
import EventCheckoutPackItem from '../EventCheckoutPackItem';
import {
    Aroma,
    aroma_options,
    Color,
    color_options,
    Era,
    era_options,
    Family,
    family_options,
    Fermentation,
    fermentation_options,
    Format,
    format_options,
    Origin,
    origin_options,
    Volume_can,
} from '@/lib/beerEnum';
import { render } from '@/utils/testing_/test-util';
import { screen } from '@testing-library/react';

const item: IProductPackCartItem = {
    id: '1',
    name: 'Jaira IPA',
    image: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
    price: 2,
    quantity: 6,
    packs: [
        {
            id: '1',
            created_at: '2021-08-10T15:00:00.000Z',

            name: 'Pack 1',
            price: 1000,
            quantity: 6,
            img_url:
                'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
            randomUUID: '1',
            product_id: '1',
        },
    ],
};

const productWithInfo: IProduct = {
    id: '1',
    created_at: '2021-08-10T15:00:00.000Z',
    name: 'Jaira IPA',
    description: 'Cerveza Jaira IPA',
    type: ProductType.BEER,
    is_public: true,
    discount_code: '',
    discount_percent: 0,
    price: 1000,
    campaign_id: '-1',
    is_archived: false,
    category: 'Beer',
    is_monthly: false,
    owner_id: '1',
    beers: [
        {
            id: '1',
            created_at: '2021-08-10T15:00:00.000Z',
            category: 'Beer',
            fermentation: fermentation_options[Fermentation.lagered].label,
            color: color_options[Color.gold].label,
            family: family_options[Family.amber_lager].label,
            era: era_options[Era.traditional].label,
            aroma: aroma_options[Aroma.fruity].label,
            format: format_options[Format.bottle].label,
            volume: Volume_can._330,
            origin: origin_options[Origin.eu_oc].label,
            is_gluten: false,
            sku: 'SKU',
            weight: 0,
            intensity: 5.5,
            product_id: '1',
            country: 'España',
            composition: 'Agua, malta de cebada, lúpulo y levadura.',
            srm: 0,
            og: 0,
            fg: 0,
        },
    ],
    product_multimedia: [
        {
            id: '1',
            p_principal: '',
            p_back: '',
            p_extra_1: '',
            p_extra_2: '',
            p_extra_3: '',
            p_extra_4: '',
            v_principal: '',
            v_extra_1: '',
            v_extra_2: '',
        },
    ],
};

const pack: IProductPack = {
    id: '1',
    created_at: '2021-08-10T15:00:00.000Z',
    quantity: 6,
    price: 1000,
    img_url:
        'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
    name: 'Pack 1',
    randomUUID: '1',
    product_id: '1',
};

describe('Event Cart Item', () => {
    it('Should render the Event Cart Item', () => {
        render(
            <EventCheckoutPackItem
                productPack={item}
                productWithInfo={productWithInfo}
                pack={pack}
            />,
        );
    });

    it('Should render the Event Cart Item and Check Prueba', () => {
        render(
            <EventCheckoutPackItem
                productPack={item}
                productWithInfo={productWithInfo}
                pack={pack}
            />,
        );

        const headingPackName = screen.getByRole('heading', {
            name: 'Pack 1',
        });
        expect(headingPackName).toBeInTheDocument();

        const paragraphFermentation = screen.getByText(
            productWithInfo.beers.fermentation,
        );
        expect(paragraphFermentation).toBeInTheDocument();
    });
});
