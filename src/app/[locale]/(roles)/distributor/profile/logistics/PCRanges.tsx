import React, { useState } from "react";
import { UseFormRegister } from "react-hook-form";
import { IPCRangesProps } from "../../../../../../lib/types";
import Label from "../../../../components/Label";

interface Props {
  item: IPCRangesProps;
  index: number;
  register: UseFormRegister<any>;
}

export default function PCRanges({ item, index, register }: Props) {
  const [from, setFrom] = useState(35000);
  const [to, setTo] = useState(35999);

  const handleStart = (e: string) => {
    const value = parseInt(e);
    setFrom(value);
  };

  const handleEnd = (e: string) => {
    const value = parseInt(e);
    setTo(value);
  };

  return (
    <div className="grid grid-cols-2">
      <Label>
        <input
          type="number"
          id="end"
          {...register(`ranges.${index}.from` as const, {
            required: true,
            valueAsNumber: true,
          })}
          defaultValue={item.from}
          required
        />
      </Label>

      <Label>
        <input
          type="number"
          id="end"
          {...register(`ranges.${index}.to` as const, {
            required: true,
            valueAsNumber: true,
          })}
          defaultValue={item.to}
          required
        />
      </Label>
    </div>
  );
}
