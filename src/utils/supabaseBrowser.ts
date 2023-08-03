import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {Database} from "../lib/schema"

export const createClient = () => createClientComponentClient<Database>();
