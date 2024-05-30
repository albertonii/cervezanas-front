'use server';

export async function removeBillingAddressById(billingAddressId: string) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const url = `${baseUrl}/api/shopping_basket/billing_address`;

    const formData = new FormData();
    formData.set('billing_address_id', billingAddressId);

    const res = await fetch(url, {
        method: 'DELETE',
        body: formData,
    });

    return {
        status: res.status,
        message: res.statusText,
    };
}

export async function removeShippingAddressById(shippingAddressId: string) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const url = `${baseUrl}/api/shopping_basket/shipping_address`;

    const formData = new FormData();
    formData.set('billing_address_id', shippingAddressId);

    const res = await fetch(url, {
        method: 'DELETE',
        body: formData,
    });

    return {
        status: res.status,
        message: res.statusText,
    };
}
