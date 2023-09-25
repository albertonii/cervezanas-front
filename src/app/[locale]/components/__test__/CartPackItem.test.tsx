import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { IProductPack, IProductPackCartItem } from "../../../../lib/types";
import { CartPackItem } from "../Cart/CartPackItem";

const item: IProductPackCartItem = {
  id: "1",
  name: "Jaira IPA",
  image: "public/assets/marketplace_product_default.png",
  price: 2,
  quantity: 6,
  packs: [
    {
      id: "1",
      created_at: "2021-08-10T15:00:00.000Z",

      name: "Pack 1",
      price: 1000,
      quantity: 6,
      img_url: "public/assets/marketplace_product_default.png",
      randomUUID: "1",
      product_id: "1",
    },
  ],
};

const pack: IProductPack = {
  id: "1",
  created_at: "2021-08-10T15:00:00.000Z",
  name: "Pack 1",
  price: 1000,
  quantity: 6,
  img_url: "public/assets/marketplace_product_default.png",
  randomUUID: "1",
  product_id: "1",
};

describe("Cart Item", () => {
  it("Should render the Cart Item", () => {
    render(
      <NextIntlClientProvider
        locale={"es"}
        messages={{ product_pack_name: "Pack", quantity: "Cantidad" }}
      >
        <CartPackItem item={item} pack={pack} />
      </NextIntlClientProvider>
    );

    const cartPackItem = screen.getByTestId("cart-pack-item");

    expect(cartPackItem).toBeInTheDocument();
  });
});
