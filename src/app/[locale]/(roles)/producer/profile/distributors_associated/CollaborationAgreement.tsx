import React from 'react';

export default function CollaborationAgreement() {
    const today = new Date();
    const date = today.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <section className="border-1 rounded-medium space-y-8 border p-4">
            <section className="space-y-4">
                <title>
                    Acuerdo de Intensiones entre Productor y Distribuidor
                </title>
                <p>
                    Este Acuerdo de Intensiones (&quot;Acuerdo&quot;) se
                    establece y entra en vigor a partir de la fecha de firma
                    electrónica por ambas partes, en adelante referidas como el
                    &quot;Productor&quot; y el &quot;Distribuidor&quot;. Este
                    Acuerdo tiene como objetivo establecer los términos y
                    condiciones bajo los cuales ambas partes colaborarán en la
                    venta y distribución de cerveza artesanal a través de la
                    plataforma en línea del Productor.
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="font-semibold text-2xl mb-4">
                    1. Responsabilidades del Productor:
                </h2>
                <h3>El Productor acuerda:</h3>

                <div className="mx-6">
                    <summary>
                        Fabricar y/o adquirir cerveza artesanal de alta calidad
                        para la venta a través de la plataforma en línea.
                    </summary>
                    <summary>
                        Proporcionar descripciones precisas y detalladas de los
                        productos, incluyendo información sobre ingredientes,
                        perfiles de sabor y etiquetado.
                    </summary>
                    <summary>
                        Gestionar adecuadamente los niveles de inventario para
                        garantizar la disponibilidad constante de productos.
                    </summary>
                    <summary>
                        Proporcionar imágenes y contenido multimedia de alta
                        calidad para promocionar los productos en la plataforma
                        en línea.
                    </summary>
                    <summary>
                        Procesar y cumplir con los pedidos en un plazo
                        razonable, asegurando un embalaje seguro y adecuado.
                    </summary>
                    <summary>
                        Brindar atención al cliente a través de la plataforma en
                        línea para resolver consultas y problemas relacionados
                        con los productos.
                    </summary>
                </div>
            </section>

            <section className="space-y-2">
                <h2 className="font-semibold text-2xl mb-4">
                    2. Responsabilidades del Distribuidor:
                </h2>
                <h3>El Distribuidor acuerda:</h3>

                <div className="mx-6">
                    <summary>
                        Coordinar la logística y el transporte de los productos
                        desde las instalaciones del Productor hasta los destinos
                        de entrega.
                    </summary>

                    <summary>
                        Gestionar la recepción, inspección y almacenamiento
                        adecuado de los productos en sus instalaciones.
                    </summary>

                    <summary>
                        Planificar rutas de entrega eficientes para asegurar la
                        entrega oportuna y en condiciones óptimas.
                    </summary>

                    <summary>
                        Proporcionar actualizaciones periódicas al Productor
                        sobre el estado de los envíos y la disponibilidad de
                        inventario.
                    </summary>

                    <summary>
                        Comunicar cualquier problema relacionado con la entrega,
                        como retrasos, daños o devoluciones, de manera
                        inmediata.
                    </summary>

                    <summary>
                        Colaborar con el Productor en la resolución de problemas
                        logísticos y en la optimización de la cadena de
                        suministro.
                    </summary>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="font-semibold text-2xl mb-4">
                    3. Términos Generales:{' '}
                </h2>

                <div className="mx-6">
                    <summary>
                        El Distribuidor se compromete a cumplir con los términos
                        y condiciones establecidos en el Acuerdo de Distribución
                        de Cerveza Artesanal (`&quot;`Acuerdo de
                        Distribución`&quot;`) entre el Productor y la Plataforma
                        en Línea.
                    </summary>

                    <summary>
                        Ambas partes acuerdan mantener la confidencialidad de
                        cualquier información sensible compartida durante la
                        colaboración.
                    </summary>

                    <summary>
                        Cualquier cambio significativo en los productos, precios
                        o términos de venta requerirá el consentimiento mutuo
                        por escrito.
                    </summary>

                    <summary>
                        Este Acuerdo tendrá una duración inicial de [duración
                        inicial] y se renovará automáticamente por períodos de
                        [duración de renovación] a menos que una de las partes
                        notifique su intención de finalizar con [aviso de
                        terminación] de anticipación.
                    </summary>

                    <summary>
                        Cualquiera de las partes podrá rescindir este Acuerdo en
                        caso de incumplimiento sustancial por parte de la otra
                        parte, con previo aviso por escrito y oportunidad de
                        rectificación dentro de un período [período de
                        rectificación].
                    </summary>

                    <summary>
                        Este Acuerdo constituye el entendimiento completo entre
                        las partes y reemplaza cualquier acuerdo anterior, ya
                        sea oral o escrito, relacionado con la colaboración.
                    </summary>
                </div>
            </section>

            <section className="space-y-4">
                <div className="">
                    Ambas partes, el Productor y el Distribuidor, han revisado,
                    entendido y aceptado los términos de este Acuerdo en su
                    totalidad y lo firman electrónicamente en la fecha de abajo.
                </div>

                <div>
                    <time>
                        Fecha: <i>{date}</i>
                    </time>
                </div>
            </section>
        </section>
    );
}
