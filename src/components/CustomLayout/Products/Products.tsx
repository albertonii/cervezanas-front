import { useEffect, useState } from "react";
import { Beer } from "../../../types";
import { supabase } from "../../../utils/supabaseClient";
import { useUser } from "../../Auth/UserContext";
import ProductModal from "../../Modals/ProductModalAdd";
import ProductModalDelete from "../../Modals/ProductModalDelete";
import ProductModalUpd from "../../Modals/ProductModalUpd";
import ProductList from "./ProductList";

export const Products = () => {
  const { user } = useUser();

  const [isEditShowModal, setIsEditShowModal] = useState(false);
  const [isDeleteShowModal, setIsDeleteShowModal] = useState(false);
  const [beerModal, setBeerModal] = useState<any>(null);

  const [beers, setBeers] = useState<Beer[]>();

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

  const handleEditShowModal = (value: boolean) => {
    setIsEditShowModal(value);
  };

  const handleDeleteShowModal = (value: boolean) => {
    setIsDeleteShowModal(value);
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
            handleEditShowModal={handleEditShowModal}
            handleDeleteShowModal={handleDeleteShowModal}
            handleBeerModal={handleBeerModal}
          />
        </div>

        {isEditShowModal ? (
          <ProductModalUpd
            isVisible={true}
            beer={beerModal}
            handleEditShowModal={handleEditShowModal}
          />
        ) : (
          <div></div>
        )}

        {isDeleteShowModal ? (
          <ProductModalDelete
            beerId={beerModal.id}
            isDeleteShowModal={isDeleteShowModal}
            handleDeleteShowModal={handleDeleteShowModal}
          />
        ) : (
          <div></div>
        )}
      </div>
    </>
  );
};
