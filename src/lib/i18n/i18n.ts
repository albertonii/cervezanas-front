import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { translationsFormErrorsEn } from "./i18nErrors";

const translationsEn = {
  home: "Home",
  logout: "Logout",
  profile: "Profile",
  products: "Products",
  campaigns: "Campaigns",
  select_campaign: "Select Campaign",
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
  accept: "Aceptar",
  save: "Save",
  close: "Close",
  edit: "Edit",
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
  sign_in: "Sign In",
  sign_up: "Sign Up",
  history_title: "Origin",
  history_description_producer:
    "All information written in this section will be public for those Cervezanos who visit your profile.",
  history_business_title: "Company history",
  history_business_description: "Tell your origin",
  history_business_year: "Foundation year",
  product_name: "Product name",
  title: "Title",
  produtc_description:
    "Be sure to fill in all required fields to successfully enter the product.",
  maltose: "Maltose",
  bitter: "Bitter",
  balanced: "Balanced",
  hopped: "Hopped",
  toast: "Toast",
  sweet: "Sweet",
  smoked: "Smoked",
  sour: "Sour",
  wood: "Wood",
  fruity: "Fruity",
  spicy: "Spicy",
  i_session: "<4% ABV",
  i_standard: "4-6% ABV",
  i_high: "6-9% ABV",
  i_very_high: ">9% ABV",
  intensity: "Intensity",
  aroma: "Aroma/Dominant Flavour",
  fermentation: "Fermentation/Conditioning",
  color: "Color",
  pale: "Pale",
  amber: "Amber",
  dark: "Dark",
  br: "British Isles",
  eu_oc: "Wetern Europe",
  eu_ce: "Central Europe",
  eu_or: "Eastern Europe",
  us_no: "North America",
  pa: "Pacific",
  ipa: "Ipa",
  brown_ale: "Brown Ale",
  pale_ale: "Pale Ale",
  pale_lager: "Pale Lager",
  pilsner: "Pilsner",
  amber_ale: "Amber Ale",
  amber_lager: "Amber Lager",
  dark_lager: "Dark Lager",
  porter: "Porter",
  stout: "Stout",
  bock: "Bock",
  strong: "Strong",
  wheat_beer: "Whear Beer",
  specialty_beer: "Specialty Beer",
  can: "Can",
  glass: "Glass",
  draft: "Draft",
  artisan: "Artisan",
  traditional: "Traditional",
  historic: "Historic",
  high: "High",
  low: "Low",
  any: "Any",
  wild: "Wild",
  lagered: "Lagered",
  aged: "Aged",
  origin: "Region of Origin",
  family: "Style Family",
  era: "Era",
  product_type: "Product Type",
  format: "Format",
  isGluten: "Has Gluten?",
  modal_product_title: "Product",
  modal_product_description:
    "All information described in this section is public.",
  modal_product_add: "Add Product",
  modal_delete_product_description:
    "Be careful! You are about to delete a product. This action will delete the information related to it from the database. Are you sure you want to delete the product?",
  beer: "Beer",
  merchandising: "Merchandising",
  name: "Name",
  description: "Description",
  year: "Year",
  upload_img_url: "Upload Image",
};

const translationsEs = {
  home: "Inicio",
  logout: "Cerrar Sesión",
  profile: "Perfil",
  products: "Productos",
  campaigns: "Campañas",
  select_campaign: "Seleccionar Campaña",
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
  accept: "Aceptar",
  save: "Guardar",
  close: "Cerrar",
  edit: "Editar",
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
  sign_in: "Acceder",
  sign_up: "Registrar",
  history_title: "Historia",
  history_description_producer:
    "Toda la información escrita en esta sección será pública para aquellos Cervezanos que visiten tu perfil.",
  history_business_title: "Historia de la compaña",
  history_business_description: "Cuenta acerca de tu origen",
  history_business_year: "Año de fundación",
  product_name: "Nombre del producto",
  title: "Título",
  product_description: "Descripción",
  maltose: "Maltosa",
  bitter: "Amarga",
  balanced: "Balanceada",
  hopped: "Lupulada",
  toast: "Tostada",
  sweet: "Dulce",
  smoked: "Ahumada",
  sour: "Amargo",
  wood: "Madera",
  fruity: "Frutal",
  spicy: "Especiada",
  i_session: "<4% ABV",
  i_standard: "4-6% ABV",
  i_high: "6-9% ABV",
  i_very_high: ">9% ABV",
  intensity: "Intensidad",
  aroma: "Aroma/Sabor Dominante",
  fermentation: "Fermentación/Acondicionamiento",
  color: "Color",
  pale: "Pale",
  amber: "Amber",
  dark: "Dark",
  br: "Islas Británicas",
  eu_oc: "Europa Occidental",
  eu_ce: "Europa Central",
  eu_or: "Europa Oriental",
  us_no: "América del Norte",
  pa: "Pacífico",
  ipa: "Ipa",
  brown_ale: "Brown Ale",
  pale_ale: "Pale Ale",
  pale_lager: "Pale Lager",
  pilsner: "Pilsner",
  amber_ale: "Amber Ale",
  amber_lager: "Amber Lager",
  dark_lager: "Dark Lager",
  porter: "Porter",
  stout: "Stout",
  bock: "Bock",
  strong: "Strong",
  wheat_beer: "Whear Beer",
  specialty_beer: "Specialty Beer",
  can: "Lata",
  glass: "Cristal",
  draft: "Barril",
  artisan: "Artesanal",
  traditional: "Tradicional",
  historic: "Histórica",
  high: "Alta",
  low: "Baja",
  any: "Cualquiera",
  wild: "Wild",
  lagered: "Lagered",
  aged: "Envejecida",
  origin: "Región de Origen",
  family: "Familia de Estilo",
  era: "Era",
  product_type: "Tipo de Producto",
  format: "Formato",
  isGluten: "¿Contiene Gluten?",
  modal_product_title: "Producto",
  modal_product_description:
    "Asegúrese de rellenar todos los campos obligatorios para introducir con éxito el producto. Toda la información descrita en esta sección es pública.",
  modal_product_add: "Añadir Producto",
  modal_delete_product_description:
    "¡Cuidado! Vas a eliminar un producto. Esta acción borrará de la base de datos la información relativa al mismo. ¿Estás seguro que quieres eliminar el producto?",
  beer: "Cerveza",
  merchandising: "Merchandising",
  form_errors: translationsFormErrorsEn,
  name: "Nombre",
  description: "Descripción",
  year: "Año",
  upload_img_url: "Subir Imagen",
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