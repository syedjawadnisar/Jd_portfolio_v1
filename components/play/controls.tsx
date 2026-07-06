"use client";

import type { PointerEvent, ReactNode, RefObject } from "react";
import type { KeyboardControlsEntry } from "@react-three/drei";

export type ControlName = "left" | "right" | "jump";

export type TouchState = { left: boolean; right: boolean; jump: boolean };

/** Mutable per-frame player state shared with the camera rig — never triggers renders. */
export type PlayerTracker = { x: number; y: number; vx: number };

export const keyboardMap: KeyboardControlsEntry<ControlName>[] = [
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space", "ArrowUp", "KeyW"] },
];

function HoldButton({
  label,
  onHold,
  children,
}: {
  label: string;
  onHold: (down: boolean) => void;
  children: ReactNode;
}) {
  const press = (e: PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    onHold(true);
  };
  const release = () => onHold(false);

  return (
    <button
      type="button"
      aria-label={label}
      data-cursor="hover"
      onPointerDown={press}
      onPointerUp={release}
      onPointerCancel={release}
      onPointerLeave={release}
      onContextMenu={(e) => e.preventDefault()}
      className="flex h-16 w-16 touch-none select-none items-center justify-center rounded-full border border-[--color-border] bg-[--color-bg-elevated]/70 text-[--color-fg] backdrop-blur-sm transition-colors active:border-[--color-accent] active:bg-[--color-accent]/15 active:text-[--color-accent]"
    >
      {children}
    </button>
  );
}

function Chevron({ direction }: { direction: "left" | "right" | "up" }) {
  const d =
    direction === "left"
      ? "M14 5 L7 12 L14 19"
      : direction === "right"
        ? "M10 5 L17 12 L10 19"
        : "M5 15 L12 7 L19 15";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** On-screen press-and-hold controls for touch / coarse pointers. */
export function TouchControls({ touch }: { touch: RefObject<TouchState> }) {
  const set = (key: ControlName) => (down: boolean) => {
    touch.current[key] = down;
  };

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-20 z-20 flex items-end justify-between px-6 pb-2">
      <div className="pointer-events-auto flex gap-3">
        <HoldButton label="Move left" onHold={set("left")}>
          <Chevron direction="left" />
        </HoldButton>
        <HoldButton label="Move right" onHold={set("right")}>
          <Chevron direction="right" />
        </HoldButton>
      </div>
      <div className="pointer-events-auto">
        <HoldButton label="Jump" onHold={set("jump")}>
          <Chevron direction="up" />
        </HoldButton>
      </div>
    </div>
  );
}
