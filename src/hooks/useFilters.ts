import { useAppContext } from "../../context/AppContext";
import { IProduct } from "../lib/types.d";

export default function useFilters() {
  const { filters, setFilters } = useAppContext();

  const filterProducts = (products: IProduct[]) => {
    return products.filter((product) => {
      return (
        product.price >= filters.minPrice &&
        (filters.category === "all" || product.category === filters.category)
      );
    });
  };

  return { filterProducts, setFilters };
}
