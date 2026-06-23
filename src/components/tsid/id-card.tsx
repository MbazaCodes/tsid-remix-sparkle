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
  region?: string | null;
  dob?: string | null;
  gender?: string | null;
  photo_url?: string | null;
  status?: string | null;
};

export function IdCard({ data }: { data: IdCardData }) {
  const [qr, setQr] = useState<string>("");
  const ref = useRef<HTMLDivElement>(null);
  const verifyUrl = typeof window !== "undefined"
    ? `${window.location.origin}/search?id=${encodeURIComponent(data.tsid_no)}`
    : `/search?id=${data.tsid_no}`;

  useEffect(() => {
    QRCode.toDataURL(verifyUrl, { margin: 1, width: 180, color: { dark: "#0b3d7a", light: "#ffffff" } })
      .then(setQr).catch(() => setQr(""));
  }, [verifyUrl]);

  async function download() {
    if (!ref.current) return;
    const png = await toPng(ref.current, { pixelRatio: 3, cacheBust: true });
    const a = document.createElement("a");
    a.href = png;
    a.download = `TSID-${data.tsid_no}.png`;
    a.click();
  }

  return (
    <div className="space-y-3">
      <div ref={ref} className="id-card-front w-[420px] max-w-full rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-5 pt-4 pb-2 flex items-center gap-2 bg-black/20">
          <img src={ASSETS.coat} alt="" className="h-8 w-8" />
          <div className="text-[10px] leading-tight uppercase tracking-widest">
            <div className="font-bold">Jamhuri ya Muungano wa Tanzania</div>
            <div className="opacity-80">Student Identification Card</div>
          </div>
          <img src={ASSETS.logo} alt="" className="h-9 w-9 ml-auto" />
        </div>
        <div className="px-5 py-4 flex gap-4">
          <div className="h-24 w-20 rounded bg-white/20 overflow-hidden flex items-center justify-center text-xs">
            {data.photo_url ? (
              <img src={data.photo_url} alt={data.full_name} className="h-full w-full object-cover" />
            ) : (
              <span className="opacity-70">PHOTO</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-widest opacity-70">Full name</div>
            <div className="font-semibold text-lg leading-tight truncate">{data.full_name}</div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
              <div><div className="opacity-60 uppercase tracking-wider">TSID No.</div><div className="font-mono">{data.tsid_no}</div></div>
              <div><div className="opacity-60 uppercase tracking-wider">Status</div><div className="capitalize">{data.status ?? "active"}</div></div>
              <div><div className="opacity-60 uppercase tracking-wider">DOB</div><div>{data.dob ?? "—"}</div></div>
              <div><div className="opacity-60 uppercase tracking-wider">Sex</div><div>{data.gender ?? "—"}</div></div>
            </div>
          </div>
          {qr && <img src={qr} alt="QR" className="h-20 w-20 bg-white rounded p-1" />}
        </div>
        <div className="px-5 pb-4 text-[10px] flex justify-between items-end opacity-90">
          <div>
            <div className="opacity-70 uppercase tracking-wider">School</div>
            <div className="font-semibold">{data.school_name ?? "—"}</div>
            <div className="opacity-70">{data.region ?? ""}</div>
          </div>
          <div className="text-right opacity-70">Uhuru na Umoja</div>
        </div>
      </div>
      <Button onClick={download} variant="secondary" size="sm"><Download className="h-4 w-4 mr-2" /> Download PNG</Button>
    </div>
  );
}