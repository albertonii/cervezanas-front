import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';

export function SliderMobile() {
    const t = useTranslations();
    return (
        <section className="w-full block sm:hidden">
            <article>
                <div className="w-full">
                    <figure className="m-auto w-full">
                        <Image
                            className="m-auto"
                            src="/assets/home/slider-mobile.webp"
                            width={600}
                            height={600}
                            alt="dingbat"
                        />
                    </figure>
                </div>
            </article>
        </section>
    );
}
