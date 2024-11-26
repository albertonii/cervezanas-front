import useEventCartStore from '@/app/store/eventCartStore';
import Button from '@/app/[locale]/components/ui/buttons/Button';
import React from 'react';
import { formatCurrency } from '@/utils/formatCurrency';
import { useTranslations } from 'next-intl';
import Title from '@/app/[locale]/components/ui/Title';
import Label from '@/app/[locale]/components/ui/Label';

interface Props {
    eventId: string;
    subtotal: number;
    total: number;
    onSubmit: () => void;
}

const EventOrderSummary = ({ eventId, subtotal, total, onSubmit }: Props) => {
    const t = useTranslations();

    const { eventCarts } = useEventCartStore();

    return (
        <div className="flex h-full w-full flex-col items-stretch justify-start md:flex-col lg:space-x-8 xl:flex-col xl:space-x-0 gap-4 dark:bg-gray-900 rounded-lg shadow bg-gray-50 px-4 py-6 dark:bg-gray-800 md:items-start md:p-6 xl:w-96 xl:p-4">
            {/* Summary */}
            <div className="flex flex-shrink-0 flex-col items-start justify-start">
                <div className="flex w-full flex-col space-y-6 bg-gray-50  dark:bg-gray-800">
                    <Title>{t('summary')}</Title>

                    <div className="flex w-full justify-between">
                        <Label>{t('subtotal')}</Label>
                        <Label>{formatCurrency(subtotal)}</Label>
                    </div>

                    <div className="flex w-full items-start justify-between">
                        <div className="flex flex-col items-start">
                            <Label>{t('total')}</Label>
                            <Label size="xsmall">
                                ({t('with_taxes_included')})
                            </Label>
                        </div>
                        <Label>{formatCurrency(total)}</Label>
                    </div>

                    {/* Proceed to pay */}
                    <div className="flex flex-col w-full items-center justify-center md:items-start md:justify-start gap-2">
                        <Button
                            large
                            primary
                            class={`font-semibold`}
                            title={''}
                            disabled={eventCarts[eventId]?.length === 0}
                            onClick={() => {
                                onSubmit();
                            }}
                        >
                            {t('proceed_to_pay')}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventOrderSummary;
