"use client";

import React from "react";
import CollaborationAgreement from "./CollaborationAgreement";
import CollaborationDetails from "./CollaborationDetails";
import ValidateContract from "./ValidateContract";
import { IDistributorUser_Profile } from "../../../../../../lib/types.d";
import { UseFormReturn } from "react-hook-form";

interface Props {
  distributor: IDistributorUser_Profile;
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
    <div className="space-y-4">
      <CollaborationDetails distributorId={distributor.id} />
      <CollaborationAgreement />
      <ValidateContract form={form} />
    </div>
  );
}
