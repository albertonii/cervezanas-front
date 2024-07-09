import React from 'react';
import useFetchDistributorById from '../../../../../../hooks/useFetchDistributorById';
import { useAuth } from '../../../../(auth)/Context/useAuth';

interface Props {
    distributorId: string;
}

export default function CollaborationDetails({ distributorId }: Props) {
    const { user: producer } = useAuth();

    const { data: distributor, isError } =
        useFetchDistributorById(distributorId);
    if (isError) return <p>There was an error</p>;

    if (!distributor) return <p>Loading...</p>;

    return (
        <section className="border-1 rounded-medium space-y-8 border p-2">
            <title>
                Este Acuerdo de Colaboración (`&quot;`Acuerdo`&quot;`) se
                celebra entre:
            </title>

            <section className="space-y-2">
                <h2 className="font-semibold">PARTES:</h2>
                <div>
                    <h3 className="font-semibold">Productor:</h3>

                    <div className="mx-6 space-y-2">
                        <summary>
                            Nombre de la Compañía: [Nombre de la Compañía del
                            Productor]
                        </summary>

                        <summary>
                            Domicilio Legal: [Dirección del Domicilio Legal del
                            Productor]
                        </summary>

                        <summary>
                            Número de Identificación Fiscal: [Número de
                            Identificación Fiscal del Productor]
                        </summary>

                        <summary>
                            Representante Legal: [Nombre del Representante
                            Legal]
                        </summary>

                        <summary>
                            Correo Electrónico: [Correo Electrónico del
                            Representante Legal]
                        </summary>

                        <summary>
                            Teléfono de Contacto: [Número de Teléfono del
                            Representante Legal]
                        </summary>
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold">Distribuidor</h3>

                    <div className="mx-6 space-y-2">
                        <summary>
                            Nombre de la Compañía: {distributor?.company_name}
                        </summary>

                        {distributor.profile_location && (
                            <>
                                <address className="flex flex-col">
                                    <summary>Domicilio Legal:</summary>
                                    <i>
                                        {
                                            distributor.profile_location[0]
                                                ?.address_1
                                        }{' '}
                                        {distributor.profile_location[0]?.city}{' '}
                                        -{' '}
                                        {
                                            distributor.profile_location[0]
                                                ?.sub_region
                                        }{' '}
                                        -{' '}
                                        {
                                            distributor.profile_location[0]
                                                ?.region
                                        }{' '}
                                        -{' '}
                                        {
                                            distributor.profile_location[0]
                                                ?.country
                                        }{' '}
                                        -{' '}
                                        {
                                            distributor.profile_location[0]
                                                ?.postalcode
                                        }
                                    </i>
                                </address>

                                <summary>
                                    Número de Identificación Fiscal: [Número de
                                    Identificación Fiscal del Distribuidor]
                                </summary>

                                <summary>
                                    Representante Legal:{' '}
                                    <i>
                                        {distributor.users?.name +
                                            ' ' +
                                            distributor.users?.lastname}
                                    </i>
                                </summary>

                                <summary>
                                    Correo Electrónico:{' '}
                                    <i>{distributor.users?.email}</i>
                                </summary>

                                <summary>
                                    Teléfono de Contacto:{' '}
                                    <i>
                                        {
                                            distributor?.profile_location[0]
                                                ?.phone
                                        }
                                    </i>
                                </summary>
                            </>
                        )}
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
