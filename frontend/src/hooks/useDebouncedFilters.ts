import { useEffect, useState } from "react";

export function useDebouncedFilters<T extends object>(
  inputFilters: T,
  delay: number = 500
): [T, React.Dispatch<React.SetStateAction<T>>, T] {
  const [rawFilters, setRawFilters] = useState(inputFilters);
  const [debouncedFilters, setDebouncedFilters] = useState(inputFilters);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(rawFilters);
    }, delay);

    return () => clearTimeout(handler);
  }, [rawFilters, delay]);

  return [debouncedFilters, setRawFilters, rawFilters];
}
