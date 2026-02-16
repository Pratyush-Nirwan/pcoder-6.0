import { useRef } from 'react';
import LogoLoop from '../LogoLoop';
import Spotlight from '../Spotlight';
import {
    IoLogoJavascript,
    IoLogoHtml5,
    IoLogoCss3,
    IoLogoReact,
    IoLogoNodejs,
    IoLogoGithub,
    IoLogoVercel,
    IoLogoNpm,
} from "react-icons/io5";

import { GoDotFill } from "react-icons/go";
import { SiMongodb, SiPostman, SiFigma, SiAdobeillustrator, SiAdobeaftereffects, SiCanva } from "react-icons/si";
import { FaGitSquare } from "react-icons/fa";
import { BiLogoVisualStudio } from "react-icons/bi";
import { Connect } from 'react-connect-lines';

const techLogos = [
    { node: <IoLogoJavascript />, title: "JavaScript", href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
    { node: <IoLogoHtml5 />, title: "HTML5", href: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
    { node: <IoLogoCss3 />, title: "CSS3", href: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
    { node: <IoLogoReact />, title: "React", href: "https://react.dev" },
    { node: <IoLogoNodejs />, title: "Node.js", href: "https://nodejs.org" },
    { node: <SiMongodb />, title: "MongoDB", href: "https://www.mongodb.com" },
    { node: <FaGitSquare />, title: "Git", href: "https://git-scm.com" },
    { node: <IoLogoGithub />, title: "GitHub", href: "https://github.com" },
    { node: <BiLogoVisualStudio />, title: "VS Code", href: "https://code.visualstudio.com" },
    { node: <IoLogoVercel />, title: "Vercel", href: "https://vercel.com" },
    { node: <IoLogoNpm />, title: "npm", href: "https://www.npmjs.com" },
    { node: <SiPostman />, title: "Postman", href: "https://www.postman.com" },
    { node: <SiFigma />, title: "Figma", href: "https://www.figma.com" },
    { node: <SiAdobeillustrator />, title: "Adobe Illustrator", href: "https://www.adobe.com/products/illustrator.html" },
    { node: <SiAdobeaftereffects />, title: "After Effects", href: "https://www.adobe.com/products/aftereffects.html" },
    { node: <SiCanva />, title: "Canva", href: "https://www.canva.com" },
];

const timelineData = [
    { year: "Now", text: "Building production-grade projects & open to collaborations" },
    { year: "2025", text: "Focused on UX, performance, animations, real-world polish" },
    { year: "2024", text: "Built React apps (Weather Wise, UI redesigns)" },
    { year: "2023", text: "Started with HTML, CSS, JavaScript" },
];


function About() {
    const delay =
        timelineData.length * 500

    return (

        <div className="relative z-10 flex flex-col w-full h-full pt-24 gap-6 pl-10 pr-10 overflow-auto no-scrollbar">


            {/* TIMELINE */}
            <div className="fixed right-10 top-[50%] -translate-y-1/2 flex flex-col">
                {
                    timelineData.map((item, index) => (
                        <div
                            key={index}
                            className="mb-20 transition-transform duration-300 "
                            style={{ transform: `translateX(-${index * 10}em)` }}
                        >
                            <div className="flex items-start ">
                                {/* DOT (no fade-in) */}
                                <Connect
                                    id={index}
                                    connectWith={
                                        index === 0
                                            ? []
                                            : [
                                                {
                                                    id: index - 1,
                                                    color: "white",
                                                    stroke: "solid",
                                                    className: "line-draw",
                                                },
                                            ]
                                    }
                                >
                                    <span className="text-xl leading-none">
                                        <GoDotFill />
                                    </span>
                                </Connect>

                                {/* TEXT ONLY fades in */}
                                <span
                                    className="ml-2 translate-y-3">
                                    <span className="text-white/60 ND text-2xl block fade-in"
                                        style={{
                                            animationDelay: `${(timelineData.length - 1 - index) * 200}ms`
                                        }}>
                                        {item.year}
                                    </span>
                                    <span className="font-bold SG block fade-in"
                                        style={{
                                            animationDelay: `${(timelineData.length - 1 - index) * 300}ms`
                                        }}>
                                        {item.text}
                                    </span>
                                </span>
                            </div>
                        </div>
                    ))}
            </div>


            <Spotlight />
            <Spotlight.Target mode="inline" className="w-fit">
                <pre className="ND">
                    <code className="font-inherit">{`<h1>`}</code>
                </pre>
            </Spotlight.Target>
            <h1 className="SG font-extrabold text-5xl origin-left text-white fade-in">Pratyush Nirwan</h1>
            <p className='SG fade-in [--delay:100ms]'>
                I build things at the intersection of code, design, and curiosity. <br />
                Music on repeat, hands on the keyboard, always learning by doing. <br />
                BTech Computer Technology @ YCCE, Nagpur. <br />
                Got an idea? I’d love to work on it with you.
                <br /> <br />
                Radhe Radhe 🤍
            </p>
            <Spotlight.Target mode="inline" className="w-fit">
                <pre className="ND">
                    <code className="font-inherit">{`</h1>`}</code>
                </pre>
            </Spotlight.Target>
            <div className="absolute bottom-1 left-0 w-full z-0 fade-in [--delay:500ms]">
                <div className="relative will-change-transform transform-gpu">
                    <LogoLoop
                        logos={techLogos}
                        speed={40}
                        direction="left"
                        logoHeight={40}
                        gap={60}
                        hoverSpeed={0}
                        scaleOnHover
                        fadeOut={false}
                        ariaLabel="Skills"
                        className="opacity-90"
                    />
                </div>
            </div>
            <div className='fixed top-20 right-0'>

            </div>
            <div
                className="absolute bottom-0 right-0 z-10 bg-black p-5 rounded-tl-3xl
          before:absolute before:content-[''] before:w-10 before:h-10
          before:bottom-0 before:-left-10 before:rounded-br-3xl
          before:shadow-[0.5rem_0.8rem_black]

          after:absolute after:content-[''] after:w-10 after:h-10
          after:-top-10 after:right-0 after:rounded-br-3xl
          after:shadow-[0.5rem_0.8rem_black] corner-br
        "
            >
                <h2 className="SG text-xl">
                    <div className="grid grid-cols-[auto_1fr] gap-x-10 gap-y-3">
                        <span className="font-bold">Email</span>
                        <a
                            href="mailto:pratyushnirwan@gmail.com"
                            className="ND text-white/60 text-right hover:text-white transition-all"
                        >
                            pratyushnirwan@gmail.com
                        </a>

                        <span className="font-bold">LinkedIn</span>
                        <a
                            href="https://www.linkedin.com/in/pratyush-nirwan/"
                            target="_blank"
                            rel="noreferrer"
                            className="ND text-white/60 text-right hover:text-white transition-all"
                        >
                            linkedin.com/in/pratyush-nirwan
                        </a>

                        <span className="font-bold">GitHub</span>
                        <a
                            href="https://github.com/pratyush-nirwan"
                            target="_blank"
                            rel="noreferrer"
                            className="ND text-white/60 text-right hover:text-white transition-all"
                        >
                            github.com/pratyush-nirwan
                        </a>
                        <span className="font-bold">Resume</span>
                        <a
                            href="https://github.com/pratyush-nirwan"
                            target="_blank"
                            rel="noreferrer"
                            className="ND text-white/60 text-right hover:text-white transition-all "
                        >
                            Resume_15-02-2026.pdf
                        </a>
                    </div>
                </h2>
            </div>
        </div >
    );
}

export default About;
