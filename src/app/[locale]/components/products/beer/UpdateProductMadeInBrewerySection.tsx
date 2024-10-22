import Title from '../../ui/Title';
import Label from '../../ui/Label';
import Description from '../../ui/Description';
import useFetchBreweriesByOwnerId from '@/hooks/useFetchBreweriesByOwnerId';
import React from 'react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { ModalUpdateProductFormData } from '@/lib/types/types';
import { faIndustry } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/app/[locale]/(auth)/Context/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
    form: UseFormReturn<ModalUpdateProductFormData>;
}

const UpdateProductMadeInBrewerySection = ({ form }: Props) => {
    const t = useTranslations();
    const { register, getValues, setValue } = form;

    const { user } = useAuth();

    const { data: breweries, error } = useFetchBreweriesByOwnerId(user.id);

    const handleBreweryChange = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        setValue('brewery_id', event.target.value, { shouldDirty: true });
    };

    if (error) {
        return <div>{t('error_fetching_breweries')}</div>;
    }

    return (
        <div className="relative border-2 rounded-lg border-gray-200 py-6 px-2 sm:px-6 bg-white shadow-md">
            <FontAwesomeIcon
                icon={faIndustry}
                title={'Industry Selector Icon'}
                className="h-12 w-12 text-beer-blonde absolute -top-4 -left-4 bg-white p-2 rounded-full shadow-lg"
            />

            <section className="mx-10 space-y-4">
                <Title size="large" color="black">
                    {t('modal_product_select_brewery_title')}
                </Title>

                <Description size="xsmall" color="gray">
                    {t('modal_product_add_brewery_description')}
                </Description>

                <Description size="xsmall" color="gray">
                    {t('modal_product_add_brewery_description_two')}
                </Description>

                <Label>
                    {t('select_brewery')}

                    <select
                        id="brewery"
                        {...register('brewery_id')}
                        className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                        onChange={handleBreweryChange}
                    >
                        <option key={'01'} value={''} selected>
                            -
                        </option>

                        {breweries &&
                            breweries.map((brewery) => (
                                <option
                                    key={brewery.id}
                                    value={brewery.id}
                                    selected={
                                        brewery.id === getValues('brewery_id')
                                    }
                                >
                                    {brewery.name} - {brewery.foundation_year}
                                </option>
                            ))}
                    </select>
                </Label>
            </section>
        </div>
    );
};

export default UpdateProductMadeInBrewerySection;
