import { useState, useEffect } from "react";

const API = "http://localhost:5000/api/dogs"; //change to new url

// ── Utility ──────────────────────────────────────────────────────────────────
const emptyForm = { name: "", breed: "", age: "", owner: "", colour: "", vaccinated: false };

// ── Icons (inline SVG) ────────────────────────────────────────────────────────
const Icon = {
  paw: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M12 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm-6 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM4 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm16 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM12 10c-3.5 0-7 2.5-7 5.5 0 2.2 1.8 4 4 4h6c2.2 0 4-1.8 4-4C19 12.5 15.5 10 12 10z"/>
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  edit: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  trash: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  ),
  eye: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  dog: (
    <svg viewBox="0 0 64 64" fill="currentColor" width="48" height="48">
      <ellipse cx="32" cy="38" rx="18" ry="14" opacity=".15"/>
      <path d="M14 20c0-10 6-16 16-16 4 0 7 1 10 4l6-6 2 2-4 5c2 3 3 7 3 11 0 11-7 18-17 18S14 31 14 20z"/>
      <circle cx="25" cy="21" r="2.5" fill="white"/>
      <circle cx="39" cy="21" r="2.5" fill="white"/>
      <circle cx="26" cy="21" r="1" fill="#1a1a2e"/>
      <circle cx="40" cy="21" r="1" fill="#1a1a2e"/>
      <ellipse cx="32" cy="27" rx="4" ry="2.5" fill="white" opacity=".6"/>
      <path d="M29 29 Q32 32 35 29" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M10 12 Q14 8 18 14" stroke="currentColor" strokeWidth="3" fill="currentColor" strokeLinecap="round"/>
      <path d="M54 12 Q50 8 46 14" stroke="currentColor" strokeWidth="3" fill="currentColor" strokeLinecap="round"/>
      <rect x="26" y="44" width="5" height="12" rx="2.5"/>
      <rect x="33" y="44" width="5" height="12" rx="2.5"/>
      <path d="M20 48 Q18 54 16 56" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M44 48 Q46 54 48 56" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M44 38 Q52 40 54 48" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  alert: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
};

// ── Breed colours (accent per breed family) ───────────────────────────────────
const breedAccent = (breed = "") => {
  const b = breed.toLowerCase();
  if (b.includes("labrador") || b.includes("retriever")) return "#F59E0B";
  if (b.includes("shepherd") || b.includes("husky"))     return "#6366F1";
  if (b.includes("bulldog") || b.includes("pug"))        return "#EF4444";
  if (b.includes("poodle") || b.includes("spaniel"))     return "#EC4899";
  if (b.includes("terrier"))                             return "#10B981";
  return "#0D9488";
};

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ msg, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 9999,
      background: type === "error" ? "#450a0a" : "#022c22",
      border: `1px solid ${type === "error" ? "#ef4444" : "#10b981"}`,
      color: type === "error" ? "#fca5a5" : "#6ee7b7",
      padding: "12px 20px", borderRadius: 12, fontSize: 14,
      display: "flex", alignItems: "center", gap: 10,
      boxShadow: "0 8px 32px rgba(0,0,0,.4)",
      animation: "slideUp .25s ease",
    }}>
      {type === "error" ? Icon.alert : Icon.check}
      {msg}
    </div>
  );
}

// ── Dog Form Modal ────────────────────────────────────────────────────────────
function DogFormModal({ initial, onSave, onClose, loading }) {
  const [form, setForm] = useState(initial || emptyForm);
  const isEdit = !!initial?._id;

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  const fields = [
    { key: "name",   label: "Dog Name",   type: "text",   placeholder: "e.g. Buddy",        required: true },
    { key: "breed",  label: "Breed",      type: "text",   placeholder: "e.g. Labrador",     required: true },
    { key: "age",    label: "Age (years)",type: "number", placeholder: "e.g. 3",            required: true },
    { key: "owner",  label: "Owner Name", type: "text",   placeholder: "e.g. Jane Smith",   required: true },
    { key: "colour", label: "Colour",     type: "text",   placeholder: "e.g. Golden Brown",  required: false },
  ];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,.7)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: "#0f172a", border: "1px solid #1e293b",
        borderRadius: 20, width: "100%", maxWidth: 480,
        boxShadow: "0 32px 80px rgba(0,0,0,.6)",
        animation: "modalIn .2s ease",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #0d9488, #065e54)",
          padding: "24px 28px 20px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 3, color: "#99f6e4", textTransform: "uppercase", marginBottom: 4 }}>
              {isEdit ? "Edit Record" : "New Registration"}
            </div>
            <h2 style={{ margin: 0, fontSize: 22, fontFamily: "'Playfair Display', serif", color: "#fff" }}>
              {isEdit ? `Update ${initial.name}` : "Register a Dog"}
            </h2>
          </div>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,.15)", border: "none", borderRadius: 8,
            color: "#fff", cursor: "pointer", padding: 8, display: "flex",
          }}>{Icon.close}</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "24px 28px 28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {fields.map(f => (
              <div key={f.key} style={{ gridColumn: f.key === "name" || f.key === "owner" ? "1 / -1" : "auto" }}>
                <label style={{ display: "block", fontSize: 11, letterSpacing: 1.5, color: "#64748b", textTransform: "uppercase", marginBottom: 6 }}>
                  {f.label} {f.required && <span style={{ color: "#0d9488" }}>*</span>}
                </label>
                <input
                  type={f.type}
                  value={form[f.key]}
                  onChange={e => set(f.key, f.type === "number" ? e.target.value : e.target.value)}
                  placeholder={f.placeholder}
                  required={f.required}
                  min={f.type === "number" ? 0 : undefined}
                  style={{
                    width: "100%", boxSizing: "border-box",
                    background: "#1e293b", border: "1px solid #334155",
                    borderRadius: 10, padding: "11px 14px",
                    color: "#f1f5f9", fontSize: 14, outline: "none",
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "border-color .2s",
                  }}
                  onFocus={e => e.target.style.borderColor = "#0d9488"}
                  onBlur={e => e.target.style.borderColor = "#334155"}
                />
              </div>
            ))}
          </div>

          {/* Vaccinated toggle */}
          <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 12 }}>
            <button
              type="button"
              onClick={() => set("vaccinated", !form.vaccinated)}
              style={{
                width: 46, height: 26, borderRadius: 13, border: "none", cursor: "pointer",
                background: form.vaccinated ? "#0d9488" : "#334155",
                position: "relative", transition: "background .25s",
                flexShrink: 0,
              }}
            >
              <span style={{
                position: "absolute", top: 3, left: form.vaccinated ? 23 : 3,
                width: 20, height: 20, borderRadius: "50%", background: "#fff",
                transition: "left .25s", display: "block",
              }}/>
            </button>
            <span style={{ fontSize: 14, color: form.vaccinated ? "#34d399" : "#64748b" }}>
              {form.vaccinated ? "Vaccinated ✓" : "Not vaccinated"}
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 24, width: "100%", padding: "14px",
              background: loading ? "#134e4a" : "linear-gradient(135deg, #0d9488, #0891b2)",
              border: "none", borderRadius: 12, color: "#fff",
              fontSize: 15, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
              cursor: loading ? "not-allowed" : "pointer",
              letterSpacing: 0.5, transition: "opacity .2s",
            }}
          >
            {loading ? "Saving…" : isEdit ? "Save Changes" : "Register Dog"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Dog Detail Modal ──────────────────────────────────────────────────────────
function DogDetailModal({ dog, onClose, onEdit, onDelete, deleting }) {
  const accent = breedAccent(dog.breed);
  const age = Number(dog.age);
  const ageLabel = age === 1 ? "1 yr" : `${age} yrs`;
  const created = new Date(dog.createdAt).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,.75)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: "#0f172a", border: "1px solid #1e293b",
        borderRadius: 20, width: "100%", maxWidth: 420,
        boxShadow: "0 32px 80px rgba(0,0,0,.6)",
        animation: "modalIn .2s ease", overflow: "hidden",
      }}>
        {/* Coloured header band */}
        <div style={{
          background: `linear-gradient(135deg, ${accent}22, ${accent}44)`,
          borderBottom: `2px solid ${accent}`,
          padding: "28px 28px 20px",
          position: "relative",
        }}>
          <button onClick={onClose} style={{
            position: "absolute", top: 16, right: 16,
            background: "rgba(255,255,255,.08)", border: "none", borderRadius: 8,
            color: "#94a3b8", cursor: "pointer", padding: 8, display: "flex",
          }}>{Icon.close}</button>

          <div style={{ color: accent, marginBottom: 10 }}>{Icon.dog}</div>
          <h2 style={{
            margin: "0 0 4px", fontSize: 28,
            fontFamily: "'Playfair Display', serif", color: "#f1f5f9",
          }}>{dog.name}</h2>
          <p style={{ margin: 0, fontSize: 14, color: "#64748b" }}>{dog.breed}</p>

          {/* Vaccinated badge */}
          <span style={{
            position: "absolute", top: 20, right: 52,
            background: dog.vaccinated ? "#022c22" : "#1c1917",
            border: `1px solid ${dog.vaccinated ? "#10b981" : "#44403c"}`,
            color: dog.vaccinated ? "#34d399" : "#78716c",
            fontSize: 11, fontWeight: 700, letterSpacing: 1,
            padding: "3px 10px", borderRadius: 20, textTransform: "uppercase",
          }}>
            {dog.vaccinated ? "Vaccinated" : "Unvaccinated"}
          </span>
        </div>

        {/* Stats grid */}
        <div style={{ padding: "20px 28px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { label: "Age",     value: ageLabel },
            { label: "Colour",  value: dog.colour || "Unknown" },
            { label: "Owner",   value: dog.owner },
            { label: "Registered", value: created },
          ].map(({ label, value }) => (
            <div key={label} style={{
              background: "#1e293b", borderRadius: 10, padding: "12px 14px",
              gridColumn: label === "Owner" || label === "Registered" ? "1 / -1" : "auto",
            }}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: "#475569", textTransform: "uppercase", marginBottom: 4 }}>
                {label}
              </div>
              <div style={{ fontSize: 15, color: "#f1f5f9", fontWeight: 600 }}>{value}</div>
            </div>
          ))}
        </div>

        {/* ID */}
        <div style={{ padding: "0 28px 8px" }}>
          <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, padding: "8px 12px" }}>
            <span style={{ fontSize: 10, color: "#334155", letterSpacing: 1 }}>ID  </span>
            <span style={{ fontSize: 11, color: "#334155", fontFamily: "monospace" }}>{dog._id}</span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ padding: "16px 28px 28px", display: "flex", gap: 10 }}>
          <button onClick={onEdit} style={{
            flex: 1, padding: "12px", borderRadius: 10,
            background: "linear-gradient(135deg, #0d9488, #0891b2)",
            border: "none", color: "#fff", fontWeight: 700,
            fontSize: 14, cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center", gap: 7,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {Icon.edit} Edit Dog
          </button>
          <button onClick={onDelete} disabled={deleting} style={{
            flex: 1, padding: "12px", borderRadius: 10,
            background: deleting ? "#1c0a0a" : "#1c0a0a",
            border: "1px solid #7f1d1d",
            color: deleting ? "#6b7280" : "#ef4444",
            fontWeight: 700, fontSize: 14, cursor: deleting ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {Icon.trash} {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Dog Card ──────────────────────────────────────────────────────────────────
function DogCard({ dog, onView }) {
  const accent = breedAccent(dog.breed);
  const [hov, setHov] = useState(false);

  return (
    <div
      onClick={onView}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "#1e293b" : "#131c2e",
        border: `1px solid ${hov ? accent : "#1e293b"}`,
        borderRadius: 16, padding: "20px", cursor: "pointer",
        transition: "all .2s", transform: hov ? "translateY(-3px)" : "none",
        boxShadow: hov ? `0 12px 32px ${accent}22` : "none",
        position: "relative", overflow: "hidden",
      }}
    >
      {/* Accent strip */}
      <div style={{
        position: "absolute", top: 0, left: 0, width: "100%", height: 3,
        background: accent, borderRadius: "16px 16px 0 0",
      }}/>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <h3 style={{ margin: "0 0 4px", fontSize: 20, fontFamily: "'Playfair Display', serif", color: "#f1f5f9" }}>
            {dog.name}
          </h3>
          <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>{dog.breed}</p>
        </div>
        <span style={{
          background: `${accent}22`, color: accent,
          fontSize: 11, fontWeight: 700, padding: "4px 10px",
          borderRadius: 20, letterSpacing: 0.5,
        }}>
          {dog.age} {Number(dog.age) === 1 ? "yr" : "yrs"}
        </span>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <span style={{
          background: "#0f172a", border: "1px solid #334155",
          color: "#94a3b8", fontSize: 12, padding: "3px 10px", borderRadius: 8,
        }}>👤 {dog.owner}</span>
        {dog.colour && (
          <span style={{
            background: "#0f172a", border: "1px solid #334155",
            color: "#94a3b8", fontSize: 12, padding: "3px 10px", borderRadius: 8,
          }}>🎨 {dog.colour}</span>
        )}
        <span style={{
          background: dog.vaccinated ? "#022c22" : "#1c1917",
          border: `1px solid ${dog.vaccinated ? "#10b981" : "#44403c"}`,
          color: dog.vaccinated ? "#34d399" : "#78716c",
          fontSize: 12, padding: "3px 10px", borderRadius: 8,
        }}>
          {dog.vaccinated ? "✓ Vaccinated" : "Unvaccinated"}
        </span>
      </div>

      <div style={{
        marginTop: 14, display: "flex", alignItems: "center", gap: 6,
        color: accent, fontSize: 13, fontWeight: 600, opacity: hov ? 1 : 0,
        transition: "opacity .2s",
      }}>
        {Icon.eye} View full record
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [dogs, setDogs]             = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [error, setError]           = useState(null);

  const [showForm, setShowForm]     = useState(false);
  const [editDog, setEditDog]       = useState(null);   // dog being edited
  const [viewDog, setViewDog]       = useState(null);   // dog being viewed

  const [saving, setSaving]         = useState(false);
  const [deleting, setDeleting]     = useState(false);

  const [toast, setToast]           = useState(null);
  const [search, setSearch]         = useState("");

  // ── Fetch all dogs ──────────────────────────────────────────────────────────
  const fetchDogs = async () => {
    try {
      setLoadingList(true);
      const res = await fetch(API);
      if (!res.ok) throw new Error("Failed to fetch dogs");
      const data = await res.json();
      setDogs(data);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => { fetchDogs(); }, []);

  // ── Create ──────────────────────────────────────────────────────────────────
  const handleCreate = async (form) => {
    setSaving(true);
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, age: Number(form.age) }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message); }
      const saved = await res.json();
      setDogs(prev => [saved, ...prev]);
      setShowForm(false);
      setToast({ msg: `${saved.name} registered successfully!`, type: "success" });
    } catch (e) {
      setToast({ msg: e.message, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  // ── Update ──────────────────────────────────────────────────────────────────
  const handleUpdate = async (form) => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/${editDog._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, age: Number(form.age) }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message); }
      const updated = await res.json();
      setDogs(prev => prev.map(d => d._id === updated._id ? updated : d));
      setEditDog(null);
      setViewDog(updated);
      setToast({ msg: `${updated.name} updated!`, type: "success" });
    } catch (e) {
      setToast({ msg: e.message, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ──────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!viewDog) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API}/${viewDog._id}`, { method: "DELETE" });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message); }
      setDogs(prev => prev.filter(d => d._id !== viewDog._id));
      const name = viewDog.name;
      setViewDog(null);
      setToast({ msg: `${name} has been removed.`, type: "success" });
    } catch (e) {
      setToast({ msg: e.message, type: "error" });
    } finally {
      setDeleting(false);
    }
  };

  // ── Filter ──────────────────────────────────────────────────────────────────
  const filtered = dogs.filter(d =>
    [d.name, d.breed, d.owner, d.colour].some(v =>
      (v || "").toLowerCase().includes(search.toLowerCase())
    )
  );

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#080f1e", fontFamily: "'DM Sans', sans-serif", color: "#f1f5f9" }}>

      {/* Header */}
      <header style={{
        borderBottom: "1px solid #1e293b",
        background: "rgba(8,15,30,.9)", backdropFilter: "blur(10px)",
        position: "sticky", top: 0, zIndex: 100,
        padding: "0 40px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: "linear-gradient(135deg, #0d9488, #0891b2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", flexShrink: 0,
            }}>
              {Icon.paw}
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.3, fontFamily: "'Playfair Display', serif" }}>PawRegistry</div>
              <div style={{ fontSize: 11, color: "#475569", letterSpacing: 1, textTransform: "uppercase" }}>Dog Registration System</div>
            </div>
          </div>

          <button
            onClick={() => setShowForm(true)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "linear-gradient(135deg, #0d9488, #0891b2)",
              border: "none", borderRadius: 10, padding: "10px 20px",
              color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.3,
              boxShadow: "0 4px 16px rgba(13,148,136,.3)",
            }}
          >
            {Icon.plus} Register Dog
          </button>
        </div>
      </header>

      {/* Main content */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 40px" }}>

        {/* Hero stats bar */}
        <div style={{ display: "flex", gap: 16, marginBottom: 40, flexWrap: "wrap" }}>
          {[
            { label: "Total Dogs",    value: dogs.length,                                 col: "#0d9488" },
            { label: "Vaccinated",    value: dogs.filter(d => d.vaccinated).length,       col: "#10b981" },
            { label: "Unvaccinated",  value: dogs.filter(d => !d.vaccinated).length,      col: "#f59e0b" },
            { label: "Unique Breeds", value: new Set(dogs.map(d => d.breed)).size,        col: "#6366f1" },
          ].map(({ label, value, col }) => (
            <div key={label} style={{
              flex: "1 1 180px", background: "#0f172a",
              border: `1px solid ${col}33`, borderRadius: 14, padding: "18px 22px",
            }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: col, fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>
                {loadingList ? "—" : value}
              </div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ marginBottom: 28 }}>
          <input
            type="text"
            placeholder="Search by name, breed, owner…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", boxSizing: "border-box",
              background: "#0f172a", border: "1px solid #1e293b",
              borderRadius: 12, padding: "13px 18px",
              color: "#f1f5f9", fontSize: 14, outline: "none",
              fontFamily: "'DM Sans', sans-serif",
            }}
            onFocus={e => e.target.style.borderColor = "#0d9488"}
            onBlur={e => e.target.style.borderColor = "#1e293b"}
          />
        </div>

        {/* State: loading */}
        {loadingList && (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#334155" }}>
            <div style={{ fontSize: 40, marginBottom: 16, animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</div>
            <p style={{ fontSize: 16 }}>Fetching dogs from the database…</p>
          </div>
        )}

        {/* State: error */}
        {error && !loadingList && (
          <div style={{
            background: "#1c0a0a", border: "1px solid #7f1d1d",
            borderRadius: 14, padding: "24px 28px", textAlign: "center",
          }}>
            <p style={{ color: "#ef4444", margin: "0 0 12px", fontSize: 15 }}>{Icon.alert} {error}</p>
            <p style={{ color: "#64748b", margin: "0 0 16px", fontSize: 13 }}>
              Make sure your backend server is running on port 5000.
            </p>
            <button onClick={fetchDogs} style={{
              background: "#7f1d1d", border: "none", color: "#fca5a5",
              padding: "8px 20px", borderRadius: 8, cursor: "pointer", fontSize: 14,
              fontFamily: "'DM Sans', sans-serif",
            }}>Retry</button>
          </div>
        )}

        {/* State: empty */}
        {!loadingList && !error && dogs.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 64, marginBottom: 16, filter: "grayscale(1) opacity(.3)" }}>🐕</div>
            <p style={{ color: "#475569", fontSize: 16 }}>No dogs registered yet.</p>
            <button onClick={() => setShowForm(true)} style={{
              marginTop: 12, background: "linear-gradient(135deg, #0d9488, #0891b2)",
              border: "none", color: "#fff", padding: "12px 24px",
              borderRadius: 10, cursor: "pointer", fontSize: 15, fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
            }}>
              Register the first dog
            </button>
          </div>
        )}

        {/* State: no search results */}
        {!loadingList && !error && dogs.length > 0 && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#475569" }}>
            <p>No dogs match "{search}"</p>
          </div>
        )}

        {/* Dog grid */}
        {!loadingList && !error && filtered.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {filtered.map(dog => (
              <DogCard key={dog._id} dog={dog} onView={() => setViewDog(dog)} />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {showForm && (
        <DogFormModal
          onSave={handleCreate}
          onClose={() => setShowForm(false)}
          loading={saving}
        />
      )}

      {editDog && (
        <DogFormModal
          initial={editDog}
          onSave={handleUpdate}
          onClose={() => setEditDog(null)}
          loading={saving}
        />
      )}

      {viewDog && !editDog && (
        <DogDetailModal
          dog={viewDog}
          onClose={() => setViewDog(null)}
          onEdit={() => { setEditDog(viewDog); setViewDog(null); }}
          onDelete={handleDelete}
          deleting={deleting}
        />
      )}

      {/* Toast */}
      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}

      {/* Global styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #080f1e; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
      `}</style>
    </div>
  );
}
