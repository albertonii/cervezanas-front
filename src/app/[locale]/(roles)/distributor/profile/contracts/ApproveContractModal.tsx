"use client";

import React, { ComponentProps } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "../../../../Auth/useAuth";
import { useMutation, useQueryClient } from "react-query";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import Modal from "../../../../components/modals/Modal";
import { DistributionStatus } from "../../../../../../lib/enums";
import { IDistributionContract } from "../../../../../../lib/types";
import { formatDateString } from "../../../../../../utils/formatDate";
import { useMessage } from "../../../../components/message/useMessage";

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
  const { supabase } = useAuth();
  const { handleMessage } = useMessage();

  const queryClient = useQueryClient();
  const submitSuccessMessage = t("messages.submit_success");
  const submitErrorMessage = t("messages.submit_error");

  const handleUpdate = async () => {
    if (!selectedContract.producer_user) return;

    const { error } = await supabase
      .from("distribution_contracts")
      .update({
        distributor_accepted: true,
        status: DistributionStatus.ACCEPTED,
      })
      .eq("distributor_id", selectedContract.distributor_id)
      .eq("producer_id", selectedContract.producer_id);

    if (error) {
      console.error(error);

      handleMessage({
        type: "error",
        message: submitErrorMessage,
      });
      return;
    }

    handleMessage({
      type: "success",
      message: submitSuccessMessage,
    });
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
      <fieldset className="grid grid-cols-1 space-y-2 rounded-md border-2 border-beer-softBlondeBubble p-4">
        <legend className="m-2 text-2xl">{t("contract_info")}</legend>

        <span className="flex flex-row space-x-2">
          <label htmlFor="created_at">{t("created_at")}</label>

          <p className="font-bold">
            {formatDateString(selectedContract.created_at)}{" "}
          </p>
        </span>

        <span className="flex flex-row space-x-2">
          <label htmlFor="status">{t("status")}</label>
          {selectedContract.status === DistributionStatus.PENDING && (
            <p id="status" className="font-bold text-beer-gold">
              {t(selectedContract.status)}
            </p>
          )}

          {selectedContract.status === DistributionStatus.ACCEPTED && (
            <p id="status" className="font-bold text-green-800">
              {t(selectedContract.status)}
            </p>
          )}

          {selectedContract.status === DistributionStatus.CANCELLED ||
            selectedContract.status === DistributionStatus.REJECTED ||
            (selectedContract.status === DistributionStatus.ERROR && (
              <p id="status" className="font-bold text-red-700">
                {t(selectedContract.status)}
              </p>
            ))}
        </span>

        <span className="flex flex-col space-y-2">
          <label htmlFor="message">{t("description")}</label>

          <p>{selectedContract.message}</p>
        </span>
      </fieldset>
    </Modal>
  );
}
