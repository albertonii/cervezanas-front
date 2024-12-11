import CPEventInformation from './CPEventInformation';
import React from 'react';
import { OrdersQueue } from './OrdersQueue';
import { IConsumptionPointEvent } from '@/lib/types/consumptionPoints';

interface Props {
    cp: IConsumptionPointEvent;
}

const ConsumptionPointInformation = ({ cp }: Props) => {
    return (
        <div className="m-4 space-y-4">
            <OrdersQueue cp={cp} />
            <CPEventInformation cp={cp} />
        </div>
    );
};

export default ConsumptionPointInformation;
