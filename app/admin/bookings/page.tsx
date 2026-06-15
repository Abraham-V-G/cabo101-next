//app/admin/bookings/page.tsx

"use client";

import { useEffect, useState, useMemo } from "react";
import { format, isToday, isTomorrow, isThisWeek, parseISO } from "date-fns";
import { es } from "date-fns/locale";

interface Booking {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pickupLocation: string;
  dropoffLocation: string;
  passengers: number;
  vehicleType: string;
  pickupDate: string;
  pickupTime: string;
  roundTrip: boolean;
  returnPickupLocation?: string;
  returnDropoffLocation?: string;
  returnPickupDate?: string;
  returnPickupTime?: string;
  totalUSD: number | null;
  totalMXN: number | null;
  paymentStatus: string;
  tripStatus: string;
  airline?: string;
  flightNumber?: string;
  arrivalTime?: string;
  returnFlightNumber?: string;
  notes?: string;
  driverNotes?: string;
  createdAt: string;
  updatedAt: string;
  payments?: any[];
}

type FilterType =
  | "all"
  | "upcoming"
  | "today"
  | "tomorrow"
  | "thisWeek"
  | "paymentPending"
  | "paymentCompleted"
  | "tripPending"
  | "inProgress"
  | "completed"
  | "highestRevenue"
  | "mostRecent";

type SortField = "pickupDate" | "totalUSD" | "createdAt" | "firstName";
type SortOrder = "asc" | "desc";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [driverNotes, setDriverNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  // Filtros y ordenamiento
  const [filter, setFilter] = useState<FilterType>("all");
  const [sortField, setSortField] = useState<SortField>("pickupDate");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [searchTerm, setSearchTerm] = useState("");

  const loadBookings = async () => {
    try {
      const res = await fetch("/api/bookings", { credentials: "include" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setBookings(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  // Actualizar estado del viaje o notas del conductor
  const updateBooking = async (id: number, tripStatus?: string, driverNotes?: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(tripStatus && { tripStatus }),
          ...(driverNotes !== undefined && { driverNotes }),
        }),
      });
      if (!res.ok) throw new Error("Error al actualizar");
      await loadBookings();
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking((prev) => prev ? { ...prev, tripStatus: tripStatus || prev.tripStatus, driverNotes: driverNotes !== undefined ? driverNotes : prev.driverNotes } : null);
      }
    } catch (err) {
      alert("Error al actualizar la reserva");
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveDriverNotes = async () => {
    if (!selectedBooking) return;
    await updateBooking(selectedBooking.id, undefined, driverNotes);
  };

  // Lógica de filtrado
  const filteredBookings = useMemo(() => {
    let result = [...bookings];

    // Búsqueda por nombre, email, teléfono, ubicaciones
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (b) =>
          b.firstName.toLowerCase().includes(term) ||
          b.lastName.toLowerCase().includes(term) ||
          b.email.toLowerCase().includes(term) ||
          b.phone.includes(term) ||
          b.pickupLocation.toLowerCase().includes(term) ||
          b.dropoffLocation.toLowerCase().includes(term)
      );
    }

    // Filtros predefinidos
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    switch (filter) {
      case "upcoming":
        result = result.filter((b) => new Date(b.pickupDate) >= today);
        break;
      case "today":
        result = result.filter((b) => isToday(parseISO(b.pickupDate)));
        break;
      case "tomorrow":
        result = result.filter((b) => isTomorrow(parseISO(b.pickupDate)));
        break;
      case "thisWeek":
        result = result.filter((b) => isThisWeek(parseISO(b.pickupDate), { weekStartsOn: 1 }));
        break;
      case "paymentPending":
        result = result.filter((b) => b.paymentStatus === "pending");
        break;
      case "paymentCompleted":
        result = result.filter((b) => b.paymentStatus === "paid");
        break;
      case "tripPending":
        result = result.filter((b) => b.tripStatus === "pending");
        break;
      case "inProgress":
        result = result.filter((b) => b.tripStatus === "in_progress");
        break;
      case "completed":
        result = result.filter((b) => b.tripStatus === "completed");
        break;
      case "highestRevenue":
        result = [...result].sort((a, b) => (b.totalUSD || 0) - (a.totalUSD || 0));
        break;
      case "mostRecent":
        result = [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        break;
    }

    // Ordenamiento (si no es uno de los casos especiales que ya ordenaron)
    if (!["highestRevenue", "mostRecent"].includes(filter)) {
      result.sort((a, b) => {
        let valA: any, valB: any;
        switch (sortField) {
          case "pickupDate":
            valA = new Date(a.pickupDate).getTime();
            valB = new Date(b.pickupDate).getTime();
            break;
          case "totalUSD":
            valA = a.totalUSD || 0;
            valB = b.totalUSD || 0;
            break;
          case "createdAt":
            valA = new Date(a.createdAt).getTime();
            valB = new Date(b.createdAt).getTime();
            break;
          case "firstName":
            valA = a.firstName.toLowerCase();
            valB = b.firstName.toLowerCase();
            break;
          default:
            return 0;
        }
        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [bookings, filter, sortField, sortOrder, searchTerm]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      return format(parseISO(dateStr), "PPP", { locale: es });
    } catch {
      return dateStr;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentColor = (status: string) => {
    return status === "paid" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  if (loading) return <div className="p-8 text-center">Cargando reservas...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-8 py-4 flex flex-wrap justify-between items-center gap-4 sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Reservas</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Buscar por nombre, email, teléfono..."
            className="border rounded-lg px-4 py-2 w-64 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={loadBookings}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700"
          >
            Actualizar
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filtros rápidos */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-sm font-semibold text-gray-700 mr-2">Filtros:</span>
            {[
              { label: "Todas", value: "all" },
              { label: "Próximas", value: "upcoming" },
              { label: "Hoy", value: "today" },
              { label: "Mañana", value: "tomorrow" },
              { label: "Esta semana", value: "thisWeek" },
              { label: "Pago pendiente", value: "paymentPending" },
              { label: "Pago completado", value: "paymentCompleted" },
              { label: "Viaje pendiente", value: "tripPending" },
              { label: "En progreso", value: "inProgress" },
              { label: "Completado", value: "completed" },
              { label: "Mayor ingreso", value: "highestRevenue" },
              { label: "Más recientes", value: "mostRecent" },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value as FilterType)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                  filter === f.value
                    ? "bg-teal-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Ordenar por:</span>
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as SortField)}
                className="border rounded-lg px-2 py-1 text-sm"
              >
                <option value="pickupDate">Fecha de recogida</option>
                <option value="totalUSD">Monto</option>
                <option value="createdAt">Fecha de creación</option>
                <option value="firstName">Nombre</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="text-sm bg-gray-100 px-2 py-1 rounded"
              >
                {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
              </button>
            </div>
            <div className="text-sm text-gray-500">
              {filteredBookings.length} reserva(s)
            </div>
          </div>
        </div>

        {/* Lista de reservas */}
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition cursor-pointer"
              onClick={() => {
                setSelectedBooking(booking);
                setDriverNotes(booking.driverNotes || "");
              }}
            >
              <div className="flex flex-wrap justify-between items-start gap-3">
                <div>
                  <h3 className="font-bold text-lg">{booking.firstName} {booking.lastName}</h3>
                  <p className="text-sm text-gray-500">{booking.email} | {booking.phone}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-sm">
                    <span className="bg-gray-100 px-2 py-1 rounded">{booking.vehicleType}</span>
                    <span className="bg-gray-100 px-2 py-1 rounded">{booking.passengers} pasajeros</span>
                    <span className={`px-2 py-1 rounded ${getPaymentColor(booking.paymentStatus)}`}>
                      Pago: {booking.paymentStatus === "paid" ? "Pagado" : "Pendiente"}
                    </span>
                    <span className={`px-2 py-1 rounded ${getStatusColor(booking.tripStatus)}`}>
                      Viaje: {booking.tripStatus === "pending" ? "Pendiente" : booking.tripStatus === "in_progress" ? "En progreso" : "Completado"}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-teal-700">${booking.totalUSD} USD</div>
                  <div className="text-xs text-gray-400">
                    {formatDate(booking.pickupDate)} a las {booking.pickupTime}
                  </div>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600 flex items-center gap-2">
                <span className="truncate">{booking.pickupLocation}</span>
                <span>→</span>
                <span className="truncate">{booking.dropoffLocation}</span>
              </div>
            </div>
          ))}
          {filteredBookings.length === 0 && (
            <div className="text-center py-12 text-gray-400">No hay reservas con los filtros actuales.</div>
          )}
        </div>
      </div>

      {/* Modal de detalles */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedBooking(null)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Detalle de Reserva #{selectedBooking.id}</h2>
              <button onClick={() => setSelectedBooking(null)} className="text-gray-500 hover:text-gray-700">✖</button>
            </div>
            <div className="p-6 space-y-6">
              {/* Información del cliente */}
              <div>
                <h3 className="font-semibold text-lg mb-2">Cliente</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="font-medium">Nombre:</span> {selectedBooking.firstName} {selectedBooking.lastName}</div>
                  <div><span className="font-medium">Email:</span> {selectedBooking.email}</div>
                  <div><span className="font-medium">Teléfono:</span> {selectedBooking.phone}</div>
                </div>
              </div>
              {/* Viaje */}
              <div>
                <h3 className="font-semibold text-lg mb-2">Detalles del viaje</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="font-medium">Origen:</span> {selectedBooking.pickupLocation}</div>
                  <div><span className="font-medium">Destino:</span> {selectedBooking.dropoffLocation}</div>
                  <div><span className="font-medium">Fecha recogida:</span> {formatDate(selectedBooking.pickupDate)}</div>
                  <div><span className="font-medium">Hora recogida:</span> {selectedBooking.pickupTime}</div>
                  <div><span className="font-medium">Vehículo:</span> {selectedBooking.vehicleType}</div>
                  <div><span className="font-medium">Pasajeros:</span> {selectedBooking.passengers}</div>
                  {selectedBooking.roundTrip && (
                    <>
                      <div><span className="font-medium">Regreso desde:</span> {selectedBooking.returnPickupLocation}</div>
                      <div><span className="font-medium">Regreso hasta:</span> {selectedBooking.returnDropoffLocation}</div>
                      <div><span className="font-medium">Fecha regreso:</span> {formatDate(selectedBooking.returnPickupDate || "")}</div>
                      <div><span className="font-medium">Hora regreso:</span> {selectedBooking.returnPickupTime}</div>
                    </>
                  )}
                </div>
              </div>
              {/* Vuelos */}
              <div>
                <h3 className="font-semibold text-lg mb-2">Información de vuelo</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="font-medium">Aerolínea:</span> {selectedBooking.airline || "-"}</div>
                  <div><span className="font-medium">Vuelo ida:</span> {selectedBooking.flightNumber || "-"}</div>
                  <div><span className="font-medium">Hora llegada:</span> {selectedBooking.arrivalTime || "-"}</div>
                  <div><span className="font-medium">Vuelo regreso:</span> {selectedBooking.returnFlightNumber || "-"}</div>
                </div>
              </div>
              {/* Notas del cliente */}
              {selectedBooking.notes && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Notas del cliente</h3>
                  <p className="bg-gray-50 p-3 rounded text-sm">{selectedBooking.notes}</p>
                </div>
              )}
              {/* Notas del conductor (editable) */}
              <div>
                <h3 className="font-semibold text-lg mb-2">Notas del conductor</h3>
                <textarea
                  className="w-full border rounded-lg p-3 text-sm"
                  rows={3}
                  value={driverNotes}
                  onChange={(e) => setDriverNotes(e.target.value)}
                  placeholder="Añadir notas internas..."
                />
                <button
                  onClick={handleSaveDriverNotes}
                  disabled={updating}
                  className="mt-2 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700 disabled:opacity-50"
                >
                  Guardar notas
                </button>
              </div>
              {/* Estado del viaje y acciones */}
              <div className="border-t pt-4 flex flex-wrap gap-3 justify-between items-center">
                <div>
                  <span className="font-medium">Estado actual del viaje:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${getStatusColor(selectedBooking.tripStatus)}`}>
                    {selectedBooking.tripStatus === "pending" ? "Pendiente" : selectedBooking.tripStatus === "in_progress" ? "En progreso" : "Completado"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateBooking(selectedBooking.id, "pending")}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-600"
                  >
                    Pendiente
                  </button>
                  <button
                    onClick={() => updateBooking(selectedBooking.id, "in_progress")}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
                  >
                    En progreso
                  </button>
                  <button
                    onClick={() => updateBooking(selectedBooking.id, "completed")}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600"
                  >
                    Completado
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}