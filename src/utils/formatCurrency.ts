const CURRENCY_FORMATTER = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
});

export function formatCurrency(number: number | undefined) {
    if (!number) return '';

    return CURRENCY_FORMATTER.format(number);
}

export function formatPaypal(number: number) {
    return number.toFixed(2);
}
