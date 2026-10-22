import { useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { A11y, Autoplay, EffectCoverflow, Keyboard } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";

type CoverflowProject = {
  category: string;
  image?: string;
  slug: string;
  size: string;
  spaceType: string;
  title: string;
};

export default function ProjectCoverflow({ projects }: { projects: CoverflowProject[] }) {
  const [swiperInstance, setSwiperInstance] = useState<SwiperInstance | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const viewLabelRef = useRef<HTMLSpanElement>(null);

  return (
    <div className="home-project-carousel">
      <Swiper
        className="home-project-swiper"
        modules={[A11y, Autoplay, EffectCoverflow, Keyboard]}
        effect="coverflow"
        centeredSlides
        slidesPerView="auto"
        spaceBetween={22}
        loop
        grabCursor
        speed={650}
        autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        slideToClickedSlide
        keyboard={{ enabled: true, onlyInViewport: true }}
        coverflowEffect={{ rotate: 30, stretch: 8, depth: 150, modifier: 1, scale: 0.86, slideShadows: false }}
        onSwiper={setSwiperInstance}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        a11y={{ prevSlideMessage: "Previous project", nextSlideMessage: "Next project" }}
      >
        {projects.map((project, index) => (
          <SwiperSlide key={project.title}>
            <article className="coverflow-card">
              <div
                className="coverflow-image image-reveal"
                onPointerMove={(event) => {
                  if (event.pointerType !== "mouse" || !viewLabelRef.current) return;
                  const bounds = event.currentTarget.getBoundingClientRect();
                  viewLabelRef.current.style.transform = `translate(${event.clientX - bounds.left}px, ${event.clientY - bounds.top}px)`;
                }}
              >
                {project.image && <img src={project.image} alt={`${project.title} interior preview`} loading={index === 0 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : "auto"} decoding="async" />}
                <span className="coverflow-image-number">{project.size}</span>
                <span className="coverflow-view-cursor" ref={viewLabelRef} aria-hidden="true">View</span>
              </div>
              <div className="coverflow-project-meta">
                <div>
                  <span className="coverflow-project-type">{project.spaceType} / {project.category}</span>
                  <h3>{project.title}</h3>
                </div>
                <a className="coverflow-project-link" href={`/projects/${project.slug}`} aria-label={`View ${project.title}`}>
                  View project <ArrowUpRight size={15} strokeWidth={1.6} />
                </a>
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="home-project-controls">
        <div className="home-project-counter" aria-live="polite" aria-atomic="true">
          <span>{String(activeIndex + 1).padStart(2, "0")}</span>
          <span> / {String(projects.length).padStart(2, "0")}</span>
        </div>
        <p>Swipe or use the arrows to explore</p>
        <div className="home-project-arrows">
          <button type="button" onClick={() => swiperInstance?.slidePrev()} aria-label="Previous project" title="Previous project">
            <ChevronLeft size={19} strokeWidth={1.5} />
          </button>
          <button type="button" onClick={() => swiperInstance?.slideNext()} aria-label="Next project" title="Next project">
            <ChevronRight size={19} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}