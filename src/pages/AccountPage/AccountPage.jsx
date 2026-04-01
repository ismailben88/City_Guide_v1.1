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

import {
  PageWrap, PageHeader, PageTitle, PageSub,
  Layout, Sidebar, SidebarProfile,
  AvatarWrap, Avatar, AvatarEditBtn,
  SidebarName, SidebarEmail, SidebarBadge,
  SidebarNav, SidebarTab, TabIcon,
  Content, Card, CardHeader, CardTitle,
  FieldGrid, FieldWrap, FieldLabel, FieldRow,
  FieldInput, EditBtn, DeleteBtn,
  ChipList, Chip,
  AvailGrid, DayBtn, TimeRow, TimeInput, TimeSep,
  SaveRow, SaveBtn, CancelBtn,
  ProfileTabsRow, ProfileTypeBtn,
  LinkedRow, LinkedIcon, LinkedInput, AddLinkedBtn,
  // ── new business styles ──
  BusinessFormGrid, Textarea, BizSelect, ImageUploadBox, AddBusinessBtn,
  BusinessListHeader, BusinessListTitle, FilterBtn,
  BusinessCard, BusinessCardTitle, BusinessCardBody,
  BusinessImgGrid, BusinessImg, BusinessImgPlaceholder,
  BusinessDetails, BusinessMeta, BusinessDescBox,
  LocationRow, BusinessCardActions, VisitBtn, CommitBtn, EmptyBusinesses,
} from "./AccountPage.styles";

// ─── Data ────────────────────────────────────────────────────────────────────
const BASE_URL = "http://localhost:3001";
const DAYS         = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const GUIDE_TYPES  = ["Cultural", "Historical", "Adventure", "Gastronomy", "Nature", "Urban"];
const LANGUAGES    = ["Arabic", "English", "French", "Spanish", "German", "Italian"];
const EXPERTISE    = ["Cultural & Historical", "Local & Authentic Experiences", "Nature & Adventure", "Gastronomy & Food", "Architecture & Art"];
const BIZ_CATEGORIES = [
  "Restaurant", "Riad / Hotel", "Hammam & Spa",
  "Tour Operator", "Artisan / Craft", "Lodging",
  "Café", "Museum", "Other",
];

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
          $editing={editing}
          onChange={(e) => setVal(e.target.value)}
        />
        <EditBtn
          $active={editing}
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
      <Card $delay="0ms">
        <CardHeader>
          <CardTitle>
            <RiShieldLine size={13} /> Account Security
          </CardTitle>
        </CardHeader>
        <FieldGrid>
          <EditableField label="Linked email"        value={user?.email || "y****@hotmail.fr"} type="email"    />
          <EditableField label="Linked phone number" value="+212 *********"                    type="tel"      />
          <EditableField label="Password"            value="••••••••••••"                      type="password" />
          <div />
        </FieldGrid>
      </Card>

      {/* ── Personal Information ── */}
      <Card $delay="60ms">
        <CardHeader>
          <CardTitle>
            <RiUserLine size={13} /> Personal Information
          </CardTitle>
        </CardHeader>
        <FieldGrid>
          <EditableField label="Full name"         value={user?.name || "Tarik Amrani"} />
          <EditableField label="Gender"            value="Male"                         />
          <EditableField label="City of residence" value={user?.city || "Marrakech"}    />
          <EditableField label="Nationality"       value="Moroccan"                     />
        </FieldGrid>
      </Card>

      {/* ── Linked Accounts ── */}
      <Card $delay="120ms">
        <CardHeader>
          <CardTitle>
            <RiLinksLine size={13} /> Linked Accounts
          </CardTitle>
        </CardHeader>

        {linkedAccounts.map((acc, i) => (
          <LinkedRow key={i}>
            <LinkedIcon><RiMailLine size={15} /></LinkedIcon>
            <LinkedInput defaultValue={acc} />
            <EditBtn onClick={() => {}} title="Edit">
              <RiPencilLine size={13} />
            </EditBtn>
            <DeleteBtn onClick={() => removeLinked(i)} title="Remove">
              <RiDeleteBinLine size={13} />
            </DeleteBtn>
          </LinkedRow>
        ))}

        <AddLinkedBtn onClick={() => setLinkedAccounts((l) => [...l, ""])}>
          <RiAddLine size={14} /> Add linked account
        </AddLinkedBtn>
      </Card>

      <SaveRow>
        <CancelBtn><RiDeleteBinLine size={14} /> Cancel</CancelBtn>
        <SaveBtn><RiSaveLine size={14} /> Save changes</SaveBtn>
      </SaveRow>

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

  // fetch this user's businesses on mount
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
      // fallback: add locally if endpoint not yet created
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
      <Card $delay="0ms">
        <CardHeader>
          <CardTitle><RiStoreLine size={13} /> Fill Form</CardTitle>
        </CardHeader>

        <BusinessFormGrid>

          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            <FieldWrap>
              <FieldLabel>Your business category</FieldLabel>
              <FieldRow>
                <BizSelect
                  value={form.category}
                  onChange={(e) => handleField("category", e.target.value)}
                >
                  <option value="">select</option>
                  {BIZ_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </BizSelect>
                <EditBtn title="Edit"><RiPencilLine size={14} /></EditBtn>
              </FieldRow>
            </FieldWrap>

            <FieldWrap>
              <FieldLabel>Title</FieldLabel>
              <FieldRow>
                <FieldInput
                  $editing={true}
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
                <label style={{ flex: 1, cursor: "pointer" }}>
                  <ImageUploadBox>
                    <RiImageAddLine size={16} />
                    {form.images.length > 0
                      ? `${form.images.length} image(s) selected`
                      : "Add picture"}
                  </ImageUploadBox>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                  />
                </label>
                <EditBtn title="Edit"><RiPencilLine size={14} /></EditBtn>
              </FieldRow>
            </FieldWrap>

          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            <FieldWrap>
              <FieldLabel>Description</FieldLabel>
              <FieldRow style={{ alignItems: "flex-start" }}>
                <Textarea
                  placeholder="more about your business"
                  value={form.description}
                  onChange={(e) => handleField("description", e.target.value)}
                />
                <EditBtn style={{ marginTop: 2 }} title="Edit">
                  <RiPencilLine size={14} />
                </EditBtn>
              </FieldRow>
            </FieldWrap>

            <FieldWrap>
              <FieldLabel>Location</FieldLabel>
              <FieldRow>
                <FieldInput
                  $editing={true}
                  placeholder="Business location"
                  value={form.location}
                  onChange={(e) => handleField("location", e.target.value)}
                />
                <EditBtn title="Pin"><RiMapPinLine size={14} /></EditBtn>
                <EditBtn title="Edit"><RiPencilLine size={14} /></EditBtn>
              </FieldRow>
            </FieldWrap>

          </div>
        </BusinessFormGrid>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
          <AddBusinessBtn onClick={handleAddBusiness} disabled={saving}>
            <RiAddLine size={15} />
            {saving ? "Adding…" : "Add Business"}
          </AddBusinessBtn>
        </div>
      </Card>

      {/* ── Your Businesses list ── */}
      <Card $delay="80ms">
        <BusinessListHeader>
          <BusinessListTitle>Your businesses</BusinessListTitle>
          <FilterBtn><RiFilterLine size={14} /> Filter</FilterBtn>
        </BusinessListHeader>

        {businesses.length === 0 && (
          <EmptyBusinesses>
            No businesses yet. Fill the form above to add your first one.
          </EmptyBusinesses>
        )}

        {businesses.map((biz) => (
          <BusinessCard key={biz.id}>

            {/* Editable title */}
            <BusinessCardTitle>
              <FieldRow style={{ margin: 0 }}>
                <FieldInput
                  $editing={true}
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
            </BusinessCardTitle>

            <BusinessCardBody>

              {/* Images */}
              {biz.images?.length > 0 ? (
                <BusinessImgGrid>
                  {biz.images.slice(0, 3).map((src, i) => (
                    <BusinessImg key={i} src={src} alt="" />
                  ))}
                </BusinessImgGrid>
              ) : (
                <BusinessImgPlaceholder>
                  <RiImageAddLine size={22} style={{ marginRight: 6 }} /> No images
                </BusinessImgPlaceholder>
              )}

              {/* Details */}
              <BusinessDetails>

                <BusinessMeta>
                  Category: <span>{biz.category}</span>
                  <EditBtn title="Edit category"><RiPencilLine size={12} /></EditBtn>
                </BusinessMeta>

                <FieldWrap>
                  <BusinessMeta>
                    Description:
                    <EditBtn title="Edit description"><RiPencilLine size={12} /></EditBtn>
                  </BusinessMeta>
                  <BusinessDescBox>
                    {biz.description || "No description provided."}
                  </BusinessDescBox>
                </FieldWrap>

                <FieldWrap>
                  <BusinessMeta>Location:</BusinessMeta>
                  <LocationRow>
                    <FieldInput
                      $editing={true}
                      value={biz.location}
                      onChange={(e) => handleBizField(biz.id, "location", e.target.value)}
                      placeholder="Business location"
                      style={{ fontSize: 12, padding: "8px 12px" }}
                    />
                    <EditBtn title="Pin"><RiMapPinLine size={13} /></EditBtn>
                    <EditBtn title="Edit"><RiPencilLine size={13} /></EditBtn>
                  </LocationRow>
                </FieldWrap>

              </BusinessDetails>
            </BusinessCardBody>

            <BusinessCardActions>
              <VisitBtn>Visit Profile</VisitBtn>
              <CommitBtn onClick={() => handleCommit(biz)}>Commit Changes</CommitBtn>
              <DeleteBtn
                onClick={() => handleDelete(biz.id)}
                style={{ marginLeft: "auto" }}
                title="Delete"
              >
                <RiDeleteBinLine size={14} />
              </DeleteBtn>
            </BusinessCardActions>

          </BusinessCard>
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

  // ── Tab switcher card — shared between both sub-sections ──────────────────
  const TabSwitcher = () => (
    <Card $delay="0ms">
      <CardHeader>
        <CardTitle>
          <RiBriefcaseLine size={13} /> Manage your profiles
        </CardTitle>
      </CardHeader>
      <ProfileTabsRow>
        <ProfileTypeBtn
          $active={profileType === "guide"}
          onClick={() => setProfileType("guide")}
        >
          <RiCompassLine size={14} /> Guide profile
        </ProfileTypeBtn>
        <ProfileTypeBtn
          $active={profileType === "business"}
          onClick={() => setProfileType("business")}
        >
          <RiBriefcaseLine size={14} /> Business profile
        </ProfileTypeBtn>
      </ProfileTabsRow>
    </Card>
  );

  // ── Business sub-section ──────────────────────────────────────────────────
  if (profileType === "business") {
    return (
      <Content>
        <TabSwitcher />
        <BusinessProfiles user={user} />
      </Content>
    );
  }

  // ── Guide sub-section ─────────────────────────────────────────────────────
  return (
    <Content>

      <TabSwitcher />

      {/* ── Identification ── */}
      <Card $delay="60ms">
        <CardHeader>
          <CardTitle>
            <RiUserLine size={13} /> Identification Information
          </CardTitle>
        </CardHeader>

        <FieldGrid $cols={1}>

          <FieldWrap>
            <FieldLabel>Type of guide</FieldLabel>
            <ChipList>
              {GUIDE_TYPES.map((t) => (
                <Chip
                  key={t}
                  $active={activeTypes.includes(t)}
                  onClick={() => toggle(activeTypes, setActiveTypes, t)}
                >
                  <RiCompassLine size={11} /> {t}
                </Chip>
              ))}
            </ChipList>
          </FieldWrap>

          <FieldWrap>
            <FieldLabel>Languages spoken</FieldLabel>
            <ChipList>
              {LANGUAGES.map((l) => (
                <Chip
                  key={l}
                  $active={activeLangs.includes(l)}
                  onClick={() => toggle(activeLangs, setActiveLangs, l)}
                >
                  <TbLanguage size={11} /> {l}
                </Chip>
              ))}
            </ChipList>
          </FieldWrap>

          <FieldWrap>
            <FieldLabel>Field of expertise</FieldLabel>
            <ChipList>
              {EXPERTISE.map((f) => (
                <Chip
                  key={f}
                  $active={activeExpert.includes(f)}
                  onClick={() => toggle(activeExpert, setActiveExpert, f)}
                >
                  <TbTargetArrow size={11} /> {f}
                </Chip>
              ))}
            </ChipList>
          </FieldWrap>

        </FieldGrid>
      </Card>

      {/* ── Availability ── */}
      <Card $delay="120ms">
        <CardHeader>
          <CardTitle>
            <RiCalendarLine size={13} /> Availability
          </CardTitle>
        </CardHeader>

        <FieldWrap>
          <FieldLabel>Days available</FieldLabel>
          <AvailGrid>
            {DAYS.map((d) => (
              <DayBtn
                key={d}
                $active={activeDays.includes(d)}
                onClick={() => toggle(activeDays, setActiveDays, d)}
              >
                {d}
              </DayBtn>
            ))}
          </AvailGrid>
        </FieldWrap>

        <FieldWrap style={{ marginTop: 16 }}>
          <FieldLabel>
            <RiTimeLine size={11} style={{ marginRight: 4 }} />
            Hours available
          </FieldLabel>
          <TimeRow>
            <TimeInput
              type="time"
              value={timeFrom}
              onChange={(e) => setTimeFrom(e.target.value)}
            />
            <TimeSep>→</TimeSep>
            <TimeInput
              type="time"
              value={timeTo}
              onChange={(e) => setTimeTo(e.target.value)}
            />
          </TimeRow>
        </FieldWrap>

        <FieldWrap style={{ marginTop: 16 }}>
          <FieldLabel>Period</FieldLabel>
          <ChipList>
            <Chip $active><RiCalendarLine size={11} /> All year</Chip>
            <Chip><RiCalendarLine size={11} /> Seasonal</Chip>
          </ChipList>
        </FieldWrap>
      </Card>

      <SaveRow>
        <CancelBtn><RiDeleteBinLine size={14} /> Cancel</CancelBtn>
        <SaveBtn><RiSaveLine size={14} /> Save changes</SaveBtn>
      </SaveRow>

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
    <PageWrap>

      <PageHeader>
        <PageTitle>My Account</PageTitle>
        <PageSub>Manage your profile and professional settings</PageSub>
      </PageHeader>

      <Layout>

        {/* ── Sidebar ── */}
        <Sidebar>
          <SidebarProfile>
            <AvatarWrap>
              <Avatar src={avatarSrc} alt={user?.name} />
              <AvatarEditBtn title="Change photo">
                <RiPencilLine size={12} />
              </AvatarEditBtn>
            </AvatarWrap>
            <SidebarName>{user?.name || "Tarik Amrani"}</SidebarName>
            <SidebarEmail>{user?.email || "t****@cityguide.ma"}</SidebarEmail>
            {user?.role === "admin" && (
              <SidebarBadge>
                <RiShieldCheckLine size={9} /> Admin
              </SidebarBadge>
            )}
          </SidebarProfile>

          <SidebarNav>
            {TABS.map((t) => (
              <SidebarTab
                key={t.id}
                $active={tab === t.id}
                onClick={() => setTab(t.id)}
              >
                <TabIcon>{t.icon}</TabIcon>
                {t.label}
              </SidebarTab>
            ))}
          </SidebarNav>
        </Sidebar>

        {/* ── Content ── */}
        {tab === "management"
          ? <AccountManagement user={user} />
          : <ProfessionalProfiles user={user} />
        }

      </Layout>
    </PageWrap>
  );
}