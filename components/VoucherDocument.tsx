import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

// Registrar fuente (opcional, usar la que quieras)
Font.register({
  family: "Helvetica",
  fonts: [
    { src: "https://fonts.gstatic.com/s/helvetica/v1/Helvetica.ttf" },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  section: {
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    marginRight: 5,
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  value: {
    flex: 1,
  },
  footer: {
    marginTop: 30,
    textAlign: "center",
    fontSize: 10,
    color: "#999",
  },
});

type VoucherData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pickupLocation: string;
  dropoffLocation: string;
  passengers: string;
  vehicleType: string;
  pickupDate: string;
  pickupTime: string;
  roundTrip: boolean;
  returnPickupLocation?: string;
  returnDropoffLocation?: string;
  returnPickupDate?: string;
  returnPickupTime?: string;
  airline?: string;
  flight?: string;
  arrival?: string;
  returnFlight?: string;
  additionalService?: number;
  totalAmount: number;
  paidAmount?: number;
  notes?: string;
  voucherNumber?: string;
};

export default function VoucherDocument({ data }: { data: VoucherData }) {
  const total = typeof data.totalAmount === 'number' ? data.totalAmount : Number(data.totalAmount) || 0;
  const paid = typeof data.paidAmount === 'number' ? data.paidAmount : Number(data.paidAmount) || 0;
  const addService = typeof data.additionalService === 'number' ? data.additionalService : Number(data.additionalService) || 0;
  const balance = (total - paid).toFixed(2);
  const voucherNumber = data.voucherNumber || `V-${Date.now().toString().slice(-6)}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Encabezado */}
        <View style={styles.header}>
          <Text>VOUCHER DE TRANSPORTE</Text>
          <Text style={{ fontSize: 10, fontWeight: "normal", marginTop: 4 }}>
            N° {voucherNumber}
          </Text>
        </View>

        {/* Datos del cliente */}
        <View style={styles.section}>
          <Text style={{ fontSize: 14, fontWeight: "bold", marginBottom: 6 }}>Cliente</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nombre:</Text>
            <Text style={styles.value}>{data.firstName} {data.lastName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{data.email}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Teléfono:</Text>
            <Text style={styles.value}>{data.phone}</Text>
          </View>
        </View>

        {/* Detalles del viaje */}
        <View style={styles.section}>
          <Text style={{ fontSize: 14, fontWeight: "bold", marginBottom: 6 }}>Detalles del viaje</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Origen:</Text>
            <Text style={styles.value}>{data.pickupLocation}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Destino:</Text>
            <Text style={styles.value}>{data.dropoffLocation}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Fecha de recogida:</Text>
            <Text style={styles.value}>{data.pickupDate}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Hora de recogida:</Text>
            <Text style={styles.value}>{data.pickupTime}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Pasajeros:</Text>
            <Text style={styles.value}>{data.passengers}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Vehículo:</Text>
            <Text style={styles.value}>{data.vehicleType}</Text>
          </View>
        </View>

        {/* Viaje de regreso (si aplica) */}
        {data.roundTrip && (
          <View style={styles.section}>
            <Text style={{ fontSize: 14, fontWeight: "bold", marginBottom: 6 }}>Viaje de regreso</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Origen de regreso:</Text>
              <Text style={styles.value}>{data.returnPickupLocation || "-"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Destino de regreso:</Text>
              <Text style={styles.value}>{data.returnDropoffLocation || "-"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Fecha de regreso:</Text>
              <Text style={styles.value}>{data.returnPickupDate || "-"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Hora de regreso:</Text>
              <Text style={styles.value}>{data.returnPickupTime || "-"}</Text>
            </View>
          </View>
        )}

        {/* Información de vuelo */}
        <View style={styles.section}>
          <Text style={{ fontSize: 14, fontWeight: "bold", marginBottom: 6 }}>Información de vuelo</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Aerolínea:</Text>
            <Text style={styles.value}>{data.airline || "-"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Número de vuelo:</Text>
            <Text style={styles.value}>{data.flight || "-"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Hora de llegada:</Text>
            <Text style={styles.value}>{data.arrival || "-"}</Text>
          </View>
          {data.returnFlight && (
            <View style={styles.row}>
              <Text style={styles.label}>Vuelo de regreso:</Text>
              <Text style={styles.value}>{data.returnFlight}</Text>
            </View>
          )}
        </View>

        {/* Resumen de costos */}
        <View style={styles.section}>
          <Text style={{ fontSize: 14, fontWeight: "bold", marginBottom: 6 }}>Resumen de pago</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Total:</Text>
            <Text style={styles.value}>${total.toFixed(2)} USD</Text>
          </View>
          {addService > 0 && (
            <View style={styles.row}>
              <Text style={styles.label}>Servicio adicional:</Text>
              <Text style={styles.value}>${addService.toFixed(2)} USD</Text>
            </View>
          )}
          {paid > 0 && (
            <View style={styles.row}>
              <Text style={styles.label}>Pagado:</Text>
              <Text style={styles.value}>${paid.toFixed(2)} USD</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.label}>Saldo pendiente:</Text>
            <Text style={styles.value}>${balance} USD</Text>
          </View>
        </View>

        {/* Notas */}
        {data.notes && (
          <View style={styles.section}>
            <Text style={{ fontSize: 14, fontWeight: "bold", marginBottom: 6 }}>Notas</Text>
            <Text>{data.notes}</Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text>Gracias por confiar en Cabo 101 • www.cabo101.com.mx</Text>
        </View>
      </Page>
    </Document>
  );
}