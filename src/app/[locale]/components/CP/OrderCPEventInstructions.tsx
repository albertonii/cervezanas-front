import { Info } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';
import Label from '../ui/Label';
import Title from '../ui/Title';

const OrderCPEventInstructions = () => {
    const t = useTranslations('event');

    return (
        <div className="bg-beer-softBlonde dark:bg-gray-800 border-l-4 border-beer-draft dark:border-gray-600 p-4 mb-6 rounded-r-lg">
            <div className="flex items-start">
                <Info className="w-6 h-6 text-beer-draft dark:text-white mr-3 flex-shrink-0 mt-1" />
                <div>
                    <Title size="xlarge" color="beer-draft">
                        {t('success_how_it_works')}
                    </Title>

                    <ol className="space-y-2 items-start flex flex-col">
                        {[1, 3, 4, 5].map((num) => (
                            <li key={num}>
                                <Label
                                    size="medium"
                                    color="beer-draft"
                                    className="dark:text-white"
                                >
                                    {t(`success_instructions_${num}`)}
                                </Label>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default OrderCPEventInstructions;
