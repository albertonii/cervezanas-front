import _ from "lodash";

export function isValidObject(object: any) {
  return (
    !_.isNull(object) &&
    !_.isUndefined(object) &&
    object !== "" &&
    !_.isEmpty(object)
  );
}

export function isNotEmptyArray(array: any[]) {
  return !_.isEmpty(array);
}

export function encodeBase64(string: string) {
  return Buffer.from(string).toString("base64");
}

export function hmacSha256(key: string, data: string) {
  const crypto = require("crypto");
  return crypto.createHmac("sha256", key).update(data).digest("hex");
}
