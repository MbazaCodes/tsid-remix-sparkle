import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { ASSETS } from "@/lib/tsid";

export type IdCardData = {
  tsid_no: string;
  full_name: string;
  school_name?: string | null;
  school_code?: string | null;
  region?: string | null;
  district?: string | null;
  dob?: string | null;
  gender?: string | null;
  nationality?: string | null;
  photo_url?: string | null;
  status?: string | null;
  level?: string | null;
  blood_group?: string | null;
  enrollment_date?: string | null;
  issue_date?: string | null;
  parent_name?: string | null;
  parent_nida?: string | null;
  relationship?: string | null;
  parent_phone?: string | null;
};

function fmtDate(d?: string | null) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
    }).toUpperCase();
  } catch { return d; }
}

/* ── Tanzania Flag SVG inline ─────────────────────────────────────── */
function TzFlag() {
  return (
    <svg viewBox="0 0 60 40" width="44" height="30" style={{ borderRadius: 3, display: "block", flexShrink: 0 }}>
      <rect width="60" height="40" fill="#1EB53A" />
      <polygon points="0,40 60,0 60,14 0,40" fill="#FCD116" />
      <polygon points="0,40 60,0 60,8  0,28" fill="#000000" />
      <polygon points="0,26 46,0 60,0 0,40" fill="#FCD116" />
      <polygon points="0,20 38,0 46,0 0,26" fill="#00A3DD" />
    </svg>
  );
}

/* ── Seal / stamp ─────────────────────────────────────────────────── */
function TsidSeal() {
  return (
    <svg viewBox="0 0 80 80" width="70" height="70">
      <circle cx="40" cy="40" r="38" fill="none" stroke="#1a3a6b" strokeWidth="2" />
      <circle cx="40" cy="40" r="32" fill="none" stroke="#1a3a6b" strokeWidth="1" />
      <text x="40" y="18" textAnchor="middle" fontSize="5.5" fontWeight="700" fill="#1a3a6b"
        style={{ fontFamily: "system-ui" }}>TANZANIA STUDENT</text>
      <text x="40" y="46" textAnchor="middle" fontSize="10" fontWeight="900" fill="#1a3a6b"
        style={{ fontFamily: "system-ui" }}>TSID</text>
      <text x="40" y="63" textAnchor="middle" fontSize="4.5" fontWeight="700" fill="#1a3a6b"
        style={{ fontFamily: "system-ui" }}>IDENTIFICATION</text>
      <text x="40" y="72" textAnchor="middle" fontSize="4.5" fontWeight="700" fill="#1a3a6b"
        style={{ fontFamily: "system-ui" }}>SYSTEM</text>
    </svg>
  );
}

/* ── CARD FRONT ───────────────────────────────────────────────────── */
function CardFront({ data, qr }: { data: IdCardData; qr: string }) {
  const W = 320;

  return (
    <div style={{
      width: W, background: "#fff", borderRadius: 14,
      boxShadow: "0 8px 32px rgba(0,0,0,.18)", overflow: "hidden",
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      color: "#0f172a", userSelect: "none",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0b2d5e 0%, #1a4a8a 100%)",
        padding: "12px 14px 10px",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <img src={ASSETS.coat} alt="" style={{ height: 38, width: 38, objectFit: "contain", flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ color: "#fff", fontWeight: 900, fontSize: 22, lineHeight: 1, letterSpacing: -0.5 }}>TSID</div>
          <div style={{ color: "#a3c4dd", fontSize: 8, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", lineHeight: 1.4 }}>
            Tanzania Student<br />Identification System
          </div>
        </div>
        <TzFlag />
      </div>

      {/* Tanzania flag stripe */}
      <div style={{ height: 5, background: "linear-gradient(to right, #1EB53A 0%,#1EB53A 33%,#FCD116 33%,#FCD116 40%,#000 40%,#000 60%,#FCD116 60%,#FCD116 67%,#00A3DD 67%,#00A3DD 100%)" }} />

      {/* Body */}
      <div style={{ padding: "12px 14px 10px", display: "flex", gap: 12 }}>
        {/* Photo */}
        <div style={{
          width: 82, height: 106, flexShrink: 0, borderRadius: 6,
          border: "2px solid #dce8f5", overflow: "hidden",
          background: "#f0f4fa", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {data.photo_url
            ? <img src={data.photo_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <span style={{ fontSize: 36, opacity: 0.4 }}>👤</span>}
        </div>

        {/* Fields */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom: 6 }}>
            <div style={{ fontSize: 7.5, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.8 }}>TSID NUMBER</div>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#0b2d5e", fontFamily: "ui-monospace, monospace", letterSpacing: 0.5 }}>
              {data.tsid_no}
            </div>
            <div style={{ height: 2, background: "#1EB53A", borderRadius: 1, marginTop: 2, width: "70%" }} />
          </div>

          {[
            ["FULL NAME", (data.full_name || "—").toUpperCase()],
            ["DATE OF BIRTH", fmtDate(data.dob)],
            ["GENDER", (data.gender || "—").toUpperCase()],
            ["NATIONALITY", (data.nationality || "TANZANIAN").toUpperCase()],
          ].map(([label, val]) => (
            <div key={label} style={{ marginBottom: 4 }}>
              <div style={{ fontSize: 7, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.7 }}>{label}</div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "#0f172a", lineHeight: 1.2 }}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* School + QR row */}
      <div style={{
        margin: "0 14px 10px",
        background: "#f0f4fa", borderRadius: 8, padding: "8px 10px",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        {/* School icon */}
        <div style={{
          width: 32, height: 32, borderRadius: 8, background: "#0b2d5e",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 20h20M4 20V10l8-7 8 7v10M9 20v-5h6v5" />
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: "#0b2d5e", lineHeight: 1.2, wordBreak: "break-word" }}>
            {(data.school_name || "—").toUpperCase()}
          </div>
          {data.school_code && (
            <div style={{ fontSize: 8, color: "#64748b", marginTop: 1 }}>
              SCHOOL ID: {data.school_code}
            </div>
          )}
          {data.region && (
            <div style={{ fontSize: 8, color: "#64748b" }}>
              REGION: {data.region.toUpperCase()}
              {data.district ? `   DISTRICT: ${data.district.toUpperCase()}` : ""}
            </div>
          )}
        </div>
        {/* QR */}
        <div style={{ textAlign: "center", flexShrink: 0 }}>
          {qr
            ? <img src={qr} alt="QR" style={{ width: 58, height: 58, borderRadius: 4, border: "1px solid #dce8f5" }} />
            : <div style={{ width: 58, height: 58, background: "#e2e8f0", borderRadius: 4 }} />}
          <div style={{ fontSize: 6.5, fontWeight: 700, color: "#64748b", marginTop: 2, letterSpacing: 0.5 }}>SCAN TO VERIFY</div>
        </div>
      </div>

      {/* Navy footer */}
      <div style={{
        background: "#0b2d5e",
        padding: "8px 14px",
        display: "flex", justifyContent: "space-around", alignItems: "center",
      }}>
        {[
          { icon: "🛡️", label1: "LIFELONG", label2: "STUDENT ID" },
          { icon: "🏛️", label1: "NATIONALLY", label2: "RECOGNIZED" },
          { icon: "✅", label1: "SECURE", label2: "& VERIFIED" },
        ].map(({ icon, label1, label2 }) => (
          <div key={label1} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 14, lineHeight: 1 }}>{icon}</div>
            <div style={{ fontSize: 6.5, color: "#a3c4dd", fontWeight: 700, marginTop: 2, lineHeight: 1.3 }}>
              {label1}<br />{label2}
            </div>
          </div>
        ))}
      </div>

      {/* TZ flag stripe bottom */}
      <div style={{ height: 4, background: "linear-gradient(to right, #1EB53A 0%,#1EB53A 25%,#FCD116 25%,#FCD116 37.5%,#000 37.5%,#000 62.5%,#FCD116 62.5%,#FCD116 75%,#00A3DD 75%,#00A3DD 100%)" }} />
    </div>
  );
}

/* ── CARD BACK ────────────────────────────────────────────────────── */
function CardBack({ data }: { data: IdCardData }) {
  const W = 320;

  return (
    <div style={{
      width: W, background: "#fff", borderRadius: 14,
      boxShadow: "0 8px 32px rgba(0,0,0,.18)", overflow: "hidden",
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      color: "#0f172a", userSelect: "none",
    }}>
      {/* Top header — navy with TSID number */}
      <div style={{
        background: "linear-gradient(135deg, #0b2d5e 0%, #1a4a8a 100%)",
        padding: "12px 16px 10px",
      }}>
        <div style={{ fontSize: 15, fontWeight: 900, color: "#fff", fontFamily: "ui-monospace, monospace", letterSpacing: 0.5 }}>
          {data.tsid_no}
        </div>
        <div style={{ height: 2, background: "#1EB53A", borderRadius: 1, marginTop: 4, width: "60%" }} />
      </div>

      {/* Tanzania flag stripe */}
      <div style={{ height: 4, background: "linear-gradient(to right, #1EB53A 0%,#1EB53A 33%,#FCD116 33%,#FCD116 40%,#000 40%,#000 60%,#FCD116 60%,#FCD116 67%,#00A3DD 67%,#00A3DD 100%)" }} />

      {/* Student information section */}
      <div style={{ padding: "10px 14px 8px" }}>
        <div style={{ fontSize: 9, fontWeight: 800, color: "#0b2d5e", textTransform: "uppercase", letterSpacing: 1, borderBottom: "1.5px solid #1EB53A", paddingBottom: 4, marginBottom: 8 }}>
          Student Information
        </div>
        {[
          ["DATE OF ENROLLMENT", fmtDate(data.enrollment_date)],
          ["CURRENT LEVEL",      (data.level || "—").toUpperCase()],
          ["BLOOD GROUP",        data.blood_group || "—"],
          ["PHONE (GUARDIAN)",   data.parent_phone || "—"],
        ].map(([label, val]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, gap: 8 }}>
            <div style={{ fontSize: 7.5, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, flexShrink: 0 }}>{label}</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#0f172a", textAlign: "right" }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Parent / Guardian section */}
      <div style={{ padding: "0 14px 8px", position: "relative" }}>
        <div style={{ fontSize: 9, fontWeight: 800, color: "#0b2d5e", textTransform: "uppercase", letterSpacing: 1, borderBottom: "1.5px solid #1EB53A", paddingBottom: 4, marginBottom: 8 }}>
          Parent / Guardian
        </div>
        {/* Seal watermark */}
        <div style={{ position: "absolute", right: 14, top: 20, opacity: 0.15 }}>
          <TsidSeal />
        </div>
        {[
          ["NAME",         (data.parent_name || "—").toUpperCase()],
          ["NIDA NUMBER",  data.parent_nida || "—"],
          ["RELATIONSHIP", (data.relationship || "—").toUpperCase()],
          ["PHONE",        data.parent_phone || "—"],
        ].map(([label, val]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, gap: 8 }}>
            <div style={{ fontSize: 7.5, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, flexShrink: 0 }}>{label}</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#0f172a", textAlign: "right", maxWidth: 140 }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Important notice */}
      <div style={{ margin: "0 14px 10px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 6, padding: "7px 10px" }}>
        <div style={{ fontSize: 8, fontWeight: 800, color: "#1EB53A", marginBottom: 4, letterSpacing: 0.5 }}>IMPORTANT</div>
        {[
          "This card is the property of the Government of Tanzania.",
          "It is valid for educational identification nationwide.",
          "Report loss of this card to your school immediately.",
          "This card is not transferable.",
        ].map((t) => (
          <div key={t} style={{ fontSize: 7.5, color: "#374151", marginBottom: 2, display: "flex", gap: 4 }}>
            <span style={{ flexShrink: 0 }}>•</span><span>{t}</span>
          </div>
        ))}
      </div>

      {/* Verification + issued row */}
      <div style={{ padding: "6px 14px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#0b2d5e" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>
          <div>
            <div style={{ fontSize: 7, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>VERIFICATION PORTAL</div>
            <div style={{ fontSize: 8, fontWeight: 800, color: "#0b2d5e" }}>verify.tsid.go.tz</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 7, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>ISSUED ON</div>
          <div style={{ fontSize: 8, fontWeight: 800, color: "#0b2d5e" }}>{fmtDate(data.issue_date)}</div>
        </div>
      </div>

      {/* Dark navy footer */}
      <div style={{
        background: "#0b2d5e", padding: "7px 14px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#a3c4dd" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <div style={{ fontSize: 7, color: "#a3c4dd", lineHeight: 1.4 }}>
            This card contains secure data.<br />Unauthorized use is prohibited by law.
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 7, color: "#a3c4dd", fontWeight: 700 }}>JAMHURI YA MUUNGANO</div>
          <div style={{ fontSize: 7, color: "#a3c4dd", fontWeight: 700 }}>WA TANZANIA</div>
        </div>
      </div>

      {/* TZ flag stripe bottom */}
      <div style={{ height: 4, background: "linear-gradient(to right, #1EB53A 0%,#1EB53A 25%,#FCD116 25%,#FCD116 37.5%,#000 37.5%,#000 62.5%,#FCD116 62.5%,#FCD116 75%,#00A3DD 75%,#00A3DD 100%)" }} />
    </div>
  );
}

/* ── Main export ──────────────────────────────────────────────────── */
export function IdCard({ data, showBack = true, downloadable = true }: {
  data: IdCardData;
  showBack?: boolean;
  downloadable?: boolean;
}) {
  const [qr, setQr] = useState<string>("");
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef  = useRef<HTMLDivElement>(null);

  const verifyUrl = typeof window !== "undefined"
    ? `${window.location.origin}/search?id=${encodeURIComponent(data.tsid_no)}`
    : `https://verify.tsid.go.tz/search?id=${data.tsid_no}`;

  useEffect(() => {
    QRCode.toDataURL(verifyUrl, {
      margin: 1, width: 180,
      color: { dark: "#0b2d5e", light: "#ffffff" },
    }).then(setQr).catch(() => setQr(""));
  }, [verifyUrl]);

  async function downloadSide(ref: React.RefObject<HTMLDivElement | null>, label: string) {
    if (!ref.current) return;
    const png = await toPng(ref.current, { pixelRatio: 3, cacheBust: true });
    const a = document.createElement("a");
    a.href = png;
    a.download = `TSID-${data.tsid_no}-${label}.png`;
    a.click();
  }

  return (
    <div className="space-y-6">
      {/* Front */}
      <div>
        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">FRONT</div>
        <div ref={frontRef}>
          <CardFront data={data} qr={qr} />
        </div>
        {downloadable && (
          <Button onClick={() => downloadSide(frontRef, "FRONT")} variant="secondary" size="sm" className="mt-2">
            <Download className="h-4 w-4 mr-2" /> Download Front
          </Button>
        )}
      </div>

      {/* Back */}
      {showBack && (
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">BACK</div>
          <div ref={backRef}>
            <CardBack data={data} />
          </div>
          {downloadable && (
            <Button onClick={() => downloadSide(backRef, "BACK")} variant="secondary" size="sm" className="mt-2">
              <Download className="h-4 w-4 mr-2" /> Download Back
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
