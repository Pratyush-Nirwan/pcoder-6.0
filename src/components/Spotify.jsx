import { useState, useEffect } from "react";

const Equalizer = () => (
    <div className="flex items-end gap-0.5 md:gap-0.75 h-3 md:h-4 ">
        <span className="w-0.75 bg-white/80 rounded-sm animate-eq1" />
        <span className="w-0.75 bg-white/80 rounded-sm animate-eq2" />
        <span className="w-0.75 bg-white/80 rounded-sm animate-eq3" />
    </div>
);

const SpotifyRp = () => {
    const [track, setTrack] = useState("");
    const [artist, setArtist] = useState("");

    async function getCurrentlyPlaying() {
        const API_KEY = "f6d9f010ca24dc38f275af06eb7a719f";
        const username = "pratyush_nirwan";

        try {
            const res = await fetch(
                `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${API_KEY}&format=json&limit=2`
            );
            const data = await res.json();
            if (!data?.recenttracks?.track?.length) return;

            const first = data.recenttracks.track[0];
            const isNowPlaying = first["@attr"]?.nowplaying === "true";
            const t = isNowPlaying ? first : data.recenttracks.track[1];

            setTrack(t.name);
            setArtist(t.artist["#text"]);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        getCurrentlyPlaying();
        const i = setInterval(getCurrentlyPlaying, 10000);
        return () => clearInterval(i);
    }, []);

    if (!track) return null;

    return (
        <div className="mt-0 flex items-center gap-2 md:gap-3 text-xs md:text-sm tracking-wide text-white/70 z-20 SG ">
            <Equalizer />
            <span className="flex flex-col md:block md:truncate md:max-w-md">
                <span className="text-white mt-0">{track}</span>

                <span className="text-white/50 mt-0">
                    <span className="hidden md:inline"> • </span>
                    {artist}
                </span>
            </span>
        </div>
    );
};

export default SpotifyRp;
