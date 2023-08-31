import ListAvailableDistributors from "./ListAvailableDistributors";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "../../../../../../components/modals";
import { IDistributorUser_Profile } from "../../../../../../lib/types";
import { SubmitContract } from "./SubmitContract";
import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMessage } from "../../../../../../components/message";
import { useMutation } from "react-query";
import { useTranslations } from "next-intl";
import { useSupabase } from "../../../../../../components/Context/SupabaseProvider";
import { useUser } from "@supabase/ui/dist/cjs/components/Auth/UserContext";
import { useAuth } from "../../../../../../components/Auth";

type FormData = {
  message: string;
  is_signed: boolean;
};

const schema: ZodType<FormData> = z
  .object({
    message: z
      .string()
      .max(300, { message: "Must be less than 300 characters" }),
    is_signed: z.boolean(),
  })
  .refine((data) => data.is_signed, {
    message: "You must agree to the terms and conditions",
    path: ["is_signed"],
  });

export default function LinkDistributor() {
  const t = useTranslations();

  const { supabase } = useSupabase();
  const { user } = useAuth();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [showFooter, setShowFooter] = useState<boolean>(false);

  const [selectedDistributor, setSelectedDistributor] =
    useState<IDistributorUser_Profile | null>(null);

  const handleDistributor = (distributor: IDistributorUser_Profile) => {
    setSelectedDistributor(distributor);
  };

  useEffect(() => {
    if (selectedDistributor) {
      setShowFooter(true);
    }
  }, [selectedDistributor]);

  const handleCustomClose = () => {
    setSelectedDistributor(null);
    setShowFooter(false);
  };

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { handleSubmit, reset } = form;

  const { handleMessage } = useMessage();

  const handleAddContract = async (formValues: FormData) => {
    if (!selectedDistributor || !user) return null;
    console.log(formValues);

    const { message, is_signed } = formValues;

    const { error } = await supabase.from("distribution_contracts").insert({
      distributor_id: selectedDistributor.id,
      producer_id: user?.id,
      message: message,
      producer_accepted: is_signed,
      status: "pending",
    });

    if (error) {
      console.error(error);
      return;
    }
  };

  const handleAddContractMutation = useMutation({
    mutationKey: ["addContract"],
    mutationFn: handleAddContract,
    onSuccess: () => {
      handleMessage({
        type: "success",
        message: t("contract_sent_to_distributor_success"),
      });
      reset();
    },
    onError: (error: Error) => {
      handleMessage({
        type: "error",
        message: t("contract_sent_to_distributor_error"),
      });
    },
  });

  const onSubmit = (formValues: FormData) => {
    try {
      handleAddContractMutation.mutate(formValues);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form className="w-full">
      <Modal
        showBtn={true}
        showModal={showModal}
        setShowModal={setShowModal}
        title={"form_submit_contract_title"}
        btnTitle={"apply_contract"}
        description={""}
        classIcon={""}
        classContainer={""}
        showFooter={showFooter}
        btnCancelTitle={"come_back"}
        handleCustomClose={() => handleCustomClose()}
        handler={handleSubmit(onSubmit)}
      >
        {selectedDistributor ? (
          <SubmitContract distributor={selectedDistributor} form={form} />
        ) : (
          <ListAvailableDistributors handleDistributor={handleDistributor} />
        )}
      </Modal>
    </form>
  );
}
