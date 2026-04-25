import Spotlight from "../Spotlight";
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";
import { TiDelete } from "react-icons/ti";
import { MdCheckCircle } from "react-icons/md";
import { setCookie } from "../CookieUtils";
import { supabase, signInWithGitHub, getSession, signOut } from "../Supabase";
import { Helmet } from 'react-helmet-async';

function Guestbook({ selectedPage }) {
    setCookie("page", "guestbook");

    const [user, setUser] = useState(null);
    const [usernameLower, setUsernameLower] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isCheckingUserMsg, setIsCheckingUserMsg] = useState(false);

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);
    const [isMsgExists, setIsMsgExists] = useState(false);
    const [userMessage, setUserMessage] = useState(null);
    const [userMessageId, setUserMessageId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    /* ---------- AUTH ---------- */

    useEffect(() => {
        const processUser = (user) => {
            if (!user) {
                setUser(null);
                setUsernameLower(null);
                setIsAuthenticated(false);
                return;
            }
            const username =
                user?.user_metadata?.user_name ||
                user?.user_metadata?.preferred_username ||
                user?.email?.split("@")[0] ||
                "anonymous";
            setUser(user);
            setUsernameLower(username.toLowerCase());
            setIsAuthenticated(true);
        };

        const initAuth = async () => {
            const { data: { session } } = await getSession();
            if (session?.user) processUser(session.user);
        };

        initAuth();

        const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
            processUser(session?.user);
        });

        return () => subscription.subscription.unsubscribe();
    }, []);

    /* ---------- DATA ---------- */

    useEffect(() => {
        if (!isAuthenticated || !usernameLower) return;
        setIsCheckingUserMsg(true);
        supabase
            .from("guestbook")
            .select("*")
            .eq("username", usernameLower)
            .maybeSingle()
            .then(({ data, error }) => {
                if (error) {
                    // Treat as "no message" but log for debugging.
                    console.error("Failed to fetch user guestbook message:", error);
                    setIsMsgExists(false);
                    setUserMessage(null);
                    setUserMessageId(null);
                    return;
                }

                if (data) {
                    setUserMessage(data.message);
                    setUserMessageId(data.id);
                    setIsMsgExists(true);
                } else {
                    setIsMsgExists(false);
                    setUserMessage(null);
                    setUserMessageId(null);
                }
            })
            .finally(() => setIsCheckingUserMsg(false));
    }, [isAuthenticated, usernameLower]);

    const fetchMessages = async () => {
        const { data } = await supabase
            .from("guestbook")
            .select("*")
            .order("created_at", { ascending: false });
        setMessages(data || []);
        setIsLoaded(true);
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleSubmit = async () => {
        if (!newMessage.trim() || isSubmitting) return;
        setIsSubmitting(true);
        try {
            const payload = {
                username: usernameLower,
                message: newMessage,
                created_at: new Date().toISOString(),
            };

            const { error } = await supabase.from("guestbook").upsert(payload);
            if (error) {
                console.error("Failed to submit guestbook message:", error);
                return;
            }

            // Update the signed-in user's card immediately (no reload).
            setNewMessage("");

            const { data: updatedRow, error: fetchError } = await supabase
                .from("guestbook")
                .select("*")
                .eq("username", usernameLower)
                .maybeSingle();

            if (fetchError) {
                console.error("Failed to refresh user guestbook message:", fetchError);
            }

            if (updatedRow) {
                setUserMessage(updatedRow.message);
                setUserMessageId(updatedRow.id);
                setIsMsgExists(true);
            } else {
                setUserMessage(null);
                setUserMessageId(null);
                setIsMsgExists(false);
            }

            await fetchMessages();
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!id) return;
        const { error } = await supabase.from("guestbook").delete().eq("id", id);
        if (error) return;
        setIsMsgExists(false);
        setUserMessage(null);
        setUserMessageId(null);
        await fetchMessages();
    };

    /* ---------- UI ---------- */

    const renderCtaCard = () => {
        if (!isAuthenticated) {
            return (
                <>
                    <div className="text-white text-2xl font-extrabold">PCODER.ME</div>
                    <p className="text-white leading-snug text-xl ND">Sign in to leave a message</p>
                    <button
                        onClick={signInWithGitHub}
                        className="mt-1 self-start px-5 py-2 rounded-xl bg-white text-black font-bold text-base flex items-center gap-2 cursor-pointer hover:bg-white/80 transition-colors duration-200"
                    >
                        <FaGithub size={16} /> Sign in
                    </button>
                </>
            );
        }

        if (isCheckingUserMsg) {
            return (
                <>
                    <div className="text-white text-2xl font-extrabold">~/{usernameLower}</div>
                    <CgSpinner className="text-white animate-spin text-2xl" />
                </>
            );
        }

        if (!isMsgExists) {
            return (
                <>
                    <div className="text-white text-2xl font-extrabold">~/{usernameLower}</div>
                    <input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Write your message..."
                        className="bg-transparent border-b border-white/30 text-white text-xl font-mono outline-none placeholder:text-white/40 py-1 ND"
                    />
                    <div className="flex items-center gap-3 mt-1">
                        <MdCheckCircle
                            size={22}
                            className="text-white cursor-pointer hover:text-white/70 transition-colors"
                            onClick={handleSubmit}
                        />
                        <button
                            onClick={signOut}
                            className="px-4 py-1 rounded-xl bg-white text-black font-bold text-xs cursor-pointer hover:bg-white/80 transition-colors duration-200"
                        >
                            Sign Out
                        </button>
                    </div>
                </>
            );
        }

        return (
            <>
                <div className="text-white text-2xl font-extrabold">~/{usernameLower}</div>
                <p className="text-white leading-snug text-xl ND">{userMessage}</p>
                <div className="flex items-center gap-3 mt-1">
                    <TiDelete
                        size={22}
                        className="text-white cursor-pointer hover:text-white/70 transition-colors"
                        onClick={() => handleDelete(userMessageId)}
                    />
                    <button
                        onClick={signOut}
                        className="px-4 py-1 rounded-xl bg-white text-black font-bold text-xs cursor-pointer hover:bg-white/80 transition-colors duration-200"
                    >
                        Sign Out
                    </button>
                </div>
            </>
        );
    };

    return (
        <>
            <Helmet>
                <title>Pratyush Nirwan | Guestbook</title>
                <meta name="description" content="Sign in with GitHub and leave a message in Pratyush Nirwan's guestbook. Connect with fellow developers and share your thoughts." />
                <meta name="keywords" content="Pratyush Nirwan, Guestbook, Contact, GitHub, Messages, Developer Community" />
                <meta property="og:title" content="Pratyush Nirwan | Guestbook" />
                <meta property="og:description" content="Leave a message and connect with the developer community." />
                <meta property="og:url" content="https://pratyushnirwan.dev/guestbook" />
                <link rel="canonical" href="https://pratyushnirwan.dev/guestbook" />
            </Helmet>
            <Spotlight />
            <div className="h-full min-h-0 flex flex-col p-4 md:p-10 md:pt-20">
                <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-5 flex-1 min-h-0">
                    {/* CTA / Auth Card — fixed; messages scroll beside / below */}
                    <div className="shrink-0 w-full md:max-w-sm bg-black/50 backdrop-blur rounded-2xl p-5 flex flex-col gap-3 transition-all duration-300 fade-in">
                        {renderCtaCard()}
                    </div>

                    <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain pr-1 md:pr-0 [scrollbar-gutter:stable]">
                        <div className="columns-1 md:columns-3 gap-3 md:gap-5 space-y-3 md:space-y-5">
                            {!isLoaded ? (
                                <div className="break-inside-avoid bg-black/50 backdrop-blur rounded-2xl p-5 flex items-center justify-center min-h-[120px]">
                                    <CgSpinner className="text-white animate-spin text-2xl" />
                                </div>
                            ) : (
                                messages
                                    .filter((msg) => msg.username !== usernameLower)
                                    .map((msg, idx) => (
                                        <div
                                            key={msg.id}
                                            className={`break-inside-avoid bg-black/50 backdrop-blur rounded-2xl p-5 flex flex-col gap-3 transition-all duration-300 fade-in [--delay:${(idx + 1) * 100}ms]`}
                                        >
                                            <div className="text-white md:text-2xl font-extrabold">~/{msg.username}</div>
                                            <p className="text-white leading-snug md:text-xl ND">{msg.message}</p>
                                        </div>
                                    ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Guestbook;
