// hooks/useNavigation.js
// ─────────────────────────────────────────────────────────────────────────────
//  Central navigation hook.
//  Replaces the old dispatch(setPage(...)) pattern with React Router's
//  useNavigate while still storing the selected entity in Redux so that
//  detail pages can read it without prop-drilling.
// ─────────────────────────────────────────────────────────────────────────────
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedPlace, setSelectedGuide } from "../store/slices/navigationSlice";

export function useNavigation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return {
    goHome:    ()      => navigate("/"),
    goGuides:  ()      => navigate("/guides"),
    goPlaces:  ()      => navigate("/places"),
    goAbout:   ()      => navigate("/about"),
    goContact: ()      => navigate("/contact"),
    goAccount: ()      => navigate("/account"),
    goNotifications: () => navigate("/notifications"),

    goToGuide: (guide) => {
      dispatch(setSelectedGuide(guide));
      navigate(`/guides/${guide.id}`);
    },

    goToPlace: (place) => {
      dispatch(setSelectedPlace(place));
      navigate(`/places/${place.id}`);
    },
  };
}
