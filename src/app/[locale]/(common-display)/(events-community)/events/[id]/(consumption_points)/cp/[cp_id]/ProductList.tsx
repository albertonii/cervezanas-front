import CPProductItem from './CPProductItem';
import TR from '@/app/[locale]/components/ui/table/TR';
import Title from '@/app/[locale]/components/ui/Title';
import TH from '@/app/[locale]/components/ui/table/TH';
import TBody from '@/app/[locale]/components/ui/table/TBody';
import THead from '@/app/[locale]/components/ui/table/THead';
import Table from '@/app/[locale]/components/ui/table/Table';
import React from 'react';
import { useTranslations } from 'next-intl';
import {
    IConsumptionPointEvent,
    IConsumptionPointProduct,
} from '@/lib/types/consumptionPoints';

interface Props {
    cpEvent: IConsumptionPointEvent;
    eventId: string;
}

export default function ProductList({ cpEvent, eventId }: Props) {
    const t = useTranslations();
    const { cp } = cpEvent;

    const activeCPProducts = cp?.cp_products?.filter(
        (cp_product: IConsumptionPointProduct) => cp_product.is_active,
    );

    console.log('ACTIVE PRODUCTS', activeCPProducts);

    return (
        <>
            {activeCPProducts && activeCPProducts.length > 0 && (
                <section className="overflow-x-auto">
                    <Title size={'large'} color={'beer-blonde'}>
                        {t('products')}
                    </Title>

                    <Table>
                        <THead>
                            <TR>
                                <TH scope="col">{t('img')}</TH>

                                <TH scope="col">{t('name_header')}</TH>

                                <TH scope="col">{t('pack_name_header')}</TH>

                                <TH scope="col">
                                    {t('quantity_in_pack_header')}
                                </TH>

                                <TH scope="col">{t('price_header')}</TH>

                                <TH scope="col">{t('type_header')}</TH>

                                <TH scope="col">{t('action_header')}</TH>
                            </TR>
                        </THead>

                        <TBody>
                            {activeCPProducts.map(
                                (cpProduct: IConsumptionPointProduct) => (
                                    <>
                                        {cpProduct.product_packs &&
                                            cpProduct.is_active && (
                                                <CPProductItem
                                                    cpProduct={cpProduct}
                                                    eventId={eventId}
                                                    cpEvent={cpEvent}
                                                />
                                            )}
                                    </>
                                ),
                            )}
                        </TBody>
                    </Table>
                </section>
            )}
        </>
    );
}
