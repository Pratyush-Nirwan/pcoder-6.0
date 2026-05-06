import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BiCheckCircle, BiErrorCircle } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import emailjs from "emailjs-com";

void motion;

const EMPTY_FORM = {
    name: "",
    email: "",
    message: "",
};

const FORM_TRANSITION = {
    duration: 0.28,
    ease: [0.22, 1, 0.36, 1],
};

const EMAIL_ERROR_MESSAGE = "Something went wrong while sending your message. Please try again in a moment.";

export default function ContactForm({
    onClose
}) {
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [submitState, setSubmitState] = useState("idle");
    const [submitError, setSubmitError] = useState("");
    const submittingRef = useRef(false);

    const isSubmitting = submitState === "submitting";
    const isSuccess = submitState === "success";

    const validate = () => {
        const newErrors = {};

        if (!form.name.trim()) newErrors.name = "Name is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Valid email required";
        if (form.message.trim().length < 10) {
            newErrors.message = "Message must be at least 10 characters";
        }

        return newErrors;
    };

    const handleChange = ({ target }) => {
        const { name, value } = target;

        setForm((currentForm) => ({
            ...currentForm,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((currentErrors) => ({
                ...currentErrors,
                [name]: undefined,
            }));
        }

        if (submitError) {
            setSubmitError("");
        }

        if (submitState === "error") {
            setSubmitState("idle");
        }
    };

    const resetFormExperience = () => {
        setForm(EMPTY_FORM);
        setErrors({});
        setSubmitError("");
        setSubmitState("idle");
    };

    const handleClose = () => {
        if (isSuccess) {
            resetFormExperience();
        }

        onClose?.();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (submittingRef.current) {
            return;
        }

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setSubmitError("");
            if (submitState === "error") {
                setSubmitState("idle");
            }
            return;
        }

        submittingRef.current = true;
        setErrors({});
        setSubmitError("");
        setSubmitState("submitting");

        try {
            await emailjs.send(
                "service_x4ybm9d",
                "template_kv196te",
                {
                    name: form.name,
                    email: form.email,
                    message: form.message,
                },
                "IEuNXJwf6BKiLFRMm"
            );

            setForm(EMPTY_FORM);
            setErrors({});
            setSubmitState("success");
        } catch (error) {
            console.error("Email failed:", error);
            setSubmitState("error");
            setSubmitError(EMAIL_ERROR_MESSAGE);
        } finally {
            submittingRef.current = false;
        }
    };

    return (
        <div id="hire-contact-form" className="w-[90vw] md:w-[25vw] text-white">

            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <p className="ND text-lg text-white/70">
                        {isSuccess ? "" : "Lets Connect"}
                    </p>
                    <h2 className="SG text-2xl font-semibold">
                        {isSuccess ? "Message Sent" : "Quick Message"}
                    </h2>
                </div>
                {onClose ? (
                    <RxCross2
                        className={`-translate-x-3 text-white/60 transition-colors duration-200 ${isSubmitting ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:text-white"
                            }`}
                        onClick={isSubmitting ? undefined : handleClose}
                        size={25}
                    />

                ) : null}
            </div>

            <AnimatePresence initial={false} mode="wait">
                {isSuccess ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, y: 14, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={FORM_TRANSITION}
                        className=" p-6  backdrop-blur-sm"
                        role="status"
                        aria-live="polite"
                    >
                        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
                            <BiCheckCircle size={34} />
                        </div>
                        <h3 className="SG text-2xl font-semibold text-white">
                            Thanks, I’ve received your message.
                        </h3>
                        <p className="ND mt-3 text-sm leading-6 text-white/70">
                            I will get back to you as soon as possible.
                        </p>


                    </motion.div>
                ) : (
                    <motion.form
                        key="form"
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={FORM_TRANSITION}
                        className="space-y-3"
                        aria-busy={isSubmitting}
                    >
                        <div>
                            <label className="SG mb-2 text-sm text-white/70 flex items-center justify-between">
                                Name {errors.name && (
                                    <span className="text-sm text-red-300">{errors.name}</span>
                                )}
                            </label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Your name"
                                value={form.name}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-[border-color,background-color,opacity] duration-200 placeholder:text-white/35 focus:border-white/35 disabled:cursor-not-allowed disabled:opacity-60"
                            />

                        </div>

                        <div>
                            <label className="SG mb-2 text-sm text-white/70 flex justify-between items-center">
                                Email {errors.email && (
                                    <span className="text-sm text-red-300">{errors.email}</span>
                                )}
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-[border-color,background-color,opacity] duration-200 placeholder:text-white/35 focus:border-white/35 disabled:cursor-not-allowed disabled:opacity-60"
                            />

                        </div>

                        <div>
                            <label className="SG mb-2 text-sm text-white/70 flex justify-between items-center">
                                Message {errors.message && (
                                    <span className="text-sm text-red-300">{errors.message}</span>
                                )}
                            </label>
                            <textarea
                                name="message"
                                placeholder="Tell me about the product, timeline, and what you need help with."
                                value={form.message}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                className="min-h-32 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-[border-color,background-color,opacity] duration-200 placeholder:text-white/35 focus:border-white/35 disabled:cursor-not-allowed disabled:opacity-60"
                                rows={5}
                            />
                        </div>

                        <AnimatePresence>
                            {submitError ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-red-50"
                                    role="alert"
                                >
                                    <BiErrorCircle className="mt-0.5 shrink-0 text-red-300" size={20} />
                                    <div>
                                        <p className="SG text-sm font-medium text-red-100">
                                            Message not sent
                                        </p>
                                        <p className="ND mt-1 text-sm leading-5 text-red-100/80">
                                            {submitError}
                                        </p>
                                    </div>
                                </motion.div>
                            ) : null}
                        </AnimatePresence>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`SG w-full rounded-2xl px-4 py-3 font-medium !text-black transition-all duration-200 ${isSubmitting
                                    ? "cursor-not-allowed bg-white/70 text-black/70"
                                    : "cursor-pointer bg-white hover:bg-white/80"
                                    }`}
                            >
                                <span className="inline-flex items-center justify-center gap-2">

                                    {isSubmitting ? "Sending..." : "Send Message"}
                                </span>
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    );
}
