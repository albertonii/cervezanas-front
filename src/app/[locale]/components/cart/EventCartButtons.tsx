import React from 'react';
import debounce from 'debounce';
import { DecreaseButton } from '../ui/buttons/DecreaseButton';
import { IncreaseButton } from '../ui/buttons/IncreaseButton';
import { DeleteButton } from '../ui/buttons/DeleteButton';

interface Props {
    quantity: number;
    item: any;
    handleIncreaseCartQuantity: () => void;
    handleDecreaseCartQuantity: () => void;
    handleRemoveFromCart: (id: string) => void;
    displayDeleteButton?: boolean;
}

export default function EventCartButtons({
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

            <span className="text-lg font-semibold text-gray-900 dark:text-white">
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
