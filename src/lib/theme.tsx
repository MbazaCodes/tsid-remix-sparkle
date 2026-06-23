import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";
type Lang  = "en" | "sw";

type ThemeCtx = {
  theme: Theme;
  lang: Lang;
  toggleTheme: () => void;
  toggleLang:  () => void;
  t: (key: string) => string;
};

const TRANSLATIONS: Record<Lang, Record<string, string>> = {
  en: {
    home: "Home", verify: "Verify ID", features: "Features", portals: "Portals",
    signin: "Sign in", getstarted: "Get started",
    tagline: "Jamhuri ya Tanzania",
    footer_platform: "Platform", footer_contact: "Contact",
    footer_copy: "Jamhuri ya Muungano wa Tanzania. All rights reserved.",
    nav_dashboard: "Dashboard", nav_students: "Students", nav_schools: "Schools",
    nav_logs: "Audit Logs", nav_create: "Create Student", nav_settings: "Settings",
    nav_myid: "My ID Card", nav_applications: "Applications", nav_payments: "Payments",
    signout: "Sign out",
  },
  sw: {
    home: "Nyumbani", verify: "Thibitisha Kitambulisho", features: "Vipengele", portals: "Milango",
    signin: "Ingia", getstarted: "Anza",
    tagline: "Jamhuri ya Tanzania",
    footer_platform: "Jukwaa", footer_contact: "Mawasiliano",
    footer_copy: "Jamhuri ya Muungano wa Tanzania. Haki zote zimehifadhiwa.",
    nav_dashboard: "Dashibodi", nav_students: "Wanafunzi", nav_schools: "Shule",
    nav_logs: "Kumbukumbu", nav_create: "Unda Mwanafunzi", nav_settings: "Mipangilio",
    nav_myid: "Kitambulisho Changu", nav_applications: "Maombi", nav_payments: "Malipo",
    signout: "Toka",
  },
};

const Ctx = createContext<ThemeCtx>({
  theme: "light", lang: "en",
  toggleTheme: () => {}, toggleLang: () => {},
  t: (k) => k,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() =>
    (typeof window !== "undefined" && (localStorage.getItem("tsid:theme") as Theme)) || "light"
  );
  const [lang, setLang] = useState<Lang>(() =>
    (typeof window !== "undefined" && (localStorage.getItem("tsid:lang") as Lang)) || "en"
  );

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("tsid:theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("tsid:lang", lang);
  }, [lang]);

  function toggleTheme() { setTheme((t) => (t === "light" ? "dark" : "light")); }
  function toggleLang()  { setLang((l) => (l === "en" ? "sw" : "en")); }
  function t(key: string) { return TRANSLATIONS[lang][key] ?? key; }

  return <Ctx.Provider value={{ theme, lang, toggleTheme, toggleLang, t }}>{children}</Ctx.Provider>;
}

export function useTheme() { return useContext(Ctx); }
