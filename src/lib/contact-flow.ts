/**
 * Shared definition of the card-based contact flow.
 * Used by the client wizard (UI + i18n keys) and by the API route
 * (validation + Spanish labels for the notification email), so the two
 * cannot drift apart.
 */

export const WHATSAPP_PHONE = "56992576688";

export const OPTIONS = {
  bottleneck: [
    "manual",
    "visibility",
    "people",
    "disconnected",
    "customers",
    "other",
  ],
  processes: [
    "sales",
    "inventory",
    "billing",
    "support",
    "operations",
    "reporting",
    "team",
    "other",
  ],
  tools: ["sheets", "messaging", "generic", "legacy", "paper", "none"],
  build: ["internal", "portal", "dashboard", "automation", "web", "unsure"],
  timing: ["asap", "quarter", "semester", "exploring"],
} as const;

export type OptionField = keyof typeof OPTIONS;
export type OptionKey<F extends OptionField> = (typeof OPTIONS)[F][number];

/** Choosing one of these in a multi-select clears the other choices. */
export const EXCLUSIVE: Partial<Record<OptionField, string>> = {
  tools: "none",
  build: "unsure",
};

export type Answers = {
  bottleneck: string;
  bottleneckNote: string;
  processes: string[];
  processesNote: string;
  tools: string[];
  build: string[];
  goal: string;
  timing: string;
};

export const EMPTY_ANSWERS: Answers = {
  bottleneck: "",
  bottleneckNote: "",
  processes: [],
  processesNote: "",
  tools: [],
  build: [],
  goal: "",
  timing: "",
};

export type StepId =
  | "bottleneck"
  | "processes"
  | "tools"
  | "build"
  | "goal"
  | "timing"
  | "contact";

export type Step = {
  id: StepId;
  kind: "single" | "multi" | "text" | "contact";
  required: boolean;
  /** Choice steps that also offer a free-text note under the options. */
  note?: "bottleneckNote" | "processesNote";
};

export const STEPS: readonly Step[] = [
  { id: "bottleneck", kind: "single", required: true, note: "bottleneckNote" },
  { id: "processes", kind: "multi", required: true, note: "processesNote" },
  { id: "tools", kind: "multi", required: false },
  { id: "build", kind: "multi", required: true },
  { id: "goal", kind: "text", required: false },
  { id: "timing", kind: "single", required: false },
  { id: "contact", kind: "contact", required: true },
];

export const LIMITS = {
  note: 600,
  goal: 1200,
  name: 120,
  company: 120,
  email: 200,
} as const;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Spanish labels, used only for the notification email sent to the team. */
export const EMAIL_QUESTIONS: Record<Exclude<StepId, "contact">, string> = {
  bottleneck: "Principal cuello de botella",
  processes: "Procesos a mejorar",
  tools: "Cómo lo gestionan hoy",
  build: "Qué creen que necesitan",
  goal: "Qué cambiaría si sale bien",
  timing: "Plazo",
};

export const EMAIL_NOTES = {
  bottleneckNote: "Detalle del cuello de botella",
  processesNote: "Cómo funciona hoy el proceso",
} as const;

export const EMAIL_LABELS: {
  [F in OptionField]: Record<OptionKey<F>, string>;
} = {
  bottleneck: {
    manual: "Mucho trabajo manual y planillas",
    visibility: "No ven los números a tiempo",
    people: "Todo depende de pocas personas",
    disconnected: "Sus herramientas no conversan entre sí",
    customers: "Atender y vender a clientes los desborda",
    other: "Otro",
  },
  processes: {
    sales: "Ventas y pedidos",
    inventory: "Inventario y compras",
    billing: "Facturación y cobranza",
    support: "Atención y postventa",
    operations: "Producción y operación",
    reporting: "Reportes e indicadores",
    team: "Gestión de equipo y tareas",
    other: "Otro",
  },
  tools: {
    sheets: "Planillas (Excel, Google Sheets)",
    messaging: "WhatsApp y correo",
    generic: "Un software genérico (ERP, CRM, etc.)",
    legacy: "Un sistema propio antiguo",
    paper: "Papel y cuadernos",
    none: "Nada formal todavía",
  },
  build: {
    internal: "Un sistema interno para su equipo",
    portal: "Un portal o plataforma para sus clientes",
    dashboard: "Dashboards y reportes",
    automation: "Automatizar tareas e integrar herramientas",
    web: "Un sitio web o landing",
    unsure: "No lo saben aún, quieren ayuda para definirlo",
  },
  timing: {
    asap: "Lo antes posible",
    quarter: "En 1 a 3 meses",
    semester: "En 3 a 6 meses",
    exploring: "Está explorando",
  },
};
