import React from 'react';
import Image from 'next/image';
import Button from '@/app/[locale]/components/common/Button';
import useEventCartStore from '@/app/store//eventCartStore';

interface Props {
    eventId: string;
}

export default function MinimizedCart({ eventId }: Props) {
    const { getCartQuantity, handleOpen } = useEventCartStore();

    return (
        <Button onClick={() => handleOpen(false)}>
            <div className="flex flex-col items-center justify-center gap-2 p-1">
                <div className="relative rounded-full">
                    <Image
                        src={'/icons/shopping-cart.svg'}
                        loader={() => '/icons/shopping-cart.svg'}
                        alt={'Go to Shopping cart'}
                        className={'rounded-full'}
                        width={0}
                        height={0}
                        style={{ width: '60px', height: '60px' }}
                    />
                    <span className="white absolute bottom-0 right-0 flex h-6 w-6 translate-x-2 translate-y-2 items-center justify-center rounded-full bg-beer-blonde">
                        {getCartQuantity(eventId)}
                    </span>
                </div>
            </div>
        </Button>
    );
}
