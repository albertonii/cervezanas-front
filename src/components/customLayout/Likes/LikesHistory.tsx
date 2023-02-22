import { useEffect, useState } from "react";
import { Like } from "../../../lib/types";
import { supabase } from "../../../utils/supabaseClient";

interface Props {
  userId: string;
}

export function LikesHistory({ userId }: Props) {
  const [likes, setLikes] = useState<Like[]>([]);

  useEffect(() => {
    const getLikesHistory = async () => {
      const { data: likes, error } = await supabase
        .from("likes")
        .select(
          `
          product_id,
          products (
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

    return () => {
      setLikes([]);
    };
  }, [userId]);

  return (
    <div>
      {likes.length > 0 &&
        likes.map((like, index) => {
          return (
            <div key={index} className="mt-12 ml-8">
              <h1>{like.product_id}</h1>
            </div>
          );
        })}
    </div>
  );
}
