// components/ProductAccordion.js
import React from "react";
import { IProduct } from "../../../../lib/types";
import { useAuth } from "../../../../components/Auth";
import { Spinner } from "../../../../components/common";
import AccordionItem from "./AccordionItem";

interface Props {
  products: IProduct[];
}

const ProductAccordion: React.FC<Props> = ({ products }) => {
  const { user } = useAuth();

  if (!products || products.length === 0) {
    return <div>No products found.</div>;
  }

  if (!user) {
    return <div>Please login to see products.</div>;
  }

  if (products.length === 0) {
    return <Spinner color="beer-blonde" size="xLarge" absolute center />;
  }

  return (
    <div className="w-full" id={`accordion-collapse`} data-accordion="collapse">
      {products.map((product) => (
        <div
          key={product.id}
          className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
        >
          <AccordionItem product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductAccordion;
