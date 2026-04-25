import {
  TbBuilding,
  TbUsers,
  TbCalendarEvent,
  TbToolsKitchen2,
  TbHome,
  TbTent,
} from "react-icons/tb";

import img1 from "../../../images/heroSlider/1.png";
import img2 from "../../../images/heroSlider/2.png";
import img3 from "../../../images/heroSlider/3.png";
import img4 from "../../../images/heroSlider/4.png";
import img5 from "../../../images/heroSlider/5.png";

export const SLIDES = [
  {
    id: 1,
    city: "Marrakech",
    label: "The Red City",
    tag: "Culture & History",
    img: img1,
  },
  {
    id: 2,
    city: "Chefchaouen",
    label: "The Blue Pearl",
    tag: "Photography & Art",
    img: img2,
  },
  {
    id: 3,
    city: "Sahara",
    label: "Desert Adventure",
    tag: "Adventure & Nature",
    img: img3,
  },
  {
    id: 4,
    city: "Essaouira",
    label: "Coastal Escape",
    tag: "Beach & Wind",
    img: img4,
  },
  {
    id: 5,
    city: "Fès",
    label: "Imperial City",
    tag: "UNESCO Heritage",
    img: img5,
  },
];

export const DESTINATIONS = [
  { label: "Marrakech", emoji: "🏯" },
  { label: "Chefchaouen", emoji: "🔵" },
  { label: "Sahara", emoji: "🏜️" },
  { label: "Essaouira", emoji: "⛵" },
  { label: "Fès", emoji: "🕌" },
  { label: "Agadir", emoji: "🏖️" },
  { label: "Ouarzazate", emoji: "🎬" },
  { label: "Casablanca", emoji: "🌆" },
];

export const TYPES = [
  { label: "Places", icon: <TbBuilding size={15} /> },
  { label: "Guides", icon: <TbUsers size={15} /> },
  { label: "Events", icon: <TbCalendarEvent size={15} /> },
  { label: "Restaurants", icon: <TbToolsKitchen2 size={15} /> },
  { label: "Riads", icon: <TbHome size={15} /> },
  { label: "Desert tours", icon: <TbTent size={15} /> },
];

export const PERIODS = [
  "Ce weekend",
  "Cette semaine",
  "Ce mois",
  "Printemps",
  "Été",
  "Automne",
  "Hiver",
];
export const TRENDS = ["Riads", "Hammam", "Désert", "Médina", "Surf"];

export const DURATION = 6000;
export const TRANSITION = 950;
