import { useEffect, useRef } from "react";

type UsePollingOptions = {
  intervalMs: number;
  callback: () => Promise<void>;
  shouldContinue: () => boolean;
};

export function usePolling({ intervalMs, callback, shouldContinue }: UsePollingOptions) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const runPolling = async () => {
      await callback();
      intervalRef.current = setInterval(async () => {
        if (!shouldContinue()) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
        } else {
          await callback();
        }
      }, intervalMs);
    };

    runPolling();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);
}
