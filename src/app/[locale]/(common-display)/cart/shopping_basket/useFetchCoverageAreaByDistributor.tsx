import { useQuery } from "react-query";

const fetchShippingByOwnerId = async (address: string) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Construye la URL de la solicitud a la API de geocodificación de Google Maps.
  const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "OK") {
        const location = data.results[0].geometry.location;

        console.log(location);

        // Verifica si la ubicación está dentro de la zona de envío del vendedor.
        // Puedes agregar tu lógica de verificación aquí.
        const isWithinShippingZone = true; // Cambia esto según tu lógica real.

        // if (isWithinShippingZone) {
        //   document.getElementById("result").textContent =
        //     "Dirección de envío válida";
        // } else {
        //   document.getElementById("result").textContent =
        //     "Dirección de envío no válida";
        // }
      } else {
        // document.getElementById("result").textContent =
        //   "No se pudo verificar la dirección";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  return location;
};

const useFetchShippingByOwnerId = (ownerId: string) => {
  return useQuery({
    queryKey: ["shippingAddresses", ownerId],
    queryFn: () => fetchShippingByOwnerId(ownerId),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export default useFetchShippingByOwnerId;
