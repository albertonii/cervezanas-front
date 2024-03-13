import { useAppContext } from '../app/context/AppContext';
import { IProduct } from '../lib/types/types';

export default function useFilters() {
  const { filters, setFilters } = useAppContext();

  const filterProducts = (products: IProduct[]) => {
    return products.filter((product) => {
      return (
        product.price >= filters.minPrice &&
        (filters.category === 'all' || product.category === filters.category)
      );
    });
  };

  return { filterProducts, setFilters };
}
