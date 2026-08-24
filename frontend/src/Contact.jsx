import React, { useState } from "react";
import {
    ArrowUpRight,
    Check,
    Mail,
    MessageCircle,
    Send,
    Sparkles,
} from "lucide-react";

export default function Contact() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <section
            id="contact"
            className="relative overflow-hidden bg-black py-24 text-white sm:py-32"
        >
            {/* Ambient background */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-0 h-72 w-[55rem] -translate-x-1/2 rounded-full bg-[#4338ca]/20 blur-[120px]" />
                <div className="absolute -bottom-40 right-[-8rem] h-96 w-96 rounded-full bg-[#4f46e5]/15 blur-[120px]" />
                <div className="absolute -left-40 bottom-20 h-80 w-80 rounded-full bg-[#6366f1]/10 blur-[110px]" />

                {/* Subtle grid */}
                <div
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.8) 1px,transparent 1px)",
                        backgroundSize: "48px 48px",
                    }}
                />
            </div>

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                {/* Heading */}
                <div className="mx-auto max-w-3xl text-center">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#6366f1]/25 bg-[#4f46e5]/10 px-4 py-2 text-xs font-medium text-[#a5b4fc]">
                        <Sparkles className="h-3.5 w-3.5" />
                        Let&apos;s build smarter advertising
                    </div>

                    <h2 className="text-4xl font-semibold tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                        Have a moment worth
                        <br />
                        <span className="font-serif italic font-normal text-white">
                            understanding?
                        </span>
                    </h2>

                    <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
                        Whether you want to explore ContextAds, discuss a partnership, or
                        see the technology in action, we&apos;d love to hear from you.
                    </p>
                </div>

                {/* Main content */}
                <div className="mx-auto mt-14 grid max-w-6xl gap-6 lg:grid-cols-[0.85fr_1.15fr]">
                    {/* Left panel */}
                    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#08080d]/80 p-7 backdrop-blur-xl sm:p-9">
                        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#4f46e5]/15 blur-[80px]" />

                        <div className="relative">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#6366f1]/25 bg-[#4f46e5]/10 text-[#818cf8]">
                                <MessageCircle className="h-5 w-5" />
                            </div>

                            <h3 className="mt-7 text-2xl font-semibold tracking-tight">
                                Start a conversation
                            </h3>

                            <p className="mt-3 text-sm leading-6 text-zinc-500">
                                Tell us what you&apos;re building, what you&apos;re trying to
                                solve, or simply what you think about contextual advertising.
                            </p>

                            <div className="mt-9 space-y-4">
                                {[
                                    "Explore the ContextAds technology",
                                    "Discuss a partnership or integration",
                                    "Request a product demonstration",
                                ].map((item) => (
                                    <div
                                        key={item}
                                        className="flex items-start gap-3 text-sm text-zinc-300"
                                    >
                                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#4f46e5]/15 text-[#818cf8]">
                                            <Check className="h-3 w-3" />
                                        </span>
                                        {item}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-10 border-t border-white/10 pt-7">
                                <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
                                    Prefer email?
                                </p>

                                <a
                                    href="mailto:hello@contextads.ai"
                                    className="group mt-3 inline-flex items-center gap-2 text-sm font-medium text-zinc-200 transition hover:text-[#a5b4fc]"
                                >
                                    <Mail className="h-4 w-4 text-[#818cf8]" />
                                    hello@contextads.ai
                                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035] p-7 shadow-[0_0_80px_rgba(67,56,202,.08)] backdrop-blur-xl sm:p-9">
                        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[#6366f1]/10 blur-[90px]" />

                        {submitted ? (
                            <div className="relative flex min-h-[470px] flex-col items-center justify-center text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
                                    <Check className="h-7 w-7" />
                                </div>

                                <h3 className="mt-6 text-2xl font-semibold">
                                    Message received.
                                </h3>

                                <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-500">
                                    Thanks for reaching out. We&apos;ll get back to you soon.
                                </p>

                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="mt-7 rounded-full border border-white/10 px-5 py-2.5 text-sm text-zinc-300 transition hover:border-[#6366f1]/30 hover:bg-[#4f46e5]/10"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="relative space-y-5">
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <Field label="Name" placeholder="Your name" required />
                                    <Field
                                        label="Email"
                                        type="email"
                                        placeholder="you@company.com"
                                        required
                                    />
                                </div>

                                <Field
                                    label="Subject"
                                    placeholder="What would you like to discuss?"
                                    required
                                />

                                <div>
                                    <label className="mb-2 block text-xs font-medium text-zinc-400">
                                        Message
                                    </label>
                                    <textarea
                                        required
                                        rows={6}
                                        placeholder="Tell us a little about your idea..."
                                        className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-[#6366f1]/50 focus:bg-black/40 focus:ring-4 focus:ring-[#4f46e5]/10"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#6366f1] px-5 py-3.5 text-sm font-semibold shadow-[0_0_30px_rgba(79,70,229,.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_45px_rgba(99,102,241,.4)]"
                                >
                                    Send Message
                                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </button>

                                <p className="text-center text-[11px] leading-5 text-zinc-600">
                                    By sending this message, you agree to be contacted regarding
                                    your enquiry.
                                </p>
                            </form>
                        )}
                    </div>
                </div>

                {/* Bottom signal */}
                <div className="mx-auto mt-10 flex max-w-6xl items-center justify-center gap-3 text-xs text-zinc-600">
                    <span className="h-px w-16 bg-gradient-to-r from-transparent to-white/10" />
                    Context-aware advertising starts with a conversation
                    <span className="h-px w-16 bg-gradient-to-l from-transparent to-white/10" />
                </div>
            </div>
        </section>
    );
}

function Field({ label, type = "text", placeholder, required = false }) {
    return (
        <div>
            <label className="mb-2 block text-xs font-medium text-zinc-400">
                {label}
            </label>
            <input
                type={type}
                placeholder={placeholder}
                required={required}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-[#6366f1]/50 focus:bg-black/40 focus:ring-4 focus:ring-[#4f46e5]/10"
            />
        </div>
    );
}