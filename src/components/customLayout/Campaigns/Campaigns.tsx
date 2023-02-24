import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Campaign, CampaignFormProps, Product } from "../../../lib/types";
import { supabase } from "../../../utils/supabaseClient";
import { useAuth } from "../../Auth";
import { Button, SearchCheckboxListCampaign } from "../../common";
import { useMessage } from "../../message";
import { DeleteCampaign } from "../../modals/DeleteCampaign";

interface Props {
  campaigns: Campaign[];
  products: Product[];
}

export function Campaigns({ campaigns: c, products }: Props) {
  const { t } = useTranslation();

  const [campaignIndex, setCampaignIndex] = useState<number>(0);
  const [campaigns, setCampaigns] = useState<Campaign[]>(c ?? []);
  const [acceptDeleteCampaign, setAcceptDeleteCampaign] =
    useState<boolean>(false);

  const [isShowDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isShowProductsInCampaignModal, setShowProductsInCampaignModal] =
    useState<boolean>(false);
  const [indexClicked, setIndexClicked] = useState<number>(0);

  const { user } = useAuth();

  const { handleMessage } = useMessage();

  const form = useForm<CampaignFormProps>({
    mode: "onSubmit",
    defaultValues: {
      campaigns: campaigns ?? [],
    },
  });

  const emptyCampaign: Campaign = {
    id: "",
    name: "",
    description: "",
    img_url: "",
    is_public: false,
    created_at: new Date(),
    start_date: new Date(),
    end_date: new Date(),
    owner_id: user?.id ?? "",
    slogan: "",
    goal: "",
    status: "",
    products: [],
  };

  const { register, control, getValues } = form;

  const { fields, append, remove } = useFieldArray({
    name: "campaigns",
    control,
  });

  const handleSaveCampaign = async (index: number) => {
    const campaign = getValues("campaigns")[index];

    const { data: campaign_, error: campaignError } = await supabase
      .from("campaigns")
      .upsert({
        name: campaign.name,
        description: campaign.description,
        img_url: campaign.img_url,
        is_public: campaign.is_public,
        start_date: campaign.start_date,
        end_date: campaign.end_date,
        owner_id: user?.id ?? "",
        slogan: campaign.slogan,
        goal: campaign.goal,
        status: campaign.status,
      })
      .eq("id", campaign.id);

    if (campaignError) throw campaignError;

    if (campaign_[0]?.id !== campaign.id) {
      campaign.id = campaign_[0].id;
      setCampaigns([...campaigns, campaign]);
    }

    campaign.products?.map(async (item) => {
      const { error: orderItemError } = await supabase
        .from("campaign_item")
        .insert({
          campaign_id: campaign.id,
          product_id: item.product_id,
          discount: item.discount,
        });

      if (orderItemError) throw orderItemError;
    });

    handleMessage!({
      type: "success",
      message: `${t("campaign_added_successfully")} , ${campaign.name}`,
    });
  };

  const handleSetCampaigns = (value: Campaign[]) => {
    setCampaigns(value);
  };

  const handleDeleteShowModal = (value: boolean, index: number) => {
    setShowDeleteModal(value);
    setCampaignIndex(index);
  };

  const handleResponseDeleteModal = (value: boolean) => {
    setAcceptDeleteCampaign(value);
  };

  const handleProductsInCampaign = async (index: number) => {
    // const campaign = getValues("campaigns")[index];
  };

  useEffect(() => {
    if (acceptDeleteCampaign) {
      const handleRemoveCampaign = async (index: number) => {
        const campaignId = campaigns[index].id;

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

        remove(index);

        handleMessage!({
          type: "success",
          message: `${t("campaign_removed_successfully")}`,
        });
      };

      handleRemoveCampaign(campaignIndex);

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

  const handleProductsInCampaignShowModal = (value: boolean, index: number) => {
    setShowProductsInCampaignModal(value);
    setIndexClicked(index);
  };

  return (
    <>
      <div className="py-6 px-4 " aria-label="Campaigns">
        <div className="flex flex-col">
          <div className="text-4xl pr-12">Campaigns</div>

          {/* Show/Hide Modal*/}
          {isShowDeleteModal && (
            <DeleteCampaign handleResponseModal={handleResponseDeleteModal} />
          )}

          {/* Add another campaign  */}
          <div className="pr-12 pt-6">
            <Button
              class="text-md"
              large
              primary
              onClick={() => append(emptyCampaign)}
            >
              {t("add_form_campaign")}
            </Button>
          </div>

          {/* Map campaigns and make a editable form for each one */}
          <div className="mt-6">
            {fields.map((field, index) => (
              <div key={field.id} className="mt-6">
                <form
                // onSubmit={handleSubmit(onSubmit, onError)}
                >
                  <fieldset className="p-4 bg-beer-softBlonde rounded space-y-2">
                    {/* Campaign Name  */}
                    <div className="flex flex-col w-full space-y">
                      <label
                        htmlFor={`${index}-campaign_name`}
                        className="text-sm text-gray-600 mr-2"
                      >
                        {t("name")}
                      </label>

                      <input
                        id={`${index}-campaign_name`}
                        className="border border-gray-300 rounded-md"
                        defaultValue={field.name}
                        {...register(`campaigns.${index}.name` as const, {
                          required: true,
                          maxLength: 30,
                        })}
                      />
                      {`errors.campaigns.${index}.name.type` === "required" && (
                        <p>{t("input_required")}</p>
                      )}
                      {`errors.campaigns.${index}.name.type` ===
                        "maxLength" && <p>{t("error_30_max_length")}</p>}
                    </div>

                    {/* Description  */}
                    <div className="flex flex-col w-full space-y">
                      <label
                        htmlFor={`${index}-campaign_description`}
                        className="text-sm text-gray-600 mr-2"
                      >
                        {t("description")}
                      </label>

                      <textarea
                        id={`${index}-campaign_description`}
                        className="border border-gray-300 rounded-md"
                        defaultValue={field.description}
                        {...register(
                          `campaigns.${index}.description` as const,
                          {
                            required: true,
                            maxLength: 200,
                          }
                        )}
                      />
                      {`errors.campaigns.${index}.description.type` ===
                        "required" && <p>{t("input_required")}</p>}
                      {`errors.campaigns.${index}.description.type` ===
                        "maxLength" && <p>{t("error_200_max_length")}</p>}
                    </div>

                    {/* Is Public  */}
                    <div className="flex flex-col w-full space-y">
                      <label
                        htmlFor={`${index}-campaign_is_public`}
                        className="text-sm text-gray-600 mr-2"
                      >
                        {t("is_public")}
                      </label>

                      <select
                        id={`${index}-campaign_is_public`}
                        defaultValue="false"
                        className="text-sm relative block w-20 appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                        {...register(`campaigns.${index}.is_public` as const)}
                      >
                        <option key={0} value={"false"}>
                          {t("no")}
                        </option>
                        <option key={1} value={"true"}>
                          {t("yes")}
                        </option>
                      </select>

                      {`errors.campaigns.${index}.is_public?.type` ===
                        "required" && <p>{t("input_required")}</p>}
                    </div>

                    {/* Slogan  */}
                    <div className="flex flex-col w-full space-y">
                      <label
                        htmlFor={`${index}-campaign_slogan`}
                        className="text-sm text-gray-600 mr-2"
                      >
                        {t("slogan")}
                      </label>

                      <textarea
                        className="border border-gray-300 rounded-md"
                        defaultValue={field.slogan}
                        {...register(`campaigns.${index}.slogan` as const, {
                          required: true,
                          maxLength: 200,
                        })}
                      />
                      {`errors.campaigns.${index}.slogan.type` ===
                        "required" && <p>{t("input_required")}</p>}
                      {`errors.campaigns.${index}.slogan.type` ===
                        "maxLength" && <p>{t("error_200_max_length")}</p>}
                    </div>

                    {/* Goal  */}
                    <div className="flex flex-col w-full space-y">
                      <label
                        htmlFor={`${index}-campaign_goal`}
                        className="text-sm text-gray-600 mr-2"
                      >
                        {t("goal")}
                      </label>

                      <textarea
                        className="border border-gray-300 rounded-md"
                        defaultValue={field.goal}
                        {...register(`campaigns.${index}.goal` as const, {
                          required: true,
                          maxLength: 200,
                        })}
                      />
                      {`errors.campaigns.${index}.goal.type` === "required" && (
                        <p>{t("input_required")}</p>
                      )}
                      {`errors.campaigns.${index}.goal.type` ===
                        "maxLength" && <p>{t("error_200_max_length")}</p>}
                    </div>

                    {/* Status  */}
                    <div className="flex flex-col w-full space-y">
                      <label
                        htmlFor={`${index}-campaign_status`}
                        className="text-sm text-gray-600 mr-2"
                      >
                        {t("status")}
                      </label>

                      <input
                        className="border border-gray-300 rounded-md"
                        defaultValue={field.status}
                        {...register(`campaigns.${index}.status` as const, {
                          required: true,
                        })}
                      />
                      {`errors.campaigns.${index}.status.type` ===
                        "required" && <p>{t("input_required")}</p>}
                    </div>

                    {/* Start Date  */}
                    <div className="flex flex-col w-full space-y">
                      <label
                        htmlFor={`${index}-campaign_start_date`}
                        className="text-sm text-gray-600 mr-2"
                      >
                        {t("start_date")}
                      </label>

                      <input
                        type={"date"}
                        className="border border-gray-300 rounded-md"
                        defaultValue={field.start_date.toString()}
                        {...register(`campaigns.${index}.start_date` as const)}
                      />
                      {`errors.campaigns.${index}.start_date.type` ===
                        "required" && <p>{t("input_required")}</p>}
                    </div>

                    {/* End Date  */}
                    <div className="flex flex-col w-full space-y">
                      <label
                        htmlFor={`${index}-campaign_end_date`}
                        className="text-sm text-gray-600 mr-2"
                      >
                        {t("end_date")}
                      </label>

                      <input
                        type={"date"}
                        className="border border-gray-300 rounded-md"
                        defaultValue={field.end_date.toString()}
                        {...register(`campaigns.${index}.end_date` as const)}
                      />
                      {`errors.awards.${index}.end_date.type` ===
                        "required" && <p>{t("input_required")}</p>}
                    </div>

                    {/* Campaign Image */}
                    <div className="flex flex-col w-full space-y">
                      <label
                        htmlFor={`${index}-campaign_img_url`}
                        className="text-sm text-gray-600 mr-2"
                      >
                        {t("img_url")}
                      </label>

                      <input
                        type="file"
                        className="border border-gray-300 rounded-md p-2"
                        defaultValue=""
                        {...register(`campaigns.${index}.img_url` as const, {
                          required: true,
                        })}
                      />
                      {`errors.campaigns.${index}.img_url.type` ===
                        "required" && <p>{t("input_required")}</p>}
                    </div>

                    <div className="flex flex-col w-full space-y">
                      <Button
                        class="w-[44vw] px-4 py-2 text-xl"
                        primary
                        onClick={() =>
                          handleProductsInCampaignShowModal(true, index)
                        }
                      >
                        {t("configure_products_in_campaign")}
                      </Button>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        class=""
                        large
                        primary
                        onClick={() => handleSaveCampaign(index)}
                      >
                        {t("save_form_campaign")}
                      </Button>

                      <Button
                        danger
                        medium
                        class=""
                        onClick={() => {
                          handleDeleteShowModal(true, index);
                        }}
                      >
                        {t("delete")}
                      </Button>
                    </div>
                  </fieldset>
                </form>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Products in Campaign Modal  */}
      {isShowProductsInCampaignModal && (
        <SearchCheckboxListCampaign
          products={products}
          form={form}
          handleProductsInCampaign={handleProductsInCampaign}
          campaign={campaigns[indexClicked]}
        />
      )}
    </>
  );
}
