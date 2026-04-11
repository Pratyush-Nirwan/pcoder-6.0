import { useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import Spotlight from "./Spotlight";
import Grainient from "./Grainient";
import SpotifyRp from "./Spotify";

const routeOrder = ["/", "/about", "/works", "/guestbook"];

/** Matches Works.jsx / Tailwind `md` - on small screens Works has no inner scroll, so route swipe/wheel should apply. */
function isMobileViewport() {
    return typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
}

function isInteractiveTarget(node) {
    let current = node;
    if (current?.nodeType === Node.TEXT_NODE) current = current.parentElement;
    return !!(
        current &&
        typeof current.closest === "function" &&
        current.closest("a,button,input,textarea,select,[role='button']")
    );
}

/** True when the wheel should scroll nested content instead of changing routes. */
function wheelWouldScrollNestedScrollable(event) {
    let node = event.target;
    if (!node) return false;
    if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
    const deltaY = event.deltaY;
    if (!deltaY) return false;

    const epsilon = 1;

    while (node && node !== document.documentElement) {
        const style = window.getComputedStyle(node);
        const oy = style.overflowY;
        const scrollableY = oy === "auto" || oy === "scroll" || oy === "overlay";
        if (!scrollableY) {
            node = node.parentElement;
            continue;
        }

        const { scrollTop, scrollHeight, clientHeight } = node;
        if (scrollHeight <= clientHeight + epsilon) {
            node = node.parentElement;
            continue;
        }

        if (deltaY > 0 && scrollTop + clientHeight < scrollHeight - epsilon) return true;
        if (deltaY < 0 && scrollTop > epsilon) return true;

        node = node.parentElement;
    }

    return false;
}

/** First scrollable ancestor that can scroll vertically, or null. */
function findScrollableAncestorY(node) {
    if (!node) return null;
    if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
    while (node && node !== document.documentElement) {
        const style = window.getComputedStyle(node);
        const oy = style.overflowY;
        const scrollableY = oy === "auto" || oy === "scroll" || oy === "overlay";
        if (scrollableY && node.scrollHeight > node.clientHeight + 1) return node;
        node = node.parentElement;
    }
    return null;
}

function canExitWorksRoute(direction) {
    const root = document.getElementById("works-scroll-container");
    if (!root) return false;

    const { scrollTop, scrollHeight, clientHeight } = root;
    const tolerance = 100; // Increased tolerance for easier navigation

    if (direction < 0) {
        // Allow exit up when near the top
        return scrollTop <= tolerance;
    }

    if (direction > 0) {
        // Allow exit down when near the bottom
        return scrollTop + clientHeight >= scrollHeight - tolerance;
    }

    return false;
}

export default function Layout() {
    const location = useLocation();
    const navigate = useNavigate();
    const lastWheelNavAt = useRef(0);
    const lastTouchNavAt = useRef(0);
    const touchStartRef = useRef({ x: 0, y: 0, t: 0, ignored: false });
    const touchScrollRef = useRef({ el: null, scrollTop: 0 });
    const isAboutPage = location.pathname === "/about";
    const isWorkPage = location.pathname === "/works";

    useEffect(() => {
        const resetTouchGesture = (ignored = false) => {
            touchStartRef.current = { x: 0, y: 0, t: 0, ignored };
            touchScrollRef.current = { el: null, scrollTop: 0 };
        };

        resetTouchGesture();

        const onWheel = (event) => {
            const direction = Math.sign(event.deltaY);
            if (direction === 0) return;

            const isDesktopWorks = location.pathname === "/works" && !isMobileViewport();
            if (isDesktopWorks) {
                if (!canExitWorksRoute(direction)) return;
            } else if (wheelWouldScrollNestedScrollable(event)) {
                return;
            }

            const now = Date.now();
            if (now - lastWheelNavAt.current < 700) return;

            const currentIndex = routeOrder.indexOf(location.pathname);
            if (currentIndex === -1) return;

            const nextIndex = currentIndex + direction;
            if (nextIndex < 0 || nextIndex >= routeOrder.length) return;

            event.preventDefault();
            lastWheelNavAt.current = now;
            navigate(routeOrder[nextIndex]);
        };

        const onTouchStart = (event) => {
            resetTouchGesture();

            const target = event.target;
            if (isInteractiveTarget(target)) {
                resetTouchGesture(true);
                return;
            }

            if (!event.touches?.length) return;
            const t = event.touches[0];
            touchStartRef.current = { x: t.clientX, y: t.clientY, t: Date.now(), ignored: false };

            const scrollEl = findScrollableAncestorY(target);
            touchScrollRef.current = scrollEl
                ? { el: scrollEl, scrollTop: scrollEl.scrollTop }
                : { el: null, scrollTop: 0 };
        };

        const onTouchEnd = (event) => {
            try {
                if (!event.changedTouches?.length) return;

                const start = touchStartRef.current;
                if (!start?.t || start.ignored) return;

                if (isInteractiveTarget(event.target)) return;

                const t = event.changedTouches[0];
                const dx = t.clientX - start.x;
                const dy = t.clientY - start.y;
                const dt = Date.now() - start.t;

                const absDx = Math.abs(dx);
                const absDy = Math.abs(dy);

                // Ignore horizontal swipes.
                if (absDx > absDy * 1.2) return;

                const velocityY = dt > 0 ? absDy / dt : absDy;
                const isFastSwipe = velocityY > 0.5 && absDy > 20;
                const isLongSwipe = absDy > 70;

                if (!isFastSwipe && !isLongSwipe) return;

                const direction = -Math.sign(dy);
                if (direction === 0) return;

                const isDesktopWorks = location.pathname === "/works" && !isMobileViewport();
                if (isDesktopWorks) {
                    if (!canExitWorksRoute(direction)) return;
                } else {
                    const { el: scrollEl, scrollTop: startScrollTop } = touchScrollRef.current;
                    if (
                        scrollEl &&
                        Math.abs(scrollEl.scrollTop - startScrollTop) > 0.5
                    ) {
                        return;
                    }
                }

                const now = Date.now();
                if (now - lastTouchNavAt.current < 700) return;

                const currentIndex = routeOrder.indexOf(location.pathname);
                if (currentIndex === -1) return;

                const nextIndex = currentIndex + direction;
                if (nextIndex < 0 || nextIndex >= routeOrder.length) return;

                lastTouchNavAt.current = now;
                navigate(routeOrder[nextIndex]);
            } finally {
                resetTouchGesture();
            }
        };

        const onTouchMove = (event) => {
            const start = touchStartRef.current;
            if (!start?.t || start.ignored) return;

            const isMobileWorks = location.pathname === "/works" && isMobileViewport();
            if (!isMobileWorks || !event.touches?.length) return;

            const t = event.touches[0];
            const dx = t.clientX - start.x;
            const dy = t.clientY - start.y;
            const absDx = Math.abs(dx);
            const absDy = Math.abs(dy);

            if (absDy < 10) return;
            if (absDx > absDy * 1.2) return;

            event.preventDefault();
        };

        const onTouchCancel = () => {
            resetTouchGesture();
        };

        window.addEventListener("wheel", onWheel, { passive: false });
        window.addEventListener("touchstart", onTouchStart, { passive: true });
        window.addEventListener("touchmove", onTouchMove, { passive: false });
        window.addEventListener("touchend", onTouchEnd, { passive: true });
        window.addEventListener("touchcancel", onTouchCancel, { passive: true });
        return () => {
            window.removeEventListener("wheel", onWheel);
            window.removeEventListener("touchstart", onTouchStart);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onTouchEnd);
            window.removeEventListener("touchcancel", onTouchCancel);
        };
    }, [location.pathname, navigate]);

    return (
        <div
            className="fixed inset-0 pt-3 pb-3 pl-2 pr-2 bg-black rounded-3xl flex flex-col overflow-hidden"
            style={{ overscrollBehaviorY: "none" }}
        >
            <Spotlight />
            <NavBar />

            <div id="sandbox" className="relative flex w-full h-full rounded-3xl bg-black">
                <div
                    className={
                        isWorkPage
                            ? "hidden"
                            : isAboutPage
                                ? "fixed bottom-0 left-0 z-20 fade-in [--delay:1s] bg-black p-5 md:p-6.5 flex items-center justify-center rounded-tr-3xl\n             before:absolute \n             before:content-[''] \n             before:w-10 \n             before:h-10\n          before:-top-10\n          before:left-2 \n          before:rounded-bl-3xl\n          before:shadow-[-0.5rem_0.8rem_black] corner-bl\n          \n           after:absolute \n             after:content-[''] \n             after:w-10 \n            \n             after:h-10\n          after:bottom-2\n          after:-right-10 \n          after:rounded-bl-3xl\n          after:shadow-[-0.5rem_0.8rem_black] corafter\n            "
                                : "fixed bottom-7 left-8 z-20 fade-in [--delay:1s]"

                    }
                >
                    <SpotifyRp />
                </div>

                <div className="relative z-10 w-full h-full">
                    <Outlet />
                </div>

                <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl">
                    <Grainient
                        color1="#FF0AAC"
                        color2="#383838"
                        color3="#B19EEF"
                        timeSpeed={0.3}
                        colorBalance={0}
                        warpStrength={5}
                        warpFrequency={5}
                        warpSpeed={1}
                        warpAmplitude={50}
                        blendAngle={0}
                        blendSoftness={0.05}
                        rotationAmount={500}
                        noiseScale={2}
                        grainAmount={0.1}
                        grainScale={2}
                        grainAnimated={false}
                        contrast={1.5}
                        gamma={1}
                        saturation={1}
                        centerX={0}
                        centerY={0}
                        zoom={0.9}
                    />
                </div>
            </div>
        </div>
    );
}
