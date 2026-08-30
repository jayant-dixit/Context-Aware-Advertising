import React, { useLayoutEffect, useRef } from "react";
import {
    Link2,
    ArrowRight,
} from "lucide-react";
import gsap from "gsap";

const ContextAnalyzer = ({
    url,
    changeUrl,
    startAnalysis,
    introPhase = "button",
}) => {
    const isExpanded = introPhase === "expanded";

    const analyzerRef = useRef(null);
    const formRef = useRef(null);
    const inputWrapperRef = useRef(null);
    const buttonRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {

            const input = inputWrapperRef.current;
            const button = buttonRef.current;
            const form = formRef.current;

            // Initial state
            gsap.set(form, {
                width: 190,
            });

            gsap.set(input, {
                // width: 0,
                opacity: 0,
                x: -30,
                paddingLeft: 0,
                paddingRight: 0,
                borderColor: "transparent",
            });

            gsap.set(button, {
                x: 0,
                width: 190
            });

            if (isExpanded) {

                const tl = gsap.timeline({
                    defaults: {
                        ease: "power3.out",
                    },
                });

                /*
                ============================================================
                STEP 1
                Expand the container
                ============================================================
                */

                tl.to(
                    form,
                    {
                        width: "60vw",
                        duration: 0.9,
                        ease: "power3.inOut",
                    },
                    0
                );

                /*
                ============================================================
                STEP 2
                BUTTON SLIDES RIGHT
    
                The important part:
                We don't let flexbox decide where the button goes.
    
                GSAP controls its position directly.
                ============================================================
                */

                tl.to(
                    button,
                    {
                        x: 0,
                        duration: 0.75,
                        ease: "power3.out",
                    },
                    0.05
                );

                /*
                ============================================================
                STEP 3
                INPUT SLIDES OUT FROM BEHIND THE BUTTON
    
                It starts underneath/behind the button and
                moves toward the left.
                ============================================================
                */

                tl.to(
                    input,
                    {
                        width: "calc(100% - 200px)",
                        opacity: 1,
                        x: 0,
                        paddingLeft: 20,
                        paddingRight: 20,
                        borderColor: "rgba(255,255,255,0.12)",
                        duration: 0.85,
                        ease: "power3.out",
                    },
                    0.08
                );

                /*
                ============================================================
                STEP 4
                SOFT SETTLE
    
                Don't bring the button back to x: 0.
                This is what was making it appear to disappear/reset.
                ============================================================
                */

                tl.to(
                    button,
                    {
                        x: 0,
                        duration: 0.25,
                        ease: "sine.out",
                    },
                    0.9
                );
            }

        }, analyzerRef);

        return () => ctx.revert();

    }, [isExpanded]);

    return (
        <div
            ref={analyzerRef}
            className="relative mx-auto"
        >
            {/* =====================================================
                AMBIENT GLOW
            ====================================================== */}

            <div
                className={`
                    pointer-events-none
                    absolute
                    left-1/2
                    top-1/2
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-indigo-600/[0.08]
                    blur-[110px]
                    transition-all
                    duration-700
                    ease-out

                    ${isExpanded
                        ? "h-[260px] w-[620px] opacity-100"
                        : "h-[150px] w-[260px] opacity-60"
                    }
                `}
            />

            <div
                className={`
                    pointer-events-none
                    absolute
                    left-1/2
                    top-1/2
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-blue-500/[0.07]
                    blur-[80px]
                    transition-all
                    duration-700
                    ease-out

                    ${isExpanded
                        ? "h-[160px] w-[420px] opacity-100"
                        : "h-[100px] w-[190px] opacity-50"
                    }
                `}
            />

            {/* =====================================================
                GLASS CONTAINER
            ====================================================== */}

            <div
                className={`
                    group/card
                    relative
                    overflow-hidden
                    rounded-[26px]
                    border
                    border-white/[0.11]
                    bg-black/25
                    p-[10px]
                    backdrop-blur-2xl
                    shadow-[0_25px_90px_rgba(0,0,0,0.5)]

                    transition-[border-color,box-shadow,background-color]
                    duration-700

                    ${isExpanded
                        ? "hover:border-indigo-400/[0.18]"
                        : ""
                    }
                `}
            >
                {/* Top shimmer */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        inset-x-10
                        top-0
                        h-px
                        bg-gradient-to-r
                        from-transparent
                        via-indigo-400/50
                        to-transparent
                        opacity-60
                    "
                />

                {/* Internal glow */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-24
                        -top-24
                        h-48
                        w-48
                        rounded-full
                        bg-indigo-500/[0.08]
                        blur-[70px]
                    "
                />

                <div
                    className="
                        pointer-events-none
                        absolute
                        -bottom-24
                        -left-24
                        h-48
                        w-48
                        rounded-full
                        bg-blue-500/[0.06]
                        blur-[70px]
                    "
                />

                {/* =================================================
                    FORM
                ================================================== */}

                <form
                    ref={formRef}
                    onSubmit={startAnalysis}
                    className="
        relative
        z-10
        h-[64px]
        min-h-[64px]
    "
                    style={{
                        width: 190,
                    }}
                >

                    {/* =================================================
                        INPUT
                    ================================================== */}

                    <div
                        ref={inputWrapperRef}
                        className="
                            group/input
        absolute
        left-0
        top-0
        flex
        h-[64px]
        min-h-[64px]
        items-center
        overflow-hidden
        rounded-[19px]
        border
        bg-white/[0.025]
        backdrop-blur-xl
                        "
                        style={{
                            width: 0,
                        }}
                    >
                        {/* Inner glow */}

                        <div
                            className="
                                pointer-events-none
                                absolute
                                inset-0
                                rounded-[19px]
                                bg-gradient-to-r
                                from-indigo-500/[0.04]
                                via-transparent
                                to-blue-500/[0.04]
                                opacity-0
                                transition-opacity
                                duration-300
                                group-focus-within/input:opacity-100
                            "
                        />

                        {/* Link icon */}

                        <Link2
                            className="
                                relative
                                z-10
                                mr-3.5
                                h-[19px]
                                w-[19px]
                                shrink-0
                                rotate-45
                                text-white/30
                                transition-all
                                duration-300
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
                            tabIndex={isExpanded ? 0 : -1}
                            className="
                                relative
                                z-10
                                min-w-0
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
                                pointer-events-none
                                absolute
                                bottom-0
                                left-1/2
                                h-[1px]
                                w-0
                                -translate-x-1/2
                                bg-gradient-to-r
                                from-transparent
                                via-indigo-400
                                to-transparent
                                transition-all
                                duration-500
                                group-focus-within/input:w-[70%]
                            "
                        />
                    </div>

                    {/* =================================================
                        ANALYZE BUTTON
                    ================================================== */}

                    <button
                        ref={buttonRef}
                        type="submit"
                        className="
                            group/button
        absolute
        right-0
        top-0
        z-20

        flex
        h-[64px]
        min-h-[64px]
        min-w-[190px]
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

        border
        border-indigo-300/20

        shadow-[0_8px_30px_rgba(79,70,229,0.30)]

        transition-all
        duration-300

        hover:-translate-y-[2px]
        hover:scale-[1.01]

        hover:shadow-[0_12px_45px_rgba(79,70,229,0.48)]

        active:translate-y-0
        active:scale-[0.98]

        cursor-pointer
                        "
                    >
                        {/* Outer glow */}

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
                                transition-opacity
                                duration-500
                                group-hover/button:opacity-40
                            "
                        />

                        {/* Moving light */}

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

                        {/* Inner border */}

                        <span
                            className="
                                pointer-events-none
                                absolute
                                inset-[1px]
                                rounded-[18px]
                                border
                                border-white/[0.08]
                            "
                        />

                        {/* Content */}

                        <span className="relative z-10 whitespace-nowrap">
                            Analyze Context
                        </span>

                        <ArrowRight
                            className="
                                relative
                                z-10
                                h-[17px]
                                w-[17px]
                                transition-all
                                duration-300
                                group-hover/button:translate-x-1
                            "
                            strokeWidth={2}
                        />
                    </button>

                </form>
            </div>
        </div>
    );
};

export default ContextAnalyzer;