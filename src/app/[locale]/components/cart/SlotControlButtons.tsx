import debounce from 'debounce';
import React from 'react';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '../ui/buttons/IconButton';
import { DeleteButton } from '../ui/buttons/DeleteButton';

interface Props {
    quantity: number;
    item: any;
    handleIncreaseCartQuantity: () => void;
    handleDecreaseCartQuantity: () => void;
    handleRemoveFromCart: (id: string) => void;
    displayDeleteButton?: boolean;
}

export default function SlotControlButtons({
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
        <section className="flex items-center justify-center space-x-2 rounded-md border">
            <span className="mx-2 w-[20px] text-center text-xl text-beer-draft">
                {quantity}
            </span>

            <div className="flex flex-col ">
                <figure className="border">
                    <IconButton
                        onClick={() => onClickIncreaseDebounce()}
                        classContainer="border-none hover:bg-beer-softBlonde"
                        classIcon={''}
                        icon={faChevronUp}
                        title={''}
                    ></IconButton>
                </figure>

                <figure className="border">
                    <IconButton
                        onClick={() => onClickDecreaseDebounce()}
                        classContainer="border-none hover:bg-beer-softBlonde"
                        classIcon={''}
                        icon={faChevronDown}
                        title={''}
                    ></IconButton>
                </figure>
            </div>

            {displayDeleteButton && (
                <DeleteButton
                    onClick={() => handleRemoveFromCart(item.product_id)}
                />
            )}
        </section>
    );
}
