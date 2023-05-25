import React, { useState } from "react";
import QRCode from "react-qr-code";

export default function GenerateQR() {
  const [qrCodeValue, setQrCodeValue] = useState("");

  return (
    <div className="">
      <div className="">Generate QR</div>

      {qrCodeValue != "" && <QRCode value={qrCodeValue} className="" />}
      <input
        className=""
        onChange={(e) => {
          setQrCodeValue(e.target.value);
        }}
      />
    </div>
  );
}
