import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({
  title = "Sin resultados",
  message = "No hay datos para mostrar.",
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-12 h-12 mb-4 text-gray-400">
        {icon ?? <Inbox className="w-12 h-12" />}
      </div>
      <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600 mt-1">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
