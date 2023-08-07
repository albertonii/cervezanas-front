"use client";

import { useEffect, useState } from "react";
import { ConfigureProducts } from "../../../producer/profile/products/ConfigureProducts";

export function Products() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ConfigureProducts />
    </>
  );
}
