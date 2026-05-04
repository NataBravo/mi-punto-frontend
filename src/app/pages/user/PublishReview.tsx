import { ArrowLeft, Loader2, Send } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import { ErrorState } from "@/app/components/ErrorState";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import { StarRating } from "@/app/components/StarRating";
import { ApiError } from "@/lib/api";
import { useCurrentUser } from "@/modules/auth/hooks";
import { usePublicBusinessDetail } from "@/modules/businesses/hooks";
import { useBusinessReviews, usePublishReview } from "@/modules/reviews/hooks";

const MAX_COMMENT = 500;

export default function PublishReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const businessId = id ? Number(id) : undefined;

  const detail = usePublicBusinessDetail(businessId);
  const reviews = useBusinessReviews(businessId);
  const publish = usePublishReview(businessId ?? 0);
  const { user } = useCurrentUser();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  if (detail.isLoading || reviews.isLoading || businessId === undefined) {
    return (
      <div className="py-20">
        <LoadingSpinner label="Cargando…" />
      </div>
    );
  }

  if (detail.isError || !detail.data) {
    return (
      <ErrorState title="No pudimos cargar el negocio" onRetry={() => detail.refetch()} />
    );
  }

  const business = detail.data;
  const alreadyReviewed = !!user && (reviews.data ?? []).some((r) => r.user_id === user.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) {
      toast.error("Selecciona una calificación");
      return;
    }
    if (comment.trim().length < 2) {
      toast.error("Escribe un comentario");
      return;
    }
    try {
      await publish.mutateAsync({ rating, comment: comment.trim() });
      toast.success("¡Reseña publicada!");
      navigate(`/user/business/${business.id}`);
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        toast.error("Ya publicaste una reseña para este negocio");
      } else {
        const msg = error instanceof Error ? error.message : "No pudimos publicar la reseña";
        toast.error(msg);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => navigate(`/user/business/${business.id}`)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver al perfil
      </button>

      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <div>
          <p className="text-sm text-gray-500">Vas a reseñar</p>
          <h1 className="text-2xl font-bold text-gray-900">{business.name}</h1>
          <p className="text-gray-600 text-sm">
            {business.category.name} · {business.city}
          </p>
        </div>
      </div>

      {alreadyReviewed ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-900 font-medium mb-2">Ya publicaste una reseña aquí</p>
          <p className="text-sm text-yellow-700 mb-4">
            Solo puedes publicar una reseña por negocio.
          </p>
          <button
            onClick={() => navigate(`/user/business/${business.id}`)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700"
          >
            Volver al perfil
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tu calificación <span className="text-red-600">*</span>
            </label>
            <StarRating rating={rating} onRate={setRating} size="lg" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Tu comentario <span className="text-red-600">*</span>
              </label>
              <span
                className={`text-xs ${
                  comment.length > MAX_COMMENT ? "text-red-600" : "text-gray-500"
                }`}
              >
                {comment.length}/{MAX_COMMENT}
              </span>
            </div>
            <textarea
              rows={5}
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, MAX_COMMENT))}
              placeholder="Comparte tu experiencia con este negocio…"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={publish.isPending}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {publish.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Publicar reseña
          </button>
        </form>
      )}
    </div>
  );
}
