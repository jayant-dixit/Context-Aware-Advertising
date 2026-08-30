import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

import BurningTopGlow from "./BurningTopGlow";
import ContextAnalyzer from "./ContextAnalyser";

const bars = [
    { h: "96%", opacity: "0.98" },
    { h: "80%", opacity: "0.95" },
    { h: "68%", opacity: "0.92" },
    { h: "52%", opacity: "0.88" },
    { h: "40%", opacity: "0.85" },
    { h: "30%", opacity: "0.80" },
    { h: "20%", opacity: "0.77" },
    { h: "12%", opacity: "0.75" },
];

export default function HeroSection({
    url,
    changeUrl,
    startAnalysis,
}) {
    const sectionRef = useRef(null);

    const barsContainerRef = useRef(null);
    const glowContainerRef = useRef(null);
    const navRef = useRef(null);

    const headingRef = useRef(null);
    const contextRef = useRef(null);
    const descriptionRef = useRef(null);

    const analyzerRef = useRef(null);

    const featureRefs = useRef([]);
    const trustRef = useRef(null);

    const contextSweepRef = useRef(null);

    /*
    ============================================================
    HERO ANALYZER STATE

    button   → only Analyze Context
    expanded → Paste URL input expands
    ============================================================
    */

    const [introPhase, setIntroPhase] = useState("button");

    const allBars = [...bars, ...bars.slice().reverse()];

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            /*
            ========================================================
            INITIAL STATES
            ========================================================
            */

            /* -----------------------------------------------------
               BARS
            ----------------------------------------------------- */

            gsap.set(".hero-bar", {
                scaleY: 0.01,
                transformOrigin: "center bottom",
                opacity: 0,
            });

            /* -----------------------------------------------------
               NAVBAR
            ----------------------------------------------------- */

            gsap.set(navRef.current, {
                opacity: 0,
                y: -20,
            });

            /* -----------------------------------------------------
               ADS THAT UNDERSTAND
            ----------------------------------------------------- */

            gsap.set(headingRef.current, {
                opacity: 0,
                y: 48,
                scale: 0.985,
                filter: "blur(8px)",
            });

            /* -----------------------------------------------------
               THE CONTEXT
            ----------------------------------------------------- */

            gsap.set(contextRef.current, {
                opacity: 0,
                y: 34,
                scale: 0.98,
                filter: "blur(7px)",
            });

            /* -----------------------------------------------------
               PURPLE SWEEP
            ----------------------------------------------------- */

            gsap.set(contextSweepRef.current, {
                opacity: 0,
                scaleX: 0,
                transformOrigin: "center center",
            });

            /* -----------------------------------------------------
               DESCRIPTION
            ----------------------------------------------------- */

            gsap.set(descriptionRef.current, {
                opacity: 0,
                y: 20,
                filter: "blur(4px)",
            });

            /* -----------------------------------------------------
               ANALYZER

               IMPORTANT:
               The component itself handles the button → input
               expansion.

               Here we only animate the whole analyzer entering.
            ----------------------------------------------------- */

            gsap.set(analyzerRef.current, {
                opacity: 0,
                y: 28,
                scale: 0.92,
            });

            /* -----------------------------------------------------
               FEATURES
            ----------------------------------------------------- */

            gsap.set(featureRefs.current, {
                opacity: 0,
                y: 16,
            });

            gsap.set(".feature-icon", {
                opacity: 0,
                scale: 0,
                transformOrigin: "center center",
            });

            /* -----------------------------------------------------
               TRUST
            ----------------------------------------------------- */

            gsap.set(trustRef.current, {
                opacity: 0,
                y: 12,
            });

            /*
            ========================================================
            MASTER TIMELINE
            ========================================================
            */

            const tl = gsap.timeline({
                defaults: {
                    ease: "power3.out",
                },
            });

            /*
            ========================================================
            01 — BARS
            ========================================================
            */

            tl.to(
                ".hero-bar",
                {
                    scaleY: 1,
                    opacity: (index) =>
                        allBars[index]?.opacity || 0.8,
                    duration: 1.35,

                    stagger: {
                        each: 0.075,
                        from: "center",
                    },

                    ease: "power3.out",
                },
                0
            );

            /*
            ========================================================
            02 — BAR SETTLE
            ========================================================
            */

            tl.to(
                ".hero-bar",
                {
                    scaleX: 1.012,
                    duration: 0.55,

                    stagger: {
                        each: 0.045,
                        from: "center",
                    },

                    ease: "sine.out",
                },
                0.95
            );

            /*
            ========================================================
            03 — ADS THAT UNDERSTAND
            ========================================================
            */

            tl.to(
                headingRef.current,
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: "blur(0px)",
                    duration: 0.82,
                    ease: "power4.out",
                },
                1.70
            );

            /*
            ========================================================
            04 — THE CONTEXT
            ========================================================
            */

            tl.to(
                contextRef.current,
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: "blur(0px)",
                    duration: 0.72,
                    ease: "power4.out",
                },
                2
            );

            /*
            ========================================================
            05 — CONTEXT LIGHT SWEEP
            ========================================================
            */

            tl.to(
                contextSweepRef.current,
                {
                    opacity: 0.85,
                    scaleX: 1,
                    duration: 0.85,
                    ease: "power2.out",
                },
                2.72
            );

            tl.to(
                contextSweepRef.current,
                {
                    opacity: 0,
                    duration: 0.48,
                    ease: "power2.inOut",
                },
                3.42
            );

            /*
            ========================================================
            06 — DESCRIPTION
            ========================================================
            */

            tl.to(
                descriptionRef.current,
                {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    duration: 0.58,
                    ease: "power3.out",
                },
                2.75
            );

            /*
            ========================================================
            07 — ANALYZER ENTERS

            At this point the ContextAnalyzer is in:

                    [ Analyze Context ]

            ONLY.
            ========================================================
            */

            tl.to(
                analyzerRef.current,
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.72,
                    ease: "back.out(1.35)",
                },
                3.30
            );

            /*
            ========================================================
            08 — LET THE BUTTON BREATHE

            Give the viewer a tiny moment to register it.
            ========================================================
            */

            // tl.to(
            //     analyzerRef.current,
            //     {
            //         scale: 1.018,
            //         duration: 0.28,
            //         ease: "sine.inOut",
            //     },
            //     4.08
            // );

            // tl.to(
            //     analyzerRef.current,
            //     {
            //         scale: 1,
            //         duration: 0.22,
            //         ease: "sine.inOut",
            //     },
            //     4.36
            // );

            /*
            ========================================================
            09 — BUTTON → INPUT TRANSFORMATION

            This is the important part.

            We DON'T move the whole analyzer to the side.

            ContextAnalyzer changes from:

                    [ Analyze Context ]

            into:

            [ Paste URL...             ][ Analyze Context ]

            The input expands from the left and naturally pushes
            the button to its final position.
            ========================================================
            */

            tl.call(
                () => {
                    setIntroPhase("expanded");
                },
                [],
                4.62
            );

            /*
            ========================================================
            10 — WAIT FOR EXPANSION TO SETTLE
            ========================================================
            */

            tl.to(
                analyzerRef.current,
                {
                    y: -1,
                    duration: 0.45,
                    ease: "sine.inOut",
                },
                5.28
            );

            tl.to(
                analyzerRef.current,
                {
                    y: 0,
                    duration: 0.35,
                    ease: "sine.inOut",
                },
                5.73
            );

            /*
            ========================================================
            11 — FEATURES
            ========================================================
            */

            tl.to(
                featureRefs.current,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.48,

                    // stagger: 0.13,

                    ease: "power3.out",
                },
                5.92
            );

            /*
            ========================================================
            12 — FEATURE ICON POP
            ========================================================
            */

            tl.to(
                ".feature-icon",
                {
                    opacity: 1,
                    scale: 1.12,
                    duration: 0.28,

                    // stagger: 0.13,

                    ease: "back.out(2.1)",
                },
                5.92
            );

            tl.to(
                ".feature-icon",
                {
                    scale: 1,
                    duration: 0.2,

                    // stagger: 0.13,

                    ease: "power2.out",
                },
                5.92
            );

            /*
            ========================================================
            13 — TRUST
            ========================================================
            */

            tl.to(
                trustRef.current,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: "power3.out",
                },
                5.95
            );

            /*
            ========================================================
            14 — NAVBAR LAST

            Nothing above gets animated after this.
            Navbar is the final reveal.
            ========================================================
            */

            tl.to(
                navRef.current,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.72,
                    ease: "power3.out",
                },
                5.92
            );

            /*
            ========================================================
            15 — FINAL SOFT HERO SETTLE
            ========================================================
            */

            tl.to(
                analyzerRef.current,
                {
                    y: -2,
                    duration: 0.45,
                    ease: "sine.inOut",
                },
                6
            );

            tl.to(
                analyzerRef.current,
                {
                    y: 0,
                    duration: 0.45,
                    ease: "sine.inOut",
                },
                6.20
            );
        }, sectionRef);

        return () => {
            ctx.revert();
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="
                relative
                min-h-screen
                w-full
                overflow-hidden
                bg-black
                text-white
            "
        >
            {/* ========================================================
                BURNING GLOW
            ======================================================== */}

            <div
                ref={glowContainerRef}
                className="
                    pointer-events-none
                    absolute
                    inset-x-0
                    top-0
                    z-0
                    h-[720px]
                    w-full
                "
            >
                <BurningTopGlow />
            </div>

            {/* ========================================================
                BARS
            ======================================================== */}

            <div
                ref={barsContainerRef}
                className="
                    pointer-events-none
                    absolute
                    inset-x-0
                    bottom-0
                    z-[1]
                    h-[74vh]
                    min-h-[430px]
                "
            >
                <div className="absolute inset-0 flex items-end justify-center">
                    {allBars.map((bar, index) => (
                        <div
                            key={index}
                            className="
                                hero-bar
                                relative
                                flex-1
                                max-w-[100px]
                                will-change-transform
                            "
                            style={{
                                height: bar.h,
                            }}
                        >
                            <div
                                className="absolute inset-0"
                                style={{
                                    opacity: bar.opacity,
                                    background:
                                        "linear-gradient(180deg, #000000 0%, #24105c 32%, #4f46e5 100%)",
                                }}
                            />
                        </div>
                    ))}
                </div>

                <div
                    className="
                        absolute
                        inset-x-0
                        top-0
                        h-full
                    "
                    style={{
                        background:
                            "linear-gradient(to bottom, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.025) 48%, transparent 100%)",
                    }}
                />
            </div>

            {/* ========================================================
                NAVBAR — LAST
            ======================================================== */}

            <nav
                ref={navRef}
                className="
                    relative
                    z-30
                    mx-auto
                    flex
                    w-full
                    max-w-[1320px]
                    items-center
                    justify-between
                    px-6
                    py-6
                    sm:px-10
                    lg:px-16
                "
            >
                <a
                    href="#"
                    className="
                        text-[21px]
                        tracking-[-0.04em]
                        text-white/90
                        transition
                        duration-300
                        hover:text-white
                        sm:text-[24px]
                    "
                >
                    Context
                    <span className="font-semibold italic">
                        Ads
                    </span>
                </a>

                <div
                    className="
                        hidden
                        items-center
                        gap-10
                        text-[15px]
                        text-white/65
                        md:flex
                    "
                >
                    <a
                        href="#features"
                        className="transition hover:text-white"
                    >
                        Features
                    </a>

                    <a
                        href="#howitworks"
                        className="transition hover:text-white"
                    >
                        About
                    </a>

                    <a
                        href="#contact"
                        className="transition hover:text-white"
                    >
                        Contact
                    </a>
                </div>

                <a
                    href="https://github.com/jayant-dixit/Context-Aware-Advertising.git"
                    target="_blank"
                    className="
                        rounded-full
                        bg-white
                        px-5
                        py-3
                        text-sm
                        font-semibold
                        text-black
                        shadow-[0_0_25px_rgba(255,255,255,0.06)]
                        transition
                        duration-300
                        hover:scale-[1.03]
                        sm:px-5
                        sm:py-2
                    "
                >
                    Github
                </a>
            </nav>

            {/* ========================================================
                HERO CONTENT
            ======================================================== */}

            <div
                className="
                    relative
                    z-10
                    mx-auto
                    flex
                    w-full
                    max-w-[1200px]
                    flex-col
                    items-center
                    px-5
                    pt-[82px]
                    text-center
                    sm:pt-[100px]
                    lg:pt-[50px]
                "
            >
                {/* ====================================================
                    HEADINGS
                ==================================================== */}

                <h1
                    className="
                        flex
                        w-full
                        max-w-[1100px]
                        flex-col
                        items-center
                        justify-center
                        font-sora
                        font-semibold
                        tracking-[-0.055em]
                    "
                >
                    <span
                        ref={headingRef}
                        className="
                            block
                            text-[48px]
                            leading-[0.95]
                            text-white/90
                            sm:text-[68px]
                            md:text-[82px]
                            lg:text-[78px]
                            xl:text-[76px]
                            will-change-transform
                        "
                    >
                        Ads that Understand
                    </span>

                    <span
                        ref={contextRef}
                        className="
                            relative
                            mt-4
                            block
                            w-fit
                            font-serif
                            text-[42px]
                            font-medium
                            italic
                            leading-[0.95]
                            tracking-[-0.04em]
                            bg-gradient-to-r
                            from-violet-300
                            via-indigo-400
                            to-purple-500
                            bg-clip-text
                            text-transparent
                            drop-shadow-[0_0_22px_rgba(99,102,241,0.22)]
                            sm:text-[54px]
                            md:text-[64px]
                            lg:text-[62px]
                            xl:text-[60px]
                            will-change-transform
                        "
                    >
                        The Context

                        <span
                            ref={contextSweepRef}
                            className="
                                pointer-events-none
                                absolute
                                -bottom-2
                                left-[8%]
                                h-[2px]
                                w-[84%]
                                rounded-full
                                bg-gradient-to-r
                                from-transparent
                                via-indigo-400/60
                                to-transparent
                                blur-[2px]
                            "
                        />
                    </span>
                </h1>

                {/* ====================================================
                    DESCRIPTION
                ==================================================== */}

                <p
                    ref={descriptionRef}
                    className="
                        mt-7
                        max-w-[650px]
                        px-2
                        font-sora
                        text-[13px]
                        font-normal
                        leading-6
                        tracking-[0.01em]
                        text-white/55
                        sm:mt-8
                        sm:text-[15px]
                        sm:leading-7
                    "
                >
                    Understand the content. Find the context. Deliver the
                    right ad.
                </p>

                {/* ====================================================
                    ANALYZER

                    PHASE 1:
                    [ Analyze Context ]

                    PHASE 2:
                    [ Paste URL...              ][ Analyze Context ]
                ==================================================== */}

                <div
                    ref={analyzerRef}
                    className="
                        mt-8
                        w-fit
                        will-change-transform
                        sm:mt-10
                    "
                >
                    <ContextAnalyzer
                        url={url}
                        changeUrl={changeUrl}
                        startAnalysis={startAnalysis}
                        introPhase={introPhase}
                    />
                </div>

                {/* ====================================================
                    FEATURES
                ==================================================== */}

                <div
                    className="
                        mt-6
                        flex
                        flex-wrap
                        items-center
                        justify-center
                        gap-x-6
                        gap-y-3
                        text-[11px]
                        text-white/45
                        sm:mt-7
                        sm:text-[13px]
                    "
                >
                    {/* AI Context */}

                    <div
                        ref={(el) => {
                            featureRefs.current[0] = el;
                        }}
                        className="
                            flex
                            items-center
                            gap-2
                            transition-colors
                            duration-300
                            hover:text-indigo-300
                        "
                    >
                        <span
                            className="
                                feature-icon
                                flex
                                h-5
                                w-5
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-indigo-400/30
                                bg-indigo-500/10
                                text-[10px]
                                text-indigo-400
                            "
                        >
                            ✦
                        </span>

                        <span>
                            AI Context Analysis
                        </span>
                    </div>

                    {/* Divider */}

                    <span
                        ref={(el) => {
                            featureRefs.current[1] = el;
                        }}
                        className="
                            hidden
                            h-1
                            w-1
                            rounded-full
                            bg-white/20
                            sm:block
                        "
                    />

                    {/* Relevant Ads */}

                    <div
                        ref={(el) => {
                            featureRefs.current[2] = el;
                        }}
                        className="
                            flex
                            items-center
                            gap-2
                            transition-colors
                            duration-300
                            hover:text-indigo-300
                        "
                    >
                        <span
                            className="
                                feature-icon
                                flex
                                h-5
                                w-5
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-blue-400/30
                                bg-blue-500/10
                                text-[10px]
                                text-blue-400
                            "
                        >
                            ◎
                        </span>

                        <span>
                            Relevant Ad Opportunities
                        </span>
                    </div>

                    {/* Divider */}

                    <span
                        ref={(el) => {
                            featureRefs.current[3] = el;
                        }}
                        className="
                            hidden
                            h-1
                            w-1
                            rounded-full
                            bg-white/20
                            sm:block
                        "
                    />

                    {/* Non-Intrusive */}

                    <div
                        ref={(el) => {
                            featureRefs.current[4] = el;
                        }}
                        className="
                            flex
                            items-center
                            gap-2
                            transition-colors
                            duration-300
                            hover:text-indigo-300
                        "
                    >
                        <span
                            className="
                                feature-icon
                                flex
                                h-5
                                w-5
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-violet-400/30
                                bg-violet-500/10
                                text-[10px]
                                text-violet-400
                            "
                        >
                            ⚡
                        </span>

                        <span>
                            Non-Intrusive
                        </span>
                    </div>
                </div>

                {/* ====================================================
                    TRUST
                ==================================================== */}

                <div
                    ref={trustRef}
                    className="
                        mt-5
                        flex
                        items-center
                        gap-2
                        text-[10px]
                        tracking-wide
                        text-white/25
                        sm:text-[11px]
                    "
                >
                    <span
                        className="
                            h-1.5
                            w-1.5
                            rounded-full
                            bg-indigo-400
                            shadow-[0_0_10px_rgba(99,102,241,0.8)]
                        "
                    />

                    Context-aware advertising powered by AI
                </div>
            </div>
        </section>
    );
}