import { useEffect, useRef } from "react";

/* ===============================
   MAIN SPOTLIGHT (GLOBAL TRACKER)
   =============================== */

function Spotlight({ radius = 500 }) {
    useEffect(() => {
        const handleMove = (e) => {
            const x = e.clientX;
            const y = e.clientY;

            document.documentElement.style.setProperty("--spot-x", `${x}px`);
            document.documentElement.style.setProperty("--spot-y", `${y}px`);
        };

        const handleTouchMove = (e) => handleMove(e.touches[0]);

        document.documentElement.style.setProperty("--spot-r", `${radius}px`);

        window.addEventListener("mousemove", handleMove);
        window.addEventListener("touchmove", handleTouchMove);

        return () => {
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("touchmove", handleTouchMove);
        };
    }, [radius]);

    return null; // renders nothing
}

/* ===============================
   SPOTLIGHT TARGET (SAFE MASK)
   =============================== */

Spotlight.Target = function SpotlightTarget({
    children,
    className = "",
    mode = "overlay",
}) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const handleMove = (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            el.style.setProperty("--spot-x", `${x}px`);
            el.style.setProperty("--spot-y", `${y}px`);
        };

        const handleTouchMove = (e) => handleMove(e.touches[0]);

        window.addEventListener("mousemove", handleMove);
        window.addEventListener("touchmove", handleTouchMove);

        return () => {
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("touchmove", handleTouchMove);
        };
    }, []);

    return (
        <div
            ref={ref}
            className={
                mode === "inline"
                    ? `spotlight ${className}`
                    : `spotlight absolute inset-0 z-20 flex items-center justify-center ${className}`
            }
        >
            {children}
        </div>
    );
};

export default Spotlight;
