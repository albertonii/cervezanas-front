export function formatDateString(dateString: string) {
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateTypeDefaultInput(date: Date) {
  console.log(typeof date);
  return date.toISOString().substring(0, 10);
}

export function formatDateDefaultInput(date: string) {
  return new Date(date).toISOString().substring(0, 10);
}

export function formatDate(date: Date) {
  return new Date(date).toLocaleDateString();
}

export function getTimeElapsed(startDate: any): string {
  if (typeof startDate === "string") startDate = new Date(startDate);

  const currentDate = Date.now(); // Retorna la fecha actual en milisegundos
  const elapsedMs = currentDate - startDate.getTime();
  const seconds = Math.floor(elapsedMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h ago`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m ago`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s ago`;
  } else {
    return `${seconds}s ago`;
  }
}
