import { Clock, ExternalLink, Facebook, Instagram, Mail, MapPin, MessageSquare, Navigation, Phone, Star } from "lucide-react";
import { Link, useParams } from "react-router";

import { EmptyState } from "@/app/components/EmptyState";
import { ErrorState } from "@/app/components/ErrorState";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import { MapReadOnly } from "@/app/components/Map";
import { StarRating } from "@/app/components/StarRating";
import { buildGoogleMapsUrl } from "@/lib/geo";
import { usePublicBusinessDetail } from "@/modules/businesses/hooks";
import { useBusinessReviews } from "@/modules/reviews/hooks";

export default function BusinessProfile() {
  const { id } = useParams();
  const businessId = id ? Number(id) : undefined;
  const detail = usePublicBusinessDetail(businessId);
  const reviewsQuery = useBusinessReviews(businessId);

  if (detail.isLoading || businessId === undefined) {
    return (
      <div className="py-20">
        <LoadingSpinner label="Cargando negocio…" />
      </div>
    );
  }

  if (detail.isError || !detail.data) {
    return (
      <ErrorState
        title="No pudimos cargar el negocio"
        message="Es posible que el negocio esté inactivo o no exista."
        onRetry={() => detail.refetch()}
      />
    );
  }

  const b = detail.data;
  const cover = b.cover_url ?? (b.media[0]?.url ?? null);
  const galleryRest = b.media.slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="relative aspect-[16/6] bg-gradient-to-br from-blue-100 to-blue-200">
          {cover && <img src={cover} alt={b.name} className="w-full h-full object-cover" />}
          {b.logo_url && (
            <div className="absolute -bottom-8 left-6 w-20 h-20 rounded-xl bg-white shadow-md border border-white overflow-hidden">
              <img
                src={b.logo_url}
                alt={`Logo ${b.name}`}
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>

        <div className={`p-6 ${b.logo_url ? "pt-12" : ""}`}>
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">{b.name}</h1>
              <p className="text-gray-600">
                {b.category.name} · {b.city}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-lg">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">
                {b.review_count > 0 ? b.average_rating.toFixed(1) : "—"}
              </span>
              <span className="text-sm text-gray-500">({b.review_count} reseñas)</span>
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed">{b.description || "Sin descripción."}</p>

          <Link
            to={`/user/business/${b.id}/review`}
            className="inline-flex items-center gap-2 mt-5 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700"
          >
            <MessageSquare className="w-4 h-4" />
            Publicar reseña
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {galleryRest.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="font-semibold text-lg mb-4">Galería</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {galleryRest.map((m) => (
                  <div
                    key={m.id}
                    className="aspect-square rounded-lg overflow-hidden bg-gray-100"
                  >
                    <img src={m.url} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {b.lat !== null && b.lng !== null && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h2 className="font-semibold text-lg">Ubicación</h2>
                <a
                  href={buildGoogleMapsUrl(b.lat, b.lng)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
                >
                  <Navigation className="w-4 h-4" />
                  Cómo llegar
                </a>
              </div>
              <MapReadOnly
                center={[b.lat, b.lng]}
                zoom={16}
                height="320px"
                markers={[
                  {
                    id: b.id,
                    lat: b.lat,
                    lng: b.lng,
                    popup: <strong>{b.name}</strong>,
                  },
                ]}
              />
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Reseñas ({b.review_count})</h2>
              <Link
                to={`/user/business/${b.id}/review`}
                className="text-sm text-blue-600 hover:underline"
              >
                Publicar la mía
              </Link>
            </div>

            {reviewsQuery.isLoading ? (
              <LoadingSpinner />
            ) : reviewsQuery.isError ? (
              <ErrorState title="No pudimos cargar las reseñas" onRetry={() => reviewsQuery.refetch()} />
            ) : (reviewsQuery.data?.length ?? 0) === 0 ? (
              <EmptyState
                title="Sé el primero"
                message="Aún nadie publicó una reseña para este negocio."
              />
            ) : (
              <div className="space-y-5">
                {reviewsQuery.data?.map((r) => (
                  <div key={r.id} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{r.user_full_name}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(r.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <StarRating rating={r.rating} readonly size="sm" />
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{r.comment}</p>
                    {r.response && (
                      <div className="mt-3 ml-4 border-l-4 border-blue-200 pl-3 bg-blue-50 py-2 rounded-r-md">
                        <p className="text-xs font-medium text-blue-900 mb-0.5">Respuesta del negocio</p>
                        <p className="text-sm text-blue-900">{r.response.body}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 h-fit space-y-4">
          <h2 className="font-semibold text-lg">Información de contacto</h2>

          <InfoRow icon={<MapPin className="w-5 h-5 text-gray-500" />} label="Dirección">
            {b.address || "—"}, {b.city}
            {b.lat !== null && b.lng !== null && (
              <>
                {" · "}
                <a
                  href={buildGoogleMapsUrl(b.lat, b.lng)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline whitespace-nowrap"
                >
                  Abrir en Google Maps
                  <ExternalLink className="inline w-3.5 h-3.5 ml-0.5 -mt-0.5" />
                </a>
              </>
            )}
          </InfoRow>

          {b.phone && (
            <InfoRow icon={<Phone className="w-5 h-5 text-gray-500" />} label="Teléfono">
              {b.phone}
            </InfoRow>
          )}

          {b.email && (
            <InfoRow icon={<Mail className="w-5 h-5 text-gray-500" />} label="Email">
              {b.email}
            </InfoRow>
          )}

          {b.hours && (
            <InfoRow icon={<Clock className="w-5 h-5 text-gray-500" />} label="Horario">
              {b.hours}
            </InfoRow>
          )}

          {(b.instagram_url || b.facebook_url) && (
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Redes sociales
              </p>
              <div className="flex items-center gap-2">
                {b.instagram_url && (
                  <a
                    href={b.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    title="Instagram"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {b.facebook_url && (
                  <a
                    href={b.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    title="Facebook"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-gray-900 break-words">{children}</p>
      </div>
    </div>
  );
}
