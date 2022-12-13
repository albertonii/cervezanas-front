import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BeerEnum } from "../../../lib/beerEnum";
import { supabase } from "../../../utils/supabaseClient";
import { useUser } from "../../Auth/UserContext";
import ProductModal from "../../Modals/ProductModalAdd";
import ProductModalUpd from "../../Modals/ProductModalUpd";
import ProductList from "./ProductList";

interface Beer {
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
  campaign: string;
  is_gluten: boolean;
  owner_id: string;
}

export const Products = () => {
  const { t } = useTranslation();

  const { user } = useUser();

  const [productType, setProductType] = useState(BeerEnum.Product_type.beer);
  const [name, setName] = useState("Jaira IPA");
  const [intensity, setIntensity] = useState("");
  const [color, setColor] = useState("Red");
  const [family, setFamily] = useState("");

  const [isShowModal, setIsShowModal] = useState(false);
  const [beerModal, setBeerModal] = useState<any>(null);

  const [beers, setBeers] = useState<Beer[]>();

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
      type: BeerEnum.Product_type.beer,
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

      setBeers(data!);
      return data;
    };

    getProducts();
  }, [user]);

  const handleShowModal = (value: boolean) => {
    setIsShowModal(value);
  };

  const handleBeerModal = (beer: Beer) => {
    setBeerModal(beer);
  };

  return (
    <>
      <div className="py-6 px-4 pt-12" aria-label="Products">
        <div className="flex">
          <div className="text-4xl pr-12">Productos</div>

          <ProductModal isVisible={false} />
        </div>

        <div>
          <ProductList
            beers={beers!}
            handleShowModal={handleShowModal}
            handleBeerModal={handleBeerModal}
          />
        </div>

        {isShowModal ? (
          <ProductModalUpd isVisible={true} beer={beerModal} />
        ) : (
          <div></div>
        )}
      </div>
    </>
  );
};
