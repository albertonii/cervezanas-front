import React, { ComponentProps } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { ICampaign } from '../../../../lib/types';
import { useAuth } from '../../(auth)/Context/useAuth';
import Modal from './Modal';

interface Props {
  campaign: ICampaign;
  showModal: boolean;
  handleDeleteShowModal: ComponentProps<any>;
}

export function DeleteCampaign({
  campaign,
  showModal,
  handleDeleteShowModal,
}: Props) {
  const { supabase } = useAuth();
  const queryClient = useQueryClient();

  const handleDeleteCampaign = async () => {
    if (!campaign) return;

    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', campaign.id);

    if (error) throw error;

    handleDeleteShowModal(false);
  };

  const deleteCampaignMutation = useMutation({
    mutationKey: ['deleteCampaign'],
    mutationFn: handleDeleteCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaignList'] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmitDelete = () => {
    try {
      deleteCampaignMutation.mutate();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal
      showBtn={false}
      showModal={showModal}
      setShowModal={handleDeleteShowModal}
      title={'modal_delete_campaign_title'}
      btnTitle={'delete'}
      description={'modal_delete_campaign_description'}
      handler={() => {
        onSubmitDelete();
      }}
      handlerClose={() => handleDeleteShowModal(false)}
      classIcon={''}
      classContainer={''}
    >
      <></>
    </Modal>
  );
}
