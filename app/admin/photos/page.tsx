//app/admin/photos/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Photo = {
  id: number;
  url: string;
  section: string;
  order: number;
  caption: string | null;
};

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [section, setSection] = useState("hero");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const loadPhotos = async () => {
    try {
      const res = await fetch("/api/photos");
      const data = await res.json();
      setPhotos(data);
    } catch (err) {
      console.error("Error loading photos:", err);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }, [file]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!file) {
      alert("Selecciona un archivo");
      return;
    }

    // Mostrar tamaño para depuración
    console.log(`Subiendo archivo de ${(file.size / (1024 * 1024)).toFixed(2)} MB`);

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("section", section);
      if (caption) formData.append("caption", caption);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      // Si la respuesta no es JSON, puede ser HTML de error (por ejemplo, 413)
      const contentType = uploadRes.headers.get("content-type") || "";
      let errorMessage = "Error desconocido";

      if (!uploadRes.ok) {
        if (uploadRes.status === 413) {
          setErrorMsg("El archivo es demasiado grande. El límite máximo es 100MB. Contacta al administrador.");
          setLoading(false);
          return;
        }

        try {
          const errorData = await uploadRes.json();
          errorMessage = errorData.error || "Error al subir el archivo";
        } catch (parseError) {
          // Si no es JSON, intentamos leer el texto
          const text = await uploadRes.text();
          errorMessage = `Error ${uploadRes.status}: ${text.substring(0, 100)}`;
        }
        setErrorMsg(errorMessage);
        setLoading(false);
        return;
      }

      const data = await uploadRes.json();

      // Guardar en BD
      const saveRes = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: data.url,
          section,
          caption,
        }),
      });

      if (!saveRes.ok) {
        const saveError = await saveRes.json();
        setErrorMsg(saveError.error || "Error al guardar en la base de datos");
        setLoading(false);
        return;
      }

      alert("✅ Archivo subido correctamente");
      setFile(null);
      setPreview(null);
      setCaption("");
      loadPhotos();
    } catch (error) {
      console.error("Error:", error);
      setErrorMsg("Error inesperado al subir");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este archivo?")) return;
    await fetch(`/api/photos/${id}`, { method: "DELETE" });
    loadPhotos();
  };

  const isVideo = file?.type.startsWith("video/");

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Gestor de Multimedia</h1>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold mb-4">Subir nuevo archivo</h2>
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {errorMsg}
            </div>
          )}
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Sección</label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="border rounded-lg px-3 py-2 w-full md:w-1/2"
              >
                <option value="hero">Hero (video)</option>
                <option value="experience-video">Experience Video</option>
                <option value="experience-icons">Experience Icons</option>
                <option value="popular-transfers">Popular Transfers</option>
                <option value="testimonials-avatars">Testimonials Avatars</option>
                <option value="gallery">Galería</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Archivo (imagen o video)
              </label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="border rounded-lg px-3 py-2 w-full"
              />
              {preview && (
                <div className="mt-2">
                  {isVideo ? (
                    <video src={preview} controls className="max-h-48 rounded" />
                  ) : (
                    <Image src={preview} alt="preview" width={200} height={150} className="object-cover rounded" />
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Pie de foto (opcional)</label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="border rounded-lg px-3 py-2 w-full md:w-1/2"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !file}
              className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50"
            >
              {loading ? "Subiendo..." : "Subir"}
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="relative h-48 w-full bg-gray-100">
                {photo.url.match(/\.(mp4|webm|mov)$/) ? (
                  <video src={photo.url} controls className="w-full h-full object-cover" />
                ) : (
                  <Image src={photo.url} alt={photo.caption || "Foto"} fill className="object-cover" />
                )}
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600">Sección: <span className="font-medium">{photo.section}</span></p>
                {photo.caption && <p className="text-sm text-gray-600">Caption: {photo.caption}</p>}
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
        {photos.length === 0 && (
          <p className="text-gray-500 text-center py-12">No hay archivos subidos</p>
        )}
      </div>
    </div>
  );
}