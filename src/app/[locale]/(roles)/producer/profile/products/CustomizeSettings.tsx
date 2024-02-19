'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChipCard } from '../../../../components/common/ChipCard';
import { toLowerCase } from '../../../../../../utils/formatWords';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { useAppContext } from '../../../../../context/AppContext';

export function CustomizeSettings() {
  const t = useTranslations();
  const { supabase } = useAuth();

  const { customizeSettings, setCustomizeSettings } = useAppContext();

  const colorInputRef = useRef<HTMLInputElement>(null);
  const familyStylesInputRef = useRef<HTMLInputElement>(null);
  const [colors, setColors] = useState<string[]>(customizeSettings.colors);
  const [familyStyles, setFamilyStyles] = useState<string[]>(
    customizeSettings.family_styles,
  );

  useEffect(() => {
    const addColor = async () => {
      if (colorInputRef.current) {
        const color = toLowerCase(colorInputRef.current.value).trim();

        if (
          color &&
          color.length > 0 &&
          !colors.includes(color) &&
          color.length < 40
        ) {
          setColors((prevColors) => [...prevColors, color]);
          colorInputRef.current.value = '';

          // Add new color to DDBB
          await supabase
            .from('customize_settings')
            .update({
              colors: [...colors, color],
            })
            .eq('id', customizeSettings.id);

          setCustomizeSettings({
            ...customizeSettings,
            colors: [...colors, color],
          });
        }
      }
    };

    const addFamilyStyle = async () => {
      if (familyStylesInputRef.current) {
        const famStyle = familyStylesInputRef.current.value
          .toLowerCase()
          .trim();
        if (
          famStyle &&
          famStyle.length > 0 &&
          !familyStyles.includes(famStyle) &&
          famStyle.length < 40
        ) {
          setFamilyStyles((prevFamStyle) => [...prevFamStyle, famStyle]);
          familyStylesInputRef.current.value = '';

          // Add new family style to DDBB
          await supabase
            .from('customize_settings')
            .update({
              family_styles: [...familyStyles, famStyle],
            })
            .eq('id', customizeSettings.id);

          setCustomizeSettings({
            ...customizeSettings,
            family_styles: [...familyStyles, famStyle],
          });
        }
      }
    };

    const listenerColor = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === 'NumpadEnter') {
        addColor();
        event.preventDefault();
      }
    };

    const listenerFamilyStyle = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === 'NumpadEnter') {
        addFamilyStyle();
        event.preventDefault();
      }
    };

    document.addEventListener('keydown', listenerColor);
    document.addEventListener('keydown', listenerFamilyStyle);

    return () => {
      document.removeEventListener('keydown', listenerColor);
      document.removeEventListener('keydown', listenerFamilyStyle);
    };
  }, [colors, customizeSettings.id, familyStyles, setCustomizeSettings]);

  const handleRemoveColor = async (color: string) => {
    const filteredColors = colors.filter((c) => {
      return c !== color;
    });

    setColors(filteredColors);

    // Remove color from DDBB
    await supabase
      .from('customize_settings')
      .update({
        colors: filteredColors,
      })
      .eq('id', customizeSettings.id);

    setCustomizeSettings({
      ...customizeSettings,
      colors: [...filteredColors, color],
    });
  };

  const handleRemoveFamStyle = async (famStyle: string) => {
    const filteredFamStyles = familyStyles.filter((fStyle) => {
      return fStyle !== famStyle;
    });

    setFamilyStyles(filteredFamStyles);

    // Remove family style from DDBB
    await supabase
      .from('customize_settings')
      .update({
        family_styles: familyStyles.filter((p) => {
          return p !== famStyle;
        }),
      })
      .eq('id', customizeSettings.id);

    setCustomizeSettings({
      ...customizeSettings,
      family_styles: [...filteredFamStyles, famStyle],
    });
  };

  return (
    <section className="px-4 py-6 " aria-label="CustomizeSettings">
      <p className="flex justify-between py-4" id="header">
        <span
          id="title"
          className="text-5xl uppercase font-semibold text-white"
        >
          {t('products_customize_settings')}
        </span>
      </p>

      <div className="flex flex-col space-y-4">
        {/* Text description to Customize colors available for a new beer product. */}
        <h3 className="text-md my-4 text-gray-500 dark:text-gray-400">
          {t('products_customize_settings_description')}
        </h3>

        {/* Color  */}
        <div className="flex flex-col">
          <fieldset>
            <label
              className="text-sm font-medium text-gray-500 dark:text-gray-400"
              htmlFor="colorInputRef"
            >
              {t('products_customize_settings_color')}
            </label>

            <input
              ref={colorInputRef}
              id="colorInputRef"
              className=" border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </fieldset>

          {/* Set of colors customized by the user  */}
          <div className="flex flex-col">
            <div className="flex w-full flex-wrap justify-center">
              {colors.map((color, index) => (
                <div
                  key={`color-${index}`}
                  data-te-chips-init
                  data-te-chips-placeholder
                  className="mb-0 min-h-[45px] border-none pb-0 shadow-none outline-none transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:cursor-text"
                  data-te-editable="true"
                >
                  <ChipCard
                    content={color}
                    handleRemove={() => handleRemoveColor(color)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Family Style  */}
        <div className="flex flex-col">
          <fieldset>
            <label
              className="text-sm font-medium text-gray-500 dark:text-gray-400"
              htmlFor="familyStylesInputRef"
            >
              {t('products_customize_settings_family_style')}
            </label>

            <input
              ref={familyStylesInputRef}
              id="familyStylesInputRef"
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </fieldset>

          {/* Set of family styles customized by the user  */}
          <div className="flex flex-col">
            <div className="flex w-full flex-wrap justify-center">
              {familyStyles.map((fStyle, index) => (
                <div
                  key={`family_styles-${index}`}
                  data-te-chips-init
                  data-te-chips-placeholder
                  className="mb-0 min-h-[45px] border-none pb-0 shadow-none outline-none transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:cursor-text"
                  data-te-editable="true"
                >
                  <ChipCard
                    content={fStyle}
                    handleRemove={() => handleRemoveFamStyle(fStyle)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
