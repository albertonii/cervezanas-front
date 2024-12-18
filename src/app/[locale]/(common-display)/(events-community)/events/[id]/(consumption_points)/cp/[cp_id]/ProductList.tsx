import CPProductItem from './CPProductItem';
import Title from '@/app/[locale]/components/ui/Title';
import TR from '@/app/[locale]/components/ui/table/TR';
import TH from '@/app/[locale]/components/ui/table/TH';
import Table from '@/app/[locale]/components/ui/table/Table';
import THead from '@/app/[locale]/components/ui/table/THead';
import TBody from '@/app/[locale]/components/ui/table/TBody';
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

const ProductList: React.FC<Props> = ({ cpEvent, eventId }) => {
    const t = useTranslations();

    const activeCPProducts = cpEvent?.cp_products?.filter(
        (cp_product: IConsumptionPointProduct) => cp_product.is_active,
    );

    return (
        <>
            {activeCPProducts && activeCPProducts.length > 0 && (
                <section>
                    <Title size="xlarge" color="beer-blonde">
                        {t('products')}
                    </Title>

                    <div className="overflow-x-auto mt-4">
                        <Table>
                            <THead>
                                <TR>
                                    <TH class_="hidden sm:table-cell">
                                        {t('img')}
                                    </TH>
                                    <TH>{t('name_header')}</TH>
                                    <TH class_="hidden sm:table-cell">
                                        {t('pack_name_header')}
                                    </TH>
                                    <TH class_="hidden sm:table-cell">
                                        {t('quantity_in_pack_header')}
                                    </TH>
                                    <TH>{t('price_header')}</TH>
                                    <TH class_="hidden sm:table-cell">
                                        {t('type_header')}
                                    </TH>
                                    <TH>{t('action_header')}</TH>
                                </TR>
                            </THead>

                            <TBody>
                                {activeCPProducts.map(
                                    (cpProduct: IConsumptionPointProduct) => (
                                        <CPProductItem
                                            key={cpProduct.id}
                                            cpProduct={cpProduct}
                                            eventId={eventId}
                                            cpEvent={cpEvent}
                                        />
                                    ),
                                )}
                            </TBody>
                        </Table>
                    </div>
                </section>
            )}
        </>
    );
};

export default ProductList;
