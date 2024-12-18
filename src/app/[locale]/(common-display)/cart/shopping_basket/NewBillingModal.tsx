import Modal from '@/app/[locale]/components/modals/Modal';
import React, { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { BillingInformationType } from '@/lib/enums';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { NewBillingCompanyAddress } from './NewBillingCompanyAddress';
import {
    NewBillingIndividualAddress,
    NewBillingIndividualAddressRef,
} from './NewBillingIndividualAddress';

interface Props {
    billingAddressesLength: number;
}

const NewBillingModal = ({ billingAddressesLength }: Props) => {
    const t = useTranslations();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [type, setType] = useState('individual');
    const individualFormRef = useRef<NewBillingIndividualAddressRef>(null);
    const companyFormRef = useRef<NewBillingIndividualAddressRef>(null);

    const handleTypeChange = (type: string) => {
        setType(type);
    };

    const handleSubmitBillingForm = async () => {
        if (
            type === BillingInformationType.INDIVIDUAL &&
            individualFormRef.current
        ) {
            const isValid = await individualFormRef.current.trigger();

            if (isValid) {
                individualFormRef.current?.submit();
                return { shouldClose: true };
            } else {
                return { shouldClose: false };
            }
        } else if (
            type === BillingInformationType.COMPANY &&
            companyFormRef.current
        ) {
            const isValid = await companyFormRef.current.trigger();

            if (isValid) {
                companyFormRef.current?.submit();
                return { shouldClose: true };
            } else {
                return { shouldClose: false };
            }
        }
    };

    return (
        <Modal
            showBtn={true}
            showModal={showModal}
            setShowModal={setShowModal}
            title={t('add_billing_address')}
            btnTitle={t('save')}
            triggerBtnTitle={t('add_billing_address')}
            description={''}
            icon={faAdd}
            btnSize={'small'}
            classContainer={`!w-full sm:!w-1/2 `}
            handler={handleSubmitBillingForm}
        >
            <>
                <div className="flex justify-center">
                    <label>
                        <input
                            type="radio"
                            value={BillingInformationType.INDIVIDUAL}
                            checked={type === BillingInformationType.INDIVIDUAL}
                            onChange={() =>
                                handleTypeChange(
                                    BillingInformationType.INDIVIDUAL,
                                )
                            }
                            className="peer hidden"
                        />
                        <span
                            className={`
                                peer-checked:border-product-softBlonde peer-checked:text-product-dark dark:peer-checked:text-product-blonde inline-flex w-full cursor-pointer items-center
                                justify-between rounded-l-lg border border-gray-200 bg-white py-2 px-4 text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-600 
                                peer-checked:border-2 peer-checked:border-beer-blonde peer-checked:bg-beer-softFoam dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700
                                dark:hover:text-gray-300 dark:peer-checked:bg-beer-softFoam dark:peer-checked:border-beer-blonde dark:peer-checked:text-beer-dark
                                ${
                                    type ===
                                        BillingInformationType.INDIVIDUAL &&
                                    'font-semibold'
                                }
                            `}
                        >
                            Particular
                        </span>
                    </label>

                    <label>
                        <input
                            type="radio"
                            value={BillingInformationType.COMPANY}
                            checked={type === BillingInformationType.COMPANY}
                            onChange={() =>
                                handleTypeChange(BillingInformationType.COMPANY)
                            }
                            className="peer hidden"
                        />
                        <span
                            className={`
                                peer-checked:border-product-softBlonde peer-checked:text-product-dark dark:peer-checked:text-product-blonde inline-flex w-full cursor-pointer items-center
                                justify-between rounded-r-lg border border-gray-200 bg-white py-2 px-4 text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-600 
                                peer-checked:border-2 peer-checked:border-beer-blonde peer-checked:bg-beer-softFoam dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700
                                dark:hover:text-gray-300 dark:peer-checked:bg-beer-softFoam dark:peer-checked:border-beer-blonde dark:peer-checked:text-beer-dark
                                ${
                                    type === BillingInformationType.COMPANY &&
                                    'font-semibold'
                                }
                            `}
                        >
                            Empresa/Autónomo
                        </span>
                    </label>
                </div>

                {type === BillingInformationType.INDIVIDUAL ? (
                    <NewBillingIndividualAddress
                        ref={individualFormRef}
                        billingAddressesLength={billingAddressesLength}
                    />
                ) : (
                    <NewBillingCompanyAddress
                        ref={companyFormRef}
                        billingAddressesLength={billingAddressesLength}
                    />
                )}
            </>
        </Modal>
    );
};

export default NewBillingModal;
