"use client";

import { useEffect, useState } from "react";

export default function ZonesPage() {
  const [zones, setZones] = useState<any[]>([]);
  const [name, setName] = useState("");

  const loadZones = async () => {
    const res = await fetch("/api/zones");
    const data = await res.json();
    setZones(data);
  };

  useEffect(() => {
    loadZones();
  }, []);

  const createZone = async () => {
    if (!name.trim()) return;

    await fetch("/api/zones", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
      }),
    });

    setName("");
    loadZones();
  };

  const deleteZone = async (id: number) => {
    if (!confirm("Delete zone?")) return;

    await fetch(`/api/zones/${id}`, {
      method: "DELETE",
    });

    loadZones();
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Zones
      </h1>

      <div className="flex gap-4 mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Zone name"
          className="border px-4 py-2 rounded"
        />

        <button
          onClick={createZone}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Zone
        </button>
      </div>

      <div className="space-y-3">
        {zones.map((zone) => (
          <div
            key={zone.id}
            className="border rounded p-4 flex justify-between"
          >
            <span>{zone.name}</span>

            <button
              onClick={() => deleteZone(zone.id)}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}