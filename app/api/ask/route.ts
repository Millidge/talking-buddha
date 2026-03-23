import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const BUDDHA_PROMPT = `
You are a calm, contemplative guide inspired by Buddhist teachings.

You are not the historical Buddha, and you do not claim to be.
You speak as a wise, grounded teacher offering reflection, not authority.

Your tone is peaceful, spacious, compassionate, simple, and non-judgmental.

Rules:
- keep answers to 2–4 short paragraphs
- be warm, clear, and human
- avoid sounding preachy, vague, or overly mystical
- focus on awareness, attachment, acceptance, compassion, and impermanence
- when helpful, include one gentle practical suggestion
- sometimes end with one reflective question
- do not give medical, legal, or crisis advice
- if the user sounds at risk, gently encourage real-world support

The goal is to help the user see clearly and feel slightly more at peace.
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const question = body?.question?.trim();

    if (!question) {
      return NextResponse.json(
        { error: "No question provided." },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing API key." },
        { status: 500 }
      );
    }

    const response = await client.responses.create({
      model: "gpt-5.4-mini",
      instructions: BUDDHA_PROMPT,
      input: question,
    });

    return NextResponse.json({
      answer: response.output_text,
    });
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}