import Arrow from "./Arrow";
import Spotlight from "../Spotlight";
function Home() {
    return (
        <>
            <Spotlight />
            <div className="relative z-10 flex flex-col justify-center gap-2 pl-10 h-full">
                <Spotlight.Target mode="inline" className="w-fit">
                    <pre className="ND">
                        <code className="font-inherit">{`<h1>`}</code>
                    </pre>
                </Spotlight.Target>

                <h1 className="SG font-extrabold text-7xl scale-[2] origin-left fade-in">
                    Pratyush Nirwan
                </h1>
                <Spotlight.Target mode="inline" className="w-fit">
                    <pre className="ND">
                        <code className="font-inherit">{`</h1>`}</code>
                    </pre>
                </Spotlight.Target>
                <Spotlight.Target mode="inline" className="w-fit">
                    <pre className="ND">
                        <code className="font-inherit">{`<h2>`}</code>
                    </pre>
                </Spotlight.Target>
                <h2 className="SG font-medium text-4xl  origin-left fade-in [--delay:100ms] text-white/70">
                    Designing & building expressive web interfaces
                </h2>
                <Spotlight.Target mode="inline" className="w-fit">
                    <pre className="ND">
                        <code className="font-inherit">{`</h2>`}</code>
                    </pre>
                </Spotlight.Target>
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
                <h2 className="SG text-2xl text-white/60 transition-all hover:text-white cursor-pointer">Hire Me</h2>
            </div>

            <div className="z-20 flex fixed bottom-5 right-27">
                <p className="ND text-2xl absolute text-nowrap -translate-x-30 translate-y-10 -rotate-20 fade-in [--delay:200ms]">Lets Work Together</p>
                <Arrow />
            </div>
        </>
    );
}

export default Home;
