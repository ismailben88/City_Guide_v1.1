import LogoCityg from "../../../../images/logoCityGuide";
import { LogoWrapper, LogoText, LogoCity, LogoGuide } from "../Navbar.styles";

export default function CityGuideLogo({ onClick }) {
  return (
    <LogoWrapper onClick={onClick} aria-label="Go to home">
      <LogoCityg />
      <LogoText>
        <LogoCity>City</LogoCity>
        <LogoGuide>Guide</LogoGuide>
      </LogoText>
    </LogoWrapper>
  );
}
