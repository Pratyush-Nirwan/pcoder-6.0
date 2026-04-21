import Arrow from "./Arrow";
import Spotlight from "../Spotlight";
import { MdOutlineSwipeVertical } from "react-icons/md";
import { Helmet } from 'react-helmet-async';

function Home() {
    return (
        <>
            <Helmet>
                <title>Pratyush Nirwan | Full-Stack Developer</title>
                <meta name="description" content="Welcome to Pratyush Nirwan's portfolio. Full-Stack Developer specializing in React, Node.js, and modern web technologies. Explore my work and get in touch." />
                <meta name="keywords" content="Pratyush Nirwan, Full-Stack Developer, React, Node.js, Portfolio, Web Development" />
                <meta property="og:title" content="Pratyush Nirwan | Full-Stack Developer" />
                <meta property="og:description" content="Designing & building expressive web interfaces. Explore my portfolio and projects." />
                <meta property="og:url" content="https://pratyushnirwan.dev/" />
                <meta property="og:type" content="website" />
                <link rel="canonical" href="https://pratyushnirwan.dev/" />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Person",
                        "name": "Pratyush Nirwan",
                        "jobTitle": "Full-Stack Developer",
                        "url": "https://pratyushnirwan.dev",
                        "sameAs": [
                            "https://github.com/pratyush-nirwan",
                            "https://www.linkedin.com/in/pratyush-nirwan/"
                        ],
                        "knowsAbout": [
                            "JavaScript",
                            "React",
                            "Node.js",
                            "MongoDB",
                            "Supabase",
                            "Tailwind CSS",
                            "Web Development"
                        ],
                        "alumniOf": {
                            "@type": "EducationalOrganization",
                            "name": "YCCE, Nagpur"
                        }
                    })}
                </script>
            </Helmet>
            <Spotlight />
            <div className="relative z-10 flex flex-col mt-[10vh] md:mt-0 md:justify-center gap-2  p-5 md:pl-10 h-full">
                <Spotlight.Target mode="inline" className="w-fit">
                    <pre className="ND hidden md:block">
                        <code className="font-inherit">{`<h1>`}</code>
                    </pre>
                </Spotlight.Target>

                <h1 className="SG font-extrabold text-6xl md:text-7xl origin-left fade-in text-center md:text-left">
                    Pratyush Nirwan
                </h1>
                <Spotlight.Target mode="inline" className="w-fit">
                    <pre className="ND hidden md:block">
                        <code className="font-inherit">{`</h1>`}</code>
                    </pre>
                </Spotlight.Target>
                <Spotlight.Target mode="inline" className="w-fit">
                    <pre className="ND hidden md:block">
                        <code className="font-inherit">{`<h2>`}</code>
                    </pre>
                </Spotlight.Target>
                <h2 className="SG font-medium md:text-4xl  origin-left fade-in [--delay:100ms] text-white/70 text-center md:text-left">
                    Designing & building expressive web interfaces
                </h2>
                <Spotlight.Target mode="inline" className="w-fit">
                    <pre className="ND hidden md:block">
                        <code className="font-inherit">{`</h2>`}</code>
                    </pre>
                </Spotlight.Target>
            </div>

            <div className="fixed left-1/2 bottom-50 SG font-extrabold -translate-x-1/2 flex flex-col items-center gap-5 fade-in [--delay:1000ms] md:hidden">
                <MdOutlineSwipeVertical size={40} className="animate-bounce opacity-50" />
            </div>
            <div className="absolute bottom-0 right-0 z-10">
                <div className="relative">
                    <div className="absolute bottom-full right-4 mb-3 flex flex-col items-end gap-0 pointer-events-none md:hidden">
                        <p className="ND text-md text-nowrap -rotate-12 fade-in [--delay:200ms] -translate-x-3 translate-y-12">Lets Work Together</p>
                        <Arrow className="h-20 w-20 -translate-x-20 translate-y-5 rotate-20 text-white/70 opacity-70 fade-in [--delay:300ms] [clip-path:inset(50%_0_0_0)]" />
                    </div>

                    <div className="bg-black p-5 rounded-tl-3xl
          before:absolute before:content-[''] before:w-10 before:h-10
          before:bottom-0 before:-left-10 before:rounded-br-3xl
          before:shadow-[0.5rem_0.8rem_black]

          after:absolute after:content-[''] after:w-10 after:h-10
          after:-top-10 after:right-0 after:rounded-br-3xl
          after:shadow-[0.5rem_0.8rem_black] corner-br
        "
                    >
                        <h2
                            role="button"
                            tabIndex={0}
                            onClick={() => (window.location.href = "mailto:pratyushnirwan123@gmail.com?subject=Hiring%20Inquiry&body=Hi%20Pratyush%2C%0A%0AI%20would%20like%20to%20discuss%20an%20oppurtunity.")}

                            className="SG text-2xl text-white/60 transition-all hover:text-white cursor-pointer">Hire Me</h2>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-5 right-27 z-20 hidden pointer-events-none md:flex">
                <p className="ND absolute text-2xl text-nowrap -translate-x-30 translate-y-10 -rotate-20 fade-in [--delay:200ms]">Lets Work Together</p>
                <Arrow className=" h-32 w-32 text-white/70 opacity-70" />
            </div>
        </>
    );
}

export default Home;
