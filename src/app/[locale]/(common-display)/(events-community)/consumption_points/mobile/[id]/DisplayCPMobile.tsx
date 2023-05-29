"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { COMMON } from "../../../../../../../constants";
import { ICPMobile, IProduct } from "../../../../../../../lib/types";
import { formatCurrency, formatDate } from "../../../../../../../utils";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { useEventCartContext } from "../../../../../../../components/Context/EventCartContext";
import { AddCardButton } from "../../../../../../../components/common";
import MarketCartButtons from "../../../../../../../components/common/MarketCartButtons";

interface Props {
  cpMobile: ICPMobile;
}

export default function DisplayCPMobile({ cpMobile }: Props) {
  const t = useTranslations();

  const cpm_products = cpMobile.cpm_products;
  return (
    <div className="relative h-full w-full rounded-lg bg-white p-8 shadow-md">
      <div className="absolute  right-0 top-0 m-4 rounded-md bg-beer-gold px-4 py-2">
        <span
          className={`text-lg font-medium text-white ${
            cpMobile.status === "active" ? "text-green-500" : "text-red-500"
          }`}
        >
          {cpMobile.status === "active" ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Display all the information inside the Mobile Consumption Point */}
      <div className="mt-10 grid grid-cols-2">
        <div>
          <h1 className="mb-2 text-2xl font-bold">{cpMobile.cp_name}</h1>
          <h2 className="mb-4 text-lg text-gray-500">
            {cpMobile.cp_description}
          </h2>

          <div className="mb-4">
            {/* Start and End date */}
            <span className="text-gray-500">
              {t("start_date")}: {formatDate(cpMobile.start_date)}
            </span>
            <span className="ml-4 text-gray-500">
              {t("end_date")}: {formatDate(cpMobile.end_date)}
            </span>
          </div>

          {/* Organizer information */}
          <div className="mb-4">
            <span className="text-gray-500">
              Organizer: {cpMobile.organizer_name} {cpMobile.organizer_lastname}
            </span>
            <span className="ml-4 text-gray-500">
              Email: {cpMobile.organizer_email}
            </span>
            <span className="ml-4 text-gray-500">
              Phone: {cpMobile.organizer_phone}
            </span>
          </div>
        </div>

        {/* Google maps location  */}
        <div>
          <GoogleMapLocation cp={cpMobile} />
        </div>
      </div>

      {/* Products linked to this Mobile Consumption Point */}
      <div className="mt-8">
        {cpm_products.length > 0 ? (
          <div>
            <h3 className="mb-2 text-xl font-bold">Products</h3>

            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3 ">
                    {t("img")}
                  </th>

                  <th scope="col" className="px-6 py-3 ">
                    {t("name_header")}
                  </th>

                  <th scope="col" className="px-6 py-3 ">
                    {t("description_header")}
                  </th>

                  <th scope="col" className="px-6 py-3 ">
                    {t("price_header")}
                  </th>

                  <th scope="col" className="px-6 py-3 ">
                    {t("type_header")}
                  </th>

                  <th scope="col" className="px-6 py-3 ">
                    {t("action_header")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {cpm_products.map((cpm) => (
                  <Product
                    key={cpm.id}
                    product={cpm.product_id}
                    cpmId={cpm.id}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <>
            <h3 className="mb-2 text-xl font-bold">{t("products")}</h3>
            <p className="text-gray-500">{t("no_products")}</p>
          </>
        )}
      </div>
    </div>
  );
}

interface ProductProps {
  product: IProduct;
  cpmId: string;
}

const Product = ({ product, cpmId }: ProductProps) => {
  const {
    marketplaceEventItems,
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
    addMarketplaceItems,
    removeMarketplaceItems,
  } = useEventCartContext();

  const quantity = getItemQuantity(product.id);

  const { id } = product;

  const handleIncreaseToCartItem = () => {
    increaseCartQuantity(id);

    // Check if the product is already in the marketplace items
    if (marketplaceEventItems.find((item) => item.id === id)) return;

    addMarketplaceItems(product);
  };

  const handleDecreaseFromCartItem = () => {
    decreaseCartQuantity(id);
    if (quantity > 1) return;
    removeMarketplaceItems(id);
  };

  const handleRemoveFromCart = () => {
    removeMarketplaceItems(id);
    removeFromCart(id);
  };

  return (
    <tr
      key={product.id}
      className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
    >
      <td className=" space-x-2 px-6 py-4">
        <Image
          src={
            product.product_multimedia[0]?.p_principal ??
            COMMON.MARKETPLACE_PRODUCT
          }
          alt={product.name}
          width={64}
          height={64}
        />
      </td>
      <td className="space-x-2 px-6 py-4 font-semibold hover:cursor-pointer hover:text-beer-draft">
        <Link target={"_blank"} href={`/consumption_points/products/${cpmId}`}>
          {product.name}
        </Link>
      </td>
      <td className="space-x-2 px-6 py-4">{product.description}</td>
      <td className="space-x-2 px-6 py-4 font-medium  text-green-500">
        {formatCurrency(product.price)}
      </td>
      <td className="space-x-2 px-6 py-4">{product.category}</td>
      <td className="space-x-2 px-6 py-4">
        {quantity === 0 ? (
          <>
            <AddCardButton onClick={() => handleIncreaseToCartItem()} />
          </>
        ) : (
          <>
            <MarketCartButtons
              quantity={quantity}
              item={product}
              handleIncreaseCartQuantity={() => handleIncreaseToCartItem()}
              handleDecreaseCartQuantity={() => handleDecreaseFromCartItem()}
              handleRemoveFromCart={() => handleRemoveFromCart()}
            />
          </>
        )}
      </td>
    </tr>
  );
};

interface GoogleMapLocationProps {
  cp: ICPMobile;
}

const GoogleMapLocation = ({ cp }: GoogleMapLocationProps) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY ?? "",
    libraries: ["places"],
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <Map cp={cp} />;
};

const containerStyle = {
  width: "100%",
  height: "40vh",
  borderRadius: "5px",
};

interface MapsProps {
  cp: ICPMobile;
}

function Map({ cp }: MapsProps) {
  const t = useTranslations();

  const [map, setMap] = useState<google.maps.Map>();

  const onMarkerFixClick = (marker: google.maps.Marker, mobile: ICPMobile) => {
    const content = `<div class="flex flex-col items-center space-y-4">
          <div class="flex flex-row space-x-2">
            <p class="text-md">Fecha inicio: ${formatDate(
              mobile.start_date
            )}</p>
            <p class="text-md">Fecha fin: ${formatDate(mobile.end_date)}</p>
          </div>

          <h1 class="text-xl font-bold">${marker.getTitle()}</h1>
          <p class="text-sm">${mobile.cp_description}</p>
          <p class="text-sm">Dirección: ${mobile.address}</p>
          <p class="text-sm">¿Necesario reserva?: ${
            mobile.is_booking_required ? t("yes") : t("no")
          }</p>
         

          <div class="flex flex-col items-center">
            <div class="text-lg font-semibold"> 
            Contacto de la persona encargada
            </div>

            <div class="flex flex-row space-x-2">
              <p class="text-sm">Nombre: ${mobile.organizer_name} ${
      mobile.organizer_lastname
    }</p> 
              <p class="text-sm">Teléfono: ${mobile.organizer_phone}</p>
              <p class="text-sm">Email: ${mobile.organizer_email}</p>
            </div>
          </div>
        </div>`;

    const infowindow = new google.maps.InfoWindow({
      content,
    });

    infowindow.open(map, marker);
  };

  // Loop through CPs and add CP fixed markers in first component render
  useEffect(() => {
    if (map) {
      if (!cp.geoArgs) return;
      const { lat, lng } = cp.geoArgs[0].geometry.location;
      const marker: google.maps.Marker = new google.maps.Marker({
        position: { lat, lng },
        map: map,
        title: cp.cp_name,
        icon: "/icons/mobile_place_48.png",
        clickable: true,
      });

      marker.addListener("click", () => onMarkerFixClick(marker, cp));
      marker.setMap(map);
      map.setCenter({ lat, lng });
    }
  }, [map]);

  const centerLat = cp.geoArgs ? cp.geoArgs[0]?.geometry.location.lat : 0;
  const centerLng = cp.geoArgs ? cp.geoArgs[0]?.geometry.location.lng : 0;
  const center = useMemo(() => ({ lat: centerLat, lng: centerLng }), []);

  return (
    <div className="relative space-y-4">
      <GoogleMap
        zoom={10}
        center={center}
        mapContainerClassName="map-container"
        mapContainerStyle={containerStyle}
        onLoad={(map) => {
          setMap(map);
        }}
      />
    </div>
  );
}
