import _ from "lodash";
import { uuid } from "uuidv4";

export function isValidObject(object: any) {
  return object != null && object !== "" && !_.isEmpty(object);
}

export function isNotEmptyArray(array: any[]) {
  return !_.isEmpty(array);
}

export function encodeBase64(string: string) {
  return Buffer.from(string).toString("base64");
}

export function decodeBase64(string: string) {
  return Buffer.from(string, "base64").toString();
}

export function generateDownloadableLink(blob: any, filename: string) {
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${decodeURIComponent(filename)}`);

  // Append to html link element page
  document.body.appendChild(link);

  // Start download
  link.click();

  // Clean up and remove the link
  link.parentNode?.removeChild(link);
}

export function generateFileName(fName: string) {
  const fileExt = fName.split(".").pop();
  const fileName = `${uuid()}.${fileExt}`;
  const encodedFileName = encodeURIComponent(fileName);
  return encodedFileName;
}
