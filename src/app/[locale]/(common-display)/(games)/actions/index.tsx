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
