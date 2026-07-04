import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Svg,
  Rect,
  Defs,
  LinearGradient,
  Stop,
} from "@react-pdf/renderer";

// Paleta de colores basada en el voucher de referencia
const COLORS = {
  darkGreen: "#1f4d3a",
  midGreen: "#2f6b4f",
  panelGreen: "#cfe9d8",
  panelGreenLight: "#e3f3e9",
  textDark: "#1a1a1a",
  textGray: "#4a4a4a",
  white: "#ffffff",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 40,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: COLORS.textDark,
  },
  gradientBar: {
    width: "100%",
    height: 14,
  },
  contentWrap: {
    paddingTop: 18,
    paddingBottom: 18,
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  infoPanel: {
    backgroundColor: COLORS.panelGreen,
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 14,
    width: 280,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  infoLabel: {
    width: 130,
    textAlign: "right",
    marginRight: 8,
    color: COLORS.textDark,
  },
  infoValue: {
    flex: 1,
    fontFamily: "Helvetica-Bold",
  },
  infoValueLink: {
    flex: 1,
    fontFamily: "Helvetica-Bold",
    color: COLORS.midGreen,
  },
  logoBox: {
    alignItems: "center",
    width: 110,
  },
  logoBadge: {
    borderWidth: 2,
    borderColor: COLORS.darkGreen,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: "center",
    marginBottom: 4,
  },
  logoText1: {
    fontFamily: "Helvetica-Bold",
    fontSize: 20,
    color: COLORS.darkGreen,
    letterSpacing: 0.5,
  },
  logoText2: {
    fontFamily: "Helvetica-Bold",
    fontSize: 20,
    color: COLORS.darkGreen,
    letterSpacing: 0.5,
  },
  logoSubtitle: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: COLORS.darkGreen,
    letterSpacing: 1,
  },
  contactLine: {
    marginBottom: 2,
    color: COLORS.textGray,
  },
  sectionTitleBar: {
    marginTop: 16,
    marginBottom: 10,
  },
  sectionTitleText: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: COLORS.darkGreen,
    textAlign: "center",
  },
  subSectionHeader: {
    backgroundColor: COLORS.panelGreen,
    paddingVertical: 3,
    paddingHorizontal: 6,
    marginTop: 10,
    marginBottom: 6,
  },
  subSectionHeaderText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: COLORS.textDark,
  },
  fromToRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  fromToCol: {
    flex: 1,
  },
  smallLabel: {
    color: COLORS.textGray,
    marginBottom: 2,
  },
  boldValue: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
  },
  detailsRow: {
    flexDirection: "row",
  },
  detailsCol: {
    flex: 1,
  },
  additionalServiceBlock: {
    marginTop: 12,
  },
  additionalServiceLabel: {
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 18,
  },
  costBox: {
    width: 230,
  },
  costHeader: {
    backgroundColor: COLORS.panelGreen,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginBottom: 6,
  },
  costHeaderText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    textAlign: "center",
  },
  costRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
    paddingHorizontal: 4,
  },
  costLabel: {
    color: COLORS.textDark,
  },
  costValue: {
    textAlign: "right",
  },
  costValueUnderline: {
    textAlign: "right",
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.textDark,
    paddingBottom: 1,
    minWidth: 55,
  },
  costRowBold: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
    paddingHorizontal: 4,
  },
  costLabelBold: {
    fontFamily: "Helvetica-Bold",
  },
  costValueBold: {
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
  },
  weAcceptBlock: {
    alignItems: "flex-end",
  },
  weAcceptLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    marginBottom: 6,
  },
  paymentIconsRow: {
    flexDirection: "row",
  },
  paymentIcon: {
    borderWidth: 0.5,
    borderColor: "#999999",
    borderRadius: 3,
    paddingVertical: 3,
    paddingHorizontal: 6,
    marginLeft: 4,
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
  },
  termsBox: {
    backgroundColor: COLORS.panelGreenLight,
    borderRadius: 4,
    padding: 12,
    marginTop: 20,
  },
  termsTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    marginBottom: 6,
  },
  termsText: {
    fontSize: 7.5,
    lineHeight: 1.5,
    color: COLORS.textDark,
  },
});

// Barra con degradado verde -> blanco, usada arriba y abajo de la página
function GradientBar({ flip = false }: { flip?: boolean }) {
  return (
    <Svg style={styles.gradientBar} viewBox="0 0 612 14">
      <Defs>
        <LinearGradient
          id="grad"
          x1={flip ? "1" : "0"}
          y1="0"
          x2={flip ? "0" : "1"}
          y2="0"
        >
          <Stop offset="0" stopColor={COLORS.panelGreen} stopOpacity={1} />
          <Stop offset="1" stopColor={COLORS.white} stopOpacity={1} />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="612" height="14" fill="url(#grad)" />
    </Svg>
  );
}

type VoucherData = {
  folio?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  serviceType?: string; // e.g. "Round trip" / "One way"
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
  additionalServiceNotes?: string;
  totalAmount: number;
  paidAmount?: number;
  paidMethod?: string;
  notes?: string;
  voucherNumber?: string;
  date?: string; // fecha de emisión del voucher
};

export default function VoucherDocument({ data }: { data: VoucherData }) {
  const total =
    typeof data.totalAmount === "number"
      ? data.totalAmount
      : Number(data.totalAmount) || 0;
  const paid =
    typeof data.paidAmount === "number"
      ? data.paidAmount
      : Number(data.paidAmount) || 0;
  const addService =
    typeof data.additionalService === "number"
      ? data.additionalService
      : Number(data.additionalService) || 0;
  const subtotal = total; // el subtotal mostrado corresponde al total sin el servicio adicional
  const grandTotal = subtotal + addService;
  const balance = (grandTotal - paid).toFixed(2);
  const folio = data.folio || data.voucherNumber || "025";

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <GradientBar />

        <View style={styles.contentWrap}>
          {/* Encabezado: panel de info + logo */}
          <View style={styles.topRow}>
            <View style={styles.infoPanel}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Folio</Text>
                <Text style={styles.infoValue}>{folio}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Client name</Text>
                <Text style={styles.infoValue}>
                  {data.firstName} {data.lastName}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Client phone number</Text>
                <Text style={styles.infoValue}>{data.phone}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Service type</Text>
                <Text style={styles.infoValue}>
                  {data.serviceType || (data.roundTrip ? "Round trip" : "One way")}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>E-mail</Text>
                <Text style={styles.infoValueLink}>{data.email}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Date</Text>
                <Text style={styles.infoValue}>{data.date || "-"}</Text>
              </View>
            </View>

            <View style={styles.logoBox}>
              <View style={styles.logoBadge}>
                <Text style={styles.logoText1}>CABO</Text>
                <Text style={styles.logoText2}>101</Text>
              </View>
              <Text style={styles.logoSubtitle}>TRAVEL GUIDE</Text>
            </View>
          </View>

          {/* Contacto */}
          <Text style={styles.contactLine}>
            Contact us: +52 (624) 320-98-77 or +52 (624) 174-63-53
          </Text>
          <Text style={styles.contactLine}>E-mail: booking@cabo101.com.mx</Text>

          {/* Título de sección */}
          <View style={styles.sectionTitleBar}>
            <Text style={styles.sectionTitleText}>TRANSPORTATION SERVICE</Text>
          </View>

          {/* Outbound */}
          <View style={styles.subSectionHeader}>
            <Text style={styles.subSectionHeaderText}>Outbound</Text>
          </View>
          <View style={styles.fromToRow}>
            <View style={styles.fromToCol}>
              <Text style={styles.smallLabel}>From:</Text>
              <Text style={styles.boldValue}>{data.pickupLocation}</Text>
            </View>
            <View style={styles.fromToCol}>
              <Text style={styles.smallLabel}>To:</Text>
              <Text style={styles.boldValue}>{data.dropoffLocation}</Text>
            </View>
          </View>
          <View style={styles.detailsRow}>
            <View style={styles.detailsCol}>
              <Text style={styles.smallLabel}>Passengers:</Text>
              <Text style={styles.boldValue}>{data.passengers}</Text>
            </View>
            <View style={styles.detailsCol}>
              <Text style={styles.smallLabel}>Vehicle:</Text>
              <Text style={styles.boldValue}>{data.vehicleType}</Text>
            </View>
            <View style={styles.detailsCol}>
              <Text style={styles.smallLabel}>Date:</Text>
              <Text style={styles.boldValue}>{data.pickupDate}</Text>
            </View>
            <View style={styles.detailsCol}>
              <Text style={styles.smallLabel}>Pickup time:</Text>
              <Text style={styles.boldValue}>{data.pickupTime || "Pend"}</Text>
            </View>
          </View>

          {/* Return */}
          {data.roundTrip && (
            <>
              <View style={styles.subSectionHeader}>
                <Text style={styles.subSectionHeaderText}>Return</Text>
              </View>
              <View style={styles.fromToRow}>
                <View style={styles.fromToCol}>
                  <Text style={styles.smallLabel}>From:</Text>
                  <Text style={styles.boldValue}>
                    {data.returnPickupLocation || "-"}
                  </Text>
                </View>
                <View style={styles.fromToCol}>
                  <Text style={styles.smallLabel}>To:</Text>
                  <Text style={styles.boldValue}>
                    {data.returnDropoffLocation || "-"}
                  </Text>
                </View>
              </View>
              <View style={styles.detailsRow}>
                <View style={styles.detailsCol}>
                  <Text style={styles.smallLabel}>Passengers</Text>
                  <Text style={styles.boldValue}>{data.passengers}</Text>
                </View>
                <View style={styles.detailsCol}>
                  <Text style={styles.smallLabel}>Vehicle</Text>
                  <Text style={styles.boldValue}>{data.vehicleType}</Text>
                </View>
                <View style={styles.detailsCol}>
                  <Text style={styles.smallLabel}>Date</Text>
                  <Text style={styles.boldValue}>
                    {data.returnPickupDate || "-"}
                  </Text>
                </View>
                <View style={styles.detailsCol}>
                  <Text style={styles.smallLabel}>Pickup time</Text>
                  <Text style={styles.boldValue}>
                    {data.returnPickupTime || "Pend"}
                  </Text>
                </View>
              </View>
            </>
          )}

          {/* Servicio adicional */}
          <View style={styles.additionalServiceBlock}>
            <Text style={styles.additionalServiceLabel}>Additional service</Text>
            <Text>{data.additionalServiceNotes || "N/A"}</Text>
          </View>

          {/* Costos + métodos de pago */}
          <View style={styles.bottomRow}>
            <View style={styles.costBox}>
              <View style={styles.costHeader}>
                <Text style={styles.costHeaderText}>Cost USD</Text>
              </View>
              <View style={styles.costRow}>
                <Text style={styles.costLabel}>Subtotal</Text>
                <Text style={styles.costValue}>${subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.costRow}>
                <Text style={styles.costLabel}>Additional service</Text>
                <Text style={styles.costValueUnderline}>
                  ${addService.toFixed(2)}
                </Text>
              </View>
              <View style={styles.costRowBold}>
                <Text style={styles.costLabelBold}>Total</Text>
                <Text style={styles.costValueBold}>
                  ${grandTotal.toFixed(2)}
                </Text>
              </View>
              <View style={styles.costRow}>
                <Text style={styles.costLabel}>
                  Paid amount with {data.paidMethod || "N/A"}
                </Text>
                <Text style={styles.costValueUnderline}>${paid.toFixed(2)}</Text>
              </View>
              <View style={styles.costRowBold}>
                <Text style={styles.costLabelBold}>To pay</Text>
                <Text style={styles.costValueBold}>${balance}</Text>
              </View>
            </View>

            <View style={styles.weAcceptBlock}>
              <Text style={styles.weAcceptLabel}>We accept</Text>
              <View style={styles.paymentIconsRow}>
                <Text style={styles.paymentIcon}>Apple Pay</Text>
                <Text style={styles.paymentIcon}>AMEX</Text>
                <Text style={styles.paymentIcon}>Mastercard</Text>
                <Text style={styles.paymentIcon}>VISA</Text>
              </View>
            </View>
          </View>

          {/* Términos y condiciones */}
          <View style={styles.termsBox}>
            <Text style={styles.termsTitle}>Terms & Conditions</Text>
            <Text style={styles.termsText}>
              This ticket is personal and non-transferable. Must be presented at
              boarding. Lost or damaged tickets may be considered invalid. Valid
              only for the date and time shown. Changes must be requested at
              least 8 hours in advanced and are subject to availability.
              Cancellations must be made at least 8 hours in advance to qualify
              for a refund. Please arrive at least 10 minutes early. A maximum
              wait time of 15 minutes after the scheduled pickup is allowed;
              beyond this, an extra charge will apply. The exchange rate will
              follow our reference bank and may vary. Any damage caused,
              including spills of food, beverages, or vomit inside the vehicle,
              will result in additional charges for deep cleaning and/or
              repairs. Respectful behavior required. CABO 101 reserves the
              right to deny service to anyone posing a risk to others or the
              operation.
            </Text>
          </View>
        </View>

        <GradientBar flip />
      </Page>
    </Document>
  );
}