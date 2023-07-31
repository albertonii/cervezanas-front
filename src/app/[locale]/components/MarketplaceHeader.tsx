import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function MarketplaceHeader({ children }: Props) {
  return <div className="my-8 px-3">{children}</div>;
}
