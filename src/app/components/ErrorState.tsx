import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Algo salió mal",
  message = "No pudimos cargar la información.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
      <AlertTriangle className="w-10 h-10 text-red-500 mb-3" />
      <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600 mt-1">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
