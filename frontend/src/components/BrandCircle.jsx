import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";


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

export default function BrandCircle() {
    const [hovered, setHovered] = useState(null);
    const ringRef = useRef(null);
    const spinTween = useRef(null);
    const outerRadius = HOLE_RADIUS + CARD_H;

    const headingRef = useRef(null);
    const headingWordsRef = useRef([]);
    const subtitleRef = useRef(null);

    const centerTextRef = useRef(null);
    const centerTitleRef = useRef(null);
    const centerSubtitleRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const messages = [
                {
                    title: (
                        <>
                            Right Brand
                            <br />
                            Right Moment
                        </>
                    ),
                    subtitle: "Powered by Context",
                },
                {
                    title: (
                        <>
                            Context
                            <br />
                            Meets Commerce
                        </>
                    ),
                    subtitle: "Powered by Intelligence",
                },
                {
                    title: (
                        <>
                            Relevant Ad
                            <br />
                            Relevant Audience
                        </>
                    ),
                    subtitle: "Powered by Context",
                },
                {
                    title: (
                        <>
                            Meaningful Content
                            <br />
                            Meaningful Connection
                        </>
                    ),
                    subtitle: "Powered by Context",
                },
            ];

            let currentIndex = 0;

            const title = centerTitleRef.current;
            const subtitle = centerSubtitleRef.current;

            if (!title || !subtitle) return;

            /* =====================================================
               INITIAL STATE
            ===================================================== */

            gsap.set([title, subtitle], {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
            });

            /* =====================================================
               CHANGE TEXT
            ===================================================== */

            const changeMessage = () => {
                const nextIndex =
                    (currentIndex + 1) % messages.length;

                const nextMessage = messages[nextIndex];

                /*
                 * EXIT
                 */

                gsap.to(
                    [title, subtitle],
                    {
                        opacity: 0,
                        y: -18,
                        filter: "blur(6px)",
                        duration: 0.45,
                        ease: "power2.in",
                        onComplete: () => {

                            /*
                             * CHANGE CONTENT
                             */

                            title.innerHTML = "";

                            if (nextIndex === 0) {
                                title.innerHTML =
                                    "Right Brand<br/>Right Moment";
                            }

                            if (nextIndex === 1) {
                                title.innerHTML =
                                    "Context<br/>Meets Commerce";
                            }

                            if (nextIndex === 2) {
                                title.innerHTML =
                                    "Relevant Ad<br/>Relevant Audience";
                            }

                            if (nextIndex === 3) {
                                title.innerHTML =
                                    "Meaningful Content<br/>Meaningful Connection";
                            }

                            subtitle.textContent =
                                nextMessage.subtitle;

                            /*
                             * ENTER FROM BELOW
                             */

                            gsap.fromTo(
                                [title, subtitle],
                                {
                                    opacity: 0,
                                    y: 18,
                                    filter: "blur(6px)",
                                },
                                {
                                    opacity: 1,
                                    y: 0,
                                    filter: "blur(0px)",
                                    duration: 0.65,
                                    stagger: 0.05,
                                    ease: "power3.out",
                                }
                            );

                            currentIndex = nextIndex;
                        },
                    }
                );
            };

            /*
             * Change every 3.5 seconds
             */

            const interval = setInterval(
                changeMessage,
                3500
            );

            return () => {
                clearInterval(interval);
            };
        }, centerTextRef);

        return () => ctx.revert();
    }, []);

    // Continuous infinite rotation of the whole ring.
    useEffect(() => {
        const ctx = gsap.context(() => {

            /* =====================================================
               HEADING + SUBHEADING ANIMATION
            ===================================================== */

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

            const intro = gsap.timeline({
                scrollTrigger: {
                    trigger: headingRef.current,
                    start: "top 82%",
                    toggleActions: "play none none reverse",
                },
            });

            /* -----------------------------------------------------
               HEADING — WORD BY WORD
            ----------------------------------------------------- */

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

            /* -----------------------------------------------------
               SUBHEADING — SLIDE UP AFTER HEADING
            ----------------------------------------------------- */

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

        }, headingRef);

        spinTween.current = gsap.to(ringRef.current, {
            rotation: 360,
            duration: 50,
            repeat: -1,
            ease: "none",
            transformOrigin: "50% 50%",
        });
        return () => spinTween.current && spinTween.current.kill() && ctx.revert();;
    }, []);

    // Pause the spin while a card is being inspected on hover, resume smoothly after.
    useEffect(() => {
        if (!spinTween.current) return;
        if (hovered !== null) spinTween.current.pause();
        else spinTween.current.play();
    }, [hovered]);

    return (
        <div className="min-h-[150vh] h-[230vh] relative w-full flex flex-col items-center mt-80 px-10">
            <div className="pointer-events-none absolute inset-0">

                {/* Main center glow */}

                <div
                    className="
            absolute
            left-1/2
            top-[30%]
            h-[420px]
            w-[760px]
            -translate-x-1/2
            rounded-full
            bg-violet-600/[0.08]
            blur-[140px]
            sm:h-[480px]
            sm:w-[820px]
            lg:h-[500px]
            lg:w-[860px]
          "
                />

                {/* Left glow */}

                <div
                    className="
            absolute
            bottom-[-180px]
            left-[-120px]
            h-[350px]
            w-[400px]
            rounded-full
            bg-indigo-700/[0.10]
            blur-[130px]
            sm:h-[400px]
            sm:w-[440px]
          "
                />

                {/* Right glow */}

                <div
                    className="
            absolute
            right-[-120px]
            top-[30%]
            h-[350px]
            w-[400px]
            rounded-full
            bg-purple-700/[0.09]
            blur-[130px]
            sm:h-[400px]
            sm:w-[440px]
          "
                />

                {/* =================================================
            LEFT DOT FIELD
        ================================================== */}

                <div
                    className="
            absolute
            left-4
            top-[45%]
            grid
            grid-cols-3
            gap-3
            opacity-50
            sm:left-8
          "
                >
                    {Array.from({ length: 18 }).map((_, index) => (
                        <span
                            key={`left-dot-${index}`}
                            className="
                h-[2px]
                w-[2px]
                rounded-full
                bg-violet-400
                shadow-[0_0_8px_rgba(139,92,246,0.95)]
              "
                        />
                    ))}
                </div>

                {/* =================================================
            RIGHT DOT FIELD
        ================================================== */}

                <div
                    className="
            absolute
            right-4
            top-[45%]
            grid
            grid-cols-3
            gap-3
            opacity-50
            sm:right-8
          "
                >
                    {Array.from({ length: 18 }).map((_, index) => (
                        <span
                            key={`right-dot-${index}`}
                            className="
                h-[2px]
                w-[2px]
                rounded-full
                bg-violet-400
                shadow-[0_0_8px_rgba(139,92,246,0.95)]
              "
                        />
                    ))}
                </div>
            </div>
            <div className="mb-0 text-center relative w-full">
                <div className="pointer-events-none absolute inset-0">

                    {/* Main center glow */}

                    <div
                        className="
            absolute
            left-1/2
            top-[30%]
            h-[420px]
            w-[760px]
            -translate-x-1/2
            rounded-full
            bg-violet-600/[0.08]
            blur-[140px]
            sm:h-[480px]
            sm:w-[820px]
            lg:h-[500px]
            lg:w-[860px]
          "
                    />

                    {/* Left glow */}

                    <div
                        className="
            absolute
            bottom-[-180px]
            left-[-120px]
            h-[350px]
            w-[400px]
            rounded-full
            bg-indigo-700/[0.10]
            blur-[130px]
            sm:h-[400px]
            sm:w-[440px]
          "
                    />

                    {/* Right glow */}

                    <div
                        className="
            absolute
            right-[-120px]
            top-[30%]
            h-[350px]
            w-[400px]
            rounded-full
            bg-purple-700/[0.09]
            blur-[130px]
            sm:h-[400px]
            sm:w-[440px]
          "
                    />
                </div>
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

                    <span>Intelligent Advertising</span>

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
                <h2
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
        xl:text-[60px]
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
                        Where
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
                        Context
                    </span>{" "}

                    <span
                        ref={(el) => {
                            headingWordsRef.current[2] = el;
                        }}
                        className="
            inline-block
            will-change-transform
        "
                    >
                        meets
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
                        Commerce
                    </span>
                </h2>
                <p
                    ref={subtitleRef}
                    className="
        mt-2
        text-base
        text-white/40
        sm:text-lg
        lg:text-xl
    "
                >
                    Turning meaningful content into meaningful brand connections
                </p>            </div>

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
                <div
                    ref={centerTextRef}
                    className="
        absolute
        left-0
        top-1/2
        z-30
        flex
        w-full
        -translate-y-1/2
        items-center
        justify-center
        text-center
        pointer-events-none
    "
                >
                    <div className="px-4">

                        {/* Main changing text */}

                        <h1
                            ref={centerTitleRef}
                            className="
                font-sora
                text-4xl
                font-bold
                leading-[1.05]
                tracking-[-0.04em]
                text-white
                sm:text-5xl
                lg:text-6xl
            "
                        >
                            Right Brand
                            <br />
                            Right Moment
                        </h1>

                        {/* Changing subtitle */}

                        <p
                            ref={centerSubtitleRef}
                            className="
                mt-4
                font-serif
                text-lg
                italic
                text-white/50
                sm:text-xl
                lg:text-2xl
            "
                        >
                            Powered by Context
                        </p>

                    </div>
                </div>
            </div>
        </div>
    );
}