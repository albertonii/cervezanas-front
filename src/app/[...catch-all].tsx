import React from "react";
import { GetServerSideProps, NextPage } from "next";

// Tipando los parámetros que esperas recibir
interface CatchAllPageProps {
  params: string[] | undefined;
}

const CatchAllPage: NextPage<CatchAllPageProps> = ({
  params,
}: CatchAllPageProps) => {
  return (
    <div>
      <h1>Página Catch-All</h1>
      <p>
        Esta página captura todas las rutas no definidas. Parámetros de la ruta:
      </p>
      <pre>{JSON.stringify(params, null, 2)}</pre>
    </div>
  );
};

// getServerSideProps para extraer los parámetros de la URL
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;

  return { props: { params: params || null } };
};

export default CatchAllPage;
