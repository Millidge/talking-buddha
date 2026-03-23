"use client";

import { useEffect, useMemo, useState } from "react";

type PetalStyle = {
  left: string;
  animationDuration: string;
  animationDelay: string;
  width: string;
  height: string;
  opacity: number;
};

type ParticleStyle = {
  left: string;
  top: string;
  size: string;
  animationDuration: string;
  animationDelay: string;
  opacity: number;
};

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [answerPulse, setAnswerPulse] = useState(false);

  const suggestions = [
    "What is the meaning of life?",
    "How do I start meditating?",
    "How can I find peace in uncertainty?",
  ];

  const petals = useMemo<PetalStyle[]>(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        left: `${4 + i * 5 + (i % 3) * 2}%`,
        animationDuration: `${10 + (i % 5) * 2}s`,
        animationDelay: `${(i % 6) * 1.1}s`,
        width: `${10 + (i % 4) * 4}px`,
        height: `${14 + (i % 4) * 5}px`,
        opacity: 0.28 + (i % 4) * 0.08,
      })),
    []
  );

  const particles = useMemo<ParticleStyle[]>(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        left: `${8 + i * 6}%`,
        top: `${18 + (i % 5) * 12}%`,
        size: `${3 + (i % 4) * 2}px`,
        animationDuration: `${12 + (i % 4) * 5}s`,
        animationDelay: `${i * 0.7}s`,
        opacity: 0.12 + (i % 3) * 0.08,
      })),
    []
  );

  useEffect(() => {
    if (!answer) return;
    setAnswerPulse(true);
    const timeout = setTimeout(() => setAnswerPulse(false), 1800);
    return () => clearTimeout(timeout);
  }, [answer]);

  async function handleAsk() {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAnswer(data.error || "Something went wrong.");
      } else {
        setAnswer(data.answer || "No answer returned.");
      }
    } catch {
      setAnswer("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const words = answer.split(" ");

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-[1.02]"
        style={{ backgroundImage: "url('/buddha-bg.png')" }}
      />

      {/* Base overlays */}
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_15%,rgba(0,0,0,0.5)_100%)]" />

      {/* Breathing glow behind center */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="breathing-glow h-[34rem] w-[34rem] rounded-full" />
      </div>

      {/* Mist layers */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 mist mist-one" />
      <div className="pointer-events-none absolute inset-x-0 bottom-6 h-56 mist mist-two" />

      {/* Floating light particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.map((particle, index) => (
          <span
            key={index}
            className="particle absolute block rounded-full"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity,
              animationDuration: particle.animationDuration,
              animationDelay: particle.animationDelay,
            }}
          />
        ))}
      </div>

      {/* Falling petals */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {petals.map((petal, index) => (
          <span
            key={index}
            className="petal absolute -top-16 block"
            style={{
              left: petal.left,
              width: petal.width,
              height: petal.height,
              opacity: petal.opacity,
              animationDuration: petal.animationDuration,
              animationDelay: petal.animationDelay,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10">
        <div className="w-full max-w-2xl space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-5xl font-semibold tracking-tight text-white/95 drop-shadow-[0_0_25px_rgba(255,255,255,0.15)]">
              The Talking Buddha
            </h1>
            <p className="text-lg text-white/75">
              Ask a question. Receive a calm reflection.
            </p>
          </div>

          <div
            className={`min-h-[180px] rounded-3xl border border-white/10 bg-black/25 p-6 text-left leading-7 backdrop-blur-md transition-all duration-1000 ${
              answerPulse ? "answer-pulse" : ""
            }`}
          >
            {loading ? (
              <p className="text-white/65">Reflecting...</p>
            ) : answer ? (
              <p className="text-white/92">
                {words.map((word, i) => (
                  <span
                    key={i}
                    className="fade-word"
                    style={{ animationDelay: `${i * 0.09}s` }}
                  >
                    {word}&nbsp;
                  </span>
                ))}
              </p>
            ) : (
              <p className="text-white/45">
                Your reflection will appear here.
              </p>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => setQuestion(s)}
                className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white/80 backdrop-blur-sm transition hover:bg-white/10"
              >
                {s}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What is troubling your mind?"
              className="min-h-[120px] w-full rounded-3xl border border-white/10 bg-black/25 p-4 text-white outline-none placeholder:text-white/40 backdrop-blur-md"
            />
            <button
              onClick={handleAsk}
              disabled={loading}
              className="w-full rounded-3xl bg-white py-3 font-medium text-black transition disabled:opacity-50"
            >
              {loading ? "Reflecting..." : "Ask"}
            </button>
          </div>

          <p className="text-xs text-white/45">
            Inspired by Buddhist teachings. Not professional advice.
          </p>
        </div>
      </div>

      <style jsx>{`
        .breathing-glow {
          background: radial-gradient(
            circle,
            rgba(255, 225, 210, 0.12) 0%,
            rgba(255, 210, 235, 0.08) 25%,
            rgba(255, 180, 220, 0.04) 45%,
            rgba(255, 255, 255, 0) 70%
          );
          filter: blur(12px);
          animation: breathe 7s ease-in-out infinite;
        }

        .mist {
          background: radial-gradient(
              ellipse at 20% 50%,
              rgba(255, 255, 255, 0.08),
              transparent 55%
            ),
            radial-gradient(
              ellipse at 60% 60%,
              rgba(255, 220, 235, 0.06),
              transparent 60%
            ),
            radial-gradient(
              ellipse at 85% 40%,
              rgba(255, 255, 255, 0.05),
              transparent 55%
            );
          filter: blur(22px);
        }

        .mist-one {
          animation: driftMistOne 22s ease-in-out infinite alternate;
        }

        .mist-two {
          animation: driftMistTwo 30s ease-in-out infinite alternate;
        }

        .particle {
          background: rgba(255, 245, 240, 0.9);
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.22);
          animation-name: floatParticle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        .petal {
          background: linear-gradient(
            180deg,
            rgba(255, 214, 224, 0.95),
            rgba(244, 163, 181, 0.9)
          );
          border-radius: 70% 30% 70% 30%;
          filter: blur(0.2px);
          box-shadow: 0 0 10px rgba(255, 192, 203, 0.15);
          animation-name: fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .petal::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.35),
            rgba(255, 255, 255, 0)
          );
          transform: scale(0.7);
        }

        .fade-word {
          opacity: 0;
          display: inline-block;
          animation: fadeWord 0.6s ease forwards;
        }

        .answer-pulse {
          box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.06),
            0 0 24px rgba(255, 235, 220, 0.08),
            0 0 60px rgba(255, 210, 230, 0.06);
        }

        @keyframes breathe {
          0%,
          100% {
            transform: scale(0.96);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
        }

        @keyframes driftMistOne {
          0% {
            transform: translateX(-4%) translateY(0);
            opacity: 0.45;
          }
          100% {
            transform: translateX(4%) translateY(-8px);
            opacity: 0.65;
          }
        }

        @keyframes driftMistTwo {
          0% {
            transform: translateX(3%) translateY(0);
            opacity: 0.32;
          }
          100% {
            transform: translateX(-5%) translateY(-10px);
            opacity: 0.5;
          }
        }

        @keyframes floatParticle {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-18px) translateX(8px);
          }
        }

        @keyframes fall {
          0% {
            transform: translate3d(0, -10vh, 0) rotate(0deg);
          }
          25% {
            transform: translate3d(20px, 25vh, 0) rotate(90deg);
          }
          50% {
            transform: translate3d(-15px, 50vh, 0) rotate(180deg);
          }
          75% {
            transform: translate3d(25px, 75vh, 0) rotate(270deg);
          }
          100% {
            transform: translate3d(-10px, 110vh, 0) rotate(360deg);
          }
        }

        @keyframes fadeWord {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}