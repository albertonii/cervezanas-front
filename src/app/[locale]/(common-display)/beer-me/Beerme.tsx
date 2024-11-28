import BMGoogleMap from '@/app/[locale]/components/BMGoogleMap';
import React from 'react';
import { IConsumptionPoints } from '@/lib/types/consumptionPoints';

interface Props {
    cps: IConsumptionPoints[];
}

export default function Beerme({ cps }: Props) {
    return (
        <div className="mx-auto sm:py-2 lg:py-3">
            <BMGoogleMap cps={cps} />
        </div>
    );
}
