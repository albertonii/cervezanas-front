import Head from "next/head";
import { type UserProps } from "../lib/types";
import { NextPage } from "next";
import "../lib/i18n/i18n";
import Layout from "../components/Layout";

const Main: NextPage<UserProps> = () => {
  return (
    <>
      <Head>
        <title>Cervezanas</title>
      </Head>

      <Layout useBackdrop={true} usePadding={true}>
        <main className="flex justify-center py-10 px-4 pt-10 sm:px-12">
          <div className="w-full bg-white p-4 shadow-lg sm:w-4/5 md:w-2/3 lg:w-1/2">
            Main Page
          </div>
        </main>
      </Layout>
    </>
  );
};

export default Main;
