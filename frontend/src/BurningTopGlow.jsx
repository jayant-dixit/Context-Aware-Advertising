import React, { useEffect, useRef } from "react";
import gsap from "gsap";

/*
  Brand gradient reference:
    Color 1: #000000
    Color 2: #C10801
    Color 3: #F16001
    Color 4: #D9C3AB
*/

// export function BurningTopGlow() {
//     const coreRef = useRef(null);
//     const outerRef = useRef(null);

//     useEffect(() => {
//         const ctx = gsap.context(() => {
//             // organic flicker — two layers pulse slightly out of phase so it doesn't
//             // read as a mechanical loop
//             gsap.to(coreRef.current, {
//                 opacity: 0.75,
//                 scale: 1.06,
//                 duration: 2.4,
//                 repeat: -1,
//                 yoyo: true,
//                 ease: "sine.inOut",
//             });
//             gsap.to(outerRef.current, {
//                 opacity: 0.55,
//                 scale: 1.1,
//                 duration: 3.6,
//                 repeat: -1,
//                 yoyo: true,
//                 ease: "sine.inOut",
//                 delay: 0.4,
//             });
//         });
//         return () => ctx.revert();
//     }, []);

//     return (
//         <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px] w-full overflow-hidden">
//             {/* wide outer burn — deep crimson bleeding to black */}
//             <div
//                 ref={outerRef}
//                 className="absolute left-1/2 top-[-360px] h-[900px] w-[1500px] -translate-x-1/2 rounded-full opacity-45 blur-[120px]"
//                 style={{
//                     background:
//                         "radial-gradient(ellipse 60% 55% at 50% 30%, #C10801 0%, #6a0700 40%, transparent 72%)",
//                 }}
//             />

//             {/* mid layer — hot orange core of the flame */}
//             <div
//                 ref={coreRef}
//                 className="absolute left-1/2 top-[-300px] h-[680px] w-[900px] -translate-x-1/2 rounded-full opacity-65 blur-[95px]"
//                 style={{
//                     background:
//                         "radial-gradient(ellipse 55% 60% at 50% 25%, #F16001 0%, #C10801 45%, transparent 75%)",
//                 }}
//             />

//             {/* innermost highlight — warm pale core, like the hottest part of a flame */}
//             <div
//                 className="absolute left-1/2 top-[-220px] h-[380px] w-[460px] -translate-x-1/2 rounded-full opacity-70 blur-[70px]"
//                 style={{
//                     background:
//                         "radial-gradient(ellipse 60% 55% at 50% 30%, #D9C3AB 0%, #F16001 55%, transparent 80%)",
//                 }}
//             />

//             {/* base fade to pure black so the glow sits on top of a premium dark canvas */}
//             <div
//                 className="absolute inset-0"
//                 style={{
//                     background:
//                         "linear-gradient(180deg, transparent 0%, transparent 40%, #000000 92%)",
//                 }}
//             />
//         </div>
//     );
// }

/*
  Brand gradient reference — Purple / Electric Blue theme:
    Color 1: #000000
    Color 2: #24105C
    Color 3: #4F46E5
    Color 4: #8B5CF6
*/

export function BurningTopGlow() {
    const coreRef = useRef(null);
    const outerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Soft organic pulse for the central blue-violet glow
            gsap.to(coreRef.current, {
                opacity: 0.75,
                scale: 1.06,
                duration: 2.8,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });

            // Slower outer glow for a natural premium feel
            gsap.to(outerRef.current, {
                opacity: 0.55,
                scale: 1.1,
                duration: 4.2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: 0.4,
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px] w-full overflow-hidden">

            {/* 
              Wide outer glow
              Deep violet bleeding softly into black
            */}
            <div
                ref={outerRef}
                className="absolute left-1/2 top-[-360px] h-[900px] w-[1500px] -translate-x-1/2 rounded-full opacity-45 blur-[120px]"
                style={{
                    background:
                        "radial-gradient(ellipse 60% 55% at 50% 30%, #4F46E5 0%, #24105C 42%, transparent 72%)",
                }}
            />

            {/*
              Main blue-violet core
              This creates the bright purple glow
              visible at the top center of the design
            */}
            <div
                ref={coreRef}
                className="absolute left-1/2 top-[-300px] h-[680px] w-[900px] -translate-x-1/2 rounded-full opacity-65 blur-[95px]"
                style={{
                    background:
                        "radial-gradient(ellipse 55% 60% at 50% 25%, #6366F1 0%, #4F46E5 42%, transparent 75%)",
                }}
            />

            {/*
              Innermost highlight
              Bright electric violet / blue center
            */}
            <div
                className="absolute left-1/2 top-[-220px] h-[380px] w-[460px] -translate-x-1/2 rounded-full opacity-70 blur-[70px]"
                style={{
                    background:
                        "radial-gradient(ellipse 60% 55% at 50% 30%, #8B5CF6 0%, #4F46E5 52%, transparent 80%)",
                }}
            />

            {/*
              Base fade
              Keeps the lower portion pure black
              so the glow remains premium and subtle
            */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "linear-gradient(180deg, transparent 0%, transparent 40%, #000000 92%)",
                }}
            />

        </div>
    );
}

/* ---------------------------- demo wrapper ---------------------------- */

export default function BurningGlowDemo() {
    return (
        <div className="font-cabin relative min-h-screen w-full overflow-hidden bg-black text-white">
            <BurningTopGlow />

            <div className="relative z-10 flex flex-col items-center px-6 pt-32 text-center">
                <span className="text-[13px] font-medium tracking-[0.2em] text-white/40">
                    BACKGROUND PREVIEW
                </span>
                <h1 className="mt-4 max-w-2xl text-[44px] font-bold leading-tight tracking-tight sm:text-[56px]">
                    Ads that understand the moment.
                </h1>
                <p className="mt-4 max-w-[520px] text-[15px] text-white/50">
                    Drop <code className="text-white/70">&lt;BurningTopGlow /&gt;</code> as the first child
                    inside any relatively-positioned section to place this glow at its top.
                </p>
            </div>
        </div>
    );
}