import  { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import like from "../../../public/assetss/images/pot.png"

// CapCut-style jitter = noise-based camera shake + RGB split + scanlines
export default function GlitchJitterScreen() {
  const frameRef = useRef(null);
  const [enabled, setEnabled] = useState(true);

  const tRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    let raf;

    const tick = () => {
      tRef.current += 0.01;
      const t = tRef.current;

      const intensity = 7;

      const x =
        Math.sin(t * 1.7) * intensity +
        Math.sin(t * 3.1) * (intensity * 0.4);

      const y =
        Math.cos(t * 1.3) * intensity +
        Math.sin(t * 2.7) * (intensity * 0.4);

      const r = Math.sin(t * 2.2) * 1.2;

      if (frameRef.current) {
        frameRef.current.style.transform =
          `translate3d(${x}px, ${y}px, 0) rotate(${r}deg) scale(1.02)`;
      }

      raf = requestAnimationFrame(tick);
    };

    tick();
    return () => cancelAnimationFrame(raf);
  }, [enabled]);

  return (
    <div className="tiwai">

      {/* Toggle */}
      <button
        onClick={() => setEnabled(v => !v)}
        className="distt"
      >
        {enabled ? "stop" : "Start"}
      </button>

      {/* Screen container */}
      <div className="relative w-[340px] h-[600px]">

        {/* Grain texture */}
        <div className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://i.imgur.com/3ZQ3Z4M.png')] bg-repeat animate-pulse" />

        {/* Scanlines */}
        <div className="pointer-events-none absolute inset-0 opacity-10 bg-[linear-gradient(to_bottom,transparent_50%,black_50%)] bg-[length:100%_4px]" />

        {/* Glow frame */}
        <div className="absolute inset-0 border-[10px] border-red-700 rounded-3xl shadow-[0_0_60px_rgba(255,255,0,0.35)]" />

        {/* RGB Split layers */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-red-600 via-transparent to-transparent mix-blend-screen opacity-30 translate-x-[2px]" />
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-600 via-transparent to-transparent mix-blend-screen opacity-30 -translate-x-[2px]" />

        {/* MAIN JITTER LAYER */}
        <div
          ref={frameRef}
          className="relative w-full h-full rounded-3xl overflow-hidden bg-black"
        >

          {/* INTERNET IMAGE SUBJECT */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={like}
              alt="subject"
              className="w-full h-full object-cover"
            />
          </div>

          {/* vignette */}
          <div className="absolute inset-0 shadow-[inset_0_0_140px_rgba(0,0,0,0.95)]" />

          {/* subtle flicker */}
          <motion.div
            className="absolute inset-0 bg-white opacity-0"
            animate={{ opacity: [0, 0.06, 0, 0.02, 0] }}
            transition={{ repeat: Infinity, duration: 0.12 }}
          />

          {/* edge glow */}
          <div className="absolute inset-0 border-[1px] border-white/10 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}