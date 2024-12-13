import Title from '@/app/[locale]/components/ui/Title';
import Label from '@/app/[locale]/components/ui/Label';
import Button from '@/app/[locale]/components/ui/buttons/Button';
import InputLabel from '@/app/[locale]/components/form/InputLabel';
import InputTextarea from '@/app/[locale]/components/form/InputTextarea';
import React from 'react';
import { z, ZodType } from 'zod';
import { useMutation } from 'react-query';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, AlignLeft, Type } from 'lucide-react';
import { IGameState } from '@/lib/types/beerMasterGame';
import { SubmitHandler, useForm } from 'react-hook-form';
import { handleSaveBasicGMGameInformation } from '../../../../actions';
import { useMessage } from '@/app/[locale]/components/message/useMessage';

type FormData = {
    name: string;
    description: string;
    location: string;
    totalSteps: number;
};

interface GameBasicInfoProps {
    gameState: IGameState;
    onChangeGameState: (gameState: IGameState) => void;
}

const schema: ZodType<FormData> = z.object({
    name: z.string().nonempty({ message: 'errors.input_required' }),
    description: z.string().nonempty({ message: 'errors.input_required' }),
    location: z.string().nonempty({ message: 'errors.input_required' }),
    totalSteps: z
        .number()
        .min(1, 'errors.input_number_min_1')
        .max(50, 'errors.input_number_max_50'),
});

type ValidationSchema = z.infer<typeof schema>;

export default function GameBasicInfo({
    gameState,
    onChangeGameState,
}: GameBasicInfoProps) {
    const t = useTranslations('bm_game');

    const { handleMessage } = useMessage();

    const [isLoading, setIsLoading] = React.useState(false);

    const form = useForm<ValidationSchema>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: gameState.title,
            description: gameState.description,
            location: gameState.location,
            totalSteps: gameState.total_steps,
        },
    });

    const { handleSubmit } = form;

    const handleUpdateBasicExperience = async (form: ValidationSchema) => {
        setIsLoading(true);
        const { name, description, location, totalSteps } = form;

        const res = await handleSaveBasicGMGameInformation(
            name,
            description,
            location,
            totalSteps,
            gameState.id,
        );

        if (res.status === 200) {
            onChangeGameState({
                ...gameState,
                title: name,
                description,
                location,
                total_steps: totalSteps,
            });

            handleMessage({
                message: 'Game information updated successfully',
                type: 'success',
            });
        } else {
            handleMessage({
                message: 'Error updating game information',
                type: 'error',
            });
        }

        setIsLoading(false);
    };

    const handleUpdateBasicExperienceMutation = useMutation({
        mutationKey: 'bmGameBasicInfo',
        mutationFn: handleUpdateBasicExperience,
        onError: (error: Error) => {
            console.error(error);
        },
    });

    const onSubmit: SubmitHandler<ValidationSchema> = (
        formValues: FormData,
    ) => {
        try {
            handleUpdateBasicExperienceMutation.mutate(formValues);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <Title size="large" color="black">
                    {t('basic_info')}
                </Title>

                <Label>{t('basic_info_description')}</Label>
            </div>

            <div className="space-y-4">
                <div>
                    <Label size="small" color="gray">
                        <div className="flex items-center space-x-2">
                            <Type className="w-4 h-4" />
                            <span>{t('name')}</span>
                        </div>
                    </Label>

                    <InputLabel
                        form={form}
                        label="name"
                        placeholder="ej. Maestro Cervecero BBF 2025"
                    />
                </div>

                <div>
                    <div className="flex items-center space-x-2">
                        <AlignLeft className="w-4 h-4" />
                        <Label size="small" color="gray">
                            {' '}
                            {t('description')}
                        </Label>
                    </div>

                    <InputTextarea form={form} label="description" rows={4} />
                </div>

                <div>
                    <Label size="small" color="gray">
                        <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>{t('location_event')}</span>
                        </div>
                    </Label>

                    <InputLabel
                        form={form}
                        label="location"
                        placeholder="ej. Fira Barcelona Montjuïc"
                    />
                </div>

                <div className="space-y-4">
                    <div>
                        <InputLabel
                            form={form}
                            label="totalSteps"
                            labelText={'total_steps'}
                            inputType="number"
                            registerOptions={{
                                min: 1,
                                max: 50,
                                valueAsNumber: true,
                            }}
                        />
                    </div>
                    <Label size="small">
                        {t('total_steps_number_description')}
                    </Label>
                </div>

                <Button primary medium btnType="submit">
                    {t('save')}
                </Button>
            </div>
        </form>
    );
}
