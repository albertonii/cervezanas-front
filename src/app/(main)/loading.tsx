import React from "react";
import { Spinner } from "../../components/common";

export default function loading() {
  return (
    <div className="flex w-full items-center justify-center">
      <Spinner color="beer-blonde" size="xLarge" />
    </div>
  );
}
