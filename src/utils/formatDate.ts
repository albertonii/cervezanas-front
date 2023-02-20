import { format } from "date-fns";

export function formatDateString(dateString: string) {
  console.log(typeof dateString);
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
