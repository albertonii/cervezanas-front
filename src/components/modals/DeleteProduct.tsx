import React from "react";
import { useTranslation } from "react-i18next";
import { Beer } from "../../lib/types";

import { supabase } from "../../utils/supabaseClient";
import Modal from "./Modal";

interface Props {
  beers: Beer[];
  beerId: string;
  isDeleteShowModal: boolean;
  handleDeleteShowModal: React.Dispatch<React.SetStateAction<any>>;
  handleSetBeers: React.Dispatch<React.SetStateAction<any>>;
}

const DeleteProduct = (props: Props) => {
  const { t } = useTranslation();
  const {
    beers,
    beerId,
    isDeleteShowModal,
    handleDeleteShowModal,
    handleSetBeers,
  } = props;

  const handleClick = () => {
    const handleDelete = async () => {
      const { data, error } = await supabase
        .from("beers")
        .delete()
        .eq("id", beerId);

      if (error) throw error;

      handleDeleteShowModal(false);

      handleSetBeers(
        beers.filter((b) => {
          return b.id !== beerId;
        })
      );

      return data;
    };

    handleDelete();
  };

  return (
    <Modal
      isVisible={false}
      title={"delete_product"}
      btnTitle={"delete_product"}
      description={""}
      handler={() => {
        handleClick();
      }}
    >
      <button className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
        {t("accept")}
      </button>
    </Modal>
  );
};

export default DeleteProduct;
