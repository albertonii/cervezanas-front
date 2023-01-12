import { useEffect, useState } from "react";
import { Like } from "../../../types";
import { supabase } from "../../../utils/supabaseClient";

interface Props {
  userId: string;
}

export default function LikesHistory({ userId }: Props) {
  const [likes, setLikes] = useState<Like[]>([]);

  useEffect(() => {
    const getLikesHistory = async () => {
      const { data: likes, error } = await supabase
        .from("likes")
        .select(
          `
          beer_id,
          beers (
            name
          ),
        `
        )
        .eq("owner_id", userId)
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;

      setLikes(likes);
    };

    getLikesHistory();
  }, [userId]);

  return (
    <div>
      {likes.length > 0 &&
        likes.map((like, index) => {
          return (
            <div key={index} className="mt-12 ml-8">
              <h1>{like.beer_id}</h1>
            </div>
          );
        })}
    </div>
  );
}
