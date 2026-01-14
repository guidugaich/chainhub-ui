import { 
  FaTwitter, 
  FaGithub, 
  FaInstagram, 
  FaLinkedin, 
  FaYoutube, 
  FaGlobe 
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export const getIconForUrl = (url: string) => {
  const lowerUrl = url.toLowerCase();

  if (lowerUrl.includes("twitter.com")) return <FaTwitter className="w-6 h-6" />;
  if (lowerUrl.includes("x.com")) return <FaXTwitter className="w-6 h-6" />;
  if (lowerUrl.includes("github.com")) return <FaGithub className="w-6 h-6" />;
  if (lowerUrl.includes("instagram.com")) return <FaInstagram className="w-6 h-6" />;
  if (lowerUrl.includes("linkedin.com")) return <FaLinkedin className="w-6 h-6" />;
  if (lowerUrl.includes("youtube.com")) return <FaYoutube className="w-6 h-6" />;
  
  // Default icon for unknown sites
  return <FaGlobe className="w-6 h-6" />;
};
