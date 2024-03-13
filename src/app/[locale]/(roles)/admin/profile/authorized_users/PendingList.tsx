'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import {
  faCancel,
  faCheck,
  faFileArrowDown,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { useLocale, useTranslations } from 'next-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatDateString } from '../../../../../../utils/formatDate';
import { IconButton } from '../../../../components/common/IconButton';
import { generateDownloadableLink } from '../../../../../../utils/utils';
import {
  IConsumptionPoints,
  IDistributorUser,
  IProducerUser,
} from '../../../../../../lib/types/types';
import InputSearch from '../../../../components/common/InputSearch';
import dynamic from 'next/dynamic';
import DistributorList from './DistributorList';
import ProducerList from './ProducerList';
import HorizontalSections from '../../../../components/common/HorizontalSections';

enum SortBy {
  NONE = 'none',
  USERNAME = 'username',
  CREATED_DATE = 'created_date',
}

const DynamicModal = dynamic(
  () => import('../../../../components/modals/Modal'),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  },
);

interface Props {
  producers: IProducerUser[];
  distributors: IDistributorUser[];
}

export default function ListPendingUsers({ producers, distributors }: Props) {
  const [menuOption, setMenuOption] = useState<string>('producers');

  const renderSwitch = () => {
    switch (menuOption) {
      case 'producers':
        return <ProducerList producers={producers} />;
      case 'distributors':
        return <DistributorList distributors={distributors} />;
    }
  };

  const handleMenuClick = (opt: string): void => {
    setMenuOption(opt);
  };

  return (
    <>
      <HorizontalSections
        handleMenuClick={handleMenuClick}
        tabs={['producers', 'distributors']}
      />
      {renderSwitch()}
    </>
  );
}
