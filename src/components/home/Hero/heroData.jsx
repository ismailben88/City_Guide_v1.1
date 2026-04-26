import {
  TbBuildingCastle,
  TbBuildingMosque,
  TbBuildingArch,
  TbCrown,
  TbBuildingSkyscraper,
  TbAnchor,
  TbSailboat,
  TbBeach,
  TbPalette,
  TbBuildingLighthouse,
  TbFish,
  TbMovie,
  TbMountain,
  TbWind,
  TbSnowflake,
  TbBuildingFortress,
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
  { id: 1, city: "Marrakech",   label: "The Red City",     tag: "Culture & History",  img: img1 },
  { id: 2, city: "Chefchaouen", label: "The Blue Pearl",   tag: "Photography & Art",  img: img2 },
  { id: 3, city: "Sahara",      label: "Desert Adventure", tag: "Adventure & Nature", img: img3 },
  { id: 4, city: "Essaouira",   label: "Coastal Escape",   tag: "Beach & Wind",       img: img4 },
  { id: 5, city: "Fès",         label: "Imperial City",    tag: "UNESCO Heritage",    img: img5 },
];

// Icon is stored as a component reference — rendered as <d.Icon /> in SearchBar
export const DESTINATIONS = [
  { label: "Marrakech",   Icon: TbBuildingCastle,    tag: "Red City"            },
  { label: "Fès",         Icon: TbBuildingMosque,    tag: "Imperial City"       },
  { label: "Meknès",      Icon: TbBuildingArch,      tag: "City of Roses"       },
  { label: "Rabat",       Icon: TbCrown,             tag: "Royal Capital"       },
  { label: "Casablanca",  Icon: TbBuildingSkyscraper,tag: "Grand Metropolis"    },
  { label: "Tanger",      Icon: TbAnchor,            tag: "Gateway to Europe"   },
  { label: "Essaouira",   Icon: TbSailboat,          tag: "City of the Winds"   },
  { label: "Agadir",      Icon: TbBeach,             tag: "Beach Resort"        },
  { label: "Chefchaouen", Icon: TbPalette,           tag: "The Blue City"       },
  { label: "Al Hoceima",  Icon: TbBuildingLighthouse,tag: "Mediterranean Coast" },
  { label: "Nador",       Icon: TbFish,              tag: "Lagoon & Fishing"    },
  { label: "Ouarzazate",  Icon: TbMovie,             tag: "Africa's Hollywood"  },
  { label: "Merzouga",    Icon: TbMountain,          tag: "Sahara Dunes"        },
  { label: "Dakhla",      Icon: TbWind,              tag: "Kitesurf & Lagoon"   },
  { label: "Ifrane",      Icon: TbSnowflake,         tag: "Switzerland of Morocco" },
  { label: "Taroudant",   Icon: TbBuildingFortress,  tag: "Ancient Ramparts"    },
];

// Icon is stored as a component reference — rendered as <t.Icon /> in SearchBar
export const TYPES = [
  { label: "Places",       Icon: TbBuilding,        desc: "Sites & landmarks"   },
  { label: "Guides",       Icon: TbUsers,           desc: "Local experts"       },
  { label: "Events",       Icon: TbCalendarEvent,   desc: "Festivals & outings" },
  { label: "Restaurants",  Icon: TbToolsKitchen2,   desc: "Food & flavours"     },
  { label: "Riads",        Icon: TbHome,            desc: "Accommodation"       },
  { label: "Desert Tours", Icon: TbTent,            desc: "Adventure & nature"  },
];

export const PERIODS = [
  "This Weekend",
  "This Week",
  "This Month",
  "Spring",
  "Summer",
  "Autumn",
  "Winter",
];

export const TRENDS = ["Riads", "Hammam", "Desert", "Medina", "Surfing", "Gastronomy"];

export const DURATION   = 6000;
export const TRANSITION = 950;
