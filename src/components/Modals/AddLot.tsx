import React from "react";

import LotForm from "../customLayout/Products/LotForm";

interface Props {
  isVisible: boolean;
}

const LotModalAdd = ({}: Props) => {
  return (
    <>
      <LotForm />
    </>
  );
};

export default LotModalAdd;
