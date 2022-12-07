import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BasicDataForm } from "./BasicDataForm";
import { supabase } from "../../../utils/supabaseClient";
import { useUser } from "../../Auth/UserContext";
import SecretDataForm from "./SecretDataForm";
import LocationForm from "./LocationForm";

interface IBasicData {
  username: string;
  birthdate: string;
  given_name: string;
  lastname: string;
  email: string;
}

export const Account = () => {
  const { t } = useTranslation();

  const { user } = useUser();

  const data = {
    username_: "Alberto",
    birthdate_: "15-03-1994",
    name_: "Alberto",
    lastname_: "Niironen",
    email_: "alberto.niironen@mail.com",
  };
  const { username_, birthdate_, name_, lastname_, email_ } = data;

  const [username, setUsername] = useState(username_);
  const [name, setName] = useState(name_);
  const [lastname, setLastname] = useState(lastname_);
  const [email, setEmail] = useState(email_);
  const [birthdate, setBirthdate] = useState(birthdate_);

  useEffect(() => {
    const getProfileData = async () => {
      let { data: profile, error } = await supabase
        .from("producer_profile")
        .select("username, given_name, lastname, birthdate")
        .eq("id", user!.id);
    };

    type ProfileResponse = Awaited<ReturnType<typeof getProfileData>>;
    /*type MoviesResponseSuccess = ProfileResponse["data"];
    type MoviesResponseError = ProfileResponse["error"];
*/
    /*
    const profi: IBasicData = profile;

    alert(JSON.stringify(profile));
    const { username } = profi;

    setUsername(username);*/
  }, []);

  return (
    <>
      <div className="py-6 px-4" id="account-container">
        <div className="flex justify-between py-4" id="header">
          <div id="title" className="text-4xl">
            {t("profile_title_my_data")}
          </div>
          <div id="rrss" className="text-4xl">
            {t("profile_title_ssnn")}
          </div>
        </div>

        <BasicDataForm
          username={username}
          birthdate={birthdate}
          given_name={name}
          lastname={lastname}
          email={email}
        />

        <SecretDataForm />

        <LocationForm />
      </div>
    </>
  );
};
