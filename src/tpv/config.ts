import * as crypto from "crypto";

export function config() {}

export function encrypt3DES(key: any, data: any) {
  // const iv = cryptojs.enc.Hex.parse("0000000000000000");
  // const cipher = cryptojs.TripleDES.encrypt(data, key, {
  //     iv: iv,
  //     mode: cryptojs.mode.CBC,
  //     padding: cryptojs.pad.ZeroPadding
  // });
  key = key.substr(0, 32);
  const cipher = crypto.createCipheriv(
    "des-ede3",
    Buffer.from(key, "base64"),
    ""
  );
  cipher.setAutoPadding(false);

  let crypted = cipher.update(data, "utf8", "hex");
  crypted += cipher.final("hex");
  return crypted;
}

export function decrypt3DES(key: any, data: any) {
  const decipher = crypto.createDecipheriv("des-ede3", key, "");
  let decrypted = decipher.update(data, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
