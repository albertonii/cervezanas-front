import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { IProductPackCartItem } from "../../../../lib/types";
import { CartItem } from "../Cart/CartItem";

const item: IProductPackCartItem = {
  id: "1",
  name: "Jaira IPA",
  image:
    "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
  price: 2,
  quantity: 6,
  packs: [
    {
      id: "1",
      created_at: "2021-08-10T15:00:00.000Z",

      name: "Pack 1",
      price: 1000,
      quantity: 6,
      img_url:
        "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
      randomUUID: "1",
      product_id: "1",
    },
  ],
};

describe("Cart Item", () => {
  it("Should render the Cart Item", () => {
    render(
      <NextIntlClientProvider
        locale={"es"}
        messages={{
          product_pack_name: "Pack",
          product_name: "Producto",
          quantity: "Cantidad",
        }}
      >
        <CartItem item={item} />
      </NextIntlClientProvider>
    );
    const cartItem = screen.getByTestId("cart-item");
    expect(cartItem).toBeInTheDocument();
  });
});
