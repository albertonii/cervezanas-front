import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChipCard } from '../../common/ChipCard';

interface IngredientInputProps {
    ingredients: string[];
    setIngredients: (ingredients: string[]) => void;
}

const IngredientInput: React.FC<IngredientInputProps> = ({
    ingredients,
    setIngredients,
}) => {
    const t = useTranslations();
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' || event.key === ',') {
            event.preventDefault();
            addIngredient();
        }
    };

    const addIngredient = () => {
        if (inputValue.trim() !== '') {
            setIngredients([...ingredients, inputValue.trim()]);
            setInputValue('');
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleRemoveIngredient = (index: number) => {
        const newIngredients = ingredients.filter((_, i) => i !== index);
        setIngredients(newIngredients);
    };

    return (
        <div>
            <label htmlFor="ingredients" className="text-sm text-gray-600">
                {t('ingredients')}
            </label>

            <input
                id="ingredients"
                type="text"
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="relative block w-full mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-blonde focus:outline-none focus:ring-beer-blonde"
                placeholder={t('add_ingredients_placeholder')}
            />

            {/* Display added ingredients */}
            <div className="mt-4 flex flex-wrap gap-2">
                {ingredients.map((ingredient, index) => (
                    <span id={ingredient + index}>
                        <ChipCard
                            content={ingredient}
                            handleRemove={() => handleRemoveIngredient(index)}
                        />
                    </span>
                ))}
            </div>
        </div>
    );
};

export default IngredientInput;
