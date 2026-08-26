"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { bio } from "@/data/bio";
import { cn } from "@/lib/utils";
import { detectWebGL } from "@/lib/webgl";
import { EASE_OUT } from "@/lib/motion";
import { BackLink } from "@/components/ui/BackLink";
import { JourneyFooter } from "@/components/footer/JourneyFooter";
import { Question } from "./Question";
import { StageCheckpoint } from "./StageCheckpoint";
import {
  buildFinale,
  stages,
  toAnswer,
  type StageAnswer,
  type StageChip,
} from "./stages";

/**
 * The wait between answering and running. The physics chunk is over a megabyte
 * gzipped (rapier ships its WASM base64-inlined), and every control the course
 * has — progress bar, objective, touch pad, "skip the course" — lives inside
 * it. A null loading state leaves an empty stage for real seconds on a slow
 * link, so the wait gets a designed screen instead. The stage identity is
 * already on screen: BackLink and the stage dots render outside this tree.
 */
function CoursePreparing() {
  return (
    <div
      role="status"
      className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center"
    >
      <p className="text-[11px] uppercase tracking-[0.3em] text-[--color-fg-muted]">
        preparing the course
      </p>
      <span className="relative block h-px w-56 overflow-hidden bg-[--color-border] md:w-72">
        <span className="course-load-bar absolute inset-y-0 left-0 w-1/3 bg-[--stage-accent]" />
      </span>
      <p className="max-w-xs text-sm leading-relaxed text-[--color-fg-muted]">
        Loading the physics engine. On a slow connection this takes a few
        seconds.
      </p>
    </div>
  );
}

// The question step is pure DOM. Keeping the physics and the SVG finale in
// their own chunks lets it paint without waiting on three/rapier.
const Platformer = dynamic(
  () => import("./Platformer").then((m) => m.Platformer),
  { ssr: false, loading: () => <CoursePreparing /> },
);

const RewardScene = dynamic(
  () => import("./RewardScene").then((m) => m.RewardScene),
  { ssr: false, loading: () => null },
);

/**
 * The journey is finite by construction: question → run for each of the
 * three stages, a quick checkpoint after stages 1–2, the full reward after
 * stage 3. The only way back onto the course is "Play again" (full reset).
 */
type Step = "question" | "run" | "checkpoint" | "finale";

function WebGLFallback() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center px-6 py-24">
      <div className="w-full max-w-lg rounded-2xl border border-[--color-border] bg-[--color-bg-elevated]/60 p-8 text-center backdrop-blur-sm md:p-10">
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[--color-fg-muted]">
          The Interactive Journey
        </p>
        <h1 className="text-balance font-display text-3xl italic tracking-tight md:text-4xl">
          Your browser sat this game out.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-[--color-fg-muted]">
          The platformer needs WebGL, and it didn&apos;t answer the call. No
          matter — the reward was always a conversation.
        </p>
        <a
          href={`mailto:${bio.contact.email}`}
          data-cursor="hover"
          className="mt-8 inline-block rounded-full border border-[--color-accent] bg-[--color-accent]/10 px-8 py-3 text-sm font-medium uppercase tracking-[0.2em] text-[--color-accent] transition-colors hover:bg-[--color-accent]/20"
        >
          {bio.contact.email}
        </a>
        <div className="mt-6">
          <BackLink />
        </div>
      </div>
    </main>
  );
}

function StageIndicator({ stageIndex, name }: { stageIndex: number; name: string }) {
  return (
    <div className="absolute right-6 top-6 z-50 flex items-center gap-3">
      <p className="sr-only">
        Stage {stageIndex + 1} of {stages.length} — {name}
      </p>
      <p
        aria-hidden
        className="hidden text-xs uppercase tracking-widest text-[--color-fg-muted] sm:block"
      >
        stage {stageIndex + 1} of {stages.length} — {name}
      </p>
      <div className="flex gap-1.5" aria-hidden>
        {stages.map((s, i) => (
          <span
            key={s.id}
            className={cn(
              "h-1 w-5 rounded-full transition-colors duration-500",
              i < stageIndex && "bg-[--stage-accent]/45",
              i === stageIndex && "bg-[--stage-accent]",
              i > stageIndex && "bg-[--color-border]",
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function PlayExperience() {
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [stageIndex, setStageIndex] = useState(0);
  const [step, setStepState] = useState<Step>("question");
  const [answers, setAnswers] = useState<StageAnswer[]>([]);

  // Every transition is guarded on this ref, not on the `step` closure: an
  // exiting AnimatePresence child still holds the handler from the render
  // that mounted it, so a double-click would otherwise advance twice.
  const stepRef = useRef<Step>("question");
  const setStep = useCallback((next: Step) => {
    stepRef.current = next;
    setStepState(next);
  }, []);

  useEffect(() => {
    setWebgl(detectWebGL());
  }, []);

  // Warm the physics chunk while the question is on screen, so the run step
  // starts instantly without blocking the first paint. Over a megabyte
  // gzipped, so a metered or 2G connection opts out — it pays for the download
  // only if the visitor actually answers. A rejected prefetch is swallowed:
  // the real import on the run step surfaces the failure.
  useEffect(() => {
    if (step !== "question") return;
    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (connection?.saveData) return;
    if (connection?.effectiveType?.includes("2g")) return;
    void import("./Platformer").catch(() => {});
  }, [step]);

  // AnimatePresence swaps the focused element out from under the user; each
  // step root takes focus on mount so focus never falls back to <body>.
  const mounted = useRef(false);
  const focusStepRoot = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    node.focus({ preventScroll: true });
  }, []);

  const handleContextLost = useCallback(() => setWebgl(false), []);

  if (webgl === null) return <main className="min-h-[100svh]" />;
  if (!webgl) return <WebGLFallback />;

  const stage = stages[stageIndex];
  const lastStage = stageIndex === stages.length - 1;

  const handleAnswer = (chip: StageChip) => {
    if (stepRef.current !== "question") return;
    setAnswers((prev) => [...prev.slice(0, stageIndex), toAnswer(stage, chip)]);
    setStep("run");
  };

  const handleCourseCleared = () => {
    if (stepRef.current !== "run") return;
    setStep(lastStage ? "finale" : "checkpoint");
  };

  const handleNextStage = () => {
    if (stepRef.current !== "checkpoint") return;
    setStageIndex((i) => Math.min(i + 1, stages.length - 1));
    setStep("question");
  };

  const handlePlayAgain = () => {
    if (stepRef.current !== "finale") return;
    setAnswers([]);
    setStageIndex(0);
    setStep("question");
  };

  const announcement =
    step === "question"
      ? `Stage ${stageIndex + 1} of ${stages.length}: ${stage.name}. Question.`
      : step === "run"
        ? `Stage ${stageIndex + 1} of ${stages.length}: ${stage.name}. Course started.`
        : step === "checkpoint"
          ? `Checkpoint. ${stage.name} cleared.`
          : "Finale. Your reward is ready.";

  return (
    <main
      className="relative"
      style={
        {
          "--stage-accent": stage.theme.accent,
          "--stage-accent-soft": stage.theme.accentSoft,
        } as CSSProperties
      }
    >
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      <div className="relative min-h-[100svh] overflow-hidden">
        {/* Per-stage backdrop glows, crossfaded as the palette shifts */}
        {stages.map((s, i) => (
          <motion.div
            key={s.id}
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background: `radial-gradient(circle at 50% 30%, ${s.theme.bgGlow}, transparent 60%)`,
            }}
            initial={false}
            animate={{ opacity: i === stageIndex ? 1 : 0 }}
            transition={{ duration: 1.1, ease: EASE_OUT }}
          />
        ))}

        <BackLink stageAccent className="absolute left-6 top-6 z-50" />

        <StageIndicator stageIndex={stageIndex} name={stage.name} />

        <AnimatePresence mode="wait">
          {step === "question" && (
            <motion.div
              key={`question-${stage.id}`}
              ref={focusStepRoot}
              tabIndex={-1}
              className="outline-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, pointerEvents: "auto" }}
              exit={{ opacity: 0, pointerEvents: "none" }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
            >
              <Question stage={stage} onAnswer={handleAnswer} />
            </motion.div>
          )}

          {step === "run" && (
            <motion.div
              key={`run-${stage.id}`}
              ref={focusStepRoot}
              tabIndex={-1}
              className="relative h-[100svh] outline-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, pointerEvents: "auto" }}
              exit={{ opacity: 0, pointerEvents: "none" }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
            >
              <Platformer
                stage={stage}
                onFinish={handleCourseCleared}
                onContextLost={handleContextLost}
              />
            </motion.div>
          )}

          {step === "checkpoint" && answers[stageIndex] && !lastStage && (
            <motion.div
              key={`checkpoint-${stage.id}`}
              ref={focusStepRoot}
              tabIndex={-1}
              className="outline-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, pointerEvents: "auto" }}
              exit={{ opacity: 0, pointerEvents: "none" }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
            >
              <StageCheckpoint
                stage={stage}
                nextStage={stages[stageIndex + 1]}
                answer={answers[stageIndex]}
                onNext={handleNextStage}
              />
            </motion.div>
          )}

          {step === "finale" && (
            <motion.div
              key="finale"
              ref={focusStepRoot}
              tabIndex={-1}
              className="outline-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, pointerEvents: "auto" }}
              exit={{ opacity: 0, pointerEvents: "none" }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
            >
              <RewardScene
                message={buildFinale(answers)}
                onPlayAgain={handlePlayAgain}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Contact is never gated behind finishing the game. It is withheld only
          during the run itself, where a scrollable page would break the
          fixed-viewport course — and "skip the course" exits that in one click. */}
      {step !== "run" && <JourneyFooter />}
    </main>
  );
}
