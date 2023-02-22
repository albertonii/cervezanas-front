import React from "react";
import { useCheckoutStep } from "../../hooks/useCheckoutStep";
import { useShoppingCart } from "../Context/ShoppingCartContext";

export function ShippingView() {
  const { items } = useShoppingCart();
  const { stepIndex, currentStep, handleBack, handleNext, numSteps } =
    useCheckoutStep([<div key={1}> cart</div>, <div key={1}> pra</div>]);

  return (
    <>
      <div style={{ position: "absolute", top: ".5rem", right: ".5rem" }}>
        {stepIndex + 1} / {numSteps}
      </div>
      {stepIndex}
    </>
  );
}
