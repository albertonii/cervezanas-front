import createServerClient from "../../../utils/supabaseServer";
import { NextRequest, NextResponse } from "next/server";
import { isResponseCodeOk, ResponseJSONSuccess } from "redsys-easy";
import { ONLINE_ORDER_STATUS } from "../../../constants";
import { processRestNotification } from "../../[locale]/components/TPV/redsysClient";

export async function POST(req: NextRequest) {
  console.log("req", req);
  const data = await req.formData();
  const signatureVersion = data.get("Ds_SignatureVersion");
  const merchantParameters = data.get("Ds_MerchantParameters");
  const signature = data.get("Ds_Signature");

  const body: ResponseJSONSuccess = {
    Ds_Signature: signature as string,
    Ds_SignatureVersion: signatureVersion as string,
    Ds_MerchantParameters: merchantParameters as string,
  };
  console.log("hasta aqui");

  // const body: ResponseJSONSuccess = {
  //   Ds_SignatureVersion: "HMAC_SHA256_V1",
  //   Ds_MerchantParameters:
  //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJEU19NRVJDSEFOVF9BTU9VTlQiOiIxNDUiLCJEU19NRVJDSEFOVF9DVVJSRU5DWSI6Ijk3OCIsIkRTX01FUkNIQU5UX0NWVjIiOiIxMjMiLCJEU19NRVJDSEFOVF9FWFBJUllEQVRFIjoiMTUxMiIsIkRTX01FUkNIQU5UX01FUkNIQU5UQ09ERSI6Ijk5OTAwODg4MSIsIkRTX01FUkNIQU5UX09SREVSIjoiMTQ0NjA2ODU4MSIsIkRTX01FUkNIQU5UX1BBTiI6IjQ1NDg4MSoqKioqKioqMDQiLCJEU19NRVJDSEFOVF9URVJNSU5BTCI6IjEiLCJEU19NRVJDSEFOVF9UUkFOU0FDVElPTlRZUEUiOiIwIn0.0adAyRjZ9lH26EpKXOiyF4uyRbx6TB_HVBdCckiVRoI",
  //   Ds_Signature: "sq7HjrUOBfKmC576ILgskD5srU870gJ7",
  // };

  /* Decodificar el parámetro Ds_MerchantParameters en base 64. Sin usar buffer */
  // const decodeMerchantParameters = Buffer.from(
  //   body.Ds_MerchantParameters as string,
  //   "base64"
  // ).toString("utf-8");

  /* Una vez se ha realizado la llamada a la función
    “decodeMerchantParameters()”, se puede obtener el valor de
    cualquier parámetro que sea susceptible de incluirse en la
    notificación on-line.
    Vamos a obtener el código de respuesta
  */
  // const responseMerchantParametersJSON = JSON.parse(decodeMerchantParameters);
  // const { DS_RESPONSE } = responseMerchantParametersJSON;

  const restNotification = processRestNotification(body);

  /**
   * Tabla Ds_Response CODE
   * https://pagosonline.redsys.es/codigosRespuesta.html#codigo-dsresponse
   * 0000 a 0099 -Transacción autorizada para pagos y preautorizaciones
   * 0900 Transacción autorizada para devoluciones y confirmaciones
   * 0400 Transacción autorizada para anulaciones
   * 0101 Tarjeta caducada
   * 0102 Tarjeta en excepción transitoria o bajo sospecha de fraude
   * 0106 Intentos de PIN excedidos
   * 0125 Tarjeta no efectiva
   * 0129 Código de seguridad (CVV2/CVC2) incorrecto
   * 172 Denegada, no repetir
   */
  const responseCode = restNotification.Ds_Response;

  const orderId = restNotification.Ds_Order;

  const supabase = await createServerClient();

  if (isResponseCodeOk(responseCode)) {
    console.info(`Payment for order ${orderId} succeded`);

    // Update order status
    const { error } = await supabase
      .from("orders")
      .update({ status: ONLINE_ORDER_STATUS.PAID })
      .eq("order_number", orderId);
    if (error) console.error(error);
    return NextResponse.json({
      message: `Order number ${orderId} updated successfully`,
    });

    // Send notification to producer associated

    // Send notification to distributor associated
  } else {
    console.info(`Payment for order ${orderId} failed`);

    // Update order status
    const { error } = await supabase
      .from("orders")
      .update({ status: ONLINE_ORDER_STATUS.ERROR })
      .eq("order_number", orderId);
    if (error) console.error(error);

    return NextResponse.json({
      message: `Order number ${orderId} failed with error`,
    });
  }
}
