'use server';

import { IntlErrorCode } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
    return {
        messages: (await import(`./messages/${locale}.json`)).default,
        onError(error) {
            if (error.code === IntlErrorCode.MISSING_MESSAGE) {
                // Missing translations are expected and should only log an error
                console.error(error);
            } else {
                // Other errors indicate a bug in the app and should be reported
                // reportToErrorTracking(error);
            }
        },
        getMessageFallback({ namespace, key, error }) {
            const path = [namespace, key]
                .filter((part) => part != null)
                .join('.');

            if (error.code === IntlErrorCode.MISSING_MESSAGE) {
                return path + ' is not yet translated';
            } else {
                return 'Dear developer, please fix this message: ' + path;
            }
        },
    };
});
