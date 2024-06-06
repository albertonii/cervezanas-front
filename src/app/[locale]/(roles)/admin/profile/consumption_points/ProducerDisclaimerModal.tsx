import { useTranslations } from 'next-intl';
import React, { ComponentProps } from 'react';
import Modal from '../../../../components/modals/Modal';

interface Props {
    isProducer: boolean;
    handleSetIsProducer: ComponentProps<any>;
    handleCloseModal: ComponentProps<any>;
}

export default function ProducerDisclaimerModal({
    isProducer,
    handleSetIsProducer,
    handleCloseModal,
}: Props) {
    const t = useTranslations();
    return (
        <Modal
            showBtn={false}
            showModal={isProducer}
            setShowModal={handleSetIsProducer}
            btnTitle={t('accept')}
            title={'Bienvenido a Cervezanas'}
            description={'¡Gracias por registrarse como productor!'}
            handler={() => handleCloseModal()}
            handlerClose={() => handleCloseModal()}
            classIcon={''}
            classContainer={''}
        >
            <section className="space-y-4">
                <p>
                    Al registrarse como{' '}
                    <span className="font-semibold">productor</span> en la
                    aplicación Cervezanas, acepta que su acceso a las funciones
                    y servicios ofrecidos por la plataforma está sujeto a una
                    revisión y aprobación por parte de nuestro equipo.
                </p>
                <p>Por favor, tenga en cuenta lo siguiente:</p>

                <p>
                    <span className="font-semibold">
                        Revisión de la Solicitud:
                    </span>{' '}
                    Su solicitud de registro como productor será revisada por
                    nuestro equipo. Este proceso puede tomar cierto tiempo
                    mientras verificamos la información proporcionada y
                    aseguramos que cumple con nuestros estándares de calidad y
                    normativas legales.
                </p>

                <p>
                    <span className="font-semibold">Aprobación:</span> El acceso
                    completo a la aplicación y sus funciones estará disponible
                    únicamente una vez que su solicitud haya sido aprobada por
                    Cervezanas. Le notificaremos sobre el estado de su solicitud
                    a través del correo electrónico proporcionado durante el
                    registro.
                </p>

                <p>
                    <span className="font-semibold">
                        Información Verdadera y Actualizada:
                    </span>
                    Es su responsabilidad asegurarse de que toda la información
                    proporcionada durante el proceso de registro sea verdadera,
                    precisa y esté actualizada.
                </p>

                <p>
                    <span className="font-semibold">
                        No Garantía de Aprobación:
                    </span>{' '}
                    El envío de su solicitud no garantiza su aprobación.
                    Cervezanas se reserva el derecho de aprobar o rechazar
                    solicitudes de acuerdo a su criterio.
                </p>

                <p>
                    <span className="font-semibold">Consultas y Contacto:</span>{' '}
                    Si tiene preguntas o necesita asistencia durante el proceso
                    de registro, por favor contáctenos a{' '}
                    <i>cervezanas@socialinnolabs.org</i> .
                </p>

                <p>
                    Al hacer clic en &quot;Aceptar&quot;, reconoce que ha leído
                    y entendido este disclaimer y acepta sus términos.
                </p>
            </section>
        </Modal>
    );
}
