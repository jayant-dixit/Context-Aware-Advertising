import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

import {
  Link2,
  BrainCircuit,
  FileSearch,
  Target,
  Send,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

/* =========================================================
   STEPS
========================================================= */

const steps = [
  {
    number: "01",
    title: "Add Your Video",
    desc: "Paste a YouTube URL and send the video into the ContextAds pipeline.",
    icon: Link2,
  },
  {
    number: "02",
    title: "Analyze the Content",
    desc: "Video, audio and visual frames are processed in parallel to understand what is happening.",
    icon: BrainCircuit,
  },
  {
    number: "03",
    title: "Understand the Context",
    desc: "Topics, scenes, objects, emotions and key moments are combined into rich contextual signals.",
    icon: FileSearch,
  },
  {
    number: "04",
    title: "Find the Right Ad",
    desc: "The extracted context is matched against relevant brands and advertising opportunities.",
    icon: Target,
  },
  {
    number: "05",
    title: "Deliver at the Right Moment",
    desc: "The most relevant ad is selected for the content and placed where it feels natural.",
    icon: Send,
  },
];

/* =========================================================
   WAVE NODES

   Reduced vertical height so the entire timeline
   sits closer to the heading.
========================================================= */

const nodes = [
  { x: 65, y: 170 },
  { x: 300, y: 65 },
  { x: 550, y: 185 },
  { x: 800, y: 65 },
  { x: 1035, y: 170 },
];

/* =========================================================
   WAVE PATH
========================================================= */

const pathD = `
  M ${nodes[0].x} ${nodes[0].y}

  C
  145 ${nodes[0].y}
  215 ${nodes[1].y}
  ${nodes[1].x} ${nodes[1].y}

  C
  390 ${nodes[1].y}
  460 ${nodes[2].y}
  ${nodes[2].x} ${nodes[2].y}

  C
  640 ${nodes[2].y}
  710 ${nodes[3].y}
  ${nodes[3].x} ${nodes[3].y}

  C
  875 ${nodes[3].y}
  950 ${nodes[4].y}
  ${nodes[4].x} ${nodes[4].y}
`;

/* =========================================================
   COMPONENT
========================================================= */

export default function HowItWorks() {
  const sectionRef = useRef(null);

  const pathRef = useRef(null);
  const glowPathRef = useRef(null);
  const dotRef = useRef(null);

  const headingRef = useRef(null);
  const headingWordsRef = useRef([]);
  const paragraphRef = useRef(null);

  const nodeRefs = useRef([]);
  const cardRefs = useRef([]);

  const mobileCardRefs = useRef([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      const path = pathRef.current;
      const glowPath = glowPathRef.current;
      const dot = dotRef.current;

      if (!path || !glowPath || !dot) return;

      /* =====================================================
   HEADER REVEAL
===================================================== */

      const headingWords = headingWordsRef.current;

      gsap.set(headingWords, {
        opacity: 0,
        y: 35,
        filter: "blur(10px)",
      });

      gsap.set(paragraphRef.current, {
        opacity: 0,
        y: 22,
      });

      const headerTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      // Heading (word by word)
      headerTimeline.to(headingWords, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.8,
        stagger: 0.09,
        ease: "power3.out",
      });

      // Paragraph appears AFTER heading
      headerTimeline.to(
        paragraphRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
        },
        "+=0.15"
      );
      /* =====================================================
         DESKTOP ANIMATION
      ===================================================== */

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        /* -----------------------------------------------------
           PATH LENGTH
        ----------------------------------------------------- */

        const pathLength = path.getTotalLength();

        /* -----------------------------------------------------
           INITIAL PATH
        ----------------------------------------------------- */

        gsap.set(path, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        });

        gsap.set(glowPath, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        });

        /* -----------------------------------------------------
           INITIAL NODES
        ----------------------------------------------------- */

        gsap.set(nodeRefs.current, {
          opacity: 0,
          scale: 0.5,
          transformOrigin: "center center",
        });

        /* -----------------------------------------------------
           INITIAL CARDS
        ----------------------------------------------------- */

        cardRefs.current.forEach((card, index) => {
          if (!card) return;

          gsap.set(card, {
            opacity: 0,
            y: index % 2 === 0 ? 20 : -20,
          });
        });

        /* -----------------------------------------------------
           INITIAL DOT
        ----------------------------------------------------- */

        gsap.set(dot, {
          opacity: 0,
        });

        /* =====================================================
           MAIN SCROLL TIMELINE
        ===================================================== */

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,

            /*
             * Start slightly earlier so the section
             * begins feeling connected to the previous section.
             */
            start: "top top",

            /*
             * Reduced scroll distance.
             */
            end: "+=1900",

            scrub: 1,

            pin: true,

            anticipatePin: 1,

            invalidateOnRefresh: true,
          },
        });

        /* =====================================================
           DRAW WAVE
        ===================================================== */

        timeline.to(
          [path, glowPath],
          {
            strokeDashoffset: 0,
            duration: 5,
            ease: "none",
          },
          0
        );

        /* =====================================================
           DOT APPEAR
        ===================================================== */

        timeline.to(
          dot,
          {
            opacity: 1,
            duration: 0.2,
          },
          0
        );

        /* =====================================================
           DOT MOVES ALONG PATH
        ===================================================== */

        timeline.to(
          dot,
          {
            motionPath: {
              path: path,
              align: path,
              alignOrigin: [0.5, 0.5],
            },

            duration: 5,

            ease: "none",
          },
          0
        );

        /* =====================================================
           REVEAL STEPS
        ===================================================== */

        steps.forEach((step, index) => {
          const time = index * 1.05;

          /* ---------------------------------------------------
             NUMBER
          --------------------------------------------------- */

          timeline.to(
            nodeRefs.current[index],
            {
              opacity: 1,
              scale: 1,
              duration: 0.35,
              ease: "back.out(2)",
            },
            time
          );

          /* ---------------------------------------------------
             CARD
          --------------------------------------------------- */

          timeline.to(
            cardRefs.current[index],
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power3.out",
            },
            time + 0.08
          );
        });

        /* =====================================================
           NUMBER PULSE
        ===================================================== */

        nodeRefs.current.forEach((node, index) => {
          if (!node) return;

          const pulse = node.querySelector(".node-pulse");

          if (!pulse) return;

          gsap.to(pulse, {
            scale: 1.8,
            opacity: 0,
            duration: 1.8,
            repeat: -1,
            delay: index * 0.2,
            ease: "power2.out",
          });
        });

        return () => {
          timeline.kill();
        };
      });

      /* =====================================================
         MOBILE ANIMATION
      ===================================================== */

      mm.add("(max-width: 1023px)", () => {
        gsap.set(mobileCardRefs.current, {
          opacity: 0,
          y: 25,
        });

        const mobileTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            end: "bottom 65%",
            scrub: 1,
          },
        });

        mobileTimeline.to(
          mobileCardRefs.current,
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.18,
            ease: "power3.out",
          }
        );

        return () => {
          mobileTimeline.kill();
        };
      });

    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="howitworks"
      className="
        relative
        min-h-screen
        w-full
        bg-black
        text-white
        mt-80
        sm:mt-80
      "
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

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

      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <div
        className="
          relative
          mx-auto
          flex
          min-h-screen
          w-full
          max-w-7xl
          flex-col
          px-5
          py-6
          sm:px-8
          sm:py-8
          lg:px-10
          lg:py-6
        "
      >

        {/* ===================================================
            HEADER
        =================================================== */}

        <div
          className="
            relative
            z-50
            shrink-0
            pt-1
            text-center
            sm:pt-2
          "
        >

          {/* Section label */}

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

            <span>How it works</span>

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

          {/* Heading */}

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
              From
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
              video
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
              to
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
              relevant
            </span>{" "}

            <span
              ref={(el) => {
                headingWordsRef.current[4] = el;
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
              ad
            </span>
          </h2>

          {/* Subtitle */}

          <p
            ref={paragraphRef}
            className="
    mx-auto
    mt-3
    max-w-[600px]
    px-3
    text-[12px]
    leading-5
    text-zinc-500
    sm:mt-3.5
    sm:text-sm
    sm:leading-6
    md:text-base
  "
          >
            See how ContextAds understands content, extracts context,
            and finds the right advertisement.
          </p>
        </div>

        {/* ===================================================
            DESKTOP TIMELINE
        =================================================== */}

        <div
          className="
            relative
            top-28
            hidden
            h-[300px]
            w-full
            min-h-0
            flex-none
            lg:mt-1
            lg:block
            xl:h-[320px]
          "
        >

          {/* =================================================
              SVG WAVE
          ================================================= */}

          <svg
            viewBox="0 0 1100 250"
            preserveAspectRatio="none"
            className="
              absolute
              left-0
              top-[20px]
              h-[clamp(210px,26vw,245px)]
              w-full
              overflow-visible
            "
            fill="none"
          >

            <defs>

              {/* Line gradient */}

              <linearGradient
                id="contextFlowGradient"
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop
                  offset="0%"
                  stopColor="#6366f1"
                />

                <stop
                  offset="50%"
                  stopColor="#8b5cf6"
                />

                <stop
                  offset="100%"
                  stopColor="#a78bfa"
                />
              </linearGradient>

              {/* Glow filter */}

              <filter
                id="contextFlowGlow"
                x="-100%"
                y="-100%"
                width="300%"
                height="300%"
              >
                <feGaussianBlur
                  stdDeviation="5"
                  result="blur"
                />

                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Base line */}

            <path
              d={pathD}
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Wide glow */}

            <path
              ref={glowPathRef}
              d={pathD}
              stroke="#8b5cf6"
              strokeWidth="8"
              strokeLinecap="round"
              opacity="0.30"
              filter="url(#contextFlowGlow)"
            />

            {/* Main line */}

            <path
              ref={pathRef}
              d={pathD}
              stroke="url(#contextFlowGradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Moving dot */}

            <circle
              ref={dotRef}
              r="4"
              fill="#ede9fe"
              filter="url(#contextFlowGlow)"
            />

          </svg>

          {/* =================================================
              DESKTOP STEPS
          ================================================= */}

          <div className="absolute inset-0">

            {steps.map((step, index) => {
              const isBelow = index % 2 === 0;
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="absolute"
                  style={{
                    left: `${(nodes[index].x / 1100) * 100}%`,
                    top: `${nodes[index].y + 20}px`,
                    width: "1px",
                    height: "1px",
                  }}
                >

                  {/* =========================================
                      NUMBER
                  ========================================== */}

                  <div
                    ref={(element) => {
                      nodeRefs.current[index] = element;
                    }}
                    className="
                      absolute
                      left-1/2
                      top-1/2
                      z-40
                      -translate-x-1/2
                      -translate-y-1/2
                    "
                  >
                    <div
                      className="
                        relative
                        flex
                        h-[46px]
                        w-[46px]
                        items-center
                        justify-center
                      "
                    >

                      {/* Pulse */}

                      <span
                        className="
                          node-pulse
                          absolute
                          inset-0
                          rounded-full
                          bg-violet-500/30
                        "
                      />

                      {/* Outer ring */}

                      <span
                        className="
                          absolute
                          inset-0
                          rounded-full
                          border
                          border-violet-400/30
                          bg-black/70
                          shadow-[0_0_22px_rgba(139,92,246,0.30)]
                        "
                      />

                      {/* Number */}

                      <div
                        className="
                          relative
                          flex
                          h-[34px]
                          w-[34px]
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-violet-300/35
                          bg-[#050509]
                          text-[10px]
                          font-semibold
                          text-violet-100
                          ring-[3px]
                          ring-black
                          shadow-[0_0_12px_rgba(139,92,246,0.18)]
                        "
                      >
                        {step.number}
                      </div>
                    </div>
                  </div>

                  {/* =========================================
                      CARD
                  ========================================== */}

                  <div
                    ref={(element) => {
                      cardRefs.current[index] = element;
                    }}
                    className={`
                      absolute
                      left-1/2
                      z-20
                      w-[clamp(220px,21vw,270px)]
                      -translate-x-1/2

                      ${isBelow
                        ? "top-[48px]"
                        : "top-[-164px]"
                      }
                    `}
                  >

                    {/* Connector */}

                    <div
                      className={`
                        absolute
                        left-1/2
                        z-10
                        h-6
                        w-px
                        -translate-x-1/2
                        bg-gradient-to-b
                        from-violet-300/80
                        via-violet-500/50
                        to-transparent

                        ${isBelow
                          ? "-top-6"
                          : "-bottom-6 rotate-180"
                        }
                      `}
                    />

                    {/* Outer card aura */}

                    <div
                      className="
                        pointer-events-none
                        absolute
                        -inset-6
                        rounded-[30px]
                        bg-violet-600/[0.10]
                        blur-3xl
                        opacity-80
                      "
                    />

                    {/* Secondary glow */}

                    <div
                      className="
                        pointer-events-none
                        absolute
                        -inset-2
                        rounded-[23px]
                        border
                        border-violet-500/[0.08]
                        shadow-[0_0_40px_rgba(139,92,246,0.10)]
                      "
                    />

                    {/* Main card */}

                    <div
                      className="
                        group
                        relative
                        flex
                        min-h-[116px]
                        items-center
                        gap-3.5
                        overflow-hidden
                        rounded-[18px]
                        border
                        border-violet-300/[0.13]
                        bg-[#07070d]/95
                        px-4
                        py-4
                        backdrop-blur-xl
                        shadow-[0_0_30px_rgba(124,58,237,0.08),0_0_60px_rgba(76,29,149,0.06)]
                        transition-all
                        duration-500
                        hover:-translate-y-1
                        hover:border-violet-400/40
                        hover:bg-[#090812]/95
                        hover:shadow-[0_0_35px_rgba(139,92,246,0.20),0_0_70px_rgba(109,40,217,0.12)]
                      "
                    >

                      {/* Top edge light */}

                      <div
                        className="
                          pointer-events-none
                          absolute
                          inset-x-6
                          top-0
                          h-px
                          bg-gradient-to-r
                          from-transparent
                          via-violet-300/60
                          to-transparent
                        "
                      />

                      {/* Bottom edge light */}

                      <div
                        className="
                          pointer-events-none
                          absolute
                          inset-x-12
                          bottom-0
                          h-px
                          bg-gradient-to-r
                          from-transparent
                          via-violet-500/20
                          to-transparent
                        "
                      />

                      {/* Corner glow */}

                      <div
                        className="
                          pointer-events-none
                          absolute
                          -right-10
                          -top-10
                          h-24
                          w-24
                          rounded-full
                          bg-violet-500/[0.12]
                          blur-3xl
                          transition-all
                          duration-500
                          group-hover:bg-violet-500/[0.20]
                        "
                      />

                      {/* Left inner glow */}

                      <div
                        className="
                          pointer-events-none
                          absolute
                          -left-6
                          top-1/2
                          h-20
                          w-20
                          -translate-y-1/2
                          rounded-full
                          bg-indigo-500/[0.06]
                          blur-2xl
                        "
                      />

                      {/* =====================================
                          ICON
                      ====================================== */}

                      <div
                        className="
                          relative
                          flex
                          h-[48px]
                          w-[48px]
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-violet-400/30
                          bg-violet-500/[0.08]
                          text-violet-300
                          shadow-[0_0_20px_rgba(139,92,246,0.16),inset_0_0_18px_rgba(139,92,246,0.06)]
                          transition-all
                          duration-500
                          group-hover:border-violet-400/60
                          group-hover:bg-violet-500/[0.13]
                          group-hover:text-violet-200
                          group-hover:shadow-[0_0_28px_rgba(139,92,246,0.32),inset_0_0_20px_rgba(139,92,246,0.10)]
                        "
                      >

                        {/* Icon glow */}

                        <span
                          className="
                            absolute
                            inset-1
                            rounded-full
                            bg-violet-500/[0.10]
                            blur-md
                          "
                        />

                        <Icon
                          size={21}
                          strokeWidth={1.6}
                          className="
                            relative
                            z-10
                            drop-shadow-[0_0_8px_rgba(167,139,250,0.65)]
                          "
                        />
                      </div>

                      {/* =====================================
                          CONTENT
                      ====================================== */}

                      <div className="relative min-w-0 flex-1">

                        {/* Step label */}

                        <div
                          className="
                            mb-1
                            text-[8px]
                            font-semibold
                            uppercase
                            tracking-[0.22em]
                            text-violet-400/75
                          "
                        >
                          Step {step.number}
                        </div>

                        {/* Title */}

                        <h3
                          className="
                            text-[14px]
                            font-semibold
                            leading-tight
                            tracking-[-0.02em]
                            text-white
                          "
                        >
                          {step.title}
                        </h3>

                        {/* Description */}

                        <p
                          className="
                            mt-1.5
                            max-w-[175px]
                            text-[10px]
                            leading-[1.5]
                            text-zinc-400
                          "
                        >
                          {step.desc}
                        </p>

                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===================================================
            MOBILE VERSION
        =================================================== */}

        <div
          className="
            relative
            mt-6
            flex
            w-full
            flex-1
            overflow-hidden
            lg:hidden
          "
        >

          {/* Mobile line */}

          <div
            className="
              absolute
              bottom-0
              left-[17px]
              top-0
              w-px
              bg-gradient-to-b
              from-indigo-500
              via-violet-500
              to-purple-400
            "
          />

          <div
            className="
              flex
              w-full
              flex-col
              gap-5
              pl-10
              sm:gap-6
              sm:pl-12
            "
          >

            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  ref={(element) => {
                    mobileCardRefs.current[index] = element;
                  }}
                  className="relative"
                >

                  {/* Number */}

                  <div
                    className="
                      absolute
                      -left-[39px]
                      top-4
                      z-20
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-violet-300/30
                      bg-[#07070a]
                      text-[8px]
                      font-semibold
                      text-violet-200
                      shadow-[0_0_20px_rgba(139,92,246,0.28)]
                      ring-4
                      ring-black
                      sm:-left-[43px]
                      sm:h-9
                      sm:w-9
                      sm:text-[9px]
                    "
                  >
                    {step.number}
                  </div>

                  {/* Mobile card */}

                  <div
                    className="
                      relative
                      flex
                      w-full
                      items-center
                      gap-3
                      overflow-hidden
                      rounded-2xl
                      border
                      border-violet-300/[0.12]
                      bg-[#08080c]/90
                      px-3.5
                      py-3.5
                      backdrop-blur-xl
                      shadow-[0_0_30px_rgba(99,102,241,0.10)]
                      sm:gap-4
                      sm:px-4
                      sm:py-4
                    "
                  >

                    {/* Icon */}

                    <div
                      className="
                        relative
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-violet-400/30
                        bg-violet-500/[0.08]
                        text-violet-300
                        shadow-[0_0_22px_rgba(139,92,246,0.18)]
                        sm:h-11
                        sm:w-11
                      "
                    >

                      <span
                        className="
                          absolute
                          inset-1
                          rounded-full
                          bg-violet-500/10
                          blur-md
                        "
                      />

                      <Icon
                        size={18}
                        strokeWidth={1.7}
                        className="
                          relative
                          z-10
                          drop-shadow-[0_0_7px_rgba(167,139,250,0.65)]
                          sm:h-[19px]
                          sm:w-[19px]
                        "
                      />
                    </div>

                    {/* Content */}

                    <div className="min-w-0 flex-1">

                      {/* Step */}

                      <div
                        className="
                          text-[7px]
                          font-semibold
                          uppercase
                          tracking-[0.22em]
                          text-violet-400/70
                          sm:text-[8px]
                        "
                      >
                        Step {step.number}
                      </div>

                      {/* Title */}

                      <h3
                        className="
                          mt-1
                          text-[13px]
                          font-semibold
                          leading-tight
                          text-white
                          sm:text-sm
                        "
                      >
                        {step.title}
                      </h3>

                      {/* Description */}

                      <p
                        className="
                          mt-1
                          text-[9px]
                          leading-4
                          text-zinc-500
                          sm:mt-1.5
                          sm:text-[10px]
                          sm:leading-5
                        "
                      >
                        {step.desc}
                      </p>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}