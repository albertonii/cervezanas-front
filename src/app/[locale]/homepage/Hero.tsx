import Image from "next/image";
import React from "react";
import { Button } from "../components/common/Button";

export function Hero() {
  return (
    <>
      {/*  bloque 1 */}
      <div className="flex justify-center bg-cerv-cream p-4 h-[220px] overflow-hidden relative border-gray-400 max-w-screen-2xl m-auto">
        <div className="flex w-full justify-center pt-1 border-double border-8 max-w-screen-2xl">
          <div className="w-[180px] h-[180px]  bg-[url('/assets/rec-graf1.png')] opacity-10 bg-cover bg-no-repeat bg-right relative left-0 hidden sm:block"></div>

          <div className=" justify-center lg:text-4xl text-2xl text-center font-bold pt-7 sm:inline-flex w-full block">
            <div
              className="h-[170px] w-[170px] bg-[url('/assets/logo.svg')] bg-contain bg-no-repeat z-index-1  relative -left-12 -top-7
            hidden sm:block"
            ></div>
            <div className="">
              EL LUGAR DE ENCUENTRO PARA LOS AMANTES DE LA{" "}
              <div className="lg:text-5xl text-3xl text-cerv-titlehigh">
                CERVEZA ARTESANA
              </div>
            </div>
          </div>
          <div className="w-[180px] h-[180px]  bg-[url('/assets/rec-graF2.png')] opacity-10 bg-cover bg-no-repeat relative right-0  hidden sm:block"></div>
        </div>
      </div>
      {/*  bloque 2 */}
      <div className="max-w-screen-2xl -top-12 relative m-auto w-full">
        <img src="/assets/home/home-fakebanner.png"></img>
      </div>
      {/*  bloque 3 */}
      <div className="lg:flex md:flex sm:block w-full justify-center max-w-screen-2xl -top-12 relative m-auto bg-cerv-cream p-5">
        <div className="lg:w-1/2 lg:flex md:block md:px-3 md:w-1/2 sm:w-full">
          <div className="lg:w-1/2 lg:h-full bg-[url('/assets/home/home-img-1.jpg')] lg:bg-cover sm:bg-contain bg-no-repeat bg-center h-[350px] md:w-full"></div>
          <div className="lg:w-1/2 p-8 lg:p-5 xl:p-8 md:p-8 sm:p-12 md:w-full">
            <div className="m-auto text-center">
              <img
                className="m-auto"
                src="/assets/home/detalle.svg"
                width="80"
              ></img>
            </div>
            <div className="text-cerv-titlehigh text-2xl font-bold text-center pt-3 leading-6">
              Un punto de encuentro
            </div>
            <div className="pt-3 text-justify leading-5">
              La buena cerveza crea al artesano así como esta comunidad a
              Cervezanas. Creamos experiencias únicas para amantes de la música
              y la cerveza. Queremos que conozcas los experimentos cerveceros
              más locos, aquellas joyas escondidas y fabricadas con mimo para
              ti. Somos el puente entre aquellos fabricantes de cerveza
              artesanal aún por descubrir y tú.{" "}
            </div>
          </div>
        </div>
        <div className="lg:w-1/2 lg:flex md:block md:px-3 md:w-1/2  sm:w-full">
          <div className="lg:w-1/2 lg:h-full h-[350px] bg-[url('/assets/home/home-img-2.jpg')] lg:bg-cover  sm:bg-contain bg-no-repeat bg-center   md:w-full "></div>
          <div className="lg:w-1/2 p-8 lg:p-5 xl:p-8 md:p-8 sm:p-12 md:w-full">
            <div className="m-auto text-center">
              <img
                className="m-auto"
                src="/assets/home/detalle.svg"
                width="80"
              ></img>
            </div>
            <div className="text-cerv-titlehigh text-2xl font-bold text-center pt-3 leading-6">
              ¿Eres maestro cervecero o tienes tu propia receta?
            </div>
            <div className="pt-3 text-justify leading-5">
              Desde Cervezanas estamos activamente en búsqueda del siguiente
              aroma, descubriendo esa joya que has creado y aún no ha salido al
              mundo. ¿Quieres formar parte de esta comunidad de maestros
              cerveceros?{" "}
            </div>
          </div>
        </div>
      </div>
      {/*  bloque 4 */}
      <div className="w-full justify-center max-w-screen-2xl -top-12 relative m-auto bg-cerv-titlehigh p-5">
        <div className="bg-[url('/assets/rec-graF3.png')] bg-no-repeat bg-right-top opacity-20 bg-contain w-[600px] h-[600px] absolute right-0 mix-blend-multiply"></div>
        <div className="text-3xl md:text-5xl text-white font-bold relative z-10">
          SELECCIÓN CERVEZANA DEL MES{" "}
          <img
            className="m-auto float-left p-3"
            src="/assets/detalle-w.svg"
            width="160"
          ></img>
        </div>
        <div className="text-cerv-cream w-full lg:w-8/12 pt-6 pb-6 relative z-10">
          Cada mes te presentamos aquellas cervezas que han conseguido ser aptas
          para los certificados de calidad que emitimos desde Cervezanas. Dando
          visibilidad a aquella seleccionada por nuestra comunidad de
          Cervezanos, el comité de expertos y la más atrevida y experimental.
        </div>
        <div className="w-full lg:w-8/12 block sm:flex">
          {/*  producto 1 */}
          <div className="bg-no-repeat w-[250px] sm:w-1/3 sm:mr-4 relative z-10 m-auto mb-4">
            <div className="bg-cerv-coffee text-cerv-cream font-semibold text-center">
              LUPULENSIS
            </div>
            <div className="bg-[url('/assets/home/mes-1.jpg')] h-[320px] bg-cover bg-no-repeat bg-center">
              <div className="left-4 top-3 relative">
                <img src="/assets/cerv-mes.png" width="70"></img>
              </div>
              <div className="float-right right-2 relative ">
                <div className="bg-[url('/assets/heart.svg')] bg-no-repeat text-xs font-bold  w-[30px] h-[30px] text-center pt-1">
                  15
                </div>
                <div className="bg-[url('/assets/bla.svg')] bg-no-repeat text-xs font-bold  w-[30px] h-[30px] text-center pt-1">
                  25
                </div>
              </div>
              <div className="bg-cerv-coffee text-white font-bold text-xs  border-r-2 border-t-2 border-b-2 border-yellow-400 top-48 relative p-1 w-max pr-3">
                Comité expertos
              </div>
            </div>
            <div className="bg-cerv-coffee p-2">
              <div className=" text-center">
                <img
                  className="m-auto"
                  src="/assets/estrellas-fake.png"
                  width="110"
                ></img>
              </div>
              <div className="font-bold text-2xl text-center bg-cerv-coal border-yellow-400 border-4 text-cerv-cream p-1 mt-2">
                ¡Conócela!
              </div>
            </div>
          </div>
          {/*  producto 2 */}
          <div className="bg-no-repeat w-[250px] sm:w-1/3 sm:mr-4 relative z-10 m-auto mb-4">
            <div className="bg-cerv-coffee text-cerv-cream font-semibold text-center">
              ALQUIMISTAS - TRIGO
            </div>
            <div className="bg-[url('/assets/home/mes-2.jpg')] h-[320px] bg-cover bg-no-repeat">
              <div className="left-4 top-3 relative">
                <img src="/assets/cerv-mes.png" width="70"></img>
              </div>
              <div className="float-right right-2 relative ">
                <div className="bg-[url('/assets/heart.svg')] bg-no-repeat text-xs font-bold  w-[30px] h-[30px] text-center pt-1">
                  10
                </div>
                <div className="bg-[url('/assets/bla.svg')] bg-no-repeat text-xs font-bold  w-[30px] h-[30px] text-center pt-1">
                  21
                </div>
              </div>
              <div className="bg-cerv-coffee text-white font-bold text-xs  border-r-2 border-t-2 border-b-2 border-yellow-400 top-48 relative p-1 w-max pr-3">
                Comunidad
              </div>
            </div>
            <div className="bg-cerv-coffee p-2">
              <div className=" text-center">
                <img
                  className="m-auto"
                  src="/assets/estrellas-fake.png"
                  width="110"
                ></img>
              </div>
              <div className="font-bold text-2xl text-center bg-cerv-coal border-yellow-400 border-4 text-cerv-cream p-1 mt-2">
                ¡Conócela!
              </div>
            </div>
          </div>
          {/*  producto 3 */}
          <div className="bg-no-repeat w-[250px] sm:w-1/3 sm:mr-4 relative z-10 m-auto mb-4">
            <div className="bg-cerv-coffee text-cerv-cream font-semibold text-center">
              CERVEZAS SOTO
            </div>
            <div className="bg-[url('/assets/home/mes-3.jpg')] h-[320px] bg-cover bg-no-repeat">
              <div className="left-4 top-3 relative">
                <img src="/assets/cerv-mes.png" width="70"></img>
              </div>
              <div className="float-right right-2 relative ">
                <div className="bg-[url('/assets/heart.svg')] bg-no-repeat text-xs font-bold  w-[30px] h-[30px] text-center pt-1">
                  12
                </div>
                <div className="bg-[url('/assets/bla.svg')] bg-no-repeat text-xs font-bold  w-[30px] h-[30px] text-center pt-1">
                  15
                </div>
              </div>
              <div className="bg-cerv-coffee text-white font-bold text-xs  border-r-2 border-t-2 border-b-2 border-yellow-400 top-48 relative p-1 w-max pr-3">
                Revelación
              </div>
            </div>
            <div className="bg-cerv-coffee p-2">
              <div className=" text-center">
                <img
                  className="m-auto"
                  src="/assets/estrellas-fake.png"
                  width="110"
                ></img>
              </div>
              <div className="font-bold text-2xl text-center bg-cerv-coal border-yellow-400 border-4 text-cerv-cream p-1 mt-2">
                ¡Conócela!
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*  bloque 5 */}
      <div className="bg-[url('/assets/home/fondo-marcas.jpg')] bg-no-repeat bg-cover p-8 w-full justify-center max-w-screen-2xl relative m-auto pb-20">
        <div className="text-4xl md:text-5xl text-cerv-coffee font-bold mb-8 text-center lg:text-left">
          ¿Quieres saber la historia detrás de cada marca?
        </div>
        <div className="bg-[url('/assets/home/botella-qr.png')] bg-no-repeat bg-right-top bg-contain w-[140px] h-[600px] absolute right-0 -top-6 hidden lg:block"></div>
        <div className="lg:flex block">
          <div className="bg-cerv-titlehigh bg-opacity-80 text-white p-7 w-full lg:w-1/2 mr-6 text-1xl pt-20 mb-4">
            <div>
              Cervezanas se encarga de dar valor al trabajo que está detrás de
              cada creador cervecero, cada producto de nuestro catálogo está
              provisto de un identificador único capaz de ser escaneado. Con él
              tendrás acceso a información en exclusiva de ese producto, además
              de poder participar en promociones, descuentos y sorteos
              exclusivos de cada marca!
            </div>
            <img
              className="m-auto mt-8"
              src="/assets/detalle-w.svg"
              width="160"
            ></img>
          </div>
          <div className="bg-cerv-cream  w-full lg:w-1/2 p-7 text-center p-0 lg:pr-32">
            <div className="text-cerv-coffee text-4xl font-bold">
              Escanea el código QR
            </div>
            <div className="text-2xl pt-4">
              Tendrás acceso a información de cada producto y podrás participar
              en:
              <ul className="font-semibold pt-4">
                <li>Promociones</li>
                <li>Descuentos</li>
                <li>Sorteos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/*  bloque 6 */}
      <div className="w-full justify-center max-w-screen-2xl relative m-auto pt-10 bg-cerv-cream pb-20 overflow-hidden">
        <div className="bg-[url('/assets/rec-graf4.png')] bg-no-repeat bg-cover opacity-10 w-[700px] sm:w-full h-[700px] absolute m-auto left-2/4 -ml-80 max-w-full hidden sm:block"></div>
        <div className="text-cerv-coffee text-4xl md:text-5xl text-center font-bold mb-10">
          Cervezas más vendidas
        </div>
        <div className="z-10 relative grid grid-cols-1 lg:grid-cols-5 sm:grid-cols-2 gap-0 md:gap-2 m-auto max-w-[300px] sm:max-w-[600px] lg:max-w-full">
          {/*  producto 1 */}
          <div className="bg-no-repeat w-full mr-4 max-w-[300px] mb-6">
            <div className="bg-cerv-coffee text-cerv-cream font-semibold text-center">
              MÍSTICA
            </div>
            <div className="bg-[url('/assets/home/prod-1.jpg')] h-[320px] bg-cover bg-no-repeat  bg-center">
              <div className="float-right right-2 relative mt-10 ">
                <div className="bg-[url('/assets/heart.svg')] bg-no-repeat text-xs font-bold  w-[30px] h-[30px] text-center pt-1">
                  20
                </div>
                <div className="bg-[url('/assets/bla.svg')] bg-no-repeat text-xs font-bold  w-[30px] h-[30px] text-center pt-1">
                  11
                </div>
              </div>
            </div>
            <div className="bg-cerv-coffee p-2">
              <div className=" text-center">
                <img
                  className="m-auto"
                  src="/assets/estrellas-fake.png"
                  width="110"
                ></img>
              </div>
              <div className="font-bold text-2xl text-center bg-cerv-coal border-yellow-400 border-4 text-cerv-cream p-1 mt-2">
                ¡Conócela!
              </div>
            </div>
          </div>
          {/*  producto 2 */}
          <div className="bg-no-repeat w-full mr-4 max-w-[300px] mb-6">
            <div className="bg-cerv-coffee text-cerv-cream font-semibold text-center">
              BOSQUE ROJO
            </div>
            <div className="bg-[url('/assets/home/prod-2.jpg')] h-[320px] bg-cover bg-no-repeat bg-center">
              <div className="float-right right-2 relative mt-10 ">
                <div className="bg-[url('/assets/heart.svg')] bg-no-repeat text-xs font-bold  w-[30px] h-[30px] text-center pt-1">
                  20
                </div>
                <div className="bg-[url('/assets/bla.svg')] bg-no-repeat text-xs font-bold  w-[30px] h-[30px] text-center pt-1">
                  22
                </div>
              </div>
            </div>
            <div className="bg-cerv-coffee p-2">
              <div className=" text-center">
                <img
                  className="m-auto"
                  src="/assets/estrellas-fake.png"
                  width="110"
                ></img>
              </div>
              <div className="font-bold text-2xl text-center bg-cerv-coal border-yellow-400 border-4 text-cerv-cream p-1 mt-2">
                ¡Conócela!
              </div>
            </div>
          </div>
          {/*  producto 3 */}
          <div className="bg-no-repeat w-full mr-4 max-w-[300px] mb-6">
            <div className="bg-cerv-coffee text-cerv-cream font-semibold text-center">
              AMARILLA
            </div>
            <div className="bg-[url('/assets/home/prod-3.jpg')] h-[320px] bg-cover bg-no-repeat  bg-center">
              <div className="float-right right-2 relative mt-10 ">
                <div className="bg-[url('/assets/heart.svg')] bg-no-repeat text-xs font-bold  w-[30px] h-[30px] text-center pt-1">
                  15
                </div>
                <div className="bg-[url('/assets/bla.svg')] bg-no-repeat text-xs font-bold  w-[30px] h-[30px] text-center pt-1">
                  17
                </div>
              </div>
            </div>
            <div className="bg-cerv-coffee p-2">
              <div className=" text-center">
                <img
                  className="m-auto"
                  src="/assets/estrellas-fake.png"
                  width="110"
                ></img>
              </div>
              <div className="font-bold text-2xl text-center bg-cerv-coal border-yellow-400 border-4 text-cerv-cream p-1 mt-2">
                ¡Conócela!
              </div>
            </div>
          </div>
          {/*  producto 4 */}
          <div className="bg-no-repeat w-full mr-4 max-w-[300px] mb-6">
            <div className="bg-cerv-coffee text-cerv-cream font-semibold text-center">
              LÚPULO DORADO
            </div>
            <div className="bg-[url('/assets/home/prod-4.jpg')] h-[320px] bg-cover bg-no-repeat bg-center">
              <div className="float-right right-2 relative mt-10 ">
                <div className="bg-[url('/assets/heart.svg')] bg-no-repeat text-xs font-bold  w-[30px] h-[30px] text-center pt-1">
                  10
                </div>
                <div className="bg-[url('/assets/bla.svg')] bg-no-repeat text-xs font-bold  w-[30px] h-[30px] text-center pt-1">
                  21
                </div>
              </div>
            </div>
            <div className="bg-cerv-coffee p-2">
              <div className=" text-center">
                <img
                  className="m-auto"
                  src="/assets/estrellas-fake.png"
                  width="110"
                ></img>
              </div>
              <div className="font-bold text-2xl text-center bg-cerv-coal border-yellow-400 border-4 text-cerv-cream p-1 mt-2">
                ¡Conócela!
              </div>
            </div>
          </div>
          {/*  producto 5 */}
          <div className="bg-no-repeat w-full mr-4 hidden lg:block max-w-[300px]">
            <div className="bg-cerv-coffee text-cerv-cream font-semibold text-center">
              LUPULENSIS
            </div>
            <div className="bg-[url('/assets/home/prod-5.jpg')] h-[320px] bg-cover bg-no-repeat bg-center">
              <div className="float-right right-2 relative mt-10 ">
                <div className="bg-[url('/assets/heart.svg')] bg-no-repeat text-xs font-bold  w-[30px] h-[30px] text-center pt-1">
                  12
                </div>
                <div className="bg-[url('/assets/bla.svg')] bg-no-repeat text-xs font-bold  w-[30px] h-[30px] text-center pt-1">
                  13
                </div>
              </div>
            </div>
            <div className="bg-cerv-coffee p-2">
              <div className=" text-center">
                <img
                  className="m-auto"
                  src="/assets/estrellas-fake.png"
                  width="110"
                ></img>
              </div>
              <div className="font-bold text-2xl text-center bg-cerv-coal border-yellow-400 border-4 text-cerv-cream p-1 mt-2">
                ¡Conócela!
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*  bloque 6 */}
      <div className="w-full justify-center max-w-screen-2xl relative m-auto pt-10 bg-cerv-cream pb-20 bg-[url('/assets/rec-graf5.png')] bg-contain">
        <div className="h-[190px] w-[190px] bg-[url('/assets/logo.svg')] bg-contain bg-no-repeat z-index-1  relative m-auto -top-8"></div>
        <div className="text-cerv-coffee text-4xl md:text-6xl text-center font-bold mb-10">
          Comunidad Cervezanas
        </div>
        {/*  Productor */}
        <div className="block sm:flex m-auto">
          <div className="w-full sm:w-2/4  max-w-[300px] sm:max-w-5xl m-auto">
            {" "}
            <img className="m-auto p-0 sm:p-16" src="/assets/home/com-1.jpg"></img>
          </div>
          <div className="m-auto w-full sm:w-2/4 p-10">
            <div className="text-cerv-banana text-4xl font-bold text-center pt-3 mb-8">
              Productor
            </div>
            <div className="text-black text-xl font-normal pt-3 mb-8">
              <p>
                Damos visibilidad a tu creación, nos encargamos de todo para que
                puedas centrarte en tu pasión, crear para hacernos disfrutar.
              </p>
              <p>
                Ya tengas tu propia fábrica o tan solo la receta, te ayudamos en
                todo el proceso de producción.
              </p>
            </div>
            <div className="m-auto text-center">
              <img
                className="m-auto"
                src="/assets/home/detalle.svg"
                width="120"
              ></img>
            </div>
          </div>
        </div>
        {/*  Consumidor */}
        <div className="block sm:flex m-auto">
          <div className="m-auto w-full sm:w-2/4 p-10">
            <div className="text-cerv-banana text-4xl font-bold text-center pt-3 mb-8">
              Consumidor
            </div>
            <div className="text-black text-xl font-normal pt-3 mb-8">
              <p>
                Damos visibilidad a tu creación, nos encargamos de todo para que
                puedas centrarte en tu pasión, crear para hacernos disfrutar.
              </p>
              <p>
                Ya tengas tu propia fábrica o tan solo la receta, te ayudamos en
                todo el proceso de producción.
              </p>
            </div>
            <div className="m-auto text-center">
              <img
                className="m-auto"
                src="/assets/home/detalle.svg"
                width="120"
              ></img>
            </div>
          </div>
          <div className="w-full sm:w-2/4  max-w-[300px] sm:max-w-5xl m-auto">
            {" "}
            <img className="mb-6 m-auto p-0 sm:p-16" src="/assets/home/com-2.jpg"></img>
          </div>
        </div>
        {/*  Distribuidores */}
        <div className="block sm:flex m-auto">
          <div className="w-full sm:w-2/4  max-w-[300px] sm:max-w-5xl m-auto">
            {" "}
            <img className="m-auto p-0 sm:p-16" src="/assets/home/com-3.jpg"></img>
          </div>
          <div className="m-auto w-full sm:w-2/4 p-10">
            <div className="text-cerv-banana text-4xl font-bold text-center pt-3 mb-8">
              Distribuidores
            </div>
            <div className="text-black text-xl font-normal pt-3 mb-8">
              <p>
                Damos visibilidad a tu creación, nos encargamos de todo para que
                puedas centrarte en tu pasión, crear para hacernos disfrutar.
              </p>
              <p>
                Ya tengas tu propia fábrica o tan solo la receta, te ayudamos en
                todo el proceso de producción.
              </p>
            </div>
            <div className="m-auto text-center">
              <img
                className="m-auto"
                src="/assets/home/detalle.svg"
                width="120"
              ></img>
            </div>
          </div>
        </div>
        {/*  Puntos cervezanos */}
        <div className="block sm:flex m-auto">
          <div className="m-auto w-full sm:w-2/4 p-10">
            <div className="text-cerv-banana text-4xl font-bold text-center pt-3 mb-8">
              Puntos cervezanos
            </div>
            <div className="text-black text-xl font-normal pt-3 mb-8">
              <p>
                Damos visibilidad a tu creación, nos encargamos de todo para que
                puedas centrarte en tu pasión, crear para hacernos disfrutar.
              </p>
              <p>
                Ya tengas tu propia fábrica o tan solo la receta, te ayudamos en
                todo el proceso de producción.
              </p>
            </div>
            <div className="m-auto text-center">
              <img
                className="m-auto"
                src="/assets/home/detalle.svg"
                width="120"
              ></img>
            </div>
          </div>
          <div className="w-full sm:w-2/4  max-w-[300px] sm:max-w-5xl m-auto">
            {" "}
            <img className="m-auto p-0 sm:p-16" src="/assets/home/com-4.jpg"></img>
          </div>
        </div>
      </div>
      {/*  bloque 7 */}
      <div className="w-full justify-center max-w-screen-2xl  relative m-auto bg-cerv-titlehigh p-5 overflow-hidden ">
        <div className="bg-[url('/assets/rec-graf4.png')] bg-no-repeat bg-right-top opacity-20 bg-contain w-[600px] h-[600px] absolute -left-36 top-20 mix-blend-multiply"></div>
        <div className="text-4xl md:text-6xl text-white font-bold text-center mb-20 mt-10">
          Opiniones de nuestros Cervezanos y Cervezanas
        </div>
        {/*  review 1 */}
        <div className="max-w-4xl m-auto bg-cerv-brown bg-opacity-70 px-10 pt-10 block sm:flex relative z-10">
          <div className="text-white w-full sm:w-1/4 border-b-2 pb-10 border-none sm:border-yellow-400">
            <div className="text-xs">01/01/2023</div>
            <div className="text-xl text-center sm:text-left">Consumidor Cervezano</div>
          </div>
          <div className=" w-full sm:w-1/4  border-b-2  pb-10 border-none sm:border-yellow-400">
            <img
              className="m-auto"
              src="/assets/estrellas-fake.png"
              width="100"
            ></img>
          </div>
          <div className="px-10 w-full sm:w-1/4 border-b-2 pb-10 border-yellow-400">
            <div className="text-yellow-400 font-bold ">Titular</div>
            <div className="text-white">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
              nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam
              erat volutpat.{" "}
            </div>
          </div>
        </div>
        {/*  review 2 */}
        <div className="max-w-4xl m-auto bg-cerv-brown bg-opacity-70 px-10 pt-10 block sm:flex relative z-10">
          <div className="text-white w-full sm:w-1/4 border-b-2 pb-10 border-none sm:border-yellow-400">
            <div className="text-xs">01/01/2023</div>
            <div className="text-xl text-center sm:text-left">Productor Cervezano</div>
          </div>
          <div className=" w-full sm:w-1/4  border-b-2  pb-10 border-none sm:border-yellow-400">
            <img
              className="m-auto"
              src="/assets/estrellas-fake.png"
              width="100"
            ></img>
          </div>
          <div className="px-10 w-full sm:w-1/4 border-b-2 pb-10 border-yellow-400">
            <div className="text-yellow-400 font-bold ">Titular</div>
            <div className="text-white">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
              nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam
              erat volutpat.{" "}
            </div>
          </div>
        </div>
        {/*  review 3 */}
        <div className="max-w-4xl m-auto bg-cerv-brown bg-opacity-70 px-10 pt-10 block sm:flex relative z-10">
          <div className="text-white w-full sm:w-1/4 border-b-2 pb-10 border-none sm:border-yellow-400">
            <div className="text-xs">01/01/2023</div>
            <div className="text-xl text-center sm:text-left">Creador de eventos</div>
          </div>
          <div className=" w-full sm:w-1/4  border-b-2  pb-10 border-none sm:border-yellow-400">
            <img
              className="m-auto"
              src="/assets/estrellas-fake.png"
              width="100"
            ></img>
          </div>
          <div className="px-10 w-full sm:w-1/4 border-b-2 pb-10 border-yellow-400">
            <div className="text-yellow-400 font-bold ">Titular</div>
            <div className="text-white">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
              nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam
              erat volutpat.{" "}
            </div>
          </div>
        </div>
      </div>
      {/*  bloque 8 */}
      <div className=""></div>
      <div className="w-full justify-center max-w-screen-2xl relative m-auto">
        <img className="m-auto w-full" src="/assets/home/prefooter.jpg"></img>
      </div>
    </>
  );
}
