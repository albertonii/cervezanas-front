import React from 'react';
import { IncreaseButton } from '../ui/buttons/IncreaseButton';
import debounce from 'debounce';
import { DecreaseButton } from '../ui/buttons/DecreaseButton';
import { DeleteButton } from '../ui/buttons/DeleteButton';
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
        <section className="flex">
            <div className="mr-2 flex items-center justify-center space-x-2">
                <DecreaseButton onClick={() => onClickDecreaseDebounce()} />

                <span className="mx-2 text-xl font-bold text-beer-draft">
                    {quantity}
                </span>

                <IncreaseButton onClick={() => onClickIncreaseDebounce()} />

                {displayDeleteButton && (
                    <DeleteButton
                        onClick={() => handleRemoveFromCart(item.product_id)}
                    />
                )}
            </div>
        </section>
    );
}
