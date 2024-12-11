'use client';

import React from 'react';
import ValidateContract from './ValidateContract';
import CollaborationDetails from './CollaborationDetails';
import CollaborationAgreement from './CollaborationAgreement';
import { UseFormReturn } from 'react-hook-form';
import { IDistributorUser, IProducerUser } from '@/lib/types/types';

interface Props {
    distributor: IDistributorUser;
    producer: IProducerUser;
    form: UseFormReturn<any>;
}

{
    /**
  status:
    -1: not submitted
    0: pending
    1: accepted
    2: rejected
 */
}
export function SubmitContract({ distributor, producer, form }: Props) {
    return (
        <section className="space-y-4">
            <CollaborationDetails
                distributor={distributor}
                producer={producer}
            />
            <CollaborationAgreement />
            <ValidateContract form={form} />
        </section>
    );
}
