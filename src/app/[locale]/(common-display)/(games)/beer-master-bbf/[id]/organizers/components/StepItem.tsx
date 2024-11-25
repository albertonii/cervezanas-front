import InputLabelNoForm from '@/app/[locale]/components/form/InputLabelNoForm';
import React from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useTranslations } from 'next-intl';
import { useSortable } from '@dnd-kit/sortable';
import { GripVertical, Gift } from 'lucide-react';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { IConfigurationStepFormData } from '@/lib/types/beerMasterGame';
import { IconButton } from '@/app/[locale]/components/ui/buttons/IconButton';

interface Props {
    step: IConfigurationStepFormData;
    index: number;
    onEditClick: (step: IConfigurationStepFormData) => void;
}

// Separate StepItem into its own component with modern patterns
const StepItem = React.memo(function StepItem({
    step,
    index,
    onEditClick,
}: Props) {
    const t = useTranslations('bm_game');

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: step.id ?? 'default-id' });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            className={` rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow  ${
                isDragging
                    ? 'shadow-lg bg-gray-100'
                    : 'bg-white hover:shadow-md'
            } `}
            aria-label={`Drag step ${step.step_number}`}
        >
            <div className="flex items-center space-x-4">
                <div {...listeners} className={`cursor-grab `}>
                    <GripVertical className={`w-6 h-6 text-gray-400`} />
                </div>
                <div className="flex-1 ">
                    <div className="flex items-center space-x-3 mb-2">
                        <span className="font-medium text-gray-900">
                            {t('step_and_number', {
                                stepNumber: step.step_number,
                            })}
                        </span>
                        {step.bm_steps_rewards && (
                            <Gift className="w-4 h-4 text-amber-500" />
                        )}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <InputLabelNoForm
                            disabled
                            label="title"
                            value={step.title}
                        />

                        <InputLabelNoForm
                            label="location"
                            labelText={t('location')}
                            disabled
                            value={step.location}
                        />

                        <div className="flex items-center space-x-4">
                            <InputLabelNoForm
                                inputType="checkbox"
                                label="is_unlocked"
                                labelText={t('is_unlocked')}
                                disabled
                            />
                        </div>
                    </div>
                </div>

                <IconButton
                    primary
                    onClick={() => onEditClick(step)}
                    icon={faEdit}
                    title={t('edit')}
                    size="box"
                ></IconButton>
            </div>
        </div>
    );
});

export default StepItem;
