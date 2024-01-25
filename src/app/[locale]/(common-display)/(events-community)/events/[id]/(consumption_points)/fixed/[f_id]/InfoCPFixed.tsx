"use client";

import CPDetails from "./CPDetails";
import ProductList from "./ProductList";
import React from "react";
import { ICPFixed } from "../../../../../../../../../lib/types";

interface Props {
  cpFixed: ICPFixed;
  eventId: string;
}

export default function InfoCPFixed({ cpFixed, eventId }: Props) {
  return (
    <section className="relative h-full w-full rounded-lg bg-white p-8 shadow-md">
      <section className="absolute  right-0 top-0 m-4 rounded-md bg-beer-gold px-4 py-2">
        <span
          className={`text-lg font-medium text-white ${
            cpFixed.status === "active" ? "text-green-500" : "text-red-500"
          }`}
        >
          {cpFixed.status === "active" ? "Active" : "Inactive"}
        </span>
      </section>

      {/* Display all the information inside the Fixed Consumption Point */}
      <section className="mt-10 grid grid-cols-1 md:grid-cols-2">
        <CPDetails cpFixed={cpFixed} />
      </section>

      {/* Products linked to this Fixed Consumption Point */}
      <section className="mt-8">
        <ProductList cpFixed={cpFixed} eventId={eventId} />
      </section>
    </section>
  );
}
