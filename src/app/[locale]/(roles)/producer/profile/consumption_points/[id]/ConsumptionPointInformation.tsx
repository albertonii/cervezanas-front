import CPInformation from './CPInformation';
import React from 'react';
import { OrdersQueue } from './OrdersQueue';
import { ICPMobile } from '@/lib/types/consumptionPoints';

interface Props {
    cpMobile: ICPMobile;
}

const ConsumptionPointInformation = ({ cpMobile }: Props) => {
    return (
        <div className="py-8 m-8">
            <OrdersQueue orders_={[]} />
            <CPInformation cpMobile={cpMobile} />
        </div>
    );
};

export default ConsumptionPointInformation;
