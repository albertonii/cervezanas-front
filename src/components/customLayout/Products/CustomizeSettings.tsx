import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CustomizeSettings } from "../../../lib/types";
import { ChipCard } from "../../common";

interface Props {
  customizeSettings: CustomizeSettings;
}
export function CustomizeSettings({ customizeSettings }: Props) {
  const { t } = useTranslation();

  const colorInputRef = useRef<HTMLInputElement>(null);
  const [colors, setColors] = useState<string[]>(customizeSettings.colors);

  useEffect(() => {
    const addColor = () => {
      if (colorInputRef.current) {
        const color = colorInputRef.current.value;
        if (color && color.length > 0) {
          setColors((prevColors) => [...prevColors, color]);
          colorInputRef.current.value = "";
        }
      }
    };

    const listener = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === "NumpadEnter") {
        addColor();
        event.preventDefault();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, []);

  const handleRemoveColor = (color: string) => {
    setColors((prevColors) =>
      prevColors.filter((c) => {
        console.log(c);
        console.log(color);
        return c !== color;
      })
    );
  };

  useEffect(() => {
    console.log("Colors ", colors);
  }, [colors]);

  return (
    <>
      <div className="py-6 px-4 " aria-label="CustomizeSettings">
        <div className="flex items-center">
          <div className="text-4xl pr-12">
            {t("products_customize_settings")}
          </div>
        </div>

        <div className="flex flex-col">
          {/* Text description to Customize colors available for a new beer product. */}
          <div className="text-md text-gray-500 dark:text-gray-400">
            {t("products_customize_settings_description")}
          </div>

          {/* dynamic input and label to add new color  */}
          <div className="flex flex-col">
            <div>
              <label
                className="text-sm font-medium text-gray-500 dark:text-gray-400"
                htmlFor="colorInputRef"
              >
                {t("products_customize_settings_color")}
              </label>

              <input
                ref={colorInputRef}
                id="colorInputRef"
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                onDragEnter={() => {
                  console.log("drag");
                }}
              />
            </div>

            {/* list of colors customized by the user  */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {t("products_customize_settings_color_list")}
              </label>

              <div className="flex w-full flex-wrap justify-center">
                {colors.map((color, index) => (
                  <div
                    key={index}
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
        </div>
      </div>
    </>
  );
}
