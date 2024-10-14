import Image from 'next/image';
import React from 'react';
import { IMonthlyProduct } from '@/lib//types/types';
import MonthlyBeers from './MonthlyBeers';
import MonthlyCardItem from './MonthlyCardItem';

interface Props {
    monthlyProducts: IMonthlyProduct[];
}

export function Hero({ monthlyProducts }: Props) {
    return (
        <>
            {/*  bloque 1 */}
            <div className="relative m-auto flex h-[220px] max-w-screen-2xl justify-center overflow-hidden border-gray-400 bg-cerv-cream p-4">
                <div className="flex w-full max-w-screen-2xl justify-center border-8 border-double pt-1">
                    <div className="relative left-0 hidden h-[180px] w-[180px] opacity-10 sm:block">
                        <Image
                            src="/assets/rec-graf1.webp"
                            alt="Rec Graf 1"
                            layout="fill"
                            objectFit="cover"
                            className="bg-right bg-no-repeat"
                        />
                    </div>

                    <div className=" block w-full justify-center pt-7 text-center text-2xl font-bold sm:inline-flex lg:text-4xl">
                        <div className="z-index-1 relative -left-12 -top-7 hidden h-[170px] w-[170px] sm:block">
                            <Image
                                src="/assets/logo.svg"
                                alt="Logo"
                                layout="fill"
                                objectFit="contain"
                            />
                        </div>
                        <div className="">
                            EL LUGAR DE ENCUENTRO PARA LOS AMANTES DE LA{' '}
                            <div className="text-3xl text-cerv-titlehigh lg:text-5xl">
                                CERVEZA ARTESANA
                            </div>
                        </div>
                    </div>
                    <div className="relative right-0 hidden h-[180px] w-[180px] opacity-10 sm:block">
                        <Image
                            src="/assets/rec-graF2.webp"
                            alt="Rec Graf 2"
                            layout="fill"
                            objectFit="cover"
                            className="bg-no-repeat"
                        />
                    </div>
                </div>
            </div>
            {/*  bloque 2 */}
            <div className="relative -top-12 m-auto w-full max-w-screen-2xl">
                <Image
                    src="/assets/home/home-fakebanner.webp"
                    alt="Home Fake Banner"
                    width={1920}
                    height={1080}
                />
            </div>
            {/*  bloque 3 */}
            <div className="relative -top-12 m-auto w-full max-w-screen-2xl justify-center bg-cerv-cream p-5 sm:block md:flex lg:flex">
                <div className="sm:w-full md:block md:w-1/2 md:px-3 lg:flex lg:w-1/2">
                    <div className="relative h-[350px] w-full md:w-full lg:h-full lg:w-1/2">
                        <Image
                            src="/assets/home/home-img-1.webp"
                            alt="Home Image 1"
                            layout="fill"
                            objectFit="cover" // or 'contain' as needed
                            priority={true}
                        />
                    </div>

                    <div className="p-8 sm:p-12 md:w-full md:p-8 lg:w-1/2 lg:p-5 xl:p-8">
                        <div className="m-auto text-center">
                            <Image
                                className="m-auto"
                                src="/assets/home/detalle.svg"
                                width={80}
                                height={80}
                                alt="Detalle"
                            />
                        </div>
                        <div className="pt-3 text-center text-2xl font-bold leading-6 text-cerv-titlehigh">
                            Un punto de encuentro
                        </div>

                        <div className="pt-3 text-justify leading-5">
                            La buena cerveza crea al artesano así como esta
                            comunidad a Cervezanas. Creamos experiencias únicas
                            para amantes de la música y la cerveza. Queremos que
                            conozcas los experimentos cerveceros más locos,
                            aquellas joyas escondidas y fabricadas con mimo para
                            ti. Somos el puente entre aquellos fabricantes de
                            cerveza artesanal aún por descubrir y tú.{' '}
                        </div>
                    </div>
                </div>
                <div className="sm:w-full md:block md:w-1/2 md:px-3 lg:flex  lg:w-1/2">
                    <div className="relative h-[350px] w-full md:w-full lg:h-full lg:w-1/2">
                        <Image
                            src="/assets/home/home-img-2.webp"
                            alt="Home Image 2"
                            layout="fill"
                            objectFit="cover" // or 'contain' as needed
                            priority={true}
                        />
                    </div>
                    <div className="p-8 sm:p-12 md:w-full md:p-8 lg:w-1/2 lg:p-5 xl:p-8">
                        <div className="m-auto text-center">
                            <Image
                                className="m-auto"
                                src="/assets/home/detalle.svg"
                                width={80}
                                height={80}
                                alt="Detalle"
                            />
                        </div>
                        <div className="pt-3 text-center text-2xl font-bold leading-6 text-cerv-titlehigh">
                            ¿Eres maestro cervecero o tienes tu propia receta?
                        </div>
                        <div className="pt-3 text-justify leading-5">
                            Desde Cervezanas estamos activamente en búsqueda del
                            siguiente aroma, descubriendo esa joya que has
                            creado y aún no ha salido al mundo. ¿Quieres formar
                            parte de esta comunidad de maestros cerveceros?{' '}
                        </div>
                    </div>
                </div>
            </div>
            {/*  bloque 4 */}
            <MonthlyBeers monthlyProducts={monthlyProducts} />

            {/*  bloque 5 */}
            <div className="relative m-auto w-full max-w-screen-2xl justify-center p-8 pb-20">
                <Image
                    src="/assets/home/fondo-marcas.webp"
                    alt="Fondo Marcas"
                    layout="fill"
                    objectFit="cover"
                    className="z-0"
                />
                <div className="mb-8 text-center text-4xl font-bold text-cerv-coffee md:text-5xl lg:text-left">
                    ¿Quieres saber la historia detrás de cada marca?
                </div>
                <div className="absolute -top-6 right-0 hidden h-[600px] w-[140px] lg:block">
                    <Image
                        src="/assets/home/botella-qr.webp"
                        alt="Botella QR"
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
                <div className="block lg:flex">
                    <div className="text-1xl mb-4 mr-6 w-full bg-cerv-titlehigh bg-opacity-80 p-7 pt-20 text-white lg:w-1/2">
                        <div>
                            Cervezanas se encarga de dar valor al trabajo que
                            está detrás de cada creador cervecero, cada producto
                            de nuestro catálogo está provisto de un
                            identificador único capaz de ser escaneado. Con él
                            tendrás acceso a información en exclusiva de ese
                            producto, además de poder participar en promociones,
                            descuentos y sorteos exclusivos de cada marca!
                        </div>
                        <div className="m-auto mt-8">
                            <Image
                                src="/assets/detalle-w.svg"
                                width={160}
                                height={160}
                                alt="Detalle"
                            />
                        </div>
                    </div>
                    <div className="w-full bg-cerv-cream p-7 text-center lg:w-1/2 lg:pr-32">
                        <div className="text-4xl font-bold text-cerv-coffee">
                            Escanea el código QR
                        </div>
                        <div className="pt-4 text-2xl">
                            Tendrás acceso a información de cada producto y
                            podrás participar en:
                            <ul className="pt-4 font-semibold">
                                <li>Promociones</li>
                                <li>Descuentos</li>
                                <li>Sorteos</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            {/*  bloque 6 */}
            <div className="relative m-auto w-full max-w-screen-2xl justify-center overflow-hidden bg-cerv-cream pb-20 pt-10">
                <div className="absolute left-2/4 m-auto -ml-80 hidden h-[700px] w-[700px] max-w-full opacity-10 sm:block sm:w-full">
                    <Image
                        src="/assets/rec-graf4.webp"
                        alt="Rec Graf 4"
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
                <div className="mb-10 text-center text-4xl font-bold text-cerv-coffee md:text-5xl">
                    Cervezas más vendidas
                </div>
                <div className="relative z-10 m-auto grid max-w-[300px] grid-cols-1 gap-0 sm:max-w-[600px] sm:grid-cols-2 md:gap-2 lg:max-w-full lg:grid-cols-5">
                    {/*  producto 1 */}
                    <div className="mb-6 mr-4 w-full max-w-[300px] bg-no-repeat">
                        <div className="bg-cerv-coffee text-center font-semibold text-cerv-cream">
                            MÍSTICA
                        </div>
                        <div className="relative h-[320px] w-full">
                            <Image
                                src="/assets/home/prod-1.webp"
                                alt="Producto 1"
                                layout="fill"
                                objectFit="cover"
                                className="bg-center bg-no-repeat"
                            />
                            <div className="relative right-2 float-right mt-10">
                                <div className="relative h-[30px] w-[30px] pt-1 text-center text-xs font-bold">
                                    <Image
                                        src="/assets/heart.svg"
                                        alt="Heart"
                                        layout="fill"
                                        objectFit="contain"
                                    />
                                    20
                                </div>
                                <div className="relative h-[30px] w-[30px] pt-1 text-center text-xs font-bold">
                                    <Image
                                        src="/assets/bla.svg"
                                        alt="Bla"
                                        layout="fill"
                                        objectFit="contain"
                                    />
                                    11
                                </div>
                            </div>
                        </div>
                        <div className="bg-cerv-coffee p-2">
                            <div className="text-center">
                                <Image
                                    className="m-auto"
                                    src="/assets/estrellas-fake.webp"
                                    width={110}
                                    height={110}
                                    alt="Estrellas"
                                />
                            </div>
                            <div className="mt-2 border-4 border-yellow-400 bg-cerv-coal p-1 text-center text-2xl font-bold text-cerv-cream">
                                ¡Conócela!
                            </div>
                        </div>
                    </div>
                    {/*  producto 2 */}
                    <div className="mb-6 mr-4 w-full max-w-[300px] bg-no-repeat">
                        <div className="bg-cerv-coffee text-center font-semibold text-cerv-cream">
                            BOSQUE ROJO
                        </div>
                        <div className="relative h-[320px] w-full">
                            <Image
                                src="/assets/home/prod-2.webp"
                                alt="Producto 2"
                                layout="fill"
                                objectFit="cover"
                                className="bg-center bg-no-repeat"
                            />
                            <div className="relative right-2 float-right mt-10">
                                <div className="relative h-[30px] w-[30px] pt-1 text-center text-xs font-bold">
                                    <Image
                                        src="/assets/heart.svg"
                                        alt="Heart"
                                        layout="fill"
                                        objectFit="contain"
                                    />
                                    20
                                </div>
                                <div className="relative h-[30px] w-[30px] pt-1 text-center text-xs font-bold">
                                    <Image
                                        src="/assets/bla.svg"
                                        alt="Bla"
                                        layout="fill"
                                        objectFit="contain"
                                    />
                                    22
                                </div>
                            </div>
                        </div>
                        <div className="bg-cerv-coffee p-2">
                            <div className=" text-center">
                                <Image
                                    className="m-auto"
                                    src="/assets/estrellas-fake.webp"
                                    width={110}
                                    height={110}
                                    alt="Estrellas"
                                />
                            </div>
                            <div className="mt-2 border-4 border-yellow-400 bg-cerv-coal p-1 text-center text-2xl font-bold text-cerv-cream">
                                ¡Conócela!
                            </div>
                        </div>
                    </div>
                    {/*  producto 3 */}
                    <div className="mb-6 mr-4 w-full max-w-[300px] bg-no-repeat">
                        <div className="bg-cerv-coffee text-center font-semibold text-cerv-cream">
                            AMARILLA
                        </div>
                        <div className="relative h-[320px] w-full">
                            <Image
                                src="/assets/home/prod-3.webp"
                                alt="Producto 3"
                                layout="fill"
                                objectFit="cover"
                                className="bg-center bg-no-repeat"
                            />
                            <div className="relative right-2 float-right mt-10">
                                <div className="relative h-[30px] w-[30px] pt-1 text-center text-xs font-bold">
                                    <Image
                                        src="/assets/heart.svg"
                                        alt="Heart"
                                        layout="fill"
                                        objectFit="contain"
                                    />
                                    15
                                </div>
                                <div className="relative h-[30px] w-[30px] pt-1 text-center text-xs font-bold">
                                    <Image
                                        src="/assets/bla.svg"
                                        alt="Bla"
                                        layout="fill"
                                        objectFit="contain"
                                    />
                                    17
                                </div>
                            </div>
                        </div>
                        <div className="bg-cerv-coffee p-2">
                            <div className=" text-center">
                                <Image
                                    className="m-auto"
                                    src="/assets/estrellas-fake.webp"
                                    width={110}
                                    height={110}
                                    alt="Estrellas"
                                />
                            </div>
                            <div className="mt-2 border-4 border-yellow-400 bg-cerv-coal p-1 text-center text-2xl font-bold text-cerv-cream">
                                ¡Conócela!
                            </div>
                        </div>
                    </div>
                    {/*  producto 4 */}
                    <div className="mb-6 mr-4 w-full max-w-[300px] bg-no-repeat">
                        <div className="bg-cerv-coffee text-center font-semibold text-cerv-cream">
                            LÚPULO DORADO
                        </div>
                        <div className="relative h-[320px] w-full">
                            <Image
                                src="/assets/home/prod-4.webp"
                                alt="Producto 4"
                                layout="fill"
                                objectFit="cover"
                                className="bg-center bg-no-repeat"
                            />
                            <div className="relative right-2 float-right mt-10">
                                <div className="relative h-[30px] w-[30px] pt-1 text-center text-xs font-bold">
                                    <Image
                                        src="/assets/heart.svg"
                                        alt="Heart"
                                        layout="fill"
                                        objectFit="contain"
                                    />
                                    10
                                </div>
                                <div className="relative h-[30px] w-[30px] pt-1 text-center text-xs font-bold">
                                    <Image
                                        src="/assets/bla.svg"
                                        alt="Bla"
                                        layout="fill"
                                        objectFit="contain"
                                    />
                                    21
                                </div>
                            </div>
                        </div>
                        <div className="bg-cerv-coffee p-2">
                            <div className=" text-center">
                                <Image
                                    className="m-auto"
                                    src="/assets/estrellas-fake.webp"
                                    width={110}
                                    height={110}
                                    alt="Estrellas"
                                />
                            </div>
                            <div className="mt-2 border-4 border-yellow-400 bg-cerv-coal p-1 text-center text-2xl font-bold text-cerv-cream">
                                ¡Conócela!
                            </div>
                        </div>
                    </div>
                    {/*  producto 5 */}
                    <div className="mr-4 hidden w-full max-w-[300px] bg-no-repeat lg:block">
                        <div className="bg-cerv-coffee text-center font-semibold text-cerv-cream">
                            LUPULENSIS
                        </div>
                        <div className="relative h-[320px] w-full">
                            <Image
                                src="/assets/home/prod-5.webp"
                                alt="Producto 5"
                                layout="fill"
                                objectFit="cover"
                                className="bg-center bg-no-repeat"
                            />
                            <div className="relative right-2 float-right mt-10">
                                <div className="relative h-[30px] w-[30px] pt-1 text-center text-xs font-bold">
                                    <Image
                                        src="/assets/heart.svg"
                                        alt="Heart"
                                        layout="fill"
                                        objectFit="contain"
                                    />
                                    12
                                </div>
                                <div className="relative h-[30px] w-[30px] pt-1 text-center text-xs font-bold">
                                    <Image
                                        src="/assets/bla.svg"
                                        alt="Bla"
                                        layout="fill"
                                        objectFit="contain"
                                    />
                                    13
                                </div>
                            </div>
                        </div>
                        <div className="bg-cerv-coffee p-2">
                            <div className=" text-center">
                                <Image
                                    className="m-auto"
                                    src="/assets/estrellas-fake.webp"
                                    width={110}
                                    height={110}
                                    alt="Estrellas"
                                />
                            </div>
                            <div className="mt-2 border-4 border-yellow-400 bg-cerv-coal p-1 text-center text-2xl font-bold text-cerv-cream">
                                ¡Conócela!
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*  bloque 6 */}
            <div className="relative m-auto w-full max-w-screen-2xl justify-center bg-cerv-cream pb-20 pt-10">
                <Image
                    src="/assets/rec-graf5.webp"
                    alt="Background Graphic"
                    layout="fill"
                    objectFit="contain"
                    className="z-0"
                />
                <div className="z-index-1 relative -top-8 m-auto h-[190px] w-[190px]">
                    <Image
                        src="/assets/logo.svg"
                        alt="Logo"
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
                <div className="mb-10 text-center text-4xl font-bold text-cerv-coffee md:text-6xl">
                    Comunidad Cervezanas
                </div>
                {/*  Productor */}
                <div className="m-auto block sm:flex">
                    <div className="m-auto w-full max-w-[300px] sm:w-2/4 sm:max-w-5xl">
                        <Image
                            className="m-auto p-0 sm:p-16"
                            src="/assets/home/com-1.webp"
                            width={300}
                            height={300}
                            alt="Comunidad Cervezanas"
                        />
                    </div>
                    <div className="m-auto w-full p-10 sm:w-2/4">
                        <div className="mb-8 pt-3 text-center text-4xl font-bold text-cerv-banana">
                            Productor
                        </div>
                        <div className="mb-8 pt-3 text-xl font-normal text-black">
                            <p>
                                Damos visibilidad a tu creación, nos encargamos
                                de todo para que puedas centrarte en tu pasión,
                                crear para hacernos disfrutar.
                            </p>
                            <p>
                                Ya tengas tu propia fábrica o tan solo la
                                receta, te ayudamos en todo el proceso de
                                producción.
                            </p>
                        </div>
                        <div className="m-auto text-center">
                            <Image
                                className="m-auto"
                                src="/assets/home/detalle.svg"
                                width={120}
                                height={120}
                                alt="Detalle"
                            />
                        </div>
                    </div>
                </div>
                {/*  Consumidor */}
                <div className="m-auto block sm:flex">
                    <div className="m-auto w-full p-10 sm:w-2/4">
                        <div className="mb-8 pt-3 text-center text-4xl font-bold text-cerv-banana">
                            Consumidor
                        </div>
                        <div className="mb-8 pt-3 text-xl font-normal text-black">
                            <p>
                                Damos visibilidad a tu creación, nos encargamos
                                de todo para que puedas centrarte en tu pasión,
                                crear para hacernos disfrutar.
                            </p>
                            <p>
                                Ya tengas tu propia fábrica o tan solo la
                                receta, te ayudamos en todo el proceso de
                                producción.
                            </p>
                        </div>
                        <div className="m-auto text-center">
                            <Image
                                className="m-auto"
                                src="/assets/home/detalle.svg"
                                width={120}
                                height={120}
                                alt="Detalle"
                            />
                        </div>
                    </div>
                    <div className="m-auto w-full max-w-[300px] sm:w-2/4 sm:max-w-5xl">
                        <Image
                            className="m-auto mb-6 p-0 sm:p-16"
                            src="/assets/home/com-2.webp"
                            width={300}
                            height={300}
                            alt="Comunidad Cervezanas"
                        />
                    </div>
                </div>
                {/*  Distribuidores */}
                <div className="m-auto block sm:flex">
                    <div className="m-auto w-full max-w-[300px] sm:w-2/4 sm:max-w-5xl">
                        <Image
                            className="m-auto p-0 sm:p-16"
                            src="/assets/home/com-3.webp"
                            width={300}
                            height={300}
                            alt="Comunidad Cervezanas"
                        />
                    </div>
                    <div className="m-auto w-full p-10 sm:w-2/4">
                        <div className="mb-8 pt-3 text-center text-4xl font-bold text-cerv-banana">
                            Distribuidores
                        </div>
                        <div className="mb-8 pt-3 text-xl font-normal text-black">
                            <p>
                                Damos visibilidad a tu creación, nos encargamos
                                de todo para que puedas centrarte en tu pasión,
                                crear para hacernos disfrutar.
                            </p>
                            <p>
                                Ya tengas tu propia fábrica o tan solo la
                                receta, te ayudamos en todo el proceso de
                                producción.
                            </p>
                        </div>
                        <div className="m-auto text-center">
                            <Image
                                className="m-auto"
                                src="/assets/home/detalle.svg"
                                width={120}
                                height={120}
                                alt="Detalle"
                            />
                        </div>
                    </div>
                </div>
                {/*  Puntos cervezanos */}
                <div className="m-auto block sm:flex">
                    <div className="m-auto w-full p-10 sm:w-2/4">
                        <div className="mb-8 pt-3 text-center text-4xl font-bold text-cerv-banana">
                            Puntos cervezanos
                        </div>
                        <div className="mb-8 pt-3 text-xl font-normal text-black">
                            <p>
                                Damos visibilidad a tu creación, nos encargamos
                                de todo para que puedas centrarte en tu pasión,
                                crear para hacernos disfrutar.
                            </p>
                            <p>
                                Ya tengas tu propia fábrica o tan solo la
                                receta, te ayudamos en todo el proceso de
                                producción.
                            </p>
                        </div>
                        <div className="m-auto text-center">
                            <Image
                                className="m-auto"
                                src="/assets/home/detalle.svg"
                                width={120}
                                height={120}
                                alt="Detalle"
                            />
                        </div>
                    </div>
                    <div className="m-auto w-full max-w-[300px] sm:w-2/4 sm:max-w-5xl">
                        <Image
                            className="m-auto p-0 sm:p-16"
                            src="/assets/home/com-4.webp"
                            width={300}
                            height={300}
                            alt="Comunidad Cervezanas"
                        />
                    </div>
                </div>
            </div>
            {/*  bloque 7 */}
            <div className="relative m-auto w-full  max-w-screen-2xl justify-center overflow-hidden bg-cerv-titlehigh p-5 ">
                <div className="absolute -left-36 top-20 h-[600px] w-[600px] opacity-20 mix-blend-multiply">
                    <Image
                        src="/assets/rec-graf4.webp"
                        alt="Rec Graf 4"
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
                <div className="mb-20 mt-10 text-center text-4xl font-bold text-white md:text-5xl">
                    Opiniones de nuestros Cervezanos y Cervezanas
                </div>
                {/*  review 1 */}
                <div className="relative z-10 m-auto block max-w-4xl bg-cerv-brown bg-opacity-70 px-10 pt-10 sm:flex">
                    <div className="w-full border-b-2 pb-10 text-white sm:w-2/6 sm:border-yellow-400">
                        <div className="text-xs">01/01/2023</div>
                        <div className="text-center text-xl sm:text-left">
                            Iñaki Aranguren
                        </div>
                        <div className="text-ml text-center text-beer-softFoam sm:text-left">
                            Consumidor Cervezano
                        </div>
                    </div>
                    <div className="w-full border-b-2 pb-10 sm:w-1/6 sm:border-yellow-400">
                        <Image
                            className="m-auto"
                            src="/assets/estrellas-fake.webp"
                            width={100}
                            height={100}
                            alt="Estrellas"
                        />
                    </div>
                    <div className="w-full border-b-2 border-yellow-400 px-10 pb-10 sm:w-3/6">
                        <div className="font-bold text-yellow-400 ">
                            Titular
                        </div>
                        <div className="text-white">
                            Lorem ipsum dolor sit amet, consectetuer adipiscing
                            elit, sed diam nonummy nibh euismod tincidunt ut
                            laoreet dolore magna aliquam erat volutpat.{' '}
                        </div>
                    </div>
                </div>
                {/*  review 2 */}
                <div className="relative z-10 m-auto block max-w-4xl bg-cerv-brown bg-opacity-70 px-10 pt-10 sm:flex">
                    <div className="w-full border-b-2 pb-10 text-white sm:w-2/6 sm:border-yellow-400">
                        <div className="text-xs">01/01/2023</div>
                        <div className="text-center text-xl sm:text-left">
                            María Schneider
                        </div>{' '}
                        <div className="text-center text-beer-softFoam sm:text-left">
                            Productor Cervezano
                        </div>
                    </div>
                    <div className=" w-full border-b-2 pb-10 sm:w-1/6 sm:border-yellow-400">
                        <Image
                            className="m-auto"
                            src="/assets/estrellas-fake.webp"
                            width={100}
                            height={100}
                            alt="Estrellas"
                        />
                    </div>
                    <div className="w-full border-b-2 border-yellow-400 px-10 pb-10 sm:w-3/6">
                        <div className="font-bold text-yellow-400 ">
                            Titular
                        </div>
                        <div className="text-white">
                            Lorem ipsum dolor sit amet, consectetuer adipiscing
                            elit, sed diam nonummy nibh euismod tincidunt ut
                            laoreet dolore magna aliquam erat volutpat.{' '}
                        </div>
                    </div>
                </div>
                {/*  review 3 */}
                <div className="relative z-10 m-auto block max-w-4xl bg-cerv-brown bg-opacity-70 px-10 pt-10 sm:flex">
                    <div className="w-full border-b-2 pb-10 text-white sm:w-2/6 sm:border-yellow-400">
                        <div className="text-xs">01/01/2023</div>
                        <div className="text-center text-xl sm:text-left">
                            Pedro Moliner
                        </div>
                        <div className="text-center text-beer-softFoam sm:text-left">
                            Creador de eventos
                        </div>
                    </div>
                    <div className=" w-full border-b-2 pb-10 sm:w-1/6 sm:border-yellow-400">
                        <Image
                            className="m-auto"
                            src="/assets/estrellas-fake.webp"
                            width={100}
                            height={100}
                            alt="Estrellas"
                        />
                    </div>
                    <div className="w-full border-b-2 border-yellow-400 px-10 pb-10 sm:w-3/6">
                        <div className="font-bold text-yellow-400 ">
                            Titular
                        </div>
                        <div className="text-white">
                            Lorem ipsum dolor sit amet, consectetuer adipiscing
                            elit, sed diam nonummy nibh euismod tincidunt ut
                            laoreet dolore magna aliquam erat volutpat.{' '}
                        </div>
                    </div>
                </div>
            </div>
            {/*  bloque 8 */}
            <div className=""></div>
            <div className="relative m-auto w-full max-w-screen-2xl justify-center">
                <Image
                    className="m-auto w-full"
                    src="/assets/home/prefooter.webp"
                    alt="Prefooter"
                    width={1920}
                    height={1080}
                />
            </div>
        </>
    );
}
