import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Lens } from "./Card.jsx";
import { cn } from "../lib/utils.js";

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   CARDS
============================================================ */

const cards = [
    {
        image: "/p1.png",
        title: "AI Context Understanding",
        description: "Turn content into meaningful context.",
    },
    {
        image: "/p2.png",
        title: "Multimodal Analysis",
        description:
            "Understand video through vision, audio, and text.",
    },
    {
        image: "/p3.png",
        title: "Relevant Ad Matching",
        description:
            "Connect every context with its ideal ad.",
    },
    {
        image: "/p4.png",
        title: "Semantic Understanding",
        description:
            "Understand meaning, not just keywords.",
    },
    {
        image: "/p5.png",
        title: "Smart Ad Opportunities",
        description:
            "Discover moments where ads naturally belong.",
    },
    {
        image: "/p6.png",
        title: "Non-Intrusive Advertising",
        description:
            "Keep advertising relevant, seamless, and natural.",
    },
];

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function Features() {
    const sectionRef = useRef(null);

    const headingRef = useRef(null);
    const headingWordsRef = useRef([]);
    const subtitleRef = useRef(null);

    const cardsRef = useRef([]);

    const topGlowRef = useRef(null);
    const centerGlowRef = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;

        if (!section) return;

        const ctx = gsap.context(() => {
            /*
            ========================================================
            INITIAL STATES
            ========================================================
            */

            /* ========================================================
   INITIAL TEXT STATES
======================================================== */

            gsap.set(headingWordsRef.current, {
                opacity: 0,
                y: 40,
                rotateX: -30,
                filter: "blur(10px)",
                transformOrigin: "center bottom",
            });

            gsap.set(subtitleRef.current, {
                opacity: 0,
                y: 24,
                filter: "blur(4px)",
            });

            /*
             * IMPORTANT:
             * Explicitly animate all six cards.
             * No filtering / slicing.
             */

            gsap.set(cardsRef.current, {
                opacity: 0,
                y: 40,
                scale: 0.96,
            });

            /*
            ========================================================
            SECTION INTRO
            ========================================================
            */

            const intro = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top 76%",
                    once: true,
                },
            });

            /*
            --------------------------------------------------------
            Heading
            --------------------------------------------------------
            */

            /* ========================================================
   HEADING — WORD BY WORD REVEAL
======================================================== */

            intro.to(
                headingWordsRef.current,
                {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    filter: "blur(0px)",
                    duration: 0.75,
                    stagger: 0.09,
                    ease: "power3.out",
                },
                0
            );

            /* ========================================================
               SUBTITLE — SIMPLE SLIDE UP
            ======================================================== */

            intro.to(
                subtitleRef.current,
                {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    duration: 0.65,
                    ease: "power3.out",
                },
                ">0.12"
            );

            /*
            --------------------------------------------------------
            SIX CARD STAGGER
            --------------------------------------------------------

            1 → 2 → 3
            4 → 5 → 6

            The grid itself controls the visual arrangement.
            GSAP simply reveals all six DOM elements in order.
            --------------------------------------------------------
            */

            intro.to(
                cardsRef.current,
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.72,
                    stagger: {
                        each: 0.12,
                        from: "start",
                    },
                    ease: "power3.out",
                },
                0.42
            );

            /*
            ========================================================
            BACKGROUND ATMOSPHERE
            ========================================================
            */

            gsap.to(topGlowRef.current, {
                x: 25,
                y: 15,
                scale: 1.05,
                duration: 6,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });

            gsap.to(centerGlowRef.current, {
                x: -20,
                y: 18,
                scale: 1.07,
                duration: 7,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });
        }, section);

        return () => {
            ctx.revert();
        };
    }, []);

    return (
        <section
            id="features"
            ref={sectionRef}
            className="
                relative
                bg-black
                mt-80
                text-white
            "
        >
            {/* ========================================================
                BACKGROUND ATMOSPHERE
            ======================================================== */}

            <div className="pointer-events-none absolute inset-0">
                {/* Top glow */}

                <div
                    ref={topGlowRef}
                    className="
                        absolute
                        left-1/2
                        top-[7%]
                        h-[500px]
                        w-[900px]
                        -translate-x-1/2
                        rounded-full
                        bg-indigo-600/[0.07]
                        blur-[150px]
                        will-change-transform
                    "
                />

                {/* Center glow */}

                <div
                    ref={centerGlowRef}
                    className="
                        absolute
                        left-1/2
                        top-[32%]
                        h-[480px]
                        w-[760px]
                        -translate-x-1/2
                        rounded-full
                        bg-violet-600/[0.045]
                        blur-[145px]
                        will-change-transform
                    "
                />

                {/* Bottom glow */}

                <div
                    className="
                        absolute
                        bottom-[-180px]
                        left-1/2
                        h-[400px]
                        w-[700px]
                        -translate-x-1/2
                        rounded-full
                        bg-purple-700/[0.035]
                        blur-[150px]
                    "
                />
            </div>

            {/* ========================================================
                HEADING
            ======================================================== */}

            <div
                className="
                    relative
                    z-10
                    mx-auto
                    mb-16
                    w-full
                    max-w-[1450px]
                    px-5
                    text-center
                "
            >
                <div
                    ref={headingRef}
                    className="
                        flex
                        flex-col
                        items-center
                    "
                >
                    {/* Eyebrow */}

                    <div
                        className="
              mb-3
              inline-flex
              items-center
              gap-2.5
              text-[10px]
              font-medium
              uppercase
              tracking-[0.24em]
              text-violet-300
              sm:mb-3.5
              sm:gap-3
              sm:text-[11px]
            "
                    >
                        <span
                            className="
                h-px
                w-8
                bg-gradient-to-r
                from-transparent
                to-violet-500
                sm:w-12
              "
                        />

                        <span>Intelligence Layer</span>

                        <span
                            className="
                h-px
                w-8
                bg-gradient-to-l
                from-transparent
                to-violet-500
                sm:w-12
              "
                        />
                    </div>

                    {/* ==================================================
                        ONE-LINE HEADING
                    ================================================== */}

                    <h1
                        ref={headingRef}
                        style={{
                            perspective: "800px",
                        }}
                        className="
        whitespace-nowrap
        font-sora
        text-[32px]
        font-semibold
        leading-none
        tracking-[-0.055em]
        text-white
        sm:text-[44px]
        md:text-[52px]
        lg:text-[58px]
        xl:text-[62px]
    "
                    >
                        <span
                            ref={(el) => {
                                headingWordsRef.current[0] = el;
                            }}
                            className="
            inline-block
            will-change-transform
        "
                        >
                            Intelligence
                        </span>{" "}

                        <span
                            ref={(el) => {
                                headingWordsRef.current[1] = el;
                            }}
                            className="
            inline-block
            will-change-transform
        "
                        >
                            Behind
                        </span>{" "}

                        <span
                            ref={(el) => {
                                headingWordsRef.current[2] = el;
                            }}
                            className="
            inline-block
            font-serif
            font-medium
            italic
            bg-gradient-to-r
            from-indigo-400
            via-violet-400
            to-purple-400
            bg-clip-text
            text-transparent
            drop-shadow-[0_0_24px_rgba(139,92,246,0.18)]
            will-change-transform
        "
                        >
                            Every
                        </span>{" "}

                        <span
                            ref={(el) => {
                                headingWordsRef.current[3] = el;
                            }}
                            className="
            inline-block
            font-serif
            font-medium
            italic
            bg-gradient-to-r
            from-indigo-400
            via-violet-400
            to-purple-400
            bg-clip-text
            text-transparent
            drop-shadow-[0_0_24px_rgba(139,92,246,0.18)]
            will-change-transform
        "
                        >
                            Ad
                        </span>
                    </h1>
                </div>

                {/* Subtitle */}

                <p
                    ref={subtitleRef}
                    className="
                        mx-auto
                        mt-5
                        max-w-2xl
                        font-sora
                        text-sm
                        leading-7
                        text-white/45
                        sm:text-base
                    "
                >
                    From understanding content to discovering the right
                    advertising opportunities.
                </p>
            </div>

            {/* ========================================================
                SIX CARD GRID
            ======================================================== */}

            <div
                className="
                    relative
                    z-10
                    mx-auto
                    grid
                    w-full
                    max-w-[1250px]
                    grid-cols-1
                    gap-7
                    px-5
                    sm:gap-8
                    md:grid-cols-2
                    lg:grid-cols-3
                "
            >
                {cards.map((card, index) => (
                    <IntelligenceCard
                        key={`${card.title}-${index}`}
                        card={card}
                        index={index}
                        cardRef={(element) => {
                            cardsRef.current[index] = element;
                        }}
                    />
                ))}
            </div>
        </section>
    );
}

/* ============================================================
   INDIVIDUAL INTELLIGENCE CARD
============================================================ */

function IntelligenceCard({
    card,
    index,
    cardRef,
}) {
    const [hovering, setHovering] = useState(false);

    const cardElementRef = useRef(null);
    const imageRef = useRef(null);
    const glowRef = useRef(null);

    /* ============================================================
       COMBINED CARD REF
    ============================================================ */

    const setCardRefs = (element) => {
        cardElementRef.current = element;

        if (cardRef) {
            cardRef(element);
        }
    };

    /* ============================================================
       MOUSE MOVE
    ============================================================ */

    const handleMouseMove = (event) => {
        const card = cardElementRef.current;

        if (!card) return;

        /*
         * Don't run desktop-style 3D interaction
         * on touch devices.
         */

        if (
            window.matchMedia(
                "(pointer: coarse)"
            ).matches
        ) {
            return;
        }

        const rect = card.getBoundingClientRect();

        const x =
            (event.clientX - rect.left) /
            rect.width;

        const y =
            (event.clientY - rect.top) /
            rect.height;

        /*
         * Very subtle tilt.
         */

        const rotateY =
            (x - 0.5) * 2.2;

        const rotateX =
            (0.5 - y) * 2.2;

        gsap.to(card, {
            rotateX,
            rotateY,
            duration: 0.45,
            ease: "power2.out",
            transformPerspective: 900,
            transformOrigin: "center center",
            overwrite: true,
        });

        /*
         * Image moves only a few pixels.
         */

        gsap.to(imageRef.current, {
            x: (x - 0.5) * 7,
            y: (y - 0.5) * 7,
            scale: 1.025,
            duration: 0.5,
            ease: "power2.out",
            overwrite: true,
        });

        /*
         * Directional purple light.
         */

        gsap.to(glowRef.current, {
            x: (x - 0.5) * 45,
            y: (y - 0.5) * 35,
            opacity: 0.72,
            duration: 0.55,
            ease: "power2.out",
            overwrite: true,
        });
    };

    /* ============================================================
       MOUSE ENTER
    ============================================================ */

    const handleMouseEnter = () => {
        // setHovering(true);

        if (!cardElementRef.current) return;

        gsap.to(cardElementRef.current, {
            y: -6,
            duration: 0.45,
            ease: "power3.out",
            overwrite: true,
        });

        gsap.to(glowRef.current, {
            opacity: 0.7,
            duration: 0.4,
            ease: "power2.out",
        });
    };

    /* ============================================================
       MOUSE LEAVE
    ============================================================ */

    const handleMouseLeave = () => {
        // setHovering(false);

        if (!cardElementRef.current) return;

        gsap.to(cardElementRef.current, {
            x: 0,
            y: 0,
            rotateX: 0,
            rotateY: 0,
            duration: 0.65,
            ease: "power3.out",
            overwrite: true,
        });

        gsap.to(imageRef.current, {
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power3.out",
            overwrite: true,
        });

        gsap.to(glowRef.current, {
            x: 0,
            y: 0,
            opacity: 0,
            duration: 0.65,
            ease: "power3.out",
            overwrite: true,
        });
    };

    return (
        <div
            ref={setCardRefs}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="
                group
                relative
                mx-auto
                w-full
                max-w-sm
                will-change-transform
                [transform-style:preserve-3d]
            "
        >
            {/* ====================================================
                CURSOR DIRECTIONAL GLOW
            ===================================================== */}

            <div
                ref={glowRef}
                className="
                    pointer-events-none
                    absolute
                    left-1/2
                    top-1/2
                    z-0
                    h-48
                    w-48
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-violet-500/[0.18]
                    opacity-0
                    blur-[75px]
                    will-change-transform
                "
            />

            {/* ====================================================
                CARD
            ===================================================== */}

            <div
                className="
                    relative
                    overflow-hidden
                    rounded-[28px]
                    border
                    border-white/[0.08]
                    bg-gradient-to-br
                    from-[#17102D]
                    via-[#0D0B18]
                    to-[#070810]
                    p-7
                    shadow-[0_25px_70px_rgba(0,0,0,0.45)]
                    transition-[border-color,box-shadow]
                    duration-500
                    group-hover:border-violet-400/[0.30]
                    group-hover:shadow-[0_30px_90px_rgba(79,70,229,0.20)]
                    sm:p-8
                "
            >
                {/* =================================================
                    TOP GLOW
                ================================================== */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        -top-28
                        left-1/2
                        h-52
                        w-72
                        -translate-x-1/2
                        rounded-full
                        bg-violet-600/[0.16]
                        blur-[70px]
                        transition-all
                        duration-700
                        group-hover:bg-violet-500/[0.27]
                    "
                />

                {/* =================================================
                    SIDE GLOW
                ================================================== */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-24
                        top-20
                        h-40
                        w-40
                        rounded-full
                        bg-blue-600/[0.09]
                        blur-[70px]
                        transition-all
                        duration-700
                        group-hover:bg-blue-500/[0.17]
                    "
                />

                {/* =================================================
                    BOTTOM GLOW
                ================================================== */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        -bottom-24
                        left-1/3
                        h-36
                        w-48
                        rounded-full
                        bg-violet-600/[0.05]
                        blur-[65px]
                        transition-all
                        duration-700
                        group-hover:bg-violet-500/[0.12]
                    "
                />

                {/* =================================================
                    BEAMS
                ================================================== */}

                <Beams />

                {/* =================================================
                    CONTENT
                ================================================== */}

                <div onMouseMove={handleMouseMove}
                    onMouseEnter={() => setHovering(true)}
                    onMouseLeave={() => setHovering(false)}
                    className="relative z-10">

                    {/* =================================================
                        IMAGE
                    ================================================== */}

                    <Lens
                        hovering={hovering}
                        setHovering={setHovering}
                    >
                        <div
                            className="
                                relative
                                overflow-hidden
                                rounded-[21px]
                                bg-black
                            "
                        >
                            <img
                                ref={imageRef}
                                src={card.image}
                                alt={card.title}
                                width={500}
                                height={500}
                                className="
                                    aspect-[1.45/1]
                                    w-full
                                    rounded-[21px]
                                    object-cover
                                    will-change-transform
                                "
                            />

                            {/* Image shading */}

                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    inset-0
                                    rounded-[21px]
                                    bg-gradient-to-t
                                    from-black/[0.18]
                                    via-transparent
                                    to-white/[0.025]
                                "
                            />

                            {/* Image hover light */}

                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    inset-0
                                    rounded-[21px]
                                    bg-[radial-gradient(circle_at_50%_0%,rgba(167,139,250,0.13),transparent_48%)]
                                    opacity-0
                                    transition-opacity
                                    duration-500
                                    group-hover:opacity-100
                                "
                            />
                        </div>
                    </Lens>

                    {/* =================================================
                        TEXT
                    ================================================== */}

                    <motion.div
                        animate={{
                            filter: hovering
                                ? "blur(0.25px)"
                                : "blur(0px)",
                        }}
                        transition={{
                            duration: 0.25,
                        }}
                        className="
                            relative
                            z-20
                            px-2
                            pb-3
                            pt-5
                        "
                    >
                        {/* Number */}

                        <div
                            className="
                                mb-2
                                text-[9px]
                                font-semibold
                                uppercase
                                tracking-[0.22em]
                                text-violet-400/65
                            "
                        >
                            0{index + 1}
                        </div>

                        {/* Title */}

                        <h2
                            className="
                                font-sora
                                text-left
                                text-[20px]
                                font-semibold
                                leading-tight
                                tracking-[-0.025em]
                                text-white
                                transition-colors
                                duration-300
                                group-hover:text-violet-50
                            "
                        >
                            {card.title}
                        </h2>

                        {/* Description */}

                        <p
                            className="
                                mt-3
                                max-w-[320px]
                                text-left
                                font-sora
                                text-[13px]
                                leading-6
                                text-white/50
                                transition-colors
                                duration-300
                                group-hover:text-white/60
                            "
                        >
                            {card.description}
                        </p>
                    </motion.div>
                </div>

                {/* =================================================
                    TOP EDGE
                ================================================== */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        inset-x-8
                        top-0
                        h-px
                        bg-gradient-to-r
                        from-transparent
                        via-violet-300/0
                        to-transparent
                        transition-all
                        duration-500
                        group-hover:via-violet-300/60
                    "
                />

                {/* =================================================
                    BOTTOM EDGE
                ================================================== */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        inset-x-14
                        bottom-0
                        h-px
                        bg-gradient-to-r
                        from-transparent
                        via-violet-500/0
                        to-transparent
                        transition-all
                        duration-500
                        group-hover:via-violet-500/30
                    "
                />
            </div>
        </div>
    );
}

/* ============================================================
   BEAMS
============================================================ */

const Beams = () => {
    return (
        <svg
            width="380"
            height="315"
            viewBox="0 0 380 315"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="
                pointer-events-none
                absolute
                left-1/2
                top-0
                z-[1]
                w-full
                -translate-x-1/2
            "
        >
            {/* Purple beam */}

            <g
                style={{
                    mixBlendMode: "plus-lighter",
                }}
                opacity="0.65"
            >
                <circle
                    cx="34"
                    cy="52"
                    r="114"
                    fill="#4C1D95"
                    filter="url(#beamPurple1)"
                />
            </g>

            {/* Violet beam */}

            <g
                style={{
                    mixBlendMode: "plus-lighter",
                }}
                opacity="0.35"
            >
                <circle
                    cx="332"
                    cy="24"
                    r="102"
                    fill="#7C3AED"
                    filter="url(#beamPurple2)"
                />
            </g>

            {/* Indigo beam */}

            <g
                style={{
                    mixBlendMode: "plus-lighter",
                }}
                opacity="0.30"
            >
                <circle
                    cx="191"
                    cy="53"
                    r="102"
                    fill="#4F46E5"
                    filter="url(#beamBlue)"
                />
            </g>

            <defs>
                <filter
                    id="beamPurple1"
                    x="-192"
                    y="-174"
                    width="452"
                    height="452"
                    filterUnits="userSpaceOnUse"
                >
                    <feGaussianBlur stdDeviation="56" />
                </filter>

                <filter
                    id="beamPurple2"
                    x="70"
                    y="-238"
                    width="524"
                    height="524"
                    filterUnits="userSpaceOnUse"
                >
                    <feGaussianBlur stdDeviation="80" />
                </filter>

                <filter
                    id="beamBlue"
                    x="-71"
                    y="-209"
                    width="524"
                    height="524"
                    filterUnits="userSpaceOnUse"
                >
                    <feGaussianBlur stdDeviation="80" />
                </filter>
            </defs>
        </svg>
    );
};

/* ============================================================
   OPTIONAL RAYS COMPONENT
   Kept available if used elsewhere in the project.
============================================================ */

const Rays = ({ className }) => {
    return (
        <svg
            width="380"
            height="397"
            viewBox="0 0 380 397"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn(
                "pointer-events-none absolute left-0 top-0 z-[1]",
                className
            )}
        >
            <g
                style={{
                    mixBlendMode: "plus-lighter",
                }}
                opacity="0.65"
            >
                <path
                    d="M-37 -76L-18 -90L242 162L207 182L-37 -76Z"
                    fill="url(#ray1)"
                />
            </g>

            <g
                style={{
                    mixBlendMode: "plus-lighter",
                }}
                opacity="0.35"
            >
                <path
                    d="M-100 -65L-69 -92L194 157L139 197L-100 -65Z"
                    fill="url(#ray2)"
                />
            </g>

            <g
                style={{
                    mixBlendMode: "plus-lighter",
                }}
                opacity="0.25"
            >
                <path
                    d="M164 -89C173 -72 81 2 35 30C-11 58 -106 97 -116 81C-125 64 -45 -3 1 -31C47 -59 155 -106 164 -89Z"
                    fill="#8B5CF6"
                />
            </g>

            <defs>
                <linearGradient
                    id="ray1"
                    x1="-57"
                    y1="-134"
                    x2="403"
                    y2="351"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop
                        offset="0.2"
                        stopColor="#A78BFA"
                    />

                    <stop
                        offset="0.8"
                        stopColor="#6366F1"
                        stopOpacity="0"
                    />
                </linearGradient>

                <linearGradient
                    id="ray2"
                    x1="-106"
                    y1="-138"
                    x2="359"
                    y2="342"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop
                        offset="0.2"
                        stopColor="#8B5CF6"
                    />

                    <stop
                        offset="0.8"
                        stopColor="#4F46E5"
                        stopOpacity="0"
                    />
                </linearGradient>
            </defs>
        </svg>
    );
};