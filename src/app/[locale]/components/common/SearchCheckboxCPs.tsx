import InputSearch from '../form/InputSearch';
import React, { useEffect, useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useMessage } from '../message/useMessage';
import {
    IConsumptionPoint,
    IConsumptionPointEvent,
} from '@/lib/types/consumptionPoints';

interface Props {
    cps: IConsumptionPoint[];
    form: UseFormReturn<any, any>;
    checkedCPs?: IConsumptionPointEvent[];
    selectedEventId?: string;
}

export function SearchCheckboxCPs({
    cps,
    form,
    checkedCPs,
    selectedEventId,
}: Props) {
    const [query, setQuery] = useState('');
    const { register, setValue } = form;
    const { handleMessage } = useMessage();

    const [checkedCPsState, setCheckedCPsState] = useState<
        IConsumptionPointEvent[]
    >(checkedCPs ?? []);

    // Actualizar el estado interno cuando `checkedCPs` cambia
    useEffect(() => {
        setCheckedCPsState(checkedCPs ?? []);
    }, [checkedCPs]);

    useEffect(() => {
        setValue('cps', checkedCPsState);
    }, [checkedCPsState, setValue]);

    const handleCheckboxChange = (
        cp: IConsumptionPoint,
        isChecked: boolean,
    ) => {
        if (isChecked) {
            if (!cp.owner_id) {
                handleMessage({
                    type: 'error',
                    message: 'El punto de consumo no tiene un propietario.',
                });
                return;
            }
            // Verificar si el CP ya está en el array
            if (checkedCPsState.some((item) => item.cp_id === cp.id)) return;

            const cp_check: IConsumptionPointEvent = {
                created_at: new Date().toISOString(),
                cp_id: cp.id,
                event_id: selectedEventId ?? '',
                is_active: false,
                owner_id: cp.owner_id,
                is_cervezanas_event: false,
                id: '',
                start_date: '',
                end_date: '',
                cp_name: cp.cp_name,
                cp_description: cp.cp_description,
                status: cp.status,
                address: cp.address,
                stand_location: '',
                view_configuration: 'one_step',
                has_pending_payment: false,
                is_booking_required: cp.is_booking_required,
                maximum_capacity: cp.maximum_capacity,
            };

            setCheckedCPsState([...checkedCPsState, cp_check]);
        } else {
            setCheckedCPsState(
                checkedCPsState.filter((item) => item.cp_id !== cp.id),
            );
        }
    };

    const filteredItemsByCPName = useMemo(() => {
        if (!cps) return [];
        return cps.filter((cp) => {
            return cp.cp_name.toLowerCase().includes(query.toLowerCase());
        });
    }, [cps, query]);

    return (
        <section className="my-6 w-full">
            <div className="z-10 w-full rounded bg-white shadow dark:bg-gray-700">
                <InputSearch
                    query={query}
                    setQuery={setQuery}
                    searchPlaceholder={'search_by_name'}
                />

                <ul
                    className="h-48 overflow-y-auto px-3 pb-3 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="dropdownSearchButton"
                >
                    {filteredItemsByCPName.map((cp: IConsumptionPoint) => {
                        return (
                            <li
                                key={cp.id}
                                className="flex items-center justify-between rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                                {/* Checkbox Name  */}
                                <input
                                    id={`checkbox-item-${cp.id}`}
                                    type="checkbox"
                                    {...register(`cps.${cp.id}.cp_id`)}
                                    checked={checkedCPsState?.some(
                                        (cps_event) =>
                                            cps_event.cp_id === cp.id,
                                    )}
                                    onChange={(e) =>
                                        handleCheckboxChange(
                                            cp,
                                            e.target.checked,
                                        )
                                    }
                                    value={cp.id}
                                    className="hover:cursor-pointer h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
                                />
                                <label
                                    htmlFor={`checkbox-item-${cp.id}`}
                                    className="hover:cursor-pointer ml-2 w-full rounded text-sm font-medium text-gray-900 dark:text-gray-300"
                                >
                                    {cp.cp_name}
                                </label>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}
