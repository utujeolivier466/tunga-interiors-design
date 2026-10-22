import { useEffect, useRef, useState, type ReactNode } from "react";
import { trpc } from "@/lib/trpc";
import Lenis from "lenis";
import {
  ArrowLeft,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Menu,
  MessageCircle,
  MoveUpRight,
  Plus,
  Send,
  X,
} from "lucide-react";
import ProjectCoverflow from "./components/ProjectCoverflow";

const TUNGA_MOBILE = "0 782 017 456";
const TUNGA_MOBILE_RAW = "250782017456";
const TUNGA_OFFICE = "+250 781 705 561";
const TUNGA_EMAIL = "mjames@tungainteriordesigns.rw";
const TUNGA_ADDRESS = "Gishushu, KG 599 Kigali, Rwanda";
const TUNGA_WEBSITE = "tungainteriordesigns.rw";
const WHATSAPP_URL = `https://wa.me/${TUNGA_MOBILE_RAW}?text=${encodeURIComponent("Hi Tunga, I'd like to start a project. Space type: / Location: / Rough timeline:")}`;

const images = {
  hero: "/images/image-1.webp",
  newProject: "/images/service/faff789656d07ca42358f8928a3fe2f6.jpg",
  renovation: "/images/service/6a28dde5dc1b31c37bf9ab882744a69e.jpg",
  partitions: "/images/service/6778358241d22f8b282fba51699a470d.jpg",
};

type ProjectCategory = "All" | "New projects" | "Renovations" | "Finishes";
type PortfolioFilter = "All" | "Residential" | "Commercial" | "Hospitality";

const portfolioFilters: PortfolioFilter[] = ["All", "Residential", "Commercial", "Hospitality"];
const projectFilters: ProjectCategory[] = ["All", "New projects", "Renovations", "Finishes"];

type Project = {
  slug: string;
  title: string;
  description: string;
  location?: string;
  category: Exclude<ProjectCategory, "All">;
  image?: string;
  gallery: string[];
  size: string;
  spaceType: "House" | "Office" | "Hotel" | "Apartment";
  featured?: boolean;
};

const projectImage = (filename: string) => `/images/project/${encodeURIComponent(filename)}`;
const projectPhotos: Omit<Project, "size" | "featured">[] = [
  {
    slug: "open-plan-home",
    title: "An Open-Plan Home",
    description: "Kitchen, dining, and living share one generous room. Warm timber tones ground the space, while integrated cabinetry and layered lighting give each zone its own quiet definition.",
    category: "New projects",
    image: projectImage("project house-living room.webp"),
    gallery: [
      projectImage("project house-living room.webp"),
      projectImage("project house-living room 2.webp"),
      projectImage("project house detailed .webp"),
    ],
    spaceType: "House",
  },
  {
    slug: "bedroom-and-storage",
    title: "Bedrooms & Storage",
    description: "A collection of bedroom and fitted-storage details, balancing soft upholstery and warm wood with clean-lined joinery. Each view focuses on choices that make a personal space feel more settled.",
    category: "Renovations",
    image: projectImage("project bedroom design.webp"),
    gallery: [
      projectImage("project bedroom design.webp"),
      projectImage("project bedroom.jpeg"),
      projectImage("project wordrobe.jpeg"),
    ],
    spaceType: "Apartment",
  },
  {
    slug: "salon-fit-out",
    title: "A Salon, Ready for Work",
    description: "A working salon organized around a clear line of styling stations. Dark finishes and mirrored panels create a composed backdrop, while the photographs show both the fit-out and the finished space.",
    category: "Renovations",
    image: projectImage("project salon.jpeg"),
    gallery: [
      projectImage("project salon.jpeg"),
      projectImage("project finishing walls.jpeg"),
      projectImage("WhatsApp Image 2026-10-07 at 11.42.50.jpeg"),
    ],
    spaceType: "Office",
  },
  {
    slug: "fragrance-boutique",
    title: "The Fragrance Boutique",
    description: "Illuminated product niches, strong vertical framing, and a restrained dark palette put the fragrance displays at the center. Carefully placed light gives the room warmth and definition.",
    category: "New projects",
    image: projectImage("WhatsApp Image 2026-10-07 at 11.42.51.jpeg"),
    gallery: [
      projectImage("WhatsApp Image 2026-10-07 at 11.42.51.jpeg"),
      projectImage("WhatsApp Image 2026-10-07 at 11.42.50 (1).jpeg"),
      projectImage("project finishing1.jpeg"),
    ],
    spaceType: "Office",
  },
  {
    slug: "retail-display-studies",
    title: "Retail Display Studies",
    description: "Across these retail views, built-in shelving, feature walls, and integrated lighting give products a clear place to be seen. The display becomes part of the interior rather than an afterthought.",
    category: "Finishes",
    image: projectImage("project comercial.jpeg"),
    gallery: [
      projectImage("project comercial.jpeg"),
      projectImage("project comercial .jpeg"),
      projectImage("WhatsApp Image 2026-10-07 at 11.42.44.jpeg"),
    ],
    spaceType: "Office",
  },
  {
    slug: "commercial-arrival",
    title: "A Layered Commercial Arrival",
    description: "Tall stone-look surfaces and repeated timber battens bring scale and vertical rhythm to this commercial interior. A restrained palette lets material, proportion, and light do the work.",
    category: "Finishes",
    image: projectImage("project finishing.jpeg"),
    gallery: [
      projectImage("project finishing.jpeg"),
      projectImage("WhatsApp Image 2026-10-07 at 11.42.47.jpeg"),
    ],
    spaceType: "Office",
  },
];

const projects: Project[] = projectPhotos.map((project, index) => ({
  ...project,
  size: `${String(index + 1).padStart(2, "0")} / ${projectPhotos.length}`,
  featured: index === 0,
}));

function matchesPortfolioFilter(project: Project, filter: PortfolioFilter) {
  if (filter === "All") return true;
  if (filter === "Residential") return project.spaceType === "House" || project.spaceType === "Apartment";
  if (filter === "Hospitality") return project.spaceType === "Hotel";
  return project.spaceType === "Office";
}

const navItems = [
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Studio", href: "/studio" },
  { label: "Contact", href: "/contact" },
];

type ServiceSlug = "new-projects" | "renovations" | "partitions-finishes";
type ServiceDefinition = {
  slug: ServiceSlug;
  navLabel: string;
  label: string;
  headline: string;
  intro: string;
  heroImage: string;
  heroImageAlt: string;
  included: string[];
  steps: string[];
  category: Exclude<ProjectCategory, "All">;
  quoteMessage: string;
};

const serviceDefinitions: Record<ServiceSlug, ServiceDefinition> = {
  "new-projects": {
    slug: "new-projects",
    navLabel: "New projects",
    label: "NEW PROJECTS",
    headline: "Interiors from first sketch to handover.",
    intro: "Homes, offices, and shops designed and built from an empty shell. Layout, finishes, lighting, and furniture handled together.",
    heroImage: images.newProject,
    heroImageAlt: "Warm living and dining interior with layered finishes",
    included: ["Design and layout of the whole interior", "Choice of materials and finishes", "A clear design direction from first idea to final finish"],
    steps: ["Tell us about your space. Send your plans or photos on WhatsApp.", "We visit, understand the brief, and agree the next step.", "We design the space, and you approve the plan before site work begins.", "Our team carries out the agreed work and walks you through the result."],
    category: "New projects",
    quoteMessage: "Hi Tunga, I'd like to start a project. Space type: / Location: / Rough timeline:",
  },
  renovations: {
    slug: "renovations",
    navLabel: "Renovations",
    label: "RENOVATIONS",
    headline: "Make more of the space you have.",
    intro: "We rework what you already have: better layout, better light, better materials, without rebuilding everything.",
    heroImage: images.renovation,
    heroImageAlt: "Contemporary salon interior with styling stations",
    included: ["A look at your current space and what can be improved", "Layout changes, partitions and ceilings", "New finishes for walls and surfaces"],
    steps: ["Show us the space. Send photos on WhatsApp, or we visit.", "We agree what will change and set a clear scope.", "Our team carries out the agreed work.", "We walk through the finished space with you at handover."],
    category: "Renovations",
    quoteMessage: "Hi Tunga, I'd like to discuss a renovation. Space type: / Location: / Rough timeline:",
  },
  "partitions-finishes": {
    slug: "partitions-finishes",
    navLabel: "Partitions & finishes",
    label: "PARTITIONS & FINISHES",
    headline: "Structure, privacy, and finish.",
    intro: "Custom partitions, shelving, wall treatments, and joinery for spaces that need structure, privacy, or a sharper look.",
    heroImage: images.partitions,
    heroImageAlt: "Glass-framed office meeting room partition",
    included: ["Partitions for offices and rooms", "Ceilings and spatial transitions", "Finishes that give walls and surfaces their character"],
    steps: ["Tell us what you need to divide or finish. Send photos or measurements on WhatsApp.", "We visit, measure and agree the scope.", "You choose the layout and materials with our guidance.", "Our team installs the agreed work and walks you through it at handover."],
    category: "Finishes",
    quoteMessage: "Hi Tunga, I'd like to discuss partitions and finishes. Space type: / Location: / Rough timeline:",
  },
};

type QuoteData = {
  service: string;
  property: string;
  location: string;
  scope: string;
  timeline: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
};

const initialQuoteData: QuoteData = { service: "", property: "", location: "", scope: "", timeline: "", name: "", phone: "", email: "", notes: "" };

const quoteServices = [  { title: "New project", detail: "A space from first idea to final finish" },
  { title: "Renovation", detail: "Reworking what is already there" },
  { title: "Partitions & finishes", detail: "Material, privacy, and character" },
];
const quoteSteps = ["Direction", "Your space", "Scope", "Contact"];
const homeProcessSteps = [
  { title: "Brief", copy: "We visit, measure, and listen to what the space needs." },
  { title: "Concept", copy: "We develop the layout, materials, and project scope." },
  { title: "Approval", copy: "You approve the design and scope before site work begins." },
  { title: "Execution", copy: "Our team carries out the agreed work and shares progress." },
  { title: "Handover", copy: "We walk through the finished space with you." },
];
const homeFaqItems = [
  { question: "What services do Tunga Interiors offer?", answer: "New interior projects, renovations, partitions, and interior finishes." },
  { question: "What kinds of spaces do you work on?", answer: "Homes, apartments, offices, shops, and hospitality spaces." },
  { question: "Where does the studio work?", answer: "Tunga Interiors is based in Kigali and welcomes enquiries from across Rwanda. Share your location and the team can discuss the project with you." },
  { question: "What should I include in my first message?", answer: "Your space type, location, a short description of the work, and a rough timeline help start the conversation." },
];

const studioGalleryItems = [
  { src: images.newProject, alt: "Concept visual of a warm living and dining room with timber furniture and soft natural light", width: 17, ratio: "3 / 4", top: 13, position: "50% 50%" },
  { src: "/images/project/project bedroom design.webp", alt: "Concept visual of a bedroom with warm wood, soft lighting, and a sculpted feature wall", width: 20, ratio: "4 / 5", top: 11, position: "50% 50%" },
  { src: "/images/service/b30dfbb81188ce47a135f51253b18d16.jpg", alt: "Concept visual of a living room with a green sofa, timber feature wall, and layered lighting", width: 24, ratio: "2 / 3", top: 0, position: "35% 50%" },
  { src: "/images/service/73411ad36820e4e197f9530ba7fae030.jpg", alt: "Concept visual of a warm neutral salon with mirrors, timber details, and styling chairs", width: 22, ratio: "2 / 3", top: 3, position: "50% 50%" },
  { src: "/images/service/1000b5392e3dda6eba85feeb7db47b36.jpg", alt: "Concept visual of a softly lit boardroom with a long timber table and neutral finishes", width: 17, ratio: "3 / 4", top: 13, position: "50% 50%" },
];

function StudioStaggerGallery() {
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery || window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) return;

    let frame = 0;
    const updateParallax = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const viewportCenter = window.innerHeight / 2;
        gallery.querySelectorAll<HTMLElement>(".studio-stagger-gallery-item").forEach((item, index) => {
          const rect = item.getBoundingClientRect();
          const distance = rect.top + rect.height / 2 - viewportCenter;
          const drift = Math.max(-24, Math.min(24, distance * -0.035 * (0.55 + index * 0.12)));
          item.style.setProperty("--parallax-y", `${drift}px`);
        });
      });
    };

    updateParallax();
    window.addEventListener("scroll", updateParallax, { passive: true });
    window.addEventListener("resize", updateParallax);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateParallax);
      window.removeEventListener("resize", updateParallax);
    };
  }, []);

  return (
    <section className="studio-concepts" aria-labelledby="studio-concepts-title">
      <div className="studio-concepts-heading">
        <div>
          <span className="eyebrow">DESIGN DIRECTION / CONCEPT VISUALS</span>
          <h2 className="line-reveal" id="studio-concepts-title"><HeadlineLine>Ideas for</HeadlineLine><HeadlineLine><em>considered spaces.</em></HeadlineLine></h2>
          <p>Illustrative concepts, not photographs of completed projects. Explore our built work in the project gallery.</p>
        </div>
        <a className="text-link" href="/projects">See all projects <ArrowUpRight size={16} /></a>
      </div>
      <div className="studio-stagger-gallery" ref={galleryRef}>
        {studioGalleryItems.map((item) => (
          <figure
            className="studio-stagger-gallery-item image-reveal"
            key={item.src}
            style={{ flexGrow: item.width, aspectRatio: item.ratio, marginTop: `${item.top}%` }}
          >
            <img src={item.src} alt={item.alt} loading="lazy" decoding="async" sizes="(min-width: 1440px) 20vw, (min-width: 900px) 22vw, 62vw" style={{ objectPosition: item.position }} />
          </figure>
        ))}
      </div>
    </section>
  );
}

function useReveal() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observed = new WeakSet<Element>();
    let observer: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                window.setTimeout(() => entry.target.classList.remove("is-pending"), 1500);
                observer?.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.14 },
        );
    }

    const observeTarget = (element: Element) => {
      if (observed.has(element)) return;
      observed.add(element);
      if (reducedMotion || !observer) {
        element.classList.add("is-visible");
      } else {
        element.classList.add("is-pending");
        observer.observe(element);
      }
    };
    const observeTree = (node: Node) => {
      if (!(node instanceof Element)) return;
      if (node.matches(".reveal, .image-reveal, .line-reveal")) observeTarget(node);
      node.querySelectorAll(".reveal, .image-reveal, .line-reveal").forEach(observeTarget);
    };

    document.querySelectorAll(".reveal, .image-reveal, .line-reveal").forEach(observeTarget);
    const mutations = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach(observeTree));
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer?.disconnect();
    };
  }, []);
}

function HeadlineLine({ children }: { children: ReactNode }) {
  return (
    <span className="headline-reveal-line">
      <span>{children}</span>
    </span>
  );
}

function Wordmark({ inverse = false }: { inverse?: boolean }) {
  return (
    <a className={`wordmark ${inverse ? "wordmark-inverse" : ""}`} href="/" aria-label="Tunga Interiors home">
      <img className="wordmark-logo wordmark-logo-full" src="/images/tunga-logo-full.webp" alt="Tunga Interiors — Modern Interiors Rwanda" loading="eager" decoding="async" />
    </a>
  );
}

function SectionLabel({ index, children }: { index: string; children: ReactNode }) {
  return (
    <div className="section-label">
      <span className="section-index">{index}</span>
      <span>{children}</span>
    </div>
  );
}

function ProjectCard({ project, label = project.category, servicePreview = false }: { project: Project; label?: string; servicePreview?: boolean }) {
  const viewLabelRef = useRef<HTMLSpanElement>(null);

  return (
    <article className={`project-card ${servicePreview ? "project-card-service" : "project-card-editorial"} ${project.featured ? "project-featured" : ""}`}>
      <a
        className="project-card-link"
        href={`/projects/${project.slug}`}
        aria-label={`View ${project.title} project details`}
        onPointerMove={(event) => {
          if (event.pointerType !== "mouse" || !viewLabelRef.current) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          viewLabelRef.current.style.transform = `translate(${event.clientX - bounds.left}px, ${event.clientY - bounds.top}px)`;
        }}
      >
        <div className={`project-image image-reveal ${project.image ? "" : "project-image-empty"}`}>
          {project.image ? (
            <img src={project.image} alt={project.title} loading="lazy" decoding="async" />
          ) : (
            <div className="project-image-placeholder" role="img" aria-label={`${project.title} image placeholder`}>
              <span className="project-image-placeholder-mark"><Plus size={20} strokeWidth={1.2} /></span>
              <span>Project image</span>
            </div>
          )}
          <div className="project-image-overlay" />
          <span className="project-view-cursor" ref={viewLabelRef} aria-hidden="true">View</span>
          <span className="project-open"><MoveUpRight size={19} strokeWidth={1.4} /></span>
          {!servicePreview && (
            <div className="project-image-copy">
              <span className="project-location-tag">{project.location || project.spaceType} / {label}</span>
              <h3>{project.title}</h3>
            </div>
          )}
        </div>
        {servicePreview && (
          <div className="project-meta">
            <div>
              <span className="project-location-tag">{project.location || project.spaceType}</span>
              <h3>{project.title}</h3>
            </div>
            <span>{label}</span>
          </div>
        )}
      </a>
    </article>
  );
}

function ProjectDetail({ project }: { project: Project }) {
  const relatedProjects = projects.filter((item) => item.slug !== project.slug && item.category === project.category).slice(0, 3);
    const whatsappMessage = `Hi Tunga, I’d like to ask about the ${project.title} project.`;
  const heroImage = project.gallery[0] || project.image;

  return (
    <section className="project-detail section-dark">
      <div className="container">
        <div className="project-detail-nav">
          <a className="text-link text-link-light" href="/"><ArrowLeft size={16} /> Back to home</a>
          <a className="text-link text-link-light" href="/projects">All projects <ArrowUpRight size={15} /></a>
        </div>
        <div className="project-detail-hero">
          <div className="project-detail-copy">
            <span className="eyebrow">{project.spaceType} / {project.category}</span>
            <h1>{project.title}</h1>
            <p>{project.description}</p>
            <div className="project-detail-facts">
              {project.location && <div><span>Location</span><strong>{project.location}</strong></div>}
              <div><span>Space</span><strong>{project.spaceType}</strong></div>
              <div><span>Scope</span><strong>{project.category}</strong></div>
            </div>
            <a className="button button-gold" href={`https://wa.me/${TUNGA_MOBILE_RAW}?text=${encodeURIComponent(whatsappMessage)}`} target="_blank" rel="noreferrer">
              Enquire about this project <MessageCircle size={16} />
            </a>
          </div>
          {heroImage && <img className="project-detail-image" src={heroImage} alt={project.title} loading="eager" fetchPriority="high" decoding="async" />}
        </div>
        {project.gallery.length > 1 && (
          <div className="project-detail-gallery" aria-label={`${project.title} gallery`}>
            {project.gallery.slice(1).map((image, index) => (
              <img key={image} src={image} alt={`${project.title}, detail ${index + 2}`} loading="lazy" decoding="async" />
            ))}
          </div>
        )}
        {relatedProjects.length > 0 && (
          <div className="project-detail-related">
            <h2>Related work</h2>
            <div>
              {relatedProjects.map((related) => (
                <a className="project-detail-related-card" key={related.slug} href={`/projects/${related.slug}`}>
                  {related.image && <img src={related.image} alt={related.title} loading="lazy" decoding="async" />}
                  <span className="project-detail-related-overlay" />
                  <div className="project-detail-related-copy">
                    <span>{related.spaceType} / {related.category}</span>
                    <strong>{related.title}</strong>
                    <ArrowUpRight size={16} />
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function NotFoundPage() {
  return (
    <section className="page-intro section-dark">
      <div className="container">
        <span className="eyebrow">Tunga Interiors</span>
        <h1>Page not found.</h1>
        <p>This page may have moved or no longer be available.</p>
        <div className="not-found-actions">
          <a className="button button-gold" href="/">Back to home <ArrowLeft size={16} /></a>
          <a className="text-link text-link-light" href="/projects">Explore projects <ArrowUpRight size={16} /></a>
        </div>
      </div>
    </section>
  );
}

function ContactInquiryForm() {
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const submitInquiry = trpc.contact.submitInquiry.useMutation();
  const spaceTypes = ["Home / apartment", "Office / workspace", "Retail / hospitality", "Other"] as const;
  const budgetRanges = ["Under RWF 5M", "RWF 5M–20M", "RWF 20M–50M", "Above RWF 50M", "Not sure yet"] as const;

  const prepareMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const spaceType = String(formData.get("spaceType") || "") as typeof spaceTypes[number];
    const location = String(formData.get("location") || "").trim();
    const budgetRange = String(formData.get("budgetRange") || "") as typeof budgetRanges[number] | "";
    const brief = String(formData.get("brief") || "").trim();
    const consent = formData.get("consent") === "on";
    if (!consent) return;
    setErrorMessage("");
    setWhatsappUrl("");

    try {
      await submitInquiry.mutateAsync({
        name,
        phone,
        email,
        spaceType,
        location,
        budgetRange: budgetRange || undefined,
        brief,
        consent,
      });
      const emailLine = email ? ` Email: ${email}.` : "";
      const locationLine = location ? ` Location: ${location}.` : "";
      const budgetLine = budgetRange ? ` Indicative budget: ${budgetRange}.` : "";
        const message = `Hi Tunga, I’m ${name}. My phone is ${phone}.${emailLine} I’m planning a ${spaceType}.${locationLine}${budgetLine} ${brief}`;
      setWhatsappUrl(`https://wa.me/${TUNGA_MOBILE_RAW}?text=${encodeURIComponent(message)}`);
    } catch {
      setErrorMessage("We couldn’t save your enquiry. Please try again.");
    }
  };

  return (
    <form className="contact-inquiry" onSubmit={prepareMessage} onChange={() => { setWhatsappUrl(""); setErrorMessage(""); }}>
      <div className="contact-inquiry-heading">
        <span className="detail-label">Start a project</span>
        <p>A few details help us begin in the right place.</p>
      </div>
      <label className="contact-form-field">
        <span>Your name</span>
        <input name="name" autoComplete="name" placeholder="Name" required />
      </label>
      <label className="contact-form-field">
        <input name="phone" type="tel" autoComplete="tel" inputMode="tel" pattern="\\+?[0-9\\s().-]{7,24}" placeholder="+250 7XX XXX XXX" required />
      </label>
      <label className="contact-form-field">
        <span>Email <small>Optional</small></span>
        <input name="email" type="email" autoComplete="email" placeholder="you@example.com" />
      </label>
      <label className="contact-form-field">
        <span>Space type</span>
        <select name="spaceType" defaultValue="" required>
          <option value="" disabled>Select a space</option>
          {spaceTypes.map((spaceType) => <option key={spaceType}>{spaceType}</option>)}
        </select>
      </label>
      <label className="contact-form-field">
        <span>Location <small>Optional</small></span>
        <input name="location" autoComplete="address-level2" placeholder="Neighbourhood or city" />
      </label>
      <label className="contact-form-field">
        <span>Indicative budget <small>Optional</small></span>
        <select name="budgetRange" defaultValue="">
          <option value="">Select a range (optional)</option>
          {budgetRanges.map((budgetRange) => <option key={budgetRange}>{budgetRange}</option>)}
        </select>
      </label>
      <label className="contact-form-field contact-form-brief">
        <textarea name="brief" maxLength={3000} placeholder="A little about your space and what you have in mind" rows={3} required />
      </label>
      <label className="contact-consent">
        <input type="checkbox" name="consent" required />
        <span>I agree that Tunga Interiors may use these details to respond to my enquiry.</span>
      </label>
      <button className="button button-gold" type="submit" disabled={submitInquiry.isPending}>
        {submitInquiry.isPending ? "Saving enquiry…" : "Save enquiry & continue to WhatsApp"}
        {!submitInquiry.isPending && <ArrowUpRight size={16} />}
      </button>
      {errorMessage && <p className="contact-form-error" role="alert">{errorMessage}</p>}
      {whatsappUrl && (
        <p className="contact-form-status" role="status">
          Your enquiry is saved. <a href={whatsappUrl} target="_blank" rel="noreferrer">Continue in WhatsApp <ArrowUpRight size={14} /></a>
        </p>
      )}
    </form>
  );
}

function ContactDetails({ className = "" }: { className?: string }) {
  return (
    <div className={`contact-details ${className}`}>
      <div className="contact-detail">
        <span className="detail-label">Visit the studio</span>
        <p>Gishushu, KG 599<br />Kigali, Rwanda</p>
        <a className="inline-arrow" href="https://maps.google.com/?q=Gishushu%2C%20KG%20599%2C%20Kigali" target="_blank" rel="noreferrer">Get directions <ArrowUpRight size={15} /></a>
      </div>
      <div className="contact-detail">
        <span className="detail-label">Call / WhatsApp</span>
        <a href={`tel:+${TUNGA_MOBILE_RAW}`}>{TUNGA_MOBILE}</a>
        <a className="inline-arrow" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Open WhatsApp <ArrowUpRight size={15} /></a>
      </div>
      <div className="contact-detail">
        <span className="detail-label">Office / email</span>
        <p>{TUNGA_OFFICE}<br /><a className="contact-email" href={`mailto:${TUNGA_EMAIL}`}>{TUNGA_EMAIL}</a></p>
      </div>
    </div>
  );
}

function ContactMap() {
  const [interactive, setInteractive] = useState(false);

  return (
    <div className={`contact-map ${interactive ? "is-interactive" : ""}`}>
      <iframe
        id="tunga-contact-map"
        title="Tunga Interiors studio location in Gishushu, Kigali"
        src="https://www.google.com/maps?q=Gishushu%2C%20KG%20599%2C%20Kigali%2C%20Rwanda&output=embed"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        tabIndex={interactive ? 0 : -1}
      />
      {!interactive && (
        <button className="contact-map-enable" type="button" onClick={() => setInteractive(true)} aria-controls="tunga-contact-map">
          Enable map interaction <ArrowUpRight size={14} />
        </button>
      )}
    </div>
  );
}

function PageIntro({ page }: { page: "services" | "studio" }) {
  const copy = {
    services: ["02 / What we do", "Spaces, shaped", "with intent.", "New projects, renovations, and interior finishes for homes and commercial spaces in Kigali."],
    studio: ["04 / The studio", "A measured eye.", "A local point of view.", "Tunga Interiors is a Kigali interior design and fit-out studio led by James Manzi."],
  }[page];
  return <section className="page-intro section-dark"><div className="container"><span className="eyebrow">{copy[0]}</span><h1 className="line-reveal"><HeadlineLine>{copy[1]}</HeadlineLine><HeadlineLine><em>{copy[2]}</em></HeadlineLine></h1><p>{copy[3]}</p></div></section>;
}

function ServicePage({ service, onQuote }: { service: ServiceDefinition; onQuote: (service: string) => void }) {
  const [spaceType, setSpaceType] = useState("All");
  const serviceProjects = projects.filter((project) => project.category === service.category && (spaceType === "All" || project.spaceType === spaceType));
  const spaceTypes = ["All", "House", "Office", "Hotel", "Apartment"];
  const whatsappUrl = `https://wa.me/${TUNGA_MOBILE_RAW}?text=${encodeURIComponent(service.quoteMessage)}`;
  return (
    <>
      <section className="service-page-hero section-dark">
        <div className="container service-page-hero-grid">
          <div className="service-page-copy"><a className="service-back-home text-link text-link-light" href="/"><ArrowLeft size={16} /> Back to home</a><span className="eyebrow">{service.label}</span><h1 className="line-reveal"><HeadlineLine>{service.headline}</HeadlineLine></h1><p>{service.intro}</p><div className="service-page-actions"><button className="button button-gold" type="button" onClick={() => onQuote(service.navLabel)}>Request a quote <ArrowUpRight size={16} /></button><a className="text-link text-link-light" href={`/projects?service=${encodeURIComponent(service.category)}`}>See our work <ArrowDownRight size={17} /></a></div></div>
          <div className="service-page-visual image-reveal">
            <img src={service.heroImage} alt={service.heroImageAlt} loading="eager" decoding="async" />
            <span className="image-corner corner-top" />
            <span className="image-corner corner-bottom" />
            <div className="service-page-index">{service.slug === "new-projects" ? "01" : service.slug === "renovations" ? "02" : "03"}<span> / 03</span></div>
          </div>
        </div>
      </section>
      <section className="service-included section-cream"><div className="container service-content-grid"><div><SectionLabel index="01" children="What’s included" /><h2>The right layers, <em>in place.</em></h2></div><div className="included-list">{service.included.map((item, index) => <div className="included-item" key={item}><span>0{index + 1}</span><p>{item}</p></div>)}</div></div></section>
      <section className="service-steps section-dark"><div className="container service-content-grid"><div><SectionLabel index="02" children="How it works" /><h2>A clear way <em>through.</em></h2></div><div className="steps-list">{service.steps.map((step, index) => <div className="step-item" key={step}><span>0{index + 1}</span><p>{step}</p></div>)}</div></div></section>
      <section className="service-projects section-cream">
        <div className="container">
          <div className="projects-heading">
            <div><SectionLabel index="03" children="Our projects" /><h2>Spaces with <em>a point of view.</em></h2></div>
            <p className="projects-intro">A selection of work connected to {service.navLabel.toLowerCase()}.</p>
          </div>
          <div className="service-filter-note">
            <span>Showing</span>
            <strong>{service.navLabel}</strong>
            <div className="service-type-filter">
              {spaceTypes.map((type) => <button type="button" className={spaceType === type ? "active" : ""} onClick={() => setSpaceType(type)} key={type}>{type}</button>)}
            </div>
          </div>
          <div className="project-grid service-project-grid">
            {serviceProjects.length ? serviceProjects.map((project) => (
              <ProjectCard key={project.title} project={project} label={project.spaceType} servicePreview />
            )) : <p className="no-projects">More spaces in this category are taking shape.</p>}
          </div>
        </div>
      </section>
      <section className="contact section-gold service-closing"><div className="container contact-grid"><div className="contact-heading"><SectionLabel index="04" children="Start a conversation" /><h2>Tell us what you’re <em>building.</em></h2><p>Share a little about your {service.navLabel.toLowerCase()} project and where you are in the process.</p><button className="button button-dark" type="button" onClick={() => onQuote(service.navLabel)}>Request a quote <MessageCircle size={17} /></button></div><div className="service-whatsapp-card"><span className="detail-label">Ready message</span><p>{service.quoteMessage}</p><a className="button button-dark" href={whatsappUrl} target="_blank" rel="noreferrer">Open WhatsApp <ArrowUpRight size={16} /></a></div></div></section>
    </>
  );
}

function ThankYouPage() {
  return <section className="thank-you-page section-gold"><div className="container thank-you-inner"><SectionLabel index="06" children="WhatsApp handoff ready" /><h1>Your next conversation <em>starts here.</em></h1><p>WhatsApp should now be open with your Tunga Interiors message. Send it when you’re ready and James will take the conversation from there.</p><div className="thank-you-actions"><a className="button button-dark" href="/projects">Explore our projects <ArrowUpRight size={16} /></a><a className="text-link" href="/">Back to home <ArrowDownRight size={17} /></a></div><div className="thank-you-contact"><span className="detail-label">Need us directly?</span><a href={`tel:+${TUNGA_MOBILE_RAW}`}>{TUNGA_MOBILE}</a><a href={`mailto:${TUNGA_EMAIL}`}>{TUNGA_EMAIL}</a></div></div></section>;
}

function QuoteSelectField({ label, value, options, placeholder, onChange }: { label: string; value: string; options: string[]; placeholder: string; onChange: (value: string) => void }) {
  return (
    <label className="field full">
      <span>{label}</span>
      <select className={value ? "" : "is-placeholder"} value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">{placeholder}</option>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function QuoteModal({ open, onClose, initialService = "" }: { open: boolean; onClose: () => void; initialService?: string }) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState<QuoteData>(initialQuoteData);

  useEffect(() => {
    if (open) {
      setStep(1);
      setSubmitted(false);
      setData({ ...initialQuoteData, service: initialService });
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open, initialService]);

  if (!open) return null;
  const update = (key: keyof QuoteData, value: string) => setData((current) => ({ ...current, [key]: value }));
  const canContinue = (step === 1 && Boolean(data.service)) || (step === 2 && Boolean(data.property && data.location)) || (step === 3 && Boolean(data.scope && data.timeline)) || (step === 4 && Boolean(data.name && data.phone));
  const whatsappMessage = `Hi Tunga, I’m ${data.name || "interested in a project"}. I’d like to discuss ${data.service || "an interior project"} in ${data.location || "Kigali"}. My brief: ${data.scope || "to be discussed"}; timing: ${data.timeline || "to be discussed"}.`;
  const continueStep = () => step < 4 ? setStep((current) => current + 1) : setSubmitted(true);

  const summaryRows = [
    { label: "Service", value: data.service || "Not chosen" },
    { label: "Space", value: data.property || "Not chosen" },
    { label: "Location", value: data.location || "Not chosen" },
    { label: "Start", value: data.timeline || "Not chosen" },
    { label: "Help with", value: data.scope || "Not chosen" },
  ];
  const firstName = (data.name || "there").trim().split(/\s+/).filter(Boolean)[0] || "there";

  return (
    <div className="quote-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="quote-modal" role="dialog" aria-modal="true" aria-labelledby="quote-title">
        <button className="quote-close" type="button" onClick={onClose} aria-label="Close request a quote form"><X size={20} /></button>
        {submitted ? (
          <div className="quote-success modal-success">
            <div className="success-mark"><CheckCircle2 size={26} strokeWidth={2} /></div>
            <span className="eyebrow">Brief received</span>
            <h2>Thanks, {firstName}.</h2>
            <p className="success-body">We’ll message you on WhatsApp within 24 hours.</p>
            <div className="success-steps" aria-label="What happens next">
              <div><span>1</span><p>We review your brief.</p></div>
              <div><span>2</span><p>We reach out to agree a site visit.</p></div>
              <div><span>3</span><p>You get a concept and a clear budget.</p></div>
            </div>
            <div className="success-actions">
              <div className="success-callout">Want a faster reply? Send your brief directly.</div>
              <a className="button button-dark" href={`https://wa.me/${TUNGA_MOBILE_RAW}?text=${encodeURIComponent(whatsappMessage)}`} target="_blank" rel="noreferrer">Message us on WhatsApp now <Send size={16} strokeWidth={1.5} /></a>
              <button className="button button-secondary" type="button" onClick={onClose}>Close</button>
            </div>
          </div>
        ) : (
          <>
            <div className="quote-header">
              <div className="quote-topline"><span>Project intake / Kigali</span><span>0{step} / 04</span></div>
              {step === 1 ? (
                <div className="quote-heading">
                  <h2 id="quote-title">Let’s shape the <em>right brief.</em></h2>
                  <p>A few details help us understand what your space needs before we speak.</p>
                </div>
              ) : (
                <div className="quote-heading compact">
                  <h2 id="quote-title">Request a quote</h2>
                </div>
              )}
            </div>
            <div className="quote-progress" aria-label={`Step ${step} of 4`}>
              {quoteSteps.map((label, index) => {
                const isCompleted = index + 1 < step;
                const isActive = index + 1 === step;
                return (
                  <button
                    type="button"
                    className={`progress-step ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}
                    key={label}
                    onClick={() => isCompleted && setStep(index + 1)}
                    disabled={!isCompleted}
                    aria-label={`Go to ${label}`}
                  >
                    <span>{isCompleted ? <CheckCircle2 size={14} strokeWidth={2} /> : `0${index + 1}`}</span>
                    {label}
                  </button>
                );
              })}
            </div>
            <div className="quote-body">
              {step === 1 && (
                <div className="quote-panel">
                  <span className="quote-question">What are you imagining?</span>
                  <div className="choice-grid">
                    {quoteServices.map((service) => (
                      <button
                        className={`choice-card ${data.service === service.title ? "selected" : ""}`}
                        type="button"
                        key={service.title}
                        onClick={() => {
                          update("service", service.title);
                          setStep(2);
                        }}
                      >
                        <span className="choice-check">{data.service === service.title ? <CheckCircle2 size={17} /> : <span className="choice-plus">+</span>}</span>
                        <strong>{service.title}</strong>
                        <small>{service.detail}</small>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {step === 2 && <div className="quote-panel"><span className="quote-question">Tell us about the space.</span><div className="field-grid"><label className="field full"><span>Space type</span><select value={data.property} onChange={(event) => update("property", event.target.value)}><option value="">Select one</option><option>Home / apartment</option><option>House</option><option>Office / workspace</option><option>Hospitality / retail</option><option>Other</option></select></label><label className="field full"><span>Where in Kigali?</span><input value={data.location} onChange={(event) => update("location", event.target.value)} placeholder="Neighbourhood or city" /></label></div><p className="field-note">We work primarily in Kigali and across Rwanda. If you’re further afield, tell us where and we’ll let you know what’s possible.</p></div>}
              {step === 3 && (
                <div className="quote-panel">
                  <span className="quote-question">What would make this useful?</span>
                  <div className="field-grid">
                    <QuoteSelectField label="What should we help with?" value={data.scope} placeholder="Select the closest fit" options={["Full interior design", "Layout and spatial planning", "Finishes and material direction", "Partitions / joinery", "Design and build"]} onChange={(value) => update("scope", value)} />
                    <QuoteSelectField label="When are you hoping to begin?" value={data.timeline} placeholder="Choose a timeframe" options={["As soon as possible", "Within 1–3 months", "Within 3–6 months", "Still exploring"]} onChange={(value) => update("timeline", value)} />
                    <label className="field full"><span>Anything else we should know?</span><textarea value={data.notes} onChange={(event) => update("notes", event.target.value)} placeholder="A little context, a constraint, or a feeling you want the space to have…" rows={3} /></label>
                  </div>
                </div>
              )}
              {step === 4 && <div className="quote-panel"><span className="quote-question">Where can we reach you?</span><div className="field-grid"><label className="field"><span>Your name</span><input value={data.name} onChange={(event) => update("name", event.target.value)} placeholder="Full name" /></label><label className="field"><span>WhatsApp / phone</span><input value={data.phone} onChange={(event) => update("phone", event.target.value)} placeholder="+250 …" /></label><label className="field full"><span>Email <small>(optional)</small></span><input type="email" value={data.email} onChange={(event) => update("email", event.target.value)} placeholder="you@example.com" /></label></div><div className="quote-summary">{summaryRows.map((row) => <div className="quote-summary-row" key={row.label}><span>{row.label}</span><div><strong>{row.value}</strong>{row.label !== "Service" && <button type="button" className="summary-edit" onClick={() => setStep(row.label === "Service" ? 1 : row.label === "Space" ? 2 : row.label === "Location" ? 2 : row.label === "Start" ? 3 : 3)}>Edit</button>}</div></div>)}</div></div>}
            </div>
            <div className="quote-actions">{step > 1 ? <button className="modal-text-button" type="button" onClick={() => setStep((current) => current - 1)}><ChevronLeft size={16} /> Back</button> : <span className="required-note">* Required to continue</span>}<button className="button button-dark" type="button" disabled={!canContinue} onClick={continueStep}>{step === 4 ? "Send brief" : "Continue"} {step === 4 ? <Send size={16} /> : <ChevronRight size={16} />}</button></div>
          </>
        )}
      </section>
    </div>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [quoteService, setQuoteService] = useState("");
  const [founderExpanded, setFounderExpanded] = useState(false);
  const [serviceMenuOpen, setServiceMenuOpen] = useState(false);
  const [portfolioFilter, setPortfolioFilter] = useState<PortfolioFilter>("All");
  const [projectFilter, setProjectFilter] = useState<ProjectCategory>("All");
  const lenisRef = useRef<Lenis | null>(null);
  const quoteOpenRef = useRef(quoteOpen);
  quoteOpenRef.current = quoteOpen;
  const routeSegments = window.location.pathname.split("/").filter(Boolean);
  const activePage = routeSegments[0] || "home";
  const isNavActive = (href: string) => activePage === href.slice(1);
  const serviceSlug = activePage === "services" ? routeSegments[1] as ServiceSlug | undefined : undefined;
  const servicePage = serviceSlug ? serviceDefinitions[serviceSlug] : undefined;
  const projectSlug = activePage === "projects" ? routeSegments[1] : undefined;
  const projectDetail = projectSlug ? projects.find((project) => project.slug === projectSlug) : undefined;
  const isHome = activePage === "home";
  const isThankYou = activePage === "thank-you";
  const isNotFound =
    !["home", "services", "projects", "studio", "contact", "thank-you"].includes(activePage) ||
    (activePage === "services" && (routeSegments.length > 2 || (routeSegments.length === 2 && !servicePage))) ||
    (activePage === "projects" && (routeSegments.length > 2 || (routeSegments.length === 2 && !projectDetail)));
  const visibleProjects = activePage === "projects"
    ? projects.filter((project) => projectFilter === "All" || project.category === projectFilter)
    : projects.slice(0, 5);
  const visibleHomeProjects = projects.filter((project) => matchesPortfolioFilter(project, portfolioFilter));
  const page = !isNotFound && ["services", "projects", "studio", "contact"].includes(activePage) ? activePage as "services" | "projects" | "studio" | "contact" : null;
  useReveal();
  useEffect(() => {
    let frame = 0;
    let lenis: Lenis | null = null;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerPreference = window.matchMedia("(pointer: coarse)");
    const syncLenis = () => {
      const shouldEnable = window.innerWidth > 900 && !motionPreference.matches && !pointerPreference.matches;
      if (shouldEnable && !lenis) {
        lenis = new Lenis({ lerp: 0.1, anchors: true });
        lenisRef.current = lenis;
        if (quoteOpenRef.current) lenis.stop();
        const raf = (time: number) => {
          lenis?.raf(time);
          frame = requestAnimationFrame(raf);
        };
        frame = requestAnimationFrame(raf);
      } else if (!shouldEnable && lenis) {
        cancelAnimationFrame(frame);
        lenis.destroy();
        lenis = null;
        lenisRef.current = null;
      }
    };

    syncLenis();
    motionPreference.addEventListener("change", syncLenis);
    pointerPreference.addEventListener("change", syncLenis);
    window.addEventListener("resize", syncLenis);
    return () => {
      motionPreference.removeEventListener("change", syncLenis);
      pointerPreference.removeEventListener("change", syncLenis);
      window.removeEventListener("resize", syncLenis);
      cancelAnimationFrame(frame);
      lenis?.destroy();
      lenisRef.current = null;
    };
  }, []);
  useEffect(() => {
    if (quoteOpen) lenisRef.current?.stop();
    else lenisRef.current?.start();
  }, [quoteOpen]);
  useEffect(() => {
    let previousY = window.scrollY;
    const updateHeader = () => {
      const currentY = window.scrollY;
      if (menuOpen || quoteOpen || currentY < 70) {
        setHeaderHidden(false);
      } else if (Math.abs(currentY - previousY) > 8) {
        setHeaderHidden(currentY > previousY);
      }
      previousY = currentY;
    };

    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, [menuOpen, quoteOpen]);
  useEffect(() => {
    const titles: Record<string, string> = {
      home: "Tunga Interiors — Spaces with a point of view.",
      services: "Tunga Interiors — Services",
      projects: "Tunga Interiors — Projects",
      studio: "Tunga Interiors — Studio",
      contact: "Tunga Interiors — Contact",
      "thank-you": "Thank you — Tunga Interiors",
    };
    const descriptions: Record<string, string> = {
      home: "Tunga Interiors is a Kigali interior design and fit-out studio for homes, offices, and retail. Design and build by one team.",
      services: "Explore Tunga Interiors' new projects, renovations, partitions, and finishes in Kigali.",
      projects: "Explore Tunga Interiors' interior design and fit-out work across homes, offices, and retail.",
      studio: "Meet James Manzi and Tunga Interiors, a Kigali interior design and fit-out studio.",
      contact: "Contact Tunga Interiors in Kigali about an interior project, renovation, or fit-out.",
      "thank-you": "Your Tunga Interiors enquiry is ready to continue in WhatsApp.",
    };
    document.title = isNotFound
      ? "Page Not Found — Tunga Interiors"
      : projectDetail
        ? `${projectDetail.title} — Projects | Tunga Interiors`
        : servicePage
      ? servicePage.slug === "new-projects"
        ? "Interior Design & Fit-Out in Kigali | Tunga Interiors"
        : servicePage.slug === "renovations"
          ? "Interior Renovation in Kigali | Tunga Interiors"
          : "Partitions & Finishes in Kigali | Tunga Interiors"
      : titles[activePage] || titles.home;
    document.querySelector('meta[name="description"]')?.setAttribute("content", projectDetail?.description || servicePage?.intro || descriptions[activePage] || descriptions.home);
  }, [activePage, isNotFound, projectDetail, servicePage]);

  const closeMenu = () => setMenuOpen(false);
  const openQuote = (service = "") => {
    setQuoteService(service);
    setQuoteOpen(true);
    closeMenu();
    setServiceMenuOpen(false);
  };

  return (
    <main id="top">
      <header className={`site-header ${menuOpen ? "menu-open" : ""} ${headerHidden ? "header-hidden" : ""}`}>
        <div className="header-inner">
          <Wordmark inverse />
          <nav className="desktop-nav" aria-label="Primary navigation">
            {navItems.map((item) => (
              item.label === "Services" ? (
                <div className="nav-service-menu" key={item.href} onMouseEnter={() => setServiceMenuOpen(true)} onMouseLeave={() => setServiceMenuOpen(false)}>
                  <a className={isNavActive(item.href) ? "active" : ""} href={item.href} aria-haspopup="true" aria-expanded={serviceMenuOpen} aria-current={isNavActive(item.href) ? "page" : undefined}>{item.label}</a>
                  <div className={`service-dropdown ${serviceMenuOpen ? "is-open" : ""}`}>
                    {Object.values(serviceDefinitions).map((service) => (
                      <a className={serviceSlug === service.slug ? "active" : ""} href={`/services/${service.slug}`} key={service.slug} aria-current={serviceSlug === service.slug ? "page" : undefined}>
                        <span>{service.label}</span>{service.navLabel}<ArrowUpRight size={14} />
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <a className={isNavActive(item.href) ? "active" : ""} key={item.href} href={item.href} aria-current={isNavActive(item.href) ? "page" : undefined}>{item.label}</a>
              )
            ))}
          </nav>
          {activePage !== "contact" && <button className="header-cta" type="button" onClick={() => openQuote()}>
            Start a project <ArrowUpRight size={15} strokeWidth={1.5} />
          </button>}
          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        <div className="mobile-menu" aria-hidden={!menuOpen}>
          {navItems.map((item, index) => item.label === "Services" ? (
            <div className="mobile-service-menu" key={item.href}>
              <button className={`mobile-service-toggle ${isNavActive(item.href) ? "active" : ""}`} type="button" onClick={() => setServiceMenuOpen((open) => !open)} aria-expanded={serviceMenuOpen} aria-current={isNavActive(item.href) ? "page" : undefined}>
                <span>0{index + 1}</span>{item.label}<Plus className={serviceMenuOpen ? "rotated" : ""} size={18} strokeWidth={1.5} />
              </button>
              {serviceMenuOpen && (
                <div className="mobile-service-links">
                  <a className={!serviceSlug ? "active" : ""} href="/services" onClick={closeMenu} aria-current={!serviceSlug && isNavActive(item.href) ? "page" : undefined}>All services <ArrowUpRight size={15} /></a>
                  {Object.values(serviceDefinitions).map((service) => (
                    <a className={serviceSlug === service.slug ? "active" : ""} key={service.slug} href={`/services/${service.slug}`} onClick={closeMenu} aria-current={serviceSlug === service.slug ? "page" : undefined}>
                      {service.navLabel} <ArrowUpRight size={15} />
                    </a>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <a className={isNavActive(item.href) ? "active" : ""} key={item.href} href={item.href} onClick={closeMenu} aria-current={isNavActive(item.href) ? "page" : undefined}>
              <span>0{index + 1}</span>{item.label}<ArrowUpRight size={17} strokeWidth={1.5} />
            </a>
          ))}
          {activePage !== "contact" && <button className="mobile-menu-cta" type="button" onClick={() => openQuote()}>
            Start a project <ArrowUpRight size={17} />
          </button>}
        </div>
      </header>

      {isNotFound && <NotFoundPage />}
      {!isNotFound && projectDetail && <ProjectDetail project={projectDetail} />}
      {!isNotFound && servicePage && <ServicePage service={servicePage} onQuote={openQuote} />}
      {!isNotFound && !servicePage && !projectDetail && isThankYou && <ThankYouPage />}
      {!servicePage && !isHome && page && page !== "projects" && page !== "contact" && <PageIntro page={page} />}
      {!servicePage && isHome && <section className="hero" aria-labelledby="hero-title">
        <img className="hero-image" src={images.hero} alt="" aria-hidden="true" loading="eager" fetchPriority="high" decoding="async" />
        <div className="hero-overlay" />
        <div className="hero-grain" />
        <div className="hero-content container">
          <div className="hero-copy reveal reveal-delay-1">
            <h1 className="line-reveal" id="hero-title">
              <HeadlineLine>Spaces with</HeadlineLine>
              <HeadlineLine><em>a point of view.</em></HeadlineLine>
            </h1>
            <p className="hero-description">
              Interior design and fit-out in Kigali. One team takes your space from first sketch to handover.
            </p>
            <div className="hero-actions">
              <button className="button button-gold" type="button" onClick={() => openQuote()}>
                Start a project <ArrowUpRight size={16} strokeWidth={1.6} />
              </button>
              <a className="text-link text-link-light" href="/projects">
                View our work <ArrowDownRight size={17} strokeWidth={1.4} />
              </a>
            </div>
          </div>
          <a className="hero-scroll" href="/services" aria-label="Open services page">
            <span>Scroll to explore</span>
            <ArrowDownRight size={17} strokeWidth={1.4} />
          </a>
        </div>
      </section>}

      {!servicePage && (isHome || activePage === "studio") && <section className="intro section-dark" id="intro">
        <div className="container intro-grid">
          <div className="intro-marker reveal">
            <span className="gold-square" />
            <span>01 / 05</span>
          </div>
          <div className="intro-copy reveal reveal-delay-1">
            <SectionLabel index="01" children="The Tunga approach" />
            <h2 className="line-reveal">
              <HeadlineLine>One studio.</HeadlineLine><HeadlineLine><em>Design through delivery.</em></HeadlineLine>
            </h2>
            <p>
              At Tunga Interiors, the people who design your space also carry it through execution. The approved design guides what gets installed.
            </p>
            <a className="text-link" href="/studio">
              Meet the studio <ArrowUpRight size={16} strokeWidth={1.4} />
            </a>
          </div>
        </div>
      </section>}

      {!isNotFound && !servicePage && (isHome || activePage === "services") && <section className="services section-cream" id="services">
        <div className="container">
          <div className="section-heading reveal">
            <SectionLabel index="02" children="What we do" />
            <h2 className="line-reveal"><HeadlineLine>Spaces, shaped</HeadlineLine><HeadlineLine><em>with intent.</em></HeadlineLine></h2>
            <p>Three ways we can help you make a space feel more like itself.</p>
          </div>
          <div className="services-list">
            <article className="service-card reveal" onClick={() => { window.location.href = "/services/new-projects"; }} role="link" tabIndex={0}>
              <div className="service-number">01</div>
              <div className="service-visual image-reveal">
                <img src={images.newProject} alt="Warm living and dining interior" loading="lazy" decoding="async" />
                <span className="image-corner corner-top" />
                <span className="image-corner corner-bottom" />
              </div>
              <div className="service-copy">
                <div>
                  <h3>New projects</h3>
                  <p>Homes, offices, and shops designed and fitted out from an empty shell. Layout, finishes, lighting, and furniture handled together.</p>
                </div>
                <span className="round-arrow"><ArrowUpRight size={18} strokeWidth={1.4} /></span>
              </div>
            </article>
            <article className="service-card reveal reveal-delay-1" onClick={() => { window.location.href = "/services/renovations"; }} role="link" tabIndex={0}>
              <div className="service-number">02</div>
              <div className="service-visual">
                <img src={images.renovation} alt="Contemporary salon interior with styling stations" loading="lazy" decoding="async" />
                <span className="image-corner corner-top" />
                <span className="image-corner corner-bottom" />
              </div>
              <div className="service-copy">
                <div>
                  <h3>Renovations</h3>
                  <p>We rework what you already have: better layout, better light, and better materials, without rebuilding everything.</p>
                </div>
                <span className="round-arrow"><ArrowUpRight size={18} strokeWidth={1.4} /></span>
              </div>
            </article>
            <article className="service-card reveal reveal-delay-2" onClick={() => { window.location.href = "/services/partitions-finishes"; }} role="link" tabIndex={0}>
              <div className="service-number">03</div>
              <div className="service-visual">
                <img src={images.partitions} alt="Glass-framed office meeting room partition" loading="lazy" decoding="async" />
                <span className="image-corner corner-top" />
                <span className="image-corner corner-bottom" />
              </div>
              <div className="service-copy">
                <div>
                  <h3>Partitions & finishes</h3>
                  <p>Custom partitions, shelving, wall treatments, and joinery for spaces that need structure, privacy, or a sharper look.</p>
                </div>
                <span className="round-arrow"><ArrowUpRight size={18} strokeWidth={1.4} /></span>
              </div>
            </article>
          </div>
        </div>
      </section>}

      {!servicePage && isHome && <section className="home-process section-cream" id="process">
        <div className="container">
          <div className="home-process-heading reveal">
            <span className="eyebrow">FROM BRIEF TO HANDOVER</span>
            <h2 className="line-reveal"><HeadlineLine>How a project</HeadlineLine><HeadlineLine><em>runs.</em></HeadlineLine></h2>
          </div>
          <div className="home-process-grid">
            {homeProcessSteps.map((step, index) => (
              <article className="home-process-step reveal" key={step.title}>
                <span className="home-process-number">0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>}

      {!isNotFound && !projectDetail && !servicePage && (isHome || activePage === "projects" || activePage === "services") && <section className="projects section-dark" id="projects">
        <div className="container">
          <div className="projects-heading reveal">
            {activePage === "projects" || activePage === "services" ? (
              <h2>Our projects</h2>
            ) : (
              <>
                <div>
                  <SectionLabel index="03" children="Selected work" />
                  <h2 className="line-reveal"><HeadlineLine>Selected</HeadlineLine><HeadlineLine><em>spaces.</em></HeadlineLine></h2>
                </div>
                <p className="projects-intro">Recent work across homes, offices, and retail. {projects.length} projects and counting.</p>
              </>
            )}
          </div>
          {activePage === "projects" && (
            <div className="project-index-filter">
              <div className="container project-index-filter-inner">
                <span className="filter-label">Browse projects</span>
                <div className="filter-options" aria-label="Filter projects by category">
                  {projectFilters.map((filter) => (
                    <button
                      type="button"
                      className={projectFilter === filter ? "active" : ""}
                      aria-pressed={projectFilter === filter}
                      onClick={() => setProjectFilter(filter)}
                      key={filter}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                <span className="project-count">{visibleProjects.length} projects</span>
              </div>
            </div>
          )}
          {isHome ? (
            <>
              <div className="filter-bar home-filter-bar">
                <span className="filter-label">Explore by space</span>
                <div className="filter-options" aria-label="Filter projects by space type">
                  {portfolioFilters.map((filter) => (
                    <button
                      type="button"
                      className={portfolioFilter === filter ? "active" : ""}
                      aria-pressed={portfolioFilter === filter}
                      onClick={() => setPortfolioFilter(filter)}
                      key={filter}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                <span className="project-count">{visibleHomeProjects.length} / {projects.length} projects</span>
              </div>
              {visibleHomeProjects.length ? (
                <ProjectCoverflow key={portfolioFilter} projects={visibleHomeProjects} />
              ) : (
                <p className="portfolio-empty">Hospitality projects are not yet featured in the gallery.</p>
              )}
            </>
          ) : (
            <div className={`project-grid ${activePage === "projects" ? "project-index-grid" : ""}`}>
              {visibleProjects.map((project) => (
                <ProjectCard key={project.title} project={project} />
              ))}
            </div>
          )}
          <div className="projects-footer reveal">
            <span>More spaces in the making</span>
            <a className="text-link text-link-light" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              Start your project <ArrowUpRight size={16} strokeWidth={1.4} />
            </a>
          </div>
        </div>
      </section>}

      {!servicePage && (isHome || activePage === "studio") && <section className="studio section-cream" id="studio">
        <div className="container studio-grid">
          <div className="studio-heading reveal">
            <span className="eyebrow studio-kicker">THE STUDIO</span>
            <h2 className="line-reveal"><HeadlineLine>The last</HeadlineLine><HeadlineLine><em>10%.</em></HeadlineLine></h2>
          </div>
          <div className="studio-copy reveal reveal-delay-1">
            <p className="studio-lead">Founded in Kigali in 2020 by James Manzi, Tunga Interiors is an interior design and fit-out studio.</p>
            <p>Layout, finishes, lighting, and furniture are planned together, then carried through execution by one team.</p>
            <div className="studio-facts">
              <div><strong>The last 10%</strong><p>Joints, edges, lighting, alignment. Attention goes to the details that shape the finished space.</p></div>
              <div><strong>Built locally</strong><p>A Kigali-based studio carrying projects from design through execution.</p></div>
              <div><strong>Design-led</strong><p>Layout, finishes, and lighting follow how the space will be used.</p></div>
            </div>
          </div>
          <button className={`founder-note reveal reveal-delay-2 ${founderExpanded ? "expanded" : ""}`} type="button" onClick={() => setFounderExpanded((current) => !current)} aria-expanded={founderExpanded}>
            <div className="founder-top"><span>Founder&apos;s note / click to explore</span>{founderExpanded ? <X size={17} strokeWidth={1.3} /> : <Plus size={17} strokeWidth={1.3} />}</div>
            <div className="founder-monogram">JM</div>
            <div>
              <h3>James Manzi</h3>
              <p>CEO &amp; Founder</p>
            </div>
            <p className="founder-quote">“Tunga is not here to reproduce a showroom look. We start with how a place should feel, then make every line, material, and transition earn its place.”</p>
            <div className="founder-more">{founderExpanded ? "Our point of view: local, specific, lived-in — never borrowed." : "Why Tunga feels different"}<ChevronRight size={15} /></div>
          </button>
        </div>
        {activePage === "studio" && (
          <div className="container studio-cta-wrap">
            <button className="button button-gold" type="button" onClick={() => openQuote()}>
              Start a project <ArrowUpRight size={16} />
            </button>
          </div>
        )}
      </section>}

      {!servicePage && isHome && <StudioStaggerGallery />}

      {!servicePage && isHome && <section className="home-faq section-dark">
        <div className="container home-faq-grid">
          <div className="home-faq-heading">
            <span className="eyebrow">BEFORE WE BEGIN</span>
            <h2 className="line-reveal"><HeadlineLine>Good questions,</HeadlineLine><HeadlineLine><em>clear answers.</em></HeadlineLine></h2>
          </div>
          <div className="home-faq-list">
            {homeFaqItems.map((item) => (
              <details className="home-faq-item" key={item.question}>
                <summary>{item.question}<Plus size={18} /></summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>}

      {!servicePage && (isHome || activePage === "contact") && <section className={`contact ${isHome ? "section-gold home-contact" : "section-dark contact-page"}`} id="contact">
        <div className="container contact-grid">
          <div className="contact-heading reveal">
            {isHome ? (
              <>
                <SectionLabel index="05" children="Start a project" />
                <h2 className="line-reveal"><HeadlineLine>Tell us what you’re</HeadlineLine><HeadlineLine><em>building.</em></HeadlineLine></h2>
                <p>Send a few details about your space and we’ll reply with next steps.</p>
                <a className="button button-dark" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                  Start a project on WhatsApp <MessageCircle size={17} strokeWidth={1.5} />
                </a>
              </>
            ) : (
              <>
                <span className="eyebrow contact-kicker">TUNGA INTERIORS / KIGALI</span>
                <h1>Begin with the <em>space.</em></h1>
                <p>Tell us what you’re planning, where the space is, and what you’d like it to become. We’ll shape the next step together.</p>
                <ContactMap />
              </>
            )}
          </div>
          <div className="contact-details reveal reveal-delay-1">
            {isHome ? <ContactDetails /> : <ContactInquiryForm />}
          </div>
        </div>
        {!isHome && (
          <div className="container">
            <ContactDetails className="contact-details-row" />
          </div>
        )}
      </section>}

      <footer className="site-footer">
        <div className="container footer-top">
          <Wordmark inverse />
          <p>Modern interiors Rwanda<br />{TUNGA_ADDRESS}<br /><a href={`tel:+${TUNGA_MOBILE_RAW}`}>{TUNGA_MOBILE}</a><br /><a href={`mailto:${TUNGA_EMAIL}`}>{TUNGA_EMAIL}</a></p>
          <a className="footer-back" href="/">Back to top <ArrowUpRight size={15} /></a>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} Tunga Interiors</span>
          <a href={`mailto:${TUNGA_EMAIL}`}>{TUNGA_EMAIL}</a>
          <a href={`https://${TUNGA_WEBSITE}`} target="_blank" rel="noreferrer">{TUNGA_WEBSITE}</a>
        </div>
      </footer>

      {activePage !== "contact" && <a className="floating-whatsapp" href={WHATSAPP_URL} target="_blank" rel="noreferrer" aria-label="Chat with Tunga Interiors on WhatsApp">
        <MessageCircle size={20} strokeWidth={1.7} />
        <span>WhatsApp us</span>
      </a>}
      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} initialService={quoteService} />
    </main>
  );
}

export default App;
