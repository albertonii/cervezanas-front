import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function UpdateEventCPOrderStatus(
    event_cp_id: string,
    status: string,
) {
    try {
        const url = `${baseUrl}/api/events/cp/order_status`;
        const formData = new FormData();

        formData.append('event_cp_id', event_cp_id);
        formData.append('status', status);

        const response = await axios.put(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.status === 200) {
            console.log('Updated event CP order status:', response.data);
            return { data: response.data, status: response.status };
        } else {
            console.error('Failed to update CP order status:', response);
            return { data: response.data, status: response.status };
        }
    } catch (error) {
        console.error('Error updating CP order status in database:', error);
        return { data: error, status: 500 };
    }
}
