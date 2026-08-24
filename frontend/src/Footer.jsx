import React from "react";
import {
    ArrowUpRight,
    BrainCircuit,
    CheckCircle2,
    Mail,
    Play,
    Sparkles,
    Zap,
} from "lucide-react";

const footerLinks = {
    Product: ["How It Works", "Context Engine", "Ad Matching", "Analytics"],
    Technology: ["Vision AI", "Scene Detection", "Semantic Search", "API"],
    Resources: ["Documentation", "Demo", "Case Studies", "Contact"],
};

export default function Footer() {
    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <footer className="relative overflow-hidden bg-black text-white">
            {/* Purple architectural background — matches the hero */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-0 h-64 w-[55rem] -translate-x-1/2 rounded-full bg-[#4338ca]/25 blur-[120px]" />
                <div className="absolute -bottom-32 left-1/2 h-96 w-[70rem] -translate-x-1/2 rounded-full bg-[#4f46e5]/25 blur-[110px]" />

                {/* Vertical context bars */}
                <div className="absolute inset-x-0 bottom-0 flex h-72 items-end justify-center gap-3 opacity-30">
                    {[34, 46, 62, 38, 76, 52, 90, 64, 42, 82, 58, 70, 48, 88, 56, 38].map(
                        (height, i) => (
                            <div
                                key={i}
                                className="w-[5vw] max-w-20 min-w-7 rounded-t-[4px] bg-gradient-to-t from-[#4f46e5] to-transparent"
                                style={{ height: `${height}%` }}
                            />
                        )
                    )}
                </div>

                {/* Soft grid */}
                <div
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                    }}
                />
            </div>

            <div className="relative mx-auto max-w-7xl px-6 pb-8 pt-20 lg:px-8">
                {/* CTA */}
                <section className="relative mb-20 overflow-hidden rounded-[32px] border border-white/10 bg-[#08080d]/80 px-6 py-14 shadow-[0_0_100px_rgba(67,56,202,.12)] backdrop-blur-xl sm:px-10 lg:px-16">
                    <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-[#4f46e5]/20 blur-[100px]" />
                    <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-[#4338ca]/15 blur-[110px]" />

                    <div className="relative z-10 mx-auto max-w-4xl text-center">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#6366f1]/25 bg-[#4f46e5]/10 px-4 py-2 text-xs font-medium text-[#a5b4fc]">
                            <Sparkles className="h-3.5 w-3.5" />
                            AI-powered contextual advertising
                        </div>

                        <h2 className="text-4xl font-semibold tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                            Ads that understand
                            <br />
                            <span className="font-serif italic font-normal text-white">
                                the context.
                            </span>
                        </h2>

                        <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
                            Understand the content. Find the context. Deliver the right ad —
                            exactly when it matters.
                        </p>

                        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                            <button
                                onClick={() => scrollTo("demo")}
                                className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#4f46e5] to-[#6366f1] px-6 py-3.5 text-sm font-semibold shadow-[0_0_35px_rgba(79,70,229,.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_50px_rgba(99,102,241,.45)]"
                            >
                                <Play className="h-4 w-4 fill-current" />
                                Try ContextAds
                                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                            </button>

                            <button
                                onClick={() => scrollTo("how-it-works")}
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-6 py-3.5 text-sm font-medium text-zinc-200 transition-all hover:border-[#6366f1]/40 hover:bg-[#4f46e5]/10"
                            >
                                Explore the engine
                            </button>
                        </div>
                    </div>
                </section>

                {/* Brand + links */}
                <div className="grid gap-14 lg:grid-cols-[1.3fr_2fr]">
                    <div>
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            className="group inline-flex items-center gap-3"
                        >
                            <span className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-[#6366f1]/30 bg-[#4f46e5]/10">
                                <span className="absolute inset-0 rounded-xl bg-[#4f46e5]/20 blur-md transition-opacity group-hover:opacity-100" />
                                <BrainCircuit className="relative h-5 w-5 text-[#818cf8]" />
                            </span>

                            <span className="text-2xl font-semibold tracking-[-0.04em]">
                                Context<span className="text-[#818cf8]">Ads</span>
                            </span>
                        </button>

                        <p className="mt-5 max-w-sm text-sm leading-6 text-zinc-500">
                            Understand every meaningful moment in a video and connect it
                            with the most relevant advertisement.
                        </p>

                        <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#6366f1]/15 bg-[#4f46e5]/[0.06] px-3 py-2 text-xs text-zinc-400">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#818cf8] opacity-60" />
                                <span className="relative h-2 w-2 rounded-full bg-[#818cf8]" />
                            </span>
                            Context engine online
                        </div>

                        <div className="mt-7 flex gap-2">
                            {[Mail].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    aria-label="Social link"
                                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.025] text-zinc-500 transition-all hover:border-[#6366f1]/40 hover:bg-[#4f46e5]/10 hover:text-[#a5b4fc]"
                                >
                                    <Icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
                        {Object.entries(footerLinks).map(([title, items]) => (
                            <div key={title}>
                                <h3 className="mb-5 text-sm font-semibold text-white">
                                    {title}
                                </h3>
                                <ul className="space-y-3.5">
                                    {items.map((item) => (
                                        <li key={item}>
                                            <a
                                                href="#"
                                                className="group inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-200"
                                            >
                                                {item}
                                                <ArrowUpRight className="h-3 w-3 -translate-y-0.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-70" />
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product signals */}
                <div className="my-14 grid overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] backdrop-blur sm:grid-cols-3">
                    {[
                        [BrainCircuit, "Context-aware", "Understands meaningful video moments."],
                        [Zap, "Non-blocking", "Analyzes while viewers keep watching."],
                        [CheckCircle2, "Semantic matching", "Finds the most relevant advertisement."],
                    ].map(([Icon, title, text], i) => (
                        <div
                            key={title}
                            className={`flex items-center gap-4 px-5 py-5 ${i ? "border-t border-white/10 sm:border-l sm:border-t-0" : ""
                                }`}
                        >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#4f46e5]/10 text-[#818cf8]">
                                <Icon className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-zinc-200">{title}</p>
                                <p className="mt-0.5 text-xs leading-5 text-zinc-500">{text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
                    <p>© {new Date().getFullYear()} ContextAds. All rights reserved.</p>

                    <div className="flex items-center gap-5">
                        <a href="#" className="transition-colors hover:text-zinc-300">
                            Privacy
                        </a>
                        <a href="#" className="transition-colors hover:text-zinc-300">
                            Terms
                        </a>
                        <span className="hidden h-3 w-px bg-white/10 sm:block" />
                        <span>
                            Built with <span className="text-[#818cf8]">AI</span> · for
                            better context
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
