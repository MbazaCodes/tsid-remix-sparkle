import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/tsid/site-header";
import { SiteFooter } from "@/components/tsid/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IdCard } from "@/components/tsid/id-card";
import { Search as SearchIcon, AlertCircle, BadgeCheck } from "lucide-react";

const sp = z.object({ id: z.string().optional() });

export const Route = createFileRoute("/search")({
  validateSearch: sp,
  head: () => ({ meta: [
    { title: "Verify a student ID — TSID" },
    { name: "description", content: "Look up any Tanzania Student ID number and instantly verify whether it is genuine." },
    { property: "og:title", content: "Verify a student ID — TSID" },
    { property: "og:description", content: "Instantly verify any TSID number." },
  ]}),
  component: SearchPage,
});

type Result = { tsid_no: string; full_name: string; status: string; photo_url: string | null; school_name: string | null; region: string | null } | null;

function SearchPage() {
  const { id } = Route.useSearch();
  const [q, setQ] = useState(id ?? "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const [searched, setSearched] = useState(false);

  async function run(value: string) {
    if (!value.trim()) return;
    setLoading(true); setSearched(true);
    const { data, error } = await supabase.rpc("search_student", { _tsid_no: value.trim() });
    setLoading(false);
    if (error) { setResult(null); return; }
    setResult((data?.[0] as Result) ?? null);
  }

  useEffect(() => { if (id) run(id); /* eslint-disable-next-line */ }, [id]);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-3xl w-full px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-primary" style={{ fontFamily: "var(--font-display)" }}>Verify a student ID</h1>
        <p className="mt-2 text-muted-foreground">Enter a TSID number (e.g. <span className="font-mono">TSID-26-100482</span>) to check whether it is genuine.</p>
        <form onSubmit={(e) => { e.preventDefault(); run(q); }} className="mt-6 flex gap-2">
          <Input placeholder="TSID-YY-XXXXXX" value={q} onChange={(e) => setQ(e.target.value)} className="font-mono" />
          <Button type="submit" disabled={loading}><SearchIcon className="h-4 w-4 mr-2" /> {loading ? "Searching…" : "Search"}</Button>
        </form>

        {searched && !loading && (
          <div className="mt-8">
            {result ? (
              <div className="rounded-2xl border bg-card p-6">
                <div className="flex items-center gap-2 text-[color:var(--tz-green)] font-semibold"><BadgeCheck className="h-5 w-5" /> Verified record</div>
                <div className="mt-4">
                  <IdCard data={{ ...result, dob: null, gender: null }} />
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/5 text-destructive p-6 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 mt-0.5" />
                <div>
                  <div className="font-semibold">No record found</div>
                  <div className="text-sm opacity-90">This TSID number is not registered in the national database.</div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}