import { IProduct } from "../lib/types.d";
import { useAppContext } from "../context";

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
