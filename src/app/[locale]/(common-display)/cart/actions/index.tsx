'use server';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function removeBillingAddressById(billingAddressId: string) {
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
    const url = `${baseUrl}/api/shopping_basket/shipping_address`;

    const formData = new FormData();
    formData.set('shipping_address_id', shippingAddressId);

    const res = await fetch(url, {
        method: 'DELETE',
        body: formData,
    });

    return {
        status: res.status,
        message: res.statusText,
    };
}

export async function insertShippingAddress(form: {
    user_id: string;
    name: string;
    lastname: string;
    document_id: string;
    phone: string;
    address: string;
    address_extra?: string;
    address_observations?: string;
    country: string;
    zipcode: string;
    city: string;
    state: string;
    is_default: boolean;
}) {
    const {
        user_id,
        name,
        lastname,
        document_id,
        phone,
        address,
        address_extra,
        address_observations,
        country,
        zipcode,
        city,
        state,
        is_default,
    } = form;

    const url = `${baseUrl}/api/shopping_basket/shipping_address`;

    const formData = new FormData();
    formData.set('user_id', user_id);
    formData.set('name', name);
    formData.set('lastname', lastname);
    formData.set('document_id', document_id);
    formData.set('phone', phone);
    formData.set('address', address);
    formData.set('address_extra', address_extra ?? '');
    formData.set('address_observations', address_observations ?? '');
    formData.set('country', country);
    formData.set('zipcode', zipcode);
    formData.set('city', city);
    formData.set('state', state);
    formData.set('is_default', is_default.toString());

    const res = await fetch(url, {
        method: 'POST',
        body: formData,
    });

    return {
        status: res.status,
        message: res.statusText,
    };
}

export async function insertBillingAddress(form: {
    user_id: string;
    name: string;
    lastname: string;
    document_id: string;
    phone: string;
    address: string;
    country: string;
    zipcode: string;
    city: string;
    state: string;
    is_default: boolean;
}) {
    const {
        user_id,
        name,
        lastname,
        document_id,
        phone,
        address,
        country,
        zipcode,
        city,
        state,
        is_default,
    } = form;

    const url = `${baseUrl}/api/shopping_basket/billing_address`;

    const formData = new FormData();
    formData.set('user_id', user_id);
    formData.set('name', name);
    formData.set('lastname', lastname);
    formData.set('document_id', document_id);
    formData.set('phone', phone);
    formData.set('address', address);
    formData.set('country', country);
    formData.set('zipcode', zipcode);
    formData.set('city', city);
    formData.set('state', state);
    formData.set('is_default', is_default.toString());

    const res = await fetch(url, {
        method: 'POST',
        body: formData,
    });

    return {
        status: res.status,
        message: res.statusText,
    };
}
