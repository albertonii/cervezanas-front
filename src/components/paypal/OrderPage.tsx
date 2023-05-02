import paypal from "@paypal/checkout-server-sdk";

/*
const payPalClient = new paypal.core.PayPalHttpClient({
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "",
  clientSecret: process.env.NEXT_PUBLIC_PAYPAL_APP_SECRET ?? "",
  webUrl: process.env.NEXT_PUBLIC_PAYPAL_WEBURL ?? "",
  authorizationString:
    process.env.NEXT_PUBLIC_PAYPAL_AUTHORIZATION_STRING ?? "",
});
*/

export default function OrderPage() {
  const createOrder = async () => {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: "100.00",
          },
        },
      ],
    });
    /*
    const response = await payPalClient.execute(request);
    const order = response.result;
    console.log(order);
    */
    // Aquí debes redirigir al usuario a la página de confirmación de pago de PayPal
    // Puedes utilizar la propiedad order.links.find(link => link.rel === 'approve') para obtener el enlace para redirigir al usuario
  };

  return (
    <div>
      <button onClick={createOrder}>Crear orden de pedido</button>
    </div>
  );
}
