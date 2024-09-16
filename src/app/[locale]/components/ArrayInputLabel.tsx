import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChipCard } from './common/ChipCard';

interface ItemsInputProp {
    form: any;
    label: string;
    labelText: string;
    placeholder: string;
    extraInfo?: string;
}

const ArrayInputLabel: React.FC<ItemsInputProp> = ({
    form,
    label,
    labelText,
    placeholder,
    extraInfo,
}) => {
    const { getValues, setValue } = form;

    const [items, setItems] = useState<string[]>([]);

    const t = useTranslations();
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        console.log(getValues(label));

        return () => {};
    }, [getValues(label)]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' || event.key === ',') {
            event.preventDefault();
            addItem();
        } else if (event.key === 'Backspace') {
            if (inputValue === '') {
                event.preventDefault();
                removeLastItem();
            }
        }
    };

    const addItem = () => {
        if (inputValue.trim() !== '') {
            setItems([...items, inputValue.trim()]);
            setValue(label, [...items, inputValue.trim()]);
            setInputValue('');
        }
    };

    const removeLastItem = () => {
        if (items.length > 0) {
            const newItems = items.slice(0, -1);
            setItems(newItems);
            setValue(label, newItems);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleRemoveItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
        setValue(label, newItems);
    };

    return (
        <div>
            <div className="flex flex-col">
                <label htmlFor="items" className="text-sm text-gray-600">
                    {t(labelText)}
                </label>

                {extraInfo && (
                    <span className="text-sm text-gray-400 dark:text-gray-300">
                        {t('add_ingredients_info')}
                    </span>
                )}
            </div>

            <input
                id="items"
                type="text"
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="relative block w-full mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-blonde focus:outline-none focus:ring-beer-blonde"
                placeholder={t(placeholder)}
            />

            {/* Display added items */}
            <div className="mt-4 flex flex-wrap gap-2">
                {items.map((item, index) => (
                    <div id={item + index}>
                        <ChipCard
                            content={item}
                            handleRemove={() => handleRemoveItem(index)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ArrayInputLabel;
