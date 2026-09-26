// Inline SVGs (not lucide-react) so we don't depend on trademarked brand icons
// being present in a generic icon set.
const icons = {
  facebook: (
    <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
  ),
  x: (
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  ),
  instagram: (
    <path d="M12 2.2c3.2 0 3.58 0 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.07 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.07-1.65.07-4.85.07s-3.58 0-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.07-1.27-.07-1.65-.07-4.85s0-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.2 8.8 2.2 12 2.2Zm0 3.13a6.67 6.67 0 1 0 0 13.34 6.67 6.67 0 0 0 0-13.34Zm0 11a4.33 4.33 0 1 1 0-8.66 4.33 4.33 0 0 1 0 8.66Zm6.9-11.27a1.56 1.56 0 1 1-3.12 0 1.56 1.56 0 0 1 3.12 0Z" />
  ),
  linkedin: (
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z" />
  ),
  youtube: (
    <path d="M23 12s0-3.6-.46-5.32a2.9 2.9 0 0 0-2.04-2.05C18.8 4.17 12 4.17 12 4.17s-6.8 0-8.5.46A2.9 2.9 0 0 0 1.46 6.68C1 8.4 1 12 1 12s0 3.6.46 5.32a2.9 2.9 0 0 0 2.04 2.05c1.7.46 8.5.46 8.5.46s6.8 0 8.5-.46a2.9 2.9 0 0 0 2.04-2.05C23 15.6 23 12 23 12Zm-13.5 3.4V8.6l5.7 3.4-5.7 3.4Z" />
  ),
};

const links = {
  facebook: "https://www.facebook.com/lokmangalfoundation/",
  x: "https://twitter.com/LokmangalFound",
  instagram: "https://www.instagram.com/lokmangal_foundation/",
  linkedin: "https://www.linkedin.com/company/lokmangalfoundation/",
  youtube: "https://www.youtube.com/channel/UCk4QgXC_Qr6UtkHx9Tbm8yA?view_as=subscriberv",
};

const labels = {
  facebook: "Facebook",
  x: "X (Twitter)",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  youtube: "YouTube",
};

export default function SocialIcons({ className = "" }) {
  return (
    <ul className={`flex items-center gap-2 ${className}`}>
      {Object.keys(icons).map((key) => (
        <li key={key}>
          <a
            href={links[key]}
            target="_blank"
            rel="noreferrer"
            aria-label={labels[key]}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-light-green-tint text-brand-green-primary transition hover:-translate-y-0.5 hover:bg-brand-orange-accent hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
              {icons[key]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
