import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export function BurningTopGlow({ revealRef }) {
    const outerRef = useRef(null);
    const coreRef = useRef(null);
    const highlightRef = useRef(null);
    const hazeRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            /*
            ============================================================
            INITIAL STATE
            ============================================================
            */

            gsap.set(
                [
                    outerRef.current,
                    coreRef.current,
                    highlightRef.current,
                    hazeRef.current,
                ],
                {
                    opacity: 0,
                    scale: 0.82,
                    transformOrigin: "50% 50%",
                }
            );

            /*
            ============================================================
            CINEMATIC IGNITION
            ============================================================
            
            ignite
              ↓
            bloom
              ↓
            settle
              ↓
            breathe
            ============================================================
            */

            const revealTimeline = gsap.timeline({
                defaults: {
                    ease: "power3.out",
                },
            });

            /*
            ------------------------------------------------------------
            01 — TINY VIOLET IGNITION
            ------------------------------------------------------------
            */

            revealTimeline.to(
                highlightRef.current,
                {
                    opacity: 0.32,
                    scale: 0.9,
                    duration: 0.32,
                    ease: "power2.out",
                },
                0
            );

            /*
            ------------------------------------------------------------
            02 — CORE IGNITES
            ------------------------------------------------------------
            */

            revealTimeline.to(
                coreRef.current,
                {
                    opacity: 0.48,
                    scale: 0.94,
                    duration: 0.48,
                    ease: "power2.out",
                },
                0.12
            );

            /*
            ------------------------------------------------------------
            03 — OUTER ATMOSPHERE IGNITES
            ------------------------------------------------------------
            */

            revealTimeline.to(
                outerRef.current,
                {
                    opacity: 0.34,
                    scale: 0.96,
                    duration: 0.55,
                    ease: "power2.out",
                },
                0.2
            );

            /*
            ------------------------------------------------------------
            04 — QUICK BLOOM
            ------------------------------------------------------------
            */

            revealTimeline.to(
                outerRef.current,
                {
                    opacity: 0.52,
                    scale: 1.07,
                    duration: 0.7,
                    ease: "power2.out",
                },
                0.58
            );

            revealTimeline.to(
                coreRef.current,
                {
                    opacity: 0.66,
                    scale: 1.06,
                    duration: 0.62,
                    ease: "power2.out",
                },
                0.62
            );

            revealTimeline.to(
                highlightRef.current,
                {
                    opacity: 0.66,
                    scale: 1.08,
                    duration: 0.58,
                    ease: "power2.out",
                },
                0.68
            );

            revealTimeline.to(
                hazeRef.current,
                {
                    opacity: 0.17,
                    scale: 1.05,
                    duration: 0.7,
                    ease: "power2.out",
                },
                0.72
            );

            /*
            ------------------------------------------------------------
            05 — SETTLE
            ------------------------------------------------------------
            */

            revealTimeline.to(
                [
                    outerRef.current,
                    coreRef.current,
                    highlightRef.current,
                    hazeRef.current,
                ],
                {
                    scale: 1,
                    duration: 0.85,
                    ease: "power3.out",
                },
                1.28
            );

            /*
            ============================================================
            CONTINUOUS BREATHING
            ============================================================
            */

            gsap.to(outerRef.current, {
                opacity: 0.58,
                scale: 1.055,
                duration: 5.2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: 2.0,
            });

            gsap.to(coreRef.current, {
                opacity: 0.72,
                scale: 1.045,
                duration: 4.0,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: 2.15,
            });

            gsap.to(highlightRef.current, {
                opacity: 0.7,
                scale: 1.055,
                duration: 4.4,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: 2.25,
            });

            gsap.to(hazeRef.current, {
                opacity: 0.22,
                scale: 1.09,
                duration: 6.2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: 2.35,
            });

            /*
            ============================================================
            EXTERNAL REVEAL REF
            ============================================================
            */

            if (revealRef) {
                revealRef.current = revealTimeline;
            }
        });

        return () => {
            ctx.revert();
        };
    }, [revealRef]);

    return (
        <div
            className="
                pointer-events-none
                absolute
                left-0
                right-0
                top-0
                h-[720px]
                w-full
                overflow-hidden
            "
        >
            {/* ========================================================
                OUTER ATMOSPHERIC GLOW
                ======================================================== */}

            <div
                ref={outerRef}
                className="
                    absolute
                    left-1/2
                    top-[-390px]
                    h-[930px]
                    w-[1500px]
                    -translate-x-1/2
                    rounded-full
                    blur-[125px]
                    will-change-transform
                "
                style={{
                    transformOrigin: "50% 50%",
                    background:
                        "radial-gradient(ellipse 62% 56% at 50% 35%, rgba(79,70,229,0.90) 0%, rgba(49,33,124,0.70) 38%, rgba(36,16,92,0.55) 56%, transparent 76%)",
                }}
            />

            {/* ========================================================
                MAIN BLUE / VIOLET CORE
                ======================================================== */}

            <div
                ref={coreRef}
                className="
                    absolute
                    left-1/2
                    top-[-315px]
                    h-[700px]
                    w-[920px]
                    -translate-x-1/2
                    rounded-full
                    blur-[100px]
                    will-change-transform
                "
                style={{
                    transformOrigin: "50% 50%",
                    background:
                        "radial-gradient(ellipse 56% 62% at 50% 30%, rgba(99,102,241,0.95) 0%, rgba(79,70,229,0.82) 38%, rgba(51,38,163,0.58) 57%, transparent 76%)",
                }}
            />

            {/* ========================================================
                INNER ELECTRIC VIOLET
                ======================================================== */}

            <div
                ref={highlightRef}
                className="
                    absolute
                    left-1/2
                    top-[-235px]
                    h-[430px]
                    w-[530px]
                    -translate-x-1/2
                    rounded-full
                    blur-[72px]
                    will-change-transform
                "
                style={{
                    transformOrigin: "50% 50%",
                    background:
                        "radial-gradient(ellipse 60% 57% at 50% 31%, rgba(167,139,250,0.95) 0%, rgba(139,92,246,0.78) 28%, rgba(99,102,241,0.58) 55%, transparent 82%)",
                }}
            />

            {/* ========================================================
                SOFT AMBIENT HAZE
                ======================================================== */}

            <div
                ref={hazeRef}
                className="
                    absolute
                    left-1/2
                    top-[-120px]
                    h-[330px]
                    w-[650px]
                    -translate-x-1/2
                    rounded-full
                    blur-[110px]
                    will-change-transform
                "
                style={{
                    transformOrigin: "50% 50%",
                    background:
                        "radial-gradient(ellipse at center, rgba(129,140,248,0.55) 0%, rgba(99,102,241,0.25) 42%, transparent 78%)",
                }}
            />
        </div>
    );
}

export default BurningTopGlow;