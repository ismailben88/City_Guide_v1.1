import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import CommentSection from "../../components/comentSection/CommentSection";
import { api } from "../../services/api";

// ── Slices ────────────────────────────────────────────────────────────────────
import {
  savePlace,
  unsavePlace,
  selectIsSaved,
  selectActionLoading,
} from "../../store/slices/savedPlacesSlice";
import {
  bookPlace,
  resetBookingStatus,
  selectBookingLoading,
  selectBookingSuccess,
  selectBookingError,
  selectLastBooking,
} from "../../store/slices/bookingSlice";

import { IoStarSharp, IoStarOutline } from "react-icons/io5";
import {
  RiArrowLeftLine, RiMapPin2Line, RiMailLine, RiPhoneLine,
  RiImageLine, RiInformationLine, RiCheckLine, RiUserLine,
  RiPriceTag3Line, RiCompassLine, RiHeartLine, RiHeartFill,
  RiShareLine, RiLoader4Line,
} from "react-icons/ri";
import { TbCalendarEvent, TbMap2 } from "react-icons/tb";

// Leaflet icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// ─────────────────────────────────────────────────────────────────────────────
// BookingModal
// ─────────────────────────────────────────────────────────────────────────────
function BookingModal({ place, onClose }) {
  const dispatch = useDispatch();
  const bookingLoading = useSelector(selectBookingLoading);
  const bookingSuccess = useSelector(selectBookingSuccess);
  const bookingError   = useSelector(selectBookingError);
  const lastBooking    = useSelector(selectLastBooking);

  const [form, setForm] = useState({
    date: "",
    numberOfPeople: 1,
    notes: "",
  });

  // Reset slice status when modal unmounts
  useEffect(() => {
    return () => dispatch(resetBookingStatus());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(bookPlace({ placeId: place._id || place.id, bookingData: form }));
  };

  return (
    <div className="fixed inset-0 bg-dark/60 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-[28px] w-full max-w-md shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-8 pt-8 pb-4">
          <h2 className="font-display text-2xl font-bold text-ink2">
            Réserver une visite
          </h2>
          <p className="text-ink3 text-sm mt-1">{place.name}</p>
        </div>

        {bookingSuccess ? (
          // ── Success State ──────────────────────────────────────────────────
          <div className="px-8 pb-8 flex flex-col items-center text-center gap-4 py-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
              <RiCheckLine className="text-emerald-600" size={32} />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-ink2 mb-1">
                Réservation confirmée !
              </h3>
              <p className="text-ink3 text-sm">
                Votre visite au{" "}
                <span className="font-bold text-ink2">{place.name}</span> est
                enregistrée pour le{" "}
                <span className="font-bold text-ink2">
                  {new Date(lastBooking?.date || form.date).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>{" "}
                pour{" "}
                <span className="font-bold text-ink2">
                  {lastBooking?.numberOfPeople || form.numberOfPeople} personne(s)
                </span>.
              </p>
            </div>
            <button
              onClick={onClose}
              className="mt-2 px-8 py-3 bg-primary text-white rounded-2xl font-bold text-sm"
            >
              Fermer
            </button>
          </div>
        ) : (
          // ── Booking Form ───────────────────────────────────────────────────
          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
            
            {/* Date */}
            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-widest text-ink3 block mb-2">
                Date de visite
              </label>
              <input
                type="date"
                name="date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={form.date}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-sand3 bg-sand text-ink2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* Nombre de personnes */}
            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-widest text-ink3 block mb-2">
                Nombre de personnes
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setForm((p) => ({
                      ...p,
                      numberOfPeople: Math.max(1, p.numberOfPeople - 1),
                    }))
                  }
                  className="w-10 h-10 rounded-xl border border-sand3 bg-sand text-ink2 font-bold text-lg hover:bg-sand2 transition-colors"
                >
                  −
                </button>
                <span className="font-display text-2xl font-bold text-ink2 w-8 text-center">
                  {form.numberOfPeople}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setForm((p) => ({ ...p, numberOfPeople: p.numberOfPeople + 1 }))
                  }
                  className="w-10 h-10 rounded-xl border border-sand3 bg-sand text-ink2 font-bold text-lg hover:bg-sand2 transition-colors"
                >
                  +
                </button>
                {place.price && place.price !== "0" && (
                  <span className="ml-auto text-sm font-bold text-primary">
                    Total :{" "}
                    {(parseFloat(place.price) * form.numberOfPeople).toFixed(0)} MAD
                  </span>
                )}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-widest text-ink3 block mb-2">
                Notes (optionnel)
              </label>
              <textarea
                name="notes"
                rows={3}
                placeholder="Demandes spéciales, accessibilité..."
                value={form.notes}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-sand3 bg-sand text-ink2 text-sm font-medium resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* Error */}
            {bookingError && (
              <p className="text-red-500 text-xs font-semibold bg-red-50 px-3 py-2 rounded-xl">
                {bookingError}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-2xl border border-sand3 text-ink2 font-bold text-sm hover:bg-sand transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={bookingLoading}
                className="flex-1 py-3 rounded-2xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:bg-ink2 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {bookingLoading ? (
                  <RiLoader4Line className="animate-spin" size={18} />
                ) : (
                  <TbCalendarEvent size={18} />
                )}
                {bookingLoading ? "En cours..." : "Confirmer"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PlaceDetailPage
// ─────────────────────────────────────────────────────────────────────────────
export default function PlaceDetailPage() {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const { id }    = useParams();

  const [place,   setPlace]   = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // ── Redux selectors ────────────────────────────────────────────────────────
  const isSaved      = useSelector(selectIsSaved(id));
  const saveLoading  = useSelector(selectActionLoading);

  // ── Load data ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [placeData, commentsData] = await Promise.all([
          api.getPlaceById(id),
          api.getCommentsByTarget(id, "place"),
        ]);
        if (!placeData) throw new Error("Lieu introuvable");
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

  // ── Save / Unsave handler ──────────────────────────────────────────────────
  const handleToggleSave = () => {
    if (saveLoading) return;
    if (isSaved) {
      dispatch(unsavePlace(id));
    } else {
      dispatch(savePlace(id));
    }
  };

  // ── States ─────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-sand gap-4">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-ink3 font-body text-sm">Découverte du lieu...</p>
    </div>
  );

  if (error || !place) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-sand px-6 text-center">
      <h2 className="text-2xl font-display font-bold text-ink2 mb-2">Oops ! Lieu introuvable.</h2>
      <p className="text-ink3 mb-6">Nous n'avons pas pu trouver la destination recherchée.</p>
      <button onClick={() => navigate("/places")} className="px-6 py-2 bg-primary text-white rounded-full font-bold shadow-lg">
        Retour
      </button>
    </div>
  );

  const p      = place;
  const isFree = !p.price || p.price === 0 || p.price === "0";
  const coords = p.location?.coordinates || [31.7917, -7.0926];

  return (
    <div className="min-h-screen bg-sand font-body text-ink2">

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal
          place={p}
          onClose={() => setShowBookingModal(false)}
        />
      )}

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div className="relative w-full h-[400px] md:h-[550px] overflow-hidden">
        <img
          src={p.coverImage || p.images?.[0] || "https://images.unsplash.com/photo-1539020140153-e479b8e201e7"}
          alt={p.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent" />

        <div className="absolute top-6 left-6 right-6 flex justify-between z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full text-xs font-bold transition-all hover:bg-white/40"
          >
            <RiArrowLeftLine /> Retour
          </button>
          <button className="p-2.5 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full hover:bg-white/40">
            <RiShareLine size={18} />
          </button>
        </div>

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

      {/* ── STATS BAR ────────────────────────────────────────────────────── */}
      <div className="relative z-20 max-w-4xl mx-auto -mt-10 px-4">
        <div className="bg-white rounded-[24px] shadow-2xl border border-sand3 flex divide-x divide-sand2 overflow-hidden">
          <div className="flex-1 flex flex-col items-center py-6">
            <div className="flex gap-0.5 text-yellow-500 mb-1">
              {[...Array(5)].map((_, i) =>
                i < Math.round(p.averageRating || 0)
                  ? <IoStarSharp key={i} size={14} />
                  : <IoStarOutline key={i} size={14} />
              )}
            </div>
            <span className="font-display text-2xl font-bold">{p.averageRating || "—"}</span>
            <span className="text-[10px] font-bold text-ink3 uppercase tracking-widest">Note</span>
          </div>
          <div className="flex-1 flex flex-col items-center py-6">
            <RiUserLine className="text-primary mb-1" size={20} />
            <span className="font-display text-2xl font-bold">{reviews.length}</span>
            <span className="text-[10px] font-bold text-ink3 uppercase tracking-widest">Avis</span>
          </div>
          <div className="flex-1 flex flex-col items-center py-6">
            <RiPriceTag3Line className="text-primary mb-1" size={20} />
            <span className="font-display text-2xl font-bold">{isFree ? "Gratuit" : `${p.price} MAD`}</span>
            <span className="text-[10px] font-bold text-ink3 uppercase tracking-widest">Prix</span>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">

        {/* Left column */}
        <div className="space-y-8">
          <section className="bg-white p-8 rounded-[32px] border border-sand3 shadow-sm">
            <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-ink3 mb-5 flex items-center gap-2">
              <RiInformationLine size={16} /> Histoire & Description
            </h3>
            <p className="text-base leading-relaxed text-ink2/80 font-medium">{p.description}</p>
          </section>

          {p.images?.length > 0 && (
            <section className="bg-white p-8 rounded-[32px] border border-sand3 shadow-sm">
              <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-ink3 mb-5 flex items-center gap-2">
                <RiImageLine size={16} /> Galerie Photos
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

          <section className="bg-white p-8 rounded-[32px] border border-sand3 shadow-sm">
            <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-ink3 mb-5 flex items-center gap-2">
              <TbMap2 size={16} /> Nous trouver
            </h3>
            <div className="h-[300px] rounded-2xl overflow-hidden border border-sand3">
              <MapContainer center={coords} zoom={15} className="h-full w-full" zoomControl={false}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={coords}><Popup>{p.name}</Popup></Marker>
              </MapContainer>
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <aside className="space-y-6">
          <div className="bg-white p-8 rounded-[32px] border border-sand3 shadow-sm sticky top-24">
            <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-ink3 mb-6 flex items-center gap-2">
              <RiPriceTag3Line size={16} /> Planifier votre visite
            </h3>

            <div className="mb-6">
              {isFree ? (
                <div className="bg-emerald-50 text-emerald-600 px-4 py-3 rounded-2xl font-bold text-sm flex items-center gap-2">
                  <RiCheckLine size={18} /> Entrée Gratuite
                </div>
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-display font-bold text-ink2">{p.price}</span>
                  <span className="text-ink3 text-sm font-bold">MAD / personne</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {/* ── Book Button ── */}
              <button
                onClick={() => setShowBookingModal(true)}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:bg-ink2 transition-all flex items-center justify-center gap-2 group"
              >
                <TbCalendarEvent size={18} className="group-hover:scale-110 transition-transform" />
                Réserver une visite
              </button>

              {/* ── Save / Unsave Button ── */}
              <button
                onClick={handleToggleSave}
                disabled={saveLoading}
                className={`w-full py-4 rounded-2xl border font-bold text-sm transition-all flex items-center justify-center gap-2
                  ${isSaved
                    ? "bg-accent text-white border-transparent"
                    : "border-sand3 text-ink2 hover:bg-sand"
                  }
                  disabled:opacity-60`}
              >
                {saveLoading ? (
                  <RiLoader4Line className="animate-spin" size={18} />
                ) : isSaved ? (
                  <RiHeartFill size={18} />
                ) : (
                  <RiHeartLine size={18} />
                )}
                {saveLoading
                  ? "Chargement..."
                  : isSaved
                  ? "Sauvegardé"
                  : "Sauvegarder"}
              </button>
            </div>

            {/* Contact */}
            <div className="mt-8 pt-8 border-t border-sand2 space-y-4">
              <h4 className="text-[10px] font-extrabold uppercase tracking-tighter text-ink3">
                Informations de contact
              </h4>
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
