import * as crypto from "crypto";
import * as CryptoJS from "crypto-js";

export function config() {}

export function encrypt3DES(key: any, data: any) {
  const crypted = CryptoJS.TripleDES.encrypt(data, key, {
    iv: CryptoJS.enc.Hex.parse("0000000000000000"),
    mode: CryptoJS.mode.ECB,
  });

  return crypted.toString();

  // const iv = cryptojs.enc.Hex.parse("0000000000000000");
  // const cipher = cryptojs.TripleDES.encrypt(data, key, {
  //     iv: iv,
  //     mode: cryptojs.mode.CBC,
  //     padding: cryptojs.pad.ZeroPadding
  // });
  // key = key.substr(0, 32);
  // const cipher = crypto.createCipheriv(
  //   "des-ede3",
  //   Buffer.from(key, "base64"),
  //   ""
  // );
  // // cipher.setAutoPadding(false);
  // let crypted = cipher.update(data, "utf8", "hex");
  // crypted += cipher.final("hex");
  // return crypted;
}

export function decrypt3DES(key: any, data: any) {
  /*
  const decipher = crypto.createDecipheriv("des-ede3", key, "");
  let decrypted = decipher.update(data, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
  */
}

export function hmacSha256(key: string, data: string) {
  console.log(data);
  // const crypto = require("crypto");
  // return crypto.createHmac("sha256", key).update(data).digest("hex");
  // return crypto.createHmac("sha256", key).update(data).digest("base64");
  const signature = CryptoJS.HmacSHA256(data, key);
  console.log(signature);

  const base64 = signature.toString(CryptoJS.enc.Hex);
  console.log(base64);
  return base64;
}
