// pages/AccountPage.jsx
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  RiUserLine, RiShieldLine, RiLinksLine,
  RiMailLine,
  RiPencilLine, RiCheckLine, RiDeleteBinLine,
  RiAddLine, RiSaveLine, RiCompassLine,
  RiShieldCheckLine, RiBriefcaseLine,
  RiCalendarLine, RiTimeLine,
  RiFilterLine, RiImageAddLine, RiStoreLine, RiMapPinLine,
} from "react-icons/ri";
import { TbLanguage, TbTargetArrow } from "react-icons/tb";
import { selectUser } from "../../store/slices/authSlice";

// Keyframe animations injected once
const animStyles = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  .anim-fade-up   { animation: fadeUp 0.45s ease both; }
  .anim-fade-in   { animation: fadeIn 0.28s ease both; }
  .anim-fade-up-title { animation: fadeUp 0.5s ease both; }
  .anim-fade-up-sub   { animation: fadeUp 0.5s ease 0.07s both; }
`;

// ─── Data ────────────────────────────────────────────────────────────────────
const BASE_URL       = "http://localhost:3001";
const DAYS           = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const GUIDE_TYPES    = ["Cultural", "Historical", "Adventure", "Gastronomy", "Nature", "Urban"];
const LANGUAGES      = ["Arabic", "English", "French", "Spanish", "German", "Italian"];
const EXPERTISE      = ["Cultural & Historical", "Local & Authentic Experiences", "Nature & Adventure", "Gastronomy & Food", "Architecture & Art"];
const BIZ_CATEGORIES = [
  "Restaurant", "Riad / Hotel", "Hammam & Spa",
  "Tour Operator", "Artisan / Craft", "Lodging",
  "Café", "Museum", "Other",
];

// ─────────────────────────────────────────────────────────────────────────────
//  Shared small components
// ─────────────────────────────────────────────────────────────────────────────

function EditBtn({ active, onClick, title, children, style }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={style}
      className={`
        w-[34px] h-[34px] rounded-[9px] border-[1.5px] flex items-center justify-center
        cursor-pointer flex-shrink-0 transition-all duration-[180ms] ease-in-out
        ${active
          ? "border-[#6b9c3e] bg-[rgba(107,156,62,0.1)] text-[#6b9c3e]"
          : "border-[#e0d8ce] bg-transparent text-[#9e8e80]"
        }
        hover:border-[#6b9c3e] hover:text-[#6b9c3e] hover:bg-[rgba(107,156,62,0.08)]
      `}
    >
      {children}
    </button>
  );
}

function DeleteBtn({ onClick, title, children, style }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={style}
      className="
        w-[34px] h-[34px] rounded-[9px] border-[1.5px] border-transparent bg-transparent
        text-[#c0a090] flex items-center justify-center cursor-pointer flex-shrink-0
        transition-all duration-[180ms] ease-in-out
        hover:border-[rgba(224,90,90,0.3)] hover:bg-[rgba(224,90,90,0.08)] hover:text-[#e05a5a]
      "
    >
      {children}
    </button>
  );
}

function FieldLabel({ children }) {
  return (
    <label className="font-['Nunito',sans-serif] text-[11px] font-bold text-[#9e8e80] tracking-[0.05em]">
      {children}
    </label>
  );
}

function FieldWrap({ children, style }) {
  return (
    <div className="flex flex-col gap-[6px]" style={style}>
      {children}
    </div>
  );
}

function FieldRow({ children, style }) {
  return (
    <div className="flex items-center gap-2" style={style}>
      {children}
    </div>
  );
}

function FieldInput({ value, onChange, disabled, editing, placeholder, type = "text", style }) {
  return (
    <input
      type={type}
      value={value}
      disabled={disabled}
      onChange={onChange}
      placeholder={placeholder}
      style={style}
      className={`
        flex-1 px-[14px] py-[10px] rounded-[11px] border-[1.5px]
        font-['Nunito',sans-serif] text-[13px] font-semibold text-[#3d2b1a]
        outline-none transition-[border-color,box-shadow] duration-200 ease-in-out min-w-0
        placeholder:text-[#b0a090]
        focus:border-[#6b9c3e] focus:shadow-[0_0_0_3px_rgba(107,156,62,0.1)]
        disabled:bg-[#fafaf8] disabled:text-[#7a6a58] disabled:cursor-default
        ${editing
          ? "border-[#6b9c3e] bg-white"
          : "border-[#e0d8ce] bg-[#fafaf8]"
        }
      `}
    />
  );
}

function Card({ children, delay = "0ms" }) {
  return (
    <div
      className="anim-fade-up bg-white rounded-[20px] border-[1.5px] border-[#ede8e0] p-6"
      style={{ animationDelay: delay }}
    >
      {children}
    </div>
  );
}

function CardHeader({ children }) {
  return (
    <div className="flex items-center justify-between mb-5">
      {children}
    </div>
  );
}

function CardTitle({ children }) {
  return (
    <h3 className="font-['Nunito',sans-serif] text-[11px] font-extrabold tracking-[0.13em] uppercase text-[#7a6a58] m-0 flex items-center gap-[7px]">
      {children}
    </h3>
  );
}

function Content({ children }) {
  return (
    <div className="anim-fade-in flex flex-col gap-5">
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Reusable editable field
// ─────────────────────────────────────────────────────────────────────────────
function EditableField({ label, value, type = "text" }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal]         = useState(value || "");

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
//  Account Management tab
// ─────────────────────────────────────────────────────────────────────────────
function AccountManagement({ user }) {
  const [linkedAccounts, setLinkedAccounts] = useState([
    user?.email || "y****@hotmail.fr",
  ]);

  const removeLinked = (i) =>
    setLinkedAccounts((list) => list.filter((_, idx) => idx !== i));

  return (
    <Content>

      {/* ── Account Security ── */}
      <Card delay="0ms">
        <CardHeader>
          <CardTitle><RiShieldLine size={13} /> Accounts Security</CardTitle>
        </CardHeader>
        <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
          <EditableField label="Linked email"        value={user?.email || "y****@hotmail.fr"} type="email"    />
          <EditableField label="Linked phone number" value="+212 *********"                    type="tel"      />
          <EditableField label="Password"            value="••••••••••••"                      type="password" />
          <div />
        </div>
      </Card>

      {/* ── Personal Information ── */}
      <Card delay="60ms">
        <CardHeader>
          <CardTitle><RiUserLine size={13} /> Personal Information</CardTitle>
        </CardHeader>
        <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
          <EditableField label="Full name"         value={user?.name || "Tarik Amrani"} />
          <EditableField label="Gender"            value="Male"                         />
          <EditableField label="City of residence" value={user?.city || "Marrakech"}    />
          <EditableField label="Nationality"       value="Moroccan"                     />
        </div>
      </Card>

      {/* ── Linked Accounts ── */}
      <Card delay="120ms">
        <CardHeader>
          <CardTitle><RiLinksLine size={13} /> Linked Accounts</CardTitle>
        </CardHeader>

        {linkedAccounts.map((acc, i) => (
          <div
            key={i}
            className="
              flex items-center gap-[10px] px-[14px] py-[10px]
              bg-[#fafaf8] rounded-[12px] border-[1.5px] border-[#ede8e0]
              mb-2 transition-[border-color] duration-[180ms] ease-in-out
              hover:border-[#c8b8a8]
            "
          >
            <span className="w-8 h-8 rounded-[9px] bg-[rgba(107,156,62,0.1)] flex items-center justify-center text-[#6b9c3e] flex-shrink-0">
              <RiMailLine size={15} />
            </span>
            <input
              defaultValue={acc}
              className="
                flex-1 border-0 outline-none bg-transparent
                font-['Nunito',sans-serif] text-[13px] font-semibold text-[#3d2b1a]
                min-w-0 placeholder:text-[#b0a090]
              "
            />
            <EditBtn onClick={() => {}} title="Edit"><RiPencilLine size={13} /></EditBtn>
            <DeleteBtn onClick={() => removeLinked(i)} title="Remove"><RiDeleteBinLine size={13} /></DeleteBtn>
          </div>
        ))}

        <button
          onClick={() => setLinkedAccounts((l) => [...l, ""])}
          className="
            flex items-center justify-center gap-[6px] w-full px-4 py-2 mt-1
            rounded-[10px] border-[1.5px] border-dashed border-[#c8b8a8]
            bg-transparent text-[#9e8e80]
            font-['Nunito',sans-serif] text-[12px] font-bold cursor-pointer
            transition-all duration-[180ms] ease-in-out
            hover:border-[#6b9c3e] hover:text-[#6b9c3e] hover:bg-[rgba(107,156,62,0.05)]
          "
        >
          <RiAddLine size={14} /> Add linked account
        </button>
      </Card>

      {/* ── Save row ── */}
      <div className="flex justify-end gap-[10px] pt-2">
        <button className="
          flex items-center gap-[7px] px-5 py-[11px] rounded-[12px]
          border-[1.5px] border-[#e0d8ce] bg-transparent text-[#7a6a58]
          font-['Nunito',sans-serif] text-[14px] font-semibold cursor-pointer
          transition-all duration-[180ms] ease-in-out
          hover:bg-[#f0ebe4] hover:text-[#3d2b1a]
        ">
          <RiDeleteBinLine size={14} /> Cancel
        </button>
        <button className="
          flex items-center gap-[7px] px-7 py-[11px] rounded-[12px]
          border-0 bg-[#6b9c3e] text-white
          font-['Nunito',sans-serif] text-[14px] font-bold cursor-pointer
          transition-[background,transform] duration-[180ms] ease-in-out
          hover:bg-[#c8761a] hover:scale-[1.02]
        ">
          <RiSaveLine size={14} /> Save changes
        </button>
      </div>

    </Content>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Business Profiles sub-section
// ─────────────────────────────────────────────────────────────────────────────
function BusinessProfiles({ user }) {
  const [form, setForm] = useState({
    category: "", title: "", description: "", location: "", images: [],
  });
  const [businesses, setBusinesses] = useState([]);
  const [saving, setSaving]         = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`${BASE_URL}/businesses?userId=${user.id}`)
      .then((r) => r.json())
      .then((data) => setBusinesses(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [user?.id]);

  const handleField = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleImageUpload = (e) => {
    const urls = Array.from(e.target.files).map((f) => URL.createObjectURL(f));
    setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
  };

  const handleAddBusiness = async () => {
    if (!form.title.trim() || !form.category) return;
    setSaving(true);
    const newBiz = {
      userId:      user?.id,
      category:    form.category,
      title:       form.title,
      description: form.description,
      location:    form.location,
      images:      form.images,
      createdAt:   new Date().toISOString().split("T")[0],
    };
    try {
      const res  = await fetch(`${BASE_URL}/businesses`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(newBiz),
      });
      const saved = await res.json();
      setBusinesses((prev) => [...prev, saved]);
    } catch {
      setBusinesses((prev) => [...prev, { ...newBiz, id: Date.now().toString() }]);
    } finally {
      setForm({ category: "", title: "", description: "", location: "", images: [] });
      setSaving(false);
    }
  };

  const handleBizField = (id, key, val) =>
    setBusinesses((prev) =>
      prev.map((b) => (b.id === id ? { ...b, [key]: val } : b))
    );

  const handleCommit = async (biz) => {
    try {
      await fetch(`${BASE_URL}/businesses/${biz.id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(biz),
      });
    } catch {}
  };

  const handleDelete = async (id) => {
    setBusinesses((prev) => prev.filter((b) => b.id !== id));
    try {
      await fetch(`${BASE_URL}/businesses/${id}`, { method: "DELETE" });
    } catch {}
  };

  return (
    <>
      {/* ── Add Business Form ── */}
      <Card delay="0ms">
        <CardHeader>
          <CardTitle><RiStoreLine size={13} /> Fill Form</CardTitle>
        </CardHeader>

        {/* Two-column form grid */}
        <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">

          {/* Left column */}
          <div className="flex flex-col gap-[14px]">

            <FieldWrap>
              <FieldLabel>Your business category</FieldLabel>
              <FieldRow>
                <select
                  value={form.category}
                  onChange={(e) => handleField("category", e.target.value)}
                  className="
                    flex-1 px-[14px] py-[10px] rounded-[11px]
                    border-[1.5px] border-[#e0d8ce] bg-[#fafaf8]
                    font-['Nunito',sans-serif] text-[13px] font-semibold text-[#3d2b1a]
                    outline-none cursor-pointer
                    focus:border-[#6b9c3e]
                  "
                >
                  <option value="">select</option>
                  {BIZ_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <EditBtn title="Edit"><RiPencilLine size={14} /></EditBtn>
              </FieldRow>
            </FieldWrap>

            <FieldWrap>
              <FieldLabel>Title</FieldLabel>
              <FieldRow>
                <FieldInput
                  editing
                  placeholder="Enter business display title"
                  value={form.title}
                  onChange={(e) => handleField("title", e.target.value)}
                />
                <EditBtn title="Edit"><RiPencilLine size={14} /></EditBtn>
              </FieldRow>
            </FieldWrap>

            <FieldWrap>
              <FieldLabel>Upload pictures</FieldLabel>
              <FieldRow>
                <label className="flex-1 cursor-pointer">
                  <div className="
                    flex items-center gap-[10px] px-[14px] py-[10px]
                    rounded-[11px] border-[1.5px] border-dashed border-[#c8b8a8]
                    bg-[#fafaf8] text-[#9e8e80]
                    font-['Nunito',sans-serif] text-[13px] font-semibold
                    transition-all duration-[180ms] ease-in-out cursor-pointer
                    hover:border-[#6b9c3e] hover:text-[#6b9c3e] hover:bg-[rgba(107,156,62,0.04)]
                  ">
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
                <EditBtn title="Edit"><RiPencilLine size={14} /></EditBtn>
              </FieldRow>
            </FieldWrap>

          </div>

          {/* Right column */}
          <div className="flex flex-col gap-[14px]">

            <FieldWrap>
              <FieldLabel>Description</FieldLabel>
              <FieldRow style={{ alignItems: "flex-start" }}>
                <textarea
                  placeholder="more about your business"
                  value={form.description}
                  onChange={(e) => handleField("description", e.target.value)}
                  className="
                    w-full px-[14px] py-[10px] rounded-[11px]
                    border-[1.5px] border-[#e0d8ce] bg-[#fafaf8]
                    font-['Nunito',sans-serif] text-[13px] font-semibold text-[#3d2b1a]
                    outline-none resize-y min-h-[90px] box-border
                    transition-[border-color] duration-200 ease-in-out
                    placeholder:text-[#b0a090] placeholder:font-normal
                    focus:border-[#6b9c3e] focus:shadow-[0_0_0_3px_rgba(107,156,62,0.1)]
                  "
                />
                <EditBtn style={{ marginTop: 2 }} title="Edit"><RiPencilLine size={14} /></EditBtn>
              </FieldRow>
            </FieldWrap>

            <FieldWrap>
              <FieldLabel>Location</FieldLabel>
              <FieldRow>
                <FieldInput
                  editing
                  placeholder="Business location"
                  value={form.location}
                  onChange={(e) => handleField("location", e.target.value)}
                />
                <EditBtn title="Pin"><RiMapPinLine size={14} /></EditBtn>
                <EditBtn title="Edit"><RiPencilLine size={14} /></EditBtn>
              </FieldRow>
            </FieldWrap>

          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleAddBusiness}
            disabled={saving}
            className="
              flex items-center gap-[7px] px-7 py-[11px] rounded-[12px]
              border-0 bg-[#c8761a] text-white
              font-['Nunito',sans-serif] text-[14px] font-bold cursor-pointer
              transition-[background,transform] duration-[180ms] ease-in-out
              hover:bg-[#a85e10] hover:scale-[1.02]
              disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
            "
          >
            <RiAddLine size={15} />
            {saving ? "Adding…" : "Add Business"}
          </button>
        </div>
      </Card>

      {/* ── Your Businesses list ── */}
      <Card delay="80ms">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-['Playfair_Display',Georgia,serif] text-[18px] font-bold text-[#3d2b1a] m-0">
            Your businesses
          </h3>
          <button className="
            flex items-center gap-[7px] px-[18px] py-[9px] rounded-[10px]
            border-[1.5px] border-[#e0d8ce] bg-transparent text-[#7a6a58]
            font-['Nunito',sans-serif] text-[13px] font-bold cursor-pointer
            transition-all duration-[180ms] ease-in-out
            hover:border-[#c8761a] hover:text-[#c8761a]
          ">
            <RiFilterLine size={14} /> Filter
          </button>
        </div>

        {businesses.length === 0 && (
          <div className="text-center py-8 text-[#9e8e80] font-['Nunito',sans-serif] text-[13px]">
            No businesses yet. Fill the form above to add your first one.
          </div>
        )}

        {businesses.map((biz) => (
          <div
            key={biz.id}
            className="border-[1.5px] border-[#ede8e0] rounded-2xl p-5 bg-white mb-4"
          >
            {/* Editable title */}
            <div className="mb-[14px]">
              <FieldRow style={{ margin: 0 }}>
                <FieldInput
                  editing
                  value={biz.title}
                  onChange={(e) => handleBizField(biz.id, "title", e.target.value)}
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#c8761a",
                  }}
                />
                <EditBtn title="Edit title"><RiPencilLine size={13} /></EditBtn>
              </FieldRow>
            </div>

            {/* Body */}
            <div className="grid grid-cols-[200px_1fr] gap-4 max-[640px]:grid-cols-1">

              {/* Images */}
              {biz.images?.length > 0 ? (
                <div className="grid grid-cols-2 gap-1 rounded-[12px] overflow-hidden">
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
                <div className="w-full h-[200px] rounded-[12px] bg-[#f0ebe4] flex items-center justify-center text-[#b0a090] font-['Nunito',sans-serif] text-[13px]">
                  <RiImageAddLine size={22} className="mr-[6px]" /> No images
                </div>
              )}

              {/* Details */}
              <div className="flex flex-col gap-[10px]">

                <div className="font-['Nunito',sans-serif] text-[12px] font-bold text-[#9e8e80] flex items-center gap-[6px]">
                  Category: <span className="text-[#3d2b1a] font-semibold text-[13px]">{biz.category}</span>
                  <EditBtn title="Edit category"><RiPencilLine size={12} /></EditBtn>
                </div>

                <FieldWrap>
                  <div className="font-['Nunito',sans-serif] text-[12px] font-bold text-[#9e8e80] flex items-center gap-[6px]">
                    Description:
                    <EditBtn title="Edit description"><RiPencilLine size={12} /></EditBtn>
                  </div>
                  <div className="
                    border-[1.5px] border-[#ede8e0] rounded-[10px]
                    px-[14px] py-[10px]
                    font-['Nunito',sans-serif] text-[12px] text-[#5a4a3a] leading-relaxed
                    bg-[#fafaf8] max-h-[120px] overflow-y-auto
                  ">
                    {biz.description || "No description provided."}
                  </div>
                </FieldWrap>

                <FieldWrap>
                  <div className="font-['Nunito',sans-serif] text-[12px] font-bold text-[#9e8e80]">
                    Location:
                  </div>
                  <div className="flex items-center gap-2">
                    <FieldInput
                      editing
                      value={biz.location}
                      onChange={(e) => handleBizField(biz.id, "location", e.target.value)}
                      placeholder="Business location"
                      style={{ fontSize: 12, padding: "8px 12px" }}
                    />
                    <EditBtn title="Pin"><RiMapPinLine size={13} /></EditBtn>
                    <EditBtn title="Edit"><RiPencilLine size={13} /></EditBtn>
                  </div>
                </FieldWrap>

              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-[10px] mt-[14px] items-center">
              <button className="
                px-5 py-[9px] rounded-[10px] border-[1.5px] border-[#e0d8ce]
                bg-transparent text-[#5a4a3a]
                font-['Nunito',sans-serif] text-[13px] font-bold cursor-pointer
                transition-all duration-[180ms] ease-in-out
                hover:bg-[#f0ebe4]
              ">
                Visit Profile
              </button>
              <button
                onClick={() => handleCommit(biz)}
                className="
                  px-5 py-[9px] rounded-[10px] border-0 bg-[#c8761a] text-white
                  font-['Nunito',sans-serif] text-[13px] font-bold cursor-pointer
                  transition-[background,transform] duration-[180ms] ease-in-out
                  hover:bg-[#a85e10] hover:scale-[1.02]
                "
              >
                Commit Changes
              </button>
              <DeleteBtn
                onClick={() => handleDelete(biz.id)}
                style={{ marginLeft: "auto" }}
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
function ProfessionalProfiles({ user }) {
  const [profileType,  setProfileType]  = useState("guide");
  const [activeTypes,  setActiveTypes]  = useState(["Cultural", "Historical"]);
  const [activeLangs,  setActiveLangs]  = useState(["Arabic", "English", "French"]);
  const [activeExpert, setActiveExpert] = useState(["Cultural & Historical"]);
  const [activeDays,   setActiveDays]   = useState(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [timeFrom,     setTimeFrom]     = useState("08:30");
  const [timeTo,       setTimeTo]       = useState("18:30");

  const toggle = (list, setList, val) =>
    setList((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );

  const TabSwitcher = () => (
    <Card delay="0ms">
      <CardHeader>
        <CardTitle><RiBriefcaseLine size={13} /> Manage your profiles</CardTitle>
      </CardHeader>
      <div className="flex gap-[10px] flex-wrap">
        {[
          { id: "guide",    icon: <RiCompassLine   size={14} />, label: "Guide profile"    },
          { id: "business", icon: <RiBriefcaseLine size={14} />, label: "Business profile" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setProfileType(t.id)}
            className={`
              flex items-center gap-[7px] px-5 py-[9px] rounded-[12px]
              border-[1.5px] font-['Nunito',sans-serif] text-[13px] font-bold cursor-pointer
              transition-all duration-[180ms] ease-in-out
              ${profileType === t.id
                ? "border-[#6b9c3e] bg-[rgba(107,156,62,0.1)] text-[#6b9c3e]"
                : "border-[#e0d8ce] bg-transparent text-[#7a6a58]"
              }
              hover:border-[#6b9c3e] hover:text-[#6b9c3e]
            `}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>
    </Card>
  );

  if (profileType === "business") {
    return (
      <Content>
        <TabSwitcher />
        <BusinessProfiles user={user} />
      </Content>
    );
  }

  return (
    <Content>

      <TabSwitcher />

      {/* ── Identification ── */}
      <Card delay="60ms">
        <CardHeader>
          <CardTitle><RiUserLine size={13} /> Identification Information</CardTitle>
        </CardHeader>

        <div className="grid grid-cols-1 gap-4">

          <FieldWrap>
            <FieldLabel>Type of guide</FieldLabel>
            <div className="flex flex-wrap gap-[7px]">
              {GUIDE_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => toggle(activeTypes, setActiveTypes, t)}
                  className={`
                    flex items-center gap-[5px] px-[13px] py-[5px] rounded-full
                    border-[1.5px] font-['Nunito',sans-serif] text-[12px] font-bold cursor-pointer
                    transition-all duration-[180ms] ease-in-out
                    ${activeTypes.includes(t)
                      ? "bg-[rgba(107,156,62,0.12)] text-[#6b9c3e] border-[#dde8cc]"
                      : "bg-[#f0ebe4] text-[#7a6a58] border-[#e0d8ce]"
                    }
                    hover:bg-[rgba(107,156,62,0.12)] hover:text-[#6b9c3e] hover:border-[#dde8cc]
                  `}
                >
                  <RiCompassLine size={11} /> {t}
                </button>
              ))}
            </div>
          </FieldWrap>

          <FieldWrap>
            <FieldLabel>Languages spoken</FieldLabel>
            <div className="flex flex-wrap gap-[7px]">
              {LANGUAGES.map((l) => (
                <button
                  key={l}
                  onClick={() => toggle(activeLangs, setActiveLangs, l)}
                  className={`
                    flex items-center gap-[5px] px-[13px] py-[5px] rounded-full
                    border-[1.5px] font-['Nunito',sans-serif] text-[12px] font-bold cursor-pointer
                    transition-all duration-[180ms] ease-in-out
                    ${activeLangs.includes(l)
                      ? "bg-[rgba(107,156,62,0.12)] text-[#6b9c3e] border-[#dde8cc]"
                      : "bg-[#f0ebe4] text-[#7a6a58] border-[#e0d8ce]"
                    }
                    hover:bg-[rgba(107,156,62,0.12)] hover:text-[#6b9c3e] hover:border-[#dde8cc]
                  `}
                >
                  <TbLanguage size={11} /> {l}
                </button>
              ))}
            </div>
          </FieldWrap>

          <FieldWrap>
            <FieldLabel>Field of expertise</FieldLabel>
            <div className="flex flex-wrap gap-[7px]">
              {EXPERTISE.map((f) => (
                <button
                  key={f}
                  onClick={() => toggle(activeExpert, setActiveExpert, f)}
                  className={`
                    flex items-center gap-[5px] px-[13px] py-[5px] rounded-full
                    border-[1.5px] font-['Nunito',sans-serif] text-[12px] font-bold cursor-pointer
                    transition-all duration-[180ms] ease-in-out
                    ${activeExpert.includes(f)
                      ? "bg-[rgba(107,156,62,0.12)] text-[#6b9c3e] border-[#dde8cc]"
                      : "bg-[#f0ebe4] text-[#7a6a58] border-[#e0d8ce]"
                    }
                    hover:bg-[rgba(107,156,62,0.12)] hover:text-[#6b9c3e] hover:border-[#dde8cc]
                  `}
                >
                  <TbTargetArrow size={11} /> {f}
                </button>
              ))}
            </div>
          </FieldWrap>

        </div>
      </Card>

      {/* ── Availability ── */}
      <Card delay="120ms">
        <CardHeader>
          <CardTitle><RiCalendarLine size={13} /> Availability</CardTitle>
        </CardHeader>

        <FieldWrap>
          <FieldLabel>Days available</FieldLabel>
          <div className="grid grid-cols-7 gap-[6px] max-[640px]:grid-cols-4">
            {DAYS.map((d) => (
              <button
                key={d}
                onClick={() => toggle(activeDays, setActiveDays, d)}
                className={`
                  py-2 px-1 rounded-[10px] border-[1.5px] text-center
                  font-['Nunito',sans-serif] text-[11px] font-bold cursor-pointer
                  transition-all duration-[180ms] ease-in-out
                  ${activeDays.includes(d)
                    ? "border-[#6b9c3e] bg-[rgba(107,156,62,0.12)] text-[#6b9c3e]"
                    : "border-[#e0d8ce] bg-[#fafaf8] text-[#9e8e80]"
                  }
                  hover:border-[#6b9c3e] hover:text-[#6b9c3e] hover:bg-[rgba(107,156,62,0.08)]
                `}
              >
                {d}
              </button>
            ))}
          </div>
        </FieldWrap>

        <FieldWrap style={{ marginTop: 16 }}>
          <FieldLabel>
            <RiTimeLine size={11} style={{ marginRight: 4 }} />
            Hours available
          </FieldLabel>
          <div className="flex items-center gap-[10px] mt-4 flex-wrap">
            {[timeFrom, timeTo].map((val, idx) => (
              <>
                <input
                  key={idx}
                  type="time"
                  value={val}
                  onChange={(e) => idx === 0 ? setTimeFrom(e.target.value) : setTimeTo(e.target.value)}
                  className="
                    px-3 py-[9px] rounded-[11px] border-[1.5px] border-[#e0d8ce] bg-[#fafaf8]
                    font-['Nunito',sans-serif] text-[13px] font-semibold text-[#3d2b1a]
                    outline-none focus:border-[#6b9c3e]
                  "
                />
                {idx === 0 && (
                  <span className="font-['Nunito',sans-serif] text-[13px] text-[#9e8e80] font-bold">→</span>
                )}
              </>
            ))}
          </div>
        </FieldWrap>

        <FieldWrap style={{ marginTop: 16 }}>
          <FieldLabel>Period</FieldLabel>
          <div className="flex flex-wrap gap-[7px]">
            {[{ label: "All year", active: true }, { label: "Seasonal", active: false }].map((p) => (
              <button
                key={p.label}
                className={`
                  flex items-center gap-[5px] px-[13px] py-[5px] rounded-full
                  border-[1.5px] font-['Nunito',sans-serif] text-[12px] font-bold cursor-pointer
                  transition-all duration-[180ms] ease-in-out
                  ${p.active
                    ? "bg-[rgba(107,156,62,0.12)] text-[#6b9c3e] border-[#dde8cc]"
                    : "bg-[#f0ebe4] text-[#7a6a58] border-[#e0d8ce]"
                  }
                  hover:bg-[rgba(107,156,62,0.12)] hover:text-[#6b9c3e] hover:border-[#dde8cc]
                `}
              >
                <RiCalendarLine size={11} /> {p.label}
              </button>
            ))}
          </div>
        </FieldWrap>
      </Card>

      <div className="flex justify-end gap-[10px] pt-2">
        <button className="
          flex items-center gap-[7px] px-5 py-[11px] rounded-[12px]
          border-[1.5px] border-[#e0d8ce] bg-transparent text-[#7a6a58]
          font-['Nunito',sans-serif] text-[14px] font-semibold cursor-pointer
          transition-all duration-[180ms] ease-in-out
          hover:bg-[#f0ebe4] hover:text-[#3d2b1a]
        ">
          <RiDeleteBinLine size={14} /> Cancel
        </button>
        <button className="
          flex items-center gap-[7px] px-7 py-[11px] rounded-[12px]
          border-0 bg-[#6b9c3e] text-white
          font-['Nunito',sans-serif] text-[14px] font-bold cursor-pointer
          transition-[background,transform] duration-[180ms] ease-in-out
          hover:bg-[#c8761a] hover:scale-[1.02]
        ">
          <RiSaveLine size={14} /> Save changes
        </button>
      </div>

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
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=6b9c3e&color=fff&size=128`;

  const TABS = [
    { id: "management", label: "Account management",    icon: <RiUserLine      size={15} /> },
    { id: "profiles",   label: "Professional profiles", icon: <RiBriefcaseLine size={15} /> },
  ];

  return (
    <>
      <style>{animStyles}</style>

      {/* ── Page wrapper ── */}
      <div className="min-h-screen bg-[#f7f4f0]">

        {/* ── Page header ── */}
        <div className="bg-[#3d2b1a] px-10 py-7 max-[768px]:px-5 max-[768px]:py-5">
          <h1 className="anim-fade-up-title font-['Playfair_Display',Georgia,serif] text-[clamp(1.5rem,3vw,2rem)] font-bold text-white m-0 mb-1">
            My Account
          </h1>
          <p className="anim-fade-up-sub font-['Nunito',sans-serif] text-[13px] text-white/50 m-0">
            Manage your profile and professional settings
          </p>
        </div>

        {/* ── Layout ── */}
        <div className="grid grid-cols-[260px_1fr] max-w-[1100px] mx-auto my-8 mb-[60px] px-7 gap-6 items-start max-[900px]:grid-cols-1 max-[900px]:px-4 max-[900px]:mt-5">

          {/* ── Sidebar ── */}
          <aside className="anim-fade-up bg-white rounded-[20px] border-[1.5px] border-[#ede8e0] overflow-hidden sticky top-[90px] max-[900px]:static">

            {/* Profile header */}
            <div className="bg-gradient-to-br from-[#3d2b1a] to-[#5c3d24] px-5 py-7 flex flex-col items-center gap-[10px] text-center">
              <div className="relative w-[78px] h-[78px]">
                <img
                  src={avatarSrc}
                  alt={user?.name}
                  className="w-[78px] h-[78px] rounded-full object-cover border-[3px] border-[rgba(200,217,138,0.45)] block"
                />
                <button
                  title="Change photo"
                  className="
                    absolute bottom-[1px] right-[1px] w-6 h-6 rounded-full
                    border-2 border-white bg-[#6b9c3e] text-white
                    flex items-center justify-center cursor-pointer
                    transition-[background] duration-[180ms] ease-in-out
                    hover:bg-[#c8761a]
                  "
                >
                  <RiPencilLine size={12} />
                </button>
              </div>
              <h2 className="font-['Playfair_Display',Georgia,serif] text-[16px] font-bold text-white m-0">
                {user?.name || "Tarik Amrani"}
              </h2>
              <p className="font-['Nunito',sans-serif] text-[11px] text-white/50 m-0">
                {user?.email || "t****@cityguide.ma"}
              </p>
              {user?.role === "admin" && (
                <span className="
                  inline-flex items-center gap-1
                  bg-[rgba(107,156,62,0.22)] text-[#c8d98a]
                  border border-[rgba(200,217,138,0.28)]
                  font-['Nunito',sans-serif] text-[10px] font-bold
                  px-[10px] py-[3px] rounded-full
                ">
                  <RiShieldCheckLine size={9} /> Admin
                </span>
              )}
            </div>

            {/* Nav */}
            <nav className="px-[10px] py-[10px] pb-[14px] flex flex-col gap-[3px]">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`
                    flex items-center gap-[10px] w-full px-[14px] py-[10px] rounded-[12px]
                    border-[1.5px] font-['Nunito',sans-serif] text-[13px] cursor-pointer text-left
                    transition-all duration-[180ms] ease-in-out
                    ${tab === t.id
                      ? "border-[#6b9c3e] bg-[rgba(107,156,62,0.1)] text-[#6b9c3e] font-bold"
                      : "border-transparent bg-transparent text-[#5a4a3a] font-semibold"
                    }
                    hover:bg-[rgba(107,156,62,0.07)] hover:text-[#6b9c3e]
                  `}
                >
                  <span className="flex items-center flex-shrink-0">{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* ── Content ── */}
          {tab === "management"
            ? <AccountManagement user={user} />
            : <ProfessionalProfiles user={user} />
          }

        </div>
      </div>
    </>
  );
}