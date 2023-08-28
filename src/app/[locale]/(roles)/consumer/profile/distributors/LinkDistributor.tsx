import React, { useEffect, useState } from "react";
import { Modal } from "../../../../../../components/modals";
import useFetchDistributors from "../../../../../../hooks/useFetchDistributors";
import { IDistributorUser_Profile } from "../../../../../../lib/types";
import ListAvailableDistributors from "./ListAvailableDistributors";
import { SubmitContract } from "./SubmitContract";

export default function LinkDistributor() {
  const [showModal, setShowModal] = useState<boolean>(false);

  const [showFooter, setShowFooter] = useState<boolean>(false);

  /* Fetch the distributors that the user can be associated  */
  const {
    data: distributors,
    isError,
    isLoading,
    refetch,
  } = useFetchDistributors();

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

  const signContract = () => {};

  const handleCustomClose = () => {
    setSelectedDistributor(null);
    setShowFooter(false);
  };

  return (
    <Modal
      showBtn={true}
      showModal={showModal}
      setShowModal={setShowModal}
      title={"form_submit_contract_title"}
      btnTitle={"apply_contract"}
      description={""}
      handler={signContract}
      classIcon={""}
      classContainer={""}
      showFooter={showFooter}
      btnCancelTitle={"come_back"}
      handleCustomClose={() => handleCustomClose()}
    >
      {selectedDistributor ? (
        <SubmitContract distributor={selectedDistributor} />
      ) : (
        <ListAvailableDistributors handleDistributor={handleDistributor} />
      )}
    </Modal>
  );
}
