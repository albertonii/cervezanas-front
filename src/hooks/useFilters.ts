import { FilterProps, useAppContext } from '../app/context/AppContext';
import { IProduct } from '@/lib//types/types';

export default function useFilters() {
    const { filters, handleFilters } = useAppContext();

    const filterProducts = (products: IProduct[]) => {
        console.log('products', products);
        return products.filter((product) => {
            const {
                category,
                style,
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

            return (
                ibu[0] <= product.beers.ibu &&
                ibu[1] >= product.beers.ibu &&
                abv[0] <= product.beers.intensity &&
                abv[1] >= product.beers.intensity &&
                price[0] <= product.price &&
                price[1] >= product.price &&
                // region.includes(product.beers.region) &&
                (isPack ? product.category === 'BOX_PACK' : true) &&
                (isAwardWinning ? product.awards.length > 0 : true) &&
                // (isOrganic ? product.beers.isOrganic : true) &&
                // (isNonAlcoholic ? product.beers.isNonAlcoholic : true) &&
                (isGlutenFree ? product.beers.is_gluten : true)
                // volume.includes(product.beers.volume.toFixed()) &&
                // color.includes(product.beers.color) &&
                // category.includes(product.category) &&
                // style.includes(product.beers.family)
            );
        });
    };

    return { filterProducts, handleFilters, filters };
}
