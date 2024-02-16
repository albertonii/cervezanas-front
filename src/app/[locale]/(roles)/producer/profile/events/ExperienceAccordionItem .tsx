import Image from 'next/image';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ICPFixed, ICPMobile, IExperience } from '../../../../../../lib/types';
import { faChevronCircleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UseFormReturn } from 'react-hook-form';
import { SearchCheckboxExperiencesCPMobiles } from './SearchCheckboxExperienceCPMobiles';
import { SearchCheckboxExperiencesCPFixeds } from './SearchCheckboxExperienceCPFixed';

interface Props {
  experience: IExperience;
  form: UseFormReturn<any, any>;
  experienceItems?: string[];
  cpsMobile: ICPMobile[];
  cpsFixed: ICPFixed[];
}

const ExperienceAccordionItem: React.FC<Props> = ({
  experience,
  form,
  experienceItems,
  cpsMobile,
  cpsFixed,
}) => {
  const t = useTranslations();
  const { register } = form;

  const [selectedPacks, setSelectedPacks] = useState(experienceItems);

  const [showAccordion, setShowAccordion] = useState(false);

  if (!experience) return <></>;

  const handleCheckboxChange = (packId: string, isChecked: boolean) => {
    setSelectedPacks((prevSelectedPacks) => {
      if (isChecked) {
        return [...(prevSelectedPacks || []), packId];
      } else {
        return (prevSelectedPacks || []).filter((id) => id !== packId);
      }
    });

    // setValue(`experience_items.${experience.id}.id`, selectedPacks);
  };

  return (
    <section className="mx-4 my-2 rounded-lg border border-gray-200">
      <div
        className={`grid grid-cols-12 cursor-pointer items-center px-6 py-4 text-lg `}
      >
        <input
          id={`checkbox-item-${experience.id}`}
          type="checkbox"
          {...register(`experience.${experience.id}.cp_id`)}
          onChange={(e) =>
            handleCheckboxChange(experience.id, e.target.checked)
          }
          value={experience.id}
          className="col-span-1 h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
        />

        <div
          className={`${
            showAccordion ? 'bg-gray-100 text-beer-draft' : 'text-beer-gold'
          } flex items-center justify-start space-x-2 col-span-10`}
          onClick={() => setShowAccordion(!showAccordion)}
        >
          <FontAwesomeIcon
            icon={faChevronCircleDown}
            style={{ color: showAccordion ? '#90470b' : '#EE9900' }}
            title={'chevron_circle_down'}
            width={20}
            height={20}
            className={`${showAccordion && 'rotate-180'}`}
          />
          <span className="mr-2 font-semibold">{experience.name}</span>
        </div>

        <div className="flex space-x-2 col-span-1">
          <Image
            src={'/icons/beer-experience.svg'}
            alt="format"
            width={32}
            height={32}
          />
        </div>
      </div>

      <div
        className={`px-6 pt-4 ${
          showAccordion ? 'max-h-[1000px]' : 'max-h-0'
        } duration-800 overflow-hidden transition-all ease-in-out`}
      >
        <p className={`flex justify-between`}>
          <span className="mb-2 text-gray-500 dark:text-gray-400">
            {t('name_header')}: {experience.name}
          </span>
          <span className="mb-2 text-gray-500 dark:text-gray-400">
            {t('type_header')}: {experience.type}
          </span>
          <span className="mb-4 text-gray-500 dark:text-gray-400">
            {t('price_header')}: {experience.price} €
          </span>
        </p>

        <div className={`h-max-[300px] space-y-4 mb-4`}>
          <span className="mb-4 text-lg font-semibold">
            {t('assign_experience_to_cp')}:
          </span>

          <SearchCheckboxExperiencesCPMobiles
            cpsMobile={cpsMobile}
            form={form}
          />

          <SearchCheckboxExperiencesCPFixeds cpsFixed={cpsFixed} form={form} />
        </div>
      </div>
    </section>
  );
};

export default ExperienceAccordionItem;
