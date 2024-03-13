import React from 'react';
import Button from './common/Button';
import { useTranslations } from 'next-intl';
import { IBillingInfo } from '../../../lib/types/types';

interface Props {
  option: IBillingInfo;
  handleSetBillingOption: any;
}

export default function BillingInformation({
  option,
  handleSetBillingOption,
}: Props) {
  const t = useTranslations();

  return (
    <div
      key={option.id}
      className="flex w-full flex-row items-start justify-start space-x-4"
    >
      <input
        type="radio"
        name="billing"
        value={option.id}
        id={'billing-' + option.id}
        onChange={() => {
          handleSetBillingOption(option.id);
        }}
        className={'mt-2'}
        checked={option.is_default}
      />
      <label
        htmlFor={'billing-' + option.id}
        className="text-gray-600 dark:text-gray-300"
      >
        <span className="text-md text-beer-dark">
          {option.name} {option.lastname}
        </span>

        <p className="text-lg">
          {option.address}, {option.zipcode}, {option.state}, {option.city},{' '}
          {option.country}
        </p>
      </label>

      <div className="flex">
        <Button>{t('delete')}</Button>
        <Button class={'ml-6'}>{t('edit')}</Button>
      </div>
    </div>
  );
}
