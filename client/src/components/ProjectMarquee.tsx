import { useEffect, useRef, useState, type FocusEvent } from "react";

type MarqueeProject = {
  category: string;
  description: string;
  image?: string;
  imagePosition?: string;
  slug: string;
  spaceType: string;
  title: string;
};

const SCROLL_SPEED = 45;

export default function ProjectMarquee({ projects }: { projects: MarqueeProject[] }) {
  const viewportRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [copies, setCopies] = useState(1);
  const [duration, setDuration] = useState(30);
  const [focusPaused, setFocusPaused] = useState(false);
  const repeatedProjects = Array.from({ length: copies }, (_, copy) =>
    projects.map((project) => ({ project, key: `${project.slug}-${copy}` })),
  ).flat();

  useEffect(() => {
    const viewport = viewportRef.current;
    const list = listRef.current;
    if (!viewport || !list || projects.length === 0) return;

    const updateSize = () => {
      const baseListWidth = list.getBoundingClientRect().width / copies;
      if (baseListWidth <= 0) return;

      const nextCopies = Math.max(1, Math.ceil((viewport.clientWidth + 1) / baseListWidth));
      setDuration((baseListWidth * nextCopies) / SCROLL_SPEED);
      setCopies((current) => current === nextCopies ? current : nextCopies);
    };

    const observer = new ResizeObserver(updateSize);
    observer.observe(viewport);
    observer.observe(list);
    updateSize();

    return () => observer.disconnect();
  }, [copies, projects.length]);

  const handleBlur = (event: FocusEvent<HTMLUListElement>) => {
    if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) return;
    setFocusPaused(false);
  };

  const renderList = (hidden: boolean) => (
    <ul
      className="mq__list"
      role="list"
      aria-hidden={hidden || undefined}
      aria-label={hidden ? undefined : "Featured projects"}
      ref={hidden ? undefined : listRef}
      onFocus={hidden ? undefined : () => setFocusPaused(true)}
      onBlur={hidden ? undefined : handleBlur}
    >
      {repeatedProjects.map(({ project, key }) => (
        <li className="mq__item" key={key}>
          <a href={`/projects/${project.slug}`} tabIndex={hidden ? -1 : undefined}>
            <span className="mq__img">
              {project.image && (
                <img
                  src={project.image}
                  alt={hidden ? "" : `${project.title} — ${project.spaceType.toLowerCase()} interior`}
                  loading="lazy"
                  decoding="async"
                  style={{ objectPosition: project.imagePosition ?? "50% 50%" }}
                />
              )}
            </span>
            <span className="mq__meta">
              <span className="mq__cat">{project.spaceType} / {project.category}</span>
              <span className="mq__title">{project.title}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="mq-wrap">
      <section
        className={`mq${focusPaused ? " is-focus-paused" : ""}`}
        aria-label="Selected projects"
        ref={viewportRef}
      >
        <div className="mq__track" style={{ animationDuration: `${duration}s` }}>
          {renderList(false)}
          {renderList(true)}
        </div>
      </section>
    </div>
  );
}
