// MarketCartButtons.tsx
import debounce from 'debounce';
import React from 'react';
import { DeleteButton } from '../ui/buttons/DeleteButton';
import { IncreaseButton } from '../ui/buttons/IncreaseButton';
import { DecreaseButton } from '../ui/buttons/DecreaseButton';

interface Props {
    quantity: number;
    item: any;
    handleIncreaseCartQuantity: () => void;
    handleDecreaseCartQuantity: () => void;
    handleRemoveFromCart: (id: string) => void;
    displayDeleteButton?: boolean;
}

export default function MarketCartButtons({
    quantity,
    item,
    handleIncreaseCartQuantity,
    handleDecreaseCartQuantity,
    handleRemoveFromCart,
    displayDeleteButton,
}: Props) {
    const onClickIncreaseDebounce = debounce(handleIncreaseCartQuantity, 100);
    const onClickDecreaseDebounce = debounce(handleDecreaseCartQuantity, 100);

    return (
        <div className="flex items-center space-x-2">
            <DecreaseButton onClick={onClickDecreaseDebounce} />

            <span className="text-sm font-semibold text-gray-900 dark:text-white sm:text-base">
                {quantity}
            </span>

            <IncreaseButton onClick={onClickIncreaseDebounce} />

            {displayDeleteButton && (
                <DeleteButton
                    onClick={() => handleRemoveFromCart(item.product_id)}
                />
            )}
        </div>
    );
}
