import Image from 'next/image';
import React from 'react';

interface Props {
    file?: any;
}

export function FilePreview({ file }: Props) {
    if (!file) {
        return null;
    }

    return (
        <section className=" relative h-[50px] w-[80px] items-center overflow-hidden rounded-md border-2 border-dotted border-gray-400 shadow-md">
            <div className="z-1 relative flex h-full w-full items-center justify-center bg-gray-200">
                <figure className="">
                    <Image
                        width={64}
                        height={64}
                        className="h-full w-full rounded"
                        src={URL.createObjectURL(file)}
                        loader={() => URL.createObjectURL(file)}
                        alt={''}
                    />
                </figure>
            </div>
        </section>
    );
}
