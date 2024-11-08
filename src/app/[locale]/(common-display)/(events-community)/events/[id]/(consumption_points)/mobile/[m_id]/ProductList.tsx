import CPMProduct from './CPMProductItem';
import TR from '@/app/[locale]/components/ui/table/TR';
import Title from '@/app/[locale]/components/ui/Title';
import TH from '@/app/[locale]/components/ui/table/TH';
import TBody from '@/app/[locale]/components/ui/table/TBody';
import THead from '@/app/[locale]/components/ui/table/THead';
import React from 'react';
import { Table } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICPMobile, ICPMProducts } from '@/lib/types/types';

interface Props {
    cpMobile: ICPMobile;
    eventId: string;
}

export default function ProductList({ cpMobile, eventId }: Props) {
    const t = useTranslations();
    const { cpm_products } = cpMobile;

    const activeCPMProducts = cpm_products?.filter(
        (cpm_product: ICPMProducts) => cpm_product.is_active,
    );

    return (
        <>
            {activeCPMProducts && activeCPMProducts.length > 0 && (
                <section className="overflow-x-auto">
                    <Title size={'small'} color={'black'}>
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

                                <TH scope="col" class_="hidden md:block">
                                    {t('description_header')}
                                </TH>

                                <TH scope="col">{t('price_header')}</TH>

                                <TH scope="col" class_="hidden md:block">
                                    {t('type_header')}
                                </TH>

                                <TH scope="col">{t('action_header')}</TH>
                            </TR>
                        </THead>

                        <TBody>
                            {activeCPMProducts.map(
                                (cpm_product: ICPMProducts) => (
                                    <>
                                        {cpm_product.product_packs &&
                                            cpm_product.is_active && (
                                                <div key={cpm_product.id}>
                                                    <CPMProduct
                                                        pack={
                                                            cpm_product.product_packs
                                                        }
                                                        cpmId={cpm_product.id}
                                                        cpMobile={cpMobile}
                                                        eventId={eventId}
                                                    />
                                                </div>
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
