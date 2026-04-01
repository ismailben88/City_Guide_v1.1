// components/layout/Footer.jsx
import { useState } from "react";
import { RiMapPinLine, RiMailLine, RiInstagramLine, RiTwitterXLine, RiFacebookBoxLine, RiYoutubeLine, RiArrowRightLine } from "react-icons/ri";
import { TbBrandTiktok } from "react-icons/tb";

import {
  FooterWrap, Inner,
  TopGrid, BrandCol, BrandName, LogoText, BrandDesc, SocialRow, SocialBtn,
  Col, ColTitle, FooterLink, ContactItem,
  NewsletterStrip, NewsletterLeft, NewsletterTitle, NewsletterSub,
  NewsletterForm, NewsletterInput, NewsletterBtn,
  BottomBar, Copyright, BottomLinks, BottomLink,
} from "./Footer.styles";

// ─── Data ─────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Home",         href: "/" },
  { label: "Destinations", href: "/destinations" },
  { label: "Guides",       href: "/guides" },
  { label: "Events",       href: "/events" },
  { label: "Places",       href: "/places" },
  { label: "About",        href: "/about" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy",    href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Cookie Policy",     href: "/cookies" },
  { label: "Sitemap",           href: "/sitemap" },
];

const SOCIAL = [
  { icon: <RiInstagramLine size={16} />,  href: "#", label: "Instagram" },
  { icon: <RiTwitterXLine size={15} />,   href: "#", label: "Twitter / X" },
  { icon: <RiFacebookBoxLine size={16} />, href: "#", label: "Facebook" },
  { icon: <TbBrandTiktok size={15} />,    href: "#", label: "TikTok" },
  { icon: <RiYoutubeLine size={16} />,    href: "#", label: "YouTube" },
];

// ─────────────────────────────────────────────────────────────────────────────
export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      // TODO: connect to newsletter API
      setEmail("");
    }
  };

  return (
    <FooterWrap>
      <Inner>

        {/* ── Top grid ── */}
        <TopGrid>

          {/* Brand */}
          <BrandCol>
            <BrandName>
              <RiMapPinLine size={22} color="#6b9c3e" />
              <LogoText>
                City<span>Guide</span>
              </LogoText>
            </BrandName>

            <BrandDesc>
              Discover the best places, local guides, and hidden gems
              across Morocco's most beautiful cities.
            </BrandDesc>

            <SocialRow>
              {SOCIAL.map((s) => (
                <SocialBtn key={s.label} href={s.href} aria-label={s.label} target="_blank" rel="noreferrer">
                  {s.icon}
                </SocialBtn>
              ))}
            </SocialRow>
          </BrandCol>

          {/* Navigation */}
          <Col>
            <ColTitle>Navigation</ColTitle>
            {NAV_LINKS.map((l) => (
              <FooterLink key={l.label} href={l.href}>
                <RiArrowRightLine size={12} />
                {l.label}
              </FooterLink>
            ))}
          </Col>

          {/* Legal */}
          <Col>
            <ColTitle>Legal Info</ColTitle>
            {LEGAL_LINKS.map((l) => (
              <FooterLink key={l.label} href={l.href}>
                <RiArrowRightLine size={12} />
                {l.label}
              </FooterLink>
            ))}
          </Col>

          {/* Contact */}
          <Col>
            <ColTitle>Contact Us</ColTitle>
            <ContactItem href="mailto:contact@cityguide.ma">
              <RiMailLine size={14} />
              contact@cityguide.ma
            </ContactItem>
            <ContactItem href="https://instagram.com/cityguide" target="_blank" rel="noreferrer">
              <RiInstagramLine size={14} />
              @CityGuide
            </ContactItem>
            <ContactItem href="https://twitter.com/cityguide" target="_blank" rel="noreferrer">
              <RiTwitterXLine size={13} />
              @CityGuide
            </ContactItem>
          </Col>

        </TopGrid>

        {/* ── Newsletter strip ── */}
        <NewsletterStrip>
          <NewsletterLeft>
            <NewsletterTitle>Get travel inspiration in your inbox</NewsletterTitle>
            <NewsletterSub>Weekly picks of the best places, guides and events in Morocco.</NewsletterSub>
          </NewsletterLeft>
          <NewsletterForm as="form" onSubmit={handleSubscribe}>
            <NewsletterInput
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
            />
            <NewsletterBtn type="submit">Subscribe</NewsletterBtn>
          </NewsletterForm>
        </NewsletterStrip>

        {/* ── Bottom bar ── */}
        <BottomBar>
          <Copyright>© 2026 CityGuide — All rights reserved.</Copyright>
          <BottomLinks>
            <BottomLink href="/privacy">Privacy</BottomLink>
            <BottomLink href="/terms">Terms</BottomLink>
            <BottomLink href="/cookies">Cookies</BottomLink>
          </BottomLinks>
        </BottomBar>

      </Inner>
    </FooterWrap>
  );
}
