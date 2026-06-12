import { db, schema, sqlite } from "./db.js";

type ItemSeed = {
  name: string;
  description: string;
  descriptionEn?: string;
  unit: string;
  sellPrice: number;
  buyPrice: number;
  duration?: string;
  trainersRequired?: number;
  maxParticipants?: number;
  location?: string;
  availableMonths?: string; // leer/undefined = alle Monate
  tags?: string;
};

const ALL = ""; // verfügbar in allen Monaten

const catalog: Record<string, ItemSeed[]> = {
  "Training Module": [
    { name: "Course Programme (Pauschal)", description: "Forensische Identifizierung – Gesamtcurriculum", descriptionEn: "Forensic identification – complete curriculum", unit: "pauschal", sellPrice: 20000, buyPrice: 0, trainersRequired: 0, maxParticipants: 30, location: "Variabel", availableMonths: ALL, tags: "curriculum,programme,identification" },
    { name: "Body Donor Recovery Training", description: "Praktische Bergung unter realen Bedingungen mit Körperspendern", descriptionEn: "Practical recovery under real conditions with body donors", unit: "Tag", sellPrice: 7500, buyPrice: 5000, duration: "1 Tag", trainersRequired: 3, maxParticipants: 25, location: "ETAF Weeze", availableMonths: "3,4,5,6,9,10,11", tags: "body,recovery,bergung,donor,field" },
    { name: "Fingerprint & DNA Collection", description: "PM-Identifizierung: Abnahme, Sicherung, Dokumentation", descriptionEn: "PM identification: collection, preservation, documentation", unit: "Tag", sellPrice: 5000, buyPrice: 3000, duration: "1 Tag", trainersRequired: 2, maxParticipants: 25, location: "ETAF Weeze", availableMonths: ALL, tags: "fingerprint,dna,forensic,pm,identification" },
    { name: "Forensic Odontology Module", description: "Zahnärztliche Identifizierung (AM/PM-Abgleich)", descriptionEn: "Dental identification (AM/PM reconciliation)", unit: "Tag", sellPrice: 6000, buyPrice: 4000, duration: "1 Tag", trainersRequired: 2, maxParticipants: 20, location: "ETAF Weeze", availableMonths: ALL, tags: "odontology,dental,teeth,am,pm" },
    { name: "ATLAS Software Training", description: "Digitaler Zwilling, Chain of Custody, KI-Workflows", descriptionEn: "Digital twin, chain of custody, AI workflows", unit: "Tag", sellPrice: 4500, buyPrice: 0, duration: "1 Tag", trainersRequired: 1, maxParticipants: 30, location: "Variabel", availableMonths: ALL, tags: "atlas,software,digital,chain of custody,ki,ai" },
    { name: "Crime Scene Investigation (CSI)", description: "Tatort-Sicherung, Beweiskette, Dokumentation", descriptionEn: "Crime scene preservation, chain of evidence, documentation", unit: "Tag", sellPrice: 5500, buyPrice: 3500, duration: "1 Tag", trainersRequired: 3, maxParticipants: 25, location: "ETAF Weeze", availableMonths: ALL, tags: "csi,crime scene,tatort,evidence" },
    { name: "Family Liaison Officer Training", description: "Angehörigenbetreuung, Kommunikation, psychologische Aspekte", descriptionEn: "Family liaison, communication, psychological aspects", unit: "Tag", sellPrice: 4000, buyPrice: 2500, duration: "1 Tag", trainersRequired: 2, maxParticipants: 20, location: "Variabel", availableMonths: ALL, tags: "family,liaison,psychology,communication" },
    { name: "DVI Command & Control", description: "Bronze/Silver/Gold Kommandostruktur, Einsatzleitung", descriptionEn: "Bronze/Silver/Gold command structure, incident command", unit: "Tag", sellPrice: 5000, buyPrice: 3000, duration: "1 Tag", trainersRequired: 2, maxParticipants: 30, location: "Variabel", availableMonths: ALL, tags: "command,control,leadership,einsatzleitung" },
    { name: "Mass Fatality Tabletop Exercise", description: "Planspiel Großschadenslage (Theorie + Simulation)", descriptionEn: "Mass fatality tabletop exercise (theory + simulation)", unit: "Tag", sellPrice: 6000, buyPrice: 2000, duration: "1 Tag", trainersRequired: 2, maxParticipants: 30, location: "Variabel", availableMonths: ALL, tags: "tabletop,exercise,mass fatality,simulation,planspiel" },
    { name: "Certification Exam (Theory + Practical)", description: "Abschlussprüfung mit Zertifizierung", descriptionEn: "Final examination with certification", unit: "Tag", sellPrice: 3000, buyPrice: 500, duration: "1 Tag", trainersRequired: 3, maxParticipants: 30, location: "Variabel", availableMonths: ALL, tags: "exam,certification,zertifikat,prüfung" },
    { name: "Subject Matter Expert (SME)", description: "Fachexperte für spezifisches Modul", descriptionEn: "Subject matter expert for a specific module", unit: "Stück", sellPrice: 5000, buyPrice: 3500, trainersRequired: 1, location: "Variabel", availableMonths: ALL, tags: "sme,expert,trainer" },
    { name: "SME Deployment & Logistics", description: "Flug, Transfer, Unterbringung pro Experte", descriptionEn: "Flight, transfer, accommodation per expert", unit: "Stück", sellPrice: 2000, buyPrice: 2000, trainersRequired: 0, availableMonths: ALL, tags: "sme,deployment,logistics,flight,travel" },
    { name: "Mock Training (ohne Body Donors)", description: "Simulationsübung ohne Körperspender", descriptionEn: "Simulation exercise without body donors", unit: "Tag", sellPrice: 4500, buyPrice: 2500, duration: "1 Tag", trainersRequired: 3, maxParticipants: 25, location: "Variabel", availableMonths: ALL, tags: "mock,simulation,training" },
    { name: "Theory / Workshop Module", description: "Theoretische Vertiefung, Strategie-Workshop", descriptionEn: "Theoretical deep-dive, strategy workshop", unit: "Tag", sellPrice: 3500, buyPrice: 1500, duration: "1 Tag", trainersRequired: 2, maxParticipants: 30, location: "Variabel", availableMonths: ALL, tags: "theory,workshop,strategy" },
  ],
  "Hotel & Accommodation": [
    { name: "Schloss Hertefeld (25 Pers.)", description: "Exklusive Unterkunft, historisches Schloss", descriptionEn: "Exclusive accommodation, historic castle", unit: "Nacht", sellPrice: 3750, buyPrice: 3645, maxParticipants: 25, location: "Weeze", availableMonths: ALL, tags: "hotel,accommodation,castle,weeze,schloss" },
    { name: "Living Hotels Düsseldorf (25 Pers.)", description: "Premium-Stadthotel, zentrale Lage", descriptionEn: "Premium city hotel, central location", unit: "Nacht", sellPrice: 4500, buyPrice: 4100, maxParticipants: 25, location: "Düsseldorf", availableMonths: ALL, tags: "hotel,accommodation,düsseldorf,city" },
    { name: "Elaya Hotel (30 Pers.)", description: "Business-Hotel mit Tagungsräumen", descriptionEn: "Business hotel with conference rooms", unit: "Nacht", sellPrice: 3000, buyPrice: 2800, maxParticipants: 30, location: "Weeze", availableMonths: ALL, tags: "hotel,accommodation,weeze,business" },
    { name: "Conference Room Schloss Hertefeld", description: "Tagungsraum im Schloss", descriptionEn: "Conference room at the castle", unit: "Tag", sellPrice: 3500, buyPrice: 2880, location: "Weeze", availableMonths: ALL, tags: "conference,meeting,room,weeze" },
  ],
  "Hardware & Technology": [
    { name: "ATLAS DVI/CSI License", description: "Software-Lizenz für Trainingsperiode", descriptionEn: "Software licence for the training period", unit: "Woche", sellPrice: 3750, buyPrice: 0, availableMonths: ALL, tags: "atlas,license,software" },
    { name: "MA-1 Mobile Identification Line", description: "15m Container-Einheit (Miete)", descriptionEn: "15m container unit (rental)", unit: "Stück", sellPrice: 5000, buyPrice: 0, availableMonths: ALL, tags: "ma-1,container,mobile,identification" },
    { name: "DVI Kit (Pre-coded)", description: "Komplettes DVI-Kit integriert mit ATLAS", descriptionEn: "Complete DVI kit integrated with ATLAS", unit: "Stück", sellPrice: 2500, buyPrice: 1200, availableMonths: ALL, tags: "kit,dvi,equipment" },
    { name: "Materials & Consumables Package", description: "Verbrauchsmaterial, Schutzausrüstung", descriptionEn: "Consumables, protective equipment", unit: "pauschal", sellPrice: 5000, buyPrice: 2500, availableMonths: ALL, tags: "materials,consumables,ppe" },
  ],
  "Logistics & Catering": [
    { name: "Shuttle Service (max. 30 Pers.)", description: "Transfer Hotel ↔ Trainingsgelände", descriptionEn: "Transfer hotel ↔ training ground", unit: "pauschal", sellPrice: 13500, buyPrice: 11500, maxParticipants: 30, availableMonths: ALL, tags: "shuttle,transfer,transport" },
    { name: "Exclusive Evening Catering (Halal)", description: "Abendessen, Halal-konform", descriptionEn: "Dinner, halal-compliant", unit: "Tag", sellPrice: 2750, buyPrice: 2400, availableMonths: ALL, tags: "catering,halal,dinner,food" },
    { name: "Lunch & Coffee ETAF Weeze", description: "Mittagessen + Kaffeepausen auf dem Gelände", descriptionEn: "Lunch + coffee breaks on site", unit: "pauschal", sellPrice: 5500, buyPrice: 4663, location: "Weeze", availableMonths: ALL, tags: "catering,lunch,coffee,food" },
    { name: "Infrastructure (Water, Electricity)", description: "Versorgungsanschlüsse Trainingsgelände", descriptionEn: "Utility connections training ground", unit: "pauschal", sellPrice: 2750, buyPrice: 2750, location: "Weeze", availableMonths: ALL, tags: "infrastructure,water,electricity" },
    { name: "USAR Supervisor Area", description: "Überwachungsbereich ETAF Weeze", descriptionEn: "Supervision area ETAF Weeze", unit: "pauschal", sellPrice: 5500, buyPrice: 5500, location: "Weeze", availableMonths: ALL, tags: "usar,supervisor,area" },
    { name: "Training Venue ETAF Weeze", description: "Nutzung Trainingsgelände", descriptionEn: "Use of the training ground", unit: "Tag", sellPrice: 2000, buyPrice: 1840, location: "Weeze", availableMonths: ALL, tags: "venue,training ground,weeze,location" },
  ],
};

const seedCustomers = [
  { name: "Abu Dhabi Police", country: "VAE", city: "Abu Dhabi", notes: "DVI Unit" },
  { name: "OSSENTIA / Ministry of Justice", country: "Saudi-Arabien", city: "Riyadh", notes: "Procurement" },
  { name: "LKA Nordrhein-Westfalen", country: "Deutschland", city: "Düsseldorf", notes: "Kriminaltechnik" },
  { name: "Interpol", country: "Frankreich", city: "Lyon", notes: "DVI Standing Committee" },
];

export function seedIfEmpty() {
  const count = sqlite.prepare("SELECT COUNT(*) AS c FROM catalog_categories").get() as { c: number };
  if (count.c === 0) {
    let catSort = 0;
    for (const [catName, items] of Object.entries(catalog)) {
      const cat = db
        .insert(schema.catalogCategories)
        .values({ name: catName, sortOrder: catSort++ })
        .returning()
        .get();
      let itemSort = 0;
      for (const item of items) {
        db.insert(schema.catalogItems)
          .values({ ...item, categoryId: cat.id, sortOrder: itemSort++ })
          .run();
      }
    }
  }

  const custCount = sqlite.prepare("SELECT COUNT(*) AS c FROM customers").get() as { c: number };
  if (custCount.c === 0) {
    for (const c of seedCustomers) {
      const row = db.insert(schema.customers).values(c).returning()
        .get();
      if (c.name.startsWith("OSSENTIA")) {
        db.insert(schema.contacts)
          .values({
            customerId: row.id,
            firstName: "Sarah",
            lastName: "AlGhamdi",
            role: "Procurement Officer",
            isPrimary: true,
          })
          .run();
      }
    }
  }

  const settingsCount = sqlite.prepare("SELECT COUNT(*) AS c FROM settings").get() as { c: number };
  if (settingsCount.c === 0) {
    db.insert(schema.settings)
      .values({
        companyName: "DVI-Systems / ETAF DVI",
        companyAddress: "ETAF Trainingsgelände\n47652 Weeze, Deutschland",
      })
      .run();
  }
}
