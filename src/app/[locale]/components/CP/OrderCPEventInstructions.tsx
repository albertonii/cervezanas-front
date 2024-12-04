import { Info } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';
import Label from '../ui/Label';
import Title from '../ui/Title';

const OrderCPEventInstructions = () => {
    const t = useTranslations('event');

    return (
        <div className="bg-beer-softBlonde border-l-4 border-beer-draft p-4 mb-6 rounded-r-lg">
            <div className="flex items-start">
                <Info className="w-6 h-6 text-beer-draft mr-3 flex-shrink-0 mt-1" />
                <div>
                    <Title size="xlarge" color="beer-draft">
                        {t('success_how_it_works')}
                    </Title>

                    <ol className="space-y-2 items-start flex flex-col">
                        <li>
                            <Label size="medium" color="beer-draft">
                                {t('success_instructions_1')}
                            </Label>
                        </li>
                        <li>
                            <Label size="medium" color="beer-draft">
                                {t('success_instructions_2')}
                            </Label>
                        </li>
                        <li>
                            <Label size="medium" color="beer-draft">
                                {t('success_instructions_3')}
                            </Label>
                        </li>
                        <li>
                            <Label size="medium" color="beer-draft">
                                {t('success_instructions_4')}
                            </Label>
                        </li>
                        <li>
                            <Label size="medium" color="beer-draft">
                                {t('success_instructions_5')}
                            </Label>
                        </li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default OrderCPEventInstructions;
