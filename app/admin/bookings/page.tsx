//app/admin/bookings/page.tsx

"use client";

import { useEffect, useState } from "react";
import { format, isToday, isTomorrow, isFuture, startOfWeek, endOfWeek, isWithinInterval } from "date-fns";
import { es } from "date-fns/locale";

// Interfaces
interface Payment {
  id: number;
  status: string;
  totalUSD: number;
  mercadopagoId?: string;
}

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
  paymentStatus: string;
  tripStatus: string;
  airline?: string;
  flightNumber?: string;
  arrivalTime?: string;
  returnFlightNumber?: string;
  notes?: string;
  driverNotes?: string;
  createdAt: string;
  payments: Payment[];
}

type FilterType = {
  dateRange: "all" | "upcoming" | "today" | "tomorrow" | "thisWeek";
  paymentStatus: "all" | "paid" | "pending";
  tripStatus: "all" | "pending" | "in_progress" | "completed";
  sortBy: "mostRecent" | "highestRevenue" | "priceAsc" | "priceDesc" | "dateAsc" | "alphaAsc";
  searchTerm: string;
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [driverNotes, setDriverNotes] = useState("");
  const [updating, setUpdating] = useState(false);
  const [filters, setFilters] = useState<FilterType>({
    dateRange: "all",
    paymentStatus: "all",
    tripStatus: "all",
    sortBy: "mostRecent",
    searchTerm: "",
  });

  // Cargar reservas desde la API
  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/bookings");
      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
      const data = await res.json();
      setBookings(data);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "No se pudieron cargar las reservas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  // Aplicar filtros y ordenamiento
  useEffect(() => {
    let result = [...bookings];

    // Búsqueda
    if (filters.searchTerm.trim() !== "") {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(
        (b) =>
          b.firstName.toLowerCase().includes(term) ||
          b.lastName.toLowerCase().includes(term) ||
          b.email.toLowerCase().includes(term) ||
          b.pickupLocation.toLowerCase().includes(term) ||
          b.dropoffLocation.toLowerCase().includes(term)
      );
    }

    // Filtro de fecha
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    switch (filters.dateRange) {
      case "today":
        result = result.filter((b) => isToday(new Date(b.pickupDate)));
        break;
      case "tomorrow":
        result = result.filter((b) => isTomorrow(new Date(b.pickupDate)));
        break;
      case "thisWeek": {
        const start = startOfWeek(todayDate, { weekStartsOn: 1 });
        const end = endOfWeek(todayDate, { weekStartsOn: 1 });
        result = result.filter((b) =>
          isWithinInterval(new Date(b.pickupDate), { start, end })
        );
        break;
      }
      case "upcoming":
        result = result.filter((b) => isFuture(new Date(b.pickupDate)));
        break;
      default:
        break;
    }

    // Estado de pago
    if (filters.paymentStatus !== "all") {
      result = result.filter((b) => b.paymentStatus === filters.paymentStatus);
    }

    // Estado del viaje
    if (filters.tripStatus !== "all") {
      result = result.filter((b) => b.tripStatus === filters.tripStatus);
    }

    // Ordenamiento
    switch (filters.sortBy) {
      case "mostRecent":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "highestRevenue":
        result.sort((a, b) => (b.totalUSD || 0) - (a.totalUSD || 0));
        break;
      case "priceAsc":
        result.sort((a, b) => (a.totalUSD || 0) - (b.totalUSD || 0));
        break;
      case "priceDesc":
        result.sort((a, b) => (b.totalUSD || 0) - (a.totalUSD || 0));
        break;
      case "dateAsc":
        result.sort((a, b) => new Date(a.pickupDate).getTime() - new Date(b.pickupDate).getTime());
        break;
      case "alphaAsc":
        result.sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));
        break;
      default:
        break;
    }

    setFilteredBookings(result);
  }, [bookings, filters]);

  const openModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setDriverNotes(booking.driverNotes || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
    setDriverNotes("");
  };

  // Función central para actualizar reserva (estado y/o notas)
  const updateBooking = async (tripStatus?: string, notes?: string) => {
    if (!selectedBooking) return;
    setUpdating(true);
    try {
      const payload: any = {};
      if (tripStatus !== undefined) payload.tripStatus = tripStatus;
      if (notes !== undefined) payload.driverNotes = notes;

      const res = await fetch(`/api/bookings/${selectedBooking.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Error al actualizar");

      const updatedBooking = await res.json();

      // Actualizar la lista completa (para que el filtro también muestre el cambio)
      setBookings((prev) =>
        prev.map((b) => (b.id === updatedBooking.id ? updatedBooking : b))
      );

      // Actualizar el booking seleccionado en el modal
      setSelectedBooking(updatedBooking);
      if (notes !== undefined) setDriverNotes(updatedBooking.driverNotes || "");
    } catch (err) {
      console.error(err);
      alert("No se pudo actualizar la reserva");
    } finally {
      setUpdating(false);
    }
  };

  const saveDriverNotes = async () => {
    await updateBooking(undefined, driverNotes);
  };

  const changeTripStatus = async (newStatus: string) => {
    await updateBooking(newStatus, undefined);
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "PPP", { locale: es });
    } catch {
      return dateStr;
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Cargando reservas...</div>;
  if (error) return <div className="p-8 text-center text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Administración de Reservas</h1>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 space-y-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-gray-500 mb-1">Buscar</label>
              <input
                type="text"
                placeholder="Nombre, email, destino..."
                value={filters.searchTerm}
                onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Fecha</label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters({ ...filters, dateRange: e.target.value as any })}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="all">Todas</option>
                <option value="upcoming">Próximas</option>
                <option value="today">Hoy</option>
                <option value="tomorrow">Mañana</option>
                <option value="thisWeek">Esta semana</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Pago</label>
              <select
                value={filters.paymentStatus}
                onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value as any })}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="all">Todos</option>
                <option value="paid">Pagado</option>
                <option value="pending">Pendiente</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Estado del viaje</label>
              <select
                value={filters.tripStatus}
                onChange={(e) => setFilters({ ...filters, tripStatus: e.target.value as any })}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="all">Todos</option>
                <option value="pending">Pendiente</option>
                <option value="in_progress">En progreso</option>
                <option value="completed">Completado</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Ordenar por</label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="mostRecent">Más reciente</option>
                <option value="highestRevenue">Mayor ingreso</option>
                <option value="priceAsc">Precio: menor a mayor</option>
                <option value="priceDesc">Precio: mayor a menor</option>
                <option value="dateAsc">Fecha más próxima</option>
                <option value="alphaAsc">Alfabético (cliente)</option>
              </select>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            Mostrando {filteredBookings.length} de {bookings.length} reservas
          </div>
        </div>

        {/* Lista de reservas */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center text-gray-400">
              No se encontraron reservas con los filtros actuales.
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div
                key={booking.id}
                onClick={() => openModal(booking)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition cursor-pointer"
              >
                <div className="flex flex-wrap justify-between items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {booking.firstName} {booking.lastName}
                      </h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          booking.paymentStatus === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {booking.paymentStatus === "paid" ? "Pagado" : "Pendiente"}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          booking.tripStatus === "completed"
                            ? "bg-green-100 text-green-700"
                            : booking.tripStatus === "in_progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {booking.tripStatus === "completed"
                          ? "Completado"
                          : booking.tripStatus === "in_progress"
                          ? "En curso"
                          : "Pendiente"}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {booking.pickupLocation} → {booking.dropoffLocation}
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                      {formatDate(booking.pickupDate)} a las {booking.pickupTime} · {booking.vehicleType} · {booking.passengers} pasajeros
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">
                      ${booking.totalUSD?.toFixed(2) ?? "—"} USD
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Ref: #{booking.id}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Detalle de la reserva</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Cliente */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Cliente</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-gray-500">Nombre:</span> {selectedBooking.firstName} {selectedBooking.lastName}</div>
                  <div><span className="text-gray-500">Email:</span> {selectedBooking.email}</div>
                  <div><span className="text-gray-500">Teléfono:</span> {selectedBooking.phone}</div>
                </div>
              </div>

              {/* Viaje */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Viaje</h3>
                <div className="space-y-1 text-sm">
                  <div><span className="text-gray-500">Origen:</span> {selectedBooking.pickupLocation}</div>
                  <div><span className="text-gray-500">Destino:</span> {selectedBooking.dropoffLocation}</div>
                  <div><span className="text-gray-500">Fecha/Hora:</span> {formatDate(selectedBooking.pickupDate)} a las {selectedBooking.pickupTime}</div>
                  {selectedBooking.roundTrip && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <div className="text-gray-700 font-medium">Regreso</div>
                      <div>Origen: {selectedBooking.returnPickupLocation}</div>
                      <div>Destino: {selectedBooking.returnDropoffLocation}</div>
                      <div>Fecha: {selectedBooking.returnPickupDate && formatDate(selectedBooking.returnPickupDate)} a las {selectedBooking.returnPickupTime}</div>
                    </div>
                  )}
                  <div className="mt-2"><span className="text-gray-500">Vehículo:</span> {selectedBooking.vehicleType} · {selectedBooking.passengers} pasajeros</div>
                </div>
              </div>

              {/* Vuelo */}
              {(selectedBooking.airline || selectedBooking.flightNumber) && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Vuelo</h3>
                  <div className="text-sm">
                    {selectedBooking.airline && <div>Aerolínea: {selectedBooking.airline}</div>}
                    {selectedBooking.flightNumber && <div>Número: {selectedBooking.flightNumber}</div>}
                    {selectedBooking.arrivalTime && <div>Llegada: {selectedBooking.arrivalTime}</div>}
                    {selectedBooking.returnFlightNumber && <div>Vuelo regreso: {selectedBooking.returnFlightNumber}</div>}
                  </div>
                </div>
              )}

              {/* Notas del cliente */}
              {selectedBooking.notes && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Notas del cliente</h3>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm">{selectedBooking.notes}</div>
                </div>
              )}

              {/* Notas del conductor */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Notas del conductor</h3>
                <textarea
                  rows={3}
                  value={driverNotes}
                  onChange={(e) => setDriverNotes(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                  placeholder="Ej. El cliente hizo una parada en la tienda..."
                />
                <button
                  onClick={saveDriverNotes}
                  disabled={updating}
                  className="mt-2 bg-blue-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {updating ? "Guardando..." : "Guardar notas"}
                </button>
              </div>

              {/* Estado del viaje */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Estado del viaje</h3>
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => changeTripStatus("pending")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      selectedBooking.tripStatus === "pending"
                        ? "bg-gray-800 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Pendiente
                  </button>
                  <button
                    onClick={() => changeTripStatus("in_progress")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      selectedBooking.tripStatus === "in_progress"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    En progreso
                  </button>
                  <button
                    onClick={() => changeTripStatus("completed")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      selectedBooking.tripStatus === "completed"
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Completado
                  </button>
                </div>
              </div>

              {/* Pago */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Pago</h3>
                <div className="text-sm space-y-1">
                  <div>Monto: ${selectedBooking.totalUSD?.toFixed(2)} USD</div>
                  <div>Estado: {selectedBooking.paymentStatus === "paid" ? "Pagado" : "Pendiente"}</div>
                  {selectedBooking.payments.length > 0 && selectedBooking.payments[0].mercadopagoId && (
                    <div>ID de transacción: {selectedBooking.payments[0].mercadopagoId}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
              <button onClick={closeModal} className="bg-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-400">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}