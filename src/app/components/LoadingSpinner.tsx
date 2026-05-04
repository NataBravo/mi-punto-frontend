import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  label?: string;
}

export function LoadingSpinner({ label }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 text-gray-600">
      <Loader2 className="w-6 h-6 animate-spin" />
      {label && <p className="text-sm">{label}</p>}
    </div>
  );
}
