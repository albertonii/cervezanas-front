import { NextRequest } from "next/server";

const locales = ["en", "es"];

const privateSections = [
  "consumer",
  "distributor",
  "producer",
  "admin",
  "profile",
  "cart",
  "checkout",
  "barman",
];

export async function redirectIfNoLocale(req: NextRequest) {
  const { nextUrl } = req;
  const url = nextUrl.clone();
  const pathname = url.pathname;
  const locale = pathname.split("/")[1];
  const pathnameIsMissingLocale = !locales.includes(locale);

  return pathnameIsMissingLocale;
}

export async function isPrivateSectionIncluded(req: NextRequest) {
  const { nextUrl } = req;

  const url = nextUrl.clone();

  const pathname = url.pathname;

  const urlSection = pathname.split("/")[2];

  return privateSections.includes(urlSection);
}
