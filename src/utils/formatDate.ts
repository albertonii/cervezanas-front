export function formatDateString(dateString: string) {
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateDefaultInput(date: string) {
  return new Date(date).toISOString().substring(0, 10);
}
