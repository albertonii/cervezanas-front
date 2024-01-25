import { useEffect } from "react";

export default function useExternalScripts({ url }: { url: string }) {
  useEffect(() => {
    const head = document.querySelector("head") as HTMLHeadElement;
    const script = document.createElement("script");

    script.setAttribute("src", url);
    head.appendChild(script);

    return () => {
      head.removeChild(script);
    };
  }, [url]);
}
