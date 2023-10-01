import { useEffect } from "react";

export function useOutsideClick(close, ref) {
  useEffect(
    function () {
      function handleClick(e) {
        if (ref.current && !ref.current.contains(e.target)) close();
      }
      document.addEventListener("click", handleClick, true);

      return () => document.removeEventListener("click", handleClick, true);
    },
    [close, ref]
  );
}
