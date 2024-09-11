import { Type } from '@/lib//productEnum';
import { IProduct } from '@/lib//types/types';
import { color_options, family_options } from '@/lib/beerEnum';
import { useAppContext } from '../app/context/AppContext';

interface FilterStack {
    filterByIbu: boolean;
    filterByAbv: boolean;
    filterByColor: boolean;
    filterByVolumeCan: boolean;
    filterByVolumeBottle: boolean;
    filterByVolumeKeg: boolean;
    filterByFamily: boolean;
    filterByGlutenFree: boolean;
    filterByPrice: boolean;
    filterByCategory: boolean;
    filterByRegion: boolean;
    filterByPack?: boolean;
    filterByAwards?: boolean;
    filterByOrganic?: boolean;
    filterByNonAlcoholic?: boolean;
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
                volume_can,
                volume_bottle,
                volume_keg,
                region,
                isPack,
                isAwardWinning,
                isOrganic,
                isNonAlcoholic,
                isGlutenFree,
            } = filters;

            let filterStack: Partial<FilterStack> = {};

            // Filtrado para productos de tipo BEER
            if (product.beers) {
                const beerFamilyNumber: number = parseInt(product.beers.family);
                const beerFamily = family_options[beerFamilyNumber]?.label;

                const colorNumber: number = parseInt(product.beers.color);
                const beerColor = color_options[colorNumber]?.label;

                const volumeNumber: number = parseInt(
                    product.beers.volume.toFixed(),
                );
                const beerVolume = volumeNumber.toString();

                // Aplicando filtros
                filterStack.filterByIbu =
                    ibu[0] <= product.beers.ibu && ibu[1] >= product.beers.ibu;
                filterStack.filterByAbv =
                    abv[0] <= product.beers.intensity &&
                    abv[1] >= product.beers.intensity;

                filterStack.filterByColor =
                    color.length === 0 || color.includes(beerColor);
                filterStack.filterByVolumeCan =
                    volume_can.length === 0 || volume_can.includes(beerVolume);
                filterStack.filterByVolumeBottle =
                    volume_bottle.length === 0 ||
                    volume_bottle.includes(beerVolume);
                filterStack.filterByVolumeKeg =
                    volume_keg.length === 0 || volume_keg.includes(beerVolume);

                filterStack.filterByFamily =
                    family.length === 0 || family.includes(beerFamily);
                // filterStack.filterByGlutenFree =
                //     !isGlutenFree || product.beers.is_gluten;
                // filterStack.filterByRegion =
                //     region.length === 0 ||
                //     region.includes(product.beers.region);
            }

            // Filtrado para productos de tipo PACK
            if (isPack) {
                filterStack.filterByPack = product.type === Type.BOX_PACK;
            }

            // Filtrado para premios (awards)
            if (isAwardWinning) {
                filterStack.filterByAwards =
                    product.awards && product.awards.length > 0;
            }

            // Filtrado por precio y categoría
            filterStack.filterByPrice =
                price[0] <= product.price && price[1] >= product.price;
            // filterStack.filterByCategory =
            //     category.length === 0 || category.includes(product.category);

            if (
                !isPack &&
                product.type === Type.BOX_PACK &&
                (category.length > 0 ||
                    color.length > 0 ||
                    family.length > 0 ||
                    isAwardWinning ||
                    isGlutenFree ||
                    isNonAlcoholic ||
                    isOrganic ||
                    region.length > 0 ||
                    volume_can.length > 0 ||
                    volume_bottle.length > 0 ||
                    volume_keg.length)
            ) {
                filterStack.filterByPack = false;
            }

            // Si todos los filtros son verdaderos, se incluye el producto
            return Object.values(filterStack).every(
                (filter) => filter === true,
            );
        });
    };

    return { filterProducts, handleFilters, filters };
}
