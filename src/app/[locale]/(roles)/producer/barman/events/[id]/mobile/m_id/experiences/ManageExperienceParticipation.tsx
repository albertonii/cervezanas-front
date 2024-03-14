'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { SupabaseProps } from '../../../../../../../../../../constants';
import { IBMExperienceParticipants } from '../../../../../../../../../../lib/types/quiz';
import { useAuth } from '../../../../../../../../(auth)/Context/useAuth';

const BASE_PRODUCTS_URL = SupabaseProps.BASE_PRODUCTS_URL;

interface Props {
    experienceParticipant: IBMExperienceParticipants;
}

export default function ManageExperienceParticipation({
    experienceParticipant,
}: Props) {
    const t = useTranslations();

    experienceParticipant;

    const { supabase } = useAuth();

    return (
        <section className="relative flex  h-screen w-full flex-col items-start overflow-hidden rounded-lg bg-white px-6 pb-8 pt-14 shadow-lg sm:pt-8 ">
            <section className="my-6 grid w-full grid-cols-12 items-start gap-y-8 space-x-4 lg:grid-cols-12 ">
                {/* Experience Participant Information  */}
                <div className="col-span-12 flex flex-row space-y-2 lg:col-span-8">
                    {/* User  */}
                    <div
                        aria-labelledby="information-heading"
                        className="mt-2 flex flex-col"
                    >
                        {/* <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">
                            {selectedProduct.name}
                        </h2>

                        <h3 id="information-heading" className="sr-only">
                            {t('product_information')}
                        </h3>

                        <p className="text-2xl text-gray-900">
                            {formatCurrency(selectedProduct.price)}
                        </p>

                        <div className="mt-6 flex min-h-[6vh] items-center pr-6">
                            <p className="truncate text-lg">
                                {selectedProduct.description}
                            </p>
                        </div> */}
                    </div>
                </div>
            </section>

            {/* Input to modify stock quantity server in the Consumption Point  */}
            <section className="grid grid-cols-2 items-end space-x-4 ">
                {/* Product stock information in this CP */}
                {/* <div className=" min-h-[6vh] items-center space-y-4 ">
                    <>
                        <p className="text-lg">
                            {t('quantity_bought')}:
                            <span className="ml-2 text-2xl text-gray-900">
                                {quantity}
                            </span>
                        </p>
                    </>

                    <>
                        <p className=" text-lg">
                            {t('quantity_served')}:
                            <span className="ml-2 text-2xl text-gray-900">
                                {quantityServed}
                            </span>
                        </p>
                    </>

                    <>
                        <p className="text-lg">
                            {t('quantity_left_to_serve')}:
                            <span className="ml-2 text-2xl text-gray-900">
                                {quantity - quantityServed}
                            </span>
                        </p>
                    </>
                </div> */}

                {/* Order item status information  */}
                {/* <div className="absolute right-0 top-0 mr-6 mt-6 min-h-[6vh]  space-x-4">
                    <p className="text-lg">
                        {t('status')}:
                        <span className="ml-2 text-2xl text-gray-900">
                            {t(itemStatus)}
                        </span>
                    </p>
                </div>

                <div className="flex flex-col items-start justify-center">
                    <label
                        htmlFor="quantity"
                        className="block text-sm font-medium text-gray-700 lg:text-xl"
                    >
                        {t('quantity_to_serve')}
                    </label>

                    <div className="relative mt-1 w-[12vw] rounded-md shadow-sm lg:w-[14vw]">
                        <input
                            type="number"
                            name="quantity"
                            id="quantity"
                            className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-beer-gold focus:ring-beer-darkGold sm:text-sm lg:text-xl"
                            placeholder="0"
                            min={quantityServedFromServer}
                            max={quantity}
                            value={quantityServed}
                            onChange={(e) => handleQuantityServed(e)}
                        />
                        <p className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-gray-500 sm:text-sm lg:text-xl">
                                /
                            </span>
                            <span className="text-gray-500 sm:text-sm lg:text-xl">
                                {quantity}
                            </span>
                        </p>
                    </div>
                </div>

                <Button
                    disabled={itemStatus === EVENT_ORDER_ITEM_STATUS.CONSUMED}
                    primary
                    onClick={() => handleSaveQuantityServed()}
                    class="bg-bear-brown hover:bg-bear-brown-light mt-4 inline-flex items-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    {t('save')}
                </Button>

                {itemStatus === EVENT_ORDER_ITEM_STATUS.CONSUMED && (
                    <p>
                        <span className="text-xl text-gray-900">
                            {t('product_has_been_consumed')}
                        </span>
                    </p>
                )} */}
            </section>
        </section>
    );
}
