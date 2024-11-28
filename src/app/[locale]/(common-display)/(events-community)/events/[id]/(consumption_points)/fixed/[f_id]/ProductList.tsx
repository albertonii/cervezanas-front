import React from 'react';
import CPFProduct from './CPFProductItem';
import Title from '@/app/[locale]/components/ui/Title';
import TR from '@/app/[locale]/components/ui/table/TR';
import TH from '@/app/[locale]/components/ui/table/TH';
import Table from '@/app/[locale]/components/ui/table/Table';
import THead from '@/app/[locale]/components/ui/table/THead';
import TBody from '@/app/[locale]/components/ui/table/TBody';
import { useTranslations } from 'next-intl';
import {
    ICPFixed,
    ICPFProducts,
    ICPMProducts,
} from '@/lib/types/consumptionPoints';

interface Props {
    cpFixed: ICPFixed;
    eventId: string;
}

export default function ProductList({ cpFixed, eventId }: Props) {
    const t = useTranslations();
    const { cpf_products } = cpFixed;

    const activeCPFProducts = cpf_products?.filter(
        (cpf_product: ICPFProducts) => cpf_product.is_active,
    );

    return (
        <>
            {activeCPFProducts && activeCPFProducts.length > 0 && (
                <section className="overflow-x-auto">
                    <Title size="large" color="beer-blonde">
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

                                <TH scope="col" class_="hidden ">
                                    {t('description_header')}
                                </TH>

                                <TH scope="col">{t('price_header')}</TH>

                                <TH scope="col" class_="hidden ">
                                    {t('type_header')}
                                </TH>

                                <TH scope="col">{t('action_header')}</TH>
                            </TR>
                        </THead>

                        <TBody>
                            {activeCPFProducts.map((cpf: ICPMProducts) => (
                                <>
                                    {cpf.product_packs && (
                                        <CPFProduct
                                            key={cpf.id}
                                            pack={cpf.product_packs}
                                            cpfId={cpf.id}
                                            eventId={eventId}
                                            cpFixed={cpFixed}
                                        />
                                    )}
                                </>
                            ))}
                        </TBody>
                    </Table>
                </section>
            )}
        </>
    );
}
