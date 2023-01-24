import Image from "next/image";
import React, { useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

interface Props {
  ownerId: string;
}

export default function OwnerInfo({ ownerId }: Props) {
  const [owner, setOwner] = React.useState<any>(null);

  useEffect(() => {
    const getReviewOwner = async (ownerId: string) => {
      const { data: owner, error: ownerError } = await supabase
        .from("users")
        .select("id, name, avatar_url")
        .eq("id", ownerId)
        .single();
      if (ownerError) {
        console.log("error", ownerError);
      } else {
        setOwner(owner);
        return owner;
      }
    };

    getReviewOwner(ownerId);
  }, [ownerId]);

  return (
    <>
      {owner && (
        <div className="flex items-center mb-4 space-x-4">
          <Image
            className="w-10 h-10 rounded-full"
            src="/marketplace_product_default.png"
            alt=""
            width={40}
            height={40}
          />
          <div className="space-y-1 font-medium dark:text-white">
            <p>
              {owner.name}
              <time
                dateTime="2014-08-16 19:00"
                className="block text-sm text-gray-500 dark:text-gray-400"
              >
                Joined on August 2014
              </time>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
