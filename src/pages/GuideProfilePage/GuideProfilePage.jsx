// pages/GuideProfilePage.jsx
import { useSelector }  from "react-redux";
import { useNavigate }  from "react-router-dom";
import { IoStarSharp, IoStarOutline } from "react-icons/io5";
import {
  RiArrowLeftLine, RiShieldCheckLine,
  RiMapPin2Line, RiMailLine,
  RiInstagramLine, RiTwitterXLine, RiPhoneLine,
  RiCalendarLine, RiPriceTag3Line,
  RiCompassLine, RiTeamLine,
} from "react-icons/ri";
import { TbLanguage, TbTargetArrow, TbCalendarEvent } from "react-icons/tb";

import { selectSelectedGuide } from "../../store/slices/guideSlice";
import { guideComments, guides } from "../../data/index";
import { CommentSection } from "../../components/UI";

import {
  PageWrap,
  Banner, BannerOverlay, BackBtn, AvatarWrap,
  ProfileHeader, GuideName, VerifiedBadge,
  RatingRow, Stars, RatingNum, ReviewCount,
  TagsRow, Tag, ContactBookBtn,
  StatsStrip, StatItem, StatValue, StatLabel,
  Container, BodyGrid,
  SectionCard, SectionTitle, DescText,
  ContactList, ContactItem, ContactIcon,
  AvailRow, AvailLabel, AvailValue,
  InfoChipList, InfoChip, PriceTag,
} from "./GuideProfilePage.styles";

// ─────────────────────────────────────────────────────────────────────────────
export default function GuideProfilePage() {
  const navigate  = useNavigate();
  const g         = useSelector(selectSelectedGuide) || guides[0];

  const fullStars  = Math.round(g.rating || 0);
  const emptyStars = 5 - fullStars;
  const isVerified = g.verified || g.badges?.includes("Verified");
  const price      = g.pricePerDay || g.dailyRate;
  const reviews    = g.reviewCount || g.reviews;

  const CONTACTS = [
    { icon: <RiMailLine      size={15} />, href: `mailto:${g.contact?.email}`,                         label: g.contact?.email      },
    { icon: <RiInstagramLine size={15} />, href: `https://instagram.com/${g.contact?.instagram}`,       label: g.contact?.instagram  },
    { icon: <RiTwitterXLine  size={14} />, href: `https://twitter.com/${g.contact?.twitter}`,           label: g.contact?.twitter    },
    { icon: <RiPhoneLine     size={15} />, href: `tel:${g.contact?.phone}`,                            label: g.contact?.phone      },
  ].filter((c) => c.label);

  return (
    <PageWrap>

      {/* ══ BANNER ══════════════════════════════════════════════════════════ */}
      <Banner>
        {/* img is a direct child so the styled-components "img {}" selector works */}
        {(g.bannerImg || g.coverImg) && (
          <img src={g.bannerImg || g.coverImg} alt="cover" />
        )}

        <BannerOverlay />

        <BackBtn onClick={() => navigate(-1)}>
          <RiArrowLeftLine size={14} />
          Back
        </BackBtn>

        {/* Avatar sits at bottom: -44px so it protrudes out of the banner */}
        <AvatarWrap>
          <img src={g.img} alt={g.name} />
        </AvatarWrap>
      </Banner>

      {/* ══ PROFILE HEADER ══════════════════════════════════════════════════ */}
      <ProfileHeader>

        <GuideName>
          {g.name}
          {isVerified && (
            <VerifiedBadge>
              <RiShieldCheckLine size={11} /> Verified
            </VerifiedBadge>
          )}
        </GuideName>

        {/* city row */}
        <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#9e8e80", fontSize: 13 }}>
          <RiMapPin2Line size={13} />
          {g.city}
        </div>

        <RatingRow>
          <Stars>
            {Array.from({ length: fullStars  }).map((_, i) => <IoStarSharp   key={`f${i}`} size={16} />)}
            {Array.from({ length: emptyStars }).map((_, i) => <IoStarOutline key={`e${i}`} size={16} />)}
          </Stars>
          <RatingNum>{g.rating}</RatingNum>
          {reviews && <ReviewCount>({reviews} reviews)</ReviewCount>}
        </RatingRow>

        {g.specialities?.length > 0 && (
          <TagsRow>
            {g.specialities.slice(0, 4).map((s) => <Tag key={s}>{s}</Tag>)}
          </TagsRow>
        )}

        <ContactBookBtn type="button">
          <TbCalendarEvent size={16} />
          Book this guide
        </ContactBookBtn>

      </ProfileHeader>

      {/* ══ STATS STRIP ═════════════════════════════════════════════════════ */}
      <StatsStrip>
        <StatItem>
          <StatValue>{g.rating}</StatValue>
          <StatLabel>Rating</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{reviews ?? "—"}</StatValue>
          <StatLabel>Reviews</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{price ?? "—"}</StatValue>
          <StatLabel>MAD / day</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{g.languages?.length ?? "—"}</StatValue>
          <StatLabel>Languages</StatLabel>
        </StatItem>
      </StatsStrip>

      {/* ══ BODY ════════════════════════════════════════════════════════════ */}
      <Container>
        <BodyGrid>

          {/* ── LEFT COLUMN ── */}
          <div>

            <SectionCard $delay="0ms">
              <SectionTitle><RiCompassLine size={13} /> About</SectionTitle>
              <DescText>{g.description || "No description available."}</DescText>
            </SectionCard>

            {CONTACTS.length > 0 && (
              <SectionCard $delay="60ms">
                <SectionTitle><RiMailLine size={13} /> Contact Information</SectionTitle>
                <ContactList>
                  {CONTACTS.map((c) => (
                    <ContactItem key={c.label} href={c.href} target="_blank" rel="noreferrer">
                      <ContactIcon>{c.icon}</ContactIcon>
                      {c.label}
                    </ContactItem>
                  ))}
                </ContactList>
              </SectionCard>
            )}

            {g.availability && (
              <SectionCard $delay="120ms">
                <SectionTitle><RiCalendarLine size={13} /> Availability</SectionTitle>
                <AvailRow>
                  <AvailLabel>Days</AvailLabel>
                  <AvailValue>{g.availability.days}</AvailValue>
                </AvailRow>
                <AvailRow>
                  <AvailLabel>Hours</AvailLabel>
                  <AvailValue>{g.availability.hours}</AvailValue>
                </AvailRow>
              </SectionCard>
            )}

            <SectionCard $delay="160ms">
              <SectionTitle><RiTeamLine size={13} /> Reviews & Comments</SectionTitle>
              <CommentSection comments={guideComments} />
            </SectionCard>

          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div>

            {price && (
              <SectionCard $delay="80ms">
                <SectionTitle><RiPriceTag3Line size={13} /> Pricing</SectionTitle>
                <PriceTag>
                  <strong>{price} MAD</strong>
                  <span>/ day</span>
                </PriceTag>
              </SectionCard>
            )}

            <SectionCard $delay="100ms">
              <SectionTitle><RiMapPin2Line size={13} /> City & Region</SectionTitle>
              <InfoChipList>
                <InfoChip><RiMapPin2Line size={11} /> {g.city}</InfoChip>
              </InfoChipList>
            </SectionCard>

            {g.languages?.length > 0 && (
              <SectionCard $delay="130ms">
                <SectionTitle><TbLanguage size={13} /> Languages</SectionTitle>
                <InfoChipList>
                  {g.languages.map((l) => (
                    <InfoChip key={l}><TbLanguage size={11} /> {l}</InfoChip>
                  ))}
                </InfoChipList>
              </SectionCard>
            )}

            {g.specialities?.length > 0 && (
              <SectionCard $delay="160ms">
                <SectionTitle><TbTargetArrow size={13} /> Specialities</SectionTitle>
                <InfoChipList>
                  {g.specialities.map((s) => (
                    <InfoChip key={s}><TbTargetArrow size={11} /> {s}</InfoChip>
                  ))}
                </InfoChipList>
              </SectionCard>
            )}

            {g.typeOfGuide?.length > 0 && (
              <SectionCard $delay="190ms">
                <SectionTitle><RiCompassLine size={13} /> Guide Type</SectionTitle>
                <InfoChipList>
                  {g.typeOfGuide.map((t) => (
                    <InfoChip key={t}><RiCompassLine size={11} /> {t}</InfoChip>
                  ))}
                </InfoChipList>
              </SectionCard>
            )}

          </div>

        </BodyGrid>
      </Container>

    </PageWrap>
  );
}
