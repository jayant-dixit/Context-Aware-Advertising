// import React from "react";
// import {
//     Link2,
//     ArrowRight,
//     Sparkles,
//     Target,
//     Zap,
// } from "lucide-react";

// const ContextAnalyzer = () => {
//     const handleAnalyze = (e) => {
//         e.preventDefault();
//         console.log("Analyzing video...");
//     };

//     return (
//         <div className="mx-auto w-full max-w-3xl">
//             {/* Small Label */}
//             {/* <div className="mb-3 flex items-center justify-center gap-2">
//                 <Sparkles className="h-3.5 w-3.5 text-[#E85002]" />

//                 <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/50">
//                     Try ContextAds
//                 </span>
//             </div> */}

//             {/* Glassmorphism Card */}
//             <div
//                 className="
//                     relative overflow-hidden rounded-[24px]
//                     borde border-white/[0.14]
//                     bg-transparent
//                     p-3
//                     backdrop-blur-2xl
//                     shadow-[0_25px_80px_rgba(0,0,0,0.45)]
//                 "
//             >
//                 {/* Subtle orange glow */}
//                 {/* <div
//                     className="
//                         pointer-events-none absolute
//                         -right-20 -top-20
//                         h-40 w-40
//                         rounded-full
//                         bg-[#E85002]/10
//                         blur-3xl
//                     "
//                 /> */}

//                 {/* Top glass highlight */}
//                 {/* <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" /> */}

//                 <form onSubmit={handleAnalyze} className="relative">
//                     <div className="flex flex-col gap-2 sm:flex-row">

//                         {/* URL Input */}
//                         <div
//                             className="
//                                 group flex min-h-[62px] flex-1
//                                 items-center
//                                 rounded-[18px]
//                                 border border-white/[0.13]
//                                 bg-transparent
//                                 px-5
//                                 backdrop-blur-xl
//                                 transition-all duration-300
//                                 focus-within:border-[#E85002]/50
//                                 focus-within:bg-black/40
//                                 focus-within:shadow-[0_0_30px_rgba(232,80,2,0.08)]
//                             "
//                         >
//                             <Link2
//                                 className="
//                                     mr-3 h-[19px] w-[19px] shrink-0
//                                     text-white/30
//                                     transition-colors
//                                     rotate-45
//                                     group-focus-within:text-[#E85002]
//                                 "
//                                 strokeWidth={1.7}
//                             />

//                             <input
//                                 type="url"
//                                 required
//                                 placeholder="Paste a YouTube video URL"
//                                 aria-label="YouTube video URL"
//                                 className="
//                                     w-full bg-transparent
//                                     text-[15px] text-white
//                                     outline-none
//                                     placeholder:text-white/35
//                                 "
//                             />
//                         </div>

//                         {/* Analyze Button */}
//                         <button
//                             type="submit"
//                             className="
//                 group flex min-h-[62px]
//                 items-center justify-center gap-2
//                 rounded-[18px]
//                 bg-[#E85002]
//                 px-7
//                 text-[14px] font-semibold text-white
//                 shadow-[0_8px_25px_rgba(232,80,2,0.18)]
//                 transition-all duration-300
//                 hover:bg-[#f45b0b]
//                 hover:shadow-[0_8px_35px_rgba(232,80,2,0.3)]
//                 active:scale-[0.98] cursor-pointer
//               "
//                         >
//                             Analyze Context

//                             <ArrowRight
//                                 className="
//                   h-4 w-4
//                   transition-transform duration-300
//                   group-hover:translate-x-1
//                 "
//                                 strokeWidth={2}
//                             />
//                         </button>
//                     </div>
//                 </form>

//                 {/* Feature Indicators */}
//                 <div className="relative flex flex-wrap items-center gap-x-4 gap-y-2 px-3 pb-1 pt-4">
//                     <div className="flex items-center gap-1.5 text-[11px] text-white/45">
//                         <Sparkles
//                             className="h-3 w-3 text-[#E85002]"
//                             strokeWidth={1.8}
//                         />
//                         AI Context Analysis
//                     </div>

//                     <span className="text-white/15">•</span>

//                     <div className="flex items-center gap-1.5 text-[11px] text-white/45">
//                         <Target
//                             className="h-3 w-3 text-[#E85002]"
//                             strokeWidth={1.8}
//                         />
//                         Relevant Ad Opportunities
//                     </div>

//                     <span className="text-white/15">•</span>

//                     <div className="flex items-center gap-1.5 text-[11px] text-white/45">
//                         <Zap
//                             className="h-3 w-3 text-[#E85002]"
//                             strokeWidth={1.8}
//                         />
//                         Non-Intrusive
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ContextAnalyzer;


import React from "react";
import {
    Link2,
    ArrowRight,
    Sparkles,
    Target,
    Zap,
} from "lucide-react";

const ContextAnalyzer = ({url, changeUrl, startAnalysis}) => {
    const handleAnalyze = (e) => {
        e.preventDefault();
        console.log("Analyzing video...");
    };

    return (
        <div className="relative mx-auto w-full max-w-[900px]">

            {/* =====================================================
                AMBIENT GLOW BEHIND ANALYZER
            ====================================================== */}
            <div
                className="
                    pointer-events-none absolute
                    left-1/2 top-1/2
                    h-[260px] w-[620px]
                    -translate-x-1/2 -translate-y-1/2
                    rounded-full
                    bg-indigo-600/[0.08]
                    blur-[110px]
                "
            />

            <div
                className="
                    pointer-events-none absolute
                    left-1/2 top-1/2
                    h-[160px] w-[420px]
                    -translate-x-1/2 -translate-y-1/2
                    rounded-full
                    bg-blue-500/[0.07]
                    blur-[80px]
                "
            />


            {/* =====================================================
                MAIN GLASS CONTAINER
            ====================================================== */}
            <div
                className="
                    group/card
                    relative overflow-hidden
                    rounded-[26px]
                    border border-white/[0.11]
                    bg-black/25
                    p-[10px]
                    backdrop-blur-2xl
                    shadow-[0_25px_90px_rgba(0,0,0,0.5)]
                    transition-all duration-500
                    hover:border-indigo-400/[0.18]
                    hover:shadow-[0_30px_100px_rgba(30,64,175,0.10)]
                "
            >

                {/* =================================================
                    TOP SHIMMER LINE
                ================================================= */}
                <div
                    className="
                        pointer-events-none absolute
                        inset-x-10 top-0
                        h-px
                        bg-gradient-to-r
                        from-transparent
                        via-indigo-400/50
                        to-transparent
                        opacity-60
                    "
                />

                {/* =================================================
                    SUBTLE INTERNAL GLOW
                ================================================= */}
                <div
                    className="
                        pointer-events-none absolute
                        -right-24 -top-24
                        h-48 w-48
                        rounded-full
                        bg-indigo-500/[0.08]
                        blur-[70px]
                    "
                />

                <div
                    className="
                        pointer-events-none absolute
                        -left-24 -bottom-24
                        h-48 w-48
                        rounded-full
                        bg-blue-500/[0.06]
                        blur-[70px]
                    "
                />


                {/* =================================================
                    FORM
                ================================================= */}
                <form onSubmit={startAnalysis} className="relative z-10">

                    <div className="flex flex-col gap-2.5 sm:flex-row">


                        {/* =================================================
                            URL INPUT
                        ================================================= */}
                        <div
                            className="
                                group/input
                                relative flex min-h-[64px]
                                flex-1 items-center
                                overflow-hidden
                                rounded-[19px]
                                border border-white/[0.12]
                                bg-white/[0.025]
                                px-5
                                backdrop-blur-xl
                                transition-all duration-300

                                hover:border-white/[0.18]
                                hover:bg-white/[0.035]

                                focus-within:border-indigo-400/40
                                focus-within:bg-indigo-500/[0.035]
                                focus-within:shadow-[0_0_35px_rgba(79,70,229,0.10)]
                            "
                        >

                            {/* Input inner glow */}
                            <div
                                className="
                                    pointer-events-none absolute
                                    inset-0
                                    rounded-[19px]
                                    bg-gradient-to-r
                                    from-indigo-500/[0.04]
                                    via-transparent
                                    to-blue-500/[0.04]
                                    opacity-0
                                    transition-opacity duration-300
                                    group-focus-within/input:opacity-100
                                "
                            />

                            {/* Link Icon */}
                            <Link2
                                className="
                                    relative z-10
                                    mr-3.5
                                    h-[19px] w-[19px]
                                    shrink-0
                                    rotate-45
                                    text-white/30
                                    transition-all duration-300

                                    group-focus-within/input:text-indigo-400
                                    group-focus-within/input:drop-shadow-[0_0_8px_rgba(99,102,241,0.7)]
                                "
                                strokeWidth={1.7}
                            />

                            <input
                                type="url"
                                required
                                value={url}
                                onChange={changeUrl}
                                placeholder="Paste a YouTube video URL"
                                aria-label="YouTube video URL"
                                className="
                                    relative z-10
                                    w-full
                                    bg-transparent
                                    text-[14px]
                                    text-white
                                    outline-none
                                    placeholder:text-white/30
                                    sm:text-[15px]
                                "
                            />

                            {/* Active line */}
                            <div
                                className="
                                    pointer-events-none absolute
                                    bottom-0 left-1/2
                                    h-[1px] w-0
                                    -translate-x-1/2
                                    bg-gradient-to-r
                                    from-transparent
                                    via-indigo-400
                                    to-transparent
                                    transition-all duration-500
                                    group-focus-within/input:w-[70%]
                                "
                            />
                        </div>


                        {/* =================================================
                            ANALYZE BUTTON
                        ================================================= */}
                        <button
                            type="submit"
                            className="
                                group/button
                                relative
                                flex min-h-[64px]
                                items-center
                                justify-center
                                gap-2.5
                                overflow-hidden
                                rounded-[19px]
                                px-7
                                text-[14px]
                                font-semibold
                                text-white

                                bg-gradient-to-r
                                from-indigo-600
                                via-blue-600
                                to-indigo-500

                                border border-indigo-300/20

                                shadow-[0_8px_30px_rgba(79,70,229,0.30)]

                                transition-all
                                duration-300

                                hover:-translate-y-[2px]
                                hover:scale-[1.01]

                                hover:shadow-[0_12px_45px_rgba(79,70,229,0.48)]

                                active:translate-y-0
                                active:scale-[0.98]

                                cursor-pointer

                                sm:min-w-[190px]
                            "
                        >

                            {/* =============================================
                                OUTER GLOW
                            ============================================== */}
                            <span
                                className="
                                    pointer-events-none
                                    absolute
                                    -inset-1
                                    rounded-[22px]
                                    bg-gradient-to-r
                                    from-indigo-500
                                    via-blue-400
                                    to-violet-500
                                    opacity-0
                                    blur-xl
                                    transition-opacity duration-500
                                    group-hover/button:opacity-40
                                "
                            />

                            {/* =============================================
                                MOVING LIGHT
                            ============================================== */}
                            <span
                                className="
                                    pointer-events-none
                                    absolute
                                    -left-[100%]
                                    top-0
                                    h-full
                                    w-[70%]
                                    skew-x-[-20deg]
                                    bg-gradient-to-r
                                    from-transparent
                                    via-white/20
                                    to-transparent
                                    transition-all
                                    duration-700

                                    group-hover/button:left-[130%]
                                "
                            />

                            {/* =============================================
                                INNER HIGHLIGHT
                            ============================================== */}
                            <span
                                className="
                                    pointer-events-none
                                    absolute
                                    inset-[1px]
                                    rounded-[18px]
                                    border border-white/[0.08]
                                "
                            />

                            {/* Button Content */}
                            <span className="relative z-10">
                                Analyze Context
                            </span>

                            <ArrowRight
                                className="
                                    relative z-10
                                    h-[17px] w-[17px]
                                    transition-all duration-300
                                    group-hover/button:translate-x-1
                                "
                                strokeWidth={2}
                            />

                        </button>

                    </div>
                </form>


                {/* =====================================================
                    FEATURE INDICATORS
                ====================================================== */}
                {/* <div
                    className="
                        relative z-10
                        flex flex-wrap
                        items-center
                        justify-center
                        gap-x-5
                        gap-y-2
                        px-3
                        pb-1
                        pt-4
                        sm:justify-start
                    "
                >

                    {/* AI Context */}
                    {/* <div
                        className="
                            group/feature
                            flex items-center gap-2
                            text-[11px]
                            text-white/45
                            transition-colors duration-300
                            hover:text-white/75
                        "
                    >
                        <span
                            className="
                                flex h-5 w-5
                                items-center justify-center
                                rounded-full
                                border border-indigo-400/20
                                bg-indigo-500/[0.08]
                                transition-all duration-300
                                group-hover/feature:border-indigo-400/40
                                group-hover/feature:bg-indigo-500/[0.15]
                                group-hover/feature:shadow-[0_0_12px_rgba(99,102,241,0.25)]
                            "
                        >
                            <Sparkles
                                className="h-3 w-3 text-indigo-400"
                                strokeWidth={1.8}
                            />
                        </span>

                        <span>AI Context Analysis</span>
                    </div> */}


                    {/* Divider */}
                    {/* <span className="hidden h-1 w-1 rounded-full bg-white/15 sm:block" /> */}


                    {/* Relevant Ads */}
                    {/* <div
                        className="
                            group/feature
                            flex items-center gap-2
                            text-[11px]
                            text-white/45
                            transition-colors duration-300
                            hover:text-white/75
                        "
                    >
                        <span
                            className="
                                flex h-5 w-5
                                items-center justify-center
                                rounded-full
                                border border-blue-400/20
                                bg-blue-500/[0.08]
                                transition-all duration-300
                                group-hover/feature:border-blue-400/40
                                group-hover/feature:bg-blue-500/[0.15]
                                group-hover/feature:shadow-[0_0_12px_rgba(59,130,246,0.25)]
                            "
                        >
                            <Target
                                className="h-3 w-3 text-blue-400"
                                strokeWidth={1.8}
                            />
                        </span>

                        <span>Relevant Ad Opportunities</span>
                    </div>
 */}

                    {/* Divider */}
                    {/* <span className="hidden h-1 w-1 rounded-full bg-white/15 sm:block" /> */}


                    {/* Non Intrusive */}
                    {/* <div
                        className="
                            group/feature
                            flex items-center gap-2
                            text-[11px]
                            text-white/45
                            transition-colors duration-300
                            hover:text-white/75
                        "
                    >
                        <span
                            className="
                                flex h-5 w-5
                                items-center justify-center
                                rounded-full
                                border border-violet-400/20
                                bg-violet-500/[0.08]
                                transition-all duration-300
                                group-hover/feature:border-violet-400/40
                                group-hover/feature:bg-violet-500/[0.15]
                                group-hover/feature:shadow-[0_0_12px_rgba(139,92,246,0.25)]
                            "
                        >
                            <Zap
                                className="h-3 w-3 text-violet-400"
                                strokeWidth={1.8}
                            />
                        </span>

                        <span>Non-Intrusive</span>
                    </div>

                </div> */}


                {/* =====================================================
                    BOTTOM MICRO STATUS
                ====================================================== */}
                {/* <div
                    className="
                        relative z-10
                        mt-2
                        flex items-center
                        justify-center
                        gap-2
                        pb-1
                        text-[9px]
                        uppercase
                        tracking-[0.16em]
                        text-white/20
                        sm:justify-end
                        sm:pr-3
                    "
                >
                    <span
                        className="
                            h-1.5 w-1.5
                            rounded-full
                            bg-indigo-400
                            shadow-[0_0_10px_rgba(99,102,241,0.9)]
                        "
                    />

                    AI-powered contextual analysis

                </div> */}

            </div>
        </div>
    );
};

export default ContextAnalyzer;