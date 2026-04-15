// pages/AccountPage.jsx
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  RiUserLine,
  RiShieldLine,
  RiLinksLine,
  RiMailLine,
  RiPencilLine,
  RiCheckLine,
  RiDeleteBinLine,
  RiAddLine,
  RiSaveLine,
  RiCompassLine,
  RiShieldCheckLine,
  RiBriefcaseLine,
  RiCalendarLine,
  RiTimeLine,
  RiFilterLine,
  RiImageAddLine,
  RiStoreLine,
  RiMapPinLine,
} from "react-icons/ri";
import { TbLanguage, TbTargetArrow } from "react-icons/tb";
import { selectUser } from "../store/slices/authSlice";

// ─── Data ────────────────────────────────────────────────────────────────────
const BASE_URL = "http://localhost:3001";
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const GUIDE_TYPES = [
  "Cultural",
  "Historical",
  "Adventure",
  "Gastronomy",
  "Nature",
  "Urban",
];
const LANGUAGES = [
  "Arabic",
  "English",
  "French",
  "Spanish",
  "German",
  "Italian",
];
const EXPERTISE = [
  "Cultural & Historical",
  "Local & Authentic Experiences",
  "Nature & Adventure",
  "Gastronomy & Food",
  "Architecture & Art",
];
const BIZ_CATS = [
  "Restaurant",
  "Riad / Hotel",
  "Hammam & Spa",
  "Tour Operator",
  "Artisan / Craft",
  "Lodging",
  "Café",
  "Museum",
  "Other",
];

// ─────────────────────────────────────────────────────────────────────────────
//  Shared primitives
// ─────────────────────────────────────────────────────────────────────────────

function EditBtn({ active, onClick, title, children, className = "" }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`w-[34px] h-[34px] rounded-[9px] border flex items-center justify-center
        flex-shrink-0 cursor-pointer transition-all duration-150
        hover:border-primary hover:text-primary hover:bg-primary/8
        ${
          active
            ? "border-primary bg-primary/10 text-primary"
            : "border-sand3 bg-transparent text-ink3"
        }
        ${className}`}
    >
      {children}
    </button>
  );
}

function DeleteBtn({ onClick, title, children, className = "" }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`w-[34px] h-[34px] rounded-[9px] border border-transparent bg-transparent
        text-ink3/60 flex items-center justify-center cursor-pointer flex-shrink-0
        transition-all duration-150
        hover:border-red-200 hover:bg-red-50 hover:text-red-500
        ${className}`}
    >
      {children}
    </button>
  );
}

const FieldLabel = ({ children }) => (
  <label className="font-body text-[11px] font-bold text-ink3 tracking-wide">
    {children}
  </label>
);

const FieldWrap = ({ children, className = "" }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>{children}</div>
);

const FieldRow = ({ children, className = "" }) => (
  <div className={`flex items-center gap-2 ${className}`}>{children}</div>
);

function FieldInput({
  value,
  onChange,
  disabled,
  editing,
  placeholder,
  type = "text",
  className = "",
}) {
  return (
    <input
      type={type}
      value={value}
      disabled={disabled}
      onChange={onChange}
      placeholder={placeholder}
      className={`flex-1 px-3.5 py-2.5 rounded-xl border font-body text-[13px] font-semibold
        text-ink2 outline-none transition-all duration-200 min-w-0
        placeholder:text-ink3/50 placeholder:font-normal
        focus:border-primary focus:ring-2 focus:ring-primary/10
        disabled:bg-sand disabled:text-ink3 disabled:cursor-default
        ${editing ? "border-primary bg-white" : "border-sand3 bg-sand"}
        ${className}`}
    />
  );
}

function Card({ children, delay = "0ms" }) {
  return (
    <div
      className="animate-fade-up bg-white rounded-[20px] border border-sand3 p-6"
      style={{ animationDelay: delay }}
    >
      {children}
    </div>
  );
}

const CardHeader = ({ children }) => (
  <div className="flex items-center justify-between mb-5">{children}</div>
);

const CardTitle = ({ children }) => (
  <h3 className="font-body text-[11px] font-extrabold tracking-[0.13em] uppercase text-ink3 m-0 flex items-center gap-1.5">
    {children}
  </h3>
);

const Content = ({ children }) => (
  <div className="animate-fade-in flex flex-col gap-5">{children}</div>
);

// Pill toggle button — reused across Guide types, languages, expertise
function PillBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-3.5 py-1 rounded-full border font-body text-[12px]
        font-bold cursor-pointer transition-all duration-150
        hover:bg-primary/10 hover:text-primary hover:border-green-mid
        ${
          active
            ? "bg-primary/10 text-primary border-green-mid"
            : "bg-sand2 text-ink3 border-sand3"
        }`}
    >
      {children}
    </button>
  );
}

// Day toggle button
function DayBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`py-2 px-1 rounded-[10px] border text-center font-body text-[11px]
        font-bold cursor-pointer transition-all duration-150
        hover:border-primary hover:text-primary hover:bg-primary/8
        ${
          active
            ? "border-primary bg-primary/10 text-primary"
            : "border-sand3 bg-sand text-ink3"
        }`}
    >
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Reusable editable field
// ─────────────────────────────────────────────────────────────────────────────
function EditableField({ label, value, type = "text" }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value || "");

  return (
    <FieldWrap>
      <FieldLabel>{label}</FieldLabel>
      <FieldRow>
        <FieldInput
          type={type}
          value={val}
          disabled={!editing}
          editing={editing}
          onChange={(e) => setVal(e.target.value)}
        />
        <EditBtn
          active={editing}
          onClick={() => setEditing((v) => !v)}
          title={editing ? "Save" : "Edit"}
        >
          {editing ? <RiCheckLine size={14} /> : <RiPencilLine size={14} />}
        </EditBtn>
      </FieldRow>
    </FieldWrap>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Save / Cancel row
// ─────────────────────────────────────────────────────────────────────────────
function SaveRow() {
  return (
    <div className="flex justify-end gap-2.5 pt-2">
      <button
        className="flex items-center gap-1.5 px-5 py-[11px] rounded-xl border border-sand3
        bg-transparent text-ink3 font-body text-sm font-semibold cursor-pointer
        transition-all duration-150 hover:bg-sand2 hover:text-ink2"
      >
        <RiDeleteBinLine size={14} /> Cancel
      </button>
      <button
        className="flex items-center gap-1.5 px-7 py-[11px] rounded-xl border-0
        bg-primary text-white font-body text-sm font-bold cursor-pointer
        transition-all duration-150 hover:bg-accent hover:scale-[1.02]"
      >
        <RiSaveLine size={14} /> Save changes
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Account Management tab
// ─────────────────────────────────────────────────────────────────────────────
function AccountManagement({ user }) {
  const [linkedAccounts, setLinkedAccounts] = useState([
    user?.email || "y****@hotmail.fr",
  ]);
  const removeLinked = (i) =>
    setLinkedAccounts((l) => l.filter((_, idx) => idx !== i));

  return (
    <Content>
      {/* Security */}
      <Card delay="0ms">
        <CardHeader>
          <CardTitle>
            <RiShieldLine size={13} /> Accounts Security
          </CardTitle>
        </CardHeader>
        <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
          <EditableField
            label="Linked email"
            value={user?.email || "y****@hotmail.fr"}
            type="email"
          />
          <EditableField
            label="Linked phone number"
            value="+212 *********"
            type="tel"
          />
          <EditableField
            label="Password"
            value="••••••••••••"
            type="password"
          />
          <div />
        </div>
      </Card>

      {/* Personal info */}
      <Card delay="60ms">
        <CardHeader>
          <CardTitle>
            <RiUserLine size={13} /> Personal Information
          </CardTitle>
        </CardHeader>
        <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
          <EditableField
            label="Full name"
            value={user?.name || "Tarik Amrani"}
          />
          <EditableField label="Gender" value="Male" />
          <EditableField
            label="City of residence"
            value={user?.city || "Marrakech"}
          />
          <EditableField label="Nationality" value="Moroccan" />
        </div>
      </Card>

      {/* Linked accounts */}
      <Card delay="120ms">
        <CardHeader>
          <CardTitle>
            <RiLinksLine size={13} /> Linked Accounts
          </CardTitle>
        </CardHeader>

        {linkedAccounts.map((acc, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 px-3.5 py-2.5 bg-sand rounded-xl
            border border-sand3 mb-2 transition-colors duration-150 hover:border-ink3/20"
          >
            <span className="w-8 h-8 rounded-[9px] bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <RiMailLine size={15} />
            </span>
            <input
              defaultValue={acc}
              className="flex-1 border-0 outline-none bg-transparent font-body text-[13px]
                font-semibold text-ink2 min-w-0 placeholder:text-ink3/50"
            />
            <EditBtn onClick={() => {}} title="Edit">
              <RiPencilLine size={13} />
            </EditBtn>
            <DeleteBtn onClick={() => removeLinked(i)} title="Remove">
              <RiDeleteBinLine size={13} />
            </DeleteBtn>
          </div>
        ))}

        <button
          onClick={() => setLinkedAccounts((l) => [...l, ""])}
          className="flex items-center justify-center gap-1.5 w-full px-4 py-2 mt-1 rounded-[10px]
            border border-dashed border-ink3/30 bg-transparent text-ink3
            font-body text-[12px] font-bold cursor-pointer transition-all duration-150
            hover:border-primary hover:text-primary hover:bg-primary/5"
        >
          <RiAddLine size={14} /> Add linked account
        </button>
      </Card>

      <SaveRow />
    </Content>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Business Profiles
// ─────────────────────────────────────────────────────────────────────────────
function BusinessProfiles({ user }) {
  const [form, setForm] = useState({
    category: "",
    title: "",
    description: "",
    location: "",
    images: [],
  });
  const [businesses, setBusinesses] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`${BASE_URL}/businesses?userId=${user.id}`)
      .then((r) => r.json())
      .then((d) => setBusinesses(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, [user?.id]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleImageUpload = (e) => {
    const urls = Array.from(e.target.files).map((f) => URL.createObjectURL(f));
    setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
  };

  const handleAdd = async () => {
    if (!form.title.trim() || !form.category) return;
    setSaving(true);
    const newBiz = {
      userId: user?.id,
      ...form,
      createdAt: new Date().toISOString().split("T")[0],
    };
    try {
      const res = await fetch(`${BASE_URL}/businesses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBiz),
      });
      const saved = await res.json();
      setBusinesses((p) => [...p, saved]);
    } catch {
      setBusinesses((p) => [...p, { ...newBiz, id: Date.now().toString() }]);
    } finally {
      setForm({
        category: "",
        title: "",
        description: "",
        location: "",
        images: [],
      });
      setSaving(false);
    }
  };

  const setBizField = (id, k, v) =>
    setBusinesses((p) => p.map((b) => (b.id === id ? { ...b, [k]: v } : b)));

  const handleCommit = (biz) =>
    fetch(`${BASE_URL}/businesses/${biz.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(biz),
    });

  const handleDelete = (id) => {
    setBusinesses((p) => p.filter((b) => b.id !== id));
    fetch(`${BASE_URL}/businesses/${id}`, { method: "DELETE" });
  };

  return (
    <>
      {/* ── Add form ── */}
      <Card delay="0ms">
        <CardHeader>
          <CardTitle>
            <RiStoreLine size={13} /> Fill Form
          </CardTitle>
        </CardHeader>

        <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
          {/* Left */}
          <div className="flex flex-col gap-3.5">
            <FieldWrap>
              <FieldLabel>Your business category</FieldLabel>
              <FieldRow>
                <select
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-sand3 bg-sand
                    font-body text-[13px] font-semibold text-ink2 outline-none cursor-pointer
                    focus:border-primary transition-colors"
                >
                  <option value="">select</option>
                  {BIZ_CATS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <EditBtn title="Edit">
                  <RiPencilLine size={14} />
                </EditBtn>
              </FieldRow>
            </FieldWrap>

            <FieldWrap>
              <FieldLabel>Title</FieldLabel>
              <FieldRow>
                <FieldInput
                  editing
                  placeholder="Enter business display title"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                />
                <EditBtn title="Edit">
                  <RiPencilLine size={14} />
                </EditBtn>
              </FieldRow>
            </FieldWrap>

            <FieldWrap>
              <FieldLabel>Upload pictures</FieldLabel>
              <FieldRow>
                <label className="flex-1 cursor-pointer">
                  <div
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border
                    border-dashed border-ink3/30 bg-sand text-ink3 font-body text-[13px] font-semibold
                    transition-all duration-150 cursor-pointer
                    hover:border-primary hover:text-primary hover:bg-primary/4"
                  >
                    <RiImageAddLine size={16} />
                    {form.images.length > 0
                      ? `${form.images.length} image(s) selected`
                      : "Add picture"}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
                <EditBtn title="Edit">
                  <RiPencilLine size={14} />
                </EditBtn>
              </FieldRow>
            </FieldWrap>
          </div>

          {/* Right */}
          <div className="flex flex-col gap-3.5">
            <FieldWrap>
              <FieldLabel>Description</FieldLabel>
              <FieldRow className="items-start">
                <textarea
                  placeholder="more about your business"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sand3 bg-sand
                    font-body text-[13px] font-semibold text-ink2 outline-none resize-y
                    min-h-[90px] box-border transition-all duration-200
                    placeholder:text-ink3/50 placeholder:font-normal
                    focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
                <EditBtn className="mt-0.5" title="Edit">
                  <RiPencilLine size={14} />
                </EditBtn>
              </FieldRow>
            </FieldWrap>

            <FieldWrap>
              <FieldLabel>Location</FieldLabel>
              <FieldRow>
                <FieldInput
                  editing
                  placeholder="Business location"
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                />
                <EditBtn title="Pin">
                  <RiMapPinLine size={14} />
                </EditBtn>
                <EditBtn title="Edit">
                  <RiPencilLine size={14} />
                </EditBtn>
              </FieldRow>
            </FieldWrap>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleAdd}
            disabled={saving}
            className="flex items-center gap-1.5 px-7 py-[11px] rounded-xl border-0 bg-accent
              text-white font-body text-sm font-bold cursor-pointer transition-all duration-150
              hover:bg-amber-700 hover:scale-[1.02]
              disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            <RiAddLine size={15} />
            {saving ? "Adding…" : "Add Business"}
          </button>
        </div>
      </Card>

      {/* ── Your businesses ── */}
      <Card delay="80ms">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-lg font-bold text-ink2 m-0">
            Your businesses
          </h3>
          <button
            className="flex items-center gap-1.5 px-[18px] py-2 rounded-[10px] border
            border-sand3 bg-transparent text-ink3 font-body text-[13px] font-bold cursor-pointer
            transition-all duration-150 hover:border-accent hover:text-accent"
          >
            <RiFilterLine size={14} /> Filter
          </button>
        </div>

        {businesses.length === 0 && (
          <div className="text-center py-8 text-ink3 font-body text-[13px]">
            No businesses yet. Fill the form above to add your first one.
          </div>
        )}

        {businesses.map((biz) => (
          <div
            key={biz.id}
            className="border border-sand3 rounded-2xl p-5 bg-white mb-4"
          >
            {/* Editable title */}
            <div className="mb-3.5">
              <FieldRow>
                <FieldInput
                  editing
                  value={biz.title}
                  onChange={(e) => setBizField(biz.id, "title", e.target.value)}
                  className="font-display text-[15px] font-bold text-accent"
                />
                <EditBtn title="Edit title">
                  <RiPencilLine size={13} />
                </EditBtn>
              </FieldRow>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-4 max-[640px]:grid-cols-1">
              {/* Images */}
              {biz.images?.length > 0 ? (
                <div className="grid grid-cols-2 gap-1 rounded-xl overflow-hidden">
                  {biz.images.slice(0, 3).map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className={`w-full object-cover block ${i === 0 ? "col-span-2 h-[110px]" : "h-[80px]"}`}
                    />
                  ))}
                </div>
              ) : (
                <div
                  className="w-full h-[200px] rounded-xl bg-sand2 flex items-center justify-center
                  text-ink3 font-body text-[13px]"
                >
                  <RiImageAddLine size={22} className="mr-1.5" /> No images
                </div>
              )}

              {/* Details */}
              <div className="flex flex-col gap-2.5">
                <div className="font-body text-[12px] font-bold text-ink3 flex items-center gap-1.5">
                  Category:{" "}
                  <span className="text-ink2 font-semibold text-[13px]">
                    {biz.category}
                  </span>
                  <EditBtn title="Edit category">
                    <RiPencilLine size={12} />
                  </EditBtn>
                </div>

                <FieldWrap>
                  <div className="font-body text-[12px] font-bold text-ink3 flex items-center gap-1.5">
                    Description:{" "}
                    <EditBtn title="Edit description">
                      <RiPencilLine size={12} />
                    </EditBtn>
                  </div>
                  <div
                    className="border border-sand3 rounded-[10px] px-3.5 py-2.5 font-body text-[12px]
                    text-ink2 leading-relaxed bg-sand max-h-[120px] overflow-y-auto"
                  >
                    {biz.description || "No description provided."}
                  </div>
                </FieldWrap>

                <FieldWrap>
                  <div className="font-body text-[12px] font-bold text-ink3">
                    Location:
                  </div>
                  <FieldRow>
                    <FieldInput
                      editing
                      value={biz.location}
                      onChange={(e) =>
                        setBizField(biz.id, "location", e.target.value)
                      }
                      placeholder="Business location"
                      className="text-[12px] py-2 px-3"
                    />
                    <EditBtn title="Pin">
                      <RiMapPinLine size={13} />
                    </EditBtn>
                    <EditBtn title="Edit">
                      <RiPencilLine size={13} />
                    </EditBtn>
                  </FieldRow>
                </FieldWrap>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 mt-3.5 items-center">
              <button
                className="px-5 py-2 rounded-[10px] border border-sand3 bg-transparent text-ink2
                font-body text-[13px] font-bold cursor-pointer transition-all duration-150 hover:bg-sand2"
              >
                Visit Profile
              </button>
              <button
                onClick={() => handleCommit(biz)}
                className="px-5 py-2 rounded-[10px] border-0 bg-accent text-white font-body text-[13px]
                  font-bold cursor-pointer transition-all duration-150 hover:bg-amber-700 hover:scale-[1.02]"
              >
                Commit Changes
              </button>
              <DeleteBtn
                onClick={() => handleDelete(biz.id)}
                className="ml-auto"
                title="Delete"
              >
                <RiDeleteBinLine size={14} />
              </DeleteBtn>
            </div>
          </div>
        ))}
      </Card>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Professional Profiles tab
// ─────────────────────────────────────────────────────────────────────────────
function TabSwitcher({ profileType, setProfileType }) {
  return (
    <Card delay="0ms">
      <CardHeader>
        <CardTitle>
          <RiBriefcaseLine size={13} /> Manage your profiles
        </CardTitle>
      </CardHeader>
      <div className="flex gap-2.5 flex-wrap">
        {[
          {
            id: "guide",
            icon: <RiCompassLine size={14} />,
            label: "Guide profile",
          },
          {
            id: "business",
            icon: <RiBriefcaseLine size={14} />,
            label: "Business profile",
          },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setProfileType(t.id)}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-xl border font-body text-[13px]
              font-bold cursor-pointer transition-all duration-150
              hover:border-primary hover:text-primary
              ${
                profileType === t.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-sand3 bg-transparent text-ink3"
              }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>
    </Card>
  );
}

function ProfessionalProfiles({ user }) {
  const [profileType, setProfileType] = useState("guide");
  const [activeTypes, setActiveTypes] = useState(["Cultural", "Historical"]);
  const [activeLangs, setActiveLangs] = useState([
    "Arabic",
    "English",
    "French",
  ]);
  const [activeExpert, setActiveExpert] = useState(["Cultural & Historical"]);
  const [activeDays, setActiveDays] = useState([
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
  ]);
  const [timeFrom, setTimeFrom] = useState("08:30");
  const [timeTo, setTimeTo] = useState("18:30");

  const toggle = (list, setList, val) =>
    setList((p) =>
      p.includes(val) ? p.filter((v) => v !== val) : [...p, val],
    );

  if (profileType === "business") {
    return (
      <Content>
        <TabSwitcher
          profileType={profileType}
          setProfileType={setProfileType}
        />
        <BusinessProfiles user={user} />
      </Content>
    );
  }

  return (
    <Content>
      <TabSwitcher profileType={profileType} setProfileType={setProfileType} />

      {/* ── Identification ── */}
      <Card delay="60ms">
        <CardHeader>
          <CardTitle>
            <RiUserLine size={13} /> Identification Information
          </CardTitle>
        </CardHeader>
        <div className="grid grid-cols-1 gap-4">
          <FieldWrap>
            <FieldLabel>Type of guide</FieldLabel>
            <div className="flex flex-wrap gap-1.5">
              {GUIDE_TYPES.map((t) => (
                <PillBtn
                  key={t}
                  active={activeTypes.includes(t)}
                  onClick={() => toggle(activeTypes, setActiveTypes, t)}
                >
                  <RiCompassLine size={11} /> {t}
                </PillBtn>
              ))}
            </div>
          </FieldWrap>

          <FieldWrap>
            <FieldLabel>Languages spoken</FieldLabel>
            <div className="flex flex-wrap gap-1.5">
              {LANGUAGES.map((l) => (
                <PillBtn
                  key={l}
                  active={activeLangs.includes(l)}
                  onClick={() => toggle(activeLangs, setActiveLangs, l)}
                >
                  <TbLanguage size={11} /> {l}
                </PillBtn>
              ))}
            </div>
          </FieldWrap>

          <FieldWrap>
            <FieldLabel>Field of expertise</FieldLabel>
            <div className="flex flex-wrap gap-1.5">
              {EXPERTISE.map((f) => (
                <PillBtn
                  key={f}
                  active={activeExpert.includes(f)}
                  onClick={() => toggle(activeExpert, setActiveExpert, f)}
                >
                  <TbTargetArrow size={11} /> {f}
                </PillBtn>
              ))}
            </div>
          </FieldWrap>
        </div>
      </Card>

      {/* ── Availability ── */}
      <Card delay="120ms">
        <CardHeader>
          <CardTitle>
            <RiCalendarLine size={13} /> Availability
          </CardTitle>
        </CardHeader>

        <FieldWrap>
          <FieldLabel>Days available</FieldLabel>
          <div className="grid grid-cols-7 gap-1.5 max-[640px]:grid-cols-4">
            {DAYS.map((d) => (
              <DayBtn
                key={d}
                active={activeDays.includes(d)}
                onClick={() => toggle(activeDays, setActiveDays, d)}
              >
                {d}
              </DayBtn>
            ))}
          </div>
        </FieldWrap>

        <FieldWrap className="mt-4">
          <FieldLabel>
            <span className="flex items-center gap-1">
              <RiTimeLine size={11} /> Hours available
            </span>
          </FieldLabel>
          <div className="flex items-center gap-2.5 mt-1 flex-wrap">
            <input
              type="time"
              value={timeFrom}
              onChange={(e) => setTimeFrom(e.target.value)}
              className="px-3 py-2 rounded-xl border border-sand3 bg-sand font-body text-[13px]
                font-semibold text-ink2 outline-none focus:border-primary transition-colors"
            />
            <span className="font-body text-[13px] text-ink3 font-bold">→</span>
            <input
              type="time"
              value={timeTo}
              onChange={(e) => setTimeTo(e.target.value)}
              className="px-3 py-2 rounded-xl border border-sand3 bg-sand font-body text-[13px]
                font-semibold text-ink2 outline-none focus:border-primary transition-colors"
            />
          </div>
        </FieldWrap>

        <FieldWrap className="mt-4">
          <FieldLabel>Period</FieldLabel>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: "All year", active: true },
              { label: "Seasonal", active: false },
            ].map((p) => (
              <PillBtn key={p.label} active={p.active} onClick={() => {}}>
                <RiCalendarLine size={11} /> {p.label}
              </PillBtn>
            ))}
          </div>
        </FieldWrap>
      </Card>

      <SaveRow />
    </Content>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  AccountPage root
// ─────────────────────────────────────────────────────────────────────────────
export default function AccountPage() {
  const user = useSelector(selectUser);
  const [tab, setTab] = useState("management");

  const avatarSrc =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=5b8523&color=fff&size=128`;

  const TABS = [
    {
      id: "management",
      label: "Account management",
      icon: <RiUserLine size={15} />,
    },
    {
      id: "profiles",
      label: "Professional profiles",
      icon: <RiBriefcaseLine size={15} />,
    },
  ];

  return (
    <div className="min-h-screen bg-sand">
      {/* ── Page header ── */}
      <div className="bg-ink2 px-10 py-7 max-[768px]:px-5 max-[768px]:py-5">
        <h1 className="animate-slide-up-1 font-display text-[clamp(1.5rem,3vw,2rem)] font-bold text-white m-0 mb-1">
          My Account
        </h1>
        <p className="animate-slide-up-2 font-body text-[13px] text-white/50 m-0">
          Manage your profile and professional settings
        </p>
      </div>

      {/* ── Layout ── */}
      <div
        className="grid grid-cols-[260px_1fr] max-w-[1100px] mx-auto my-8 mb-[60px] px-7 gap-6
        items-start max-[900px]:grid-cols-1 max-[900px]:px-4 max-[900px]:mt-5"
      >
        {/* ── Sidebar ── */}
        <aside
          className="animate-fade-up bg-white rounded-[20px] border border-sand3 overflow-hidden
          sticky top-[90px] max-[900px]:static"
        >
          {/* Profile header */}
          <div className="bg-gradient-to-br from-ink2 to-ink px-5 py-7 flex flex-col items-center gap-2.5 text-center">
            <div className="relative w-[78px] h-[78px]">
              <img
                src={avatarSrc}
                alt={user?.name}
                className="w-[78px] h-[78px] rounded-full object-cover border-[3px] border-green-mid/40 block"
              />
              <button
                title="Change photo"
                className="absolute bottom-0.5 right-0.5 w-6 h-6 rounded-full border-2 border-white
                  bg-primary text-white flex items-center justify-center cursor-pointer
                  transition-colors duration-150 hover:bg-accent"
              >
                <RiPencilLine size={12} />
              </button>
            </div>
            <h2 className="font-display text-[16px] font-bold text-white m-0">
              {user?.name || "Tarik Amrani"}
            </h2>
            <p className="font-body text-[11px] text-white/50 m-0">
              {user?.email || "t****@cityguide.ma"}
            </p>
            {user?.role === "admin" && (
              <span
                className="inline-flex items-center gap-1 bg-primary/20 text-green-light
                border border-green-mid/30 font-body text-[10px] font-bold px-2.5 py-0.5 rounded-full"
              >
                <RiShieldCheckLine size={9} /> Admin
              </span>
            )}
          </div>

          {/* Nav */}
          <nav className="px-2.5 py-2.5 pb-3.5 flex flex-col gap-0.5">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl border
                  font-body text-[13px] cursor-pointer text-left transition-all duration-150
                  hover:bg-primary/7 hover:text-primary
                  ${
                    tab === t.id
                      ? "border-primary bg-primary/10 text-primary font-bold"
                      : "border-transparent bg-transparent text-ink2 font-semibold"
                  }`}
              >
                <span className="flex items-center flex-shrink-0">
                  {t.icon}
                </span>
                {t.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* ── Content ── */}
        {tab === "management" ? (
          <AccountManagement user={user} />
        ) : (
          <ProfessionalProfiles user={user} />
        )}
      </div>
    </div>
  );
}
