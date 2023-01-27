import { useEffect } from "react";

export const useOutsideClick = (
  callback: (T?: any) => void,
  ref: React.RefObject<HTMLDivElement>
) => {
  const handleClick = (e: Event) => {
    if (ref.current && !ref.current.contains(<HTMLElement>e.target)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  });
};
