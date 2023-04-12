import React from "react";
import ListPendingCP from "./PendingList";
import { IConsumptionPoints } from "../../lib/types";

interface Props {
  submittedCPs: IConsumptionPoints[];
}

// Here the admin is going to approve or decline if the submitted client has the right needs to be an organizer of Consumption Points or not.
export default function SubmittedCPs({ submittedCPs }: Props) {
  return (
    <>
      <ListPendingCP submittedCPs={submittedCPs} />
    </>
  );
}
