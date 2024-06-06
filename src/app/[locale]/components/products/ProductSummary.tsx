import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { formatCurrency } from '../../../../utils/formatCurrency';
import { FilePreview } from '../common/FilePreview';
import { ModalAddProductFormData } from '../../../../lib/types/types';
import { DisplayInputError } from '../common/DisplayInputError';

interface Props {
    form: UseFormReturn<ModalAddProductFormData, any>;
}

export function ProductSummary({ form: { getValues, formState } }: Props) {
    const t = useTranslations();

    const { errors } = formState;

   return (
       <>
           {/* Resumen de las características del producto que se va a crear  */}
           <section className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md border border-gray-200">
               {/* Public */}
               <div className="flex flex-row gap-4">
                   <label className="text-md font-semibold text-gray-600">
                       {t('is_public')}
                   </label>
                   <span className="text-md">
                       {getValues('is_public') ? t('yes') : t('no')}
                   </span>
               </div>

               {/* Name */}
               <div className="flex flex-row gap-4">
                   <label className="text-md font-semibold text-gray-600">
                       {t('name_label')}
                   </label>
                   <span className="text-md">{getValues('name')}</span>
               </div>

               {/* Description */}
               <div className="flex flex-row gap-4">
                   <label className="text-md font-semibold text-gray-600">
                       {t('description')}
                   </label>
                   <span className="text-md">{getValues('description')}</span>
               </div>

               {/* ABV Fermentation Color */}
               <div className="flex flex-row justify-between gap-4">
                   <div className="flex flex-col">
                       <label className="text-md font-semibold text-gray-600">
                           {t('intensity_label')}
                       </label>
                       <span className="text-md">
                           {getValues('intensity')} %
                       </span>
                   </div>
                   <div className="flex flex-col">
                       <label className="text-md font-semibold text-gray-600">
                           {t('fermentation_label')}
                       </label>
                       <span className="text-md">
                           {getValues('fermentation')}
                       </span>
                   </div>
                   <div className="flex flex-col">
                       <label className="text-md font-semibold text-gray-600">
                           {t('color_label')}
                       </label>
                       <span className="text-md">{getValues('color')}</span>
                   </div>
               </div>

               {/* Region Family Era */}
               <div className="flex flex-row gap-4">
                   <label className="text-md font-semibold text-gray-600">
                       {t('family_label')}
                   </label>
                   <span className="text-md">{getValues('family')}</span>
               </div>

               {/* Format Volume Price */}
               <div className="flex flex-row justify-between gap-4">
                   <div className="flex flex-col">
                       <label className="text-md font-semibold text-gray-600">
                           {t('format_label')}
                       </label>
                       <span className="text-md">{t(getValues('format'))}</span>
                   </div>
                   <div className="flex flex-col">
                       <label className="text-md font-semibold text-gray-600">
                           {t('volume_label')}
                       </label>
                       <span className="text-md">{getValues('volume')}</span>
                   </div>
                   <div className="flex flex-col">
                       <label className="text-md font-semibold text-gray-600">
                           {t('price')}
                       </label>
                       <span className="text-md">
                           {formatCurrency(getValues('price'))}
                       </span>
                   </div>
               </div>

               {/* Stock Quantity and Notification */}
               <div className="flex flex-row justify-between gap-4">
                   <div className="flex flex-col">
                       <label className="text-md font-semibold text-gray-600">
                           {t('stock_quantity_label')}
                       </label>
                       <span className="text-md">
                           {getValues('stock_quantity')}
                       </span>
                   </div>
                   <div className="flex flex-col">
                       <label className="text-md font-semibold text-gray-600">
                           {t('stock_limit_notification_label')}
                       </label>
                       <span className="text-md">
                           {getValues('stock_limit_notification')}
                       </span>
                   </div>
               </div>

               {/* Packs */}
               {getValues('packs').length > 0 && (
                   <>
                       <h4 className="text-xl text-gray-600">{t('packs')}</h4>
                       {getValues('packs').map((pack, index) => (
                           <div
                               key={index}
                               className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg"
                           >
                               <div className="flex flex-row justify-between">
                                   <div className="flex flex-col">
                                       <label className="text-md font-semibold text-gray-600">
                                           {t('pack_name')}
                                       </label>
                                       <span className="text-md">
                                           {pack.name.length === 0
                                               ? t('unassigned')
                                               : pack.name}
                                       </span>
                                   </div>
                                   <div className="flex flex-col">
                                       <label className="text-md font-semibold text-gray-600">
                                           {t('pack_quantity')}
                                       </label>
                                       <span className="text-md">
                                           {pack.quantity}
                                       </span>
                                   </div>
                               </div>
                               <div className="flex flex-row justify-between">
                                   <div className="flex flex-col">
                                       <label className="text-md font-semibold text-gray-600">
                                           {t('pack_price')} €
                                       </label>
                                       <span className="text-md">
                                           {formatCurrency(pack.price)}
                                       </span>
                                   </div>
                                   <div className="flex flex-col">
                                       <label className="text-md font-semibold text-gray-600">
                                           {t('pack_img_url')}
                                       </label>
                                       <span className="text-md">
                                           {pack.img_url.length === 0 ? (
                                               t('unassigned')
                                           ) : (
                                               <FilePreview
                                                   file={pack.img_url[0]}
                                               />
                                           )}
                                       </span>
                                   </div>
                               </div>
                           </div>
                       ))}
                   </>
               )}

               {/* Awards */}
               {getValues('awards').length > 0 && (
                   <>
                       <h4 className="text-xl text-gray-600">{t('awards')}</h4>
                       {getValues('awards').map((award, index) => (
                           <div
                               key={index}
                               className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg"
                           >
                               <div className="flex flex-row justify-between">
                                   <div className="flex flex-col">
                                       <label className="text-md font-semibold text-gray-600">
                                           {t('award_name')}
                                       </label>
                                       <span className="text-md">
                                           {award.name.length === 0
                                               ? t('unassigned')
                                               : award.name}
                                       </span>
                                   </div>
                                   <div className="flex flex-col">
                                       <label className="text-md font-semibold text-gray-600">
                                           {t('description')}
                                       </label>
                                       <span className="text-md">
                                           {award.description}
                                       </span>
                                   </div>
                               </div>
                               <div className="flex flex-row justify-between">
                                   <div className="flex flex-col">
                                       <label className="text-md font-semibold text-gray-600">
                                           {t('award_year')}
                                       </label>
                                       <span className="text-md">
                                           {award.year}
                                       </span>
                                   </div>
                                   <div className="flex flex-col">
                                       <label className="text-md font-semibold text-gray-600">
                                           {t('award_img_url')}
                                       </label>
                                       <span className="text-md">
                                           {award.img_url.length === 0 ? (
                                               t('unassigned')
                                           ) : (
                                               <FilePreview
                                                   file={award.img_url[0]}
                                               />
                                           )}
                                       </span>
                                   </div>
                               </div>
                           </div>
                       ))}
                   </>
               )}

               {/* Errores detectados */}
               {Object.keys(errors).length > 0 && (
                   <div className="flex flex-col gap-4 p-4 bg-red-50 rounded-lg">
                       <h4 className="text-xl text-red-600">
                           {t('form_errors_detected')}
                       </h4>
                       {Object.keys(errors).map((error, index) => (
                           <div key={index} className="text-md text-red-600">
                               Campo: <DisplayInputError message={error} />
                           </div>
                       ))}
                       <div className="text-md text-red-600">
                           {t('errors.correct_and_submit')}
                       </div>
                   </div>
               )}
           </section>
       </>
   );
}
