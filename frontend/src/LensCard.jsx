import { useState } from "react";
import { motion } from "motion/react";
import { Lens } from "./Card";
import { cn } from "./lib/utils.js";

const cards = [
    {
        image: "/p1.png",
        title: "AI Context Understanding",
        description: "Turn content into meaningful context.",
    },
    {
        image: "/p2.png",
        title: "Multimodal Analysis",
        description: "Understand video through vision, audio, and text.",
    },
    {
        image: "/p3.png",
        title: "Relevant Ad Matching",
        description: "Connect every context with its ideal ad.",
    },
    {
        image: "/p4.png",
        title: "Semantic Understanding",
        description: "Understand meaning, not just keywords.",
    },
    {
        image: "/p5.png",
        title: "Smart Ad Opportunities",
        description: "Discover moments where ads naturally belong.",
    },
    {
        image: "/p6.png",
        title: "Non-Intrusive Advertising",
        description: "Keep advertising relevant, seamless, and natural.",
    },
];

export default function LensDemo() {
    const [hovering, setHovering] = useState(false);

    return (
        <section className="relative overflow-hidden py-44">

            {/* ============================================
                SECTION BACKGROUND GLOW
            ============================================= */}
            <div
                className="
                    pointer-events-none
                    absolute left-1/2 top-[10%]
                    h-[500px] w-[900px]
                    -translate-x-1/2
                    rounded-full
                    bg-indigo-600/[0.07]
                    blur-[150px]
                "
            />

            <div
                className="
                    pointer-events-none
                    absolute left-1/2 top-[30%]
                    h-[400px] w-[700px]
                    -translate-x-1/2
                    rounded-full
                    bg-violet-600/[0.05]
                    blur-[140px]
                "
            />

            {/* ============================================
                SECTION HEADING
            ============================================= */}
            <div className="relative z-10 mx-auto mb-16 max-w-3xl px-5 text-center">

                <h1
                    className="
                        
                        text-4xl
                        font-semibold
                        tracking-[-0.04em]
                        text-white
                        sm:text-5xl
                        md:text-6xl
                        italic
                    "
                >
                    Intelligence Behind Every Ad
                </h1>

                <p
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


            {/* ============================================
                CARDS
            ============================================= */}
            <div
                className="
                    relative z-10
                    mx-auto
                    grid
                    max-w-[1250px]
                    grid-cols-1
                    gap-8
                    px-5
                    md:grid-cols-2
                    lg:grid-cols-3
                "
            >

                {cards.map((card, index) => (
                    <div
                        key={index}
                        className="
                            group
                            relative
                            mx-auto
                            w-full
                            max-w-sm
                            overflow-hidden
                            rounded-[28px]

                            border
                            border-white/[0.08]

                            bg-gradient-to-br
                            from-[#17102D]
                            via-[#0D0B18]
                            to-[#070810]

                            p-8

                            shadow-[0_25px_70px_rgba(0,0,0,0.45)]

                            transition-all
                            duration-500

                            hover:-translate-y-2
                            hover:border-violet-400/[0.25]
                            hover:shadow-[0_30px_90px_rgba(79,70,229,0.18)]
                        "
                    >

                        {/* Top purple glow */}
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
                                bg-violet-600/[0.18]
                                blur-[70px]
                                transition-all
                                duration-700
                                group-hover:bg-violet-500/[0.28]
                            "
                        />

                        {/* Blue side glow */}
                        <div
                            className="
                                pointer-events-none
                                absolute
                                -right-24
                                top-20
                                h-40
                                w-40
                                rounded-full
                                bg-blue-600/[0.10]
                                blur-[70px]
                                transition-all
                                duration-700
                                group-hover:bg-blue-500/[0.18]
                            "
                        />

                        {/* Animated beams */}
                        <Beams />

                        {/* Card content */}
                        <div className="relative z-10">

                            <Lens
                                hovering={hovering}
                                setHovering={setHovering}
                            >
                                <img
                                    src={card.image}
                                    alt={card.title}
                                    width={500}
                                    height={500}
                                    className="
                                        aspect-[1.45/1]
                                        w-full
                                        rounded-[21px]
                                        object-cover

                                        transition-transform
                                        duration-700

                                        group-hover:scale-[1.02]
                                    "
                                />
                            </Lens>


                            {/* Text */}
                            <motion.div
                                animate={{
                                    filter: hovering
                                        ? "blur(1.5px)"
                                        : "blur(0px)",
                                }}
                                className="
                                    relative
                                    z-20
                                    px-2
                                    pb-3
                                    pt-5
                                "
                            >

                                <h2
                                    className="
                                        font-sora
                                        text-left
                                        text-[21px]
                                        font-semibold
                                        tracking-[-0.025em]
                                        text-white
                                    "
                                >
                                    {card.title}
                                </h2>

                                <p
                                    className="
                                        mt-3
                                        max-w-[320px]
                                        text-left
                                        font-sora
                                        text-[13px]
                                        leading-6
                                        text-white/50
                                    "
                                >
                                    {card.description}
                                </p>

                            </motion.div>

                        </div>

                    </div>
                ))}

            </div>
        </section>
    );
}


/* ============================================================
   PURPLE / BLUE BEAMS
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

            {/* Deep purple */}
            <g filter="url(#beamPurple1)">
                <circle
                    cx="34"
                    cy="52"
                    r="114"
                    fill="#4C1D95"
                />
            </g>

            {/* Electric violet */}
            <g filter="url(#beamPurple2)">
                <circle
                    cx="332"
                    cy="24"
                    r="102"
                    fill="#7C3AED"
                />
            </g>

            {/* Indigo blue */}
            <g filter="url(#beamBlue)">
                <circle
                    cx="191"
                    cy="53"
                    r="102"
                    fill="#4F46E5"
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
   PURPLE LIGHT RAYS
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

            {/* Main violet ray */}
            <g
                style={{ mixBlendMode: "plus-lighter" }}
                opacity="0.65"
            >
                <path
                    d="M-37 -76L-18 -90L242 162L207 182L-37 -76Z"
                    fill="url(#ray1)"
                />
            </g>

            {/* Secondary ray */}
            <g
                style={{ mixBlendMode: "plus-lighter" }}
                opacity="0.35"
            >
                <path
                    d="M-100 -65L-69 -92L194 157L139 197L-100 -65Z"
                    fill="url(#ray2)"
                />
            </g>

            {/* Soft diagonal highlight */}
            <g
                style={{ mixBlendMode: "plus-lighter" }}
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