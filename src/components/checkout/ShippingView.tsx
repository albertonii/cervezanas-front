import React from "react";
import { useCheckoutStep } from "../../hooks/useCheckoutStep";

export function ShippingView() {
  const { stepIndex, numSteps } = useCheckoutStep([
    <div key={1}> cart</div>,
    <div key={1}> pra</div>,
  ]);

  return (
    <>
      <div style={{ position: "absolute", top: ".5rem", right: ".5rem" }}>
        {stepIndex + 1} / {numSteps}
      </div>
      {stepIndex}
    </>
  );
}
