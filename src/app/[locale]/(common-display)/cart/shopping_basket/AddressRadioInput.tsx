import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { IAddress } from '@/lib//types/types';
import { UseFormRegister } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@/app/[locale]/components/ui/buttons/IconButton';

interface Props {
    address: IAddress;
    setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
    register: UseFormRegister<any>;
    addressNameId: string;
    defaultSelectedAddress: IAddress | undefined;
    handleDefaultAddress: (address: IAddress) => void;
    handleSelectedAddress: (address: IAddress) => void;
    isAddressSelected: (addressId: string) => boolean;
}

export default function AddressRadioInput({
    address,
    setShowDeleteModal,
    register,
    addressNameId,
    defaultSelectedAddress,
    handleDefaultAddress,
    handleSelectedAddress,
    isAddressSelected,
}: Props) {
    const t = useTranslations();

    const [onHover, setOnHover] = useState<boolean>();
    const [effect, setEffect] = useState(false);

    const starColor = { filled: '#fdc300', unfilled: '#a87a12' };

    const handleOnSelectAddress = () => {
        handleSelectedAddress(address);
    };

    const handleOnClickDefaultShipping = () => {
        handleDefaultAddress(address);
    };

    const handleOnDeleteAddress = () => {
        handleSelectedAddress(address);
        setShowDeleteModal(true);
    };

    return (
        <div className="w-full flex gap-2">
            <input
                onClick={() => handleOnSelectAddress()}
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
                className={`
                     inline-flex w-full cursor-pointer items-center justify-between rounded-lg py-2 px-4 text-gray-500 transition-all duration-200 hover:bg-beer-blonde hover:text-gray-600 
                     dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300  
                     ${
                         isAddressSelected(address.id)
                             ? 'border-2 border-beer-blonde bg-beer-softFoam'
                             : 'border border-gray-200 bg-white'
                     }
                 `}
            >
                <address className="flex flex-col lg:block lg:space-x-4">
                    <span className="w-full text-sm sm:text-base md:text-lg font-semibold">
                        {address.name} {address.lastname}
                    </span>
                    <span className="w-full">
                        {address.address}, {address.city}, {address.sub_region}{' '}
                        - {address.region}, {address.zipcode},{' '}
                        {`${t('countries.' + address.country)}`}
                    </span>
                </address>
            </label>

            <div className="space-y-2 ">
                <IconButton
                    onClick={handleOnDeleteAddress}
                    icon={faTrash}
                    title={t('delete_address')}
                    box
                    color={{
                        filled: '#d75062',
                        unfilled: '#d75062',
                    }}
                />

                <div
                    className="mt-0 flex items-center justify-center rounded border-2 border-beer-blonde p-1 transition duration-100 ease-in cursor-pointer transition delay-100 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
                    onClick={() => handleOnClickDefaultShipping()}
                >
                    <FontAwesomeIcon
                        size="lg"
                        className={`'
                            ${effect && 'animate-wiggle' && 'animate-wiggle'} `}
                        icon={faStar}
                        style={{
                            color:
                                onHover ||
                                defaultSelectedAddress?.id === address.id
                                    ? starColor.filled
                                    : starColor.unfilled,
                        }}
                        onMouseEnter={() => setOnHover(true)}
                        onMouseLeave={() => setOnHover(false)}
                        onAnimationEnd={() => setEffect(false)}
                        title={t('set_shipping_info_as_default')}
                    />
                </div>
            </div>
        </div>
    );
}
