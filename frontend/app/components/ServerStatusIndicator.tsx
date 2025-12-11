import React from "react";
import { Text, View } from "react-native";
import { checkServerConnection } from "../../lib/api";

const POLL_INTERVAL_MS = 15000;

type Status = "checking" | "online" | "offline";

const statusMeta: Record<Status, { label: string; dotClass: string; textClass: string }> = {
  checking: {
    label: "Checking server…",
    dotClass: "bg-amber-400",
    textClass: "text-amber-700",
  },
  online: {
    label: "Server online",
    dotClass: "bg-emerald-500",
    textClass: "text-emerald-700",
  },
  offline: {
    label: "Server offline",
    dotClass: "bg-rose-500",
    textClass: "text-rose-700",
  },
};

export default function ServerStatusIndicator() {
  const [status, setStatus] = React.useState<Status>("checking");
  const [lastChecked, setLastChecked] = React.useState<Date | null>(null);

  const runCheck = React.useCallback(async () => {
    try {
      const ok = await checkServerConnection();
      setStatus(ok ? "online" : "offline");
    } catch (error) {
      setStatus("offline");
    } finally {
      setLastChecked(new Date());
    }
  }, []);

  React.useEffect(() => {
    let isMounted = true;

    const wrappedCheck = async () => {
      if (!isMounted) return;
      setStatus((prev) => (prev === "checking" ? prev : "checking"));
      await runCheck();
    };

    wrappedCheck();
    const intervalId = setInterval(wrappedCheck, POLL_INTERVAL_MS);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [runCheck]);

  const meta = statusMeta[status];

  return (
    <View
      className="absolute bottom-4 left-1/2 -translate-x-1/2 flex-row items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 shadow-lg border border-black/5"
      accessibilityLabel={`Server status: ${meta.label}${lastChecked ? ` as of ${lastChecked.toLocaleTimeString()}` : ""}`}
    >
      <View className={`h-2.5 w-2.5 rounded-full ${meta.dotClass}`} />
      <Text className={`text-xs font-semibold ${meta.textClass}`}>{meta.label}</Text>
    </View>
  );
}
