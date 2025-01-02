import React from 'react';
import debounce from 'debounce';
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
        <section className="mr-0 flex items-center justify-center rounded-md border bg-white sm:h-[82px]">
            <span className="mx-2 w-[20px] text-center text-xl text-beer-draft">
                {quantity}
            </span>

            <div className="flex flex-col ">
                <figure className="border shadow-sm">
                    <IconButton
                        onClick={() => onClickIncreaseDebounce()}
                        classContainer="rounded-none border-none hover:bg-beer-softBlonde sm:h-[40px] bg-gradient-to-t from-white to-gray-100"
                        icon={faChevronUp}
                        title={''}
                    ></IconButton>
                </figure>

                <figure className="border shadow-sm">
                    <IconButton
                        onClick={() => onClickDecreaseDebounce()}
                        classContainer="rounded-none border-none hover:bg-beer-softBlonde sm:h-[40px]  bg-gradient-to-b from-white to-gray-100"
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
