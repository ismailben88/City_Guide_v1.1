import { useState } from "react";
import {
  RiStoreLine, RiMapPinLine, RiImageAddLine, RiAddLine,
  RiDeleteBinLine, RiPencilLine, RiFilterLine, RiEyeLine,
} from "react-icons/ri";
import { PSCard, PSCardHead, PSFieldLabel, PSInput, PSTextarea, PSSelect, PsBtnPrimary, PsBtnGhost, BadgeMini } from "../../components/settings/atoms";
import { BIZ_CATEGORIES } from "../../constants/guide";

const MOCK_PORTFOLIO = [
  {
    id: "1",
    name: "Dar Zitoun",
    category: "Riad/Stay",
    city: "Marrakech",
    description: "A restored 18th-century riad in the heart of the medina with rooftop terrace and plunge pool.",
    status: "live",
    thumbnail: "",
    views: 312,
    inquiries: 14,
  },
  {
    id: "2",
    name: "Spice Souk Tour",
    category: "Experience",
    city: "Marrakech",
    description: "A two-hour sensory walk through the spice market with tastings and vendor introductions.",
    status: "pending",
    thumbnail: "",
    views: 0,
    inquiries: 0,
  },
];

export default function BusinessSettings() {
  const [form, setForm] = useState({
    name: "", category: "", description: "", location: "", city: "", photos: [],
  });
  const [portfolio, setPortfolio] = useState(MOCK_PORTFOLIO);
  const [filterStatus, setFilterStatus] = useState("all");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handlePhotoUpload = (e) => {
    const urls = Array.from(e.target.files).map((f) => URL.createObjectURL(f));
    setForm((f) => ({ ...f, photos: [...f.photos, ...urls] }));
  };

  const handlePublish = () => {
    if (!form.name.trim() || !form.category) return;
    const entry = { id: Date.now().toString(), ...form, status: "pending", views: 0, inquiries: 0 };
    setPortfolio((p) => [entry, ...p]);
    setForm({ name: "", category: "", description: "", location: "", city: "", photos: [] });
    console.log("[BusinessSettings] published", entry);
  };

  const handleDelete = (id) => setPortfolio((p) => p.filter((b) => b.id !== id));

  const filtered = filterStatus === "all"
    ? portfolio
    : portfolio.filter((b) => b.status === filterStatus);

  return (
    <div className="flex flex-col gap-5">

      {/* ── New listing form ─────────────────────────────────── */}
      <PSCard>
        <PSCardHead
          eyebrow="New listing"
          eyebrowIcon={<RiStoreLine size={12} />}
          title="Add a business"
          subtitle="Fill in the details to publish a new listing on City Guide."
        />

        <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
          {/* Left column */}
          <div className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-1.5">
              <PSFieldLabel>Business name</PSFieldLabel>
              <PSInput
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Dar Al Nafoura"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <PSFieldLabel>Category</PSFieldLabel>
              <PSSelect value={form.category} onChange={(e) => set("category", e.target.value)}>
                <option value="">Select a category</option>
                {BIZ_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </PSSelect>
            </div>

            <div className="flex flex-col gap-1.5">
              <PSFieldLabel>City</PSFieldLabel>
              <PSSelect value={form.city} onChange={(e) => set("city", e.target.value)}>
                <option value="">Select city</option>
                {["Marrakech", "Fès", "Casablanca", "Chefchaouen", "Essaouira", "Rabat"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </PSSelect>
            </div>

            <div className="flex flex-col gap-1.5">
              <PSFieldLabel>Location</PSFieldLabel>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <RiMapPinLine
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--ps-ink-3)" }}
                  />
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => set("location", e.target.value)}
                    placeholder="Address or neighbourhood"
                    className="ps-field-input"
                    style={{ paddingLeft: 34 }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-1.5">
              <PSFieldLabel>Description</PSFieldLabel>
              <div className="relative">
                <PSTextarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
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
                  <span className="text-[11px]" style={{ color: "var(--ps-ink-3)" }}>JPG or PNG · max 5MB each</span>
                </div>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2.5 mt-5 pt-4 border-t" style={{ borderColor: "var(--ps-line)" }}>
          <PsBtnGhost>Save draft</PsBtnGhost>
          <PsBtnPrimary onClick={handlePublish} disabled={!form.name.trim() || !form.category}>
            <RiAddLine size={15} /> Publish business
          </PsBtnPrimary>
        </div>
      </PSCard>

      {/* ── Portfolio list ───────────────────────────────────── */}
      <PSCard>
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.06em] mb-1" style={{ color: "var(--ps-ink-3)" }}>
              Portfolio
            </div>
            <h3 className="m-0 text-[18px] font-semibold" style={{ fontFamily: "var(--ps-font-display)", color: "var(--ps-ink)" }}>
              {portfolio.length} listing{portfolio.length !== 1 ? "s" : ""}
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
          {filtered.map((biz) => (
            <div
              key={biz.id}
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
                  {biz.category} · {biz.city}
                </div>
                <div className="text-[12px] leading-relaxed line-clamp-1" style={{ color: "var(--ps-ink-2)" }}>
                  {biz.description}
                </div>
                {biz.status === "live" && (
                  <div className="flex items-center gap-3 mt-1.5 text-[11px]" style={{ color: "var(--ps-ink-3)" }}>
                    <span>{biz.views} views</span>
                    <span>·</span>
                    <span>{biz.inquiries} inquiries</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <button
                  className="w-8 h-8 rounded-[8px] border flex items-center justify-center transition-all hover:bg-red-50 hover:text-red-500 hover:border-red-200"
                  style={{ borderColor: "var(--ps-line)", background: "transparent", color: "var(--ps-ink-3)", cursor: "pointer" }}
                  onClick={() => handleDelete(biz.id)}
                  title="Delete"
                >
                  <RiDeleteBinLine size={14} />
                </button>
                <button
                  className="w-8 h-8 rounded-[8px] border flex items-center justify-center transition-all"
                  style={{ borderColor: "var(--ps-line)", background: "transparent", color: "var(--ps-ink-3)", cursor: "pointer" }}
                  title="Edit"
                >
                  <RiPencilLine size={14} />
                </button>
                {biz.status === "live" && (
                  <button
                    className="w-8 h-8 rounded-[8px] border flex items-center justify-center transition-all"
                    style={{ borderColor: "var(--ps-line)", background: "transparent", color: "var(--ps-ink-3)", cursor: "pointer" }}
                    title="View"
                  >
                    <RiEyeLine size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </PSCard>
    </div>
  );
}
