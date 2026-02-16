function Arrow() {
    return (
        <svg
            viewBox="0 0 800 800"
            xmlns="http://www.w3.org/2000/svg"
            className="w-32 h-32 text-white/70 z-20 opacity-70"
            fill="none"
        >
            <defs>
                <marker
                    id="arrowhead"
                    markerWidth="7"
                    markerHeight="7"
                    refX="3.5"
                    refY="3.5"
                    orient="auto"
                    viewBox="0 0 7 7"
                >
                    <polyline
                        className="arrow-head"
                        points="0,3.5 3.5,1.75 0,0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        transform="translate(1.17 1.75)"
                    />
                </marker>
            </defs>

            <path
                className="arrow-path"
                d="M250 250 Q450 350 400 400 Q294 533 550 550"
                stroke="currentColor"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
                markerEnd="url(#arrowhead)"
            />
        </svg>
    );
}

export default Arrow;
