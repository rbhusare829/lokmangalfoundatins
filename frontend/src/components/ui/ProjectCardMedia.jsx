import {
  GraduationCap,
  BookOpen,
  Wheat,
  Pill,
  HeartPulse,
  Accessibility,
  Stethoscope,
  Droplet,
  Sparkles,
  Castle,
  Briefcase,
  Music,
  Flower2,
  HeartHandshake,
  TreePine,
  PartyPopper,
  Newspaper,
} from "lucide-react";

// Most projects don't have a cover photo uploaded yet. A blank header on
// every other card made the (now 20+ item) mobile list feel like a long
// stretch of near-identical, half-finished cards -- this gives each one a
// themed visual anchor instead, matching the ones that do have a photo.
const PROJECT_ICONS = {
  "lokmangal-shikshak-ratna-puraskar": GraduationCap,
  "lokmangal-sahitya-puraskar": BookOpen,
  "ek-muth-dhanya-yojana": Wheat,
  "lokmangal-sanjeevani-medical": Pill,
  "mahaarogya-shibir": HeartPulse,
  "divyang-shibir": Accessibility,
  "mofat-sarvarog-nidan-shibir": Stethoscope,
  "raktadan-shibir": Droplet,
  "school-supplies-notebook-distribution": BookOpen,
  "balsanskar-shibir": Sparkles,
  "killa-bandhani-spardha": Castle,
  "rozgar-melava": Briefcase,
  "mahila-din": HeartHandshake,
  "bhajan-bharud-spardha": Music,
  "yoga-din": Flower2,
  "ekal-mahila-upakram": HeartHandshake,
  vruksharopan: TreePine,
  "dandiya-utsav": PartyPopper,
  "madhyamanchi-dakhal": Newspaper,
};

// Themed icon for a project slug, with a generic fallback for new projects.
export function projectIcon(slug) {
  return PROJECT_ICONS[slug] ?? HeartHandshake;
}

export default function ProjectCardMedia({ project, title, className = "h-52 w-full object-cover" }) {
  if (project.coverImageUrl) {
    return <img src={project.coverImageUrl} alt={title} className={className} />;
  }
  const Icon = projectIcon(project.slug);
  return (
    <div className="flex h-32 items-center justify-center bg-light-green-tint">
      <Icon size={40} strokeWidth={1.5} className="text-brand-green-primary" />
    </div>
  );
}
