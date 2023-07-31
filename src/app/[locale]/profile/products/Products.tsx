"use client";

import { useEffect, useState } from "react";
import { ConfigureProducts } from "../../../../components/customLayout";

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
