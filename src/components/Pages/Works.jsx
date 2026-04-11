import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

import { MdArrowOutward } from "react-icons/md";
import { FaReact, FaHtml5, FaCss3Alt } from "react-icons/fa";
import { SiJavascript, SiTailwindcss, SiVite } from "react-icons/si";
import { AiOutlineApi } from "react-icons/ai";
import { PiMouseScroll } from "react-icons/pi";

import projectsData from "../../assets/Projects.json";
import { worksState } from "../worksState";

// Dynamically import all project images
const imageModules = import.meta.glob('../../assets/project-photos/*.webp', { as: 'url', eager: true });

const titleMotionTransitionDesktop = { type: "tween", duration: 0.5, ease: [0.33, 1, 0.68, 1] };
void motion;

function Works() {
    const TITLE_ROW_PX = 56;

    const projects = useMemo(
        () =>
            (projectsData ?? []).map((p, idx) => ({
                id: idx,
                name: p?.name ?? `Project ${idx + 1}`,
                overview: p?.overview ?? "",
                tech_stack: (p?.tech_stack ?? "")
                    .split(",")
                    .map((stack) => stack.trim())
                    .filter(Boolean),
                image: p?.image ?? "",
                links: {
                    github: p?.links?.github ?? "",
                    demo: p?.links?.demo ?? "",
                },
            })),
        []
    );

    const techIconMap = {
        react: FaReact,
        javascript: SiJavascript,
        js: SiJavascript,
        html5: FaHtml5,
        html: FaHtml5,
        css3: FaCss3Alt,
        css: FaCss3Alt,
        "tailwind css": SiTailwindcss,
        tailwind: SiTailwindcss,
        vite: SiVite,
        api: AiOutlineApi,
        "weather api": AiOutlineApi,
        "advice slip api": AiOutlineApi,
    };

    const getTechIcons = (stackArray, size = 18) =>
        stackArray?.map((tech, idx) => {
            const Icon = techIconMap[tech.toLowerCase()];
            if (!Icon) return null;
            return <Icon key={`${tech}-${idx}`} size={size} title={tech} className="text-white/80" />;
        });

    const containerRef = useRef(null);
    const sectionRefs = useRef([]);

    // --- DESKTOP STATE ---
    const [activeIndex, setActiveIndex] = useState(() => {
        const idx = projects.findIndex((p) => p.name.toLowerCase() === "save stride");
        return idx >= 0 ? idx : 0;
    });
    const activeIndexRef = useRef(activeIndex);

    // --- MOBILE STATE (TOTALLY INDEPENDENT) ---
    const [mobileIndex, setMobileIndex] = useState(0);

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

    // --- ORIGINAL DESKTOP LOGIC (UNTOUCHED BUT CONDITIONAL) ---
    useEffect(() => {
        if (isMobile) return; // Prevent desktop logic from running on mobile

        const root = containerRef.current;
        if (!root || !projects.length) return;

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
    }, [projects.length, isMobile]);

    // --- MOBILE NAVIGATION LOGIC (INDEPENDENT) ---
    const navigateMobile = (direction) => {
        setMobileIndex((prev) => {
            const next = direction === "next"
                ? Math.min(prev + 1, projects.length - 1)
                : Math.max(prev - 1, 0);
            worksState.activeIndex = next;
            return next;
        });
    };

    const scrollToIndex = (idx) => {
        if (isMobile) return; // Desktop only function
        const root = containerRef.current;
        const el = sectionRefs.current[idx];
        if (!root || !el) return;
        const top = el.offsetTop;
        root.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
    };

    // Determine which project data to show based on view
    const currentProject = isMobile ? projects[mobileIndex] : projects[activeIndex];
    const projectImage = currentProject?.image
        ? imageModules[`../../assets/project-photos/${currentProject.image}`]
        : null;
    const reelItems = useMemo(() => [null, ...projects, null], [projects]);

    return (
        <div
            id="works-scroll-container"
            ref={containerRef}
            className="relative z-10 w-full h-full pt-24 overflow-y-hidden md:overflow-y-auto no-scrollbar md:snap-y md:snap-mandatory"
            style={{ touchAction: isMobile ? "pan-x" : "auto" }}
        >



            {/* Scroll Indicator (Desktop Only) */}
            <div className="fixed  top-[11vh] flex-col items-center left-1/2 -translate-x-1/2 fade-in hidden md:flex">
                <h1 className="ND text-4xl opacity-70 -translate-x-1">Scroll</h1>
                <PiMouseScroll size={30} className="opacity-70 animate-bounce" />
            </div>

            <div className="fixed z-50 md:z-auto md:right-12 left-1/2 -translate-x-1/2  md:translate-x-0 top-40 md:top-28 text-right fade-in p-3 md:p-0 w-full md:w-auto">
                {/* --- DESKTOP TITLE REEL --- */}
                <div className="relative overflow-visible hidden md:block" style={{ height: TITLE_ROW_PX * 3 }}>
                    <motion.div
                        className="flex flex-col items-end gap-0 transform-gpu"
                        animate={{ y: -activeIndex * TITLE_ROW_PX }}
                        transition={titleMotionTransitionDesktop}
                    >
                        {reelItems.map((p, reelIdx) => {
                            const idx = reelIdx - 1;
                            const isActive = p && idx === activeIndex;
                            const isNeighbor = p && Math.abs(idx - activeIndex) === 1;
                            return (
                                <div key={p?.id ?? `spacer-${reelIdx}`} className="h-14 flex items-center justify-end overflow-visible">
                                    <motion.button
                                        animate={{ scale: isActive ? 2.35 : 1, opacity: isActive ? 1 : isNeighbor ? 0.8 : 0 }}
                                        onClick={() => p && scrollToIndex(idx)}
                                        className={`SG inline-block transform-gpu origin-right font-bold text-2xl md:text-3xl ${isActive ? "text-white" : "text-transparent bg-clip-text bg-linear-to-t from-white/0 to-white"}`}
                                    >
                                        {p?.name ?? ""}
                                    </motion.button>
                                </div>
                            );
                        })}
                    </motion.div>
                </div>

                {/* --- MOBILE TITLE SWITCHER (INDEPENDENT) --- */}
                <div className="md:hidden SG mt-20 flex items-center justify-between px-4 bg-black/50 backdrop-blur-sm rounded-full py-1 border border-white/10">
                    <button onClick={() => navigateMobile("prev")} className="text-white text-3xl px-3">←</button>
                    <AnimatePresence mode="wait">
                        <motion.h2
                            key={mobileIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="text-white text-xl font-bold text-center min-w-"
                        >
                            {projects[mobileIndex]?.name}
                        </motion.h2>
                    </AnimatePresence>
                    <button onClick={() => navigateMobile("next")} className="text-white text-3xl px-3">→</button>
                </div>

                {/* Overview Text */}
                {!!currentProject?.overview && (
                    <p className="SG text-white/70 text-md md:text-xl mt-5 max-w-lg ml-auto fade-in text-left px-4 md:px-0">
                        {currentProject.overview}
                    </p>
                )}
            </div>

            {/* Desktop Scroll Sections */}
            {!isMobile && projects.map((p, idx) => (
                <section
                    key={p.id}
                    ref={(el) => (sectionRefs.current[idx] = el)}
                    data-works-section
                    className="relative min-h-[calc(100vh-6rem)] snap-start"
                />
            ))}

            {/* Mobile Footer Links */}
            <div className="md:hidden fixed bottom-10 left-0 w-full flex justify-around items-center px-4 z-50">
                <a className="font-bold text-xs flex items-center gap-1 fade-in [--delay:200ms]" href={currentProject?.links?.demo}>LIVE <MdArrowOutward /></a>
                <a className="font-bold text-xs flex items-center gap-1 fade-in" href={currentProject?.links?.github}>GITHUB <MdArrowOutward /></a>
                <div className="flex gap-2">
                    {getTechIcons(currentProject?.tech_stack, 18)}
                </div>
            </div>

            {/* Image Preview Box */}
            <div className="fixed z-20 md:z-auto top-0 md:top-auto left-1/2 w-[97vw] md:w-auto md:bottom-3 md:left-2 md:rounded-tr-3xl md:rounded-bl-3xl pl-0 pt-3 pb-3 md:pb-0 pr-0 md:pr-3 bg-black flex corner-bl -translate-x-1/2 md:translate-x-0
            
            before:w-9 
            before:h-9 
            before:absolute 
            before:content-['']
            before:bg-transparent
            before:-bottom-9 
            before:left-0.5
            before:rounded-tl-3xl
            before:shadow-[-0.5rem_-0.8rem_black]

            md:before:w-9 
            md:before:h-9 
            md:before:absolute 
            md:before:content-['']
            md:before:bg-transparent 
            md:before:-top-9 
            md:before:left-0
            md:before:rounded-bl-3xl
            md:before:shadow-[-0.5rem_0.8rem_black]

            after:w-9 
            after:h-9 
            after:absolute 
            after:content-['']
            after:bg-transparent
            after:-bottom-9 
            after:right-0.5
            after:rounded-tr-3xl
            after:shadow-[0.5rem_-0.8rem_black]

            md:after:w-9 
            md:after:h-9 
            md:after:absolute 
            md:after:content-['']
            md:after:bg-transparent 
            md:after:bottom-0 
            md:after:-right-9
            md:after:rounded-bl-3xl
            md:after:shadow-[-0.5rem_0.8rem_black]
            ">
                <div className="hidden md:absolute -top-10 left-0 w-full md:flex justify-between items-center px-4 z-50">
                    <div className="flex flex-row gap-10">
                        <a className="font-bold text-lg flex items-center gap-1 fade-in [--delay:200ms]" href={currentProject?.links?.demo}>LIVE <MdArrowOutward /></a>
                        <a className="font-bold text-lg flex items-center gap-1 fade-in [--delay:400ms]" href={currentProject?.links?.github}>GITHUB <MdArrowOutward /></a>
                    </div>
                    <div className="flex gap-2 text-lg fade-in [--delay:800ms]">
                        {getTechIcons(currentProject?.tech_stack, 25)}
                    </div>
                </div>
                {projectImage ? (
                    <motion.img
                        key={currentProject.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        src={projectImage}
                        alt="preview"
                        loading="lazy"
                        className="w-full md:w-[50vw] h-auto rounded-3xl z-20"
                    />
                ) : (
                    <div className="w-[90vw] md:w-[50vw] aspect-video rounded-3xl bg-white/5 border border-white/10" />
                )}
            </div>
        </div>
    );
}

export default Works;
