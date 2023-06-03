import { IEvent } from "../../../lib/types.d";
import { createServerClient } from "../../../utils/supabaseServer";
import Events from "./Events";

export default async function EventsPage() {
  const eventsData = getEvents();
  const [events] = await Promise.all([eventsData]);
  // const events: IEvent[] = [
  //   {
  //     id: "1",
  //     created_at: new Date(),
  //     name: "Prueba evento",
  //     description: "Descripcion evento",
  //     start_date: new Date(),
  //     end_date: new Date(),
  //     logo: "/logo",
  //     promotional_img: "/icons/profile-240.png",
  //     owner_id: [],
  //     cp_mobile: [],
  //     status: "",
  //     address: "calle falsa 123",
  //     geoArgs: [],
  //   },
  // ];
  return (
    <>
      <Events events={events} />
    </>
  );
}

async function getEvents() {
  const supabase = createServerClient();
  const { data: event, error } = await supabase.from("events").select(
    `
      *,
      owner_id (*),
      cp_mobile (*)
    `
  );
  if (error) console.error(error);
  return event as IEvent[];
}
