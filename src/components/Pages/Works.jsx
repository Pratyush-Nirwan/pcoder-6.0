import { useEffect, useState } from "react";

const sampleProjects = [
    {
        id: 1,
        title: "Project Aurora",
        desc: "A visual experiment with shaders and particles.",
        image: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=1",
    },
    {
        id: 2,
        title: "Type Grid",
        desc: "Interactive typography playground.",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=2",
    },
    {
        id: 3,
        title: "SoundWave",
        desc: "Generative music visualizer.",
        image: "https://images.unsplash.com/photo-1505575967452-1b3b1b1a97b9?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=3",
    },
    {
        id: 4,
        title: "Glass UI",
        desc: "UI component experiments with frosted glass effects.",
        image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=4",
    },
    {
        id: 5,
        title: "Pixel Blast",
        desc: "Retro pixel effects and transitions.",
        image: "https://images.unsplash.com/photo-1509506481526-3ea0e9d6f2c4?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=5",
    },
    {
        id: 6,
        title: "Orbital Map",
        desc: "Data visualization with orbital layouts.",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=6",
    },
];

function randSpan(max) {
    return Math.floor(Math.random() * max) + 1; // 1..max
}

function Works() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        // assign each project random col/row spans to create varied cell sizes
        const assigned = sampleProjects.map((p) => ({
            ...p,
            colSpan: randSpan(3),
            rowSpan: randSpan(2) + 0, // 1..2
        }));
        setProjects(assigned);
    }, []);

    return (
        <div className="relative z-10 flex flex-col w-full h-full pt-24 gap-6 pl-10 pr-10 overflow-auto no-scrollbar">
            <h1 className="SG font-extrabold text-5xl origin-left text-white">Works</h1>

            <div className="z-10 flex flex-row gap-5 pb-2">
                <span className="inline-flex overflow-hidden rounded-full bg-white/10 backdrop-blur-sm px-3 py-1 text-sm font-medium text-white/90">FUN</span>
                <span className="inline-flex overflow-hidden rounded-full bg-white/10 backdrop-blur-sm px-3 py-1 text-sm font-medium text-white/90">FREELANCE</span>
                <span className="inline-flex overflow-hidden rounded-full bg-white/10 backdrop-blur-sm px-3 py-1 text-sm font-medium text-white/90">UTILITY</span>
                <span className="inline-flex overflow-hidden rounded-full bg-white/10 backdrop-blur-sm px-3 py-1 text-sm font-medium text-white/90">MISC</span>
            </div>

            <div className="grid grid-cols-6 gap-4 auto-rows-[140px] grid-flow-dense pb-10">
                {projects.map((proj) => (
                    <div
                        key={proj.id}
                        className="relative rounded-xl overflow-hidden shadow-lg bg-white/10"
                        style={{
                            gridColumnEnd: `span ${proj.colSpan}`,
                            gridRowEnd: `span ${proj.rowSpan}`,
                        }}
                    >
                        <img
                            src={proj.image}
                            alt={proj.title}
                            className="w-full h-full object-cover"
                        />

                        <div className="absolute left-0 right-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white">
                            <h3 className="font-semibold">{proj.title}</h3>
                            <p className="text-sm opacity-90">{proj.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Works;

