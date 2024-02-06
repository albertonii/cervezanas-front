'use client';

import React from 'react';
import CollaborationAgreement from './CollaborationAgreement';
import CollaborationDetails from './CollaborationDetails';
import ValidateContract from './ValidateContract';
import { IDistributorUser } from '../../../../../../lib/types';
import { UseFormReturn } from 'react-hook-form';

interface Props {
  distributor: IDistributorUser;
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
export function SubmitContract({ distributor, form }: Props) {
  return (
    <section className="space-y-4">
      <CollaborationDetails distributorId={distributor.user_id} />
      <CollaborationAgreement />
      <ValidateContract form={form} />
    </section>
  );
}
