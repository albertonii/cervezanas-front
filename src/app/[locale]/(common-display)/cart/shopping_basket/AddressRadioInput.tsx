import React from 'react';
import { useTranslations } from 'next-intl';
import { UseFormRegister } from 'react-hook-form';
import { IAddress } from '../../../../../lib/types/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton } from '../../../components/common/IconButton';
import { faLongArrowRight, faTrash } from '@fortawesome/free-solid-svg-icons';

interface Props {
    address: IAddress;
    setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
    register: UseFormRegister<any>;
    addressNameId: string;
}

export default function AddressRadioInput({
    address,
    setShowDeleteModal,
    register,
    addressNameId,
}: Props) {
    const t = useTranslations();
    return (
        <>
            <input
                type="radio"
                id={`${addressNameId}-${address.id}`}
                {...register(`${addressNameId}_info_id`, {
                    required: true,
                })}
                value={address.id}
                className="peer hidden"
                required
            />

            <label
                htmlFor={`${addressNameId}-${address.id}`}
                className="
                   peer-checked:border-product-softBlonde peer-checked:text-product-dark dark:peer-checked:text-product-blonde inline-flex w-full cursor-pointer items-center
                   justify-between rounded-lg border border-gray-200 bg-white py-2 px-4 text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-600 
                   peer-checked:border-2 peer-checked:border-beer-blonde peer-checked:bg-beer-softFoam dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700
                   dark:hover:text-gray-300 dark:peer-checked:bg-blue-900
                "
            >
                <address className="flex flex-col lg:block lg:space-x-4">
                    <span className="w-full text-lg font-semibold">
                        {address.name} {address.lastname}
                    </span>
                    <span className="w-full">
                        {address.address}, {address.city}, {address.sub_region}{' '}
                        - {address.region}, {address.zipcode},{' '}
                        {t(address.country)}
                    </span>
                </address>

                <div className="space-y-2">
                    <IconButton
                        onClick={() => setShowDeleteModal(true)}
                        icon={faTrash}
                        title={'delete_address'}
                    />

                    <FontAwesomeIcon
                        icon={faLongArrowRight}
                        style={{
                            color: '#fdc300',
                            width: '25px',
                        }}
                        title={'arrow_right'}
                        width={25}
                        height={25}
                    />
                </div>
            </label>
        </>
    );
}
