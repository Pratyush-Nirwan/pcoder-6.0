import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";

import { MdArrowOutward } from "react-icons/md";
import { FaReact } from "react-icons/fa";
import { RiTailwindCssFill } from "react-icons/ri";
import { PiMouseScroll } from "react-icons/pi";

import projectsData from "../../assets/Projects.json";
import savestride from "../../assets/save-stride.png";
import { worksState } from "../worksState";

const titleMotionTransitionDesktop = { type: "tween", duration: 0.5, ease: [0.33, 1, 0.68, 1] };
/** Shorter on small screens so tweens finish before the next snap / index change */
const titleMotionTransitionMobile = { type: "tween", duration: 0.32, ease: [0.4, 0, 0.2, 1] };

function Works() {
    const TITLE_ROW_PX = 56;

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
    worksState.totalProjects = projects.length;

    const containerRef = useRef(null);
    const sectionRefs = useRef([]);

    const [activeIndex, setActiveIndex] = useState(() => {
        const idx = projects.findIndex((p) => p.name.toLowerCase() === "save stride");
        return idx >= 0 ? idx : 0;
    });

    const activeIndexRef = useRef(activeIndex);
    useEffect(() => {
        activeIndexRef.current = activeIndex;
    }, [activeIndex]);

    const [isMobile, setIsMobile] = useState(() =>
        typeof window !== "undefined" ? window.matchMedia("(max-width: 767px)").matches : false
    );
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
        typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false
    );

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 767px)");
        const sync = () => setIsMobile(mq.matches);
        mq.addEventListener("change", sync);
        return () => mq.removeEventListener("change", sync);
    }, []);

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const sync = () => setPrefersReducedMotion(mq.matches);
        mq.addEventListener("change", sync);
        return () => mq.removeEventListener("change", sync);
    }, []);

    const titleTransition = useMemo(() => {
        if (prefersReducedMotion) return { type: "tween", duration: 0 };
        return isMobile ? titleMotionTransitionMobile : titleMotionTransitionDesktop;
    }, [isMobile, prefersReducedMotion]);

    const activeTitleScale = isMobile ? 1.75 : 2.35;

    const scrollToIndex = (idx) => {
        const el = sectionRefs.current[idx];
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    useEffect(() => {
        const root = containerRef.current;
        if (!root || !projects.length) return;

        /** Content-space math only — avoids N× getBoundingClientRect per frame on mobile */
        const computeBestIdx = () => {
            const center = root.scrollTop + root.clientHeight * 0.5;
            let bestIdx = 0;
            let bestDist = Infinity;
            sectionRefs.current.forEach((el, idx) => {
                if (!el) return;
                const mid = el.offsetTop + el.offsetHeight / 2;
                const d = Math.abs(mid - center);
                if (d < bestDist) {
                    bestDist = d;
                    bestIdx = idx;
                }
            });
            return bestIdx;
        };

        const commitIndex = (idx) => {
            if (idx === activeIndexRef.current) return;
            activeIndexRef.current = idx;
            worksState.activeIndex = idx;
            setActiveIndex(idx);
        };

        let rafId = 0;
        let throttleUntil = 0;
        const THROTTLE_MS = 110;

        const flushScroll = () => {
            if (rafId) return;
            rafId = requestAnimationFrame(() => {
                rafId = 0;
                const bestIdx = computeBestIdx();
                const now = Date.now();
                if (bestIdx !== activeIndexRef.current && now >= throttleUntil) {
                    throttleUntil = now + THROTTLE_MS;
                    commitIndex(bestIdx);
                }
            });
        };

        const onScrollEnd = () => {
            throttleUntil = 0;
            commitIndex(computeBestIdx());
        };

        let idleTimer = null;
        const onScroll = () => {
            flushScroll();
            clearTimeout(idleTimer);
            idleTimer = setTimeout(onScrollEnd, 140);
        };

        commitIndex(computeBestIdx());

        root.addEventListener("scroll", onScroll, { passive: true });
        root.addEventListener("scrollend", onScrollEnd);
        window.addEventListener("resize", onScrollEnd);

        const ro = new ResizeObserver(onScrollEnd);
        ro.observe(root);

        return () => {
            root.removeEventListener("scroll", onScroll);
            root.removeEventListener("scrollend", onScrollEnd);
            window.removeEventListener("resize", onScrollEnd);
            ro.disconnect();
            clearTimeout(idleTimer);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [projects.length]);

    const currentProject = projects[activeIndex] ?? null;

    const projectImage = currentProject?.name?.toLowerCase() === "save stride" ? savestride : null;
    const techLower = (currentProject?.tech_stack ?? "").toLowerCase();
    const showReact = techLower.includes("react");
    const showTailwind = techLower.includes("tailwind");
    const reelItems = useMemo(() => [null, ...projects, null], [projects]);

    return (
        <div
            id="works-scroll-container"
            ref={containerRef}
            className="relative z-10 w-full h-full pt-24 overflow-y-auto no-scrollbar snap-y snap-mandatory"
        >
            <div className="fixed flex top-[11vh] flex-col items-center left-1/2 -translate-x-1/2 fade-in">
                <h1 className="ND text-4xl opacity-70 -translate-x-1 hidden md:inline">Scroll</h1>
                <PiMouseScroll size={30} className="opacity-70 animate-bounce" />
            </div>
            <div className="fixed md:right-12 top-40 md:top-28 text-right fade-in p-3 md:p-0">
                <div className="relative overflow-visible" style={{ height: TITLE_ROW_PX * 3 }}>
                    <motion.div
                        className="flex flex-col will-change-transform transform-gpu items-center md:items-end gap-0"
                        initial={false}
                        animate={{ y: -activeIndex * TITLE_ROW_PX }}
                        transition={titleTransition}
                    >
                        {reelItems.map((p, reelIdx) => {
                            const idx = reelIdx - 1;
                            const isSpacer = !p;
                            const isActive = !isSpacer && idx === activeIndex;
                            const isNeighbor = !isSpacer && Math.abs(idx - activeIndex) === 1;

                            return (
                                <div
                                    key={p?.id ?? `spacer-${reelIdx}`}
                                    className="h-14 flex items-center justify-end overflow-visible g"
                                >
                                    <motion.button
                                        type="button"
                                        initial={false}
                                        animate={{
                                            scale: isActive ? activeTitleScale : 1,
                                            opacity: isSpacer ? 0 : isActive ? 1 : isNeighbor ? 0.8 : 0,
                                        }}
                                        whileHover={isNeighbor && !prefersReducedMotion ? { opacity: 1 } : undefined}
                                        transition={titleTransition}
                                        onClick={() => !isSpacer && scrollToIndex(idx)}
                                        className={[
                                            "SG inline-block whitespace-nowrap transform-gpu origin-center md:origin-right",
                                            isActive
                                                ? "font-extrabold text-white text-xl md:text-3xl"
                                                : isNeighbor
                                                    ? "font-bold text-2xl md:text-3xl bg-linear-to-t from-white/0 to-white text-transparent bg-clip-text"
                                                    : "font-bold text-2xl md:text-3xl pointer-events-none",
                                        ].join(" ")}
                                    >
                                        {p?.name ?? ""}
                                    </motion.button>
                                </div>
                            );
                        })}
                    </motion.div>
                </div>

                {!!currentProject?.overview && (
                    <p
                        key={currentProject.id}
                        className="SG text-white/70 text-md md:text-xl mt-10 max-w-lg ml-auto fade-in text-left"
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
                </section>
            ))}

            <div className="fixed top-0 md:top-auto left-0 md:bottom-3 md:left-2 md:rounded-bl-3xl pl-2 md:pl-0 pb-3 md:pb-0 pt-3 pr-2 md:pr-3 rounded-tr-3xl bg-black flex
            
            before:absolute before:content-[''] before:w-10 before:h-10
          before:-bottom-10 md:before:bottom-auto md:before:-top-10 before:right-2 md:right-auto md:before:left-0 before:rounded-tr-3xl md:before:rounded-bl-3xl
          before:shadow-[0.5rem_-0.8rem_black]
          md:before:shadow-[-0.5rem_0.8rem_black]
          
      
          after:absolute after:content-[''] after:w-10 after:h-10
          after:-bottom-10 md:after:bottom-0 after:left-2 md:after:left-auto md:after:-right-10 after:rounded-tl-3xl md:after:rounded-bl-3xl
          after:shadow-[-0.5rem_-0.8rem_black]
          md:after:shadow-[-0.5rem_0.8rem_black]
      corner-bl
            ">
                <div className="flex gap-20 items-center absolute -top-15 md:left-7">
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
                        className="md:w-[50vw] h-auto rounded-3xl rounded-tl-3xl rounded-br-3xl fade-in"
                    />
                ) : (
                    <div className="w-[50vw] aspect-16/10 rounded-2xl rounded-tl-3xl rounded-br-3xl bg-white/5 border border-white/10" />
                )}
            </div>
        </div>
    );
}

export default Works;