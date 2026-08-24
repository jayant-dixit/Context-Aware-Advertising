import React from "react";
import { BurningTopGlow } from "./BurningTopGlow";
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


export default function HeroSection({url, changeUrl, startAnalysis}) {
    const allBars = [...bars, ...bars.slice().reverse()];

    return (
        <section className="relative min-h-screen w-full overflow-hidden bg-transparent text-white">
            {/* Bottom atmospheric glow */}
            {/* <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[48%] bg-[radial-gradient(ellipse_at_bottom,rgba(255,61,15,0.28)_0%,rgba(255,31,0,0.08)_42%,transparent_72%)]" /> */}

            {/* Decorative bars */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[74vh] min-h-[430px]">
                <div className="absolute inset-0 flex items-end justify-center">
                    {allBars.map((bar, index) => (
                        <div
                            key={index}
                            className="relative flex-1 max-w-[100px] borde border-[#E85002]"
                            style={{ height: bar.h, opacity: bar.opacity }}
                        >
                            <div
                                className="absolute inset-0"
                                style={{
                                    background:
                                        "linear-gradient(180deg, #000000 0%, #24105c 32%, #4f46e5 100%)",
                                    // boxShadow:
                                    //     "inset 1px 0 rgba(255,110,70,0.18), inset -1px 0 rgba(0,0,0,0.18), 0 -18px 45px rgba(255,54,15,0.08)",
                                }}
                            />
                            {/* <div className="absolute inset-x-0 top-0 h-px bg-orange-300/10" /> */}
                        </div>
                    ))}
                </div>

                {/* Dark mask keeps the bars from becoming too bright behind content */}
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.12)_0%,rgba(0,0,0,0.03)_45%,rgba(0,0,0,0)_100%)]" />
            </div>

            {/* Navigation */}
            <BurningTopGlow />
            <nav className="relative z-20 mx-auto flex w-full max-w-[1320px] items-center justify-between px-6 py-6 sm:px-10 lg:px-16">
                <a href="#" className="text-[21px] tracking-[-0.04em] text-white/90 sm:text-[24px]">
                    Context<span className="font-semibold italic">Ads</span>
                </a>

                <div className="hidden items-center gap-10 text-[15px] text-white/65 md:flex">
                    <a href="#features" className="transition hover:text-white">Features</a>
                    <a href="#about" className="transition hover:text-white">About</a>
                    {/* <a href="#newsletter" className="transition hover:text-white">Newsletter</a> */}
                    <a href="#contact" className="transition hover:text-white">Contact</a>
                </div>

                <a
                    href="#waitlist"
                    className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black shadow-[0_0_25px_rgba(255,255,255,0.06)] transition hover:scale-[1.03] sm:px-5 sm:py-2"
                >
                    Github
                </a>
            </nav>

            {/* Hero content */}
            {/* <div className="relative z-10 mx-auto flex max-w-[1150px] flex-col items-center px-5 pt-[72px] text-center sm:pt-[92px] lg:pt-[55px]">
                {/* Waitlist pill
                <div className="mb-6 flex items-center gap-3 rounded-full border border-white/15 bg-[#161616]/90 px-3 py-2 shadow-[0_0_30px_rgba(255,255,255,0.04)] backdrop-blur-md">
                    <div className="flex -space-x-2">
                        {["#2f6f52", "#a65d35", "#71452f", "#d07c55"].map((color, i) => (
                            <div
                                key={i}
                                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#161616] text-[11px] font-bold text-white"
                                style={{ background: color }}
                            >
                                {["J", "A", "R", "S"][i]}
                            </div>
                        ))}
                    </div>
                    <span className="pr-1 text-sm font-medium text-white/90 sm:text-[15px]">
                        2.4K currently on the waitlist
                    </span>
                </div> */}

            {/* Main heading */}
            {/* <h1 className="max-w-[1050px] text-[56px] font-sora font-semibold leading-[0.70] tracking-[-0.05em] sm:text-[76px] md:text-[92px] lg:text-[80px] xl:text-[55px]">
                    <span className="text-white/85 text-shadow-sm text-shadow-gray-400/10">Ads that Understands</span>
                    <span className="mt-2 block text-shadow-gray-100 text-shadow-sm font-serif text-[48px] font-medium italic leading-[0.95] tracking-[-0.04em] text-white sm:text-[67px] md:text-[78px] lg:text-[72px] xl:text-[75px]">
                        The Context
                    </span>
                </h1>

                {/* Description */}
            {/* <p className="mt-4 max-w-[620px] font-sora text-[10px] leading-5 text-white/65 sm:text-[16px] sm:leading-10 tracking-wide">
                    Understand the content. Find the context. Deliver the right ad.
                </p>  */}

            {/* <div className="bg- flex flex-col bg-transparent rounded-lg overflow-hidden mt-8 w-[60%]">
                    <input className="border-2 rounded-lg border-white/25 py-2 px-4 backdrop-blur-2xl w-full h-14" placeholder="Enter Youtube Url"/>
                    <div className="flex justify-between px-4 rounded-b-lg mx-auto py-2 items-center w-[98%] bg-white/20">
                        <span>
                            AI Powered
                        </span>
                        <button className="bg-white text-black px-4 py-1 rounded-lg cursor-pointer font-dm-sans font-semibold">
                            Analyze
                        </button>
                    </div>
                </div> */}

            {/* <div className="w-full mt-6">
                    <ContextAnalyzer/>
                </div> */}


            {/* Social buttons */}
            {/* <div className="mt-6 flex items-center gap-3">
                    {["youtube", "x", "linkedin"].map((type) => (
                        <a
                            key={type}
                            href="#"
                            aria-label={type}
                            className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-[#171717] text-white/90 shadow-[0_8px_25px_rgba(0,0,0,0.3)] transition hover:-translate-y-1 hover:border-white/20 hover:bg-[#222]"
                        >
                            <SocialIcon type={type} />
                        </a>
                    ))}
                </div> */}
            {/* </div>  */}

            <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col items-center px-5 pt-[82px] text-center sm:pt-[100px] lg:pt-[50px]">

                {/* Main Heading */}
                <h1 className="max-w-[1100px] font-sora font-semibold tracking-[-0.055em]">

                    {/* First Line */}
                    <span className="block text-[48px] leading-[0.95] text-white/90 sm:text-[68px] md:text-[82px] lg:text-[78px] xl:text-[76px]">
                        Ads that Understand
                    </span>

                    {/* Second Line */}
                    <span
                        className="
                mt-3 block
                font-serif
                text-[52px]
                font-medium
                italic
                leading-[0.9]
                tracking-[-0.045em]
                text-white
                drop-shadow-[0_0_25px_rgba(99,102,241,0.18)]
                sm:text-[70px]
                md:text-[84px]
                lg:text-[80px]
                xl:text-[78px]
            "
                    >
                        The Context
                    </span>

                </h1>


                {/* Description */}
                <p
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
                    Understand the content. Find the context. Deliver the right ad.
                </p>


                {/* Context Analyzer */}
                <div
                    className="
            mt-8
            w-full
            max-w-[850px]
            sm:mt-10
        "
                >
                    <ContextAnalyzer url={url} changeUrl={changeUrl} startAnalysis={startAnalysis}/>
                </div>


                {/* Feature Highlights */}
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

                    {/* AI Analysis */}
                    <div className="flex items-center gap-2 transition-colors duration-300 hover:text-indigo-300">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-indigo-400/30 bg-indigo-500/10 text-[10px] text-indigo-400">
                            ✦
                        </span>
                        <span>AI Context Analysis</span>
                    </div>


                    {/* Divider */}
                    <span className="hidden h-1 w-1 rounded-full bg-white/20 sm:block" />


                    {/* Ad Opportunities */}
                    <div className="flex items-center gap-2 transition-colors duration-300 hover:text-indigo-300">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-blue-400/30 bg-blue-500/10 text-[10px] text-blue-400">
                            ◎
                        </span>
                        <span>Relevant Ad Opportunities</span>
                    </div>


                    {/* Divider */}
                    <span className="hidden h-1 w-1 rounded-full bg-white/20 sm:block" />


                    {/* Non Intrusive */}
                    <div className="flex items-center gap-2 transition-colors duration-300 hover:text-indigo-300">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-violet-400/30 bg-violet-500/10 text-[10px] text-violet-400">
                            ⚡
                        </span>
                        <span>Non-Intrusive</span>
                    </div>

                </div>


                {/* Small trust statement */}
                <div
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
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                    Context-aware advertising powered by AI
                </div>

            </div>
        </section>
    );
}