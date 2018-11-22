import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faSignInAlt, faSignOutAlt, faCheck,
  faChevronLeft, faPlus, faSlidersH, faLink,
  faCheckCircle, faTrash, faArchive, faBoxes,
  faCommentSlash, faExclamation, faCamera,
  faMapSigns, faMapMarkedAlt, faGlobeAsia,
  faListOl, faBolt, faBrain, faCode,
  faLocationArrow, faCrosshairs, faTag, faTags,
} from "@fortawesome/free-solid-svg-icons";

[
  faSignInAlt, faSignOutAlt, faCheck,
  faChevronLeft, faPlus, faSlidersH, faLink,
  faCheckCircle, faTrash, faArchive, faBoxes,
  faCommentSlash, faExclamation, faCamera,
  faMapSigns, faMapMarkedAlt, faGlobeAsia,
  faListOl, faBolt, faBrain, faCode,
  faLocationArrow, faCrosshairs, faTag, faTags,
].forEach(icon => { library.add(icon); });
