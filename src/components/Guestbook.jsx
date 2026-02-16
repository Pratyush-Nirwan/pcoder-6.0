import React, { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";
import { TiDelete } from "react-icons/ti";
import { MdCheckCircle } from "react-icons/md";

import { setCookie } from "./CookieUtils";
import { supabase, signInWithGitHub, getSession, signOut } from "./Supabase";

function GuestBook({ selectedPage }) {
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
            const {
                data: { session },
            } = await getSession();

            if (session?.user) processUser(session.user);
        };

        initAuth();

        const { data: subscription } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                processUser(session?.user);
            }
        );

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
            .single()
            .then(({ data }) => {
                if (data) {
                    console.log("Fetched user message:", data);
                    setUserMessage(data.message);
                    setUserMessageId(data.id);
                    setIsMsgExists(true);
                } else {
                    setIsMsgExists(false);
                }
            })
            .finally(() => setIsCheckingUserMsg(false));
    }, [isAuthenticated, usernameLower]);

    const fetchMessages = async () => {
        console.log("Fetching messages...");
        const { data } = await supabase
            .from("guestbook")
            .select("*")
            .order("created_at", { ascending: false });

        console.log("Messages fetched:", data);
        setMessages(data || []);
        setIsLoaded(true);
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleSubmit = async () => {
        if (!newMessage.trim() || isSubmitting) return;

        setIsSubmitting(true);

        await supabase.from("guestbook").upsert({
            username: usernameLower,
            message: newMessage,
            created_at: new Date().toISOString(),
        });

        setNewMessage("");
        setIsSubmitting(false);
        fetchMessages();
    };

    const handleDelete = async (id) => {
        console.log("Delete called with ID:", id, "userMessageId state:", userMessageId);
        if (!id) {
            console.error("No ID provided for delete");
            return;
        }

        const { error } = await supabase
            .from("guestbook")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Delete failed:", error);
            return;
        }

        console.log("Delete successful, resetting state and fetching messages");
        setIsMsgExists(false);
        setUserMessage(null);
        setUserMessageId(null);
        await fetchMessages();
    };

    /* ---------- UI ---------- */

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className={`guestbook-table ${selectedPage}`}>
            <div className="font-mono text-sm mb-2">
                {!isAuthenticated ? (
                    <div className="flex items-center gap-2 uppercase text-xs">
                        <span className="font-bold">~/pcoder.me</span>
                        <span className="text-center">:</span>
                        <span className="flex-1">sign in to leave a message</span>
                        <button onClick={signInWithGitHub}
                            className="bg-white text-black px-2 py-1 rounded-2xl flex items-center gap-1">
                            <FaGithub size={12} /> SIGN IN
                        </button>
                    </div>
                ) : isCheckingUserMsg ? (
                    <CgSpinner />
                ) : !isMsgExists ? (
                    <div className="grid items-center gap-2 uppercase text-xs"
                        style={{ gridTemplateColumns: "150px 14px 1fr 180px" }}>
                        <span className="font-bold">~/{usernameLower}</span>
                        <span className="text-center">:</span>
                        <input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Write your message..."
                            className="font-mono text-sm"
                        />
                        <div className="flex justify-end gap-2 items-center">
                            <MdCheckCircle size={18} onClick={handleSubmit} />
                            <button onClick={signOut}
                                className="bg-white text-black px-2 py-1 rounded-2xl">
                                SignOut
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid items-center gap-2 uppercase text-xs"
                        style={{ gridTemplateColumns: "150px 14px 1fr 180px" }}>
                        <span className="font-bold">~/{usernameLower}</span>
                        <span className="text-center">:</span>
                        <span>{userMessage}</span>
                        <div className="flex justify-end gap-2 items-center">
                            <TiDelete size={16} onClick={() => handleDelete(userMessageId)} />
                            <button onClick={signOut}
                                className="bg-white text-black px-2 py-1 rounded-2xl">
                                SignOut
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="font-mono text-xs space-y-1">
                {!isLoaded ? <CgSpinner /> : messages
                    .filter(msg => msg.username !== usernameLower)
                    .map(msg => (
                        <div key={msg.id}
                            className="grid items-center gap-2 uppercase"
                            style={{ gridTemplateColumns: "150px 14px 1fr 180px" }}>
                            <span className="font-bold">~/{msg.username}</span>
                            <span className="text-center">:</span>
                            <span>{msg.message}</span>
                            <span className="text-right text-white/60 text-[0.7rem]">
                                {formatDate(msg.created_at)}
                            </span>
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default GuestBook;
