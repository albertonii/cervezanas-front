const CURRENCY_FORMATTER = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

export function formatCurrency(number: number) {
  return CURRENCY_FORMATTER.format(number);
}

export function formatPaypal(number: number) {
  console.log(number);
  console.log(number.toFixed(2));
  return number.toFixed(2);
}
