'use client';

import HorizontalSections from '../../../../components/common/HorizontalSections';
import React, { useState } from 'react';
import { CPFixed } from './CPFixed';
import { CPMobile } from './CPMobile';
import { IConsumptionPoints } from '../../../../../../lib/types';

interface Props {
  cps: IConsumptionPoints;
}

// Consumption Point status is in pending for validation by the admin of the platform
export function CPAccepted({ cps }: Props) {
  const [menuOption, setMenuOption] = useState<string>('cp_fixed');

  console.log(cps);

  const renderSwitch = () => {
    switch (menuOption) {
      case 'cp_fixed':
        return <CPFixed cpsId={cps.id} />;
      case 'cp_mobile':
        return <CPMobile cpsId={cps.id} />;
    }
  };

  const handleMenuClick = (opt: string): void => {
    setMenuOption(opt);
  };

  return (
    <>
      <h2 className="text-3xl">¡Petición aceptada!</h2>

      <p>
        <h3 className="max-w-3xl text-lg">
          El equipo de cervezanas ha recibido tu solicitud para participar como
          punto de consumo certificado y has sido admitido. Ahora podrás usar
          los paneles de control para gestionar tu punto de consumo.
        </h3>
      </p>

      <HorizontalSections
        handleMenuClick={handleMenuClick}
        tabs={['cp_fixed', 'cp_mobile']}
      />

      {renderSwitch()}
    </>
  );
}
