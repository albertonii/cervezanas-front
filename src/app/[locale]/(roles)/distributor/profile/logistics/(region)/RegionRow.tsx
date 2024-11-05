import { UseFormRegister } from 'react-hook-form';
import { JSONRegion } from '@/lib/types/distribution_areas';
import { ICoverageArea } from '@/lib/types/types';

interface RegionRowProps {
    region: JSONRegion;
    globalIndex: number;
    selectedRegions: ICoverageArea[];
    handleCheckbox: (
        e: React.ChangeEvent<HTMLInputElement>,
        name: JSONRegion,
    ) => void;
    register: UseFormRegister<any>;
}

const RegionRow = ({
    region,
    globalIndex,
    handleCheckbox,
    register,
    selectedRegions,
}: RegionRowProps) => {
    const isChecked = (region: JSONRegion) => {
        return selectedRegions.some(
            (item) =>
                item.region === region.name && item.country === region.country,
        );
    };

    return (
        <>
            <th
                scope="row"
                className="w-20 whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
            >
                <input
                    type="checkbox"
                    {...register(`regions`)}
                    id={`regions.${globalIndex}.${region.name}}`}
                    value={region.name}
                    checked={isChecked(region)}
                    onChange={(e) => {
                        handleCheckbox(e, region);
                    }}
                    className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
                />
            </th>

            <td className="px-6 py-4 font-semibold text-beer-blonde hover:text-beer-draft dark:text-beer-softBlonde">
                {region.name}
            </td>
        </>
    );
};

export default RegionRow;
