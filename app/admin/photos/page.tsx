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
  const [loading, setLoading] = useState(false);

  const loadPhotos = async () => {
    const res = await fetch("/api/photos");
    const data = await res.json();
    setPhotos(data);
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Selecciona una imagen");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("section", section);
    if (caption) formData.append("caption", caption);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      // Guardar en BD
      await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: data.url,
          section,
          caption,
        }),
      });
      alert("Imagen subida");
      setFile(null);
      setCaption("");
      loadPhotos();
    } else {
      alert("Error al subir");
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta foto?")) return;
    await fetch(`/api/photos/${id}`, { method: "DELETE" });
    loadPhotos();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Gestor de Fotos</h1>

        {/* Subir foto */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold mb-4">Subir nueva foto</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Sección</label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="border rounded-lg px-3 py-2 w-full md:w-1/2"
              >
                <option value="hero">Hero</option>
                <option value="gallery">Galería</option>
                <option value="testimonios">Testimonios</option>
                <option value="equipo">Equipo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Imagen</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="border rounded-lg px-3 py-2 w-full"
              />
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

        {/* Lista de fotos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="relative h-48 w-full">
                <Image src={photo.url} alt={photo.caption || "Foto"} fill className="object-cover" />
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
          <p className="text-gray-500 text-center py-12">No hay fotos subidas</p>
        )}
      </div>
    </div>
  );
}