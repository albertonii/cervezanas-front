import { Button } from "@supabase/ui";
import {
  CountryDropdown,
  RegionDropdown,
  CountryRegionData,
} from "react-country-region-selector";
import { useState } from "react";

export const Account = () => {
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

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  const [addressName, setAddressName] = useState("");
  const [addressLastname, setAddressLastname] = useState("");
  const [addressDoc, setAddressDoc] = useState("");
  const [addressCompany, setAddressCompany] = useState("");
  const [addressPhone, setAddressPhone] = useState("");
  const [addressLocation, setAddressLocation] = useState("");
  const [addressPC, setAddressPC] = useState(0);
  const [addressTown, setAddressTown] = useState("");
  const [addressCountry, setAddressCountry] = useState("");
  const [addressProvince, setAddressProvince] = useState("");

  const selectCountry = (val: string) => {
    setAddressCountry(val);
  };

  const selectRegion = (val: string) => {
    setAddressProvince(val);
  };

  return (
    <>
      <div className="py-6 px-4" id="account-container">
        <div className="flex justify-between py-4" id="header">
          <div id="title" className="text-4xl">
            Mis datos
          </div>
          <div id="rrss" className="text-4xl">
            Redes sociales
          </div>
        </div>

        <div
          id="account_basic_data"
          className="container px-6 py-4 bg-white space-y-3 mb-4"
        >
          <div id="account-data" className="text-2xl">
            Datos de mi cuenta
          </div>

          <div className="flex w-full flex-row space-x-3 ">
            <div className="w-full ">
              <label htmlFor="username" className="text-sm text-gray-600">
                Usuario
              </label>
              <input
                type="text"
                id="username"
                placeholder="user123"
                readOnly
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="w-full ">
              <label htmlFor="birthdate" className="text-sm text-gray-600">
                Fecha de nacimiento
              </label>
              <input
                type="date"
                id="birthdate"
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex w-full flex-row space-x-3 ">
            <div className="w-full space-y">
              <label htmlFor="username" className="text-sm text-gray-600">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                placeholder="Alberto"
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="w-full ">
              <label htmlFor="lastname" className="text-sm text-gray-600">
                Apellidos
              </label>
              <input
                type="text"
                id="lastname"
                placeholder="Niironen"
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-row items-end">
            <div className="w-full">
              <label htmlFor="email" className="text-sm text-gray-600">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                placeholder="ejemplo@gmail.com"
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="pl-12 ">
              <Button size="medium">Guardar</Button>
            </div>
          </div>
        </div>

        <div
          id="account_secret_data"
          className="container px-6 py-4  bg-white space-y-3 mb-4"
        >
          <div id="password" className="text-2xl">
            Contraseña
          </div>

          <div className="flex w-full flex-row space-x-3 ">
            <div className="w-full ">
              <label
                htmlFor="actual_password"
                className="text-sm text-gray-600"
              >
                Contraseña Actual
              </label>
              <input
                type="password"
                id="old_password"
                placeholder="**********"
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex w-full flex-row space-x-3 mb-4">
            <div className="w-full ">
              <label htmlFor="newPassword" className="text-sm text-gray-600">
                Contraseña nueva
              </label>
              <input
                type="password"
                id="new_password_1"
                placeholder="**********"
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="w-full space-y">
              <label htmlFor="newPassword2" className="text-sm text-gray-600">
                Confirmar contraseña
              </label>
              <input
                type="password"
                id="new_password_2"
                placeholder="**********"
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={newPassword2}
                onChange={(e) => setNewPassword2(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-row items-end">
            <div className="pl-0">
              <Button size="medium">Guardar</Button>
            </div>
          </div>
        </div>

        <div
          id="location_data"
          className="container px-6 py-4 bg-white space-y-3 mb-4"
        >
          <div id="location-data-title" className="text-2xl">
            Dirección
          </div>

          <div className="flex w-full flex-row space-x-3 ">
            <div className="w-full ">
              <label htmlFor="address_name" className="text-sm text-gray-600">
                Nombre
              </label>
              <input
                type="text"
                id="address_name"
                placeholder="Calle España 123"
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={addressName}
                onChange={(e) => setAddressName(e.target.value)}
              />
            </div>

            <div className="w-full ">
              <label
                htmlFor="address_lastname"
                className="text-sm text-gray-600"
              >
                Apellido
              </label>
              <input
                type="text"
                id="address_lastname"
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={addressLastname}
                onChange={(e) => setAddressLastname(e.target.value)}
              />
            </div>
          </div>

          <div className="flex w-full flex-row space-x-3">
            <div className="w-full space-y">
              <label htmlFor="address_doc" className="text-sm text-gray-600">
                Documento identidad
              </label>
              <input
                type="text"
                id="address_doc"
                placeholder="00112233-R"
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={addressDoc}
                onChange={(e) => setAddressDoc(e.target.value)}
              />
            </div>

            <div className="w-full">
              <label htmlFor="lastname" className="text-sm text-gray-600">
                Empresa
              </label>
              <input
                type="text"
                id="addressCompany"
                placeholder="Empresa 2000 SL"
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={addressCompany}
                onChange={(e) => setAddressCompany(e.target.value)}
              />
            </div>

            <div className="w-full">
              <label htmlFor="address_phone" className="text-sm text-gray-600">
                Teléfono
              </label>
              <input
                type="text"
                id="addressPhone"
                placeholder="+34 685 222 222"
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={addressPhone}
                onChange={(e) => setAddressPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-row space-x-3">
            <div className="w-full">
              <label htmlFor="addressPC" className="text-sm text-gray-600">
                Código Postal
              </label>
              <input
                type="text"
                id="addressPC"
                placeholder="27018"
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={addressPC}
                onChange={(e) => setAddressPC(Number(e.target.value))}
              />
            </div>

            <div className="w-full">
              <label htmlFor="addressTown" className="text-sm text-gray-600">
                Población
              </label>
              <input
                type="text"
                id="addressTown"
                placeholder="Madrid"
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={addressTown}
                onChange={(e) => setAddressTown(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-row items-end space-x-3">
            <div className="w-full">
              <label htmlFor="addressCountry" className="text-sm text-gray-600">
                Seleccionar País
              </label>

              <CountryDropdown
                classes="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={addressCountry}
                onChange={(val) => selectCountry(val)}
              />
            </div>

            <div className="w-full">
              <label
                htmlFor="addressProvince"
                className="text-sm text-gray-600"
              >
                Seleccionar Provincia
              </label>

              <RegionDropdown
                classes="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                country={addressCountry}
                value={addressProvince}
                onChange={(val) => selectRegion(val)}
              />
            </div>

            <div className="pl-12 ">
              <Button size="medium">Guardar</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
