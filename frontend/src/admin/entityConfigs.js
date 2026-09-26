import { renderPdfCover } from "../lib/pdf.js";
import { formatDate, weekOfMonth } from "../lib/format.js";
import SaptahikUploader from "./SaptahikUploader.jsx";

export const galleryConfig = {
  title: "Gallery & Albums",
  endpoint: "/gallery",
  layout: "grid",
  filterField: "category",
  columns: [
    { key: "imageUrl", label: "Photo", image: true },
    { key: "titleEn", label: "Title (EN)" },
    { key: "titleMr", label: "Title (MR)" },
    { key: "category", label: "Album / Category", badge: true },
  ],
  fields: [
    {
      name: "category",
      label: "Album / Category (pick an album or type a new one)",
      type: "combobox",
      options: [
        "vivah",
        "annapoorna",
        "jalsandharan",
        "vidyadaan",
        "mahaarogya",
        "divyang",
        "sarvarog",
        "sanjeevani",
        "mahila",
        "sahitya",
        "shikshak-ratna",
        "killa",
        "dandiya",
        "bhajan-bharud",
        "balsanskar",
      ],
      required: true,
    },
    { name: "titleEn", label: "Title (English)", type: "text", required: true },
    { name: "titleMr", label: "Title (Marathi)", type: "text", required: true },
    { name: "sortOrder", label: "Sort Order", type: "text" },
    { name: "image", label: "Photo", type: "file", wide: true, required: true, urlField: "imageUrl" },
  ],
};

export const testimonialsConfig = {
  title: "Testimonials",
  endpoint: "/testimonials",
  columns: [
    { key: "name", label: "Name" },
    { key: "roleEn", label: "Role (EN)" },
    { key: "messageEn", label: "Message (EN)" },
  ],
  fields: [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "roleEn", label: "Role (English)", type: "text" },
    { name: "roleMr", label: "Role (Marathi)", type: "text" },
    { name: "messageEn", label: "Message (English)", type: "textarea", required: true, wide: true },
    { name: "messageMr", label: "Message (Marathi)", type: "textarea", required: true, wide: true },
    { name: "sortOrder", label: "Sort Order", type: "text" },
    { name: "image", label: "Photo (optional)", type: "file", wide: true, urlField: "photoUrl" },
  ],
};

export const teamConfig = {
  title: "Team",
  endpoint: "/team",
  columns: [
    { key: "photoUrl", label: "Photo", image: true },
    { key: "name", label: "Name (EN)" },
    { key: "nameMr", label: "Name (MR)" },
    { key: "roleMr", label: "Role" },
    { key: "category", label: "Group", badge: true },
    { key: "sortOrder", label: "Order" },
  ],
  fields: [
    { name: "name", label: "Name (English)", type: "text", required: true },
    { name: "nameMr", label: "Name (Marathi)", type: "text" },
    { name: "roleEn", label: "Role (English)", type: "text", required: true },
    { name: "roleMr", label: "Role (Marathi)", type: "text", required: true },
    {
      name: "category",
      label: "Group",
      type: "select",
      options: ["Office Bearer", "Member"],
      hint: "Office Bearers (Chairman, Secretary, ...) are shown first, in larger cards; Members below them.",
    },
    { name: "sortOrder", label: "Sort Order (0 = first)", type: "text" },
    {
      name: "image",
      label: "Photo",
      type: "file",
      wide: true,
      urlField: "photoUrl",
      hint: "Portrait 4:5, e.g. 880 x 1100 px (JPG, under 5 MB). The whole photo is shown, so a designed card with the name printed on it works too.",
    },
  ],
};

export const projectsConfig = {
  title: "Projects",
  endpoint: "/projects",
  columns: [
    { key: "coverImageUrl", label: "Cover", image: true },
    { key: "slug", label: "Slug" },
    { key: "titleEn", label: "Title (EN)" },
    { key: "statEn", label: "Stat" },
  ],
  fields: [
    { name: "slug", label: "Slug (e.g. my-project)", type: "text", required: true },
    { name: "titleEn", label: "Title (English)", type: "text", required: true },
    { name: "titleMr", label: "Title (Marathi)", type: "text", required: true },
    { name: "summaryEn", label: "Summary (English)", type: "textarea", required: true },
    { name: "summaryMr", label: "Summary (Marathi)", type: "textarea", required: true },
    { name: "objectiveEn", label: "Objective (English)", type: "textarea" },
    { name: "objectiveMr", label: "Objective (Marathi)", type: "textarea" },
    { name: "descriptionEn", label: "Full description (English)", type: "textarea", rows: 6, wide: true },
    { name: "descriptionMr", label: "Full description (Marathi)", type: "textarea", rows: 6, wide: true },
    { name: "statEn", label: "Stat badge (English)", type: "text" },
    { name: "statMr", label: "Stat badge (Marathi)", type: "text" },
    { name: "videoUrl", label: "YouTube embed URL", type: "text", wide: true },
    { name: "sortOrder", label: "Sort Order", type: "text" },
    { name: "image", label: "Cover Image", type: "file", wide: true, urlField: "coverImageUrl" },
  ],
};

export const eventsConfig = {
  title: "Events",
  endpoint: "/events",
  columns: [
    { key: "imageUrl", label: "Photo", image: true },
    { key: "titleEn", label: "Title (EN)" },
    { key: "eventDate", label: "Date" },
  ],
  fields: [
    { name: "titleEn", label: "Title (English)", type: "text", required: true },
    { name: "titleMr", label: "Title (Marathi)", type: "text", required: true },
    { name: "descriptionEn", label: "Description (English)", type: "textarea", required: true },
    { name: "descriptionMr", label: "Description (Marathi)", type: "textarea", required: true },
    { name: "eventDate", label: "Date (e.g. 18 February, 2018)", type: "text" },
    { name: "image", label: "Photo", type: "file", urlField: "imageUrl" },
    { name: "document", label: "PDF (optional)", type: "pdf", urlField: "documentUrl" },
  ],
};

export const blogsConfig = {
  title: "Blogs & Articles",
  endpoint: "/blogs",
  columns: [
    { key: "imageUrl", label: "Cover", image: true },
    { key: "titleMr", label: "Title (मराठी)" },
    { key: "titleEn", label: "Title (English)" },
    { key: "publishedDate", label: "Date" },
    { key: "slug", label: "Slug" },
  ],
  fields: [
    { name: "slug", label: "URL Slug (उदा. my-new-blog)", type: "text", required: true },
    { name: "publishedDate", label: "Published Date (उदा. 15 जानेवारी 2025)", type: "text", required: true },
    { name: "titleMr", label: "Title (मराठी) *", type: "text", required: true },
    { name: "titleEn", label: "Title (English) *", type: "text", required: true },
    { name: "excerptMr", label: "Short Excerpt (मराठी) *", type: "textarea", rows: 3, required: true },
    { name: "excerptEn", label: "Short Excerpt (English) *", type: "textarea", rows: 3, required: true },
    { name: "contentMr", label: "Full Content (मराठी) *", type: "textarea", rows: 12, wide: true, required: true },
    { name: "contentEn", label: "Full Content (English) *", type: "textarea", rows: 12, wide: true, required: true },
    { name: "image", label: "Cover Image", type: "file", wide: true, urlField: "imageUrl" },
  ],
};

export const saptahikConfig = {
  title: "Saptahik (Weekly PDF)",
  endpoint: "/saptahik",
  layout: "grid",
  gridImageClass: "aspect-[3/4]",
  // New issues come in through the bulk uploader (one or many PDFs at a
  // time); the regular form is only used to edit an existing issue.
  Toolbar: SaptahikUploader,
  hideAddNew: true,
  columns: [
    { key: "coverImageUrl", label: "Cover", image: true },
    {
      key: "issueDate",
      label: "Date",
      render: (item) => `${formatDate(item.issueDate, "mr")} · आठवडा ${weekOfMonth(item.issueDate)}`,
    },
    { key: "titleMr", label: "Title (मराठी)" },
    { key: "issueNumber", label: "Issue No.", render: (item) => (item.issueNumber ? `अंक ${item.issueNumber}` : "") },
    { key: "pdfUrl", label: "PDF", link: "View PDF" },
  ],
  fields: [
    { name: "issueDate", label: "Issue Date (अंकाची तारीख)", type: "date", required: true },
    { name: "issueNumber", label: "Issue No. (अंक क्रमांक) — optional", type: "text", hint: "Just the number, e.g. 12." },
    { name: "titleMr", label: "Title (मराठी) — optional", type: "text" },
    {
      name: "titleEn",
      label: "Title (English) — optional",
      type: "text",
      hint: "Untitled issues are shown by their date and week.",
    },
    {
      name: "document",
      label: "Replace PDF (optional)",
      type: "pdf",
      wide: true,
      urlField: "pdfUrl",
      hint: "Up to 50 MB.",
    },
    {
      name: "image",
      label: "Replace Cover Image (optional)",
      type: "file",
      wide: true,
      urlField: "coverImageUrl",
      hint: "Leave empty to keep the cover; uploading a new PDF re-makes the cover from its first page.",
    },
  ],
  // When a new PDF is uploaded without a cover, render the PDF's first page
  // as the cover.
  async beforeSubmit(formData) {
    const pdf = formData.get("document");
    if (!(pdf instanceof File) || formData.get("image")) return;
    try {
      const cover = await renderPdfCover(pdf);
      if (cover) formData.append("image", cover);
    } catch {
      // The cover is optional; the public page shows a placeholder instead.
    }
  },
};
