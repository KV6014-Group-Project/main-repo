import React from "react";
import { Text, View, TouchableOpacity, Modal, ScrollView, Platform } from "react-native";
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
  const [showDetails, setShowDetails] = React.useState(false);
  const [diagnosticInfo, setDiagnosticInfo] = React.useState<string>("");
  const [errorDetails, setErrorDetails] = React.useState<string>("");

  const runCheck = React.useCallback(async () => {
    try {
      const ok = await checkServerConnection();
      setStatus(ok ? "online" : "offline");
      setErrorDetails("");
    } catch (error) {
      setStatus("offline");
      setErrorDetails(error instanceof Error ? error.message : String(error));
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

  const getDiagnosticInfo = () => {
    const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:8000/api";
    const info = [
      `API URL: ${apiUrl}`,
      `Status: ${status}`,
      `Last checked: ${lastChecked ? lastChecked.toLocaleTimeString() : "Never"}`,
      `Current time: ${new Date().toLocaleTimeString()}`,
      `Platform: ${Platform.OS}`,
      `Network: ${navigator.onLine ? "Online" : "Offline"}`,
    ];
    
    if (errorDetails) {
      info.push(`Error: ${errorDetails}`);
    }
    
    return info.join("\n");
  };

  const handlePress = async () => {
    setDiagnosticInfo(getDiagnosticInfo());
    setShowDetails(true);
  };

  const meta = statusMeta[status];

  return (
    <>
      <TouchableOpacity
        onPress={handlePress}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex-row items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 shadow-lg border border-black/5 active:scale-95"
        accessibilityLabel={`Server status: ${meta.label}${lastChecked ? ` as of ${lastChecked.toLocaleTimeString()}` : ""}. Tap for details`}
      >
        <View className={`h-2.5 w-2.5 rounded-full ${meta.dotClass}`} />
        <Text className={`text-xs font-semibold ${meta.textClass}`}>{meta.label}</Text>
      </TouchableOpacity>

      <Modal
        visible={showDetails}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDetails(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-center items-center"
          onPress={() => setShowDetails(false)}
          activeOpacity={1}
        >
          <View className="bg-white rounded-2xl p-6 mx-4 max-w-md w-full">
            <Text className="text-lg font-bold mb-4">Server Connection Details</Text>
            <ScrollView className="max-h-96">
              <Text className="text-sm font-mono text-gray-700 whitespace-pre-wrap">
                {diagnosticInfo}
              </Text>
            </ScrollView>
            <TouchableOpacity
              className="mt-4 bg-neutral-800 rounded-xl py-3 items-center"
              onPress={() => setShowDetails(false)}
            >
              <Text className="text-white font-semibold">Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
