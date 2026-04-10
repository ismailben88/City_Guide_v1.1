import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoStarSharp, IoStarOutline } from "react-icons/io5";
import {
  RiArrowLeftLine, RiShieldCheckLine, RiMapPin2Line, RiMailLine,
  RiInstagramLine, RiTwitterXLine, RiPhoneLine,
  RiPriceTag3Line, RiCompassLine, RiTeamLine,
} from "react-icons/ri";
import { TbLanguage, TbTargetArrow, TbCalendarEvent } from "react-icons/tb";

import { api } from "../../services/api"; // Ton service API mis à jour
import CommentSection from "../../components/comentSection/CommentSection"; // Vérifie l'import

export default function GuideProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        setLoading(true);
        const data = await api.getGuideById(id);
        setGuide(data);
      } catch (err) {
        console.error("Error loading guide:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchGuide();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!guide) return <div className="p-20 text-center">Guide not found.</div>;

  // Adaptations aux nouveaux noms de champs du JSON
  const g = guide;
  const fullStars = Math.round(g.averageRating || 0);
  const emptyStars = 5 - fullStars;
  const isVerified = g.verificationStatus === "verified";
  const price = g.dailyRate;
  const reviewsCount = g.totalTours; // Ou utilise un champ reviewCount si présent

  const CONTACTS = [
    { icon: <RiMailLine size={15} />, href: `mailto:${g.contactEmail}`, label: g.contactEmail },
    { icon: <RiPhoneLine size={15} />, href: `tel:${g.phone}`, label: g.phone },
  ].filter((c) => c.label);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* --- BANNER --- */}
      <div className="relative w-full h-[260px] bg-[#7a5c3a]">
        {g.bannerUrl && (
          <img 
            src={g.bannerUrl} 
            className="absolute inset-0 w-full h-full object-cover block" 
            alt="Banner"
          />
        )}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-transparent to-black/40" />

        <button 
          onClick={() => navigate(-1)}
          className="absolute top-5 left-5 z-10 flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white rounded-full px-4 py-2 text-sm font-bold border border-white/30 transition-all hover:bg-white/40"
        >
          <RiArrowLeftLine size={14} /> Back
        </button>

        {/* Avatar Protrudé */}
        <div className="absolute -bottom-[45px] left-1/2 -translate-x-1/2 z-20 w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-xl bg-gray-200">
          <img src={g.avatar} alt={g.name} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* --- HEADER --- */}
      <header className="flex flex-col items-center gap-2 pt-16 px-5 pb-6 text-center">
        <h1 className="font-display text-3xl font-bold text-ink2 flex items-center justify-center gap-2">
          {g.name}
          {isVerified && (
            <span className="bg-emerald-50 text-emerald-600 text-[10px] px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
              <RiShieldCheckLine size={12} /> Verified
            </span>
          )}
        </h1>

        <div className="flex items-center gap-1 text-ink3 text-sm">
          <RiMapPin2Line size={14} /> {g.cityNames?.join(", ")}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex text-yellow-500">
            {[...Array(fullStars)].map((_, i) => <IoStarSharp key={i} />)}
            {[...Array(emptyStars)].map((_, i) => <IoStarOutline key={i} />)}
          </div>
          <span className="text-sm font-bold">{g.averageRating}</span>
          <span className="text-xs text-ink3">({reviewsCount} tours)</span>
        </div>

        <button className="mt-4 bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
          <TbCalendarEvent size={18} /> Book this guide
        </button>
      </header>

      {/* --- STATS --- */}
      <div className="flex justify-center max-w-xl mx-auto mb-10 bg-white border border-sand3 rounded-2xl shadow-sm overflow-hidden">
        {[
          { label: "Rating", value: g.averageRating },
          { label: "Tours", value: g.totalTours },
          { label: "MAD / day", value: price },
          { label: "Languages", value: g.languages?.length }
        ].map((stat, i) => (
          <div key={i} className="flex-1 py-4 text-center border-r border-sand3 last:border-r-0">
            <div className="text-xl font-bold text-ink2">{stat.value}</div>
            <div className="text-[10px] font-bold text-ink3 uppercase tracking-tighter">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* --- CONTENT --- */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          
          <div className="space-y-6">
            <section className="bg-white rounded-3xl border border-sand3 p-8">
              <h3 className="text-xs font-black uppercase tracking-widest text-ink3 mb-4 flex items-center gap-2">
                <RiCompassLine /> About
              </h3>
              <p className="text-ink2/80 leading-relaxed whitespace-pre-line">{g.bio || "Experience Morocco with a local expert."}</p>
            </section>

            {/* Section Commentaires Connectée à l'API */}
            <section className="bg-white rounded-3xl border border-sand3 p-8">
              <h3 className="text-xs font-black uppercase tracking-widest text-ink3 mb-6 flex items-center gap-2">
                <RiTeamLine /> Reviews & Community
              </h3>
              <CommentSection targetId={id} targetType="Guide" />
            </section>
          </div>

          <aside className="space-y-6">
            <div className="bg-white rounded-3xl border border-sand3 p-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-ink3 mb-4 flex items-center gap-2">
                <TbLanguage /> Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {g.languages?.map(l => (
                  <span key={l} className="bg-sand px-3 py-1.5 rounded-full text-xs font-bold text-ink2 border border-sand3">{l}</span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-sand3 p-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-ink3 mb-4 flex items-center gap-2">
                <TbTargetArrow /> Specialities
              </h3>
              <div className="flex flex-wrap gap-2">
                {g.specialities?.map(s => (
                  <span key={s} className="bg-primary/5 text-primary px-3 py-1.5 rounded-full text-xs font-bold border border-primary/10">{s}</span>
                ))}
              </div>
            </div>

            {CONTACTS.length > 0 && (
              <div className="bg-white rounded-3xl border border-sand3 p-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-ink3 mb-4">Contact</h3>
                <div className="space-y-3">
                  {CONTACTS.map(c => (
                    <a key={c.label} href={c.href} className="flex items-center gap-3 p-3 rounded-xl bg-sand/50 hover:bg-sand transition-colors text-sm font-semibold">
                      <span className="text-primary">{c.icon}</span>
                      <span className="truncate">{c.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </aside>

        </div>
      </div>
    </div>
  );
}