import React from 'react';
import { IDistributorUser, IProducerUser } from '@/lib/types/types';
import { useTranslations } from 'next-intl';

interface Props {
    distributor: IDistributorUser;
    producer: IProducerUser;
}

export default function CollaborationDetails({ distributor, producer }: Props) {
    const t = useTranslations();
    // const { data: distributor, isError } =
    //     useFetchDistributorById(distributorId);
    // if (isError) return <p>There was an error</p>;

    if (!distributor) return <p>Loading...</p>;

    return (
        <section className="border-1 rounded-medium space-y-8 border p-4">
            <title>
                Este Acuerdo de Colaboración (`&quot;`Acuerdo`&quot;`) se
                celebra entre:
            </title>

            <h2 className="font-semibold text-3xl text-beer-draft">PARTES:</h2>

            <section className="space-y-2">
                <div>
                    <h3 className="font-semibold text-2xl mb-4 capitalize">{t('producer')}:</h3>

                    <div className="mx-6 space-y-2">
                        <summary>
                            {t('company_name')}: {t(producer.company_name)}
                        </summary>

                        <summary>
                            {t('identification_fiscal_number')}:{' '}
                            {t(producer.id_number)}
                        </summary>

                        <summary>
                            {t('representative_name')}: [Nombre del
                            Representante Legal]
                        </summary>

                        <summary>
                            {t('email')}: {t(producer.company_email)}
                        </summary>

                        <summary>
                            {t('phone')}: {t(producer.company_phone)}
                        </summary>
                    </div>
                </div>
            </section>

            <section className="space-y-2">
                <div>
                    <h3 className="font-semibold text-2xl mb-4 capitalize">{t('distributor')}:</h3>

                    <div className="mx-6 space-y-2">
                        <summary>
                            {t('company_name')}: {t(distributor.company_name)}
                        </summary>

                        <summary>
                            {t('identification_fiscal_number')}:{' '}
                            {t(distributor.id_number)}
                        </summary>

                        <summary>
                            {t('representative_name')}: [Nombre del
                            Representante Legal]
                        </summary>

                        <summary>
                            {t('email')}: {t(distributor.company_email)}
                        </summary>

                        <summary>
                            {t('phone')}: {t(distributor.company_phone)}
                        </summary>
                    </div>
                </div>

                <p>
                    En adelante, referidos como &quot;el Productor&quot; y
                    &quot;el Distribuidor&quot; respectivamente.
                </p>
            </section>
        </section>
    );
}
