import { Image as ImageIcon, Loader2, Star, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/app/components/EmptyState";
import { ErrorState } from "@/app/components/ErrorState";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import { useMyBusiness } from "@/modules/businesses/hooks";
import {
  useDeleteMedia,
  useMyBusinessMedia,
  useSetPrimaryMedia,
  useUploadMyBusinessImage,
} from "@/modules/uploads/hooks";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = "image/jpeg,image/png,image/webp";

export default function GalleryManagement() {
  const myBusiness = useMyBusiness();
  const mediaQuery = useMyBusinessMedia();
  const upload = useUploadMyBusinessImage();
  const setPrimary = useSetPrimaryMedia();
  const deleteMedia = useDeleteMedia();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  if (myBusiness.isLoading || mediaQuery.isLoading) {
    return (
      <div className="py-20">
        <LoadingSpinner label="Cargando galería…" />
      </div>
    );
  }
  if (mediaQuery.isError) {
    return <ErrorState title="No pudimos cargar la galería" onRetry={() => mediaQuery.refetch()} />;
  }
  if (!myBusiness.data) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <ImageIcon className="w-10 h-10 text-blue-600 mx-auto mb-3" />
        <h2 className="font-semibold text-lg">Aún no tienes un negocio</h2>
        <p className="text-gray-600 mt-1">
          Crea primero el perfil de tu negocio en "Editar perfil".
        </p>
      </div>
    );
  }

  const media = mediaQuery.data ?? [];
  const primary = media.find((m) => m.is_primary) ?? media[0] ?? null;

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (!ACCEPTED.split(",").includes(file.type)) {
          toast.error(`Formato no permitido: ${file.name}`);
          continue;
        }
        if (file.size > MAX_BYTES) {
          toast.error(`${file.name} excede 5 MiB`);
          continue;
        }
        try {
          await upload.mutateAsync(file);
        } catch (err) {
          const message = err instanceof Error ? err.message : `Error subiendo ${file.name}`;
          toast.error(message);
        }
      }
      toast.success("Imágenes cargadas");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSetPrimary = async (id: number) => {
    try {
      await setPrimary.mutateAsync(id);
      toast.success("Imagen principal actualizada");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error";
      toast.error(message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMedia.mutateAsync(id);
      toast.success("Imagen eliminada");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error";
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Galería multimedia</h1>
        <p className="text-gray-600">
          Sube fotos de tu negocio (JPG, PNG o WebP — hasta 5 MiB cada una). La imagen marcada como principal se muestra como portada.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-lg">Imagen principal</h2>
        {primary ? (
          <div className="aspect-video w-full max-w-2xl rounded-lg overflow-hidden bg-gray-100">
            <img src={primary.url} alt="principal" className="w-full h-full object-cover" />
          </div>
        ) : (
          <p className="text-sm text-gray-500">Aún no hay imagen principal.</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Galería ({media.length})</h2>
          <label
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 cursor-pointer flex items-center gap-2"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Subir imagen
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED}
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
              disabled={uploading}
            />
          </label>
        </div>

        {media.length === 0 ? (
          <EmptyState
            title="Sin imágenes todavía"
            message="Sube la primera para que tu negocio luzca mejor."
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {media.map((m) => (
              <div
                key={m.id}
                className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
              >
                <div className="aspect-video">
                  <img src={m.url} alt="media" className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  {!m.is_primary && (
                    <button
                      onClick={() => handleSetPrimary(m.id)}
                      disabled={setPrimary.isPending}
                      title="Marcar como principal"
                      className="bg-white text-gray-900 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-yellow-100 flex items-center gap-1 disabled:opacity-60"
                    >
                      <Star className="w-4 h-4" />
                      Principal
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(m.id)}
                    disabled={deleteMedia.isPending}
                    title="Eliminar"
                    className="bg-white text-red-600 p-1.5 rounded-md hover:bg-red-50 disabled:opacity-60"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {m.is_primary && (
                  <span className="absolute top-2 left-2 inline-flex items-center gap-1 bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-1 rounded">
                    <Star className="w-3 h-3 fill-current" />
                    Principal
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
