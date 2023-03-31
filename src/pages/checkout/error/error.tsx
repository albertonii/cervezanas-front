import { NextApiRequest, NextApiResponse } from "next";
import React from "react";
import { ResponseJSONSuccess } from "redsys-easy";

export default function error() {
  return <div>error</div>;
}

export async function getServerSideProps(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const notificationParams: ResponseJSONSuccess = {
    Ds_SignatureVersion: req.query["Ds_SignatureVersion"] as string,
    Ds_Signature: req.query["Ds_Signature"] as string,
    Ds_MerchantParameters: req.query["Ds_MerchantParameters"] as string,
  };

  // Always validate a notification
  //   const { Ds_Order: orderId } = processRestNotification(notificationParams);

  //   res.status = 200;
  //   res.type = "text/plain; charset=utf-8";
  //   res.body = `Payment for order ${orderId} failed`;

  return {
    props: {
      response: res,
    },
  };
}
