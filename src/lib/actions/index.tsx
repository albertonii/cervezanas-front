'use server';

// Marcar que todas las funciones que se exportan en este archivo son de servidor
// por lo tanto no se ejecuta ni se envían al cliente
import createServerClient from '../../utils/supabaseServer';

export default async function readUserSession() {
    const supabase = await createServerClient();

    // Be careful when protecting pages. The server gets the user session from the cookies, which can be spoofed by anyone.
    // Always use supabase.auth.getUser() to protect pages and user data.
    // Never trust supabase.auth.getSession() inside server code such as middleware. It isn't guaranteed to revalidate the Auth token.
    // It's safe to trust getUser() because it sends a request to the Supabase Auth server every time to revalidate the Auth token.
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return user;
}

export async function sendPushNotification(
    destination_user: string,
    message: string,
    link: string,
) {
    const encodeMessage = encodeURIComponent(message);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const url = `${baseUrl}/api/push_notification?destination_user=${destination_user}&message=${encodeMessage}&link=${link}`;

    fetch(url, {
        method: 'POST',
    });
}

export async function sendNewProducerEmail(emailTo: string) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const url = `${baseUrl}/api/emails/new_producer`;

    const formData = new FormData();
    formData.set('email-to', emailTo);

    // Email al usuario
    fetch(url, {
        method: 'POST',
        body: formData,
    });
}

export async function sendNewDistributorEmail(emailTo: string) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const url = `${baseUrl}/api/emails/new_distributor`;

    const formData = new FormData();
    formData.set('email-to', emailTo);

    // Email al usuario
    fetch(url, {
        method: 'POST',
        body: formData,
    });
}
