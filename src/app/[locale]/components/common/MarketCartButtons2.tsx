import React from 'react';
import debounce from 'debounce';
import { IconButton } from './IconButton';
import { DeleteButton } from './DeleteButton';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

interface Props {
    quantity: number;
    item: any;
    handleIncreaseCartQuantity: () => void;
    handleDecreaseCartQuantity: () => void;
    handleRemoveFromCart: (id: string) => void;
    displayDeleteButton?: boolean;
}

export default function MarketCartButtons2({
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
        <section className="mr-2 flex items-center justify-center rounded-md border bg-white">
            <span className="mx-2 w-[30px] text-center text-xl text-beer-draft">
                {quantity}
            </span>

            <div className="flex flex-col ">
                <figure className="border">
                    <IconButton
                        onClick={() => onClickIncreaseDebounce()}
                        classContainer="rounded-none border-none p-1 hover:bg-beer-softBlonde"
                        classIcon={''}
                        icon={faChevronUp}
                        title={''}
                    ></IconButton>
                </figure>

                <figure className="border">
                    <IconButton
                        onClick={() => onClickDecreaseDebounce()}
                        classContainer="rounded-none border-none p-1 hover:bg-beer-softBlonde"
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
