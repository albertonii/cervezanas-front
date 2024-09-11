import { Type } from '@/lib//productEnum';
import { IProduct } from '@/lib//types/types';
import { family_options } from '@/lib/beerEnum';
import { useAppContext } from '../app/context/AppContext';

interface FilterStack {
    filterByIbu: boolean;
    filterByAbv: boolean;
    filterByColor: boolean;
    filterByVolume: boolean;
    filterByFamily: boolean;
    filterByGlutenFree: boolean;
    filterByPrice: boolean;
    filterByCategory: boolean;
    filterByPack?: boolean;
    filterByAwards?: boolean;
}

export default function useFilters() {
    const { filters, handleFilters } = useAppContext();

    const filterProducts = (products: IProduct[]): IProduct[] => {
        return products.filter((product) => {
            if (!product) return false;

            const {
                category,
                family,
                ibu,
                abv,
                color,
                price,
                volume,
                isPack,
                isAwardWinning,
                isGlutenFree,
            } = filters;

            let filterStack: Partial<FilterStack> = {};

            // Filtrado para productos de tipo BEER
            if (product.beers) {
                const beerFamilyNumber: number = parseInt(product.beers.family);
                const beerFamily = family_options[beerFamilyNumber]?.label;

                console.log(color);

                filterStack.filterByIbu =
                    ibu[0] <= product.beers.ibu && ibu[1] >= product.beers.ibu;
                filterStack.filterByAbv =
                    abv[0] <= product.beers.intensity &&
                    abv[1] >= product.beers.intensity;
                filterStack.filterByColor =
                    color.length === 0 || color.includes(product.beers.color);
                filterStack.filterByVolume =
                    volume.length === 0 ||
                    volume.includes(product.beers.volume.toFixed());
                filterStack.filterByFamily =
                    family.length === 0 || family.includes(beerFamily);
                filterStack.filterByGlutenFree =
                    !isGlutenFree || product.beers.is_gluten;
            }

            // Filtrado para productos de tipo PACK
            if (isPack && product.type === Type.BOX_PACK) {
                filterStack.filterByPack = isPack;
            }

            // Filtrado para premios (awards)
            if (
                isAwardWinning &&
                product.awards &&
                product.awards?.length > 0
            ) {
                filterStack.filterByAwards =
                    !isAwardWinning || product.awards.length > 0;
            }

            // Filtrado por precio y categoría
            filterStack.filterByPrice =
                price[0] <= product.price && price[1] >= product.price;
            // filterStack.filterByCategory =
            //     category.length === 0 || category.includes(product.category);

            console.log(filterStack);

            // Si todos los filtros son verdaderos, se incluye el producto
            return Object.values(filterStack).every(
                (filter) => filter === true,
            );
        });
    };

    return { filterProducts, handleFilters, filters };
}
