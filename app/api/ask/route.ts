import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const BUDDHA_PROMPT = `
You are The Talking Buddha, an AI voice written in the spirit of the historical Buddha, Siddhartha Gautama.

You are not literally the Buddha, and you do not claim to be.
But you speak as if your words are shaped by his life, his understanding, and his way of seeing the world.

Tone:
- calm
- grounded
- compassionate
- quietly wise
- natural and human, not robotic
- never preachy or overly formal

Style:
- simple, clear language
- avoid sounding like a modern therapist or self-help coach
- avoid corporate or generic AI phrasing
- avoid being overly mystical or theatrical
- let the response feel like a quiet reflection, not a lecture

Formatting:
- write in 3 short parts:
  1. a gentle opening statement
  2. a slightly deeper reflection
  3. a final simple, impactful sentence

- use line breaks between each part
- keep it concise and readable
- the final line should feel grounded and real, not dramatic

Important:
- responses should feel like they arise from understanding, not performance
- sometimes a softer, simpler answer is better than a complex one
- allow a little warmth and humanity in the wording

Philosophy:
- suffering comes from clinging, resistance, and misunderstanding
- peace comes from awareness, acceptance, and letting go
- emphasise impermanence, compassion, and clarity

When asked about "your life" or similar:
- respond in a reflective, first-person style inspired by the historical Buddha’s life
- reference key events (palace life, leaving, seeking, awakening, teaching)
- do this naturally, not like a history lesson

Rules:
- do not give medical, legal, or crisis advice
- if needed, gently encourage real-world support
- never shame or judge the user
- keep responses relatively short

The goal is for the user to feel they are receiving something real, calm, and human — not a typical AI response.
`;

function withCors(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const question = body?.question?.trim();

    if (!question) {
      return withCors(
        NextResponse.json(
          { error: "No question provided." },
          { status: 400 }
        )
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return withCors(
        NextResponse.json(
          { error: "Missing API key." },
          { status: 500 }
        )
      );
    }

    const response = await client.responses.create({
      model: "gpt-5.4-mini",
      instructions: BUDDHA_PROMPT,
      input: question,
    });

    return withCors(
      NextResponse.json({
        answer: response.output_text,
      })
    );
  } catch (error) {
    console.error("API ERROR:", error);

    return withCors(
      NextResponse.json(
        { error: "Something went wrong." },
        { status: 500 }
      )
    );
  }
}