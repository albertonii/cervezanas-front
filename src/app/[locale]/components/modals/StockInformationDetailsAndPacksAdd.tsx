import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import React, { useEffect } from 'react';
import { IProductPack, ModalAddProductFormData } from '../../../../lib/types';
import { FilePreviewImageMultimedia } from '../common/FilePreviewImageMultimedia';
import { DeleteButton } from '../common/DeleteButton';
import Button from '../common/Button';
import { pack_type_options } from '../../../../lib/beerEnum';
import { SupabaseProps } from '../../../../constants';
import InputLabel from '../common/InputLabel';

interface Props {
  form: UseFormReturn<ModalAddProductFormData, any>;
}

const emptyPack: IProductPack = {
  id: '',
  product_id: '',
  created_at: '',
  quantity: 6,
  price: 0,
  img_url: '',
  name: '',
  randomUUID: '',
};

export default function StockInformationDetailsAndPacksAdd({ form }: Props) {
  const t = useTranslations();

  const { register, getValues, control } = form;

  const { fields, append, remove } = useFieldArray({
    name: 'packs',
    control,
  });

  const handleRemovePack = async (index: number) => {
    remove(index);
  };

  const handleAddPack = () => {
    append(emptyPack);
  };

  return (
    <section className="container mt-4">
      <p className="text-slate-500 my-4 text-xl leading-relaxed">
        {t('modal_product_add_price_title')}
      </p>

      <div className="flex w-full flex-col space-y-4 ">
        {/* Stock quantity and Limitation */}
        <div className="flex w-full flex-row space-x-3 ">
          <InputLabel
            form={form}
            label={'stock_quantity'}
            labelText={t('stock_quantity_label')}
            registerOptions={{
              value: getValues('stock_quantity'),
              required: true,
              min: 0,
              valueAsNumber: true,
            }}
            placeholder="500"
            inputType="number"
          />

          <InputLabel
            form={form}
            label={'stock_limit_notification'}
            labelText={t('stock_limit_notification_label')}
            registerOptions={{
              value: getValues('stock_limit_notification'),
              required: true,
              min: 0,
              valueAsNumber: true,
            }}
            placeholder="20"
            inputType="number"
          />
        </div>

        {/* Packs */}
        <div className="flex flex-col space-y-2">
          <span className="text-lg ">{t('add_product_pack')}</span>

          <span className="text-sm ">{t('add_product_pack_description')}</span>
        </div>

        {fields.map((pack, index) => (
          <fieldset
            className="border border-solid border-gray-300 p-3"
            key={pack.id}
          >
            <div className="space-y w-full">
              {/* Quantity and price  */}
              <div className="flex w-full flex-row items-end space-x-3">
                <div className="w-full">
                  <label
                    htmlFor={`packs.${index}.pack`}
                    className="text-sm text-gray-600"
                  >
                    {t('pack_quantity')} nº {index + 1}
                  </label>

                  <select
                    required
                    id={`packs.${index}.pack`}
                    {...register(`packs.${index}.quantity` as const, {
                      value: getValues(`packs.${index}.quantity`),
                      required: true,
                      valueAsNumber: true,
                    })}
                    className="relative  block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                  >
                    {pack_type_options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.value}
                      </option>
                    ))}
                  </select>

                  {`errors.packs.${index}.pack.type` === 'required' && (
                    <p>{t('errors.input_required')}</p>
                  )}
                </div>

                <InputLabel
                  form={form}
                  label={`packs.${index}.price`}
                  labelText={t('pack_price')}
                  registerOptions={{
                    value: getValues(`packs.${index}.price`),
                    required: true,
                    min: 0,
                    valueAsNumber: true,
                  }}
                  placeholder="2.5"
                  inputType="number"
                  defaultValue={3}
                />
              </div>

              {/* Pack name  */}
              <InputLabel
                form={form}
                label={`packs.${index}.name`}
                labelText={t('pack_name')}
                registerOptions={{
                  value: getValues(`packs.${index}.name`),
                  required: true,
                }}
                placeholder={`Pack ${index + 1}`}
              />

              {/* File  */}
              <div className="flex w-full flex-row items-end space-x-3 space-y-2">
                <div className="w-full">
                  <label
                    htmlFor={`packs.${index}.img_url`}
                    className="text-sm text-gray-600"
                  >
                    {t('pack_img_url')}
                  </label>

                  <FilePreviewImageMultimedia
                    form={form}
                    registerName={`packs.${index}.img_url`}
                  />
                </div>

                {/* Delete BTN  */}
                <div className="flex-grow-0">
                  <DeleteButton onClick={() => handleRemovePack(index)} />
                </div>
              </div>
            </div>
          </fieldset>
        ))}

        <Button class="" primary medium onClick={() => handleAddPack()}>
          {t('add_pack')}
        </Button>
      </div>
    </section>
  );
}
