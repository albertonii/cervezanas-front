import { useEffect, useState } from "react";
import { Beer } from "../../../lib/types";
import { supabase } from "../../../utils/supabaseClient";
import { useAuth } from "../../Auth/useAuth";
import LotModalAdd from "../../Modals/AddLot";
import Modal from "../../Modals/Modal";
import ProductModalUpd from "../../Modals/ProductModalUpd";
import ProductList from "./ProductList";
import AddProduct from "../../Modals/AddProduct";
import DeleteProduct from "../../Modals/DeleteProduct";

export const Products = () => {
  const { user } = useAuth();
  const [isEditShowModal, setIsEditShowModal] = useState(false);
  const [isDeleteShowModal, setIsDeleteShowModal] = useState(false);
  const [beerModal, setBeerModal] = useState<any>(null);

  const [beers, setBeers] = useState<Beer[]>([]);

  useEffect(() => {
    const getProducts = async () => {
      const { data: beers, error } = await supabase
        .from("beers")
        .select(
          `
          *,
          product_lot (
            lot_id
          ),
          product_inventory (
            quantity
          )
        `
        )
        .eq("owner_id", user?.id);
      if (error) throw error;
      setBeers(beers);

      return beers;
    };
    getProducts();
  }, [user]);

  const handleSetBeers = (value: Beer[]) => {
    setBeers(value);
  };

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

          <Modal
            isVisible={false}
            title={"add_product"}
            btnTitle={"add_product"}
            description={""}
          >
            <AddProduct beers={beers!} handleSetBeers={handleSetBeers} />
          </Modal>

          <Modal
            isVisible={false}
            title={"add_lot"}
            btnTitle={"add_lot"}
            description={""}
          >
            <LotModalAdd />
          </Modal>
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
          <Modal
            isVisible={false}
            title={"add_lot"}
            btnTitle={"add_lot"}
            description={""}
          >
            <DeleteProduct
              beers={beers!}
              beerId={beerModal.id}
              isDeleteShowModal={isDeleteShowModal}
              handleDeleteShowModal={handleDeleteShowModal}
              handleSetBeers={handleSetBeers}
            />
          </Modal>
        ) : (
          <div></div>
        )}
      </div>
    </>
  );
};

export async function getServerSideProps() {}
