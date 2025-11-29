export const colorSchemes = [
  {
    background: "bg-orange-50",
    icon: "text-orange-500",
  },
  {
    background: "bg-green-50",
    icon: "text-green-500",
  },
  {
    background: "bg-blue-50",
    icon: "text-blue-500",
  },
];

export function getCardColors(index: number) {
  return colorSchemes[index % colorSchemes.length];
}
