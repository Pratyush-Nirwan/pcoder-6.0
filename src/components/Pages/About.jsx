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
import { MdEmail } from "react-icons/md"
import { FaLinkedin, FaGithub } from "react-icons/fa"
import { HiDocumentText } from "react-icons/hi"
import {
    SiMongodb,
    SiPostman,
    SiFigma,
    SiAdobeillustrator,
    SiAdobeaftereffects,
    SiCanva
} from "react-icons/si";

import { FaGitSquare } from "react-icons/fa";
import { BiLogoVisualStudio } from "react-icons/bi";
import { ArcherContainer, ArcherElement } from '@gitii/react-archer';
import { GoDotFill } from "react-icons/go";

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
    { year: "2024", text: "Built Websites with React.js" },
    { year: "2022", text: "Started with HTML, CSS, JavaScript" },
];
const compressedTimelineData = [
    { year: "Now", text: "Building" },
    { year: "2025", text: "Polish UX" },
    { year: "2024", text: "React Dev" },
    { year: "2022", text: "Started Web" },
];

function About() {
    return (
        <div className="relative z-10 flex flex-col w-full h-full pt-10 md:pt-24 gap-6 px-10 overflow-auto no-scrollbar text-justify">
            <Spotlight />
            {/* TIMELINE */}
            <div className="about-timeline absolute md:right-10 md:top-1/2 md:-translate-y-1/2 fade-in md:scale-100 hidden md:inline">
                <ArcherContainer
                    strokeColor="white"
                    strokeWidth={1}
                    offset={10}
                    svgContainerStyle={{
                        pointerEvents: 'none', overflow: 'visible'
                    }}
                >
                    {timelineData.map((item, index) => (
                        <div
                            key={index}
                            className="mb-20"
                            style={{
                                transform: `translateX(-${index * 10}em)`
                            }}
                        >
                            <div className="flex items-start">

                                {/* DOT */}
                                <ArcherElement
                                    id={`dot-${index}`}

                                    relations={
                                        index === timelineData.length - 1
                                            ? []
                                            : [{
                                                targetId: `dot-${index + 1}`,
                                                sourceAnchor: 'bottom',
                                                targetAnchor: 'top',
                                                style: {
                                                    endMarker: false,
                                                },
                                            }]
                                    }
                                >
                                    <span className="text-xl leading-none text-white fade-in"
                                        style={{
                                            animationDelay: `${(timelineData.length - 1 - index) * 200}ms`
                                        }}>
                                        <GoDotFill />
                                    </span>
                                </ArcherElement>

                                {/* TEXT */}
                                <span className="ml-2 translate-y-3">
                                    <span
                                        className="block text-2xl text-white/60 ND fade-in"
                                        style={{
                                            animationDelay: `${(timelineData.length - 1 - index) * 200}ms`
                                        }}
                                    >
                                        {item.year}
                                    </span>
                                    <span
                                        className="block font-bold SG fade-in"
                                        style={{
                                            animationDelay: `${(timelineData.length - 1 - index) * 300}ms`
                                        }}
                                    >
                                        {item.text}
                                    </span>
                                </span>

                            </div>
                        </div>
                    ))}
                </ArcherContainer>
            </div>

            <div className="fixed bottom-0 flex flex-col">
                {timelineData.slice(0, 2).map((item, index) => (
                    <div key={index} className="flex flex-row-reverse gap-5">

                        {/* Right: dot + line */}
                        <div className="flex flex-col items-center">
                            <GoDotFill size={20} className="shrink-0" />
                            {index !== 1 && (
                                <div className="w-px flex-1 bg-white my-1" />
                            )}
                        </div>

                        {/* Left: text */}
                        <div className="flex flex-col pb-6 text-right">
                            <span>{item.year}</span>
                            <span>{item.text}</span>
                        </div>

                    </div>
                ))}
            </div>
            <Spotlight />

            <div className="flex flex-col gap-1">
                <Spotlight.Target mode="inline" className="w-fit">
                    <pre className="ND">
                        <code className="font-inherit hidden md:block">{`<h1>`}</code>
                    </pre>
                </Spotlight.Target>

                <h1 className="SG font-extrabold text-5xl text-white fade-in hidden md:inline">
                    Pratyush Nirwan
                </h1>

                <Spotlight.Target mode="inline" className="w-fit">
                    <pre className="ND hidden md:block">
                        <code className="font-inherit">{`</h1>`}</code>
                    </pre>
                </Spotlight.Target>

                <Spotlight.Target mode="inline" className="w-fit">
                    <pre className="ND hidden md:block">
                        <code className="font-inherit">{`<p>`}</code>
                    </pre>
                </Spotlight.Target>

                <p className="SG fade-in [--delay:100ms] text-xs md:text-base">
                    I build things at the intersection of code, design, and curiosity. <br />
                    Music on repeat, hands on the keyboard, always learning by doing. <br />
                    BTech Computer Technology @ YCCE, Nagpur. <br />
                    Got an idea? I’d love to work on it with you.
                    <br /><br />
                    Radhe Radhe 🤍
                </p>

                <Spotlight.Target mode="inline" className="w-fit">
                    <pre className="ND">
                        <code className="font-inherit hidden md:block">{`</p>`}</code>
                    </pre>
                </Spotlight.Target>
            </div>

            {/* LOGO LOOP */}
            <div className="absolute bottom-1 left-0 w-full fade-in [--delay:500ms]">
                <div className="md:hidden">
                    <LogoLoop
                        logos={techLogos}
                        speed={40}
                        direction="left"
                        logoHeight={26}
                        gap={30}
                        hoverSpeed={0}
                        scaleOnHover
                        fadeOut={false}
                        ariaLabel="Skills"
                        className="opacity-90"
                    />
                </div>

                {/* desktop */}
                <div className="hidden md:block">
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

            {/* CONTACT CARD */}
            <div className="
            absolute bottom-1/2 translate-y-1/2 md:translate-y-0 md:bottom-0 right-0 z-10 bg-black p-5 rounded-tl-3xl rounded-bl-3xl md:rounded-bl-none corner-br
              before:absolute 
              before:content-[''] 
              before:w-10 
              before:h-10
              before:-bottom-10
              md:before:bottom-0 
              before:right-0
              md:before:-left-10 
              before:rounded-tr-3xl
              md:before:rounded-br-3xl
              before:shadow-[0.5rem_-0.8rem_black]
              md:before:shadow-[0.5rem_0.8rem_black]
            

              after:absolute
              after:content-['']
              after:h-10
              after:w-10
              after:-top-10
              after:right-0
              after:rounded-br-3xl
            after:shadow-[0.5rem_0.8rem_black]
">
                <div className="flex flex-col md:hidden items-center gap-6 text-2xl text-white">
                    <a href="mailto:pratyushnirwan@gmail.com"><MdEmail /></a>
                    <a href="https://www.linkedin.com/in/pratyush-nirwan/" target="_blank"><FaLinkedin /></a>
                    <a href="https://github.com/pratyush-nirwan" target="_blank"><FaGithub /></a>
                    <a href="/Resume_04-03-2026.pdf" download><HiDocumentText /></a>
                </div>
                <div className="hidden md:grid grid-cols-[auto_1fr] gap-x-10 gap-y-3 SG">
                    <span className="font-bold">Email</span>
                    <a href="mailto:pratyushnirwan@gmail.com" className="ND text-white/60 hover:text-white">
                        pratyushnirwan@gmail.com
                    </a>

                    <span className="font-bold">LinkedIn</span>
                    <a href="https://www.linkedin.com/in/pratyush-nirwan/" target="_blank" rel="noreferrer"
                        className="ND text-white/60 hover:text-white">
                        linkedin.com/in/pratyush-nirwan
                    </a>

                    <span className="font-bold">GitHub</span>
                    <a href="https://github.com/pratyush-nirwan" target="_blank" rel="noreferrer"
                        className="ND text-white/60 hover:text-white">
                        github.com/pratyush-nirwan
                    </a>

                    <span className="font-bold">Resume</span>
                    <a
                        href="/Resume_04-03-2026.pdf"
                        download
                        className="ND text-white/60 hover:text-white"
                    >
                        Resume_04-03-2026.pdf
                    </a>
                </div>
            </div>

        </div >
    );
}

export default About;
