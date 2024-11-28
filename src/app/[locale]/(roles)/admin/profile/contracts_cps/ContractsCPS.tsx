import ListPendingCP from './PendingList';
import React from 'react';
import { IConsumptionPoints } from '@/lib/types/consumptionPoints';

interface Props {
    cpsContracts: IConsumptionPoints[];
}

// Here the admin is going to approve or decline if the submitted client has the right needs to be an organizer of Consumption Points or not.
export default function ContractsCPS({ cpsContracts }: Props) {
    const pendingCP = cpsContracts.filter(
        (contract) => contract.cp_organizer_status === 0,
    );

    return (
        <>
            <ListPendingCP submittedCPs={pendingCP} />
        </>
    );
}
