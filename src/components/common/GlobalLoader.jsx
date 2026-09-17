import { useLoader } from "../../context/LoaderContext";
import { ClockIcon } from "@heroicons/react/24/outline";

export default function GlobalLoader() {
  const { loading } = useLoader();

  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/70 dark:bg-black/60 z-50">
      <div className="flex flex-col items-center gap-3 animate-pulse">
        <ClockIcon className="w-12 h-12 text-green-700 animate-spin" />
        <p className="text-lg font-semibold text-gray-800 dark:text-white">Loading... Please wait</p>
      </div>
    </div>
  );
}
