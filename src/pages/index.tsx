import Head from "next/head";
import "../lib/translations/i18n";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../components/Auth";
import { useEffect, useState } from "react";
import { Button } from "../components/common/Button";

export default function Main() {
  const { user } = useAuth();

  const [output, setOutput] = useState("");
  const [notes, setNotes] = useState("");
  const [title, setTitle] = useState("");
  const [uid, setUid] = useState("");
  const [claim, setClaim] = useState("");
  const [value, setValue] = useState("");

  useEffect(() => {
    setUid(user?.id || "");
  }, [user?.id]);

  // Call claims from here
  const callClaims = async () => {
    // Send user role producer to the server
    // await supabase.rpc("set_claim", {
    //   uid: uid,
    //   claim: "access_level",
    //   value: ROLE_ENUM.Cervezano,
    // });

    // Get my claim by role
    const { data, error } = await supabase.rpc("get_claim", {
      uid: uid,
      claim: "access_level",
    });

    // const { data, error } = await supabase.rpc("get_my_claims");

    setOutput("Loading...");
    setTitle(`get_my_claim('${claim}')`);

    if (error) console.error("get_my_claim error", error);
    else setOutput(JSON.stringify(data, null, 2));
    setNotes(
      'This calls the server function "get_my_claim(claim text)" and gets the claim from the current token at the server.'
    );
  };

  return (
    <>
      <Head>
        <title>Cervezanas</title>
      </Head>

      <main className="flex justify-center py-10 px-4 pt-10 sm:px-12">
        <div className="w-full bg-white p-4 shadow-lg sm:w-4/5 md:w-2/3 lg:w-1/2">
          Main Page
          <Button onClick={() => callClaims()} primary class={""}>
            Prueba de claims
          </Button>
        </div>
      </main>
    </>
  );
}
