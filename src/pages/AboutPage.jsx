// pages/AboutPage.jsx
import { useEffect, useRef, useState } from "react"; 
import image from '../images/image.png'
import styled, { keyframes, css } from "styled-components";
import {
  RiMapPinLine,
  RiTeamLine,
  RiStarLine,
  RiShieldCheckLine,
} from "react-icons/ri";
import { HiOutlineGlobeAlt } from "react-icons/hi2";
import { TbCompass } from "react-icons/tb";
import { PiHandshakeLight } from "react-icons/pi";

// ─── Data ──────────────────────────────────────────────────────────────────
const STATS = [
  {
    id: 1,
    value: "10K+",
    label: "Travelers",
    icon: <HiOutlineGlobeAlt size={22} />,
  },
  {
    id: 2,
    value: "120+",
    label: "Local Guides",
    icon: <RiTeamLine size={22} />,
  },
  {
    id: 3,
    value: "300+",
    label: "Places Listed",
    icon: <RiMapPinLine size={22} />,
  },
  {
    id: 4,
    value: "4.9★",
    label: "Avg. Rating",
    icon: <RiStarLine size={22} />,
  },
];

const VALUES = [
  {
    id: 1,
    icon: <TbCompass size={28} />,
    title: "Authentic Discovery",
    text: "We curate only the places that locals truly love — hidden alleys, rooftop cafés, secret gardens.",
  },
  {
    id: 2,
    icon: <PiHandshakeLight size={28} />,
    title: "Human Connection",
    text: "The best experiences come from genuine connections, not algorithms. Our guides are real people with real stories.",
  },
  {
    id: 3,
    icon: <RiShieldCheckLine size={28} />,
    title: "Verified & Trusted",
    text: "Every guide is personally vetted. Every place is reviewed by our community. Quality you can count on.",
  },
];

const TEAM = [
  {
    id: 1,
    name: "Tarik Amrani",
    role: "Co-founder & CEO",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    city: "Marrakech",
  },
  {
    id: 2,
    name: "Meryem Idrissi",
    role: "Head of Guides",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    city: "Fes",
  },
  {
    id: 3,
    name: "Youssef Chaoui",
    role: "Product & Design",
    img: "https://randomuser.me/api/portraits/men/58.jpg",
    city: "Casablanca",
  },
  {
    id: 4,
    name: "Fatima Zahra",
    role: "Community Manager",
    img: "https://randomuser.me/api/portraits/women/29.jpg",
    city: "Rabat",
  },
];

// ─── Intersection observer hook ───────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ─── Component ────────────────────────────────────────────────────────────
export default function AboutPage() {
  const [heroRef, heroVisible] = useInView(0.1);
  const [missionRef, missionVisible] = useInView(0.1);
  const [statsRef, statsVisible] = useInView(0.1);
  const [valuesRef, valuesVisible] = useInView(0.1);
  const [teamRef, teamVisible] = useInView(0.1);
  const [ctaRef, ctaVisible] = useInView(0.1);

  return (
    <Page>
      {/* ── Hero ── */}
      <HeroSection ref={heroRef} $visible={heroVisible}>
        <HeroBg />
        <HeroContent>
          <HeroEyebrow>Est. 2026 · Morocco</HeroEyebrow>
          <HeroTitle>
            Discover Morocco
            <br />
            <HeroAccent>Through Local Eyes</HeroAccent>
          </HeroTitle>
          <HeroText>
            CityGuide is Morocco's leading platform connecting travelers with
            passionate locals — for experiences that are personal, meaningful,
            and unforgettable.
          </HeroText>
          <HeroBadges>
            <HeroBadge>🌍 10 Cities</HeroBadge>
            <HeroBadge>✓ Verified Guides</HeroBadge>
            <HeroBadge>⭐ 4.9 Rating</HeroBadge>
          </HeroBadges>
        </HeroContent>
        <HeroImg
          src={image}
          alt="Morocco"
        />
      </HeroSection>

      {/* ── Mission ── */}
      <MissionSection ref={missionRef} $visible={missionVisible}>
        <MissionLabel>Our Mission</MissionLabel>
        <MissionQuote>
          "We believe the best travel experiences come from genuine human
          connections — not algorithms."
        </MissionQuote>
        <MissionSub>
          Founded by a team of Moroccan locals and travel enthusiasts, CityGuide
          was built to bridge the gap between curious travelers and the hidden
          soul of every Moroccan city. From the blue streets of Chefchaouen to
          the golden dunes of Merzouga, we're here to make every journey
          extraordinary.
        </MissionSub>
      </MissionSection>

      {/* ── Stats ── */}
      <StatsSection ref={statsRef}>
        <StatsGrid>
          {STATS.map((s, i) => (
            <StatCard key={s.id} $visible={statsVisible} $delay={i * 100}>
              <StatIcon>{s.icon}</StatIcon>
              <StatValue>{s.value}</StatValue>
              <StatLabel>{s.label}</StatLabel>
            </StatCard>
          ))}
        </StatsGrid>
      </StatsSection>

      {/* ── Values ── */}
      <ValuesSection ref={valuesRef} $visible={valuesVisible}>
        <SectionLabel>What We Stand For</SectionLabel>
        <SectionTitle>Our Core Values</SectionTitle>
        <ValuesGrid>
          {VALUES.map((v, i) => (
            <ValueCard key={v.id} $visible={valuesVisible} $delay={i * 120}>
              <ValueIconWrap>{v.icon}</ValueIconWrap>
              <ValueTitle>{v.title}</ValueTitle>
              <ValueText>{v.text}</ValueText>
            </ValueCard>
          ))}
        </ValuesGrid>
      </ValuesSection>

      {/* ── Team ── */}
      <TeamSection ref={teamRef} $visible={teamVisible}>
        <SectionLabel>The People</SectionLabel>
        <SectionTitle>Meet the Team</SectionTitle>
        <TeamGrid>
          {TEAM.map((m, i) => (
            <TeamCard key={m.id} $visible={teamVisible} $delay={i * 100}>
              <TeamAvatar src={m.img} alt={m.name} />
              <TeamName>{m.name}</TeamName>
              <TeamRole>{m.role}</TeamRole>
              <TeamCity>
                <RiMapPinLine size={12} /> {m.city}
              </TeamCity>
            </TeamCard>
          ))}
        </TeamGrid>
      </TeamSection>

      {/* ── CTA ── */}
      <CtaSection ref={ctaRef} $visible={ctaVisible}>
        <CtaInner>
          <CtaTitle>Ready to explore Morocco?</CtaTitle>
          <CtaText>
            Find your perfect local guide and start your journey today.
          </CtaText>
          <CtaButtons>
            <CtaBtnPrimary>Browse Guides</CtaBtnPrimary>
            <CtaBtnOutline>Discover Places</CtaBtnOutline>
          </CtaButtons>
        </CtaInner>
      </CtaSection>
    </Page>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Animations
// ─────────────────────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1); }
`;

const visibleAnim = ($visible, $delay = 0, anim = fadeUp) => css`
  opacity: 0;
  ${$visible &&
  css`
    animation: ${anim} 0.6s ease forwards;
    animation-delay: ${$delay}ms;
  `}
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Styled Components
// ─────────────────────────────────────────────────────────────────────────────

const Page = styled.div`
  background: #fafafa;
  padding-bottom: 80px;
  font-family: "Nunito", "Segoe UI", sans-serif;
`;

/* ── Hero ── */
const HeroSection = styled.section`
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 48px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 72px 32px 64px;
  overflow: hidden;
  ${({ $visible }) => visibleAnim($visible, 0, fadeUp)}

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 48px 20px 40px;
    gap: 32px;
  }
`;

const HeroBg = styled.div`
  position: absolute;
  top: -80px;
  right: -120px;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(107, 156, 62, 0.08) 0%,
    transparent 70%
  );
  pointer-events: none;
`;

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const HeroEyebrow = styled.span`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #6b9c3e;
`;

const HeroTitle = styled.h1`
  font-family: "Playfair Display", Georgia, serif;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  color: #3d2b1a;
  line-height: 1.2;
  margin: 0;
`;

const HeroAccent = styled.span`
  color: #6b9c3e;
`;

const HeroText = styled.p`
  font-size: 16px;
  color: #666;
  line-height: 1.75;
  max-width: 480px;
`;

const HeroBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const HeroBadge = styled.span`
  background: #f0f5e0;
  color: #3d2b1a;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: 9999px;
  border: 1px solid rgba(107, 156, 62, 0.25);
`;

const HeroImg = styled.img`
  width: 100%;
  height: 420px;
  object-fit: cover;
  border-radius: 24px;
  box-shadow: 0 16px 48px rgba(61, 43, 26, 0.18);

  @media (max-width: 768px) {
    height: 260px;
    border-radius: 16px;
  }
`;

/* ── Mission ── */
const MissionSection = styled.section`
  background: #3d2b1a;
  padding: 72px 32px;
  text-align: center;
  ${({ $visible }) => visibleAnim($visible, 0, fadeIn)}

  @media (max-width: 768px) {
    padding: 48px 20px;
  }
`;

const MissionLabel = styled.p`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #c8d98a;
  margin-bottom: 20px;
`;

const MissionQuote = styled.blockquote`
  font-family: "Playfair Display", Georgia, serif;
  font-size: clamp(1.3rem, 3vw, 1.9rem);
  font-weight: 600;
  color: #ffffff;
  line-height: 1.55;
  max-width: 760px;
  margin: 0 auto 24px;
  quotes: none;
`;

const MissionSub = styled.p`
  font-size: 15px;
  color: rgba(255, 255, 255, 0.65);
  max-width: 680px;
  margin: 0 auto;
  line-height: 1.8;
`;

/* ── Stats ── */
const StatsSection = styled.section`
  max-width: 1000px;
  margin: 0 auto;
  padding: 64px 32px;

  @media (max-width: 600px) {
    padding: 48px 16px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  background: #fff;
  border-radius: 18px;
  padding: 28px 20px;
  text-align: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
  border: 1px solid rgba(107, 156, 62, 0.12);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
  ${({ $visible, $delay }) => visibleAnim($visible, $delay, scaleIn)}

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 32px rgba(61, 43, 26, 0.12);
  }
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: #f0f5e0;
  color: #6b9c3e;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 14px;
`;

const StatValue = styled.p`
  font-family: "Playfair Display", Georgia, serif;
  font-size: 28px;
  font-weight: 700;
  color: #3d2b1a;
  margin: 0 0 4px;
`;

const StatLabel = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: #666;
  margin: 0;
`;

/* ── Values ── */
const ValuesSection = styled.section`
  background: #f0f5e0;
  padding: 72px 32px;
  text-align: center;
  ${({ $visible }) => visibleAnim($visible, 0, fadeIn)}

  @media (max-width: 600px) {
    padding: 48px 16px;
  }
`;

const SectionLabel = styled.p`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #6b9c3e;
  margin-bottom: 8px;
`;

const SectionTitle = styled.h2`
  font-family: "Playfair Display", Georgia, serif;
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 700;
  color: #3d2b1a;
  margin: 0 0 40px;
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-width: 1000px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ValueCard = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 36px 28px;
  text-align: left;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(107, 156, 62, 0.1);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
  ${({ $visible, $delay }) => visibleAnim($visible, $delay, fadeUp)}

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 14px 36px rgba(61, 43, 26, 0.1);
  }
`;

const ValueIconWrap = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 16px;
  background: #f0f5e0;
  color: #6b9c3e;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
`;

const ValueTitle = styled.h3`
  font-family: "Playfair Display", Georgia, serif;
  font-size: 17px;
  font-weight: 700;
  color: #3d2b1a;
  margin: 0 0 10px;
`;

const ValueText = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.75;
  margin: 0;
`;

/* ── Team ── */
const TeamSection = styled.section`
  max-width: 1000px;
  margin: 0 auto;
  padding: 72px 32px;
  text-align: center;
  ${({ $visible }) => visibleAnim($visible, 0, fadeIn)}

  @media (max-width: 600px) {
    padding: 48px 16px;
  }
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 500px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
`;

const TeamCard = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 28px 16px 22px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
  border: 1px solid #ede8e1;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
  ${({ $visible, $delay }) => visibleAnim($visible, $delay, fadeUp)}

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 32px rgba(61, 43, 26, 0.1);
  }
`;

const TeamAvatar = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f0f5e0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin: 0 auto 14px;
  display: block;
`;

const TeamName = styled.p`
  font-family: "Playfair Display", Georgia, serif;
  font-size: 15px;
  font-weight: 700;
  color: #3d2b1a;
  margin: 0 0 4px;
`;

const TeamRole = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: #6b9c3e;
  margin: 0 0 6px;
`;

const TeamCity = styled.p`
  font-size: 11px;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin: 0;
`;

/* ── CTA ── */
const CtaSection = styled.section`
  background: linear-gradient(135deg, #3d2b1a 0%, #5a3e28 100%);
  padding: 72px 32px;
  ${({ $visible }) => visibleAnim($visible, 0, fadeIn)}

  @media (max-width: 600px) {
    padding: 48px 20px;
  }
`;

const CtaInner = styled.div`
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
`;

const CtaTitle = styled.h2`
  font-family: "Playfair Display", Georgia, serif;
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 700;
  color: #fff;
  margin: 0;
`;

const CtaText = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
`;

const CtaButtons = styled.div`
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 8px;
`;

const CtaBtnPrimary = styled.button`
  padding: 13px 30px;
  border-radius: 9999px;
  border: none;
  background: #6b9c3e;
  color: #fff;
  font-family: "Nunito", sans-serif;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background: #c8761a;
    transform: translateY(-2px);
  }
`;

const CtaBtnOutline = styled.button`
  padding: 13px 30px;
  border-radius: 9999px;
  border: 2px solid rgba(200, 217, 138, 0.5);
  background: transparent;
  color: #c8d98a;
  font-family: "Nunito", sans-serif;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background: rgba(200, 217, 138, 0.1);
    border-color: #c8d98a;
    transform: translateY(-2px);
  }
`;
