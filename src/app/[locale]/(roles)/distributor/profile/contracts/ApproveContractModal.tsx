"use client";

import React, { ComponentProps, useEffect, useState } from "react";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { useTranslations } from "next-intl";
import { IDistributionContract } from "../../../../../../lib/types";
import { Modal } from "../../../../../../components/modals";
import { useMutation, useQueryClient } from "react-query";
import { formatDate } from "../../../../../../utils";
import { useSupabase } from "../../../../../../components/Context/SupabaseProvider";
import { DistributionStatus } from "../../../../../../lib/enums";

interface Props {
  selectedContract: IDistributionContract;
  isApproveModal: boolean;
  handleApproveModal: ComponentProps<any>;
}

export default function ApproveContractModal({
  selectedContract,
  isApproveModal,
  handleApproveModal,
}: Props) {
  const t = useTranslations();
  const { supabase } = useSupabase();

  const queryClient = useQueryClient();

  const handleUpdate = async () => {
    const { error } = await supabase
      .from("distribution_contracts")
      .update({
        distributor_accepted: true,
        status: DistributionStatus.ACCEPTED,
      })
      .eq("distributor_id", selectedContract.distributor_id)
      .eq("producer_id", selectedContract.producer_id.user);

    if (error) {
      console.error(error);
      return;
    }
  };

  const updateContractMutation = useMutation({
    mutationKey: ["updateContractDistributor"],
    mutationFn: handleUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["distributionContract"] });
      handleApproveModal(false);
    },
    onError: (e: any) => {
      console.error(e);
    },
  });

  const onSubmit = async () => {
    try {
      updateContractMutation.mutate();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal
      showBtn={false}
      showModal={isApproveModal}
      setShowModal={handleApproveModal}
      title={t("approve_contract")}
      btnTitle={t("approve_contract")}
      description={""}
      icon={faAdd}
      handler={() => onSubmit()}
      handlerClose={() => handleApproveModal(false)}
      btnSize={"large"}
      classIcon={"w-6 h-6"}
      classContainer={""}
    >
      <fieldset className="grid grid-cols-1 space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
        <legend className="m-2 text-2xl">{t("contract_info")}</legend>

        <div className="flex flex-col space-y-2">
          <label htmlFor="status">{t("status")}</label>
          <p id="status">{t(selectedContract.status)}</p>
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="message">{t("description")}</label>

          <p>{selectedContract.message}</p>
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="created_at">{t("created_at")}</label>

          <p>{formatDate(selectedContract.created_at)} </p>
        </div>
      </fieldset>
    </Modal>
  );
}