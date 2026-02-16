import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./NavBar";
import Spotlight from "./Spotlight";
import Grainient from "./Grainient";
import SpotifyRp from "./Spotify";

function Layout() {
    const location = useLocation();
    const isAboutPage = location.pathname === "/about";

    return (
        <div className="fixed inset-2 bg-black rounded-3xl flex flex-col overflow-hidden">
            <Spotlight />
            <NavBar />

            <div id="sandbox" className="relative flex w-full h-full rounded-3xl bg-black">
                <div
                    className={
                        isAboutPage
                            ? "fixed bottom-0 left-0 z-20 fade-in [--delay:1s] bg-black p-6.5 flex items-center justify-center rounded-tr-3xl\n             before:absolute \n             before:content-[''] \n             before:w-10 \n             before:h-10\n          before:-top-10\n          before:left-2 \n          before:rounded-bl-3xl\n          before:shadow-[-0.5rem_0.8rem_black] corner-bl\n          \n           after:absolute \n             after:content-[''] \n             after:w-10 \n            \n             after:h-10\n          after:bottom-2\n          after:-right-10 \n          after:rounded-bl-3xl\n          after:shadow-[-0.5rem_0.8rem_black] corafter\n            "
                            : "fixed bottom-7 left-8 z-20 fade-in [--delay:1s]"
                    }
                >
                    <SpotifyRp />
                </div>

                <div className="relative z-10 w-full h-full">
                    <Outlet />
                </div>

                <div className="absolute inset-0 z-0 overflow-hidden rounded-2xl">
                    <Grainient
                        color1="#FF9FFC"
                        color2="#5227FF"
                        color3="#B19EEF"
                        timeSpeed={0.25}
                        colorBalance={0}
                        warpStrength={10}
                        warpFrequency={5}
                        warpSpeed={3}
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

export default Layout;
