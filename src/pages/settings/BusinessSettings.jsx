import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  RiStoreLine, RiMapPinLine, RiImageAddLine, RiAddLine,
  RiDeleteBinLine, RiPencilLine, RiEyeLine, RiSparklingLine,
  RiCheckLine, RiArrowRightLine, RiShieldCheckLine, RiBarChartLine,
  RiTeamLine, RiGlobalLine, RiCloseLine,
} from "react-icons/ri";
import { HiCheckBadge } from "react-icons/hi2";
import {
  PSCard, PSCardHead, PSFieldLabel, PSInput, PSTextarea,
  PSSelect, PsBtnPrimary, PsBtnGhost, PsBtnOutline, BadgeMini,
} from "../../components/settings/atoms";
import { BIZ_CATEGORIES } from "../../constants/guide";
import { selectUser } from "../../store/slices/authSlice";
import { api } from "../../services/api";

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ msg, color, onDismiss }) {
  return (
    <div
      className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-[13px] font-semibold font-body animate-fade-in"
      style={{
        background: color === "green" ? "var(--ps-green)" : "#ef4444",
        color: "#fff",
        minWidth: 220,
      }}
    >
      {color === "green" ? <HiCheckBadge size={18} /> : <RiCloseLine size={18} />}
      {msg}
    </div>
  );
}

// ── Become Business landing ───────────────────────────────────────────────────
const PERKS = [
  { icon: <RiGlobalLine size={20} />,     stat: "2 M+",     label: "Monthly visitors" },
  { icon: <RiTeamLine size={20} />,       stat: "18 K+",    label: "Active guides" },
  { icon: <RiBarChartLine size={20} />,   stat: "4× more",  label: "Booking reach" },
  { icon: <RiShieldCheckLine size={20} />,stat: "Free",     label: "Always free to list" },
];

const HOW_IT_WORKS = [
  { n: "1", title: "Create your listing",  body: "Add your name, category, city, photos and a short description." },
  { n: "2", title: "Submit for review",    body: "Our team reviews every listing within 48 hours for quality." },
  { n: "3", title: "Go live & grow",       body: "Appear in search results and start receiving inquiries directly." },
];

function BecomeBusiness({ onStart }) {
  return (
    <div className="flex flex-col gap-6">

      {/* Hero */}
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a2e18 0%, #243b20 55%, #1e3319 100%)", minHeight: 240 }}
      >
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
        />
        <div className="relative z-10 flex flex-col items-start px-8 py-10 gap-5 max-[640px]:px-6 max-[640px]:py-8">
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
            <RiSparklingLine size={13} className="text-green-300" />
            <span className="text-[11px] font-bold text-green-200 uppercase tracking-wider">City Guide for Business</span>
          </div>

          <div>
            <h1
              className="text-[2rem] font-bold leading-tight max-[640px]:text-[1.6rem]"
              style={{ fontFamily: "var(--ps-font-display)", color: "var(--ps-green)" }}
            >
              List your business.<br />
              <span className="text-white">Reach more travellers.</span>
            </h1>
            <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "rgba(255,255,255,0.65)", maxWidth: 480 }}>
              Join thousands of local businesses that use CityGuide to connect with travellers, grow their audience, and build their reputation.
            </p>
          </div>

          <button
            onClick={onStart}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-body text-[14px] font-bold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "var(--ps-green)" }}
          >
            <RiAddLine size={17} />
            Add your first listing
            <RiArrowRightLine size={16} />
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3 max-[640px]:grid-cols-2">
        {PERKS.map((p) => (
          <div
            key={p.label}
            className="flex flex-col items-center gap-1.5 py-5 px-3 rounded-2xl border text-center"
            style={{ background: "var(--ps-card)", borderColor: "var(--ps-line)" }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center mb-0.5"
              style={{ background: "var(--ps-green-light)", color: "var(--ps-green)" }}
            >
              {p.icon}
            </div>
            <span
              className="text-[1.2rem] font-bold leading-none"
              style={{ fontFamily: "var(--ps-font-display)", color: "var(--ps-ink)" }}
            >
              {p.stat}
            </span>
            <span className="text-[11px]" style={{ color: "var(--ps-ink-3)" }}>{p.label}</span>
          </div>
        ))}
      </div>

      {/* How it works */}
      <PSCard>
        <PSCardHead
          eyebrow="How it works"
          eyebrowIcon={<RiCheckLine size={12} />}
          title="3 steps to go live"
          subtitle="Getting your business on CityGuide takes less than 5 minutes."
        />
        <div className="grid grid-cols-3 gap-4 mt-1 max-[640px]:grid-cols-1">
          {HOW_IT_WORKS.map((s) => (
            <div
              key={s.n}
              className="flex flex-col gap-2.5 p-4 rounded-2xl border"
              style={{ background: "var(--ps-bg)", borderColor: "var(--ps-line)" }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold flex-shrink-0"
                style={{ background: "var(--ps-green)", color: "#fff", fontFamily: "var(--ps-font-display)" }}
              >
                {s.n}
              </div>
              <div>
                <div
                  className="text-[14px] font-semibold mb-0.5"
                  style={{ fontFamily: "var(--ps-font-display)", color: "var(--ps-ink)" }}
                >
                  {s.title}
                </div>
                <div className="text-[12px] leading-relaxed" style={{ color: "var(--ps-ink-3)" }}>
                  {s.body}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t flex justify-center" style={{ borderColor: "var(--ps-line)" }}>
          <button
            onClick={onStart}
            className="flex items-center gap-2 px-8 py-3 rounded-xl font-body text-[14px] font-bold text-white transition-all duration-200 hover:scale-[1.01]"
            style={{ background: "var(--ps-green)" }}
          >
            <RiStoreLine size={16} />
            Get started — it's free
          </button>
        </div>
      </PSCard>
    </div>
  );
}

// ── Spinner ───────────────────────────────────────────────────────────────────
function Spinner({ size = 5 }) {
  return (
    <svg
      className={`animate-spin h-${size} w-${size}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      style={{ color: "var(--ps-green)" }}
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function BusinessSettings() {
  const user = useSelector(selectUser);

  const [businesses,   setBusinesses]   = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [showForm,     setShowForm]     = useState(false);
  const [submitting,   setSubmitting]   = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [toast,        setToast]        = useState(null);

  // Edit modal state
  const [editingBiz,   setEditingBiz]   = useState(null);
  const [editForm,     setEditForm]     = useState({ name: "", description: "", address: "" });
  const [editSaving,   setEditSaving]   = useState(false);

  const [form, setForm] = useState({
    name: "", category: "", description: "", location: "", city: "", photos: [],
  });

  // ── Fetch businesses on mount ─────────────────────────────────────────────
  useEffect(() => {
    const id = user?.id || user?._id;
    if (!id) { setLoading(false); return; }

    api.getBusinessesByUser(id)
      .then((data) => setBusinesses(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.id, user?._id]);

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const showToastMsg = (msg, color) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3200);
  };

  // ── Publish ───────────────────────────────────────────────────────────────
  const handlePublish = async () => {
    if (!form.name.trim() || !form.category) return;
    setSubmitting(true);
    try {
      const data = await api.createBusiness({
        name:        form.name.trim(),
        category:    form.category,
        description: form.description.trim(),
        location:    form.location.trim(),
        city:        form.city,
        photos:      form.photos,
      });
      setBusinesses((prev) => [data, ...prev]);
      setForm({ name: "", category: "", description: "", location: "", city: "", photos: [] });
      setShowForm(false);
      showToastMsg("Listing submitted for review!", "green");
    } catch (err) {
      showToastMsg(err.message, "red");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (idVal) => {
    try {
      await api.deleteBusiness(idVal);
      setBusinesses((prev) => prev.filter((b) => (b._id || b.id) !== idVal));
    } catch {
      showToastMsg("Failed to delete. Please try again.", "red");
    }
  };

  // ── Edit ──────────────────────────────────────────────────────────────────
  const handleEditOpen = (biz) => {
    setEditingBiz(biz);
    setEditForm({
      name:        biz.name        ?? "",
      description: biz.description ?? "",
      address:     biz.address     ?? biz.location ?? "",
    });
  };

  const handleEditSubmit = async () => {
    if (!editingBiz) return;
    setEditSaving(true);
    try {
      const updated = await api.updateBusiness(editingBiz._id || editingBiz.id, editForm);
      setBusinesses((prev) =>
        prev.map((b) => (b._id || b.id) === (editingBiz._id || editingBiz.id) ? { ...b, ...updated } : b)
      );
      setEditingBiz(null);
      showToastMsg("Listing updated!", "green");
    } catch (err) {
      showToastMsg(err.message, "red");
    } finally {
      setEditSaving(false);
    }
  };

  const handlePhotoUpload = (e) => {
    const urls = Array.from(e.target.files).map((f) => URL.createObjectURL(f));
    setForm((f) => ({ ...f, photos: [...f.photos, ...urls] }));
  };

  const filtered = filterStatus === "all"
    ? businesses
    : businesses.filter((b) => b.status === filterStatus);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size={8} />
      </div>
    );
  }

  // ── No listings yet → onboarding ─────────────────────────────────────────
  if (businesses.length === 0 && !showForm) {
    return <BecomeBusiness onStart={() => setShowForm(true)} />;
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-5">

      {/* ── Add listing form (toggle) ── */}
      {showForm ? (
        <PSCard>
          <div className="flex items-center justify-between mb-5">
            <PSCardHead
              eyebrow="New listing"
              eyebrowIcon={<RiStoreLine size={12} />}
              title="Add a business"
              subtitle="Fill in the details to submit a new listing for review."
            />
            <button
              onClick={() => setShowForm(false)}
              className="w-8 h-8 rounded-full border flex items-center justify-center transition-all hover:bg-red-50 hover:text-red-500 hover:border-red-200 flex-shrink-0"
              style={{ borderColor: "var(--ps-line)", color: "var(--ps-ink-3)", cursor: "pointer" }}
            >
              <RiCloseLine size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
            {/* Left */}
            <div className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <PSFieldLabel>Business name</PSFieldLabel>
                <PSInput
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  placeholder="e.g. Dar Al Nafoura"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <PSFieldLabel>Category</PSFieldLabel>
                <PSSelect value={form.category} onChange={(e) => setField("category", e.target.value)}>
                  <option value="">Select a category</option>
                  {BIZ_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </PSSelect>
              </div>

              <div className="flex flex-col gap-1.5">
                <PSFieldLabel>City</PSFieldLabel>
                <PSSelect value={form.city} onChange={(e) => setField("city", e.target.value)}>
                  <option value="">Select city</option>
                  {["Marrakech", "Fès", "Casablanca", "Chefchaouen", "Essaouira", "Rabat"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </PSSelect>
              </div>

              <div className="flex flex-col gap-1.5">
                <PSFieldLabel>Location</PSFieldLabel>
                <div className="relative">
                  <RiMapPinLine
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: "var(--ps-ink-3)" }}
                  />
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setField("location", e.target.value)}
                    placeholder="Address or neighbourhood"
                    className="ps-field-input"
                    style={{ paddingLeft: 34 }}
                  />
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <PSFieldLabel>Description</PSFieldLabel>
                <div className="relative">
                  <PSTextarea
                    value={form.description}
                    onChange={(e) => setField("description", e.target.value)}
                    placeholder="What makes this place special…"
                    maxLength={400}
                    rows={5}
                  />
                  <span
                    className="absolute bottom-2 right-3 text-[11px]"
                    style={{ color: "var(--ps-ink-3)" }}
                  >
                    {form.description.length}/400
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <PSFieldLabel>Photos</PSFieldLabel>
                <label className="cursor-pointer">
                  <div
                    className="flex flex-col items-center justify-center gap-2 py-5 rounded-[10px] border-2 border-dashed text-[13px] transition-all"
                    style={{ borderColor: "var(--ps-line-2)", color: "var(--ps-ink-3)" }}
                  >
                    <RiImageAddLine size={22} />
                    {form.photos.length > 0
                      ? `${form.photos.length} photo(s) selected`
                      : "Drop photos or click to upload"}
                    <span className="text-[11px]" style={{ color: "var(--ps-ink-3)" }}>JPG or PNG · max 5 MB each</span>
                  </div>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2.5 mt-5 pt-4 border-t" style={{ borderColor: "var(--ps-line)" }}>
            <PsBtnGhost onClick={() => setShowForm(false)} disabled={submitting}>Cancel</PsBtnGhost>
            <PsBtnPrimary
              onClick={handlePublish}
              disabled={!form.name.trim() || !form.category || submitting}
            >
              {submitting ? <Spinner size={4} /> : <RiAddLine size={15} />}
              {submitting ? "Submitting…" : "Submit listing"}
            </PsBtnPrimary>
          </div>
        </PSCard>
      ) : (
        <div className="flex justify-end">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-body text-[13px] font-bold text-white transition-all hover:scale-[1.01]"
            style={{ background: "var(--ps-green)", cursor: "pointer" }}
          >
            <RiAddLine size={16} />
            Add new listing
          </button>
        </div>
      )}

      {/* ── Portfolio ── */}
      <PSCard>
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.06em] mb-1" style={{ color: "var(--ps-ink-3)" }}>
              Portfolio
            </div>
            <h3 className="m-0 text-[18px] font-semibold" style={{ fontFamily: "var(--ps-font-display)", color: "var(--ps-ink)" }}>
              {businesses.length} listing{businesses.length !== 1 ? "s" : ""}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {["all", "live", "pending"].map((f) => (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                className="px-3 py-1.5 rounded-full text-[12px] font-semibold capitalize transition-all border"
                style={{
                  background:  filterStatus === f ? "var(--ps-ink)"   : "transparent",
                  color:       filterStatus === f ? "#fff"             : "var(--ps-ink-3)",
                  borderColor: filterStatus === f ? "var(--ps-ink)"   : "var(--ps-line)",
                  cursor: "pointer",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="py-10 text-center text-[13px]" style={{ color: "var(--ps-ink-3)" }}>
            No listings match this filter.
          </div>
        )}

        <div className="flex flex-col gap-3">
          {filtered.map((biz) => {
            const bizId = biz._id || biz.id;
            return (
              <div
                key={bizId}
                className="grid gap-4 p-4 rounded-[12px] border"
                style={{ gridTemplateColumns: "80px 1fr auto", borderColor: "var(--ps-line)", background: "var(--ps-bg)" }}
              >
                {/* Thumbnail */}
                <div
                  className="w-20 h-20 rounded-[10px] overflow-hidden flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, var(--ps-line) 0%, var(--ps-line-2) 100%)" }}
                >
                  {biz.thumbnail
                    ? <img src={biz.thumbnail} alt={biz.name} className="w-full h-full object-cover block" />
                    : <div className="w-full h-full flex items-center justify-center" style={{ color: "var(--ps-ink-3)" }}>
                        <RiImageAddLine size={22} />
                      </div>
                  }
                </div>

                {/* Details */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className="text-[15px] font-semibold leading-tight"
                      style={{ fontFamily: "var(--ps-font-display)", color: "var(--ps-ink)" }}
                    >
                      {biz.name}
                    </span>
                    <BadgeMini color={biz.status === "live" ? "green" : "orange"}>
                      {biz.status === "live" ? "Live" : "Pending"}
                    </BadgeMini>
                  </div>
                  <div className="text-[12px] mb-1" style={{ color: "var(--ps-ink-3)" }}>
                    {biz.category}{biz.city ? ` · ${biz.city}` : ""}
                  </div>
                  {biz.description && (
                    <div className="text-[12px] leading-relaxed line-clamp-1" style={{ color: "var(--ps-ink-2)" }}>
                      {biz.description}
                    </div>
                  )}
                  {biz.status === "live" && (
                    <div className="flex items-center gap-3 mt-1.5 text-[11px]" style={{ color: "var(--ps-ink-3)" }}>
                      <span>{biz.views ?? 0} views</span>
                      <span>·</span>
                      <span>{biz.inquiries ?? 0} inquiries</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <button
                    className="w-8 h-8 rounded-[8px] border flex items-center justify-center transition-all hover:bg-red-50 hover:text-red-500 hover:border-red-200"
                    style={{ borderColor: "var(--ps-line)", background: "transparent", color: "var(--ps-ink-3)", cursor: "pointer" }}
                    onClick={() => handleDelete(bizId)}
                    title="Delete"
                  >
                    <RiDeleteBinLine size={14} />
                  </button>
                  <button
                    className="w-8 h-8 rounded-[8px] border flex items-center justify-center transition-all hover:bg-sand hover:border-sand3"
                    style={{ borderColor: "var(--ps-line)", background: "transparent", color: "var(--ps-ink-3)", cursor: "pointer" }}
                    title="Edit"
                    onClick={() => handleEditOpen(biz)}
                  >
                    <RiPencilLine size={14} />
                  </button>
                  {biz.status === "live" && (
                    <button
                      className="w-8 h-8 rounded-[8px] border flex items-center justify-center transition-all hover:bg-sand hover:border-sand3"
                      style={{ borderColor: "var(--ps-line)", background: "transparent", color: "var(--ps-ink-3)", cursor: "pointer" }}
                      title="View"
                    >
                      <RiEyeLine size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </PSCard>

      {/* ── Edit modal ── */}
      {editingBiz && (
        <div
          className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
          onClick={(e) => e.target === e.currentTarget && setEditingBiz(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl p-6 flex flex-col gap-4"
            style={{ background: "var(--ps-card)", border: "1px solid var(--ps-line)", boxShadow: "var(--ps-shadow)" }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[17px] font-semibold m-0" style={{ fontFamily: "var(--ps-font-display)", color: "var(--ps-ink)" }}>
                Edit listing
              </h3>
              <button
                onClick={() => setEditingBiz(null)}
                className="w-8 h-8 rounded-full border flex items-center justify-center transition-all hover:bg-red-50 hover:text-red-500"
                style={{ borderColor: "var(--ps-line)", color: "var(--ps-ink-3)", cursor: "pointer" }}
              >
                <RiCloseLine size={16} />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <PSFieldLabel>Business name</PSFieldLabel>
                <PSInput
                  value={editForm.name}
                  onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Business name"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <PSFieldLabel>Description</PSFieldLabel>
                <PSTextarea
                  value={editForm.description}
                  onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Short description…"
                  maxLength={400}
                  rows={4}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <PSFieldLabel>Address</PSFieldLabel>
                <div className="relative">
                  <RiMapPinLine size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--ps-ink-3)" }} />
                  <PSInput
                    value={editForm.address}
                    onChange={(e) => setEditForm((f) => ({ ...f, address: e.target.value }))}
                    placeholder="Address or neighbourhood"
                    style={{ paddingLeft: 34 }}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t" style={{ borderColor: "var(--ps-line)" }}>
              <PsBtnGhost onClick={() => setEditingBiz(null)} disabled={editSaving}>Cancel</PsBtnGhost>
              <PsBtnPrimary
                onClick={handleEditSubmit}
                disabled={!editForm.name.trim() || editSaving}
              >
                {editSaving ? <Spinner size={4} /> : <RiCheckLine size={15} />}
                {editSaving ? "Saving…" : "Save changes"}
              </PsBtnPrimary>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast msg={toast.msg} color={toast.color} />}
    </div>
  );
}
