import { Typography } from "@supabase/ui";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useMemo } from "react";

const _defaultGetDefaultTextGenerator = (path: string) => path;

// https://dev.to/dan_starner/building-dynamic-breadcrumbs-in-nextjs-17oa
export default function Breadcrumb({
  getDefaultTextGenerator = _defaultGetDefaultTextGenerator,
}) {
  const router = useRouter();

  // Call the function to generate the breadcrumbs list
  const breadcrumbs = useMemo(
    function generateBreadcrumbs() {
      // Remove any query parameters, as those aren't included in breadcrumbs
      const asPathWithoutQuery = router.asPath.split("?")[0];

      // Break down the path between "/"s, removing empty entities
      // Ex:"/my/nested/path" --> ["my", "nested", "path"]
      const asPathNestedRoutes = asPathWithoutQuery
        .split("/")
        .filter((v) => v.length > 0);

      // Iterate over the list of nested route parts and build
      // a "crumb" object for each one.
      const crumblist = asPathNestedRoutes.map((subpath, idx) => {
        // We can get the partial nested route for the crumb
        // by joining together the path parts up to this point.
        const href: string =
          "/" + asPathNestedRoutes.slice(0, idx + 1).join("/");
        // The title will just be the route string for now
        return { href, title: getDefaultTextGenerator(subpath) };
      });

      // Add in a default "Home" crumb for the top-level
      return [{ href: "/", text: "Home", title: "Homepage" }, ...crumblist];
    },
    [getDefaultTextGenerator, router.asPath]
  );

  return (
    <div className="container flex lg:flex-wrap justify-between items-center mx-auto w-full transform transition h-full my-6">
      <div className="flex" aria-label="Breadcrumb">
        {breadcrumbs.map((crumb, idx) => {
          return (
            <Crumb
              key={idx}
              last={idx === breadcrumbs.length - 1}
              title={crumb.title}
              href={crumb.href}
            />
          );
        })}
      </div>
    </div>
  );
}

// Each individual "crumb" in the breadcrumbs list
function Crumb({ href, last = false, title }: CrumbProps) {
  // The last crumb is rendered as normal text since we are already on the page
  if (last) {
    return (
      <div>
        <Typography color="text.primary"> {title}</Typography>
      </div>
    );
  }

  // All other crumbs will be rendered as links that can be visited
  return (
    <>
      <Link color="inherit" className="hover:text-beer-blonde" href={href}>
        {title}
      </Link>
      {" > "}
    </>
  );
}

// Props for the Crumb component
import { UrlObject } from "url";
type Url = string | UrlObject;

interface CrumbProps {
  title: string;
  href: Url;
  last?: boolean;
}