import {
    IConfigurationStepFormData,
    IStepFormData,
} from '@/lib/types/beerMasterGame';
import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function handleBMGameQRCodeScanned(
    stepId: string,
    userId: string,
) {
    const url = `${baseUrl}/api/beer_master_game/step_scan_qr_code`;

    const formData = new FormData();
    formData.set('step_id', stepId);
    formData.set('user_id', userId);

    const res = await axios.post(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Headers':
                'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
        },
    });

    return {
        data: res.data,
        status: res.status,
        message: res.statusText,
    };
}

export async function handleSaveBasicGMGameInformation(
    name: string,
    description: string,
    location: string,
    totalSteps: number,
    gameStateId: string,
) {
    const url = `${baseUrl}/api/beer_master_game/organization/basic_information`;

    const formData = new FormData();
    formData.set('game_state_id', gameStateId);
    formData.set('name', name);
    formData.set('description', description);
    formData.set('location', location);
    formData.set('total_steps', totalSteps.toString());

    const res = await axios.put(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Headers':
                'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
        },
    });

    return {
        data: res.data,
        status: res.status,
        message: res.statusText,
    };
}

export async function handleSaveBMGameStep(
    stepToUpd: IConfigurationStepFormData,
) {
    const url = `${baseUrl}/api/beer_master_game/organization/step`;

    const formData = new FormData();

    formData.set('step_id', stepToUpd.id || '');
    formData.set('bm_state_id', stepToUpd.bm_state_id);
    formData.set('title', stepToUpd.title);
    formData.set('description', stepToUpd.description);
    formData.set('location', stepToUpd.location);
    formData.set('is_unlocked', stepToUpd.is_unlocked.toString());
    formData.set('step_number', stepToUpd.step_number.toString());
    formData.set(
        'bm_steps_questions',
        JSON.stringify(stepToUpd.bm_steps_questions),
    );

    const res = await axios.put(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Headers':
                'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
        },
    });

    return {
        data: res.data,
        status: res.status,
        message: res.statusText,
    };
}

export async function updateStepsNumberInDB(
    updatedSteps: IConfigurationStepFormData[],
) {
    try {
        const url = '/api/beer_master_game/organization/step/list_number';
        const formData = new FormData();

        updatedSteps.forEach((step, index) => {
            formData.append(`steps[${index}][id]`, step.id);
            formData.append(
                `steps[${index}][step_number]`,
                step.step_number.toString(),
            );
        });

        const response = await axios.put(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.status === 200) {
            console.log('Steps updated successfully');
        } else {
            console.error('Failed to update steps:', response);
        }
    } catch (error) {
        console.error('Error updating steps in database:', error);
    }
}
