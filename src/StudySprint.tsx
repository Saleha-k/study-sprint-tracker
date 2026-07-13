import React, { useState, useEffect, useRef, useCallback } from "react";

/**
 * STUDY SPRINT — Focus Session Tracker
 * Reference mock for the Web Dev Track Stretch Task.
 *
 * Design tokens live as CSS custom properties on the root wrapper and flip
 * via a `data-theme` attribute — nothing below is a hardcoded hex value.
 *
 * Subject: a CS student's focus-sprint timer. The signature element is the
 * split-flap departure-board timer: tabular monospace digits on dark travel-
 * board tiles, because a sprint should feel like something you're catching,
 * not just watching count down.
 */

const TOKENS = `
[data-theme="light"] {
  --bg: #FAFAF7;
  --surface: #FFFFFF;
  --surface-2: #F0EEE6;
  --ink: #1B1E27;
  --ink-soft: #5B5F6B;
  --line: #E2DFD4;
  --amber: #C97A1D;
  --amber-soft: #F4E3C6;
  --teal: #2F7B6E;
  --teal-soft: #DCEEEA;
  --danger: #B0453C;
  --danger-soft: #F4DEDB;
  --board: #1B1E27;
  --board-digit: #F4E3C6;
  --shadow: 0 1px 2px rgba(27,30,39,0.06), 0 8px 24px rgba(27,30,39,0.06);
}
[data-theme="dark"] {
  --bg: #14171F;
  --surface: #1B1F2A;
  --surface-2: #232838;
  --ink: #F1EFE6;
  --ink-soft: #9A9DAC;
  --line: #2E3342;
  --amber: #E8A23D;
  --amber-soft: #3A2E17;
  --teal: #4FB3A2;
  --teal-soft: #163330;
  --danger: #E37065;
  --danger-soft: #3A1E1B;
  --board: #0D0F15;
  --board-digit: #E8A23D;
  --shadow: 0 1px 2px rgba(0,0,0,.3),0 12px 32px rgba(0,0,0,.35);
}

*{
  transition:
    background-color .3s ease,
    color .3s ease,
    border-color .3s ease,
    box-shadow .3s ease;
}
`;

const DURATIONS: Duration[] = [
  { label: "Sprint", minutes: 25 },
  { label: "Deep", minutes: 50 },
  { label: "Short break", minutes: 5 },
];
type Theme = "light" | "dark";

type Duration = {
  label: string;
  minutes: number;
};

type LogEntry = {
  label: string;
  time: string;
  minutes: number;
  status: "done" | "skipped";
};

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};

type FlapDigitProps = {
  char: string;
};

type TimerBoardProps = {
  seconds: number;
};

type StatBadgeProps = {
  label: string;
  value: string;
  tone?: "ink" | "teal" | "amber";
};

type LogRowProps = {
  entry: LogEntry;
};
function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function FlapDigit({ char }: FlapDigitProps) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-md sm:rounded-lg"
      style={{
        background: "var(--board)",
        color: "var(--board-digit)",
        width: "clamp(2.1rem, 6vw, 3.6rem)",
        height: "clamp(2.8rem, 8vw, 4.6rem)",
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: "clamp(1.5rem, 4.5vw, 2.6rem)",
        fontWeight: 600,
        boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.35), inset 0 2px 0 rgba(255,255,255,0.05)",
        transition: "color 200ms ease, background 200ms ease",
      }}
    >
      {char}
    </span>
  );
}

function TimerBoard({ seconds }: TimerBoardProps) {
  const m = pad(Math.floor(seconds / 60));
  const s = pad(seconds % 60);
  const chars = [...m, ":", ...s];
  return (
    <div
      className="flex items-center gap-1 sm:gap-1.5"
      role="timer"
      aria-live="polite"
      aria-label={`${m} minutes ${s} seconds remaining`}
    >
      {chars.map((c, i) =>
        c === ":" ? (
          <span
            key={i}
            aria-hidden="true"
            style={{ color: "var(--ink-soft)", fontSize: "clamp(1.5rem, 4vw, 2.2rem)", fontWeight: 700 }}
          >
            :
          </span>
        ) : (
          <FlapDigit key={i} char={c} />
        )
      )}
    </div>
  );
}

function Button({
  children,
  variant = "primary",
  size = "md",
  disabled,
  loading,
  onClick,
  type = "button",
}: ButtonProps) {
  const base =
    "relative inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight " +
    "transition-all duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 " +
    "disabled:cursor-not-allowed disabled:opacity-45 active:scale-[0.97]";

  const sizes = { sm: "text-sm px-4 py-2", md: "text-sm px-5 py-2.5", lg: "text-base px-7 py-3.5" };

  const styleByVariant = {
    primary: {
      background: "var(--amber)",
      color: "var(--board)",
      outlineColor: "var(--amber)",
    },
    ghost: {
      background: "transparent",
      color: "var(--ink)",
      border: "1px solid var(--line)",
      outlineColor: "var(--teal)",
    },
    danger: {
      background: "var(--danger-soft)",
      color: "var(--danger)",
      outlineColor: "var(--danger)",
    },
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${base} ${sizes[size]}`}
      style={styleByVariant[variant]}
      onMouseEnter={(e) => {
        if (disabled || loading) return;
        e.currentTarget.style.filter = "brightness(1.08)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.filter = "none";
        e.currentTarget.style.transform = "none";
      }}
    >
      {loading && (
        <span
          className="h-3.5 w-3.5 rounded-full border-2 animate-spin"
          style={{ borderColor: "currentColor", borderTopColor: "transparent" }}
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
}

function StatBadge({
  label,
  value,
  tone = "ink",
}: StatBadgeProps) {
  const toneMap = {
    ink: { bg: "var(--surface-2)", fg: "var(--ink)" },
    teal: { bg: "var(--teal-soft)", fg: "var(--teal)" },
    amber: { bg: "var(--amber-soft)", fg: "var(--amber)" },
  };
  const t = toneMap[tone];
  return (
    <div
      className="flex flex-col gap-0.5 rounded-xl px-4 py-3 min-w-[7.5rem] transition-transform duration-200 hover:-translate-y-1"
      style={{ background: t.bg }}
    >
      <span className="text-[0.7rem] uppercase tracking-wider" style={{ color: "var(--ink-soft)" }}>
        {label}
      </span>
      <span className="text-xl font-semibold" style={{ color: t.fg, fontFamily: "'IBM Plex Mono', monospace" }}>
        {value}
      </span>
    </div>
  );
}

function LogRow({ entry }: LogRowProps) {
  const statusStyles = {
    done: { label: "Completed", bg: "var(--teal-soft)", fg: "var(--teal)" },
    skipped: { label: "Skipped", bg: "var(--danger-soft)", fg: "var(--danger)" },
  };
  const s = statusStyles[entry.status];
  return (
    <li
      className="flex items-center justify-between gap-3 py-3 transition-colors duration-200 hover:bg-[var(--surface-2)]"
      style={{ borderBottom: "1px solid var(--line)" }}
    >
      <div className="flex flex-col">
        <span className="text-sm font-medium" style={{ color: "var(--ink)" }}>
          {entry.label}
        </span>
        <span className="text-xs" style={{ color: "var(--ink-soft)" }}>
          {entry.time} · {entry.minutes} min
        </span>
      </div>
      <span
        className="text-xs font-medium rounded-full px-2.5 py-1"
        style={{ background: s.bg, color: s.fg }}
      >
        {s.label}
      </span>
    </li>
  );
}

export default function StudySprint() {
  const [theme, setTheme] = useState<Theme>(() =>
    (localStorage.getItem("theme") as Theme) || "light"
  );
  const [durationIdx, setDurationIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(DURATIONS[0].minutes * 60);
  const [running, setRunning] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([
    { label: "Deep work — Bison grammar", time: "9:10 AM", minutes: 50, status: "done" },
    { label: "Sprint — SHAP write-up", time: "8:20 AM", minutes: 25, status: "skipped" },
  ]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            if (intervalRef.current !== null) {
              clearInterval(intervalRef.current);
            }
            setRunning(false);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [running]);

  const total = DURATIONS[durationIdx].minutes * 60;
  const pct = Math.round(((total - secondsLeft) / total) * 100);
  const complete = secondsLeft === 0;

  const handleDurationChange = useCallback(
    (idx: number) => {
      if (running) return;
      setDurationIdx(idx);
      setSecondsLeft(DURATIONS[idx].minutes * 60);
    },
    [running]
  );

  const handleReset = () => {
    setRunning(false);
    setSecondsLeft(DURATIONS[durationIdx].minutes * 60);
  };

  const handleFinishSync = () => {
    setSyncing(true);
    setSyncError(false);
    setTimeout(() => {
      setSyncing(false);
      const failed = Math.random() < 0.3;
      if (failed) {
        setSyncError(true);
        return;
      }
      setLog((l) => [
        {
          label: `${DURATIONS[durationIdx].label} — untitled task`,
          time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
          minutes: DURATIONS[durationIdx].minutes,
          status: "done",
        },
        ...l,
      ]);
      handleReset();
    }, 1100);
  };

  return (
    <div data-theme={theme} style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <style>{TOKENS}</style>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap"
      />

      <main className="mx-auto max-w-5xl px-5 sm:px-8 py-8 sm:py-12" style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* Header */}
        <header
  className="flex items-center justify-between mb-10 sm:mb-14"
  aria-label="Study Sprint Header"
>
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: "var(--amber)" }}
            />
            <span
              className="text-sm font-semibold uppercase tracking-[0.14em]"
              style={{ color: "var(--ink-soft)" }}
            >
              Study Sprint
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              const nextTheme = theme === "light" ? "dark" : "light";
              setTheme(nextTheme);
              localStorage.setItem("theme", nextTheme);
            }}
            aria-pressed={theme === "dark"}
            aria-label="Toggle dark mode"
               className="flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium transition-all duration-200 hover:scale-105 hover:shadow-sm active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ background: "var(--surface-2)", color: "var(--ink)", outlineColor: "var(--teal)", border: "1px solid var(--line)" }}
          >
            <span
              aria-hidden="true"
              className="h-3.5 w-3.5 rounded-full"
              style={{ background: theme === "light" ? "var(--amber)" : "var(--teal)" }}
            />
            {theme === "light" ? "Light" : "Dark"}
          </button>
        </header>

        {/* Hero — the thesis */}
        <section
  aria-labelledby="focus-heading"
  className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6 sm:gap-8 mb-10"
>
          <div
            className="rounded-2xl p-6 sm:p-9"
            style={{ background: "var(--surface)", boxShadow: "var(--shadow)" }}
          >
           <h1
              id="focus-heading"
              className="mb-1"
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "clamp(1.6rem, 3.5vw, 2.1rem)",
                fontWeight: 600,
                color: "var(--ink)",
                letterSpacing: "-0.01em",
              }}
            >
              {complete ? "Sprint complete" : running ? "In progress" : "Ready when you are"}
            </h1>
            <p className="text-sm mb-6 sm:mb-8" style={{ color: "var(--ink-soft)" }}>
              {DURATIONS[durationIdx].label} · {DURATIONS[durationIdx].minutes} minutes, heads down.
            </p>

            <div className="flex flex-wrap items-end justify-between gap-6">
              <TimerBoard seconds={secondsLeft} />

              <div
                className="hidden sm:flex flex-col items-end gap-1 min-w-[6rem]"
                aria-hidden="true"
              >
                <div className="w-28 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--surface-2)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      background: complete ? "var(--teal)" : "var(--amber)",
                      transition: "width 900ms linear",
                    }}
                  />
                </div>
                <span className="text-xs" style={{ color: "var(--ink-soft)" }}>
                  {pct}% through
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-7 sm:mt-8 mb-6">
              {DURATIONS.map((d, idx) => {
                const active = idx === durationIdx;
                return (
                  <button
                    key={d.label}
                    type="button"
                    disabled={running}
                    onClick={() => handleDurationChange(idx)}
                    aria-pressed={active}
                   className="text-xs font-medium rounded-full px-3.5 py-1.5 transition-all duration-200 hover:scale-105 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95"
                    style={{
                      background: active ? "var(--amber-soft)" : "transparent",
                      color: active ? "var(--amber)" : "var(--ink-soft)",
                      border: `1px solid ${active ? "var(--amber)" : "var(--line)"}`,
                      outlineColor: "var(--teal)",
                    }}
                  >
                    {d.label} · {d.minutes}m
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {!complete ? (
                <>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setRunning((r) => !r)}
                  >
                    {running ? "Pause" : secondsLeft === total ? "Start sprint" : "Resume"}
                  </Button>
                  <Button variant="ghost" onClick={handleReset} disabled={secondsLeft === total && !running}>
                    Reset
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="primary" size="lg" loading={syncing} onClick={handleFinishSync}>
                    {syncing ? "Saving to log…" : "Save to log"}
                  </Button>
                  <Button variant="ghost" onClick={handleReset}>
                    Discard
                  </Button>
                </>
              )}
            </div>

            {syncError && (
              <div
                role="alert"
                className="mt-4 flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm"
                style={{ background: "var(--danger-soft)", color: "var(--danger)" }}
              >
                <span aria-hidden="true" className="mt-0.5">⚠</span>
                <span>
                  Couldn't save your sprint — the connection dropped. Your time isn't lost; try saving again.
                </span>
              </div>
            )}
          </div>

          {/* Stats rail */}
          <div className="flex flex-col gap-4">
            <div
              className="rounded-2xl p-5 sm:p-6 flex flex-wrap gap-3"
              style={{ background: "var(--surface)", boxShadow: "var(--shadow)" }}
            >
              <StatBadge label="Today" value="2h 15m" tone="amber" />
              <StatBadge label="Streak" value="6 days" tone="teal" />
              <StatBadge label="Sprints" value="3" tone="ink" />
            </div>
            <div
              className="rounded-2xl p-5 sm:p-6 text-sm leading-relaxed"
              style={{ background: "var(--surface)", boxShadow: "var(--shadow)", color: "var(--ink-soft)" }}
            >
              <p style={{ color: "var(--ink)" }} className="font-medium mb-1.5">
                Board tip
              </p>
              Sprints under 30 minutes save automatically to today's log — no need to name them until you review.
            </div>
          </div>
        </section>

        {/* Log */}
       <section
           aria-labelledby="log-heading"
           className="rounded-2xl p-6 sm:p-8"
          style={{ background: "var(--surface)", boxShadow: "var(--shadow)" }}
        >
          <div className="flex items-center justify-between mb-2">
            <h2
              id="log-heading"
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "1.15rem",
                fontWeight: 600,
                color: "var(--ink)",
              }}
            >
              Today's log
            </h2>
            <span className="text-xs" style={{ color: "var(--ink-soft)" }}>
              {log.length} entries
            </span>
          </div>
          <ul>
            {log.map((entry, i) => (
              <LogRow key={i} entry={entry} />
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
