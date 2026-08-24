// import React, { useRef, useState } from "react";

// // ---- Generic brand glyphs (stylized, not exact trademarked logo art) ----
// const Icon = {
//     Arch: (p) => (
//         <svg viewBox="0 0 24 24" fill="none" {...p}>
//             <path
//                 d="M5 20V11c0-1.8.9-3 2.2-3S9 9.2 9 11v9M9 20v-6c0-1.8.9-3 2.2-3S13 12.2 13 14v6M13 20v-9c0-1.8.9-3 2.2-3S17.5 9.2 17.5 11v9"
//                 stroke="currentColor"
//                 strokeWidth="2.2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//             />
//         </svg>
//     ),
//     Wave: (p) => (
//         <svg viewBox="0 0 24 24" fill="none" {...p}>
//             <path d="M3 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
//             <path d="M3 10c2-2 4-2 6 0s4 2 6 0 4-2 6 0" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" opacity="0.6" />
//         </svg>
//     ),
//     Leaf: (p) => (
//         <svg viewBox="0 0 24 24" fill="none" {...p}>
//             <path d="M6 18c-2-6 1-12 12-12 0 9-4 13-12 12Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
//             <path d="M7 17 17 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
//         </svg>
//     ),
//     Play: (p) => (
//         <svg viewBox="0 0 24 24" fill="none" {...p}>
//             <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
//             <path d="M10 8.5v7l6-3.5-6-3.5Z" fill="currentColor" />
//         </svg>
//     ),
//     Box: (p) => (
//         <svg viewBox="0 0 24 24" fill="none" {...p}>
//             <path d="M3 8 12 4l9 4-9 4-9-4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
//             <path d="M3 8v8l9 4 9-4V8" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
//             <path d="M12 12v8" stroke="currentColor" strokeWidth="1.8" />
//         </svg>
//     ),
//     Fruit: (p) => (
//         <svg viewBox="0 0 24 24" fill="none" {...p}>
//             <path d="M12 8c4 0 6 3 6 6.5S15.5 21 12 21s-6-2.9-6-6.5S8 8 12 8Z" stroke="currentColor" strokeWidth="1.8" />
//             <path d="M12 8c0-2 1-4 3-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
//         </svg>
//     ),
// };

// const BRANDS = [
//     { id: "visa", name: "VISA", base: "#0F3FBF", glow: "#8FB2FF", icon: Icon.Wave },
//     { id: "mcd", name: "McDonald's", base: "#C1121C", glow: "#FFC94C", icon: Icon.Arch },
//     { id: "sbx", name: "STARBUCKS", base: "#0B4A3C", glow: "#7CD9B8", icon: Icon.Leaf },
//     { id: "spt", name: "Spotify", base: "#0E1912", glow: "#3FE07A", icon: Icon.Play },
//     { id: "amz", name: "Amazon", base: "#16181C", glow: "#FF9D2E", icon: Icon.Box },
//     { id: "apl", name: "Apple", base: "#3A3D42", glow: "#E8E9EC", icon: Icon.Fruit },
// ];

// function VerticalCard({ brand }) {
//     const ref = useRef(null);
//     const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50 });
//     const [hover, setHover] = useState(false);

//     const handleMove = (e) => {
//         const rect = ref.current.getBoundingClientRect();
//         const x = (e.clientX - rect.left) / rect.width;
//         const y = (e.clientY - rect.top) / rect.height;
//         setTilt({ rx: (0.5 - y) * 14, ry: (x - 0.5) * 18, mx: x * 100, my: y * 100 });
//     };

//     const handleLeave = () => {
//         setHover(false);
//         setTilt({ rx: 0, ry: 0, mx: 50, my: 50 });
//     };

//     const { base, glow, icon: BrandIcon, name } = brand;

//     return (
//         <div
//             className="[perspective:1200px]"
//             onMouseEnter={() => setHover(true)}
//             onMouseLeave={handleLeave}
//             onMouseMove={handleMove}
//         >
//             <div
//                 ref={ref}
//                 className="relative w-[210px] h-[300px] rounded-[22px] transition-transform duration-200 ease-out will-change-transform"
//                 style={{
//                     transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${hover ? 1.04 : 1})`,
//                     transformStyle: "preserve-3d",
//                 }}
//             >
//                 <div
//                     className="absolute inset-0 rounded-[22px] overflow-hidden shadow-[0_25px_50px_-15px_rgba(0,0,0,0.6)]"
//                     style={{
//                         background: `
//               radial-gradient(130% 100% at 20% 0%, ${glow}26, transparent 55%),
//               linear-gradient(160deg, ${base} 0%, #000 140%)
//             `,
//                     }}
//                 >
//                     {/* brushed metal texture */}
//                     <div
//                         className="absolute inset-0 opacity-[0.14] mix-blend-overlay"
//                         style={{
//                             backgroundImage:
//                                 "repeating-linear-gradient(100deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0) 1.5px, rgba(255,255,255,0) 3px)",
//                         }}
//                     />
//                     {/* diagonal sheen sweep */}
//                     <div
//                         className="absolute inset-0 opacity-60"
//                         style={{
//                             background:
//                                 "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.26) 46%, rgba(255,255,255,0.05) 54%, transparent 66%)",
//                             transform: `translateX(${(tilt.ry || 0) * 4}px)`,
//                         }}
//                     />
//                     {/* mouse glow */}
//                     <div
//                         className="absolute inset-0 transition-opacity duration-200"
//                         style={{
//                             opacity: hover ? 1 : 0,
//                             background: `radial-gradient(180px circle at ${tilt.mx}% ${tilt.my}%, ${glow}35, transparent 60%)`,
//                         }}
//                     />
//                     {/* borders */}
//                     <div className="absolute inset-0 rounded-[22px] ring-1 ring-white/15" />
//                     <div className="absolute inset-[1px] rounded-[21px] ring-1 ring-black/40" />
//                     {/* bottom vignette for text legibility */}
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/5" />

//                     {/* keyhole punch at top, like a hanging gift card */}
//                     <div className="absolute top-4 left-1/2 -translate-x-1/2 w-9 h-5 rounded-full bg-black/50 ring-1 ring-white/10 backdrop-blur-sm" />

//                     {/* content */}
//                     <div className="relative z-10 h-full w-full flex flex-col items-center justify-center px-6">
//                         <BrandIcon
//                             className="w-20 h-20 drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]"
//                             style={{ color: glow }}
//                         />
//                     </div>

//                     <div className="absolute bottom-7 left-0 right-0 text-center px-4">
//                         <div
//                             className="text-white font-semibold text-[17px] tracking-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
//                         >
//                             {name}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default function GiftCardShowcase() {
//     return (
//         <div className="min-h-screen w-full bg-[#0a0a0c] flex items-center justify-center p-10">
//             <div className="max-w-5xl w-full">
//                 <div className="mb-12 text-center">
//                     <h1 className="text-white text-3xl font-semibold tracking-tight">Premium Gift Card Collection</h1>
//                     <p className="text-white/40 text-sm mt-2">Hover a card to see the metallic sheen react to your cursor</p>
//                 </div>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 place-items-center">
//                     {BRANDS.map((b) => (
//                         <VerticalCard key={b.id} brand={b} />
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// }

// import React, { useState } from "react";

// // ---- Generic brand glyphs (stylized, not exact trademarked logo art) ----
// const Icon = {
//     Arch: (p) => (
//         <svg viewBox="0 0 24 24" fill="none" {...p}>
//             <path
//                 d="M5 20V11c0-1.8.9-3 2.2-3S9 9.2 9 11v9M9 20v-6c0-1.8.9-3 2.2-3S13 12.2 13 14v6M13 20v-9c0-1.8.9-3 2.2-3S17.5 9.2 17.5 11v9"
//                 stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
//             />
//         </svg>
//     ),
//     Wave: (p) => (
//         <svg viewBox="0 0 24 24" fill="none" {...p}>
//             <path d="M3 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
//             <path d="M3 10c2-2 4-2 6 0s4 2 6 0 4-2 6 0" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" opacity="0.6" />
//         </svg>
//     ),
//     Leaf: (p) => (
//         <svg viewBox="0 0 24 24" fill="none" {...p}>
//             <path d="M6 18c-2-6 1-12 12-12 0 9-4 13-12 12Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
//             <path d="M7 17 17 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
//         </svg>
//     ),
//     Play: (p) => (
//         <svg viewBox="0 0 24 24" fill="none" {...p}>
//             <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
//             <path d="M10 8.5v7l6-3.5-6-3.5Z" fill="currentColor" />
//         </svg>
//     ),
//     Box: (p) => (
//         <svg viewBox="0 0 24 24" fill="none" {...p}>
//             <path d="M3 8 12 4l9 4-9 4-9-4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
//             <path d="M3 8v8l9 4 9-4V8" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
//             <path d="M12 12v8" stroke="currentColor" strokeWidth="1.8" />
//         </svg>
//     ),
//     Fruit: (p) => (
//         <svg viewBox="0 0 24 24" fill="none" {...p}>
//             <path d="M12 8c4 0 6 3 6 6.5S15.5 21 12 21s-6-2.9-6-6.5S8 8 12 8Z" stroke="currentColor" strokeWidth="1.8" />
//             <path d="M12 8c0-2 1-4 3-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
//         </svg>
//     ),
//     Bars: (p) => (
//         <svg viewBox="0 0 24 24" fill="none" {...p}>
//             <path d="M6 4v16M12 4l6 16M18 4v16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
//         </svg>
//     ),
//     Swoosh: (p) => (
//         <svg viewBox="0 0 24 24" fill="none" {...p}>
//             <path d="M3 15c4.5 4 12 4.5 18-3-6 2-13-1-15-6 1 4 4 7 8 8-4-.5-8-2.5-11 1Z" fill="currentColor" />
//         </svg>
//     ),
//     Orbit: (p) => (
//         <svg viewBox="0 0 24 24" fill="none" {...p}>
//             <circle cx="12" cy="12" r="4" fill="currentColor" />
//             <ellipse cx="12" cy="12" rx="9" ry="4" stroke="currentColor" strokeWidth="1.6" />
//             <ellipse cx="12" cy="12" rx="9" ry="4" stroke="currentColor" strokeWidth="1.6" transform="rotate(60 12 12)" />
//         </svg>
//     ),
//     DoubleP: (p) => (
//         <svg viewBox="0 0 24 24" fill="none" {...p}>
//             <path d="M7 20 9.5 4h4.2c2.8 0 4.3 1.5 3.9 4-.4 2.6-2.5 4-5.2 4H9.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
//             <path d="M9 20 11.5 6h4c2.6 0 4 1.4 3.6 3.7-.4 2.4-2.3 3.7-4.9 3.7h-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
//         </svg>
//     ),
//     Curl: (p) => (
//         <svg viewBox="0 0 24 24" fill="none" {...p}>
//             <path d="M6 20c0-8 3-14 6-14s6 6 6 14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
//         </svg>
//     ),
//     Belo: (p) => (
//         <svg viewBox="0 0 24 24" fill="none" {...p}>
//             <path d="M12 4c3 3 6 6.5 6 10a6 6 0 1 1-12 0c0-3.5 3-7 6-10Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
//         </svg>
//     ),
// };

// const BRANDS = [
//     { id: "visa", name: "VISA", base: "#0F3FBF", glow: "#8FB2FF", icon: Icon.Wave },
//     { id: "mcd", name: "McDonald's", base: "#C1121C", glow: "#FFC94C", icon: Icon.Arch },
//     { id: "sbx", name: "STARBUCKS", base: "#0B4A3C", glow: "#7CD9B8", icon: Icon.Leaf },
//     { id: "spt", name: "Spotify", base: "#0E1912", glow: "#3FE07A", icon: Icon.Play },
//     { id: "amz", name: "Amazon", base: "#16181C", glow: "#FF9D2E", icon: Icon.Box },
//     { id: "apl", name: "Apple", base: "#3A3D42", glow: "#E8E9EC", icon: Icon.Fruit },
//     { id: "nfx", name: "Netflix", base: "#210000", glow: "#E60914", icon: Icon.Bars },
//     { id: "nke", name: "Nike", base: "#161616", glow: "#F5F5F5", icon: Icon.Swoosh },
//     { id: "ggl", name: "Google Play", base: "#1B2A4A", glow: "#7FA8FF", icon: Icon.Orbit },
//     { id: "ppl", name: "PayPal", base: "#0B2E63", glow: "#5FA9FF", icon: Icon.DoubleP },
//     { id: "ubr", name: "Uber", base: "#0A0A0A", glow: "#E6E6E6", icon: Icon.Curl },
//     { id: "abb", name: "Airbnb", base: "#5C0A1E", glow: "#FF6B7A", icon: Icon.Belo },
//     { id: "apl", name: "Apple", base: "#3A3D42", glow: "#E8E9EC", icon: Icon.Fruit },
//     { id: "nfx", name: "Netflix", base: "#210000", glow: "#E60914", icon: Icon.Bars },
// ];

// const CARD_W = 130;
// const CARD_H = 190;
// const HOLE_RADIUS = 185; // gap between the ring's center and the bottom edge of every card

// function RingCard({ brand, angle, index, hovered, setHovered }) {
//     const isHovered = hovered === index;
//     const { base, glow, icon: BrandIcon, name } = brand;

//     return (
//         <div
//             className="absolute left-1/2 top-1/2"
//             style={{
//                 width: CARD_W,
//                 height: CARD_H,
//                 marginLeft: -CARD_W / 2,
//                 marginTop: -CARD_H,
//                 transformOrigin: "50% 100%",
//                 transform: `rotate(${angle}deg) translateY(-${HOLE_RADIUS - (isHovered ? 16 : 0)}px)`,
//                 transition: "transform 260ms ease, filter 260ms ease",
//                 zIndex: isHovered ? 100 : index,
//                 filter: hovered !== null && !isHovered ? "brightness(0.8)" : "brightness(1)",
//             }}
//             onMouseEnter={() => setHovered(index)}
//             onMouseLeave={() => setHovered(null)}
//         >
//             <div
//                 className="relative w-full h-full rounded-[14px] overflow-hidden cursor-pointer"
//                 style={{
//                     background: `
//             radial-gradient(130% 100% at 20% 0%, ${glow}26, transparent 55%),
//             linear-gradient(160deg, ${base} 0%, #000 140%)
//           `,
//                     boxShadow: isHovered
//                         ? `0 22px 40px -10px rgba(0,0,0,0.7), 0 0 0 1px ${glow}66`
//                         : "0 8px 16px -6px rgba(0,0,0,0.6)",
//                 }}
//             >
//                 <div
//                     className="absolute inset-0 opacity-[0.14] mix-blend-overlay"
//                     style={{
//                         backgroundImage:
//                             "repeating-linear-gradient(100deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0) 1.5px, rgba(255,255,255,0) 3px)",
//                     }}
//                 />
//                 <div
//                     className="absolute inset-0 opacity-60"
//                     style={{
//                         background:
//                             "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.22) 46%, rgba(255,255,255,0.05) 54%, transparent 66%)",
//                     }}
//                 />
//                 <div className="absolute inset-0 rounded-[14px] ring-1 ring-white/15" />
//                 <div className="absolute inset-[1px] rounded-[13px] ring-1 ring-black/40" />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/5" />

//                 <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-6 h-3.5 rounded-full bg-black/50 ring-1 ring-white/10" />

//                 <div className="relative z-10 h-full w-full flex flex-col items-center justify-center px-3">
//                     <BrandIcon className="w-10 h-10 drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]" style={{ color: glow }} />
//                 </div>

//                 <div className="absolute bottom-3.5 left-0 right-0 text-center px-1.5">
//                     <div className="text-white font-semibold text-[9.5px] tracking-tight leading-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
//                         {name}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default function GiftCardHollowRing() {
//     const [hovered, setHovered] = useState(null);
//     const count = BRANDS.length;
//     const step = 360 / count;
//     const outerRadius = HOLE_RADIUS + CARD_H;

//     return (
//         <div className="min-h-screen w-full bg-[#0a0a0c] flex flex-col items-center justify-center p-10 overflow-hidden">
//             <div className="mb-6 text-center">
//                 <h1 className="text-white text-3xl font-semibold tracking-tight">Premium Gift Card Collection</h1>
//                 <p className="text-white/40 text-sm mt-2">A hollow ring — cards sit on the circumference, hover one to lift it out</p>
//             </div>

//             <div className="relative" style={{ width: outerRadius * 2 + 40, height: outerRadius * 2 + 40 }}>
//                 {/* faint hole guide so the empty center reads intentionally */}
//                 <div
//                     className="absolute top-1/2 left-1/2 rounded-full border border-white/5"
//                     style={{
//                         width: HOLE_RADIUS * 2,
//                         height: HOLE_RADIUS * 2,
//                         transform: "translate(-50%, -50%)",
//                     }}
//                 />
//                 {BRANDS.map((brand, i) => (
//                     <RingCard
//                         key={brand.id}
//                         brand={brand}
//                         angle={i * step}
//                         index={i}
//                         hovered={hovered}
//                         setHovered={setHovered}
//                     />
//                 ))}
//             </div>
//         </div>
//     );
// }


import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// ---- Generic brand glyphs (stylized, not exact trademarked logo art) ----
const Icon = {
    Arch: (p) => (
        <svg viewBox="0 0 24 24" fill="none" {...p}>
            <path
                d="M5 20V11c0-1.8.9-3 2.2-3S9 9.2 9 11v9M9 20v-6c0-1.8.9-3 2.2-3S13 12.2 13 14v6M13 20v-9c0-1.8.9-3 2.2-3S17.5 9.2 17.5 11v9"
                stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
            />
        </svg>
    ),
    Wave: (p) => (
        <svg viewBox="0 0 24 24" fill="none" {...p}>
            <path d="M3 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M3 10c2-2 4-2 6 0s4 2 6 0 4-2 6 0" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" opacity="0.6" />
        </svg>
    ),
    Leaf: (p) => (
        <svg viewBox="0 0 24 24" fill="none" {...p}>
            <path d="M6 18c-2-6 1-12 12-12 0 9-4 13-12 12Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M7 17 17 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    ),
    Play: (p) => (
        <svg viewBox="0 0 24 24" fill="none" {...p}>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
            <path d="M10 8.5v7l6-3.5-6-3.5Z" fill="currentColor" />
        </svg>
    ),
    Box: (p) => (
        <svg viewBox="0 0 24 24" fill="none" {...p}>
            <path d="M3 8 12 4l9 4-9 4-9-4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M3 8v8l9 4 9-4V8" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M12 12v8" stroke="currentColor" strokeWidth="1.8" />
        </svg>
    ),
    Fruit: (p) => (
        <svg viewBox="0 0 24 24" fill="none" {...p}>
            <path d="M12 8c4 0 6 3 6 6.5S15.5 21 12 21s-6-2.9-6-6.5S8 8 12 8Z" stroke="currentColor" strokeWidth="1.8" />
            <path d="M12 8c0-2 1-4 3-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    ),
    Bars: (p) => (
        <svg viewBox="0 0 24 24" fill="none" {...p}>
            <path d="M6 4v16M12 4l6 16M18 4v16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    Swoosh: (p) => (
        <svg viewBox="0 0 24 24" fill="none" {...p}>
            <path d="M3 15c4.5 4 12 4.5 18-3-6 2-13-1-15-6 1 4 4 7 8 8-4-.5-8-2.5-11 1Z" fill="currentColor" />
        </svg>
    ),
    Orbit: (p) => (
        <svg viewBox="0 0 24 24" fill="none" {...p}>
            <circle cx="12" cy="12" r="4" fill="currentColor" />
            <ellipse cx="12" cy="12" rx="9" ry="4" stroke="currentColor" strokeWidth="1.6" />
            <ellipse cx="12" cy="12" rx="9" ry="4" stroke="currentColor" strokeWidth="1.6" transform="rotate(60 12 12)" />
        </svg>
    ),
    DoubleP: (p) => (
        <svg viewBox="0 0 24 24" fill="none" {...p}>
            <path d="M7 20 9.5 4h4.2c2.8 0 4.3 1.5 3.9 4-.4 2.6-2.5 4-5.2 4H9.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
            <path d="M9 20 11.5 6h4c2.6 0 4 1.4 3.6 3.7-.4 2.4-2.3 3.7-4.9 3.7h-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    Curl: (p) => (
        <svg viewBox="0 0 24 24" fill="none" {...p}>
            <path d="M6 20c0-8 3-14 6-14s6 6 6 14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
    ),
    Belo: (p) => (
        <svg viewBox="0 0 24 24" fill="none" {...p}>
            <path d="M12 4c3 3 6 6.5 6 10a6 6 0 1 1-12 0c0-3.5 3-7 6-10Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
    ),
};

const BRANDS = [
    { id: "visa", name: "VISA", base: "#0F3FBF", glow: "#8FB2FF", image: '/visa.png' },
    { id: "mcd", name: "McDonald's", base: "#ce0002", glow: "#daa700", image: '/mcd.png' },
    { id: "sbx", name: "STARBUCKS", base: "#0B4A3C", glow: "#7CD9B8", image: '/starbucks.png' },
    { id: "spt", name: "Decathalon", base: "#252d7e", glow: "#3FE07A", image: '/decathalon.png' },
    { id: "amz", name: "Amazon", base: "#ef9e1b", glow: "#FF9D2E", image: '/amazon.png' },
    { id: "apl", name: "Apple", base: "#3A3D42", glow: "#E8E9EC", image: '/apple.png' },
    { id: "nfx", name: "Adidas", base: "#210000", glow: "#E60914", image: '/adidas.png' },
    { id: "nke", name: "Nike", base: "#161616", glow: "#F5F5F5", image: '/nike.png' },
    { id: "ggl", name: "Domino's", base: "#0073a8", glow: "#7FA8FF", image: '/dominos.png' },
    { id: "ppl", name: "PayPal", base: "#0B2E63", glow: "#5FA9FF", image: '/paypal.png' },
    { id: "ubr", name: "Uber", base: "#0A0A0A", glow: "#E6E6E6", image: '/uber.png' },
    { id: "abb", name: "Airbnb", base: "#f4565c", glow: "#FF6B7A", image: '/airbnb.png' },
    { id: "nke", name: "Spotify", base: "#1bcc5a", glow: "#F5F5F5", image: '/spotify.png' },
    { id: "ggl", name: "Philips", base: "#0e58cc", glow: "#7FA8FF", image: '/philips.png' },
    { id: "ppl", name: "Boat", base: "#e02721", glow: "#5FA9FF", image: '/boat.png' }
];

const CARD_W = 180;
const CARD_H = 230;
const HOLE_RADIUS = 340; // gap between the ring's center and the bottom edge of every card
const COUNT = BRANDS.length;
const STEP = 360 / COUNT;

// Symmetric stacking order: cards nearest angle 0 sit on top, cards nearest the
// opposite side (180deg) sit at the bottom. This makes the one unavoidable seam
// (where a full circle of overlapping cards has to "close the loop") land at the
// back of the ring between two similarly-low cards, instead of the last card in
// the array always ending up wrongly on top of everything, including card 0.
function zIndexFor(i) {
    const rad = (i * STEP * Math.PI) / 180;
    return Math.round(Math.cos(rad) * 1000);
}

function RingCard({ brand, angle, index, hovered, setHovered, registerRef }) {
    const innerRef = useRef(null);
    const isHovered = hovered === index;
    const { base, glow, image, name } = brand;

    // GSAP entrance: cards bloom outward from the hollow center, staggered by angle.
    useEffect(() => {
        if (!innerRef.current) return;
        gsap.fromTo(
            innerRef.current,
            { scale: 0.2, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                duration: 0.9,
                delay: index * 0.06,
                ease: "back.out(1.6)",
            }
        );
        registerRef && registerRef(index, innerRef.current);
    }, []);

    // GSAP hover pop — separate from the positional transform, so it never fights
    // the rotate()/translateY() placement on the outer wrapper.
    useEffect(() => {
        if (!innerRef.current) return;
        gsap.to(innerRef.current, {
            scale: isHovered ? 1.16 : 1,
            y: isHovered ? -14 : 0,
            filter: hovered !== null && !isHovered ? "brightness(0.75)" : "brightness(1)",
            duration: 0.35,
            ease: "power3.out",
        });
    }, [isHovered, hovered]);

    return (
        <div
            className="absolute left-1/2 top-1/2"
            style={{
                width: CARD_W,
                height: CARD_H,
                marginLeft: -CARD_W / 2,
                marginTop: -CARD_H,
                transformOrigin: "50% 100%",
                transform: `rotate(${angle}deg) translateY(-${HOLE_RADIUS}px)`,
                zIndex: isHovered ? 999 : zIndexFor(index),
            }}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
        >
            <div
                ref={innerRef}
                className="relative w-full h-full rounded-[14px] overflow-hidden cursor-pointer"
                style={{
                    background: `
            radial-gradient(130% 100% at 20% 0%, ${glow}26, transparent 55%),
            linear-gradient(160deg, ${base} 0%, #000 140%)
          `,
                    boxShadow: isHovered
                        ? `0 22px 40px -10px rgba(0,0,0,0.7), 0 0 0 1px ${glow}66`
                        : "0 8px 16px -6px rgba(0,0,0,0.6)",
                }}
            >
                <div
                    className="absolute inset-0 opacity-[0.14] mix-blend-overlay"
                    style={{
                        backgroundImage:
                            "repeating-linear-gradient(100deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0) 1.5px, rgba(255,255,255,0) 3px)",
                    }}
                />
                <div
                    className="absolute inset-0 opacity-60"
                    style={{
                        background:
                            "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.22) 46%, rgba(255,255,255,0.05) 54%, transparent 66%)",
                    }}
                />
                <div className="absolute inset-0 rounded-[14px] ring-1 ring-white/15" />
                <div className="absolute inset-[1px] rounded-[13px] ring-1 ring-black/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/5" />

                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-6 h-3.5 rounded-full bg-black/50 ring-1 ring-white/10" />

                {/* <div className="relative z-10 h-full w-full flex flex-col items-center justify-center px-3">
                    <BrandIcon className="w-10 h-10 drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]" style={{ color: glow }} />
                </div> */}

                <div
                    className="
                        w-[120px] h-[230px]
                        bg-white/15
                        backdrop-blur-xl
                        border border-white/20
                        mx-auto
                        shadow-[0_8px_40px_rgba(255,195,0,0.25)]
                    "
                    style={{
                        WebkitMaskImage: `url(${image})`,
                        maskImage: `url(${image})`,
                        WebkitMaskRepeat: "no-repeat",
                        maskRepeat: "no-repeat",
                        WebkitMaskPosition: "center",
                        maskPosition: "center",
                        WebkitMaskSize: "contain",
                        maskSize: "contain",
                    }}
                />

                <img src={image} />

                <div className="absolute bottom-3.5 left-0 right-0 text-center px-1.5">
                    <div className="text-white font-semibold text-[9.5px] tracking-tight leading-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
                        {name}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function GiftCardSpinningRing() {
    const [hovered, setHovered] = useState(null);
    const ringRef = useRef(null);
    const spinTween = useRef(null);
    const outerRadius = HOLE_RADIUS + CARD_H;

    // Continuous infinite rotation of the whole ring.
    useEffect(() => {
        spinTween.current = gsap.to(ringRef.current, {
            rotation: 360,
            duration: 50,
            repeat: -1,
            ease: "none",
            transformOrigin: "50% 50%",
        });
        return () => spinTween.current && spinTween.current.kill();
    }, []);

    // Pause the spin while a card is being inspected on hover, resume smoothly after.
    useEffect(() => {
        if (!spinTween.current) return;
        if (hovered !== null) spinTween.current.pause();
        else spinTween.current.play();
    }, [hovered]);

    return (
        <div className="min-h-[150vh] h-[230vh] w-full flex flex-col items-center justify-center p-10">
            <div className="mb-6 text-center">
                <h1 className="text-white text-6xl italic font-semibold tracking-tight">Where Context Meets Commerce</h1>
                <p className="text-white/40 text-xl mt-2">Turning meaningful content into meaningful brand connections</p>
            </div>

            <div className="relative translate-y-[10%]" style={{ width: outerRadius * 2 + 40, height: outerRadius * 2 + 40 }}>
                {/* faint hole guide so the empty center reads intentionally */}
                <div
                    className="absolute top-1/2 left-1/2 rounded-full border border-white/5 pointer-events-none"
                    style={{
                        width: HOLE_RADIUS * 2,
                        height: HOLE_RADIUS * 2,
                        transform: "translate(-50%, -50%)",
                    }}
                />
                <div ref={ringRef} className="absolute inset-0">
                    {BRANDS.map((brand, i) => (
                        <RingCard
                            key={brand.id}
                            brand={brand}
                            angle={i * STEP}
                            index={i}
                            hovered={hovered}
                            setHovered={setHovered}
                        />
                    ))}
                </div>
                <div className="absolute translate-x- items-center text-center translate-y-[45%] w-full h-full">
                    <h1 className="text-white text-5xl">
                        <span className="font-bold">
                            Right Brand
                            <br />
                            Right Moment
                        </span>
                        <br />
                        <span className="text-2xl italic">
                            Powered by Context
                        </span>
                    </h1>
                </div>
            </div>
        </div>
    );
}