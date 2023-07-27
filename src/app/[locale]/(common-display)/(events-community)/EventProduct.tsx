import EventPackItem from "./EventPackItem";
import React, { useEffect, useState } from "react";
import { IProductPackCartItem, IProductPack } from "../../../../lib/types";

interface Props {
  item: IProductPackCartItem;
}

export default function EventProduct({ item }: Props) {
  const [packs, setPacks] = useState<IProductPack[]>([]);

  useEffect(() => {
    setPacks(item.packs);
  }, [item]);

  return (
    <div className="flex w-full flex-col space-y-2">
      {packs.map((pack) => {
        return (
          <div key={pack.id}>
            <EventPackItem item={item} pack={pack} />
          </div>
        );
      })}
    </div>
  );
}
