"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useSupabase } from "../../../../../../components/Context/SupabaseProvider";
import { useAuth } from "../../../../../../components/Auth";
import { IDistributorUser_Profile } from "../../../../../../lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodType } from "zod";
import { useMutation } from "react-query";
import { useMessage } from "../../../../../../components/message";
import CollaborationAgreement from "./CollaborationAgreement";
import CollaborationDetails from "./CollaborationDetails";

type FormData = {
  message: string;
};

const schema: ZodType<FormData> = z.object({
  message: z.string().max(300, { message: "Must be less than 300 characters" }),
});

type ValidationSchema = z.infer<typeof schema>;

interface Props {
  distributor: IDistributorUser_Profile;
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
export function SubmitContract({ distributor }: Props) {
  const t = useTranslations();
  const { supabase } = useSupabase();

  const { user } = useAuth();

  const [showModal, setShowModal] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { handleMessage } = useMessage();

  const handleAddContract = async (formValues: FormData) => {
    const { message } = formValues;

    /*
    const { error } = await supabase.from("distribution_contracts").insert({
      distributor_id: distributor.id,
      producer_id: user?.id,
      message: message,
      status: 0,
    });

    if (error) {
      console.error(error);
      return;
    }
    */
  };

  const handleAddContractMutation = useMutation({
    mutationKey: "addContract",
    mutationFn: handleAddContract,
    onMutate: () => {},
    onSuccess: () => {
      handleMessage({
        type: "success",
        message: t("sign_in_success"),
      });
      setShowModal(false);
      reset();
    },
    onError: (error: Error) => {
      handleMessage({
        type: "error",
        message: error.message,
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
      <div className="space-y-4">
        <CollaborationDetails distributorId={distributor.id} />
        <CollaborationAgreement />

        <fieldset className="flex flex-col space-y-2">
          {/* Input pdf file with cover letter  */}
          {/* <div className="flex flex-col space-y-2">
            <label className="text-md font-bold tracking-wide text-gray-700">
              {t("form_submit_contract")}
            </label>

            <span className="text-sm text-gray-500">
              {t("form_submit_contract")}
            </span>

            <div className="relative">
              <input
                type="text"
                className="block w-full appearance-none rounded border border-gray-300 bg-white px-4 py-3 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                {...register("message", {
                  required: false,
                })}
              />
            </div>

            {errors.message && (
              <DisplayInputError message={errors.message.message} />
            )}
          </div> */}
        </fieldset>
      </div>
    </form>
  );
}
