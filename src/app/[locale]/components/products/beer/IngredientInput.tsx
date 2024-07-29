import React, { useState } from 'react';

interface IngredientInputProps {
    ingredients: string[];
    setIngredients: (ingredients: string[]) => void;
}

const IngredientInput: React.FC<IngredientInputProps> = ({
    ingredients,
    setIngredients,
}) => {
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

    return (
        <div>
            <label htmlFor="ingredients" className="text-sm text-gray-600">
                Ingredients
            </label>
            <input
                id="ingredients"
                type="text"
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="relative block w-full mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-blonde focus:outline-none focus:ring-beer-blonde"
                placeholder="Add an ingredient and press Enter or comma"
            />
        </div>
    );
};

export default IngredientInput;
