import { useEffect, useMemo, useRef, useState } from "react";

import { MdArrowOutward } from "react-icons/md";
import { FaReact } from "react-icons/fa";
import { RiTailwindCssFill } from "react-icons/ri";
import { PiMouseScroll } from "react-icons/pi";

import projectsData from "../../assets/Projects.json";
import savestride from "../../assets/save-stride.png";

function Works() {
    const TITLE_ROW_PX = 56; // Tailwind h-14 (3.5rem)

    const projects = useMemo(
        () =>
            (projectsData ?? []).map((p, idx) => ({
                id: idx,
                name: p?.name ?? `Project ${idx + 1}`,
                overview: p?.overview ?? "",
                tech_stack: p?.tech_stack ?? "",
                links: {
                    github: p?.links?.github ?? "",
                    demo: p?.links?.demo ?? "",
                },
            })),
        []
    );

    const containerRef = useRef(null);
    const sectionRefs = useRef([]);

    const [activeIndex, setActiveIndex] = useState(() => {
        const idx = projects.findIndex((p) => p.name.toLowerCase() === "save stride");
        return idx >= 0 ? idx : 0;
    });

    useEffect(() => {
        if (!containerRef.current) return;
        if (!projects.length) return;

        const root = containerRef.current;
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
                if (!visible?.target) return;
                const idx = Number(visible.target.getAttribute("data-project-index"));
                if (!Number.isNaN(idx)) setActiveIndex(idx);
            },
            {
                root,
                threshold: [0.55, 0.65, 0.75],
            }
        );

        sectionRefs.current.forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, [projects.length]);

    const currentProject = projects[activeIndex] ?? null;
    const previousProject = projects[activeIndex - 1] ?? null;
    const nextProject = projects[activeIndex + 1] ?? null;

    const scrollToIndex = (idx) => {
        const el = sectionRefs.current[idx];
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const projectImage = currentProject?.name?.toLowerCase() === "save stride" ? savestride : null;
    const techLower = (currentProject?.tech_stack ?? "").toLowerCase();
    const showReact = techLower.includes("react");
    const showTailwind = techLower.includes("tailwind");
    const reelItems = useMemo(() => [null, ...projects, null], [projects]);

    return (
        <div
            ref={containerRef}
            className="relative z-10 w-full h-full pt-24 overflow-y-auto no-scrollbar snap-y snap-mandatory"
        >
            <div className="fixed flex top-[10vh] flex-col items-center left-1/2 -translate-x-1/2 fade-in">
                <h1 className="ND text-4xl opacity-70 -translate-x-1">Scroll</h1>
                <PiMouseScroll size={30} className="opacity-70 animate-bounce" />
            </div>
            <div className="fixed right-12 top-28 text-right fade-in">
                <div className="relative overflow-visible" style={{ height: TITLE_ROW_PX * 3 }}>
                    <div
                        className="flex flex-col transition-transform duration-500 ease-out will-change-transform"
                        style={{ transform: `translateY(${-activeIndex * TITLE_ROW_PX}px)` }}
                    >
                        {reelItems.map((p, reelIdx) => {
                            const idx = reelIdx - 1; // map reel index back to projects index
                            const isSpacer = !p;
                            const isActive = !isSpacer && idx === activeIndex;
                            const isNeighbor = !isSpacer && Math.abs(idx - activeIndex) === 1;

                            return (
                                <div
                                    key={p?.id ?? `spacer-${reelIdx}`}
                                    className="h-14 flex items-center justify-end overflow-visible"
                                >
                                    <button
                                        type="button"
                                        onClick={() => !isSpacer && scrollToIndex(idx)}
                                        className={[
                                            "SG inline-block whitespace-nowrap transition-all duration-500 ease-out",
                                            isActive
                                                ? "font-extrabold text-white text-3xl scale-[2.35] origin-right"
                                                : isNeighbor
                                                    ? "font-bold text-3xl opacity-80 hover:opacity-100 bg-linear-to-t from-white/0 to-white text-transparent bg-clip-text"
                                                    : "font-bold text-3xl opacity-0 pointer-events-none",
                                        ].join(" ")}
                                    >
                                        {p?.name ?? ""}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {!!currentProject?.overview && (
                    <p
                        key={currentProject.id}
                        className="SG text-white/70 text-xl mt-10 max-w-lg ml-auto fade-in"
                        style={{ ["--delay"]: "0ms" }}
                    >
                        {currentProject.overview}
                    </p>
                )}
            </div>

            {projects.map((p, idx) => (
                <section
                    key={p.id}
                    ref={(el) => {
                        sectionRefs.current[idx] = el;
                    }}
                    data-project-index={idx}
                    className="relative min-h-[calc(100vh-6rem)] snap-start"
                >
                    {/* scroll anchor only */}
                </section>
            ))}

            <div className="fixed bottom-3 left-2 rounded-bl-3xl pt-3 pr-3 rounded-tr-3xl bg-black flex 
             before:absolute before:content-[''] before:w-10 before:h-10
          before:-top-10 before:left-0 before:rounded-bl-3xl
          before:shadow-[-0.5rem_0.8rem_black]
          
          after:absolute after:content-[''] after:w-10 after:h-10
          after:bottom-0 after:-right-10 after:rounded-bl-3xl
          after:shadow-[-0.5rem_0.8rem_black]
      corner-bl

            ">
                <div className="flex gap-20 items-center absolute -top-15 left-7">
                    <a
                        className="cursor-pointer hover:underline font-semibold fade-in [--delay:200ms] inline-flex items-center gap-1"
                        href={currentProject?.links?.demo || "#"}
                        target={currentProject?.links?.demo ? "_blank" : undefined}
                        rel={currentProject?.links?.demo ? "noreferrer" : undefined}
                        aria-disabled={!currentProject?.links?.demo}
                    >
                        LIVE <MdArrowOutward size={20} />
                    </a>
                    <a
                        className="cursor-pointer hover:underline font-semibold fade-in [--delay:400ms] inline-flex items-center gap-1"
                        href={currentProject?.links?.github || "#"}
                        target={currentProject?.links?.github ? "_blank" : undefined}
                        rel={currentProject?.links?.github ? "noreferrer" : undefined}
                        aria-disabled={!currentProject?.links?.github}
                    >
                        GITHUB <MdArrowOutward size={20} />
                    </a>

                    <span className="cursor-pointer hover:underline font-semibold fade-in [--delay:600ms]">TECH
                        <span className="flex gap-3">
                            {showReact && <FaReact size={20} />}
                            {showTailwind && <RiTailwindCssFill size={20} />}
                        </span>
                    </span>

                </div>
                {projectImage ? (
                    <img
                        src={projectImage}
                        alt={currentProject?.name ?? "Project preview"}
                        className="w-[50vw] h-auto rounded-2xl rounded-tl-3xl rounded-br-3xl fade-in"
                    />
                ) : (
                    <div className="w-[50vw] aspect-16/10 rounded-2xl rounded-tl-3xl rounded-br-3xl bg-white/5 border border-white/10" />
                )}
            </div>
        </div>
    );
}

export default Works;

