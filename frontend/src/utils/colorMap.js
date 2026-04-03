const colorMap = {
  black: "#111111",
  white: "#f8fafc",
  green: "#16a34a",
  red: "#dc2626",
  blue: "#2563eb",
  yellow: "#eab308",
  orange: "#f97316",
  purple: "#7c3aed",
  pink: "#ec4899",
  grey: "#6b7280",
  gray: "#6b7280",
  brown: "#7c4a2d",
  cream: "#f5f1e8",
  beige: "#d6c7b0",
  navy: "#1e3a8a",
  sky: "#38bdf8"
};

export function getColorHex(name = "") {
  const normalized = String(name).trim().toLowerCase();
  return colorMap[normalized] || "#9ca3af";
}
