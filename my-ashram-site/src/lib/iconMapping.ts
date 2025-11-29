import {
  Home,
  Users,
  MapPin,
  Calendar,
  Heart,
  Star,
  Sun,
  Moon,
  Mountain,
  Trees,
  Flower,
  Coffee,
  Image as ImageIcon,
} from "lucide-react";

export const iconMap = {
  Home,
  Users,
  MapPin,
  Calendar,
  Heart,
  Star,
  Sun,
  Moon,
  Mountain,
  Trees,
  Flower,
  Coffee,
  ImageIcon,
};

export type IconName = keyof typeof iconMap;

export function getIconComponent(iconName: string) {
  return iconMap[iconName as IconName] || Home; // Default to Home if not found
}
