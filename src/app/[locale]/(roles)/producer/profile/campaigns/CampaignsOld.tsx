"use client";

import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import {
  ICampaignFormProps,
  ICampaign,
  ICampaignItem,
  IProduct,
} from "../../../../../../lib/types";
import { CampaignForm } from "./CampaignForm";
import { SearchCheckboxListCampaign } from "./SearchCheckboxListCampaign";
import { useAuth } from "../../../../Auth/useAuth";
import { useMessage } from "../../../../components/message/useMessage";
import { Button } from "../../../../components/common/Button";
import { DeleteCampaign } from "../../../../components/modals/DeleteCampaign";

interface Props {
  campaigns: ICampaign[];
  products: IProduct[];
}

export function Campaigns({ campaigns: c, products }: Props) {
  /*
  const t = useTranslations();

  const { user, supabase } = useAuth();

  const emptyCampaign: ICampaign = {
    id: "",
    name: "",
    description: "",
    img_url: "",
    is_public: false,
    created_at: "",
    start_date: "",
    end_date: "",
    owner_id: user?.id ?? "",
    slogan: "",
    goal: "",
    status: "",
    products: [],
    campaign_discount: 0,
    social_cause: "",
  };

  const [campaigns, setCampaigns] = useState<ICampaign[]>(c ?? emptyCampaign);
  const [campaignIndex, setCampaignIndex] = useState<number>(0);

  const [acceptDeleteCampaign, setAcceptDeleteCampaign] =
    useState<boolean>(false);
  const [acceptLinkProductsCampaign, setAcceptLinkProductsCampaign] =
    useState<boolean>(false);

  const [isShowDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isShowProductsInCampaignModal, setShowProductsInCampaignModal] =
    useState<boolean>(false);

  const [isDeleteModal, setIsDeleteModal] = useState(false);

  const { handleMessage } = useMessage();

  const form = useForm<ICampaignFormProps>({
    mode: "onSubmit",
    defaultValues: {
      campaigns: campaigns ?? emptyCampaign,
    },
  });

  const { control, getValues } = form;

  const { fields, append, remove } = useFieldArray({
    name: "campaigns",
    control,
  });

  useEffect(() => {
    if (acceptDeleteCampaign) {
      const campaignId = campaigns[campaignIndex].id;

      // Before removing campaign we need to delete all the products associated with it
      // Remove Campaign Items
      const handleRemoveCampaignItems = async (campaignId: string) => {
        const { error: campaignItemsError } = await supabase
          .from("campaign_item")
          .delete()
          .eq("campaign_id", campaignId);

        if (campaignItemsError) throw campaignItemsError;
      };

      // Remove Campaign
      const handleRemoveCampaign = async (campaignId: string) => {
        await handleRemoveCampaignItems(campaignId);

        const { error: campaignError } = await supabase
          .from("campaigns")
          .delete()
          .eq("id", campaignId);

        if (campaignError) throw campaignError;

        handleSetCampaigns(
          campaigns.filter((c) => {
            return c.id !== campaignId;
          })
        );

        remove(campaignIndex);

        handleMessage({
          type: "success",
          message: "campaign_removed_successfully",
        });
      };

      handleRemoveCampaign(campaignId);

      handleDeleteShowModal(false, campaignIndex);
      setAcceptDeleteCampaign(false);
    }
  }, [
    acceptDeleteCampaign,
    campaigns,
    handleMessage,
    remove,
    t,
    campaignIndex,
  ]);

  useEffect(() => {
    if (acceptLinkProductsCampaign) {
      setAcceptLinkProductsCampaign(false);
    }
  }, [acceptLinkProductsCampaign]);

  const handleSetCampaigns = (value: ICampaign[]) => {
    setCampaigns(value);
  };

  // Triggers when the user clicks on the button "Delete" in the modal for Campaign deletion
  const handleResponseDeleteModal = (value: boolean) => {
    setAcceptDeleteCampaign(value);
  };

  // Triggers when the user clicks on the button "Link Products" in the modal for Campaign deletion
  const handleResponseLinkProductsModal = (value: boolean) => {
    setAcceptLinkProductsCampaign(value);
  };

  const handleDeleteShowModal = (value: boolean, index: number) => {
    setShowDeleteModal(value);
    setCampaignIndex(index);
  };

  const handleShowProductsInCampaignModal = (value: boolean, index: number) => {
    setShowProductsInCampaignModal(value);
    setCampaignIndex(index);
  };

  const handleSaveCampaign = (campaign: ICampaign) => {
    setCampaigns([...campaigns, campaign]);
  };

  const handleProductsInCampaign = (items: ICampaignItem[]) => {
    if (campaigns.length === 0) {
      const newCampaign: ICampaign = getValues("campaigns")[campaignIndex];
      newCampaign.products = items;
      setCampaigns([newCampaign]);
    } else {
      setCampaigns((cs) => {
        const newCampaigns = [...cs];
        newCampaigns[campaignIndex].products = items;
        return newCampaigns;
      });
    }
  };
  */

  return (
    <section className="px-4 py-6 " aria-label="Campaigns">
      {/* 
      <header className="flex flex-col space-y-4">
        <h2 className="text-4xl">{t("campaigns")}</h2>

        <div className="w-40">
          <Button
            class="px-2 py-1"
            primary
            onClick={() => append(emptyCampaign)}
          >
            {t("add_form_campaign")}
          </Button>
        </div>
      </header>

      <section className="flex flex-col space-y-4">
        {isShowDeleteModal && (
          <DeleteCampaign
            campaign={campaigns[campaignIndex]}
            showModal={isDeleteModal}
            handleDeleteShowModal={handleDeleteShowModal}
          />
        )}

        {fields.map((field, index) => (
          <div key={field.id} className="mt-6">
            <CampaignForm
              index={index}
              campaigns={campaigns}
              field={field}
              form={form}
              handleDeleteShowModal={handleDeleteShowModal}
              handleShowProductsInCampaignModal={
                handleShowProductsInCampaignModal
              }
              handleSaveCampaign={handleSaveCampaign}
            />

            {isShowProductsInCampaignModal && (
              <SearchCheckboxListCampaign
                index={index}
                products={products}
                form={form}
                handleResponseLinkProductsModal={
                  handleResponseLinkProductsModal
                }
                handleShowProductsInCampaignModal={
                  handleShowProductsInCampaignModal
                }
                handleProductsInCampaign={handleProductsInCampaign}
                campaign={campaigns[campaignIndex]}
              />
            )}
          </div>
        ))}
      </section>
 */}
    </section>
  );
}
