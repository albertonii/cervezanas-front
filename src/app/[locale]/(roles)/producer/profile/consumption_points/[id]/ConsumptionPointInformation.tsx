import CPEventInformation from './CPEventInformation';
import React from 'react';
import { OrdersQueue } from './OrdersQueue';
import { IConsumptionPointEvent } from '@/lib/types/consumptionPoints';

interface Props {
    cp: IConsumptionPointEvent;
}

const ConsumptionPointInformation = ({ cp }: Props) => {
    return (
        <div className="py-8 m-8">
            <OrdersQueue cp={cp} />
            <CPEventInformation cp={cp} />
        </div>
    );
};

export default ConsumptionPointInformation;
