import InputLabelNoForm from '@/app/[locale]/components/form/InputLabelNoForm';
import React, { useCallback } from 'react';
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
    onStepChange: (updatedStep: IConfigurationStepFormData) => void;
    onEditClick: (step: IConfigurationStepFormData) => void;
}

// Separate StepItem into its own component with modern patterns
const StepItem = React.memo(function StepItem({
    step,
    index,
    onStepChange,
    onEditClick,
}: Props) {
    const t = useTranslations('bm_game');

    const handleQuestionCountChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            // onStepChange({ ...step, question_count: parseInt(e.target.value) });
        },
        [step, onStepChange],
    );

    const handleLockedChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onStepChange({ ...step, is_unlocked: !e.target.checked });
        },
        [step, onStepChange],
    );

    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: step.id ?? 'default-id' });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
        >
            <div className="flex items-center space-x-4">
                <div {...listeners}>
                    <GripVertical className="w-6 h-6 text-gray-400" />
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
                                onChange={handleLockedChange}
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
