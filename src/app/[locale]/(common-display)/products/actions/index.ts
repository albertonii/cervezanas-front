'use server';

import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function handleProductLike(
    productId: string,
    ownerId: string,
    isLikeProduct: boolean,
) {
    const url = `${baseUrl}/api/products/likes`;

    if (!isLikeProduct) {
        const formData = new FormData();

        formData.set('product_id', productId);
        formData.set('owner_id', ownerId);

        const res = await axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Headers':
                    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
            },
        });

        return {
            status: res.status,
            message: res.statusText,
        };
    } else {
        const formData = new FormData();

        formData.set('product_id', productId);
        formData.set('owner_id', ownerId);

        const deleteUrl = `${url}?product_id=${productId}&owner_id=${ownerId}`;

        const res = await axios.delete(deleteUrl);

        return {
            status: res.status,
            message: res.statusText,
        };
    }
}
