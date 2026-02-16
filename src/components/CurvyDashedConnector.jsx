import { useEffect, useRef, useState } from "react";

function edgePoint(from, to) {
    const fx = from.left + from.width / 2;
    const fy = from.top + from.height / 2;
    const tx = to.left + to.width / 2;
    const ty = to.top + to.height / 2;

    if (Math.abs(tx - fx) > Math.abs(ty - fy)) {
        return {
            x: tx > fx ? from.right : from.left,
            y: fy,
        };
    }

    return {
        x: fx,
        y: ty > fy ? from.bottom : from.top,
    };
}

export default function CurvyDashedConnector({
    containerRef, // optional now
    fromRef,
    toRef,
    strokeWidth = 2,
    dash = "6 6",
    color = "#fff",
}) {
    const svgRef = useRef(null);
    const [path, setPath] = useState("");
    const [size, setSize] = useState({ w: 0, h: 0 });

    const update = () => {
        if (!fromRef?.current || !toRef?.current || !svgRef.current) return;

        const container =
            containerRef?.current || svgRef.current.parentElement;
        if (!container) return;

        const c = container.getBoundingClientRect();
        const from = fromRef.current.getBoundingClientRect();
        const to = toRef.current.getBoundingClientRect();

        setSize({ w: c.width, h: c.height });

        const p1 = edgePoint(from, to);
        const p2 = edgePoint(to, from);

        const x1 = p1.x - c.left;
        const y1 = p1.y - c.top;
        const x2 = p2.x - c.left;
        const y2 = p2.y - c.top;

        const dx = Math.abs(x2 - x1);
        const curve = dx * 0.35;

        setPath(
            `M ${x1} ${y1}
       C ${x1 + curve} ${y1},
         ${x2 - curve} ${y2},
         ${x2} ${y2}`
        );
    };

    useEffect(() => {
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    return (
        <svg
            ref={svgRef}
            width={size.w}
            height={size.h}
            viewBox={`0 0 ${size.w} ${size.h}`}
            className="absolute inset-0 pointer-events-none"
        >
            <path
                d={path}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeDasharray={dash}
                strokeLinecap="round"
            />
        </svg>
    );
}
