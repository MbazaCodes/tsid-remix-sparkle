import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "@/lib/theme";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Eye, EyeOff, Copy, Download } from "lucide-react";
import { generateTsidNo } from "@/lib/tsid";

export const Route = createFileRoute("/_authenticated/school/students")({ component: Page });

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function genStudentPassword() {
  return "St" + Math.random().toString(36).slice(2, 8).toUpperCase() + "#";
}

function Page() {
  const me = useCurrentUser();
  const { t } = useTheme();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data: school } = useQuery({
    enabled: !!me.schoolId,
    queryKey: ["school", me.schoolId],
    queryFn: async () =>
      (await supabase.from("schools").select("*").eq("id", me.schoolId!).maybeSingle()).data,
  });

  const { data: students = [] } = useQuery({
    enabled: !!me.schoolId,
    queryKey: ["school-students", me.schoolId],
    queryFn: async () =>
      (await supabase.from("students").select("*")
        .eq("school_id", me.schoolId!)
        .order("created_at", { ascending: false }))
        .data ?? [],
  });

  const filtered = students.filter((s: { full_name: string; tsid_no: string }) => {
    const q = search.toLowerCase();
    return !q || s.full_name.toLowerCase().includes(q) || s.tsid_no.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: "var(--font-display)" }}>
            Student Database
          </h1>
          <p className="text-sm text-muted-foreground">
            {students.length} student{students.length !== 1 ? "s" : ""} registered
            {school ? ` · ${school.name}` : ""}
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary" disabled={!me.schoolId}>
              <Plus className="h-4 w-4 mr-2" /> Create student
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Register New Student</DialogTitle></DialogHeader>
            {school && (
              <CreateStudentForm
                school={school}
                actorName={me.fullName ?? "School Admin"}
                onDone={() => { setOpen(false); qc.invalidateQueries({ queryKey: ["school-students"] }); }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Input
        className="max-w-sm"
        placeholder={t("search_student")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Photo</th>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Level</th>
                <th className="px-4 py-3">DOB / Gender</th>
                <th className="px-4 py-3">Login</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((st: {
                id: string; tsid_no: string; full_name: string; dob?: string | null;
                gender?: string | null; photo_url?: string | null; status: string;
                level?: string | null; cred_username?: string | null; cred_password?: string | null;
              }) => (
                <StudentRow key={st.id} student={st} />
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  {search ? "No students match your search." : 'No students yet. Click t("create_student_btn") to register one.'}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StudentRow({ student }: {
  student: {
    id: string; tsid_no: string; full_name: string; dob?: string | null;
    gender?: string | null; photo_url?: string | null; status: string;
    level?: string | null; cred_username?: string | null; cred_password?: string | null;
  };
}) {
  const [showPass, setShowPass] = useState(false);
  function copy(text: string) {
    navigator.clipboard.writeText(text).then(
        () => toast.success("Copied!"),
        () => toast.error("Could not copy — please copy manually.")
      );
  }
  return (
    <tr className="border-t hover:bg-muted/20">
      <td className="px-4 py-2">
        {student.photo_url
          ? <img src={student.photo_url} className="w-9 h-12 object-cover rounded-md border" alt="" />
          : <div className="w-9 h-12 rounded-md border bg-muted flex items-center justify-center text-lg">👤</div>}
      </td>
      <td className="px-4 py-3">
        <div className="font-semibold">{student.full_name}</div>
        <div className="text-xs font-mono text-muted-foreground">{student.tsid_no}</div>
      </td>
      <td className="px-4 py-3 text-sm">{student.level ?? "—"}</td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{student.dob ?? "—"} · {student.gender ?? "—"}</td>
      <td className="px-4 py-3">
        {student.cred_username ? (
          <div className="flex items-center gap-1 text-xs font-mono">
            <span className="text-foreground font-medium">{student.cred_username}</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-primary">{showPass ? student.cred_password : "••••••"}</span>
            <button onClick={() => setShowPass(!showPass)} className="text-muted-foreground hover:text-foreground ml-0.5">
              {showPass ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </button>
            {showPass && student.cred_password && (
              <button onClick={() => copy(`Email: ${student.cred_username}\nPassword: ${student.cred_password}`)}>
                <Copy className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
        ) : <span className="text-xs text-muted-foreground italic">—</span>}
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
          student.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
        }`}>
          {student.status}
        </span>
      </td>
    </tr>
  );
}

function CreateStudentForm({
  school,
  actorName,
  onDone,
}: {
  school: {
    id: string; name: string; code: string; region?: string;
    district?: string; ward?: string; contact_phone?: string;
  };
  actorName: string;
  onDone: () => void;
}) {
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState(t("male"));
  const [nationality, setNationality] = useState("Tanzanian");
  const [level, setLevel] = useState("");
  const [enrollmentDate, setEnrollmentDate] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().slice(0, 10));
  const [parentName, setParentName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [parentNida, setParentNida] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [credEmail, setCredEmail] = useState("");
  const [credPassword, setCredPassword] = useState(genStudentPassword());
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [issued, setIssued] = useState<{ tsid: string; email: string; password: string } | null>(null);

  const tsidNo = useState(() => generateTsidNo())[0];

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("Photo must be under 2 MB."); return; }
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName || !dob || !gender) {
      toast.error("Full name, date of birth and gender are required.");
      return;
    }
    setLoading(true);

    let photoUrl: string | null = null;

    // Upload photo if provided
    if (photoFile) {
      const path = `students/${tsidNo}-${Date.now()}`;
      const { error: uploadErr } = await supabase.storage
        .from("student-photos")
        .upload(path, photoFile, { upsert: true });
      if (!uploadErr) {
        const { data: pub } = supabase.storage.from("student-photos").getPublicUrl(path);
        photoUrl = pub.publicUrl;
      }
    }

    // Insert student
    const { data: student, error: studentErr } = await supabase
      .from("students")
      .insert({
        tsid_no: tsidNo,
        full_name: fullName,
        dob: dob || null,
        gender,
        school_id: school.id,
        photo_url: photoUrl,
        status: "active",
        // Extended fields from migration
        nationality,
        school_code: school.code,
        school_name: school.name,
        region: school.region ?? null,
        district: school.district ?? null,
        ward: school.ward ?? null,
        school_contact: school.contact_phone ?? null,
        enrollment_date: enrollmentDate || null,
        level: level || null,
        blood_group: bloodGroup || null,
        issue_date: issueDate || null,
        parent_name: parentName || null,
        parent_nida: parentNida || null,
        relationship: relationship || null,
        parent_phone: parentPhone || null,
        cred_username: credEmail || null,
        cred_password: credEmail ? credPassword : null,
        remarks: [],
      } as object)
      .select()
      .maybeSingle();

    if (studentErr || !student) {
      toast.error(studentErr?.message ?? "Failed to create student.");
      setLoading(false);
      return;
    }

    // Log
    await supabase.from("activity_logs").insert({
      action: "student:create",
      message: `Created student ${tsidNo} (${fullName}) at ${school.name}`,
      by_name: actorName,
      by_role: "school",
    }).then(() => {});

    setLoading(false);
    setIssued({ tsid: tsidNo, email: credEmail, password: credPassword });
    toast.success(`✅ Student ${tsidNo} created!`);
  }

  if (issued) {
    return (
      <div className="space-y-4 py-2">
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-5">
          <div className="font-bold text-emerald-800 mb-3">✅ Student registered — share login credentials</div>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">TSID Number</span><strong className="text-primary">{issued.tsid}</strong></div>
            {issued.email && <>
              <div className="flex justify-between"><span className="text-muted-foreground">Login Email</span><strong>{issued.email}</strong></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Password</span><strong>{issued.password}</strong></div>
            </>}
          </div>
          {issued.email && (
            <Button className="mt-4 w-full" variant="outline" onClick={() => {
              navigator.clipboard.writeText(`TSID: ${issued.tsid}\nEmail: ${issued.email}\nPassword: ${issued.password}`);
              toast.success("Copied!");
            }}>
              <Copy className="h-4 w-4 mr-2" /> Copy credentials
            </Button>
          )}
        </div>
        <Button className="w-full bg-primary" onClick={onDone}>Done</Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6 py-2">
      {/* Student info */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Student Information</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>TSID Number</Label>
            <Input value={tsidNo} readOnly className="font-mono text-primary font-bold bg-muted/50" />
          </div>
          <div className="space-y-1.5">
            <Label>Full Name *</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Juma A. Mwanza" required />
          </div>
          <div className="space-y-1.5">
            <Label>Date of Birth *</Label>
            <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>Gender *</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">{t("male")}</SelectItem>
                <SelectItem value="Female">{t("female")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Nationality</Label>
            <Input value={nationality} onChange={(e) => setNationality(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Blood Group</Label>
            <Select value={bloodGroup} onValueChange={setBloodGroup}>
              <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
              <SelectContent>{BLOOD_GROUPS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        {/* Photo */}
        <div className="mt-4 flex gap-4 items-start">
          <div
            className="w-24 h-32 rounded-lg border-2 border-dashed border-border bg-muted flex items-center justify-center overflow-hidden flex-shrink-0 cursor-pointer hover:border-primary/40 transition"
            onClick={() => document.getElementById("photoInput")?.click()}
          >
            {photoPreview
              ? <img src={photoPreview} className="w-full h-full object-cover" alt="" />
              : <span className="text-3xl">👤</span>}
          </div>
          <div className="space-y-2">
            <input id="photoInput" type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("photoInput")?.click()}>
              📁 Choose photo
            </Button>
            <p className="text-xs text-muted-foreground leading-relaxed">
              JPG / PNG / WebP · max 2 MB<br />
              Passport-style, clear face<br />
              Will appear on the ID card
            </p>
            {photoFile && <p className="text-xs font-medium text-primary">✓ {photoFile.name}</p>}
          </div>
        </div>
      </div>

      {/* Academic info */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Academic Information</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Current Level</Label>
            <Input value={level} onChange={(e) => setLevel(e.target.value)} placeholder="e.g. Form 2 / Standard 4 / Year 1" />
          </div>
          <div className="space-y-1.5">
            <Label>Enrollment Date</Label>
            <Input type="date" value={enrollmentDate} onChange={(e) => setEnrollmentDate(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Issue Date</Label>
            <Input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Parent / Guardian */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Parent / Guardian</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Parent / Guardian Name</Label>
            <Input value={parentName} onChange={(e) => setParentName(e.target.value)} placeholder="e.g. Aishatu Juma" />
          </div>
          <div className="space-y-1.5">
            <Label>Relationship</Label>
            <Input value={relationship} onChange={(e) => setRelationship(e.target.value)} placeholder="Mother / Father / Guardian" />
          </div>
          <div className="space-y-1.5">
            <Label>Parent NIDA</Label>
            <Input value={parentNida} onChange={(e) => setParentNida(e.target.value)} placeholder="19901234567890123" />
          </div>
          <div className="space-y-1.5">
            <Label>Parent Phone</Label>
            <Input value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} placeholder="+255 7XX XXX XXX" />
          </div>
        </div>
      </div>

      {/* School info — auto-filled */}
      <div className="rounded-xl border bg-muted/30 p-4">
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">School (Auto-filled)</div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><span className="text-muted-foreground">Name: </span><span className="font-semibold">{school.name}</span></div>
          <div><span className="text-muted-foreground">Code: </span><span className="font-mono font-bold text-primary">{school.code}</span></div>
          <div><span className="text-muted-foreground">Region: </span>{school.region ?? "—"}</div>
          <div><span className="text-muted-foreground">District: </span>{school.district ?? "—"}</div>
        </div>
      </div>

      {/* Login credentials */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 space-y-3">
        <div className="text-xs font-bold text-blue-800 uppercase tracking-wider">🔑 Student Login Credentials</div>
        <p className="text-xs text-blue-700">These will be the student's login to the TSID portal. Share them securely.</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Login Email</Label>
            <Input
              type="email"
              value={credEmail}
              onChange={(e) => setCredEmail(e.target.value)}
              placeholder="student@tsid.go.tz"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Password</Label>
            <div className="relative">
              <Input
                type={showPass ? "text" : "password"}
                className="font-mono pr-9"
                value={credPassword}
                onChange={(e) => setCredPassword(e.target.value)}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPass ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => setCredPassword(genStudentPassword())}>
          ↻ Generate new password
        </Button>
      </div>

      <Button type="submit" className="w-full bg-primary" disabled={loading}>
        {loading ? t("creating") : t("create_submit")}
      </Button>
    </form>
  );
}
