import { CURRENCY_ENUM } from '@/lib/enums';

const CURRENCY_FORMATTER = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: CURRENCY_ENUM.EUR,
});

export function formatCurrency(number: number | undefined) {
    if (number === null || number === undefined || isNaN(number)) return '';

    return CURRENCY_FORMATTER.format(number);
}

export function formatPaypal(number: number) {
    return number.toFixed(2);
}
