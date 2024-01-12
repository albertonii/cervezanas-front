import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function MarketplaceHeader({ children }: Props) {
  return <div className="my-5 px-8">{children}</div>;
}
