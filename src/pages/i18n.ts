import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const translationsEn = {
  home: "Home",
  logout: "Logout",
  profile: "Profile",
  products: "Products",
  campaigns: "Campaigns",
  factories: "Factories",
  orders: "Orders",
  community: "Community",
  stats: "Statistics",
  ledger: "Ledger",
  profile_title_my_data: "My data",
  profile_title_ssnn: "Social Networks",
  profile_title_acc_data: "Account Data",
  profile_acc_name: "Name",
  profile_acc_lastname: "Lastname",
  profile_acc_username: "Username",
  profile_acc_birthdate: "Date of birth",
  profile_acc_email: "Email",
  save: "Save",
  delete: "Delete",
  password: "Password",
  actual_password: "Actual Password",
  new_password: "New Password",
  confirm_password: "Confirm Password",
  location: "Address",
  loc_location: "Shipping Address",
  loc_name: "Name",
  loc_lastname: "Lastname",
  loc_doc: "Identity Number",
  loc_company: "Compnay",
  loc_phone: "Phone Number",
  loc_pc: "Postal Code",
  loc_town: "Town",
  loc_country: "Select Country",
  loc_province: "Select Province",
};

const translationsEs = {
  home: "Inicio",
  logout: "Cerrar Sesión",
  profile: "Perfil",
  products: "Productos",
  campaigns: "Campañas",
  factories: "Fábricas",
  orders: "Pedidos",
  community: "Comunidad",
  stats: "Estadísticas",
  ledger: "Libro de Cuentas",
  profile_title_my_data: "Mis Datos",
  profile_title_ssnn: "Redes Sociales",
  profile_title_acc_data: "Datos de mi cuenta",
  profile_acc_name: "Nombre",
  profile_acc_lastname: "Apellidos",
  profile_acc_username: "Usuario",
  profile_acc_birthdate: "Fecha de Nacimiento",
  profile_acc_email: "Correo Electrónico",
  save: "Guardar",
  delete: "Eliminar",
  password: "Contraseña",
  actual_password: "Contraseña Actual",
  new_password: "Contraseña Nueva",
  confirm_password: "Confirmar Contraseña",
  location: "Dirección",
  loc_location: "Dirección de envío",
  loc_name: "Nombre",
  loc_lastname: "Apellido",
  loc_doc: "Documento Identidad",
  loc_company: "Empresa",
  loc_phone: "Teléfono",
  loc_pc: "Código Postal",
  loc_town: "Población",
  loc_country: "Seleccionar País",
  loc_province: "Seleccionar Provincia",
};

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: translationsEn,
  },
  es: {
    translation: translationsEs,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "es", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    fallbackLng: "en",
  });

export default i18n;
