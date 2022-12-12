import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { supabase } from "../../../utils/supabaseClient";
import { useUser } from "../../Auth/UserContext";
import ProductModal from "../../Modals/ProductModal";

enum product_type_enum {
  Beer = "beer",
  Merchandising = "merchandising",
}

const product_type_options = [
  {
    label: "Beer",
    value: product_type_enum.Beer,
  },
  {
    label: "Merchandising",
    value: product_type_enum.Merchandising,
  },
];

interface IBeer {
  id: string;
  name: string;
  description: string;
  created_at: Date;
  social_cause_id: number;
  lot_id: number;
  type: number;
  feedback_id: number;
  category: number;
  intensity: string;
  fermentation: string;
  color: string;
  origin: string;
  family: string;
  era: string;
  aroma: string;
  format: string;
  awards_id: string;
  campaign_id: string;
  is_gluten: boolean;
  owner_id: string;
}

export const Products = () => {
  const { t } = useTranslation();

  const { user } = useUser();

  const [productType, setProductType] = useState(product_type_enum.Beer);
  const [name, setName] = useState("Jaira IPA");
  const [intensity, setIntensity] = useState("");
  const [color, setColor] = useState("Red");
  const [family, setFamily] = useState("");

  const [beers, setBeers] = useState<IBeer[]>();

  const [modalFormData, setModalFormData] = useState("");

  const {
    register,
    formState: { errors },
    watch,
    setValue,
    getValues,
    handleSubmit,
  } = useForm({
    defaultValues: {
      name: "Jaira IPA",
      color: "red",
      intensity: "",
      family: "",
      type: product_type_enum.Beer,
    },
  });

  const handleChangeType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value: any = event?.target.value;
    setProductType(value);
  };

  useEffect(() => {
    setValue("name", modalFormData);
  }, [setValue, modalFormData]);

  useEffect(() => {
    const getProducts = async () => {
      let { data, error } = await supabase
        .from("beers")
        .select("*")
        .eq("owner_id", user?.id);

      if (error) throw error;

      console.log(data);

      return data;
    };

    getProducts();
  }, [user]);

  return (
    <>
      <div className="py-6 px-4 pt-12" aria-label="Products">
        <div className="flex">
          <div className="text-4xl pr-12">Productos</div>
          {/* <Modal
            isVisible={false}
            btnTitle={"Añadir producto"}
            title={"Añadir un nuevo producto"}
            description={"Describa con exactitud las propiedades del producto"}
          >
            <div>
              <div className="w-full">
                <select
                  {...register("type")}
                  value={product_type_enum.Beer}
                  onChange={handleChangeType}
                  className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  {product_type_options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex w-full flex-row space-x-3 ">
                <div className="w-full ">
                  <label
                    htmlFor="productName"
                    className="text-sm text-gray-600"
                  >
                    {t("product_name")}
                  </label>
                  <input
                    type="text"
                    id="productName"
                    placeholder="Jaira IPA"
                    readOnly
                    className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    {...register("name")}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="w-full ">
                  <label htmlFor="color" className="text-sm text-gray-600">
                    {t("product_color")}
                  </label>
                  <input
                    type="text"
                    id="color"
                    className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    value={color}
                    {...register("color")}
                    onChange={(e) => setColor(e.target.value)}
                  />
                </div>
              </div>
            </div>
        </div> */}

          <ProductModal isVisible={false} />
        </div>

        <div>
          <ul>
            <li>{name}</li>
            <li>Producto 2</li>
            <li>Producto 3</li>
            <li>Producto 4</li>
          </ul>
        </div>
      </div>
    </>
  );
};
