'use client';

import Button from '@/app/[locale]/components/common/Button';
import Spinner from '@/app/[locale]/components/common/Spinner';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { IBMExperienceParticipants } from '@/lib/types/quiz';
import { useAuth } from '../../../../../(auth)/Context/useAuth';
import { useMessage } from '@/app/[locale]/components/message/useMessage';

interface Props {
    experienceParticipant: IBMExperienceParticipants;
}

export default function ManageExperienceParticipation({
    experienceParticipant,
}: Props) {
    const t = useTranslations();

    const { supabase } = useAuth();
    const { handleMessage } = useMessage();

    const [isPaid, setIsPaid] = useState(experienceParticipant.is_paid);
    const [isFinished, setIsFinished] = useState(
        experienceParticipant.is_finished,
    );
    const [isPaidLoading, setIsPaidLoading] = useState(false);
    const [isFinishedLoading, setIsFinishedLoading] = useState(false);

    const handlePaidBtn = async () => {
        setIsPaidLoading(true);

        const { error } = await supabase
            .from('bm_experience_participants')
            .update({ is_paid: !isPaid })
            .eq('id', experienceParticipant.id)
            .then((res) => {
                setIsPaid(!isPaid);
                setIsPaidLoading(false);

                return res;
            });

        if (error) {
            console.error(error);

            handleMessage({
                type: 'error',
                message: 'Error al actualizar el estado de pago',
            });

            return;
        }
    };

    const handleFinishedBtn = async () => {
        setIsFinishedLoading(true);

        const { error } = await supabase
            .from('bm_experience_participants')
            .update({ is_finished: !isFinished })
            .eq('id', experienceParticipant.id)
            .then((res) => {
                setIsFinished(!isFinished);
                setIsFinishedLoading(false);

                return res;
            });

        if (error) {
            console.error(error);

            handleMessage({
                type: 'error',
                message: 'Error al actualizar el estado de finalizado',
            });

            return;
        }
    };

    return (
        <section className="relative flex  h-screen w-full flex-col items-start overflow-hidden rounded-lg bg-white px-6 pb-8 pt-14 shadow-lg sm:pt-8 ">
            <section className="my-6 grid w-full grid-cols-12 items-start gap-y-8 space-x-4 lg:grid-cols-12 ">
                {/* Experience Participant Information  */}
                <div className="col-span-12 flex flex-col rounded-md shadow-lg sm:flex-row space-y-2 lg:col-span-8 gap-4">
                    {/* User  */}
                    <div className="mt-2 flex flex-col border-2 border-beer-draft bg-beer-softFoam rounded-sm p-4">
                        <span className="">
                            {
                                experienceParticipant.gamification?.users
                                    ?.username
                            }
                        </span>

                        <span className="">
                            {experienceParticipant.gamification?.users?.email}
                        </span>

                        <span className="">
                            {experienceParticipant.gamification?.users?.name}{' '}
                            {
                                experienceParticipant.gamification?.users
                                    ?.lastname
                            }
                        </span>
                    </div>

                    <div className="mt-2 flex flex-col border-2 border-beer-draft bg-beer-softFoam rounded-sm p-4 space-y-4">
                        {/* Is the payment completed ? */}
                        <div
                            className={`${
                                isPaidLoading ?? 'bg-gray-50 opacity-50'
                            }`}
                        >
                            {isPaidLoading && (
                                <Spinner
                                    color={'bg-beer-blonde'}
                                    size={'small'}
                                />
                            )}

                            <span>
                                {t('is_paid')}: {isPaid ? t('yes') : t('no')}
                            </span>

                            <Button primary small onClick={handlePaidBtn}>
                                {isPaid
                                    ? t('refund_experience')
                                    : t('charge_experience')}
                            </Button>
                        </div>

                        {/* Is the experience finished ? */}
                        <div
                            className={`${
                                isFinishedLoading ?? 'bg-gray-50 opacity-50'
                            }`}
                        >
                            {isFinishedLoading && (
                                <Spinner
                                    color={'bg-beer-blonde'}
                                    size={'small'}
                                />
                            )}

                            <span>
                                {t('is_finished')}:{' '}
                                {isFinished ? t('yes') : t('no')}
                            </span>

                            <Button primary small onClick={handleFinishedBtn}>
                                {isFinished
                                    ? t('mark_as_unfinished')
                                    : t('mark_as_finished')}
                            </Button>
                        </div>
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
