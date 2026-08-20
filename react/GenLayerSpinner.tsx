import React, { useId, useMemo } from "react";

/**
 * <GenLayerSpinner />
 * Official GenLayer Portal loading spinner. Three concepts, one API.
 *
 *   <GenLayerSpinner variant="orbit"   size="lg" />   // hero / splash
 *   <GenLayerSpinner variant="neural"  size="md" />   // cards / modals
 *   <GenLayerSpinner variant="portal"  size="sm" />   // buttons / badges
 *
 * Sizes accept the preset tokens below or any pixel number.
 * Colors and speed default to brand tokens and can be overridden per-call
 * without touching the component — useful for status coloring
 * (e.g. an amber spinner while a transaction is pending vs. green on retry).
 */

export type GenLayerSpinnerVariant = "orbit" | "neural" | "portal";
export type GenLayerSpinnerSize = "sm" | "md" | "lg" | number;

export interface GenLayerSpinnerProps {
  /** Visual concept. Defaults to "orbit". */
  variant?: GenLayerSpinnerVariant;
  /** Preset token (sm=16, md=32, lg=64) or an explicit pixel size. */
  size?: GenLayerSpinnerSize;
  /** Gradient start color. Defaults to GenLayer Violet. */
  colorFrom?: string;
  /** Gradient end color. Defaults to Cyan-Teal. */
  colorTo?: string;
  /** Full rotation cycle length in seconds. 0.5–3 recommended. */
  speed?: number;
  /** Accessible label announced by screen readers. */
  label?: string;
  /** Additional classes applied to the wrapping <span>. */
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
  colorFrom = "#7A40FF",
  colorTo = "#00F5D4",
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
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle cx="50" cy="50" r="42" fill="none" stroke="var(--gl-track, rgba(255,255,255,.08))" strokeWidth="6" />
      <circle cx="50" cy="50" r="29" fill="none" stroke="var(--gl-track, rgba(255,255,255,.08))" strokeWidth="5" />
      <g className="gl-orbit-outer" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "gl-cw var(--gl-duration) linear infinite" }}>
        <circle cx="50" cy="50" r="42" fill="none" stroke={`url(#${gradA})`} strokeWidth="6" strokeLinecap="round" strokeDasharray="198 66" />
      </g>
      <g className="gl-orbit-inner" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "gl-ccw calc(var(--gl-duration) * 1.4) linear infinite" }}>
        <circle cx="50" cy="50" r="29" fill="none" stroke={`url(#${gradB})`} strokeWidth="5" strokeLinecap="round" strokeDasharray="109 73" />
      </g>
      <circle
        cx="50" cy="50" r="6"
        fill="var(--gl-b)"
        filter={`url(#${glow})`}
        style={{ transformBox: "fill-box", transformOrigin: "center", animation: "gl-pulse calc(var(--gl-duration) * .9) ease-in-out infinite" }}
      />
    </svg>
  );
}

/* ---------------------------------------------------------------------- */
/* Concept B — Neural Loop                                                */
/* ---------------------------------------------------------------------- */
function NeuralSVG({ uid }: { uid: string }) {
  const grad = `gl-neural-${uid}`;
  const glow = `gl-neural-glow-${uid}`;
  const nodeStyle = (delay: number): React.CSSProperties => ({
    transformBox: "fill-box",
    transformOrigin: "center",
    animation: "gl-pulse calc(var(--gl-duration) * 1.1) ease-in-out infinite",
    animationDelay: `calc(var(--gl-duration) * ${delay})`,
  });
  return (
    <svg viewBox="0 0 100 100" className="block overflow-visible w-full h-full">
      <defs>
        <linearGradient id={grad} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--gl-a)" />
          <stop offset="50%" stopColor="var(--gl-b)" />
          <stop offset="100%" stopColor="var(--gl-a)" />
        </linearGradient>
        <filter id={glow} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="1.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M50,18 A40,40 0 0,1 77.71,66 A40,40 0 0,1 22.29,66 A40,40 0 0,1 50,18 Z"
        fill="none" stroke="var(--gl-track, rgba(255,255,255,.08))" strokeWidth="3"
      />
      <path
        d="M50,18 A34,34 0 0,1 77.71,66 A34,34 0 0,1 22.29,66 A34,34 0 0,1 50,18 Z"
        fill="none" stroke={`url(#${grad})`} strokeWidth="3.5" strokeLinecap="round" strokeDasharray="44 154"
        style={{
          transformBox: "fill-box",
          transformOrigin: "center",
          animation:
            "gl-dash calc(var(--gl-duration) * 1.1) linear infinite, gl-morph calc(var(--gl-duration) * 2.2) ease-in-out infinite",
        }}
      />
      <circle cx="50" cy="18" r="4" fill="var(--gl-b)" filter={`url(#${glow})`} style={nodeStyle(0)} />
      <circle cx="77.71" cy="66" r="4" fill="var(--gl-a)" filter={`url(#${glow})`} style={nodeStyle(-0.37)} />
      <circle cx="22.29" cy="66" r="4" fill="var(--gl-a)" filter={`url(#${glow})`} style={nodeStyle(-0.74)} />
    </svg>
  );
}

/* ---------------------------------------------------------------------- */
/* Concept C — Minimal Portal                                             */
/* ---------------------------------------------------------------------- */
function PortalSVG({ uid }: { uid: string }) {
  const grad = `gl-portal-${uid}`;
  return (
    <svg viewBox="0 0 24 24" className="block overflow-visible w-full h-full">
      <defs>
        <linearGradient id={grad} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--gl-a)" />
          <stop offset="100%" stopColor="var(--gl-b)" />
        </linearGradient>
      </defs>
      <circle
        cx="12" cy="12" r="9"
        fill="none" stroke={`url(#${grad})`} strokeWidth="3" strokeLinecap="round" strokeDasharray="42.4 14.1"
        style={{ transformBox: "fill-box", transformOrigin: "center", animation: "gl-cw calc(var(--gl-duration) * .6) linear infinite" }}
      />
    </svg>
  );
}

export default GenLayerSpinner;

/**
 * Global keyframes — add once to your app's root stylesheet (e.g. globals.css).
 * Tailwind's @layer utilities is a good home for these.
 *
 * @keyframes gl-cw    { to { transform: rotate(360deg); } }
 * @keyframes gl-ccw   { to { transform: rotate(-360deg); } }
 * @keyframes gl-dash  { to { stroke-dashoffset: -198; } }
 * @keyframes gl-pulse {
 *   0%, 100% { opacity: .5;  transform: scale(.82); }
 *   50%      { opacity: 1;   transform: scale(1.18); }
 * }
 * @keyframes gl-morph {
 *   0%, 100% { d: path("M50,18 A34,34 0 0,1 77.71,66 A34,34 0 0,1 22.29,66 A34,34 0 0,1 50,18 Z"); }
 *   50%      { d: path("M50,18 A46,46 0 0,1 77.71,66 A46,46 0 0,1 22.29,66 A46,46 0 0,1 50,18 Z"); }
 * }
 */
