import { useAppContext } from '../app/context/AppContext';
import { IProduct } from '@/lib//types/types';
import { family_options } from '@/lib/beerEnum';

export default function useFilters() {
    const { filters, handleFilters } = useAppContext();

    const filterProducts = (products: IProduct[]) => {
        return products.filter((product) => {
            const {
                category,
                family,
                ibu,
                abv,
                color,
                price,
                volume,
                region,
                isPack,
                isAwardWinning,
                isOrganic,
                isNonAlcoholic,
                isGlutenFree,
            } = filters;

            if (!product || !product.beers || !product.awards) return false;

            const beerFamilyNumber: number = parseInt(product.beers.family);
            const beerFamily = family_options[beerFamilyNumber].label;

            // Comprobaciones para cada filtro, solo se aplica si tiene algún valor seleccionado
            const filterByIbu =
                ibu[0] <= product.beers.ibu && ibu[1] >= product.beers.ibu;
            const filterByAbv =
                abv[0] <= product.beers.intensity &&
                abv[1] >= product.beers.intensity;
            const filterByPrice =
                price[0] <= product.price && price[1] >= product.price;
            // const filterByRegion =
            //     region.length === 0 || region.includes(product.beers.region);
            const filterByColor =
                color.length === 0 || color.includes(product.beers.color);
            const filterByVolume =
                volume.length === 0 ||
                volume.includes(product.beers.volume.toFixed());
            const filterByCategory =
                category.length === 0 || category.includes(product.category);
            const filterByPack = !isPack || product.category === 'BOX_PACK';
            const filterByAwards = !isAwardWinning || product.awards.length > 0;
            // const filterByOrganic = !isOrganic || product.beers.isOrganic;
            // const filterByNonAlcoholic =
            //     !isNonAlcoholic || product.beers.isNonAlcoholic;
            const filterByGlutenFree = !isGlutenFree || product.beers.is_gluten;
            const filterByFamily =
                family.length === 0 || family.includes(beerFamily);

            // Solo si todos los filtros seleccionados son válidos, devolver el producto
            return (
                filterByIbu &&
                filterByAbv &&
                filterByPrice &&
                // filterByRegion &&
                filterByColor &&
                filterByVolume &&
                filterByCategory &&
                filterByPack &&
                filterByAwards &&
                // filterByOrganic &&
                // filterByNonAlcoholic &&
                filterByGlutenFree &&
                filterByFamily
            );
        });
    };

    return { filterProducts, handleFilters, filters };
}
