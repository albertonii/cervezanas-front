import { UseFormRegister } from 'react-hook-form';
import { JSONSubRegion } from '@/lib/types/distribution_areas';
import { ICoverageArea } from '@/lib/types/types';

interface SubRegionRowProps {
    sub_region: JSONSubRegion;
    globalIndex: number;
    selectedSubRegions: ICoverageArea[];
    handleCheckbox: (
        e: React.ChangeEvent<HTMLInputElement>,
        name: JSONSubRegion,
    ) => void;
    register: UseFormRegister<any>;
}

const SubRegionRow = ({
    sub_region,
    globalIndex,
    selectedSubRegions,
    handleCheckbox,
    register,
}: SubRegionRowProps) => {
    const isChecked = (sub_region: JSONSubRegion) => {
        return selectedSubRegions.some(
            (item) =>
                item.sub_region === sub_region.name &&
                item.region === sub_region.region &&
                item.country === sub_region.country,
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
                    {...register(`sub_regions`)}
                    id={`sub_regions.${globalIndex}.${sub_region.name}}`}
                    value={sub_region.name}
                    checked={isChecked(sub_region)}
                    onChange={(e) => {
                        handleCheckbox(e, sub_region);
                    }}
                    className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
                />
            </th>

            <td className="px-6 py-4 font-semibold text-beer-blonde hover:text-beer-draft">
                {sub_region.name}
            </td>
        </>
    );
};

export default SubRegionRow;
