"use client";

import React from "react";
import { IEvent } from "../../../lib/types";

interface Props {
  events: IEvent[];
}
export default function Events({ events }: Props) {
  return <div>Events</div>;
}
