import React from 'react';

export default function WhoWeAre() {
    return (
        <div className="bg-[url('/assets/home/bg-home.webp')] bg-auto bg-repeat bg-top pb-32 min-h-[70vh] max-w-[1540px] m-auto">
            <div className="container my-16 w-[1200px] m-auto bg-white border-4 border-beer-blonde p-1 max-w-[95vw] shadow-lg">
                <div className="border-beer-blonde border-2 p-6 sm:p-12">
                <div className="font-bold sm:pr-12 font-['NexaRust-script'] sm:text-7xl text-5xl text-beer-draft mb-12">
                        Quiénes somos
                    </div>
                    <div className="my-12 text-xl">
                        Somos una comunidad de productores, distribuidores y
                        apasionados de la cerveza artesanal, buscando fomentar
                        el intercambio de conocimientos y la innovación en el
                        sector
                    </div>
                    <div className="mb-6">
                        Envíanos un WhatsApp y estaremos encantados de atenderte
                        (+34 687 859 655)
                    </div>

                    <div>
                        Si tu consulta es urgente, llámanos!. Lunes a viernes de
                        9:00 a 20:00h / Sábados de 9:00 a 14:00h +34 687 859 655
                    </div>
                </div>
            </div>
        </div>
    );
}
