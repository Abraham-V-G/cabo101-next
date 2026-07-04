import type { ReactNode } from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Svg,
  Rect,
  Defs,
  LinearGradient,
  Stop,
} from "@react-pdf/renderer";

// Reemplaza estos imports con los archivos reales (logo oficial de Cabo 101
// y los íconos de métodos de pago con licencia de uso). No se pueden generar
// aquí por tratarse de marcas registradas de terceros.
// import cabo101Logo from "./assets/cabo101-logo.png";
// import applePayIcon from "./assets/apple-pay.png";
// import amexIcon from "./assets/amex.png";
// import mastercardIcon from "./assets/mastercard.png";
// import visaIcon from "./assets/visa.png";

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

// Rejilla de 12 columnas sobre el área de contenido (Letter: 612pt de ancho,
// márgenes de 40pt a cada lado => 532pt de contenido).
const GRID = {
  left: 40,
  content: 532,
  col: 44.33, // 532 / 12
};

// Componente reutilizable para separar bloques verticalmente sin depender
// del cálculo de márgenes de React PDF.
function Spacer({ h }: { h: number }) {
  return <View style={{ height: h }} />;
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: GRID.left,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: COLORS.textDark,
  },
  gradientBar: {
    width: "100%",
    height: 16,
  },
  contentWrap: {
    paddingTop: 18,
    paddingBottom: 18,
  },
  row: {
    flexDirection: "row",
  },

  // --- Panel de datos del cliente + logo ---
  infoPanel: {
    backgroundColor: COLORS.panelGreen,
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 14,
    width: 300, // GRID: ~6.7 columnas
  },
  infoLabel: {
    width: 130,
    textAlign: "right",
    marginRight: 8,
    color: COLORS.textDark,
  },
  infoValue: {
    width: 128, // 300 - 28(padding) - 130(label) - 8(margin) - 6 margen de seguridad
    fontFamily: "Helvetica-Bold",
  },
  infoValueLink: {
    width: 128,
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
    width: 95,
  },
  logoImage: {
    width: 95,
    height: 110,
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
    color: COLORS.textGray,
  },

  // --- Barras de título con degradado ---
  sectionTitleText: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: COLORS.darkGreen,
    textAlign: "center",
  },
  subSectionHeaderText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: COLORS.textDark,
    paddingLeft: 6,
  },

  // --- From / To (2 columnas de ancho fijo) ---
  fromToCol: {
    width: 260,
  },
  smallLabel: {
    color: COLORS.textGray,
  },
  boldValue: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
  },

  // --- Passengers / Vehicle / Date / Pickup time (4 columnas iguales) ---
  detailsCol: {
    width: 133,
  },

  additionalServiceLabel: {
    fontFamily: "Helvetica-Bold",
  },

  // --- Tabla de costos: columnas fijas, sin space-between ---
  costBox: {
    width: 230,
  },
  costHeaderText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    textAlign: "center",
    paddingVertical: 3,
  },
  costLabel: {
    width: 150,
    color: COLORS.textDark,
  },
  costValue: {
    width: 66,
    textAlign: "right",
  },
  costValueUnderline: {
    width: 66,
    textAlign: "right",
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.textDark,
    paddingBottom: 1,
  },
  costLabelBold: {
    width: 150,
    fontFamily: "Helvetica-Bold",
  },
  costValueBold: {
    width: 66,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
  },

  weAcceptLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    textAlign: "right",
  },
  paymentIcon: {
    width: 44,
    height: 26,
    marginLeft: 4,
  },
  paymentIconPlaceholder: {
    width: 44,
    height: 26,
    marginLeft: 4,
    borderWidth: 0.5,
    borderColor: "#999999",
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  paymentIconPlaceholderText: {
    fontSize: 5.5,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },

  termsBox: {
    backgroundColor: COLORS.panelGreenLight,
    borderRadius: 4,
    padding: 12,
  },
  termsTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
  },
  termsText: {
    fontSize: 7.5,
    lineHeight: 1.5,
    color: COLORS.textDark,
  },
});

// Barra superior/inferior de la página: degradado simétrico de 5 paradas
// (verde 25% -> verde claro -> blanco -> verde claro -> verde 25%),
// igual al acabado "difuminado" del PDF original.
function GradientBar() {
  return (
    <Svg style={styles.gradientBar} viewBox="0 0 612 16">
      <Defs>
        <LinearGradient id="edgeGrad" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0%" stopColor="#d2efde" stopOpacity={1} />
          <Stop offset="25%" stopColor="#e6f6ed" stopOpacity={1} />
          <Stop offset="50%" stopColor="#ffffff" stopOpacity={1} />
          <Stop offset="75%" stopColor="#e6f6ed" stopOpacity={1} />
          <Stop offset="100%" stopColor="#d2efde" stopOpacity={1} />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="612" height="16" fill="url(#edgeGrad)" />
    </Svg>
  );
}

// Barra de degradado para encabezados de sección (Outbound, Return,
// Cost USD, Transportation Service). Hecha con Svg/Rect en vez de
// backgroundColor plano, para lograr el mismo acabado difuminado.
function GradientBand({
  id,
  width,
  height,
}: {
  id: string;
  width: number;
  height: number;
}) {
  return (
    <Svg
      style={{ width, height, position: "absolute", top: 0, left: 0 }}
      viewBox={`0 0 ${width} ${height}`}
    >
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0%" stopColor="#c7e8d4" stopOpacity={1} />
          <Stop offset="60%" stopColor="#dcf1e4" stopOpacity={1} />
          <Stop offset="100%" stopColor="#f4faf6" stopOpacity={1} />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width={width} height={height} fill={`url(#${id})`} />
    </Svg>
  );
}

// Envuelve un texto de encabezado con su franja de degradado detrás,
// usando posicionamiento relativo/absoluto (sin backgroundColor).
function SectionBand({
  id,
  width,
  height,
  children,
}: {
  id: string;
  width: number;
  height: number;
  children: ReactNode;
}) {
  return (
    <View style={{ width, height, position: "relative" }}>
      <GradientBand id={id} width={width} height={height} />
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width,
          height,
          justifyContent: "center",
        }}
      >
        {children}
      </View>
    </View>
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

  // Set a esto a true una vez que hayas conectado los assets reales
  // (logo de Cabo 101 e íconos de pago) para que se rendericen como
  // <Image> en lugar del marcador de texto de respaldo.
  const HAS_REAL_ASSETS = false;

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <GradientBar />

        <View style={styles.contentWrap}>
          {/* Encabezado: panel de info (300pt) + separador (122pt) + logo (110pt) = 532pt */}
          <View style={styles.row}>
            <View style={styles.infoPanel}>
              <View style={styles.row}>
                <Text style={styles.infoLabel}>Folio</Text>
                <Text style={styles.infoValue}>{folio}</Text>
              </View>
              <Spacer h={3} />
              <View style={styles.row}>
                <Text style={styles.infoLabel}>Client name</Text>
                <Text style={styles.infoValue}>
                  {data.firstName} {data.lastName}
                </Text>
              </View>
              <Spacer h={3} />
              <View style={styles.row}>
                <Text style={styles.infoLabel}>Client phone number</Text>
                <Text style={styles.infoValue}>{data.phone}</Text>
              </View>
              <Spacer h={3} />
              <View style={styles.row}>
                <Text style={styles.infoLabel}>Service type</Text>
                <Text style={styles.infoValue}>
                  {data.serviceType || (data.roundTrip ? "Round trip" : "One way")}
                </Text>
              </View>
              <Spacer h={3} />
              <View style={styles.row}>
                <Text style={styles.infoLabel}>E-mail</Text>
                <Text style={styles.infoValueLink}>{data.email}</Text>
              </View>
              <Spacer h={3} />
              <View style={styles.row}>
                <Text style={styles.infoLabel}>Date</Text>
                <Text style={styles.infoValue}>{data.date || "-"}</Text>
              </View>
            </View>

            <View style={{ width: 122 }} />

            <View style={styles.logoBox}>
              {HAS_REAL_ASSETS ? (
                // <Image src={cabo101Logo} style={styles.logoImage} />
                <View style={styles.logoImage} />
              ) : (
                <>
                  <View style={styles.logoBadge}>
                    <Text style={styles.logoText1}>CABO</Text>
                    <Text style={styles.logoText2}>101</Text>
                  </View>
                  <Spacer h={4} />
                  <Text style={styles.logoSubtitle}>TRAVEL GUIDE</Text>
                </>
              )}
            </View>
          </View>

          <Spacer h={14} />

          {/* Contacto */}
          <Text style={styles.contactLine}>
            Contact us: +52 (624) 320-98-77 or +52 (624) 174-63-53
          </Text>
          <Spacer h={2} />
          <Text style={styles.contactLine}>E-mail: booking@cabo101.com.mx</Text>

          <Spacer h={16} />

          {/* Título de sección: franja con degradado, ancho completo (532pt) */}
          <SectionBand id="gradTitle" width={GRID.content} height={20}>
            <Text style={styles.sectionTitleText}>TRANSPORTATION SERVICE</Text>
          </SectionBand>

          <Spacer h={10} />

          {/* Outbound */}
          <SectionBand id="gradOutbound" width={GRID.content} height={16}>
            <Text style={styles.subSectionHeaderText}>Outbound</Text>
          </SectionBand>
          <Spacer h={6} />
          <View style={styles.row}>
            <View style={styles.fromToCol}>
              <Text style={styles.smallLabel}>From:</Text>
              <Spacer h={2} />
              <Text style={styles.boldValue}>{data.pickupLocation}</Text>
            </View>
            <View style={{ width: 12 }} />
            <View style={styles.fromToCol}>
              <Text style={styles.smallLabel}>To:</Text>
              <Spacer h={2} />
              <Text style={styles.boldValue}>{data.dropoffLocation}</Text>
            </View>
          </View>
          <Spacer h={8} />
          <View style={styles.row}>
            <View style={styles.detailsCol}>
              <Text style={styles.smallLabel}>Passengers:</Text>
              <Spacer h={2} />
              <Text style={styles.boldValue}>{data.passengers}</Text>
            </View>
            <View style={styles.detailsCol}>
              <Text style={styles.smallLabel}>Vehicle:</Text>
              <Spacer h={2} />
              <Text style={styles.boldValue}>{data.vehicleType}</Text>
            </View>
            <View style={styles.detailsCol}>
              <Text style={styles.smallLabel}>Date:</Text>
              <Spacer h={2} />
              <Text style={styles.boldValue}>{data.pickupDate}</Text>
            </View>
            <View style={styles.detailsCol}>
              <Text style={styles.smallLabel}>Pickup time:</Text>
              <Spacer h={2} />
              <Text style={styles.boldValue}>{data.pickupTime || "Pend"}</Text>
            </View>
          </View>

          {/* Return */}
          {data.roundTrip && (
            <>
              <Spacer h={14} />
              <SectionBand id="gradReturn" width={GRID.content} height={16}>
                <Text style={styles.subSectionHeaderText}>Return</Text>
              </SectionBand>
              <Spacer h={6} />
              <View style={styles.row}>
                <View style={styles.fromToCol}>
                  <Text style={styles.smallLabel}>From:</Text>
                  <Spacer h={2} />
                  <Text style={styles.boldValue}>
                    {data.returnPickupLocation || "-"}
                  </Text>
                </View>
                <View style={{ width: 12 }} />
                <View style={styles.fromToCol}>
                  <Text style={styles.smallLabel}>To:</Text>
                  <Spacer h={2} />
                  <Text style={styles.boldValue}>
                    {data.returnDropoffLocation || "-"}
                  </Text>
                </View>
              </View>
              <Spacer h={8} />
              <View style={styles.row}>
                <View style={styles.detailsCol}>
                  <Text style={styles.smallLabel}>Passengers</Text>
                  <Spacer h={2} />
                  <Text style={styles.boldValue}>{data.passengers}</Text>
                </View>
                <View style={styles.detailsCol}>
                  <Text style={styles.smallLabel}>Vehicle</Text>
                  <Spacer h={2} />
                  <Text style={styles.boldValue}>{data.vehicleType}</Text>
                </View>
                <View style={styles.detailsCol}>
                  <Text style={styles.smallLabel}>Date</Text>
                  <Spacer h={2} />
                  <Text style={styles.boldValue}>
                    {data.returnPickupDate || "-"}
                  </Text>
                </View>
                <View style={styles.detailsCol}>
                  <Text style={styles.smallLabel}>Pickup time</Text>
                  <Spacer h={2} />
                  <Text style={styles.boldValue}>
                    {data.returnPickupTime || "Pend"}
                  </Text>
                </View>
              </View>
            </>
          )}

          <Spacer h={14} />

          {/* Servicio adicional */}
          <Text style={styles.additionalServiceLabel}>Additional service</Text>
          <Spacer h={2} />
          <Text>{data.additionalServiceNotes || "N/A"}</Text>

          <Spacer h={18} />

          {/* Costos (230pt) + separador (172pt) + métodos de pago (130pt) = 532pt */}
          <View style={styles.row}>
            <View style={styles.costBox}>
              <SectionBand id="gradCostHeader" width={230} height={16}>
                <Text style={styles.costHeaderText}>Cost USD</Text>
              </SectionBand>
              <Spacer h={6} />

              <View style={styles.row}>
                <Text style={styles.costLabel}>Subtotal</Text>
                <Text style={styles.costValue}>${subtotal.toFixed(2)}</Text>
              </View>
              <Spacer h={4} />
              <View style={styles.row}>
                <Text style={styles.costLabel}>Additional service</Text>
                <Text style={styles.costValueUnderline}>
                  ${addService.toFixed(2)}
                </Text>
              </View>
              <Spacer h={4} />
              <View style={styles.row}>
                <Text style={styles.costLabelBold}>Total</Text>
                <Text style={styles.costValueBold}>
                  ${grandTotal.toFixed(2)}
                </Text>
              </View>
              <Spacer h={4} />
              <View style={styles.row}>
                <Text style={styles.costLabel}>
                  Paid amount with {data.paidMethod || "N/A"}
                </Text>
                <Text style={styles.costValueUnderline}>${paid.toFixed(2)}</Text>
              </View>
              <Spacer h={4} />
              <View style={styles.row}>
                <Text style={styles.costLabelBold}>To pay</Text>
                <Text style={styles.costValueBold}>${balance}</Text>
              </View>
            </View>

            <View style={{ width: 172 }} />

            <View style={{ width: 130 }}>
              <Text style={styles.weAcceptLabel}>We accept</Text>
              <Spacer h={6} />
              <View style={[styles.row, { justifyContent: "flex-end" }]}>
                {HAS_REAL_ASSETS ? (
                  <>
                    {/* <Image src={applePayIcon} style={styles.paymentIcon} />
                    <Image src={amexIcon} style={styles.paymentIcon} />
                    <Image src={mastercardIcon} style={styles.paymentIcon} />
                    <Image src={visaIcon} style={styles.paymentIcon} /> */}
                  </>
                ) : (
                  <>
                    <View style={styles.paymentIconPlaceholder}>
                      <Text style={styles.paymentIconPlaceholderText}>
                        Apple Pay
                      </Text>
                    </View>
                    <View style={styles.paymentIconPlaceholder}>
                      <Text style={styles.paymentIconPlaceholderText}>
                        AMEX
                      </Text>
                    </View>
                    <View style={styles.paymentIconPlaceholder}>
                      <Text style={styles.paymentIconPlaceholderText}>
                        Mastercard
                      </Text>
                    </View>
                    <View style={styles.paymentIconPlaceholder}>
                      <Text style={styles.paymentIconPlaceholderText}>
                        VISA
                      </Text>
                    </View>
                  </>
                )}
              </View>
            </View>
          </View>

          <Spacer h={20} />

          {/* Términos y condiciones */}
          <View style={styles.termsBox}>
            <Text style={styles.termsTitle}>Terms & Conditions</Text>
            <Spacer h={6} />
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

        <GradientBar />
      </Page>
    </Document>
  );
}