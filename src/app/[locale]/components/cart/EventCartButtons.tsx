import React from 'react';
import debounce from 'debounce';
import { faPlus, faMinus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '../ui/buttons/IconButton';

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
            <IconButton
                onClick={onClickDecreaseDebounce}
                classContainer="p-2 bg-beer-foam rounded hover:bg-beer-gold"
                icon={faMinus}
                title="Disminuir cantidad"
                aria-label="Disminuir cantidad"
            />
            <span className="w-8 text-center text-lg">{quantity}</span>
            <IconButton
                onClick={onClickIncreaseDebounce}
                classContainer="p-2 bg-beer-foam rounded hover:bg-beer-gold"
                icon={faPlus}
                title="Aumentar cantidad"
                aria-label="Aumentar cantidad"
            />
            {displayDeleteButton && (
                <IconButton
                    onClick={() => handleRemoveFromCart(item.product_id)}
                    classContainer="p-2 bg-red-600 rounded hover:bg-red-700 text-white"
                    icon={faTrash}
                    title="Eliminar del carrito"
                    aria-label="Eliminar del carrito"
                />
            )}
        </div>
    );
}
