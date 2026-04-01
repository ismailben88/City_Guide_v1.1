// pages/PlaceDetailPage.jsx
// Requires: npm install leaflet react-leaflet
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { IoStarSharp, IoStarOutline } from "react-icons/io5";
import {
  RiArrowLeftLine,
  RiMapPin2Line,
  RiMailLine,
  RiPhoneLine,
  RiInstagramLine,
  RiTwitterXLine,
  RiImageLine,
  RiInformationLine,
  RiSendPlaneLine,
  RiCheckLine,
  RiUserLine,
  RiShareLine,
  RiPriceTag3Line,
  RiCompassLine,
  RiStarLine,
  RiHeartLine,
} from "react-icons/ri";
import { TbTag, TbCalendarEvent, TbMap2 } from "react-icons/tb";

import { selectUser, selectIsLoggedIn } from "../../store/slices/authSlice";
import { selectSelectedPlace } from "../../store/slices/navigationSlice";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// ── Fix Leaflet default marker icons in Vite ──────────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// ── Constants ─────────────────────────────────────────────────────────────────
const RATING_LABELS = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very good",
  5: "Excellent",
};

const EXTRA_IMGS = [
  "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80",
  "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=600&q=80",
  "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&q=80",
];

const CITY_COORDS = {
  Marrakech: [31.6295, -7.9811],
  Fès: [34.0181, -5.0078],
  Casablanca: [33.5731, -7.5898],
  Chefchaouen: [35.1688, -5.2697],
  Essaouira: [31.5125, -9.77],
  Agadir: [30.4278, -9.5981],
  Merzouga: [31.0997, -4.0136],
  Ouarzazate: [30.9335, -6.937],
  Azilal: [31.9697, -6.5736],
};

// ─────────────────────────────────────────────────────────────────────────────
//  Import styled components
// ─────────────────────────────────────────────────────────────────────────────
import {
  PageWrap,
  HeroWrap,
  HeroImg,
  HeroGradient,
  BackBtn,
  HeroContent,
  HeroCategoryRow,
  HeroCategoryBadge,
  HeroCityBadge,
  HeroTitle,
  HeroTagsRow,
  HeroTag,
  StatsBar,
  StatCell,
  StatIcon,
  StatVal,
  StatLbl,
  StarRow,
  Container,
  Grid,
  Card,
  CardLabel,
  DescText,
  Gallery,
  GalleryThumb,
  MapWrap,
  ContactRow,
  ContactIconWrap,
  ChipRow,
  Chip,
  PriceWrap,
  FreeBadge,
  BookBtn,
  ShareBtn,
  ReviewsHeader,
  AvgRatingBlock,
  BigRating,
  RatingMeta,
  StarsDisplay,
  ReviewCountText,
  ReviewList,
  ReviewCard,
  ReviewAvatar,
  ReviewBody,
  ReviewTop,
  ReviewAuthor,
  ReviewMeta,
  ReviewDate,
  ReviewCountry,
  ReviewStars,
  ReviewText,
  EmptyReviews,
  FormDivider,
  FormHeading,
  StarPicker,
  StarPickerBtn,
  RatingLabel,
  FormGrid,
  FormInput,
  FormTextarea,
  FieldErr,
  SubmitBtn,
  SuccessBanner,
  LoginNudge,
  LoginNudgeBtn,
} from "./PlaceDetailPage.styles";

// ─────────────────────────────────────────────────────────────────────────────
//  StarRatingPicker
// ─────────────────────────────────────────────────────────────────────────────
function StarRatingPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <StarPicker>
      {[1, 2, 3, 4, 5].map((n) => (
        <StarPickerBtn
          key={n}
          type="button"
          $lit={n <= active}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
          aria-label={`Rate ${n}`}
        >
          {n <= active ? "★" : "☆"}
        </StarPickerBtn>
      ))}
      {active > 0 && <RatingLabel>{RATING_LABELS[active]}</RatingLabel>}
    </StarPicker>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  ReviewForm
// ─────────────────────────────────────────────────────────────────────────────
function ReviewForm({ placeId, onAdd, setShowLogin }) {
  const user = useSelector(selectUser);
  const isLogged = useSelector(selectIsLoggedIn);

  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [name, setName] = useState(user?.name || "");
  const [country, setCountry] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!rating) e.rating = "Please select a rating";
    if (!text.trim()) e.text = "Please write your review";
    if (!name.trim()) e.name = "Your name is required";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setLoading(true);

    const newReview = {
      placeId,
      author: name.trim(),
      avatar:
        user?.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6b9c3e&color=fff&size=80`,
      country: country.trim() || "Morocco",
      rating,
      date: new Date().toISOString().split("T")[0],
      text: text.trim(),
    };

    try {
      const res = await fetch(`${BASE_URL}/guideComments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });
      const saved = await res.json();
      onAdd(saved);
      setSuccess(true);
      setText("");
      setRating(0);
      setCountry("");
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      setErrors({ text: "Server error — please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <FormDivider />
      <FormHeading>
        <RiStarLine size={12} /> Write a Review
      </FormHeading>

      {!isLogged && (
        <LoginNudge>
          <RiUserLine size={16} color="#9e8e80" />
          You must be signed in to leave a review.
          <LoginNudgeBtn onClick={() => setShowLogin(true)}>
            Sign in
          </LoginNudgeBtn>
        </LoginNudge>
      )}

      {success && (
        <SuccessBanner>
          <RiCheckLine size={16} /> Thank you! Your review has been published.
        </SuccessBanner>
      )}

      {/* Stars */}
      <StarRatingPicker
        value={rating}
        onChange={(v) => {
          setRating(v);
          setErrors((p) => ({ ...p, rating: "" }));
        }}
      />
      {errors.rating && <FieldErr>{errors.rating}</FieldErr>}

      {/* Name + Country */}
      <FormGrid>
        <div>
          <FormInput
            placeholder="Your name *"
            value={name}
            disabled={!!user}
            $err={!!errors.name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((p) => ({ ...p, name: "" }));
            }}
          />
          {errors.name && <FieldErr>{errors.name}</FieldErr>}
        </div>
        <FormInput
          placeholder="Your country (optional)"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
      </FormGrid>

      {/* Text */}
      <FormTextarea
        placeholder="Describe your experience at this place…"
        value={text}
        disabled={!isLogged}
        $err={!!errors.text}
        onChange={(e) => {
          setText(e.target.value);
          setErrors((p) => ({ ...p, text: "" }));
        }}
      />
      {errors.text && <FieldErr>{errors.text}</FieldErr>}

      <SubmitBtn onClick={handleSubmit} disabled={loading || !isLogged}>
        <RiSendPlaneLine size={15} />
        {loading ? "Submitting…" : "Publish Review"}
      </SubmitBtn>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  PlaceDetailPage
// ─────────────────────────────────────────────────────────────────────────────
export default function PlaceDetailPage({ setShowLogin }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const selected = useSelector(selectSelectedPlace);

  const [place, setPlace] = useState(selected || null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(!selected);
  const [liked, setLiked] = useState(false);

  // ── Fetch place from db.json if not in Redux ──────────────────────────────
  useEffect(() => {
    if (!place && id) {
      fetch(`${BASE_URL}/places/${id}`)
        .then((r) => r.json())
        .then((data) => {
          setPlace(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id,place]);

  // ── Fetch reviews for this place ─────────────────────────────────────────
  useEffect(() => {
    if (!place?.id) return;
    fetch(`${BASE_URL}/guideComments?placeId=${place.id}`)
      .then((r) => r.json())
      .then(setReviews)
      .catch(() => {});
  }, [place?.id]);

  const handleAddReview = (newReview) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  if (loading)
    return (
      <PageWrap
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
        }}
      >
        <span
          style={{
            fontFamily: "'Nunito', sans-serif",
            color: "#9e8e80",
            fontSize: 14,
          }}
        >
          Loading…
        </span>
      </PageWrap>
    );

  if (!place)
    return (
      <PageWrap
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          gap: 12,
        }}
      >
        <span
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 22,
            color: "#3d2b1a",
          }}
        >
          Place not found
        </span>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "none",
            border: "none",
            color: "#6b9c3e",
            fontFamily: "'Nunito',sans-serif",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          ← Go back
        </button>
      </PageWrap>
    );

  const p = place;
  const isFree = p.price === 0 || p.price === "0";
  const coords = p.coordinates ?? CITY_COORDS[p.city] ?? [31.6295, -7.9811];
  const avgRating = reviews.length
    ? (
        reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length
      ).toFixed(1)
    : p.rating;

  const CONTACTS = [
    {
      icon: <RiMailLine size={15} />,
      href: `mailto:${p.contact?.email}`,
      label: p.contact?.email,
    },
    {
      icon: <RiInstagramLine size={15} />,
      href: `https://instagram.com/${p.contact?.instagram}`,
      label: p.contact?.instagram,
    },
    {
      icon: <RiTwitterXLine size={14} />,
      href: `https://twitter.com/${p.contact?.twitter}`,
      label: p.contact?.twitter,
    },
    {
      icon: <RiPhoneLine size={15} />,
      href: `tel:${p.contact?.phone}`,
      label: p.contact?.phone,
    },
  ].filter((c) => c.label);

  const galleryImgs = [p.img, ...EXTRA_IMGS].filter(Boolean).slice(0, 3);

  return (
    <PageWrap>
      {/* ── Hero ── */}
      <HeroWrap>
        <HeroImg src={p.img} alt={p.title} />
        <HeroGradient />

        <BackBtn onClick={() => navigate(-1)}>
          <RiArrowLeftLine size={14} /> Back
        </BackBtn>

        <HeroContent>
          <HeroCategoryRow>
            {p.category && (
              <HeroCategoryBadge>
                <RiCompassLine size={11} /> {p.category}
              </HeroCategoryBadge>
            )}
            {p.city && (
              <HeroCityBadge>
                <RiMapPin2Line size={11} /> {p.city}
              </HeroCityBadge>
            )}
          </HeroCategoryRow>

          <HeroTitle>{p.title}</HeroTitle>

          {p.tags?.length > 0 && (
            <HeroTagsRow>
              {p.tags.map((t) => (
                <HeroTag key={t}>{t}</HeroTag>
              ))}
            </HeroTagsRow>
          )}
        </HeroContent>
      </HeroWrap>

      {/* ── Floating stats bar ── */}
      <StatsBar>
        <StatCell>
          <StatIcon>
            <RiStarLine size={16} />
          </StatIcon>
          <StarRow>
            {Array.from({ length: 5 }).map((_, i) =>
              i < Math.round(avgRating) ? (
                <IoStarSharp key={i} size={13} />
              ) : (
                <IoStarOutline key={i} size={13} />
              ),
            )}
          </StarRow>
          <StatVal>{avgRating || "—"}</StatVal>
          <StatLbl>Rating</StatLbl>
        </StatCell>

        <StatCell>
          <StatIcon>
            <RiUserLine size={16} />
          </StatIcon>
          <StatVal>{reviews.length || p.reviews || "—"}</StatVal>
          <StatLbl>Reviews</StatLbl>
        </StatCell>

        <StatCell>
          <StatIcon>
            <RiPriceTag3Line size={16} />
          </StatIcon>
          <StatVal>{isFree ? "Free" : `${p.price} MAD`}</StatVal>
          <StatLbl>Entry</StatLbl>
        </StatCell>

        <StatCell>
          <StatIcon>
            <RiMapPin2Line size={16} />
          </StatIcon>
          <StatVal style={{ fontSize: 14 }}>{p.city || "—"}</StatVal>
          <StatLbl>City</StatLbl>
        </StatCell>
      </StatsBar>

      {/* ── Body ── */}
      <Container>
        <Grid>
          {/* ── Left column ── */}
          <div>
            {/* About */}
            <Card $delay="0ms">
              <CardLabel>
                <RiInformationLine size={12} /> About this place
              </CardLabel>
              <DescText>
                {p.description ||
                  "No description available for this place yet."}
              </DescText>
            </Card>

            {/* Gallery */}
            <Card $delay="60ms">
              <CardLabel>
                <RiImageLine size={12} /> Gallery
              </CardLabel>
              <Gallery>
                {galleryImgs.map((src, i) => (
                  <GalleryThumb key={i}>
                    <img src={src} alt={`${p.title} ${i + 1}`} />
                  </GalleryThumb>
                ))}
              </Gallery>
            </Card>

            {/* Map */}
            <Card $delay="100ms">
              <CardLabel>
                <TbMap2 size={12} /> Location on map
              </CardLabel>
              <MapWrap>
                <MapContainer
                  center={coords}
                  zoom={14}
                  style={{ width: "100%", height: "100%" }}
                  scrollWheelZoom={false}
                  attributionControl={false}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={coords}>
                    <Popup>
                      <strong>{p.title}</strong>
                      <br />
                      {p.city}
                    </Popup>
                  </Marker>
                </MapContainer>
              </MapWrap>
            </Card>

            {/* Contact */}
            {CONTACTS.length > 0 && (
              <Card $delay="130ms">
                <CardLabel>
                  <RiMailLine size={12} /> Contact
                </CardLabel>
                {CONTACTS.map((c) => (
                  <ContactRow
                    key={c.label}
                    href={c.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ContactIconWrap>{c.icon}</ContactIconWrap>
                    {c.label}
                  </ContactRow>
                ))}
              </Card>
            )}

            {/* Reviews */}
            <Card $delay="160ms">
              <ReviewsHeader>
                <AvgRatingBlock>
                  <BigRating>{avgRating || "—"}</BigRating>
                  <RatingMeta>
                    <StarsDisplay>
                      {Array.from({ length: 5 }).map((_, i) =>
                        i < Math.round(avgRating) ? (
                          <IoStarSharp key={i} size={15} />
                        ) : (
                          <IoStarOutline key={i} size={15} />
                        ),
                      )}
                    </StarsDisplay>
                    <ReviewCountText>
                      {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                    </ReviewCountText>
                  </RatingMeta>
                </AvgRatingBlock>
                <CardLabel style={{ margin: 0 }}>
                  <RiStarLine size={12} /> Reviews
                </CardLabel>
              </ReviewsHeader>

              {reviews.length > 0 ? (
                <ReviewList>
                  {reviews.map((r, i) => (
                    <ReviewCard key={r.id || i} $i={i}>
                      <ReviewAvatar
                        src={
                          r.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(r.author)}&background=6b9c3e&color=fff&size=80`
                        }
                        alt={r.author}
                      />
                      <ReviewBody>
                        <ReviewTop>
                          <ReviewAuthor>{r.author}</ReviewAuthor>
                          <ReviewMeta>
                            <ReviewDate>{r.date}</ReviewDate>
                            {r.country && (
                              <ReviewCountry>{r.country}</ReviewCountry>
                            )}
                          </ReviewMeta>
                        </ReviewTop>
                        <ReviewStars>
                          {Array.from({ length: 5 }).map((_, j) =>
                            j < (r.rating || 0) ? (
                              <IoStarSharp key={j} size={13} />
                            ) : (
                              <IoStarOutline key={j} size={13} />
                            ),
                          )}
                        </ReviewStars>
                        <ReviewText>{r.text}</ReviewText>
                      </ReviewBody>
                    </ReviewCard>
                  ))}
                </ReviewList>
              ) : (
                <EmptyReviews>
                  <RiStarLine
                    size={28}
                    style={{
                      display: "block",
                      margin: "0 auto 8px",
                      opacity: 0.3,
                    }}
                  />
                  No reviews yet — be the first to share your experience!
                </EmptyReviews>
              )}

              {/* Add review form */}
              <ReviewForm
                placeId={p.id}
                onAdd={handleAddReview}
                setShowLogin={setShowLogin}
              />
            </Card>
          </div>

          {/* ── Right sidebar ── */}
          <div>
            {/* Pricing */}
            <Card $delay="30ms">
              <CardLabel>
                <RiPriceTag3Line size={12} /> Pricing
              </CardLabel>
              {isFree ? (
                <FreeBadge>
                  <RiCheckLine size={15} /> Free Entry
                </FreeBadge>
              ) : (
                <PriceWrap>
                  <strong>{p.price}</strong>
                  <span>MAD / person</span>
                </PriceWrap>
              )}
              <BookBtn>
                <TbCalendarEvent size={17} /> Book a Visit
              </BookBtn>
              <ShareBtn
                onClick={() =>
                  navigator.share?.({
                    title: p.title,
                    url: window.location.href,
                  })
                }
              >
                <RiShareLine size={14} /> Share this place
              </ShareBtn>
            </Card>

            {/* Location */}
            <Card $delay="60ms">
              <CardLabel>
                <RiMapPin2Line size={12} /> City & Region
              </CardLabel>
              <ChipRow>
                {p.city && (
                  <Chip>
                    <RiMapPin2Line size={11} /> {p.city}
                  </Chip>
                )}
              </ChipRow>
            </Card>

            {/* Category */}
            {p.category && (
              <Card $delay="80ms">
                <CardLabel>
                  <RiCompassLine size={12} /> Category
                </CardLabel>
                <ChipRow>
                  <Chip>
                    <RiCompassLine size={11} /> {p.category}
                  </Chip>
                </ChipRow>
              </Card>
            )}

            {/* Tags */}
            {p.tags?.length > 0 && (
              <Card $delay="100ms">
                <CardLabel>
                  <TbTag size={12} /> Tags
                </CardLabel>
                <ChipRow>
                  {p.tags.map((t) => (
                    <Chip key={t}>
                      <TbTag size={11} /> {t}
                    </Chip>
                  ))}
                </ChipRow>
              </Card>
            )}

            {/* Save */}
            <Card $delay="120ms">
              <BookBtn
                onClick={() => setLiked((v) => !v)}
                style={{
                  background: liked
                    ? "linear-gradient(135deg,#e05a5a,#c84040)"
                    : undefined,
                  boxShadow: liked
                    ? "0 4px 16px rgba(224,90,90,0.3)"
                    : undefined,
                }}
              >
                <RiHeartLine size={16} />
                {liked ? "Saved to Favourites" : "Save to Favourites"}
              </BookBtn>
            </Card>
          </div>
        </Grid>
      </Container>
    </PageWrap>
  );
}
