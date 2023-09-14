"use client";

import React, { ComponentProps } from "react";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { useTranslations } from "next-intl";
import { IDistributionContract } from "../../../../../../lib/types.d";
import { Modal } from "../../../../components/modals/Modal";
import { useMutation, useQueryClient } from "react-query";
import { useSupabase } from "../../../../../../context/SupabaseProvider";
import { DistributionStatus } from "../../../../../../lib/enums";
import { formatDateString } from "../../../../../../utils/formatDate";

interface Props {
  selectedContract: IDistributionContract;
  isRejectModal: boolean;
  handleRejectModal: ComponentProps<any>;
}

export default function RejectContractModal({
  selectedContract,
  isRejectModal,
  handleRejectModal,
}: Props) {
  const t = useTranslations();
  const { supabase } = useSupabase();

  const queryClient = useQueryClient();

  const handleUpdate = async () => {
    const { error } = await supabase
      .from("distribution_contracts")
      .update({
        distributor_accepted: false,
        status: DistributionStatus.REJECTED,
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
      handleRejectModal(false);
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
      showModal={isRejectModal}
      setShowModal={handleRejectModal}
      title={t("reject_contract")}
      btnTitle={t("reject_contract")}
      description={""}
      icon={faAdd}
      handler={() => onSubmit()}
      handlerClose={() => handleRejectModal(false)}
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

          <p>{formatDateString(selectedContract.created_at)} </p>
        </div>
      </fieldset>
    </Modal>
  );
}
