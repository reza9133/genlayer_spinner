import React, { useId, useMemo } from "react";

export type GenLayerSpinnerVariant = "orbit" | "neural" | "portal";
export type GenLayerSpinnerSize = "sm" | "md" | "lg" | number;

export interface GenLayerSpinnerProps {
  variant?: GenLayerSpinnerVariant;
  size?: GenLayerSpinnerSize;
  colorFrom?: string;
  colorTo?: string;
  speed?: number;
  label?: string;
  className?: string;
}

const SIZE_MAP: Record<Exclude<GenLayerSpinnerSize, number>, number> = {
  sm: 16,
  md: 32,
  lg: 64,
};

const DEFAULT_SPEED: Record<GenLayerSpinnerVariant, number> = {
  orbit: 1.6,
  neural: 1.6,
  portal: 1.1,
};

export function GenLayerSpinner({
  variant = "orbit",
  size = "md",
  colorFrom = "#F59E0B",
  colorTo = "#0EA5E9",
  speed,
  label = "Loading",
  className = "",
}: GenLayerSpinnerProps) {
  const uid = useId().replace(/:/g, "");
  const px = typeof size === "number" ? size : SIZE_MAP[size];
  const duration = speed ?? DEFAULT_SPEED[variant];

  const style = useMemo(
    () =>
      ({
        "--gl-a": colorFrom,
        "--gl-b": colorTo,
        "--gl-duration": `${duration}s`,
        width: px,
        height: px,
      }) as React.CSSProperties,
    [colorFrom, colorTo, duration, px],
  );

  return (
    <span
      role="status"
      aria-label={label}
      className={`gl-spinner gl-spinner-react inline-flex leading-none motion-reduce:[--gl-duration:2.6s] ${className}`}
      style={style}
    >
      {variant === "orbit" && <OrbitSVG uid={uid} />}
      {variant === "neural" && <NeuralSVG uid={uid} />}
      {variant === "portal" && <PortalSVG uid={uid} />}
      <span className="sr-only">{label}</span>
    </span>
  );
}

/* ---------------------------------------------------------------------- */
/* Concept A — Consensus Orbit                                            */
/* ---------------------------------------------------------------------- */
function OrbitSVG({ uid }: { uid: string }) {
  const gradA = `gl-orbit-a-${uid}`;
  const gradB = `gl-orbit-b-${uid}`;
  const glow = `gl-orbit-glow-${uid}`;
  return (
    <svg viewBox="0 0 100 100" className="block overflow-visible w-full h-full">
      <defs>
        <linearGradient id={gradA} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--gl-a)" />
          <stop offset="100%" stopColor="var(--gl-b)" />
        </linearGradient>
        <linearGradient id={gradB} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--gl-b)" />
          <stop offset="100%" stopColor="var(--gl-a)" />
        </linearGradient>
        <filter id={glow} x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 4" opacity="0.15"/>
      
      <g className="gl-logo-spin" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "gl-cw calc(var(--gl-duration) * 1.5) linear infinite" }}>
        <g transform="translate(32, 32) scale(0.36)">
          <path d="M 46,10 L 10,90 L 46,78 L 30,62 L 46,46 Z M 54,10 L 90,90 L 54,78 L 70,62 L 54,46 Z" fill={`url(#${gradA})`} opacity="0.9" />
          <path d="M 50,50 L 62,62 L 50,74 L 38,62 Z" fill="var(--gl-b)" filter={`url(#${glow})`} />
        </g>
      </g>

      <g className="gl-orbit-outer" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "gl-ccw var(--gl-duration) linear infinite" }}>
        <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 8" opacity="0.3" />
        <circle cx="50" cy="50" r="40" fill="none" stroke={`url(#${gradA})`} strokeWidth="4.5" strokeLinecap="round" strokeDasharray="140 80" />
      </g>
      <g className="gl-orbit-inner" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "gl-cw calc(var(--gl-duration) * 1.2) linear infinite" }}>
        <circle cx="50" cy="50" r="28" fill="none" stroke={`url(#${gradB})`} strokeWidth="3" strokeLinecap="round" strokeDasharray="80 60" />
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------------- */
/* Concept B — Neural Orbit (Pure GPU Rotation)                           */
/* ---------------------------------------------------------------------- */
function NeuralSVG({ uid }: { uid: string }) {
  const grad = `gl-neural-${uid}`;
  const glow = `gl-neural-glow-${uid}`;

  return (
    <svg viewBox="0 0 100 100" className="block overflow-visible w-full h-full">
      <defs>
        <linearGradient id={grad} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--gl-a)" />
          <stop offset="100%" stopColor="var(--gl-b)" />
        </linearGradient>
        <filter id={glow} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <style>{`
          @keyframes gl-opulse-${uid} {
            0% { opacity: 0.35; filter: drop-shadow(0 0 2px var(--gl-a)); }
            100% { opacity: 1; filter: drop-shadow(0 0 12px var(--gl-b)); }
          }
        `}</style>
      </defs>

      {/* Core Breathing */}
      <g style={{ animation: `gl-opulse-${uid} calc(var(--gl-duration) * 1.5) ease-in-out infinite alternate` }}>
        <g transform="translate(32, 32) scale(0.36)">
          <path d="M 46,10 L 10,90 L 46,78 L 30,62 L 46,46 Z M 54,10 L 90,90 L 54,78 L 70,62 L 54,46 Z" fill="var(--gl-a)" opacity="0.8" />
          <path d="M 50,50 L 62,62 L 50,74 L 38,62 Z" fill="var(--gl-b)" filter={`url(#${glow})`} />
        </g>
      </g>

      {/* Static Background Track */}
      <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.15" />

      {/* Smooth Rotating Flow Path */}
      <g className="gl-neural-arc" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "gl-cw calc(var(--gl-duration) * 1.2) linear infinite" }}>
        <circle cx="50" cy="50" r="38" fill="none" stroke={`url(#${grad})`} strokeWidth="4.5" strokeLinecap="round" strokeDasharray="100 140" opacity="0.9" />
      </g>

      {/* Orbiting Nodes (100% GPU Transform) */}
      <g className="gl-neural-nodes" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "gl-ccw var(--gl-duration) linear infinite" }}>
        <circle cx="50" cy="12" r="5.5" fill="var(--gl-b)" filter={`url(#${glow})`} />
        <circle cx="82.9" cy="69" r="5.5" fill="var(--gl-a)" filter={`url(#${glow})`} />
        <circle cx="17.1" cy="69" r="5.5" fill="var(--gl-a)" filter={`url(#${glow})`} />
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------------- */
/* Concept C — Minimal Portal                                             */
/* ---------------------------------------------------------------------- */
function PortalSVG({ uid }: { string }) {
  const grad = `gl-portal-${uid}`;
  return (
    <svg viewBox="0 0 24 24" className="block overflow-visible w-full h-full">
      <defs>
        <linearGradient id={grad} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--gl-a)" />
          <stop offset="100%" stopColor="var(--gl-b)" />
        </linearGradient>
      </defs>
      <g className="gl-logo-spin" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "gl-cw calc(var(--gl-duration) * 1.2) linear infinite" }}>
        <g transform="translate(6.5, 6.5) scale(0.11)">
          <path d="M 46,10 L 10,90 L 46,78 L 30,62 L 46,46 Z M 54,10 L 90,90 L 54,78 L 70,62 L 54,46 Z M 50,50 L 62,62 L 50,74 L 38,62 Z" fill="var(--gl-a)" opacity="0.9" />
        </g>
      </g>
      <g className="gl-portal-ring" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "gl-ccw calc(var(--gl-duration) * .8) linear infinite" }}>
        <circle cx="12" cy="12" r="9" fill="none" stroke={`url(#${grad})`} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="38 18" />
        <circle cx="12" cy="12" r="6" fill="none" stroke={`url(#${grad})`} strokeWidth="1" strokeDasharray="10 10" opacity="0.6" />
      </g>
    </svg>
  );
}

export default GenLayerSpinner;
