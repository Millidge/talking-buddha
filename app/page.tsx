"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";

type SavedReflection = {
  id: string;
  text: string;
  createdAt: string;
};

type BurstPetal = {
  id: string;
  left: string;
  top: string;
  delay: string;
  duration: string;
  driftX: string;
  driftY: string;
  rotate: string;
  size: string;
};

const SUGGESTIONS = [
  "What is the meaning of life?",
  "How do I start meditating?",
  "How can I find peace in uncertainty?",
];

function TypingFadeText({ text }: { text: string }) {
  const words = useMemo(() => text.split(" "), [text]);

  return (
    <p className="leading-9 text-[1.1rem] font-medium text-stone-100 md:text-[1.35rem]">
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="animate-wordFade mr-2 inline-block opacity-0"
          style={{ animationDelay: `${i * 0.09}s` }}
        >
          {word}
        </span>
      ))}
    </p>
  );
}

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [displayedAnswer, setDisplayedAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [breathing, setBreathing] = useState(false);
  const [savedReflections, setSavedReflections] = useState<SavedReflection[]>(
    []
  );
  const [showSaved, setShowSaved] = useState(false);
  const [burstPetals, setBurstPetals] = useState<BurstPetal[]>([]);
  const [answerPulse, setAnswerPulse] = useState(false);
  const [backgroundRipple, setBackgroundRipple] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("talking-buddha-reflections");
    if (stored) {
      try {
        setSavedReflections(JSON.parse(stored));
      } catch {
        setSavedReflections([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "talking-buddha-reflections",
      JSON.stringify(savedReflections)
    );
  }, [savedReflections]);

  function triggerPetalBurst() {
    const petals: BurstPetal[] = Array.from({ length: 18 }).map((_, i) => ({
      id: `${Date.now()}-${i}`,
      left: `${22 + Math.random() * 32}%`,
      top: `${8 + Math.random() * 10}%`,
      delay: `${Math.random() * 0.18}s`,
      duration: `${2.2 + Math.random() * 1.2}s`,
      driftX: `${-180 + Math.random() * 360}px`,
      driftY: `${180 + Math.random() * 220}px`,
      rotate: `${-260 + Math.random() * 520}deg`,
      size: `${12 + Math.random() * 8}px`,
    }));

    setBurstPetals(petals);
    setAnswerPulse(true);
    setBackgroundRipple(true);

    setTimeout(() => {
      setBurstPetals([]);
    }, 3000);

    setTimeout(() => {
      setAnswerPulse(false);
    }, 1600);

    setTimeout(() => {
      setBackgroundRipple(false);
    }, 1800);
  }

  async function askQuestion(customQuestion?: string) {
    const finalQuestion = customQuestion ?? question;

    if (!finalQuestion.trim()) return;

    setLoading(true);
    setBreathing(true);
    setAnswer("");
    setDisplayedAnswer("");
    setAnswerPulse(false);
    setBackgroundRipple(false);

    try {
      const res = await fetch("https://talkingbuddha.co.uk/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: finalQuestion }),
      });

      const data = await res.json();
      const nextAnswer =
        data.answer || "A quiet answer did not arrive this time.";

      setAnswer(nextAnswer);

      // Breath before response appears
      setTimeout(() => {
        setBreathing(false);
        setDisplayedAnswer(nextAnswer);
        triggerPetalBurst();
      }, 1700);
    } catch {
      const fallback =
        "Stillness remains, but the words did not arrive.\n\nPlease try again.";
      setAnswer(fallback);

      setTimeout(() => {
        setBreathing(false);
        setDisplayedAnswer(fallback);
        setAnswerPulse(true);
        setTimeout(() => setAnswerPulse(false), 1400);
      }, 1700);
    } finally {
      setLoading(false);
    }
  }

  function saveReflection() {
    if (!displayedAnswer.trim()) return;

    const alreadySaved = savedReflections.some(
      (item) => item.text === displayedAnswer
    );
    if (alreadySaved) return;

    const newReflection: SavedReflection = {
      id: crypto.randomUUID(),
      text: displayedAnswer,
      createdAt: new Date().toISOString(),
    };

    setSavedReflections((prev) => [newReflection, ...prev]);
    setShowSaved(true);
  }

  function deleteReflection(id: string) {
    setSavedReflections((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 z-0">
        <img
          src="/buddha-bg.png"
          alt="Buddha beneath a cherry blossom tree"
          className="h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/35 to-black/75" />

        <div
          className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
            backgroundRipple ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="background-ripple absolute inset-0" />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center">
        <div className="breathing-glow h-[34rem] w-[34rem] rounded-full" />
      </div>

      <div className="mist mist-1 z-[2]" />
      <div className="mist mist-2 z-[2]" />

      {/* Background petals: above background, behind UI */}
      <div className="petals z-[3]">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="petal"
            style={
              {
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${12 + Math.random() * 10}s`,
                "--drift": `${(Math.random() * 90 - 45).toFixed(0)}px`,
                "--rotate": `${(Math.random() * 140 - 70).toFixed(0)}deg`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      {/* Response petals: above background, behind text */}
      <div className="pointer-events-none absolute inset-0 z-[4] overflow-hidden">
        {burstPetals.map((petal) => (
          <span
            key={petal.id}
            className="burst-petal absolute"
            style={
              {
                left: petal.left,
                top: petal.top,
                width: petal.size,
                height: `calc(${petal.size} * 0.72)`,
                animationDelay: petal.delay,
                animationDuration: petal.duration,
                "--burst-x": petal.driftX,
                "--burst-y": petal.driftY,
                "--burst-rotate": petal.rotate,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-10 md:px-8">
        <div className="mx-auto w-full max-w-4xl text-center">
          <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
            The Talking Buddha
          </h1>
          <p className="mt-4 text-lg text-stone-200 md:text-2xl">
            Ask a question. Receive a calm reflection.
          </p>
        </div>

        <div
          className={`relative mx-auto mt-10 w-full max-w-4xl rounded-3xl border p-6 backdrop-blur-md md:p-8 transition-all duration-700 ${
            answerPulse
              ? "answer-pulse border-white/20 bg-black/35"
              : "border-white/10 bg-black/30 shadow-2xl"
          }`}
        >
          <div className="relative z-20">
            {breathing ? (
              <div className="flex min-h-[120px] flex-col items-center justify-center text-center">
                <div className="response-breath-glow mb-4 h-16 w-16 rounded-full" />
                <p className="text-sm tracking-[0.2em] uppercase text-stone-300/80">
                  Breathe
                </p>
              </div>
            ) : displayedAnswer ? (
              <>
                <TypingFadeText text={displayedAnswer} />

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={saveReflection}
                    className="rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/20"
                  >
                    Save Reflection
                  </button>
                </div>
              </>
            ) : (
              <p className="text-lg leading-8 text-stone-200 md:text-xl">
                Be still for a moment. Ask what is on your heart.
              </p>
            )}
          </div>
        </div>

        <div className="mx-auto mt-8 flex w-full max-w-4xl flex-wrap items-center justify-center gap-3">
          {SUGGESTIONS.map((item) => (
            <button
              key={item}
              onClick={() => {
                setQuestion(item);
                askQuestion(item);
              }}
              className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm text-stone-100 backdrop-blur-sm transition hover:bg-white/20"
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mx-auto mt-8 w-full max-w-4xl">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What is on your mind?"
            className="min-h-[120px] w-full rounded-3xl border border-white/10 bg-black/35 p-5 text-lg text-white outline-none placeholder:text-stone-300 backdrop-blur-md"
          />

          <button
            onClick={() => askQuestion()}
            disabled={loading || breathing}
            className="mt-4 w-full rounded-full bg-white py-4 text-lg font-medium text-black transition hover:opacity-90 disabled:opacity-50"
          >
            {loading || breathing ? "Listening..." : "Ask"}
          </button>

          <p className="mt-4 text-center text-xs text-stone-300/80">
            Inspired by Buddhist teachings. Not medical, legal, mental health,
            or crisis advice.
          </p>
        </div>

        <div className="mx-auto mt-10 w-full max-w-4xl">
          <button
            onClick={() => setShowSaved((prev) => !prev)}
            className="text-sm text-stone-300/70 transition hover:text-stone-200"
          >
            {showSaved
              ? `Hide saved reflections (${savedReflections.length})`
              : `Saved reflections (${savedReflections.length})`}
          </button>

          {showSaved && savedReflections.length > 0 && (
            <div className="mt-4 space-y-3">
              {savedReflections.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/8 bg-black/15 p-4 backdrop-blur-sm"
                >
                  <p className="whitespace-pre-wrap text-sm leading-7 text-stone-200/90">
                    {item.text}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="text-[11px] text-stone-400/80">
                      Saved {new Date(item.createdAt).toLocaleDateString()}
                    </span>

                    <button
                      onClick={() => deleteReflection(item.id)}
                      className="text-xs text-stone-400/80 transition hover:text-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showSaved && savedReflections.length === 0 && (
            <div className="mt-4 rounded-2xl border border-white/8 bg-black/10 p-4 text-sm text-stone-400/80 backdrop-blur-sm">
              No saved reflections yet.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}