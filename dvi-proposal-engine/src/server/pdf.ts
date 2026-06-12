import PDFDocument from "pdfkit";
import { eq } from "drizzle-orm";
import { db, schema } from "./db.js";

const NAVY = "#1a2744";
const GREY = "#888888";
const LIGHT = "#cccccc";

const M = 50; // Seitenrand
const W = 595.28; // A4 Breite pt
const CONTENT_W = W - 2 * M;

function fmtMoney(value: number, currency: string) {
  return (
    value.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) +
    " " +
    (currency === "EUR" ? "€" : currency)
  );
}

function fmtDate(iso: string | null | undefined) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

export async function generateProposalPdf(proposalId: number): Promise<Buffer | null> {
  const proposal = db.select().from(schema.proposals).where(eq(schema.proposals.id, proposalId)).get();
  if (!proposal) return null;
  const customer = db.select().from(schema.customers).where(eq(schema.customers.id, proposal.customerId)).get();
  const contact = proposal.contactId
    ? db.select().from(schema.contacts).where(eq(schema.contacts.id, proposal.contactId)).get()
    : null;
  const items = db
    .select()
    .from(schema.proposalItems)
    .where(eq(schema.proposalItems.proposalId, proposalId))
    .orderBy(schema.proposalItems.sortOrder)
    .all();
  const terms = db
    .select()
    .from(schema.proposalPaymentTerms)
    .where(eq(schema.proposalPaymentTerms.proposalId, proposalId))
    .orderBy(schema.proposalPaymentTerms.sortOrder)
    .all();
  const settings = db.select().from(schema.settings).get();

  const doc = new PDFDocument({ size: "A4", margins: { top: M, bottom: 70, left: M, right: M } });
  const chunks: Buffer[] = [];
  doc.on("data", (c: Buffer) => chunks.push(c));

  const footer = () => {
    const y = 780;
    doc.save();
    doc.moveTo(M, y).lineTo(W - M, y).strokeColor(LIGHT).lineWidth(0.5).stroke();
    const parts = [
      settings?.companyName,
      settings?.companyAddress?.replace(/\n/g, ", "),
      settings?.vatId ? `USt-ID: ${settings.vatId}` : null,
      settings?.bankDetails?.replace(/\n/g, " · "),
    ].filter(Boolean);
    doc
      .font("Helvetica")
      .fontSize(7)
      .fillColor(GREY)
      .text(parts.join("  ·  "), M, y + 6, { width: CONTENT_W, align: "center", lineBreak: true, height: 30 });
    doc.restore();
  };
  footer();
  doc.on("pageAdded", footer);

  const pageBreakIfNeeded = (needed: number) => {
    if (doc.y + needed > 760) doc.addPage();
  };

  // ---- Kopf: Logo rechts, Absenderzeile links ----
  if (settings?.logoUrl?.startsWith("data:image")) {
    try {
      const base64 = settings.logoUrl.split(",")[1];
      doc.image(Buffer.from(base64, "base64"), W - M - 120, M, { fit: [120, 50], align: "right" });
    } catch {
      // ungültiges Logo ignorieren
    }
  } else {
    doc.font("Helvetica-Bold").fontSize(16).fillColor(NAVY).text(settings?.companyName ?? "DVI-Systems", M, M, {
      width: CONTENT_W,
      align: "right",
    });
  }

  const senderLine = [settings?.companyName, settings?.companyAddress?.replace(/\n/g, ", ")]
    .filter(Boolean)
    .join(" · ");
  doc.font("Helvetica").fontSize(7).fillColor(GREY).text(senderLine, M, M + 60, { width: 280 });
  doc.moveTo(M, M + 72).lineTo(M + 280, M + 72).strokeColor(LIGHT).lineWidth(0.5).stroke();

  // ---- Empfänger ----
  let y = M + 82;
  doc.font("Helvetica").fontSize(10).fillColor("black");
  doc.text(customer?.name ?? "", M, y);
  if (contact) doc.text(`${contact.firstName} ${contact.lastName}`.trim(), M);
  if (customer?.address) doc.text(customer.address, M);
  const cityLine = [customer?.city, customer?.country].filter(Boolean).join(", ");
  if (cityLine) doc.text(cityLine, M);

  // ---- Meta-Block rechts ----
  const metaX = W - M - 180;
  let metaY = M + 82;
  const meta: [string, string][] = [
    ["Angebotsnr.", proposal.proposalNumber],
    ["Datum", fmtDate(proposal.date)],
    ["Gültig bis", fmtDate(proposal.validUntil)],
  ];
  if (contact) meta.push(["Ansprechpartner", `${contact.firstName} ${contact.lastName}`.trim()]);
  for (const [label, value] of meta) {
    doc.font("Helvetica").fontSize(8).fillColor(GREY).text(label, metaX, metaY, { width: 75 });
    doc.font("Helvetica").fontSize(8).fillColor("black").text(value, metaX + 80, metaY, { width: 100 });
    metaY += 13;
  }

  // ---- Titel ----
  y = Math.max(doc.y, metaY) + 30;
  doc.font("Helvetica-Bold").fontSize(13).fillColor(NAVY).text(`Angebot ${proposal.proposalNumber}`, M, y);
  if (proposal.title) {
    doc.font("Helvetica-Bold").fontSize(11).fillColor("black").text(proposal.title, M, doc.y + 4, { width: CONTENT_W });
  }
  doc.moveDown(0.8);

  // ---- Einleitung ----
  if (proposal.introText) {
    doc.font("Helvetica").fontSize(9.5).fillColor("black").text(proposal.introText, M, doc.y, {
      width: CONTENT_W,
      lineGap: 2,
    });
    doc.moveDown(1);
  }

  // ---- Positionstabelle ----
  const cols = [
    { key: "pos", label: "Pos", w: 28, align: "left" as const },
    { key: "desc", label: "Beschreibung", w: 215, align: "left" as const },
    { key: "qty", label: "Menge", w: 42, align: "right" as const },
    { key: "unit", label: "Einheit", w: 52, align: "left" as const },
    { key: "price", label: "Einzelpreis", w: 68, align: "right" as const },
    { key: "disc", label: "Rabatt", w: 40, align: "right" as const },
    { key: "total", label: "Gesamt", w: 70, align: "right" as const },
  ];

  const drawTableHeader = () => {
    const yy = doc.y;
    doc.rect(M, yy, CONTENT_W, 18).fill(NAVY);
    let x = M + 4;
    doc.font("Helvetica-Bold").fontSize(8).fillColor("white");
    for (const c of cols) {
      doc.text(c.label, x, yy + 5, { width: c.w - 8, align: c.align });
      x += c.w;
    }
    doc.y = yy + 22;
  };

  pageBreakIfNeeded(60);
  drawTableHeader();

  doc.font("Helvetica").fontSize(8.5).fillColor("black");
  for (const item of items) {
    const descH = doc.heightOfString(item.description, { width: cols[1].w - 8 });
    const rowH = Math.max(descH, 10) + 8;
    if (doc.y + rowH > 740) {
      doc.addPage();
      drawTableHeader();
      doc.font("Helvetica").fontSize(8.5).fillColor("black");
    }
    const yy = doc.y;
    let x = M + 4;
    const cells: Record<string, string> = {
      pos: String(item.position),
      desc: item.description,
      qty: item.quantity.toLocaleString("de-DE"),
      unit: item.unit,
      price: fmtMoney(item.unitPrice, proposal.currency),
      disc: item.discount > 0 ? `${item.discount.toLocaleString("de-DE")} %` : "—",
      total: fmtMoney(item.totalPrice, proposal.currency),
    };
    for (const c of cols) {
      doc.text(cells[c.key], x, yy, { width: c.w - 8, align: c.align });
      x += c.w;
    }
    doc.y = yy + rowH;
    doc.moveTo(M, doc.y - 4).lineTo(W - M, doc.y - 4).strokeColor("#eeeeee").lineWidth(0.5).stroke();
  }

  // ---- Summen ----
  pageBreakIfNeeded(80);
  const vatAmount = proposal.totalNet * (proposal.vatRate / 100);
  const gross = proposal.totalNet + vatAmount;
  const sumX = W - M - 240;
  const sumRow = (label: string, value: string, bold = false) => {
    doc.font(bold ? "Helvetica-Bold" : "Helvetica").fontSize(bold ? 10 : 9).fillColor(bold ? NAVY : "black");
    const yy = doc.y;
    doc.text(label, sumX, yy, { width: 140, align: "right" });
    doc.text(value, sumX + 145, yy, { width: 95, align: "right" });
    doc.moveDown(0.4);
  };
  doc.moveDown(0.5);
  sumRow("Zwischensumme (netto)", fmtMoney(proposal.totalNet, proposal.currency));
  sumRow(
    proposal.vatRate > 0 ? `MwSt. ${proposal.vatRate.toLocaleString("de-DE")} %` : "MwSt. 0 %",
    fmtMoney(vatAmount, proposal.currency),
  );
  doc
    .moveTo(sumX, doc.y)
    .lineTo(W - M, doc.y)
    .strokeColor(NAVY)
    .lineWidth(1)
    .stroke();
  doc.moveDown(0.3);
  sumRow("Gesamtsumme", fmtMoney(gross, proposal.currency), true);
  if (proposal.vatNote) {
    doc.font("Helvetica").fontSize(7.5).fillColor(GREY).text(proposal.vatNote, sumX, doc.y, { width: 240, align: "right" });
  }
  doc.moveDown(1.5);

  // ---- Zahlungsbedingungen ----
  if (terms.length > 0) {
    pageBreakIfNeeded(60 + terms.length * 16);
    doc.font("Helvetica-Bold").fontSize(10).fillColor(NAVY).text("Zahlungsbedingungen", M, doc.y);
    doc.moveDown(0.4);
    for (const t of terms) {
      const yy = doc.y;
      const amount = (proposal.totalNet * (1 + proposal.vatRate / 100) * t.percentage) / 100;
      doc.font("Helvetica-Bold").fontSize(8.5).fillColor("black").text(`${t.installment}. Rate`, M, yy, { width: 50 });
      doc.font("Helvetica").fontSize(8.5).text(`${t.percentage.toLocaleString("de-DE")} %`, M + 55, yy, { width: 45, align: "right" });
      doc.text(fmtMoney(amount, proposal.currency), M + 110, yy, { width: 80, align: "right" });
      const noteW = CONTENT_W - 200;
      const note = [t.description, t.dueDescription].filter(Boolean).join(" — ");
      doc.text(note, M + 200, yy, { width: noteW });
      doc.y = yy + Math.max(doc.heightOfString(note, { width: noteW }), 10) + 6;
    }
    doc.moveDown(1);
  }

  // ---- Abschlusstext ----
  if (proposal.closingText) {
    pageBreakIfNeeded(60);
    doc.font("Helvetica").fontSize(9.5).fillColor("black").text(proposal.closingText, M, doc.y, {
      width: CONTENT_W,
      lineGap: 2,
    });
  }

  const done = new Promise<Buffer>((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });
  doc.end();
  return done;
}
