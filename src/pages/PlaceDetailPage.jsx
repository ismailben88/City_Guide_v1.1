import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import CommentSection from "../components/comentSection/CommentSection";
// Import de ton service API centralisé
import { api } from "../services/api"; 

import { 
  IoStarSharp, IoStarOutline 
} from "react-icons/io5";
import {
  RiArrowLeftLine, RiMapPin2Line, RiMailLine, RiPhoneLine,
  RiImageLine, RiInformationLine, RiCheckLine, RiUserLine, 
  RiPriceTag3Line, RiCompassLine, RiHeartLine, RiShareLine
} from "react-icons/ri";
import { TbCalendarEvent, TbMap2 } from "react-icons/tb";

// Leaflet fix pour les icônes
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});
const formatCoords = (coords) => {
  if (!coords || coords.length !== 2) return [31.7917, -7.0926];
  return [coords[1], coords[0]];
};
export default function PlaceDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [place, setPlace] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);

  // 1. Chargement des données via api.js
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [placeData, commentsData] = await Promise.all([
          api.getPlaceById(id),
          api.getCommentsByTarget(id, "place")
        ]);

        if (!placeData) throw new Error("Place not found");

        setPlace(placeData);
        setReviews(commentsData || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadData();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-sand gap-4">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-ink3 font-body text-sm">Discovering the magic...</p>
    </div>
  );

  if (error || !place) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-sand px-6 text-center">
      <h2 className="text-2xl font-display font-bold text-ink2 mb-2">Oops! Location lost.</h2>
      <p className="text-ink3 mb-6">We couldn't find the destination you're looking for.</p>
      <button onClick={() => navigate("/places")} className="px-6 py-2 bg-primary text-white rounded-full font-bold shadow-lg">
        Go Back
      </button>
    </div>
  );

  const p = place;
  const isFree = !p.price || p.price === 0 || p.price === "0";
 const coords = formatCoords(p.location?.coordinates); // Fallback Morocco center

  return (
    <div className="min-h-screen bg-sand font-body text-ink2">
      {/* --- HERO SECTION --- */}
      <div className="relative w-full h-[400px] md:h-[550px] overflow-hidden">
        <img 
          src={p.coverImage || p.images?.[0] || "https://images.unsplash.com/photo-1539020140153-e479b8e201e7"} 
          alt={p.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent" />
        
        {/* Top Buttons */}
        <div className="absolute top-6 left-6 right-6 flex justify-between z-10">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full text-xs font-bold transition-all hover:bg-white/40"
          >
            <RiArrowLeftLine /> Back
          </button>
          <button className="p-2.5 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full hover:bg-white/40">
            <RiShareLine size={18} />
          </button>
        </div>

        {/* Hero Info */}
        <div className="absolute bottom-10 left-0 w-full px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-2 mb-4">
              <span className="bg-primary/90 backdrop-blur-sm text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
                <RiCompassLine size={10} /> {p.categoryName}
              </span>
              <span className="bg-white/20 backdrop-blur-sm border border-white/30 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <RiMapPin2Line size={10} /> {p.cityName}
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg leading-tight">
              {p.name}
            </h1>
            <p className="text-white/80 max-w-xl text-sm md:text-base line-clamp-2">
              {p.shortDescription}
            </p>
          </div>
        </div>
      </div>

      {/* --- STATS BAR --- */}
      <div className="relative z-20 max-w-4xl mx-auto -mt-10 px-4">
        <div className="bg-white rounded-[24px] shadow-2xl border border-sand3 flex divide-x divide-sand2 overflow-hidden">
          <div className="flex-1 flex flex-col items-center py-6">
            <div className="flex gap-0.5 text-yellow-500 mb-1">
              {[...Array(5)].map((_, i) => i < Math.round(p.averageRating || 0) ? <IoStarSharp key={i} size={14}/> : <IoStarOutline key={i} size={14}/>)}
            </div>
            <span className="font-display text-2xl font-bold">{p.averageRating || "—"}</span>
            <span className="text-[10px] font-bold text-ink3 uppercase tracking-widest">Rating</span>
          </div>
          <div className="flex-1 flex flex-col items-center py-6">
            <RiUserLine className="text-primary mb-1" size={20} />
            <span className="font-display text-2xl font-bold">{reviews.length}</span>
            <span className="text-[10px] font-bold text-ink3 uppercase tracking-widest">Reviews</span>
          </div>
          <div className="flex-1 flex flex-col items-center py-6">
            <RiPriceTag3Line className="text-primary mb-1" size={20} />
            <span className="font-display text-2xl font-bold">{isFree ? "Free" : `${p.price} MAD`}</span>
            <span className="text-[10px] font-bold text-ink3 uppercase tracking-widest">Price</span>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
        
        {/* Left Column: Details */}
        <div className="space-y-8">
          <section className="bg-white p-8 rounded-[32px] border border-sand3 shadow-sm">
            <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-ink3 mb-5 flex items-center gap-2">
              <RiInformationLine size={16} /> History & Description
            </h3>
            <p className="text-base leading-relaxed text-ink2/80 font-medium">{p.description}</p>
          </section>

          {/* Gallery */}
          {p.images?.length > 0 && (
            <section className="bg-white p-8 rounded-[32px] border border-sand3 shadow-sm">
              <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-ink3 mb-5 flex items-center gap-2">
                <RiImageLine size={16} /> Photo Gallery
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {p.images.map((img, i) => (
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden group cursor-pointer relative">
                    <img src={img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/10 transition-colors" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Map */}
         <section className="bg-white p-8 rounded-[32px] border border-sand3 shadow-sm">
  <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-ink3 mb-5 flex items-center gap-2">
    <TbMap2 size={16} /> Nous trouver
  </h3>

  <div className="h-[320px] rounded-2xl overflow-hidden border border-sand3 relative">

    {/* Overlay UX */}
    <div className="absolute top-3 left-3 z-[1000] bg-white/90 px-3 py-1 rounded-full text-xs shadow">
      📍 {p.name}
    </div>

    <MapContainer
      center={coords}
      zoom={15}
      className="h-full w-full"
      zoomControl={false}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={coords}>
        <Popup>
          <div className="space-y-1">
            <h4 className="font-bold text-sm">{p.name}</h4>
            <p className="text-xs text-gray-500">{p.cityName}</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  </div>
<a
  href={`https://www.google.com/maps?q=${coords[0]},${coords[1]}`}
  target="_blank"
  className="text-primary text-xs font-bold mt-2 inline-block"
>
  Ouvrir dans Google Maps
</a>
</section> 
        </div>

        {/* Right Sidebar: Actions & Contact */}
        <aside className="space-y-6">
          <div className="bg-white p-8 rounded-[32px] border border-sand3 shadow-sm sticky top-24">
            <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-ink3 mb-6 flex items-center gap-2">
              <RiPriceTag3Line size={16} /> Plan your visit
            </h3>
            
            <div className="mb-6">
              {isFree ? (
                <div className="bg-emerald-50 text-emerald-600 px-4 py-3 rounded-2xl font-bold text-sm flex items-center gap-2">
                  <RiCheckLine size={18} /> No Entry Fee Required
                </div>
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-display font-bold text-ink2">{p.price}</span>
                  <span className="text-ink3 text-sm font-bold">MAD / person</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <button className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:bg-ink2 transition-all flex items-center justify-center gap-2 group">
                <TbCalendarEvent size={18} className="group-hover:scale-110 transition-transform" /> 
                Book Local Tour
              </button>
              <button 
                onClick={() => setLiked(!liked)}
                className={`w-full py-4 rounded-2xl border font-bold text-sm transition-all flex items-center justify-center gap-2 
                  ${liked ? 'bg-accent text-white border-transparent' : 'border-sand3 text-ink2 hover:bg-sand'}`}
              >
                <RiHeartLine className={liked ? "fill-current" : ""} /> 
                {liked ? "Saved to Favorites" : "Save for Later"}
              </button>
            </div>

            {/* Contact Details */}
            <div className="mt-8 pt-8 border-t border-sand2 space-y-4">
              <h4 className="text-[10px] font-extrabold uppercase tracking-tighter text-ink3">Contact Information</h4>
              <div className="space-y-3">
                {p.contactEmail && (
                  <a href={`mailto:${p.contactEmail}`} className="flex items-center gap-3 text-sm font-semibold hover:text-primary transition-colors">
                    <span className="w-8 h-8 rounded-lg bg-sand flex items-center justify-center text-ink3"><RiMailLine /></span>
                    {p.contactEmail}
                  </a>
                )}
                {p.contactPhone && (
                  <a href={`tel:${p.contactPhone}`} className="flex items-center gap-3 text-sm font-semibold hover:text-primary transition-colors">
                    <span className="w-8 h-8 rounded-lg bg-sand flex items-center justify-center text-ink3"><RiPhoneLine /></span>
                    {p.contactPhone}
                  </a>
                )}
              </div>
            </div>
          </div>
        </aside>
        <CommentSection targetId={id} targetType="Place" />
      </main>
      

    </div>
  );
}