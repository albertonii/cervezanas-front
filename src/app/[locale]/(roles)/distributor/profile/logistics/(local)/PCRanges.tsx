import React from "react";
import { UseFormRegister } from "react-hook-form";
import { IPCRangesProps } from "../../../../../../../lib/types.d";
import InputForm from "../../../../../components/InputForm";
import Label from "../../../../../components/Label";

interface Props {
  item: IPCRangesProps;
  index: number;
  register: UseFormRegister<any>;
}

export default function PCRanges({ item, index, register }: Props) {
  // console.log(item);
  // const [from, setFrom] = useState(item?.from ?? 35600);
  // const [to, setTo] = useState(item?.to ?? 35699);

  // const handleStart = (e: string) => {
  //   const value = parseInt(e);
  //   setFrom(value);
  // };

  // const handleEnd = (e: string) => {
  //   const value = parseInt(e);
  //   setTo(value);
  // };

  return (
    <div className="grid grid-cols-2 space-x-4">
      <Label>
        <InputForm
          register={register}
          inputName={`ranges.${index}.from`}
          required={true}
          type={"number"}
          id={`${index}-from`}
          defaultValue={item.from}
        />
      </Label>

      <Label>
        <InputForm
          register={register}
          inputName={`ranges.${index}.to`}
          required={true}
          type={"number"}
          id={`${index}-to`}
          defaultValue={item.to}
        />
      </Label>
    </div>
  );
}
