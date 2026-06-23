import tsidLogo from "@/assets/tsid-logo.png.asset.json";
import tzFlag from "@/assets/tz-flag.png.asset.json";
import tzCoat from "@/assets/tz-coat.png.asset.json";

export const ASSETS = {
  logo: tsidLogo.url,
  flag: tzFlag.url,
  coat: tzCoat.url,
};

export function generateTsidNo() {
  const year = new Date().getFullYear().toString().slice(-2);
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `TSID-${year}-${rand}`;
}

export type Role = "gov" | "school" | "student";

export function roleHome(role: Role | null | undefined): string {
  if (role === "gov") return "/gov";
  if (role === "school") return "/school";
  if (role === "student") return "/student";
  return "/auth";
}